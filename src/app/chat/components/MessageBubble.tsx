'use client';

import React, { useState, useCallback } from 'react';
import {
  Box,
  Flex,
  Text,
  IconButton,
  HStack,
  VStack,
  Tooltip,
  useClipboard,
  useToast,
  Collapse,
  Badge,
} from '@chakra-ui/react';
import {
  FiCopy,
  FiEye,
  FiEyeOff,
} from 'react-icons/fi';
import { ChatMessage } from '../types';
import { ThinkingBubble } from './ThinkingBubble';
import { MarkdownRenderer } from './MarkdownRenderer';
import { Avatar, Card } from './ui';
import { designTokens } from '../design/tokens';

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
  const [isHovered, setIsHovered] = useState(false);
  const [showThinking, setShowThinking] = useState(false);
  const { onCopy, hasCopied } = useClipboard(message.content);
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
    <Box
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      transition="all 0.2s cubic-bezier(0.4, 0, 0.2, 1)"
      opacity={isStreaming ? 0.8 : 1}
    >
      <Flex
        justify={isUser ? 'flex-end' : 'flex-start'}
        align="flex-start"
        gap={3}
        direction={isUser ? 'row-reverse' : 'row'}
        maxW="85%"
        ml={isUser ? 'auto' : 0}
        mr={isUser ? 0 : 'auto'}
      >
        {/* Avatar */}
        <Avatar
          size="sm"
          name={isUser ? 'You' : 'AI Assistant'}
          isBot={isAssistant}
          variant={isAssistant ? 'glow' : 'default'}
          showStatus={isAssistant}
          status="online"
        />

        {/* Message content */}
        <VStack spacing={2} align={isUser ? 'flex-end' : 'flex-start'} flex="1" minW={0}>
          {/* Thinking bubble (for assistant messages) */}
          {hasThinking && (
            <Box w="full">
              <Flex align="center" gap={2} mb={2}>
                <IconButton
                  aria-label={showThinking ? 'Hide thinking' : 'Show thinking'}
                  icon={showThinking ? <FiEyeOff /> : <FiEye />}
                  size="xs"
                  variant="ghost"
                  color="gray.400"
                  _hover={{ color: 'gray.200' }}
                  onClick={() => setShowThinking(!showThinking)}
                />
                <Text fontSize="xs" color="gray.400">
                  AI Reasoning
                </Text>
                <Badge size="sm" colorScheme="purple" variant="subtle">
                  Thinking
                </Badge>
              </Flex>
              
              <Collapse in={showThinking} animateOpacity>
                <Box mb={3}>
                  <ThinkingBubble
                    thinking={message.thinking!}
                    timestamp={formatTime(message.created_at)}
                    isStreaming={false}
                  />
                </Box>
              </Collapse>
            </Box>
          )}

          {/* Main message card */}
          <Card
            variant={isUser ? 'gradient' : 'elevated'}
            padding="md"
            bg={isUser ? 'teal.600' : 'gray.700'}
            borderColor={isUser ? 'gray.600' : 'gray.600'}
            position="relative"
            w="full"
            hover={isHovered}
            _before={isUser ? {
              content: '""',
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              borderRadius: 'inherit',
              background: 'linear-gradient(135deg, rgba(20, 184, 166, 0.1), rgba(45, 212, 191, 0.1))',
              zIndex: -1,
            } : undefined}
          >
            {/* Message content */}
            <Box mb={3}>
              <MarkdownRenderer
                content={message.content}
                isStreaming={isStreaming}
              />
            </Box>

            {/* Message footer */}
            <Flex
              justify="space-between"
              align="center"
              opacity={isHovered ? 1 : 0.7}
              transition="opacity 0.2s"
            >
              <Text
                fontSize="xs"
                color={isUser ? 'white' : 'gray.400'}
                fontWeight="medium"
              >
                {formatTime(message.created_at)}
              </Text>

              {/* Action buttons */}
              <HStack spacing={1} opacity={isHovered ? 1 : 0}>
                <Tooltip label={hasCopied ? 'Copied!' : 'Copy message'}>
                  <IconButton
                    aria-label="Copy message"
                    icon={<FiCopy />}
                    size="xs"
                    variant="ghost"
                    color="gray.400"
                    _hover={{ color: 'white', bg: 'gray.600' }}
                    onClick={handleCopy}
                  />
                </Tooltip>
              </HStack>
            </Flex>
          </Card>
        </VStack>
      </Flex>
    </Box>
  );
}); 