import { useState, useEffect, useCallback, useRef } from 'react';
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
  sendMessage: (conversationId: number, message: string, onMessagesCreated?: (userMessage: unknown, aiMessage: unknown) => void) => Promise<void>;
  isProcessing: boolean;
  error: string | null;
  clearError: () => void;
  activeTasks: number[];
}

/**
 * Hook for managing async chat messages with HYBRID real-time + polling system
 * 
 * Features:
 * - Real-time subscriptions for instant updates when they work
 * - Fast polling (2s) as backup when real-time fails
 * - Immediate local state updates for smooth UX
 * - Handles error states and provides status feedback
 */
export const useAsyncChat = (conversationId?: number): UseAsyncChatReturn => {
  const [activeTasks, setActiveTasks] = useState<Set<number>>(new Set());
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const supabase = supabaseBrowser();
  
  // Track last check time for polling optimization
  const lastCheckRef = useRef<number>(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Check for pending/completed tasks
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
        console.log('🔄 Polling found completed tasks:', completedTaskIds);
        
        setActiveTasks(prev => {
          const next = new Set(prev);
          completedTaskIds.forEach(id => next.delete(id));
          return next;
        });
      }
    } catch (error) {
      console.error('Error in task polling:', error);
    }
  }, [conversationId, activeTasks, supabase]);

  // Fast polling for active tasks (2-second intervals)
  useEffect(() => {
    if (activeTasks.size > 0) {
      // Start fast polling when we have active tasks
      intervalRef.current = setInterval(() => {
        checkTasks();
      }, 2000); // Check every 2 seconds for smooth updates

      console.log('🔄 Started fast polling for', activeTasks.size, 'active tasks');
    } else {
      // Stop polling when no active tasks
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

  // Real-time subscription (primary) with polling fallback
  useEffect(() => {
    if (!conversationId) return;

    // Initial check for existing tasks
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

        if (tasks && tasks.length > 0) {
          const taskIds = tasks.map(task => task.id);
          setActiveTasks(new Set(taskIds));
          console.log('🔄 Found existing active tasks:', taskIds);
        } else {
          setActiveTasks(new Set());
        }
      } catch (error) {
        console.error('Error checking existing tasks:', error);
      }
    };

    checkExistingTasks();

    // Real-time subscription for instant updates
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
          
          // Client-side filter: only process tasks for this conversation
          const taskConversationId = task.input_data?.conversation_id;
          if (taskConversationId !== conversationId) {
            // This task is for a different conversation, ignore it - but log it for debugging
            console.log('📤 Ignoring task for different conversation:', {
              taskId: task.id,
              taskConversationId,
              currentConversationId: conversationId
            });
            return;
          }
          
          console.log('⚡ Real-time task update (filtered):', {
            taskId: task.id,
            conversationId: taskConversationId,
            status: task.status,
            eventType: payload.eventType,
            timestamp: new Date().toISOString()
          });

          // Update active tasks based on status
          if (task.status === 'pending' || task.status === 'processing') {
            setActiveTasks(prev => {
              const next = new Set(prev);
              next.add(task.id);
              console.log('➕ Added task via real-time:', task.id);
              return next;
            });
          } else {
            // Task completed/failed - remove it
            setActiveTasks(prev => {
              const next = new Set(prev);
              const wasPresent = next.has(task.id);
              next.delete(task.id);
              console.log('➖ Removed task via real-time:', { 
                taskId: task.id, 
                wasPresent, 
                status: task.status,
                message: 'Real-time subscription working! ✅'
              });
              return next;
            });
          }

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
        console.log('📡 Real-time subscription status for async_tasks:', {
          status,
          conversationId,
          timestamp: new Date().toISOString()
        });
      });

    return () => {
      supabase.removeChannel(channel);
    };
  }, [conversationId, supabase]);

  // Update overall processing state based on active tasks
  useEffect(() => {
    const newIsProcessing = activeTasks.size > 0;
    
    console.log('🔄 Processing state update:', {
      newIsProcessing,
      activeTasksCount: activeTasks.size,
      activeTasks: Array.from(activeTasks)
    });
    
    setIsProcessing(newIsProcessing);
  }, [activeTasks]);

  /**
   * Send a message and start async AI processing
   */
  const sendMessage = useCallback(async (conversationId: number, message: string, onMessagesCreated?: (userMessage: unknown, aiMessage: unknown) => void) => {
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
      
      // Track the new task immediately
      if (data.task_id) {
        setActiveTasks(prev => new Set(prev).add(data.task_id));
        console.log('📤 Message sent, tracking task:', data.task_id);
      }

      if (onMessagesCreated) {
        onMessagesCreated(data.user_message, data.ai_message);
      }

    } catch (error) {
      console.error('Error sending message:', error);
      setError(error instanceof Error ? error.message : 'Failed to send message');
      throw error;
    }
  }, []);

  /**
   * Clear the current error state
   */
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    sendMessage,
    isProcessing,
    error,
    clearError,
    activeTasks: Array.from(activeTasks)
  };
};

 