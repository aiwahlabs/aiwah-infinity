'use client';

import { useState, useCallback, useRef } from 'react';
import { getChatService } from '@/lib/ai/chatService';
import { ChatMessage } from '../types';

export interface ChatStreamState {
  isStreaming: boolean;
  streamingContent: string;
  streamingThinking: string;
  error: string | null;
  isComplete: boolean;
}

export interface ChatStreamCallbacks {
  onStart?: () => void;
  onThinking?: (thinking: string) => void;
  onContent?: (content: string) => void;
  onComplete?: (content: string, thinking?: string) => void;
  onError?: (error: string) => void;
}

export interface UseChatStreamReturn {
  streamState: ChatStreamState;
  sendMessage: (
    messages: ChatMessage[],
    callbacks?: ChatStreamCallbacks
  ) => Promise<void>;
  cancelStream: () => void;
  resetStream: () => void;
}

export function useChatStream(): UseChatStreamReturn {
  const [streamState, setStreamState] = useState<ChatStreamState>({
    isStreaming: false,
    streamingContent: '',
    streamingThinking: '',
    error: null,
    isComplete: false,
  });

  const abortControllerRef = useRef<AbortController | null>(null);
  const chatService = getChatService();

  const resetStream = useCallback(() => {
    setStreamState({
      isStreaming: false,
      streamingContent: '',
      streamingThinking: '',
      error: null,
      isComplete: false,
    });
  }, []);

  const cancelStream = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
    resetStream();
  }, [resetStream]);

  const sendMessage = useCallback(async (
    messages: ChatMessage[],
    callbacks?: ChatStreamCallbacks
  ) => {
    // Cancel any existing stream
    cancelStream();

    // Create new abort controller
    abortControllerRef.current = new AbortController();

    try {
      setStreamState(prev => ({
        ...prev,
        isStreaming: true,
        error: null,
        isComplete: false,
      }));

      callbacks?.onStart?.();

      let fullContent = '';
      let fullThinking = '';

      // Use streaming response
      for await (const chunk of chatService.generateStreamingResponse(messages)) {
        // Check if stream was cancelled
        if (abortControllerRef.current?.signal.aborted) {
          return;
        }

        if (chunk.error) {
          throw new Error(chunk.error);
        }

        fullContent = chunk.content;
        fullThinking = chunk.thinking || '';

        // Update state
        setStreamState(prev => ({
          ...prev,
          streamingContent: fullContent,
          streamingThinking: fullThinking,
        }));

        // Call callbacks
        if (chunk.thinking) {
          callbacks?.onThinking?.(chunk.thinking);
        }
        callbacks?.onContent?.(fullContent);

        if (chunk.isComplete) {
          setStreamState(prev => ({
            ...prev,
            isComplete: true,
            isStreaming: false,
          }));

          callbacks?.onComplete?.(fullContent, fullThinking);
          break;
        }
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      
      setStreamState(prev => ({
        ...prev,
        error: errorMessage,
        isStreaming: false,
        isComplete: false,
      }));

      callbacks?.onError?.(errorMessage);
    } finally {
      abortControllerRef.current = null;
    }
  }, [chatService, cancelStream]);

  return {
    streamState,
    sendMessage,
    cancelStream,
    resetStream,
  };
} 