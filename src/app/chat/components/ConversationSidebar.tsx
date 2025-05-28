'use client';

import React from 'react';
import {
  Box,
  VStack,
  Text,
  Button,
  Input,
  IconButton,
  Card,
  CardBody,
  Flex,
  Icon,
  Spinner,
  Center,
  useToast
} from '@chakra-ui/react';
import { FiPlus, FiSearch, FiTrash2, FiMessageCircle } from 'react-icons/fi';
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
          duration: 3000,
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
          duration: 3000,
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
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);
    
    if (diffInHours < 24) {
      return date.toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit' 
      });
    } else if (diffInHours < 168) { // 7 days
      return date.toLocaleDateString('en-US', { weekday: 'short' });
    } else {
      return date.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric' 
      });
    }
  }, []);

  return (
    <Box
      w="320px"
      h="100%"
      bg="gray.800"
      borderRight="1px"
      borderColor="gray.700"
      display="flex"
      flexDirection="column"
    >
      {/* Header */}
      <Box p={4} borderBottom="1px" borderColor="gray.700">
        <Flex justify="space-between" align="center" mb={4}>
          <Text fontSize="lg" fontWeight="bold" color="white">
            Conversations
          </Text>
          <Button
            leftIcon={<FiPlus />}
            size="sm"
            colorScheme="blue"
            onClick={handleCreateConversation}
            isLoading={creating}
          >
            New
          </Button>
        </Flex>
        
        {/* Search */}
        <Flex>
          <Input
            placeholder="Search conversations..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyPress={handleKeyPress}
            bg="gray.700"
            border="none"
            size="sm"
          />
          <IconButton
            aria-label="Search"
            icon={<FiSearch />}
            onClick={handleSearch}
            ml={2}
            size="sm"
            colorScheme="blue"
          />
        </Flex>
      </Box>

      {/* Conversations List */}
      <Box flex="1" overflowY="auto">
        {loading ? (
          <Center p={4}>
            <Spinner color="blue.400" />
          </Center>
        ) : conversations.length === 0 ? (
          <Center p={6} flexDirection="column">
            <Icon as={FiMessageCircle} boxSize={12} color="gray.500" mb={4} />
            <Text color="gray.400" textAlign="center">
              No conversations yet
            </Text>
            <Text color="gray.500" fontSize="sm" textAlign="center">
              Start a new conversation to get started
            </Text>
          </Center>
        ) : (
          <VStack spacing={2} p={2} align="stretch">
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
  const handleClick = useCallback(() => {
    onSelect(conversation);
  }, [conversation, onSelect]);

  const handleDelete = useCallback((e: React.MouseEvent) => {
    onDelete(conversation.id, e);
  }, [conversation.id, onDelete]);

  return (
    <Card
      bg={isSelected ? "gray.700" : "gray.750"}
      borderColor={isSelected ? "blue.400" : "gray.600"}
      variant="outline"
      cursor="pointer"
      _hover={{ 
        borderColor: "blue.400", 
        transform: "translateY(-1px)" 
      }}
      transition="all 0.2s"
      onClick={handleClick}
    >
      <CardBody p={3}>
        <Flex justify="space-between" align="flex-start">
          <Box flex="1" mr={2}>
            <Text
              color="white"
              fontWeight="medium"
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
          <IconButton
            aria-label="Delete conversation"
            icon={<FiTrash2 />}
            size="xs"
            variant="ghost"
            colorScheme="red"
            onClick={handleDelete}
          />
        </Flex>
      </CardBody>
    </Card>
  );
}); 