'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  Box,
  Text,
  Flex,
  Input,
  useToast,
} from '@chakra-ui/react';
import { ChatConversation } from '../types';
import { ModelSelector } from './ModelSelector';

interface ChatHeaderProps {
  conversation: ChatConversation;
  onUpdateTitle: (newTitle: string) => Promise<void>;
}

// Custom editable title component
function EditableTitle({ 
  value, 
  onSave 
}: { 
  value: string; 
  onSave: (newValue: string) => void; 
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(value);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setEditValue(value);
  }, [value]);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  const handleSave = useCallback(() => {
    if (editValue.trim() && editValue !== value) {
      onSave(editValue.trim());
    }
    setIsEditing(false);
  }, [editValue, value, onSave]);

  const handleCancel = useCallback(() => {
    setEditValue(value);
    setIsEditing(false);
  }, [value]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSave();
    } else if (e.key === 'Escape') {
      e.preventDefault();
      handleCancel();
    }
  }, [handleSave, handleCancel]);

  if (isEditing) {
    return (
      <Input
        ref={inputRef}
        value={editValue}
        onChange={(e) => setEditValue(e.target.value)}
        onKeyDown={handleKeyDown}
        onBlur={handleSave}
        fontSize="14px"
        lineHeight="1.4"
        fontWeight="medium"
        color="white"
        bg="transparent"
        border="none"
        _focus={{ 
          outline: "none",
          boxShadow: "none"
        }}
        _hover={{
          bg: "transparent"
        }}
        px={2}
        py={1}
        borderRadius="md"
        flex="1"
        minH="auto"
        h="auto"
      />
    );
  }

  return (
    <Text
      fontSize="14px"
      lineHeight="1.4"
      fontWeight="medium"
      color="white"
      py={1}
      px={2}
      borderRadius="md"
      _hover={{ 
        bg: "gray.700",
        color: "gray.100"
      }}
      cursor="pointer"
      display="inline-block"
      maxW="fit-content"
      onClick={() => setIsEditing(true)}
    >
      {value || 'Untitled Conversation'}
    </Text>
  );
}

export const ChatHeader = React.memo(function ChatHeader({
  conversation,
  onUpdateTitle
}: ChatHeaderProps) {
  const toast = useToast();

  const handleUpdateTitle = useCallback(async (newTitle: string) => {
    try {
      await onUpdateTitle(newTitle);
      toast({
        title: 'Conversation renamed',
        status: 'success',
        duration: 2000,
        isClosable: true,
      });
    } catch {
      toast({
        title: 'Failed to rename conversation',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  }, [onUpdateTitle, toast]);

  return (
    <Box
      p={4}
      borderBottom="1px"
      borderColor="gray.600"
      bg="gray.800"
    >
      <Flex align="center" justify="space-between">
        <Box flex="1">
          <EditableTitle
            value={conversation.title || 'Untitled Conversation'}
            onSave={handleUpdateTitle}
          />
        </Box>
        <ModelSelector />
      </Flex>
    </Box>
  );
}); 