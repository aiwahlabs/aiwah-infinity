'use client';

import React, { useState } from 'react';
import {
  Box,
  Flex,
  VStack,
  Text,
  Button,
} from '@chakra-ui/react';
import { ChatInterface } from './components/ChatInterface';
import { ConversationSidebar } from './components/ConversationSidebar';
import { useChatContext } from '@/hooks/chat/useChatContext';
import { AuthGuard } from '@/components/AuthGuard';

// Main chat page component
export default function ChatPage() {
  const { currentConversation, error, setCurrentConversation, loadConversations } = useChatContext();
  const [sidebarWidth, setSidebarWidth] = useState(320);

  return (
    <AuthGuard>
      <Box h="100%" overflow="hidden">
        {/* Show error state if there's an authentication or loading error */}
        {error ? (
          <VStack spacing={4} h="100%" justify="center" align="center" p={8}>
            <Text color="red.400" textStyle="section-heading" fontWeight="medium">
              Connection Error
            </Text>
            <Text color="red.300" textStyle="body" textAlign="center" maxW="md">
              {error}
            </Text>
            <Button
              colorScheme="brand"
              onClick={() => {
                console.log('Retrying connection...');
                loadConversations();
              }}
            >
              Retry Connection
            </Button>
          </VStack>
        ) : (
          <Flex h="100%">
            {/* Sidebar */}
            <Box
              w={`${sidebarWidth}px`}
              minW={`${sidebarWidth}px`}
              h="100%"
              borderRight="1px solid"
              borderColor="gray.700"
              bg="gray.800"
              flexShrink={0}
              overflow="hidden"
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
                bg: 'brand.500',
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
            <Box flex="1" h="100%" minW={0} bg="gray.900" overflow="hidden">
              <ChatInterface conversation={currentConversation} />
            </Box>
          </Flex>
        )}
      </Box>
    </AuthGuard>
  );
} 