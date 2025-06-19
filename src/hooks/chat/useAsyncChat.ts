import { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { supabaseBrowser } from '@/lib/supabase/browser';

interface AsyncTask {
  id: number;
  task_type: string;
  status: 'pending' | 'processing' | 'completed' | 'failed' | 'cancelled' | 'timeout';
  current_step?: string;
  status_message?: string;
  created_at: string;
  processing_started_at?: string;
  processing_completed_at?: string;
  input_data?: {
    conversation_id: number;
  };
}

interface UseAsyncChatReturn {
  sendMessage: (conversationId: number, message: string) => Promise<void>;
  isProcessing: boolean;
  error: string | null;
  clearError: () => void;
  activeTasks: number[];
}

/**
 * Hook for managing async chat processing with real-time updates
 * 
 * Features:
 * - Tracks active async tasks for processing state
 * - Real-time subscription for task status updates
 * - Smart polling as fallback for reliability
 * - Simple message sending without optimistic updates
 */
export const useAsyncChat = (conversationId?: number): UseAsyncChatReturn => {
  const [activeTasks, setActiveTasks] = useState<Set<number>>(new Set());
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const supabase = supabaseBrowser();
  
  // Refs for performance optimization
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const processedTasksRef = useRef<Set<string>>(new Set()); // Prevent duplicate processing
  const debounceTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Memoized active tasks array to prevent unnecessary re-renders
  const activeTasksArray = useMemo(() => Array.from(activeTasks), [activeTasks]);

  // Debounced processing state update for smoother UX
  const updateProcessingState = useCallback((newActiveTasks: Set<number>) => {
    // Clear existing debounce
    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current);
    }

    // Debounce state update to batch multiple rapid changes
    debounceTimeoutRef.current = setTimeout(() => {
      const newIsProcessing = newActiveTasks.size > 0;
      
      console.log('🚀 Optimized processing state update:', {
        newIsProcessing,
        activeTasksCount: newActiveTasks.size,
        activeTasks: Array.from(newActiveTasks)
      });
      
      setIsProcessing(newIsProcessing);
    }, 16); // 16ms = ~60fps for smooth updates
  }, []);

  // Optimized task checking with caching
  const checkTasks = useCallback(async () => {
    if (!conversationId || activeTasks.size === 0) return;

    try {
      const { data: tasks, error } = await supabase
        .from('async_tasks')
        .select('id, status')
        .eq('input_data->>conversation_id', conversationId.toString())
        .in('id', Array.from(activeTasks))
        .in('status', ['completed', 'failed', 'cancelled', 'timeout']);

      if (!error && tasks && tasks.length > 0) {
        const completedTaskIds = tasks.map(t => t.id);
        
                  // Only log if we haven't already processed these tasks
          const newCompletedTasks = completedTaskIds.filter(id => !processedTasksRef.current.has(`completed_${id}`));
          if (newCompletedTasks.length > 0) {
            console.log('⚡ Found newly completed tasks:', newCompletedTasks);
            newCompletedTasks.forEach(id => processedTasksRef.current.add(`completed_${id}`));
          }
        
        setActiveTasks(prev => {
          const next = new Set(prev);
          let changed = false;
          completedTaskIds.forEach(id => {
            if (next.has(id)) {
              next.delete(id);
              changed = true;
            }
          });
          
          if (changed) {
            updateProcessingState(next);
          }
          
          return next;
        });
      }
    } catch (error) {
      console.error('Error in task polling:', error);
    }
  }, [conversationId, activeTasks, supabase, updateProcessingState]);

  // Smart polling - only when needed
  useEffect(() => {
    if (activeTasks.size > 0) {
      intervalRef.current = setInterval(checkTasks, 2000);
      console.log('⚡ Started smart polling for', activeTasks.size, 'tasks');
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
        console.log('⏹️ Stopped polling - no active tasks');
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [activeTasks.size, checkTasks]);

  // Real-time subscription with duplicate prevention
  useEffect(() => {
    if (!conversationId) return;

    // Reset processed tasks when conversation changes
    processedTasksRef.current.clear();

    const checkExistingTasks = async () => {
      try {
        const { data: tasks, error } = await supabase
          .from('async_tasks')
          .select('id, status')
          .eq('input_data->>conversation_id', conversationId.toString())
          .in('status', ['pending', 'processing']);

        if (error) {
          console.error('Error checking existing tasks:', error);
          return;
        }

        const newActiveTasks = new Set(tasks?.map(task => task.id) || []);
        
        if (newActiveTasks.size > 0) {
          console.log('⚡ Found existing active tasks:', Array.from(newActiveTasks));
        }
        
        setActiveTasks(newActiveTasks);
        updateProcessingState(newActiveTasks);
      } catch (error) {
        console.error('Error checking existing tasks:', error);
      }
    };

    checkExistingTasks();

    // Optimized real-time subscription
    const channel = supabase
      .channel(`async_tasks_conversation_${conversationId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'async_tasks'
        },
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        async (payload: any) => {
          const task = payload.new as AsyncTask;
          
          // Client-side filter
          const taskConversationId = task.input_data?.conversation_id;
          if (taskConversationId !== conversationId) {
            return;
          }
          
          // Prevent duplicate processing
          const taskKey = `${task.id}_${task.status}_${payload.eventType}`;
          if (processedTasksRef.current.has(taskKey)) {
            console.log('⚡ Skipping duplicate task processing:', { taskId: task.id, status: task.status });
            return;
          }
          processedTasksRef.current.add(taskKey);
          
          console.log('⚡ Real-time task update (optimized):', {
            taskId: task.id,
            status: task.status,
            eventType: payload.eventType
          });

          // Batch state update for smooth performance
          setActiveTasks(prev => {
            const next = new Set(prev);
            let changed = false;

            if (task.status === 'pending' || task.status === 'processing') {
              if (!next.has(task.id)) {
                next.add(task.id);
                changed = true;
                console.log('➕ Added task via real-time:', task.id);
              }
            } else {
              if (next.has(task.id)) {
                next.delete(task.id);
                changed = true;
                console.log('➖ Removed task via real-time (INSTANT!):', { 
                  taskId: task.id, 
                  status: task.status
                });
              }
            }

            if (changed) {
              updateProcessingState(next);
            }

            return next;
          });

          // Handle task failure
          if (task.status === 'failed') {
            setError(task.status_message || 'AI processing failed');
            
            try {
              const { error: updateError } = await supabase
                .from('chat_messages')
                .update({
                  content: '⚠️ Failed to process your message. Please try again.',
                  metadata: { error: task.status_message }
                })
                .eq('async_task_id', task.id);

              if (updateError) {
                console.error('Failed to update message with error:', updateError);
              }
            } catch (updateError) {
              console.error('Error updating failed message:', updateError);
            }
          }
        }
      )
      .subscribe((status) => {
        console.log('📡 Real-time subscription status (optimized):', {
          status,
          conversationId
        });
      });

    return () => {
      supabase.removeChannel(channel);
      // Clear processed tasks cache when unmounting
      processedTasksRef.current.clear();
      
      // Clear debounce timeout
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
      }
    };
  }, [conversationId, supabase, updateProcessingState]);

  /**
   * Simplified message sending - no optimistic updates
   */
  const sendMessage = useCallback(async (conversationId: number, message: string) => {
    if (!message.trim()) return;

    setError(null);
    
    try {
      const response = await fetch('/api/chat/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          conversation_id: conversationId,
          message: message.trim()
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      
      // Track the task for processing state
      if (data.task_id) {
        setActiveTasks(prev => {
          const next = new Set(prev);
          next.add(data.task_id);
          updateProcessingState(next);
          return next;
        });
        console.log('✅ Message sent, tracking task:', data.task_id);
      }

    } catch (error) {
      console.error('Error sending message:', error);
      setError(error instanceof Error ? error.message : 'Failed to send message');
      throw error;
    }
  }, [updateProcessingState]);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    sendMessage,
    isProcessing,
    error,
    clearError,
    activeTasks: activeTasksArray
  };
};

 