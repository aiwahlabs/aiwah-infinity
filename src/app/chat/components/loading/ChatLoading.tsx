'use client';

import { Box, Flex } from '@chakra-ui/react';
import { ChatSkeleton, SidebarSkeleton } from '@/components/ui/skeletons';

// Chat Interface Loading
export function ChatInterfaceLoading() {
  return <ChatSkeleton />;
}

// Conversation Sidebar Loading  
export function ConversationSidebarLoading() {
  return <SidebarSkeleton />;
}

// Full Chat Page Loading (sidebar + chat interface)
export function ChatPageLoading() {
  return (
    <Flex h="100%">
      {/* Sidebar Loading */}
      <Box
        w="320px"
        minW="320px"
        h="100%"
        borderRight="1px solid"
        borderColor="gray.700"
        bg="gray.800"
      >
        <ConversationSidebarLoading />
      </Box>

      {/* Resize handle placeholder */}
      <Box w="2px" bg="gray.600" />

      {/* Chat area loading */}
      <Box flex="1" h="100%" bg="gray.800">
        <ChatInterfaceLoading />
      </Box>
    </Flex>
  );
}

// Message Streaming Loading (for when AI is typing)
export function MessageStreamingLoading() {
  return (
    <Box p={4}>
      <Flex justify="flex-start">
        <Box
          maxW="70%"
          p={3}
          bg="gray.700"
          borderRadius="lg"
        >
          <Box w="12px" h="12px" bg="gray.400" borderRadius="full" 
               animation="pulse 1.5s ease-in-out infinite" />
        </Box>
      </Flex>
    </Box>
  );
} 