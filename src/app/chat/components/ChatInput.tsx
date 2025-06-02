'use client';

import React, { useRef, useCallback, useEffect } from 'react';
import {
  Box,
  Flex,
  Textarea,
  IconButton,
} from '@chakra-ui/react';
import {
  FiSend,
  FiStopCircle,
} from 'react-icons/fi';

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

  const canSend = value.trim() && !disabled && !isStreaming && value.length <= maxLength;

  return (
    <Flex align="flex-end" gap={3} bg="gray.700" p={4} borderRadius="md" border="1px solid" borderColor="gray.600">
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
          bg="gray.800"
          border="1px solid"
          borderColor="gray.600"
          color="gray.100"
          textStyle="body"
          lineHeight="1.6"
          borderRadius="md"
          _placeholder={{ color: 'gray.400' }}
          _focus={{
            outline: 'none',
            boxShadow: 'none',
            borderColor: 'brand.400',
          }}
          _hover={{
            borderColor: 'gray.500',
          }}
          disabled={disabled}
        />
      </Box>

      {/* Send/Stop button */}
      {isStreaming ? (
        <IconButton
          aria-label="Stop"
          icon={<FiStopCircle />}
          bg="error.500"
          color="white"
          variant="solid"
          size="sm"
          onClick={onCancel}
          _hover={{ bg: "error.600" }}
        />
      ) : (
        <IconButton
          aria-label="Send"
          icon={<FiSend />}
          bg="brand.500"
          color="white"
          variant="solid"
          size="sm"
          onClick={onSend}
          disabled={!canSend}
          _hover={{ bg: "brand.600" }}
          _disabled={{ 
            bg: "gray.600", 
            color: "gray.400",
            cursor: "not-allowed"
          }}
        />
      )}
    </Flex>
  );
}); 