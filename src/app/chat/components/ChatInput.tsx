'use client';

import React, { useRef, useCallback, useEffect } from 'react';
import {
  Box,
  Flex,
  Textarea,
} from '@chakra-ui/react';

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
}: ChatInputProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

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



  return (
    <Box
      bg="gray.800"
      borderRadius="xl"
      border="1px solid"
      borderColor="gray.700"
      p={4}
      _focusWithin={{
        borderColor: "brand.400",
        boxShadow: "0 0 0 1px var(--chakra-colors-brand-400)"
      }}
      transition="all 0.2s"
    >
      <Flex align="flex-end" gap={3}>
        {/* Text input */}
        <Box flex="1">
          <Textarea
            ref={textareaRef}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            resize="none"
            minH="40px"
            maxH="200px"
            bg="transparent"
            border="none"
            color="gray.100"
            textStyle="body"
            lineHeight="1.6"
            _placeholder={{ color: 'gray.400' }}
            _focus={{
              outline: 'none',
              boxShadow: 'none',
            }}
            disabled={disabled}
          />
        </Box>
      </Flex>
    </Box>
  );
}); 