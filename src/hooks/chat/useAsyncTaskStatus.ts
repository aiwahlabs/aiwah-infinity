import { useState, useEffect } from 'react';
import { supabaseBrowser } from '@/lib/supabase/browser';
import type { Database } from '@/lib/database.types';

type AsyncTask = Database['public']['Tables']['async_tasks']['Row'];

interface UseAsyncTaskStatusReturn {
  task: AsyncTask | null;
  loading: boolean;
  error: string | null;
}

/**
 * Hook to fetch and subscribe to the status of a specific async task
 */
export const useAsyncTaskStatus = (taskId?: number | string): UseAsyncTaskStatusReturn => {
  const [task, setTask] = useState<AsyncTask | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const supabase = supabaseBrowser();

  useEffect(() => {
    // Don't fetch if no taskId or if it's a temporary string ID
    if (!taskId || typeof taskId === 'string') {
      setTask(null);
      setLoading(false);
      setError(null);
      return;
    }

    // Fetch initial task status
    const fetchTask = async () => {
      try {
        setLoading(true);
        setError(null);

        const { data, error: fetchError } = await supabase
          .from('async_tasks')
          .select('*')
          .eq('id', taskId)
          .single();

        if (fetchError) {
          throw fetchError;
        }

        setTask(data as AsyncTask);
      } catch (err) {
        console.error('Error fetching task:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch task');
      } finally {
        setLoading(false);
      }
    };

    fetchTask();

    // Subscribe to real-time updates for this specific task
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
          console.log('Task status update received:', updatedTask);
          setTask(updatedTask);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [taskId, supabase]);

  return {
    task,
    loading,
    error
  };
};

/**
 * Get a human-readable status display for a task
 */
export const getTaskStatusDisplay = (task?: AsyncTask | null): string => {
  if (!task) return '';

  // For completed tasks, don't show the status message (which is often outdated)
  // Just show completion status or nothing
  if (task.status === 'completed') {
    return ''; // Don't show any status for completed tasks
  }

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
  if (task.status === 'pending') {
    return '🔄 Getting ready to process your message...';
  } else if (task.status === 'processing') {
    return '🧠 Thinking about your request...';
  } else if (task.status === 'failed') {
    return '❌ Failed to process';
  } else if (task.status === 'timeout') {
    return '⏰ Request timed out';
  } else if (task.status === 'cancelled') {
    return '⚠️ Cancelled';
  } else {
    return task.status;
  }
}; 