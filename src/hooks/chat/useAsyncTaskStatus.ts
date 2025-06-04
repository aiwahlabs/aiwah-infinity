import { useState, useEffect } from 'react';
import { supabaseBrowser } from '@/lib/supabase/browser';
import { logger } from '@/lib/logger';

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

interface UseAsyncTaskStatusReturn {
  task: AsyncTask | null;
  loading: boolean;
  error: string | null;
}

/**
 * Hook to fetch and subscribe to the status of a specific async task
 */
export const useAsyncTaskStatus = (taskId?: number): UseAsyncTaskStatusReturn => {
  logger.hook('useAsyncTaskStatus', 'Hook called', { taskId });
  
  const [task, setTask] = useState<AsyncTask | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const supabase = supabaseBrowser();
  
  logger.hook('useAsyncTaskStatus', 'State initialized', { 
    taskId, 
    hasTask: !!task, 
    loading, 
    error 
  });

  useEffect(() => {
    logger.hook('useAsyncTaskStatus', 'useEffect triggered', { taskId });
    
    if (!taskId) {
      logger.hook('useAsyncTaskStatus', 'No taskId, clearing state', { taskId });
      setTask(null);
      setLoading(false);
      setError(null);
      return;
    }

    logger.hook('useAsyncTaskStatus', 'Starting task fetch', { taskId });

    // Fetch initial task status
    const fetchTask = async () => {
      try {
        logger.hook('useAsyncTaskStatus', 'Setting loading to true', { taskId });
        setLoading(true);
        setError(null);

        logger.hook('useAsyncTaskStatus', 'Querying async_tasks table', { taskId });
        const { data, error: fetchError } = await supabase
          .from('async_tasks')
          .select('*')
          .eq('id', taskId)
          .single();

        if (fetchError) {
          logger.error('useAsyncTaskStatus', 'Fetch error from Supabase', { taskId, fetchError });
          throw fetchError;
        }

        logger.hook('useAsyncTaskStatus', 'Task data received', { taskId, data });
        setTask(data as AsyncTask);
      } catch (err) {
        logger.error('useAsyncTaskStatus', 'Error fetching task', { taskId, err });
        console.error('Error fetching task:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch task');
      } finally {
        logger.hook('useAsyncTaskStatus', 'Setting loading to false', { taskId });
        setLoading(false);
      }
    };

    fetchTask();

    // Subscribe to real-time updates for this specific task
    logger.hook('useAsyncTaskStatus', 'Setting up realtime subscription', { taskId });
    const channel = supabase
      .channel(`async_task_${taskId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'async_tasks',
          filter: `id=eq.${taskId}`
        },
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (payload: any) => {
          const updatedTask = payload.new as AsyncTask;
          logger.hook('useAsyncTaskStatus', 'Realtime update received', { taskId, updatedTask });
          console.log('Task status update received:', updatedTask);
          setTask(updatedTask);
        }
      )
      .subscribe();

    logger.hook('useAsyncTaskStatus', 'Realtime subscription created', { taskId, channelName: `async_task_${taskId}` });

    return () => {
      logger.hook('useAsyncTaskStatus', 'Cleaning up realtime subscription', { taskId });
      supabase.removeChannel(channel);
    };
  }, [taskId, supabase]);

  const result = {
    task,
    loading,
    error
  };
  
  logger.hook('useAsyncTaskStatus', 'Returning result', { taskId, result });
  
  return result;
};

/**
 * Get a human-readable status display for a task
 */
export const getTaskStatusDisplay = (task?: AsyncTask | null): string => {
  if (!task) return '';

  // Use the status_message from the task if available (from n8n workflow)
  if (task.status_message) {
    return task.status_message;
  }

  // Fallback status messages based on current_step and status
  if (task.status === 'processing' && task.current_step) {
    switch (task.current_step) {
      case 'initializing':
        return '🔄 Starting to process your chat message...';
      case 'preparing_request':
        return '📝 Preparing your conversation for the AI model...';
      case 'calling_ai':
        return '🧠 Sending your message to OpenAI GPT-4. This usually takes 10-30 seconds...';
      case 'processing_response':
        return '⚡ AI responded! Now formatting and saving the response...';
      case 'saving_response':
        return '💾 Saving AI response to your chat...';
      default:
        return '⏳ Processing your message...';
    }
  }

  // General status fallbacks
  switch (task.status) {
    case 'pending':
      return 'Task created, waiting to start...';
    case 'processing':
      return '⏳ Processing your message...';
    case 'completed':
      return '✅ Complete';
    case 'failed':
      return '❌ Failed to process';
    case 'timeout':
      return '⏰ Request timed out';
    case 'cancelled':
      return '⚠️ Cancelled';
    default:
      return task.status;
  }
}; 