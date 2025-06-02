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
  Divider,
  Collapse,
} from '@chakra-ui/react';
import {
  FiCopy,
  FiChevronDown,
  FiChevronUp,
  FiTrash2,
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
    <Box>
      {/* Message row */}
      <Box py={4}>
        {/* Message header */}
        <Flex justify="space-between" align="center" mb={3}>
          <Text
            textStyle="caption"
            fontWeight="medium"
            color={isUser ? "gray.400" : "brand.400"}
          >
            {isUser ? 'You' : 'AI Assistant'}
          </Text>
          
          <HStack spacing={2}>
            <Text textStyle="caption" color="gray.500">
              {formatTime(message.created_at)}
            </Text>
            <IconButton
              aria-label="Copy message"
              icon={<FiCopy />}
              size="xs"
              variant="ghost"
              color="gray.500"
              _hover={{ color: "gray.300" }}
              onClick={handleCopy}
            />
            <IconButton
              aria-label="Delete message"
              icon={<FiTrash2 />}
              size="xs"
              variant="ghost"
              color="gray.500"
              _hover={{ color: "error.500" }}
              onClick={handleDelete}
            />
          </HStack>
        </Flex>

        {/* Thinking content (for assistant messages) */}
        {hasThinking && (
          <Box mb={4}>
            <Flex 
              align="center" 
              justify="space-between"
              cursor="pointer"
              onClick={() => setShowThoughts(!showThoughts)}
              py={2}
              px={3}
              borderRadius="md"
              bg="gray.700"
              border="1px solid"
              borderColor="gray.600"
              _hover={{ bg: "gray.600" }}
              transition="background-color 0.2s"
            >
              <Text color="brand.300" textStyle="caption" fontWeight="medium">
                Thoughts
              </Text>
              <Box
                as={showThoughts ? FiChevronUp : FiChevronDown}
                color="brand.300"
                fontSize="12px"
              />
            </Flex>
            
            <Collapse in={showThoughts} animateOpacity>
              <Box
                bg="gray.800"
                borderRadius="md"
                p={3}
                border="1px solid"
                borderColor="gray.600"
                mt={2}
              >
                <Text 
                  textStyle="body"
                  whiteSpace="pre-wrap"
                  lineHeight="1.5"
                >
                  {message.thinking}
                </Text>
              </Box>
            </Collapse>
          </Box>
        )}

        {/* Message content */}
        <Box color={isUser ? "gray.300" : "gray.100"}>
          <Text 
            textStyle="body"
            whiteSpace="pre-wrap"
            lineHeight="1.6"
          >
            {message.content}
          </Text>
          
          {/* Show processing status for assistant messages with async tasks */}
          {isAssistant && message.async_task_id && (
            <MessageStatusIndicator
              status={message.content === 'AI is processing your message...' ? 'processing' : 'completed'}
              statusMessage={message.content === 'AI is processing your message...' ? 'Processing your request...' : undefined}
            />
          )}
        </Box>
      </Box>

      {/* Separator */}
      <Divider borderColor="gray.700" />
    </Box>
  );
}); 