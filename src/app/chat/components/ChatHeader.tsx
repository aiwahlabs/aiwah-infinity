'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  Box,
  Text,
  Flex,
  Input,
  useToast,
  Container,
} from '@chakra-ui/react';
import { ChatConversation } from '../types';

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
        textStyle="body"
        fontWeight="500"
        color="gray.100"
        bg="gray.800"
        border="1px solid"
        borderColor="gray.600"
        _focus={{ 
          borderColor: "brand.400",
          boxShadow: "0 0 0 1px var(--chakra-colors-brand-400)"
        }}
        _hover={{
          borderColor: "gray.500"
        }}
        px={3}
        py={2}
        borderRadius="md"
        flex="1"
        maxW="400px"
      />
    );
  }

  return (
    <Text
      textStyle="body"
      fontWeight="500"
      color="gray.100"
      py={2}
      px={3}
      borderRadius="md"
      _hover={{ 
        bg: "gray.800",
        color: "gray.50"
      }}
      cursor="pointer"
      display="inline-block"
      maxW="400px"
      noOfLines={1}
      onClick={() => setIsEditing(true)}
      transition="all 0.2s"
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
      bg="gray.850"
      borderBottom="1px solid"
      borderColor="gray.800"
      py={4}
      flexShrink={0}
    >
      <Container maxW="4xl">
        <Flex align="center" justify="space-between">
          <EditableTitle
            value={conversation.title || 'Untitled Conversation'}
            onSave={handleUpdateTitle}
          />
          <Text textStyle="caption" color="gray.500">
            AI Assistant
          </Text>
        </Flex>
      </Container>
    </Box>
  );
}); 