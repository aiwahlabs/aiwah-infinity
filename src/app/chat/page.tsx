'use client';

import React, { useState, useEffect } from 'react';
import {
  Box,
  Flex,
  Spinner,
  Center,
  VStack,
  Text,
  Fade,
  ScaleFade,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  Button,
} from '@chakra-ui/react';
import { ChatInterface } from './components/ChatInterface';
import { ConversationSidebar } from './components/ConversationSidebar';
import { useChatContext } from '@/hooks/chat/useChatContext';
import { useAuth } from '@saas-ui/auth';

// Main chat page component
export default function ChatPage() {
  const { currentConversation, loading, error, setCurrentConversation, loadConversations } = useChatContext();
  const { user, isAuthenticated } = useAuth();
  const [sidebarWidth, setSidebarWidth] = useState(320);
  const [isInitialized, setIsInitialized] = useState(false);

  // Initialize after a short delay to prevent flash
  useEffect(() => {
    const timer = setTimeout(() => setIsInitialized(true), 100);
    return () => clearTimeout(timer);
  }, []);

  // Show error state if there's an authentication or loading error
  if (error) {
    return (
      <Center h="100%">
        <VStack spacing={4} maxW="md" textAlign="center">
          <Text color="red.400" fontSize="lg" fontWeight="medium">
            Connection Error
          </Text>
          <Text color="red.300" fontSize="sm">
            {error}
          </Text>
          <Button
            colorScheme="teal"
            onClick={() => {
              console.log('Retrying connection...');
              loadConversations();
            }}
          >
            Retry Connection
          </Button>
        </VStack>
      </Center>
    );
  }

  // Show loading state with smooth animation
  if (loading || !isInitialized) {
    return (
      <Center h="100%">
        <VStack spacing={4}>
          <Spinner 
            size="lg" 
            color="teal.500"
          />
          <Text color="gray.300" fontSize="md">
            Loading chat interface...
          </Text>
        </VStack>
      </Center>
    );
  }

  return (
    <Flex h="100%" bg="gray.800">
      {/* Sidebar */}
      <Box
        w={`${sidebarWidth}px`}
        minW={`${sidebarWidth}px`}
        h="100%"
        borderRight="1px solid"
        borderColor="gray.700"
        bg="gray.800"
        flexShrink={0}
      >
        <ConversationSidebar 
          onSelectConversation={(conversation) => {
            setCurrentConversation(conversation);
          }}
        />
      </Box>

      {/* Resize handle */}
      <Box
        w="2px"
        bg="gray.600"
        cursor="col-resize"
        _hover={{ 
          bg: 'teal.500',
          boxShadow: '0 0 10px rgba(20, 184, 166, 0.3)'
        }}
        transition="all 0.2s ease"
        onMouseDown={(e) => {
          const startX = e.clientX;
          const startWidth = sidebarWidth;

          const handleMouseMove = (e: MouseEvent) => {
            const newWidth = Math.max(280, Math.min(500, startWidth + (e.clientX - startX)));
            setSidebarWidth(newWidth);
          };

          const handleMouseUp = () => {
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
            document.body.style.cursor = '';
            document.body.style.userSelect = '';
          };

          document.body.style.cursor = 'col-resize';
          document.body.style.userSelect = 'none';
          document.addEventListener('mousemove', handleMouseMove);
          document.addEventListener('mouseup', handleMouseUp);
        }}
      />

      {/* Main chat area */}
      <Box flex="1" h="100%" minW={0}>
        <ChatInterface conversation={currentConversation} />
      </Box>
    </Flex>
  );
} 