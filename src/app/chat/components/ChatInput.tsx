'use client';

import React, { useState, useRef, useCallback, useEffect } from 'react';
import {
  Box,
  Flex,
  Textarea,
  IconButton,
  HStack,
  VStack,
  Text,
  Tooltip,
  useToast,
  Kbd,
  Badge,
} from '@chakra-ui/react';
import {
  FiSend,
  FiStopCircle,
} from 'react-icons/fi';
import { Button, Card } from './ui';
import { designTokens } from '../design/tokens';

interface ChatInputProps {
  value: string;
  onChange: (value: string) => void;
  onSend: () => void;
  onCancel?: () => void;
  disabled?: boolean;
  isStreaming?: boolean;
  placeholder?: string;
  maxLength?: number;
}

export const ChatInput = React.memo(function ChatInput({
  value,
  onChange,
  onSend,
  onCancel,
  disabled = false,
  isStreaming = false,
  placeholder = "Type your message...",
  maxLength = 4000,
}: ChatInputProps) {
  const [isFocused, setIsFocused] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const toast = useToast();

  // Auto-resize textarea
  const adjustTextareaHeight = useCallback(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      const newHeight = Math.min(textarea.scrollHeight, 200); // Max height of 200px
      textarea.style.height = `${newHeight}px`;
    }
  }, []);

  useEffect(() => {
    adjustTextareaHeight();
  }, [value, adjustTextareaHeight]);

  // Handle keyboard shortcuts
  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      if (e.shiftKey) {
        // Allow new line
        return;
      } else if (e.metaKey || e.ctrlKey) {
        // Cmd/Ctrl + Enter to send
        e.preventDefault();
        if (value.trim() && !disabled && !isStreaming) {
          onSend();
        }
      } else {
        // Regular Enter to send
        e.preventDefault();
        if (value.trim() && !disabled && !isStreaming) {
          onSend();
        }
      }
    }

    if (e.key === 'Escape' && isStreaming && onCancel) {
      onCancel();
    }
  }, [value, disabled, isStreaming, onSend, onCancel]);

  const characterCount = value.length;
  const isNearLimit = characterCount > maxLength * 0.8;
  const isOverLimit = characterCount > maxLength;
  const canSend = value.trim() && !disabled && !isStreaming && !isOverLimit;

  return (
    <Card
      variant="elevated"
      padding="none"
      bg="gray.700"
      borderColor={isFocused ? 'teal.400' : 'gray.600'}
      transition="all 0.2s cubic-bezier(0.4, 0, 0.2, 1)"
      boxShadow={isFocused ? designTokens.shadows.glow : designTokens.shadows.lg}
      _hover={{
        borderColor: isFocused ? 'teal.400' : 'gray.600',
      }}
    >
      <VStack spacing={0} align="stretch">
        {/* Main input area */}
        <Flex p={4} align="flex-end" gap={3}>
          {/* Text input */}
          <Box flex="1" position="relative">
            <Textarea
              ref={textareaRef}
              value={value}
              onChange={(e) => onChange(e.target.value)}
              onKeyDown={handleKeyDown}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              placeholder={placeholder}
              resize="none"
              minH="40px"
              maxH="200px"
              bg="transparent"
              border="none"
              color="white"
              fontSize="sm"
              lineHeight="1.5"
              _placeholder={{ color: 'gray.400' }}
              _focus={{
                outline: 'none',
                boxShadow: 'none',
              }}
              disabled={disabled}
              sx={{
                '&::-webkit-scrollbar': {
                  width: '4px',
                },
                '&::-webkit-scrollbar-track': {
                  background: 'transparent',
                },
                '&::-webkit-scrollbar-thumb': {
                  background: 'gray.600',
                  borderRadius: '2px',
                },
              }}
            />
          </Box>

          {/* Send/Stop button */}
          {isStreaming ? (
            <Button
              variant="danger"
              size="sm"
              leftIcon={<FiStopCircle />}
              onClick={onCancel}
            >
              Stop
            </Button>
          ) : (
            <Button
              variant="primary"
              size="sm"
              leftIcon={<FiSend />}
              onClick={onSend}
              disabled={!canSend}
              loading={disabled}
            >
              Send
            </Button>
          )}
        </Flex>

        {/* Footer with character count and shortcuts */}
        <Flex
          px={4}
          py={2}
          justify="space-between"
          align="center"
          borderTop="1px solid"
          borderColor="gray.600"
          bg="gray.700"
        >
          <HStack spacing={4} fontSize="xs" color="gray.400">
            <HStack spacing={1}>
              <Kbd fontSize="xs" bg="gray.600" color="white">
                {typeof navigator !== 'undefined' && navigator.platform.includes('Mac') ? '⌘' : 'Ctrl'}
              </Kbd>
              <Text>+</Text>
              <Kbd fontSize="xs" bg="gray.600" color="white">
                Enter
              </Kbd>
              <Text>to send</Text>
            </HStack>
            
            <HStack spacing={1}>
              <Kbd fontSize="xs" bg="gray.600" color="white">
                Shift
              </Kbd>
              <Text>+</Text>
              <Kbd fontSize="xs" bg="gray.600" color="white">
                Enter
              </Kbd>
              <Text>for new line</Text>
            </HStack>
          </HStack>

          <HStack spacing={2}>
            {isStreaming && (
              <Badge colorScheme="teal" variant="subtle" fontSize="xs">
                AI is typing...
              </Badge>
            )}
            
            <Text
              fontSize="xs"
              color={isOverLimit ? 'red.400' : isNearLimit ? 'yellow.400' : 'gray.400'}
            >
              {characterCount}/{maxLength}
            </Text>
          </HStack>
        </Flex>
      </VStack>
    </Card>
  );
}); 