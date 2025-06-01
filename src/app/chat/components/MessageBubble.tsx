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
} from 'react-icons/fi';
import { ChatMessage } from '../types';
import { SimpleMarkdownRenderer } from './SimpleMarkdownRenderer';

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

  return (
    <Box>
      {/* Message row */}
      <Box py={4}>
        {/* Message header */}
        <Flex justify="space-between" align="center" mb={3}>
          <Text
            fontSize="sm"
            fontWeight="medium"
            color={isUser ? "gray.500" : "gray.300"}
          >
            {isUser ? 'You' : 'AI Assistant'}
          </Text>
          
          <HStack spacing={2}>
            <Text fontSize="xs" color="gray.500">
              {formatTime(message.created_at)}
            </Text>
            <IconButton
              aria-label="Copy message"
              icon={<FiCopy />}
              size="xs"
              variant="ghost"
              color="gray.500"
              onClick={handleCopy}
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
              <Text color="purple.300" fontSize="xs" fontWeight="medium">
                Thoughts
              </Text>
              <Box
                as={showThoughts ? FiChevronUp : FiChevronDown}
                color="purple.300"
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
                  color="gray.300" 
                  fontSize="sm" 
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
        <Box color={isUser ? "gray.400" : "white"}>
          <SimpleMarkdownRenderer
            content={message.content}
            isStreaming={isStreaming}
          />
        </Box>
      </Box>

      {/* Separator */}
      <Divider borderColor="gray.700" />
    </Box>
  );
}); 