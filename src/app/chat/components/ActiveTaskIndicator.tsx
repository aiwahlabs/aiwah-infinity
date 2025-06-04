'use client';

import React from 'react';
import { Box, Flex, Text, HStack } from '@chakra-ui/react';
import { MessageStatusIndicator } from './AsyncProcessingIndicator';
import { useAsyncTaskStatus, getTaskStatusDisplay } from '@/hooks/chat/useAsyncTaskStatus';
import { logger } from '@/lib/logger';

interface ActiveTaskIndicatorProps {
  taskId: number;
  conversationId?: number;
}

/**
 * Shows the status of an active async task in the chat interface
 * Used when no placeholder message exists for the task
 */
export const ActiveTaskIndicator = React.memo(function ActiveTaskIndicator({
  taskId,
  conversationId
}: ActiveTaskIndicatorProps) {
  logger.render('ActiveTaskIndicator', { taskId, conversationId });
  
  const { task, loading } = useAsyncTaskStatus(taskId);

  // Don't show if task is completed (AI response message should exist)
  if (task && task.status === 'completed') {
    logger.chat('ActiveTaskIndicator', 'Task completed, hiding indicator', { taskId });
    return null;
  }

  // Don't show if task failed (user should see error separately)
  if (task && (task.status === 'failed' || task.status === 'cancelled' || task.status === 'timeout')) {
    logger.chat('ActiveTaskIndicator', 'Task failed/cancelled, hiding indicator', { taskId, status: task.status });
    return null;
  }

  const statusMessage = getTaskStatusDisplay(task);

  return (
    <Box py={4}>
      <Flex justify="flex-start" align="center" mb={4}>
        <HStack spacing={3}>
          <Text 
            fontSize="xs" 
            fontWeight="500" 
            color="brand.400"
            textTransform="uppercase"
            letterSpacing="wider"
          >
            AI Assistant
          </Text>
          <Text fontSize="xs" color="gray.500">
            Processing...
          </Text>
        </HStack>
      </Flex>

      <Box>
        <Box
          p={4}
          borderRadius="lg"
          bg="gray.850"
          border="1px solid"
          borderColor="gray.700"
          position="relative"
        >
          <MessageStatusIndicator
            status={loading ? 'processing' : (task?.status || 'pending')}
            statusMessage={loading ? 'Loading status...' : statusMessage}
          />
        </Box>
      </Box>
    </Box>
  );
}); 