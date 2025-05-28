'use client';

import { useState, useEffect } from 'react';
import { Box, Flex } from '@chakra-ui/react';
import { useAuth } from '@saas-ui/auth';
import { useRouter } from 'next/navigation';
import { useChatContext } from '@/hooks/chat';
import { ChatConversation } from './types';
import { ConversationSidebar } from './components/ConversationSidebar';
import { ChatInterface } from './components/ChatInterface';
import { LoadingScreen } from '@/components/LoadingScreen';

export default function ChatPage() {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const { setCurrentConversation, currentConversation } = useChatContext();
  const [selectedConversation, setSelectedConversation] = useState<ChatConversation | null>(null);

  useEffect(() => {
    // Only redirect if not loading and not authenticated
    if (!isLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isLoading, isAuthenticated, router]);

  const handleSelectConversation = (conversation: ChatConversation) => {
    setSelectedConversation(conversation);
    setCurrentConversation(conversation);
  };

  // Show loading screen while checking authentication status
  if (isLoading) {
    return <LoadingScreen />;
  }

  // If not loading and not authenticated, router.push in useEffect will handle it.
  // Return null or a minimal component to prevent rendering the main content.
  if (!isAuthenticated) {
    return null; 
  }

  return (
    <Flex h="100%" overflow="hidden">
      <ConversationSidebar onSelectConversation={handleSelectConversation} />
      <ChatInterface conversation={selectedConversation || currentConversation} />
    </Flex>
  );
} 