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
  Spinner,
  Center,
  useToast,
  HStack,
  Badge,
  Tooltip,
  InputGroup,
  InputLeftElement,
  Fade,
  ScaleFade,
} from '@chakra-ui/react';
import { FiPlus, FiSearch, FiTrash2, FiMessageCircle, FiEdit3 } from 'react-icons/fi';
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
    loading,
    createConversation,
    deleteConversation,
    updateFilter,
    filter
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
    } catch (error) {
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
          <Text fontSize="lg" fontWeight="semibold" color="white">
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
            bg="gray.700"
            border="none"
            _focus={{ 
              borderColor: 'teal.400',
              boxShadow: '0 0 0 1px var(--chakra-colors-teal-400)'
            }}
            color="white"
            _placeholder={{ color: 'gray.400' }}
          />
        </InputGroup>
      </Box>

      {/* Conversations List */}
      <Box flex="1" overflowY="auto" px={4}>
        {loading ? (
          <Center py={8}>
            <Spinner color="teal.400" size="md" />
          </Center>
        ) : conversations.length === 0 ? (
          <Center py={8}>
            <VStack spacing={3} textAlign="center">
              <Text color="gray.400" fontSize="sm">
                No conversations yet
              </Text>
              <Text color="gray.400" fontSize="xs">
                Start a new conversation to begin
              </Text>
            </VStack>
          </Center>
        ) : (
          <VStack spacing={1} align="stretch">
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
      bg={isSelected ? "gray.700" : "transparent"}
      borderRadius="md"
      cursor="pointer"
      p={3}
      _hover={{ bg: isSelected ? "gray.700" : "gray.700" }}
      onClick={handleClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Flex justify="space-between" align="flex-start">
        <Box flex="1" mr={2} minW={0}>
          <Text
            color={isSelected ? "white" : "white"}
            fontWeight={isSelected ? "medium" : "normal"}
            fontSize="sm"
            noOfLines={1}
            mb={1}
          >
            {conversation.title || 'Untitled Conversation'}
          </Text>
          <Text color="gray.400" fontSize="xs">
            {formatDate(conversation.updated_at)}
          </Text>
        </Box>
        
        {/* Action buttons */}
        {isHovered && (
          <IconButton
            aria-label="Delete conversation"
            icon={<FiTrash2 />}
            size="xs"
            variant="ghost"
            color="gray.400"
            _hover={{ color: 'red.400' }}
            onClick={handleDelete}
          />
        )}
      </Flex>
    </Box>
  );
}); 