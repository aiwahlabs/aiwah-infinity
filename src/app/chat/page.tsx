'use client';

import { useState, useEffect } from 'react';
import { Box, Flex } from '@chakra-ui/react';
import { useAuth } from '@saas-ui/auth';
import { useRouter } from 'next/navigation';
import { useChatContext } from '@/hooks/chat';
import { ChatConversation } from './types';
import { ConversationSidebar } from './components/ConversationSidebar';
import { ChatInterface } from './components/ChatInterface';

export default function ChatPage() {
  const { isAuthenticated } = useAuth();
  const router = useRouter();
  const { setCurrentConversation, currentConversation } = useChatContext();
  const [selectedConversation, setSelectedConversation] = useState<ChatConversation | null>(null);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, router]);

  const handleSelectConversation = (conversation: ChatConversation) => {
    setSelectedConversation(conversation);
    setCurrentConversation(conversation);
  };

  if (!isAuthenticated) {
    return null; // Don't render anything while redirecting
  }

  return (
    <Flex h="100%" overflow="hidden">
      <ConversationSidebar onSelectConversation={handleSelectConversation} />
      <ChatInterface conversation={selectedConversation || currentConversation} />
    </Flex>
  );
} 