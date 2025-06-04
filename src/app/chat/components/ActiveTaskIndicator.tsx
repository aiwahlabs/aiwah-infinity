'use client';

import React from 'react';
import {
  Box,
  Flex,
  Text,
  HStack,
  Badge,
  IconButton,
} from '@chakra-ui/react';
import { FiCopy, FiTrash2 } from 'react-icons/fi';
import { MessageStatusIndicator } from './AsyncProcessingIndicator';
import { useAsyncTaskStatus, getTaskStatusDisplay } from '@/hooks/chat/useAsyncTaskStatus';
import { logger } from '@/lib/logger';

interface LoadingMessageBubbleProps {
  taskId: number;
  conversationId?: number;
  formatTime: (dateStr: string) => string;
}

/**
 * Shows a loading message bubble that looks like a real message
 * Displays the status of an active async task
 */
export const LoadingMessageBubble = React.memo(function LoadingMessageBubble({
  taskId,
  conversationId,
  formatTime
}: LoadingMessageBubbleProps) {
  logger.render('LoadingMessageBubble', { taskId, conversationId });
  
  const { task, loading } = useAsyncTaskStatus(taskId);

  // Don't show if task is completed (AI response message should exist)
  if (task && task.status === 'completed') {
    logger.chat('LoadingMessageBubble', 'Task completed, hiding indicator', { taskId });
    return null;
  }

  // Don't show if task failed (user should see error separately)
  if (task && (task.status === 'failed' || task.status === 'cancelled' || task.status === 'timeout')) {
    logger.chat('LoadingMessageBubble', 'Task failed/cancelled, hiding indicator', { taskId, status: task.status });
    return null;
  }

  const statusMessage = getTaskStatusDisplay(task);
  const currentTime = new Date().toISOString();

  logger.chat('LoadingMessageBubble', 'Rendering loading bubble', {
    taskId,
    taskStatus: task?.status,
    statusMessage,
    loading
  });

  return (
    <Box py={6}>
      {/* Message header - styled like AI Assistant */}
      <Flex justify="space-between" align="center" mb={4}>
        <HStack spacing={3}>
          <Badge
            variant="outline"
            colorScheme="brand"
            fontSize="xs"
            fontWeight="500"
            px={2}
            py={1}
          >
            AI Assistant
          </Badge>
          
          <Text textStyle="caption" color="gray.500">
            {formatTime(currentTime)}
          </Text>
        </HStack>
        
        {/* Action buttons (disabled for loading state) */}
        <HStack spacing={1}>
          <IconButton
            aria-label="Copy message"
            icon={<FiCopy />}
            size="sm"
            variant="ghost"
            color="gray.500"
            isDisabled
            opacity={0.3}
          />
          <IconButton
            aria-label="Delete message"
            icon={<FiTrash2 />}
            size="sm"
            variant="ghost"
            color="gray.500"
            isDisabled
            opacity={0.3}
          />
        </HStack>
      </Flex>

      {/* Message content - styled like assistant message */}
      <Box>
        <Box
          p={4}
          borderRadius="lg"
          bg="gray.850"
          border="1px solid"
          borderColor="gray.700"
          position="relative"
        >
          {/* Status indicator inside the message bubble */}
          <MessageStatusIndicator
            status={loading ? 'processing' : (task?.status || 'pending')}
            statusMessage={loading ? 'Loading status...' : statusMessage}
          />
        </Box>
      </Box>
    </Box>
  );
});

// Keep the old name for backward compatibility, but it's now the LoadingMessageBubble
export const ActiveTaskIndicator = LoadingMessageBubble; 