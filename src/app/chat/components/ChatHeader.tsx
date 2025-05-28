'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  Box,
  Text,
  Flex,
  Input,
  IconButton,
  ButtonGroup,
  useToast,
} from '@chakra-ui/react';
import { FiCheck, FiX } from 'react-icons/fi';
import { ChatConversation } from '../types';
import { ModelSelector } from './ModelSelector';
import { getChatService } from '@/lib/ai/chatService';

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
      <Flex align="center">
        <Input
          ref={inputRef}
          value={editValue}
          onChange={(e) => setEditValue(e.target.value)}
          onKeyDown={handleKeyDown}
          onBlur={handleSave}
          fontSize="md"
          fontWeight="medium"
          color="white"
          bg="gray.700"
          border="1px solid"
          borderColor="gray.600"
          _focus={{ 
            borderColor: "teal.400", 
            outline: "none"
          }}
          px={2}
          py={1}
          borderRadius="md"
          minW="200px"
        />
        <ButtonGroup size="sm" spacing={1} ml={2}>
          <IconButton
            aria-label="Save"
            icon={<FiCheck />}
            onClick={handleSave}
            colorScheme="green"
            variant="ghost"
            size="sm"
          />
          <IconButton
            aria-label="Cancel"
            icon={<FiX />}
            onClick={handleCancel}
            colorScheme="red"
            variant="ghost"
            size="sm"
          />
        </ButtonGroup>
      </Flex>
    );
  }

  return (
    <Text
      fontSize="md"
      fontWeight="medium"
      color="white"
      py={1}
      px={2}
      borderRadius="md"
      _hover={{ bg: "gray.700" }}
      cursor="pointer"
      minW="200px"
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
  const chatService = getChatService();

  const handleUpdateTitle = useCallback(async (newTitle: string) => {
    try {
      await onUpdateTitle(newTitle);
      toast({
        title: 'Conversation renamed',
        status: 'success',
        duration: 2000,
        isClosable: true,
      });
    } catch (error) {
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