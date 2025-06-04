'use client';

import React, { useCallback, useRef, useEffect, useState } from 'react';
import {
  Box,
  VStack,
  Center,
  useToast,
  Text,
  Container,
} from '@chakra-ui/react';
import { ChatMessage, ChatConversation } from '../types';
import { useChatContext } from '@/hooks/chat/useChatContext';
import { useAsyncChat } from '@/hooks/chat/useAsyncChat';
import { ChatHeader } from './ChatHeader';
import { MessageBubble } from './MessageBubble';
import { ChatInput } from './ChatInput';

// Format message timestamp with relative time - outside component to prevent re-renders
const formatMessageTime = (dateStr: string) => {
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
    return date.toLocaleDateString([], { 
      month: 'short', 
      day: 'numeric',
      year: diffInDays > 365 ? 'numeric' : undefined 
    });
  }
};

interface ChatInterfaceProps {
  conversation: ChatConversation | null;
}

export const ChatInterface = React.memo(function ChatInterface({ conversation }: ChatInterfaceProps) {
  const { 
    currentConversation, 
    messages, 
    updateConversation,
    loadMessages,
    setMessages,
  } = useChatContext();
  

  
  // Use currentConversation from context with fallback to prop
  const activeConversation = currentConversation || conversation;
  
  const {
    sendMessage: sendAsyncMessage,
    isProcessing,
    error: asyncError,
    clearError,
  } = useAsyncChat(activeConversation?.id);
  
  const [inputValue, setInputValue] = useState('');
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const toast = useToast();

  // Load messages when conversation changes
  useEffect(() => {
    if (activeConversation?.id) {
      loadMessages(activeConversation.id);
    }
  }, [activeConversation?.id, loadMessages]);

  // Auto-scroll to bottom when new messages arrive or processing state changes
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isProcessing]);

  // Show error toast when async error occurs
  useEffect(() => {
    if (asyncError) {
      toast({
        title: 'Error processing message',
        description: asyncError,
        status: 'error',
        duration: 5000,
        isClosable: true,
        onCloseComplete: clearError,
      });
    }
  }, [asyncError, toast, clearError]);

  // Handle sending messages with async processing
  const handleSendMessage = useCallback(async () => {
    if (!inputValue.trim() || sending || isProcessing || !activeConversation) return;

    const userMessage = inputValue.trim();
    setInputValue('');
    setSending(true);

    try {
      // Send message and trigger async processing
      await sendAsyncMessage(activeConversation.id, userMessage, (userMsg, aiMsg) => {
        // Type guard to check if the messages have the expected properties
        const userMessage = userMsg as ChatMessage;
        const aiMessage = aiMsg as ChatMessage;
        
        console.log('💬 Messages received from API, adding to local state immediately:', {
          userMessageId: userMessage?.id,
          aiMessageId: aiMessage?.id,
          hasUserContent: !!userMessage?.content,
          hasAiContent: !!aiMessage?.content
        });

        // Immediately add both messages to local state for instant feedback
        // This ensures they show up in the UI immediately, regardless of real-time subscription timing
        if (userMessage) {
          setMessages((prev: ChatMessage[]) => {
            // Check for duplicates (in case real-time subscription already added it)
            if (prev.some((msg: ChatMessage) => msg.id === userMessage.id)) {
              console.log('User message already exists, skipping:', userMessage.id);
              return prev;
            }
            console.log('✅ Adding user message to local state:', userMessage.id);
            return [...prev, userMessage];
          });
        }

        if (aiMessage) {
          setMessages((prev: ChatMessage[]) => {
            // Check for duplicates (in case real-time subscription already added it)
            if (prev.some((msg: ChatMessage) => msg.id === aiMessage.id)) {
              console.log('AI message already exists, skipping:', aiMessage.id);
              return prev;
            }
            console.log('✅ Adding AI placeholder message to local state:', aiMessage.id);
            return [...prev, aiMessage];
          });
        }
      });
      
      // Message was sent successfully - the async hook will handle real-time updates
      console.log('Message sent for async processing');
      
    } catch (error) {
      console.error('Error sending message:', error);
      
      // Restore input value on error so user doesn't lose their message
      setInputValue(userMessage);
      
      toast({
        title: 'Failed to send message',
        description: error instanceof Error ? error.message : 'Please try again',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setSending(false);
    }
  }, [inputValue, sending, isProcessing, activeConversation, sendAsyncMessage, toast, setMessages]);

  // Handle updating conversation title
  const handleUpdateTitle = useCallback(async (newTitle: string) => {
    if (!activeConversation) return;
    await updateConversation(activeConversation.id, { title: newTitle });
  }, [activeConversation, updateConversation]);

  // Handle canceling processing (placeholder for future enhancement)
  const handleCancel = useCallback(() => {
    // TODO: Implement task cancellation via API if needed
    console.log('Cancel processing requested');
  }, []);

  if (!activeConversation) {
    return (
      <Box 
        h="100%" 
        bg="gray.900"
        display="flex" 
        flexDirection="column"
      >
        {/* Empty header space to match layout */}
        <Box
          bg="gray.850"
          borderBottom="1px solid"
          borderColor="gray.800"
          py={4}
          flexShrink={0}
        >
          <Container maxW="4xl">
            <Text textStyle="body" color="gray.500" fontWeight="500">
              AI Chat
            </Text>
          </Container>
        </Box>

        {/* Welcome content - matches message area structure */}
        <Box 
          flex="1" 
          overflowY="auto" 
          overflowX="hidden"
          bg="gray.900"
          minH={0}
        >
          <Container maxW="4xl" py={6}>
            <Center py={20}>
              <VStack spacing={6} textAlign="center" maxW="lg">
                <Text textStyle="page-title" color="gray.100" fontWeight="600">
                  Welcome to AI Chat
                </Text>
                <Text textStyle="body" color="gray.400" lineHeight="1.6">
                  Select a conversation from the sidebar or create a new one to get started with your AI assistant.
                </Text>
              </VStack>
            </Center>
          </Container>
        </Box>

        {/* Empty input area space to match layout */}
        <Box 
          bg="gray.850"
          borderTop="1px solid"
          borderColor="gray.800"
          p={4}
          flexShrink={0}
        >
          <Container maxW="4xl">
            <Box
              bg="gray.800"
              borderRadius="xl"
              border="1px solid"
              borderColor="gray.700"
              p={4}
              opacity={0.5}
            >
              <Text textStyle="body" color="gray.500">
                Select a conversation to start chatting...
              </Text>
            </Box>
          </Container>
        </Box>
      </Box>
    );
  }

  return (
    <Box 
      h="100%" 
      bg="gray.900"
      display="flex" 
      flexDirection="column"
    >
      {/* Header - Fixed at top */}
      <ChatHeader 
        conversation={activeConversation}
        onUpdateTitle={handleUpdateTitle}
      />

      {/* Messages Area - Scrollable middle section */}
      <Box 
        flex="1" 
        overflowY="auto" 
        overflowX="hidden"
        bg="gray.900"
        minH={0}
      >
        <Container maxW="4xl" py={6}>
          <VStack spacing={0} align="stretch">
            {/* Messages */}
            {messages.length === 0 ? (
              <Center py={20}>
                <VStack spacing={4} textAlign="center">
                  <Text textStyle="section-heading" color="gray.200" fontWeight="500">
                    Start a conversation
                  </Text>
                  <Text textStyle="body" color="gray.400" maxW="md">
                    Ask me anything! I&apos;m here to help with questions, creative tasks, problem-solving, and much more.
                  </Text>
                </VStack>
              </Center>
            ) : (
              <>
                {messages.map((message: ChatMessage) => (
                  <MessageBubble 
                    key={message.id} 
                    message={message} 
                    formatTime={formatMessageTime}
                  />
                ))}
              </>
            )}
            
            <div ref={messagesEndRef} />
          </VStack>
        </Container>
      </Box>

      {/* Input Area - Fixed at bottom */}
      <Box 
        bg="gray.850"
        borderTop="1px solid"
        borderColor="gray.800"
        p={4}
        flexShrink={0}
      >
        <Container maxW="4xl">
          <ChatInput
            value={inputValue}
            onChange={setInputValue}
            onSend={handleSendMessage}
            onCancel={handleCancel}
            disabled={sending}
            isStreaming={isProcessing}
            placeholder="Ask me anything..."
          />
        </Container>
      </Box>
    </Box>
  );
}); 