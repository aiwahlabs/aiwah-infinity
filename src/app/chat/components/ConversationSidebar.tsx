'use client';

import React from 'react';
import {
  Box,
  VStack,
  Text,
  Button,
  Input,
  IconButton,
  Flex,
  Icon,
  Center,
  useToast,
  InputGroup,
  InputLeftElement,
} from '@chakra-ui/react';
import { FiPlus, FiSearch, FiTrash2 } from 'react-icons/fi';
import { useState, useCallback } from 'react';
import { useChatContext } from '@/hooks/chat';
import { ChatConversation } from '../types';


interface ConversationSidebarProps {
  onSelectConversation: (conversation: ChatConversation) => void;
}

export const ConversationSidebar = React.memo(function ConversationSidebar({ onSelectConversation }: ConversationSidebarProps) {
  const {
    conversations,
    currentConversation,
    createConversation,
    deleteConversation,
    updateFilter
  } = useChatContext();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [creating, setCreating] = useState(false);
  const toast = useToast();

  const handleCreateConversation = useCallback(async () => {
    setCreating(true);
    try {
      const newConversation = await createConversation({
        title: 'New Conversation'
      });
      if (newConversation) {
        onSelectConversation(newConversation);
        toast({
          title: 'Conversation created',
          status: 'success',
          duration: 2000,
          isClosable: true,
        });
      }
    } catch {
      toast({
        title: 'Failed to create conversation',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setCreating(false);
    }
  }, [createConversation, onSelectConversation, toast]);

  const handleDeleteConversation = useCallback(async (id: number, e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm('Are you sure you want to delete this conversation?')) {
      const success = await deleteConversation(id);
      if (success) {
        toast({
          title: 'Conversation deleted',
          status: 'info',
          duration: 2000,
          isClosable: true,
        });
      }
    }
  }, [deleteConversation, toast]);

  const handleSearch = useCallback(() => {
    updateFilter({ search: searchQuery, offset: 0 });
  }, [searchQuery, updateFilter]);

  const handleKeyPress = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  }, [handleSearch]);

  const formatDate = useCallback((dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diffInMinutes = (now.getTime() - date.getTime()) / (1000 * 60);
    const diffInHours = diffInMinutes / 60;
    const diffInDays = diffInHours / 24;
    
    if (diffInMinutes < 1) {
      return 'Just now';
    } else if (diffInMinutes < 60) {
      return `${Math.floor(diffInMinutes)}m ago`;
    } else if (diffInHours < 24) {
      return `${Math.floor(diffInHours)}h ago`;
    } else if (diffInDays < 7) {
      return `${Math.floor(diffInDays)}d ago`;
    } else {
      return date.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric' 
      });
    }
  }, []);

  return (
    <Box
      h="100%"
      bg="gray.800"
      display="flex"
      flexDirection="column"
    >
      {/* Header */}
      <Box p={4}>
        <Flex justify="space-between" align="center" mb={4}>
          <Text textStyle="section-heading" fontWeight="semibold">
            Conversations
          </Text>
          <Button
            leftIcon={<FiPlus />}
            size="sm"
            colorScheme="teal"
            onClick={handleCreateConversation}
            isLoading={creating}
          >
            New
          </Button>
        </Flex>
        
        {/* Search */}
        <InputGroup size="sm">
          <InputLeftElement pointerEvents="none">
            <Icon as={FiSearch} color="gray.400" />
          </InputLeftElement>
          <Input
            placeholder="Search conversations..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyPress={handleKeyPress}
            bg="gray.800"
            border="1px solid"
            borderColor="gray.600"
            color="white"
            _placeholder={{ color: 'gray.400' }}
          />
        </InputGroup>
      </Box>

      {/* Conversations List */}
      <Box flex="1" overflowY="auto" px={4} pb={4}>
        {conversations.length === 0 ? (
          <Center py={8}>
            <VStack spacing={3} textAlign="center">
              <Text textStyle="body">
                No conversations yet
              </Text>
              <Text textStyle="caption">
                Start a new conversation to begin
              </Text>
            </VStack>
          </Center>
        ) : (
          <VStack spacing={0} align="stretch" pt={2}>
            {conversations.map((conversation: ChatConversation) => (
              <ConversationCard
                key={conversation.id}
                conversation={conversation}
                isSelected={currentConversation?.id === conversation.id}
                onSelect={onSelectConversation}
                onDelete={handleDeleteConversation}
                formatDate={formatDate}
              />
            ))}
          </VStack>
        )}
      </Box>
    </Box>
  );
});

// Separate memoized component for conversation cards
const ConversationCard = React.memo(function ConversationCard({
  conversation,
  isSelected,
  onSelect,
  onDelete,
  formatDate
}: {
  conversation: ChatConversation;
  isSelected: boolean;
  onSelect: (conversation: ChatConversation) => void;
  onDelete: (id: number, e: React.MouseEvent) => void;
  formatDate: (dateStr: string) => string;
}) {
  const [isHovered, setIsHovered] = useState(false);

  const handleClick = useCallback(() => {
    onSelect(conversation);
  }, [conversation, onSelect]);

  const handleDelete = useCallback((e: React.MouseEvent) => {
    onDelete(conversation.id, e);
  }, [conversation.id, onDelete]);

  return (
    <Box
      bg={isSelected ? "gray.700" : "gray.800"}
      borderRadius="lg"
      border="1px solid"
      borderColor={isSelected ? "teal.400" : "gray.700"}
      borderWidth="1px"
      cursor="pointer"
      p={4}
      onClick={handleClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      transition="all 0.2s ease-in-out"
      boxShadow={isSelected ? "md" : "sm"}
      _hover={{
        transform: isSelected ? "none" : "translateY(-2px)",
        borderColor: isSelected ? "teal.400" : "teal.400",
        boxShadow: isSelected ? "md" : "lg"
      }}
      mb={3}
      overflow="hidden"
    >
      <Flex justify="space-between" align="flex-start">
        <Box flex="1" mr={2} minW={0}>
          <Text
            color="white"
            fontWeight={isSelected ? "semibold" : "medium"}
            textStyle="card-title"
            noOfLines={1}
            mb={1}
          >
            {conversation.title || 'Untitled Conversation'}
          </Text>
          <Text textStyle="caption">
            {formatDate(conversation.updated_at)}
          </Text>
        </Box>
        
        {/* Action buttons */}
        {(isHovered || isSelected) && (
          <IconButton
            aria-label="Delete conversation"
            icon={<FiTrash2 />}
            size="xs"
            variant="ghost"
            color="gray.400"
            _hover={{ 
              color: "red.400",
              bg: "red.900"
            }}
            onClick={handleDelete}
          />
        )}
      </Flex>
    </Box>
  );
}); 