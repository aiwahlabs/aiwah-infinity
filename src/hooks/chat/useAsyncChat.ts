import { useState, useEffect, useCallback } from 'react';
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
}

interface UseAsyncChatReturn {
  sendMessage: (conversationId: number, message: string, onMessagesCreated?: (userMessage: unknown, aiMessage: unknown) => void) => Promise<void>;
  isProcessing: boolean;
  error: string | null;
  clearError: () => void;
  activeTasks: number[];
}

/**
 * Hook for managing async chat messages with real-time status updates
 * 
 * Features:
 * - Sends user messages and creates async AI processing tasks
 * - Subscribes to real-time task status updates via Supabase Realtime
 * - Updates AI message content when task completes
 * - Handles error states and provides status feedback
 */
export const useAsyncChat = (conversationId?: number): UseAsyncChatReturn => {
  const [activeTasks, setActiveTasks] = useState<Set<number>>(new Set());
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const supabase = supabaseBrowser();

  // Check for existing pending/processing tasks on mount and subscribe to updates
  useEffect(() => {
    if (!conversationId) return;

    // Check for existing pending/processing tasks
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
          setIsProcessing(true);
        } else {
          // No active tasks, clear processing state
          setActiveTasks(new Set());
          setIsProcessing(false);
        }
      } catch (error) {
        console.error('Error checking existing tasks:', error);
      }
    };

    checkExistingTasks();

    const channel = supabase
      .channel(`async_tasks_conversation_${conversationId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'async_tasks',
          filter: `input_data->>conversation_id=eq.${conversationId}`
        },
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        async (payload: any) => {
          const task = payload.new as AsyncTask;
          
          console.log('Task update received:', {
            taskId: task.id,
            status: task.status,
            currentActiveTasks: Array.from(activeTasks)
          });

          // Update processing state
          if (task.status === 'pending' || task.status === 'processing') {
            setActiveTasks(prev => {
              const next = new Set(prev);
              next.add(task.id);
              console.log('Added task to activeTasks:', { taskId: task.id, newActiveTasks: Array.from(next) });
              return next;
            });
            setIsProcessing(true);
          } else {
            // Task is completed, failed, cancelled, or timeout - remove it
            setActiveTasks(prev => {
              const next = new Set(prev);
              const wasPresent = next.has(task.id);
              next.delete(task.id);
              console.log('Removed task from activeTasks:', { 
                taskId: task.id, 
                wasPresent, 
                taskStatus: task.status,
                newActiveTasks: Array.from(next) 
              });
              return next;
            });
          }

          // Handle task completion
          if (task.status === 'completed') {
            try {
              // Refresh messages to get the updated AI response
              // This will be handled by the existing chat message hooks
              console.log('Task completed, AI response should be updated');
            } catch (error) {
              console.error('Error handling task completion:', error);
            }
          }

          // Handle task failure
          if (task.status === 'failed') {
            setError(task.status_message || 'AI processing failed');
            
            // You might want to update the AI message to show an error state
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
      .subscribe();

    // Failsafe: Periodically check for completed tasks that might have been missed
    const cleanupInterval = setInterval(async () => {
      if (activeTasks.size > 0) {
        try {
          const { data: completedTasks, error } = await supabase
            .from('async_tasks')
            .select('id, status')
            .in('id', Array.from(activeTasks))
            .in('status', ['completed', 'failed', 'cancelled', 'timeout']);

          if (!error && completedTasks && completedTasks.length > 0) {
            const completedTaskIds = completedTasks.map(t => t.id);
            console.log('Cleanup: Found completed tasks to remove:', completedTaskIds);
            
            setActiveTasks(prev => {
              const next = new Set(prev);
              completedTaskIds.forEach(id => next.delete(id));
              return next;
            });
          }
        } catch (error) {
          console.error('Error in task cleanup:', error);
        }
      }
    }, 10000); // Check every 10 seconds

    return () => {
      supabase.removeChannel(channel);
      clearInterval(cleanupInterval);
    };
  }, [conversationId, supabase, activeTasks]);

  // Update overall processing state based on active tasks
  useEffect(() => {
    const newIsProcessing = activeTasks.size > 0;
    
    console.log('Processing state update:', {
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
      
      // Track the new task
      if (data.task_id) {
        setActiveTasks(prev => new Set(prev).add(data.task_id));
        setIsProcessing(true);
      }

      console.log('Message sent, task created:', data);

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

 