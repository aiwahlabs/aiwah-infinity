'use client';

import React from 'react';
import {
  Box,
  Text,
  Spinner,
  Icon,
  HStack,
} from '@chakra-ui/react';
import { FiClock, FiAlertCircle } from 'react-icons/fi';

interface AsyncProcessingIndicatorProps {
  isProcessing: boolean;
  statusMessage?: string;
  error?: string | null;
}

export const AsyncProcessingIndicator = React.memo(function AsyncProcessingIndicator({
  isProcessing,
  statusMessage,
  error
}: AsyncProcessingIndicatorProps) {
  // Don't show anything if not processing and no error
  if (!isProcessing && !error) {
    return null;
  }

  // Error state
  if (error) {
    return (
      <Box py={6}>
        <Box
          p={4}
          bg="red.950"
          borderRadius="lg"
          border="1px solid"
          borderColor="red.800"
        >
          <HStack spacing={3}>
            <Icon as={FiAlertCircle} color="red.400" boxSize={5} />
            <Box>
              <Text color="red.300" textStyle="body" fontWeight="500">
                Processing Failed
              </Text>
              <Text color="red.400" textStyle="caption" mt={1}>
                {error}
              </Text>
            </Box>
          </HStack>
        </Box>
      </Box>
    );
  }

  // Processing state
  return (
    <Box py={6}>
      <Box
        p={4}
        bg="gray.850"
        borderRadius="lg"
        border="1px solid"
        borderColor="gray.700"
      >
        <HStack spacing={3}>
          <Spinner size="md" color="brand.400" thickness="3px" />
          <Box>
            <HStack spacing={2} mb={1}>
              <Icon as={FiClock} color="brand.400" boxSize={4} />
              <Text color="gray.200" textStyle="body" fontWeight="500">
                AI is thinking...
              </Text>
            </HStack>
            {statusMessage && (
              <Text color="gray.400" textStyle="caption">
                {statusMessage}
              </Text>
            )}
          </Box>
        </HStack>
      </Box>
    </Box>
  );
});

/**
 * Simple status indicator for message bubbles
 */
interface MessageStatusIndicatorProps {
  status?: 'pending' | 'processing' | 'completed' | 'failed' | 'cancelled' | 'timeout';
  statusMessage?: string;
}

export const MessageStatusIndicator = React.memo(function MessageStatusIndicator({
  status,
  statusMessage
}: MessageStatusIndicatorProps) {
  if (!status || status === 'completed') {
    return null;
  }

  const getStatusIcon = () => {
    switch (status) {
      case 'pending':
      case 'processing':
        return <Spinner size="sm" color="brand.400" thickness="2px" />;
      case 'failed':
        return <Icon as={FiAlertCircle} color="red.400" boxSize={4} />;
      case 'cancelled':
      case 'timeout':
        return <Icon as={FiAlertCircle} color="orange.400" boxSize={4} />;
      default:
        return <Icon as={FiClock} color="gray.400" boxSize={4} />;
    }
  };

  const getStatusColor = () => {
    switch (status) {
      case 'pending':
      case 'processing':
        return 'brand.400';
      case 'failed':
        return 'red.400';
      case 'cancelled':
      case 'timeout':
        return 'orange.400';
      default:
        return 'gray.400';
    }
  };

  const getStatusText = () => {
    if (statusMessage) return statusMessage;
    
    switch (status) {
      case 'pending':
        return 'Waiting to start...';
      case 'processing':
        return 'Processing...';
      case 'failed':
        return 'Failed to process';
      case 'cancelled':
        return 'Cancelled';
      case 'timeout':
        return 'Request timed out';
      default:
        return status;
    }
  };

  return (
    <HStack spacing={2} opacity={0.8}>
      {getStatusIcon()}
      <Text 
        color={getStatusColor()} 
        textStyle="caption" 
        fontStyle="italic"
      >
        {getStatusText()}
      </Text>
    </HStack>
  );
}); 