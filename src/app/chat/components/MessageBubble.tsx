'use client';

import React, { useMemo } from 'react';
import {
  Box,
  Flex,
  Text,
  HStack,
  Badge,
  IconButton,
  VStack,
  useToast,
} from '@chakra-ui/react';
import { FiCopy, FiTrash2 } from 'react-icons/fi';
import { SimpleMarkdownRenderer } from './SimpleMarkdownRenderer';
import { MessageStatusIndicator } from './AsyncProcessingIndicator';
import { useAsyncTaskStatus, getTaskStatusDisplay } from '@/hooks/chat/useAsyncTaskStatus';
import { useChatContext } from '@/hooks/chat/useChatContext';
import { ChatMessage } from '../types';

interface MessageBubbleProps {
  message: ChatMessage;
  isStreaming?: boolean;
  formatTime: (dateStr: string) => string;
}

/**
 * Optimized MessageBubble with React.memo for better performance
 * Only re-renders when message content, streaming state, or formatTime changes
 */
export const MessageBubble = React.memo<MessageBubbleProps>(function MessageBubble({
  message,
  isStreaming = false,
  formatTime
}) {
  const { deleteMessage } = useChatContext();
  const toast = useToast();
  
  // Memoize computed values to prevent recalculation
  const isUser = useMemo(() => message.role === 'user', [message.role]);
  const isAssistant = useMemo(() => message.role === 'assistant', [message.role]);
  const hasContent = useMemo(() => !!message.content?.trim(), [message.content]);
  const formattedTime = useMemo(() => formatTime(message.created_at), [formatTime, message.created_at]);
  
  // Get real-time task status for assistant messages with async tasks
  const { task, loading: taskLoading } = useAsyncTaskStatus(
    isAssistant && message.async_task_id ? message.async_task_id : undefined
  );
  
  // Get live status message from n8n workflow
  const liveStatusMessage = useMemo(() => {
    if (!task) return '';
    return getTaskStatusDisplay(task);
  }, [task]);
  
  // Memoize styles to prevent recalculation
  const bubbleStyles = useMemo(() => ({
    bg: isUser ? 'gray.700' : 'gray.800',
    color: isUser ? 'gray.100' : 'gray.100',
    borderRadius: 'lg',
    px: 4,
    py: 3,
    maxWidth: '85%',
    wordBreak: 'break-word' as const,
    position: 'relative' as const,
    border: '1px solid',
    borderColor: isUser ? 'gray.600' : 'gray.700',
    // Smooth transition for color changes
    transition: 'all 0.2s ease-in-out',
    // Subtle highlight for user messages
    ...(isUser && {
      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.3)',
    }),
  }), [isUser]);

  const containerStyles = useMemo(() => ({
    width: '100%',
    justifyContent: isUser ? 'flex-end' : 'flex-start',
    mb: 3
  }), [isUser]);

  // Copy to clipboard functionality
  const handleCopy = React.useCallback(async () => {
    if (message.content) {
      try {
        await navigator.clipboard.writeText(message.content);
        // Could add a toast notification here
      } catch (error) {
        console.error('Failed to copy message:', error);
      }
    }
  }, [message.content]);

  // Delete message functionality
  const handleDelete = React.useCallback(async () => {
    try {
      await deleteMessage(message.id);
      toast({
        title: 'Message deleted',
        status: 'info',
        duration: 2000,
        isClosable: true,
      });
    } catch (error) {
      console.error('Failed to delete message:', error);
      toast({
        title: 'Failed to delete message',
        description: 'Please try again',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  }, [deleteMessage, message.id, toast]);

  // Only show status indicator for assistant messages that are processing
  const showStatusIndicator = useMemo(() => 
    isAssistant && (!hasContent || isStreaming) && message.async_task_id, 
    [isAssistant, hasContent, isStreaming, message.async_task_id]
  );
  
  // Determine the status and message to show
  const statusToShow = useMemo(() => {
    if (taskLoading) return 'processing';
    if (task?.status) return task.status;
    return isStreaming ? 'processing' : 'pending';
  }, [taskLoading, task?.status, isStreaming]);
  
  const statusMessageToShow = useMemo(() => {
    if (liveStatusMessage) return liveStatusMessage;
    return isStreaming ? 'AI is thinking...' : 'Preparing response...';
  }, [liveStatusMessage, isStreaming]);

  // Don't render bubble if there's no content and no status to show
  const shouldRender = useMemo(() => {
    return hasContent || showStatusIndicator || isStreaming;
  }, [hasContent, showStatusIndicator, isStreaming]);

  if (!shouldRender) {
    return null;
  }

  return (
    <Flex {...containerStyles}>
      <VStack align={isUser ? 'flex-end' : 'flex-start'} spacing={1} maxWidth="85%">
        {/* Message Bubble */}
        <Box {...bubbleStyles}>
          {hasContent ? (
            <SimpleMarkdownRenderer content={message.content} />
          ) : (
            <MessageStatusIndicator 
              status={statusToShow}
              statusMessage={statusMessageToShow}
            />
          )}
        </Box>

        {/* Message Metadata */}
        <HStack spacing={2} opacity={0.7} fontSize="xs">
          <Text color="gray.400">{formattedTime}</Text>
          
          {/* Action Buttons - Only show on hover for cleaner UI */}
          {hasContent && (
            <HStack spacing={1} className="message-actions" opacity={0.7}>
              <IconButton
                aria-label="Copy message"
                icon={<FiCopy />}
                size="xs"
                variant="ghost"
                color={isUser ? 'gray.300' : 'gray.400'}
                onClick={handleCopy}
                _hover={{ opacity: 1, color: isUser ? 'gray.100' : 'gray.200' }}
              />
              <IconButton
                aria-label="Delete message"
                icon={<FiTrash2 />}
                size="xs"
                variant="ghost"
                color={isUser ? 'gray.300' : 'gray.400'}
                onClick={handleDelete}
                _hover={{ opacity: 1, color: 'red.400' }}
              />
            </HStack>
          )}

          {/* Thinking badge for AI messages */}
          {message.thinking && (
            <Badge size="sm" colorScheme="purple" variant="outline">
              Thinking
            </Badge>
          )}
        </HStack>
      </VStack>
    </Flex>
  );
}, (prevProps, nextProps) => {
  // Custom comparison function for memo optimization
  return (
    prevProps.message.id === nextProps.message.id &&
    prevProps.message.content === nextProps.message.content &&
    prevProps.message.async_task_id === nextProps.message.async_task_id &&
    prevProps.message.created_at === nextProps.message.created_at &&
    prevProps.isStreaming === nextProps.isStreaming &&
    prevProps.formatTime === nextProps.formatTime
  );
}); 