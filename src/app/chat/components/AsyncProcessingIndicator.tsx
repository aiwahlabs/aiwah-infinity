'use client';

import React from 'react';
import {
  Box,
  Text,
  Flex,
  Spinner,
  Icon,
  Divider,
} from '@chakra-ui/react';
import { FiClock, FiCheckCircle, FiAlertCircle } from 'react-icons/fi';

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
      <Box>
        <Box py={4}>
          <Flex align="center" p={3} bg="gray.700" borderRadius="md" border="1px solid" borderColor="error.600">
            <Icon as={FiAlertCircle} color="error.500" mr={3} />
            <Text color="error.500" textStyle="body">
              {error}
            </Text>
          </Flex>
        </Box>
        <Divider borderColor="gray.700" />
      </Box>
    );
  }

  // Processing state
  return (
    <Box>
      <Box py={4}>
        <Flex align="center" p={3} bg="gray.700" borderRadius="md" border="1px solid" borderColor="gray.600">
          <Spinner size="sm" color="brand.400" mr={3} />
          <Box flex="1">
            <Flex align="center">
              <Icon as={FiClock} color="brand.400" mr={2} />
              <Text color="gray.100" textStyle="body" fontWeight="medium">
                AI is processing your message
              </Text>
            </Flex>
            {statusMessage && (
              <Text color="gray.300" textStyle="caption" mt={1} opacity={0.8}>
                {statusMessage}
              </Text>
            )}
          </Box>
        </Flex>
      </Box>
      <Divider borderColor="gray.700" />
    </Box>
  );
});

/**
 * Simple status indicator for message bubbles
 */
interface MessageStatusIndicatorProps {
  status?: 'pending' | 'processing' | 'completed' | 'failed';
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
        return <Spinner size="xs" color="brand.400" />;
      case 'failed':
        return <Icon as={FiAlertCircle} color="error.500" />;
      default:
        return <Icon as={FiClock} color="gray.400" />;
    }
  };

  const getStatusColor = () => {
    switch (status) {
      case 'pending':
      case 'processing':
        return 'brand.400';
      case 'failed':
        return 'error.500';
      default:
        return 'gray.400';
    }
  };

  return (
    <Flex align="center" mt={2} opacity={0.7}>
      {getStatusIcon()}
      <Text 
        color={getStatusColor()} 
        textStyle="caption" 
        ml={2}
        fontStyle="italic"
      >
        {statusMessage || status}
      </Text>
    </Flex>
  );
}); 