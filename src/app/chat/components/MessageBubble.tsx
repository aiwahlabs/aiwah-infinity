'use client';

import React, { useState, useCallback } from 'react';
import {
  Box,
  Flex,
  Text,
  IconButton,
  HStack,
  useClipboard,
  useToast,
  Collapse,
  Badge,
} from '@chakra-ui/react';
import {
  FiCopy,
  FiChevronDown,
  FiChevronUp,
  FiTrash2,
  FiZap,
} from 'react-icons/fi';
import { ChatMessage } from '../types';
import { MessageStatusIndicator } from './AsyncProcessingIndicator';
import { useChatContext } from '@/hooks/chat/useChatContext';

interface MessageBubbleProps {
  message: ChatMessage;
  formatTime: (dateStr: string) => string;
  isStreaming?: boolean;
}

export const MessageBubble = React.memo(function MessageBubble({
  message,
  formatTime,
  isStreaming = false,
}: MessageBubbleProps) {
  const [showThoughts, setShowThoughts] = useState(false);
  const { onCopy } = useClipboard(message.content);
  const { deleteMessage } = useChatContext();
  const toast = useToast();

  const isUser = message.role === 'user';
  const isAssistant = message.role === 'assistant';
  const hasThinking = isAssistant && message.thinking;

  const handleCopy = useCallback(() => {
    onCopy();
    toast({
      title: 'Message copied',
      status: 'success',
      duration: 2000,
      isClosable: true,
    });
  }, [onCopy, toast]);

  const handleDelete = useCallback(async () => {
    const success = await deleteMessage(message.id);
    if (success) {
      toast({
        title: 'Message deleted',
        status: 'success',
        duration: 2000,
        isClosable: true,
      });
    } else {
      toast({
        title: 'Failed to delete message',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  }, [deleteMessage, message.id, toast]);

  return (
    <Box py={6}>
      {/* Message header */}
      <Flex justify="space-between" align="center" mb={4}>
        <HStack spacing={3}>
          <Badge
            variant="outline"
            colorScheme={isUser ? "gray" : "brand"}
            fontSize="xs"
            fontWeight="500"
            px={2}
            py={1}
          >
            {isUser ? 'You' : 'AI Assistant'}
          </Badge>
          
          <Text textStyle="caption" color="gray.500">
            {formatTime(message.created_at)}
          </Text>
        </HStack>
        
        <HStack spacing={1}>
          <IconButton
            aria-label="Copy message"
            icon={<FiCopy />}
            size="sm"
            variant="ghost"
            color="gray.500"
            _hover={{ color: "gray.300", bg: "gray.800" }}
            onClick={handleCopy}
          />
          <IconButton
            aria-label="Delete message"
            icon={<FiTrash2 />}
            size="sm"
            variant="ghost"
            color="gray.500"
            _hover={{ color: "red.400", bg: "gray.800" }}
            onClick={handleDelete}
          />
        </HStack>
      </Flex>

      {/* Thinking content (for assistant messages) */}
      {hasThinking && (
        <Box mb={4}>
          <Box
            cursor="pointer"
            onClick={() => setShowThoughts(!showThoughts)}
            p={3}
            borderRadius="lg"
            bg="gray.850"
            border="1px solid"
            borderColor="gray.700"
            _hover={{ bg: "gray.800", borderColor: "gray.600" }}
            transition="all 0.2s"
          >
            <Flex align="center" justify="space-between">
              <HStack spacing={2}>
                <Box as={FiZap} color="brand.400" boxSize={4} />
                <Text color="brand.300" textStyle="caption" fontWeight="500">
                  AI Thoughts
                </Text>
              </HStack>
              <Box
                as={showThoughts ? FiChevronUp : FiChevronDown}
                color="brand.400"
                boxSize={4}
              />
            </Flex>
          </Box>
          
          <Collapse in={showThoughts} animateOpacity>
            <Box
              bg="gray.850"
              borderRadius="lg"
              p={4}
              mt={2}
              border="1px solid"
              borderColor="gray.700"
            >
              <Text 
                textStyle="body"
                color="gray.300"
                whiteSpace="pre-wrap"
                lineHeight="1.6"
                fontSize="sm"
              >
                {message.thinking}
              </Text>
            </Box>
          </Collapse>
        </Box>
      )}

      {/* Message content */}
      <Box>
        <Box
          p={4}
          borderRadius="lg"
          bg={isUser ? "gray.800" : "gray.850"}
          border="1px solid"
          borderColor={isUser ? "gray.700" : "gray.700"}
          position="relative"
        >
          <Text 
            textStyle="body"
            color={isUser ? "gray.200" : "gray.100"}
            whiteSpace="pre-wrap"
            lineHeight="1.7"
          >
            {message.content}
          </Text>
          
          {/* Show processing status for assistant messages with async tasks */}
          {isAssistant && message.async_task_id && (
            <Box mt={3}>
              <MessageStatusIndicator
                status={message.content === 'AI is processing your message...' ? 'processing' : 'completed'}
                statusMessage={message.content === 'AI is processing your message...' ? 'Processing your request...' : undefined}
              />
            </Box>
          )}
        </Box>
      </Box>
    </Box>
  );
}); 