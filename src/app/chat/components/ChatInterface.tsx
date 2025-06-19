'use client';

import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import {
  Box,
  VStack,
  Center,
  useToast,
  Text,
  Container,
  HStack,
  Flex,
} from '@chakra-ui/react';
import { ChatMessage, ChatConversation } from '../types';
import { useChatContext } from '@/hooks/chat/useChatContext';
import { useAsyncChat } from '@/hooks/chat/useAsyncChat';
import { ChatHeader } from './ChatHeader';
import { MessageBubble } from './MessageBubble';
import { ChatInput } from './ChatInput';
import { AsyncProcessingIndicator } from './AsyncProcessingIndicator';

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

/**
 * Simplified ChatInterface with clean architecture
 * 
 * Features:
 * - Real-time message updates via Supabase subscriptions
 * - Simple message sending without optimistic updates
 * - Smooth scrolling and responsive design
 * - Clean error handling
 */
export const ChatInterface = React.memo(function ChatInterface({ conversation }: ChatInterfaceProps) {
  const { 
    currentConversation, 
    messages, 
    updateConversation,
    loadMessages,
  } = useChatContext();
  
  // Use currentConversation from context with fallback to prop
  const activeConversation = currentConversation || conversation;
  
  const {
    sendMessage: sendAsyncMessage,
    isProcessing,
    error: asyncError,
    clearError,
    activeTasks,
  } = useAsyncChat(activeConversation?.id);
  
  const [inputValue, setInputValue] = useState('');
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const toast = useToast();

  // Memoized values to prevent unnecessary re-renders
  const conversationId = useMemo(() => activeConversation?.id, [activeConversation?.id]);
  const messagesCount = useMemo(() => messages.length, [messages.length]);
  const hasAsyncError = useMemo(() => !!asyncError, [asyncError]);

  // Debounced scroll-to-bottom for smooth scrolling
  const scrollToBottom = useCallback((immediate = false) => {
    if (scrollTimeoutRef.current) {
      clearTimeout(scrollTimeoutRef.current);
    }
    
    // Use shorter delay for immediate states (loading, processing)
    const delay = immediate ? 10 : 50;
    
    scrollTimeoutRef.current = setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ 
        behavior: 'smooth',
        block: 'end'
      });
    }, delay);
  }, []);

  // Optimized debug logging (reduced frequency)
  const debugLogRef = useRef<number>(0);
  useEffect(() => {
    // Only log every 10th state change to reduce console spam
    if (debugLogRef.current % 10 === 0) {
      console.log('💬 ChatInterface state:', {
        conversationId,
        messagesCount,
        isProcessing,
        activeTasks: activeTasks.length
      });
    }
    debugLogRef.current++;
  }, [conversationId, messagesCount, isProcessing, activeTasks.length, hasAsyncError]);

  // Load messages when conversation changes
  useEffect(() => {
    if (activeConversation?.id) {
      console.log('📥 Loading messages for conversation:', activeConversation.id);
      loadMessages(activeConversation.id);
    }
  }, [activeConversation?.id, loadMessages]);

  // Enhanced auto-scroll - trigger on ANY content or state change
  useEffect(() => {
    // Scroll to bottom whenever:
    // 1. New messages arrive (messages.length changes)
    // 2. Processing state changes (loading/AI processing indicators)
    // 3. Error states appear
    // 4. Any visual content changes that might affect chat height
    
    // Use immediate scroll for loading/processing states for better UX
    const isImmediateState = isProcessing || sending || !!asyncError;
    scrollToBottom(isImmediateState);
    
    // Only log significant state changes to avoid console spam
    if (isImmediateState || messages.length === 1) {
      console.log('🔄 Auto-scroll:', { 
        reason: isProcessing ? 'processing' : sending ? 'sending' : asyncError ? 'error' : 'messages',
        immediate: isImmediateState 
      });
    }
  }, [
    messages.length,      // New messages
    isProcessing,         // AI processing state
    sending,              // User message sending state
    asyncError,           // Error states
    activeTasks.length,   // Active background tasks
    scrollToBottom
  ]);

  // Also scroll when conversation changes (immediate scroll for new conversation)
  useEffect(() => {
    if (activeConversation?.id) {
      // Immediate scroll for new conversation (no delay)
      setTimeout(() => {
        messagesEndRef.current?.scrollIntoView({ 
          behavior: 'smooth',
          block: 'end'
        });
      }, 100); // Small delay to let messages load
    }
  }, [activeConversation?.id]);

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

  // Simplified message sending - no optimistic updates
  const handleSendMessage = useCallback(async () => {
    if (!inputValue.trim() || sending || isProcessing || !activeConversation) return;

    const userMessage = inputValue.trim();
    
    // Performance tracking - Start timestamp
    const sendStartTime = performance.now();
    console.log('📊 PERFORMANCE: Send button clicked', {
      timestamp: new Date().toISOString(),
      startTime: sendStartTime,
      messageLength: userMessage.length,
      conversationId: activeConversation.id
    });
    
    setInputValue('');
    setSending(true);

    try {
      // Performance tracking - Before API call
      const apiCallStartTime = performance.now();
      console.log('📊 PERFORMANCE: Starting API call', {
        timestamp: new Date().toISOString(),
        timeFromClick: apiCallStartTime - sendStartTime,
        action: 'sendAsyncMessage'
      });
      
      // Just send the message - let real-time handle UI updates
      await sendAsyncMessage(activeConversation.id, userMessage);
      
      // Performance tracking - After API call
      const apiCallEndTime = performance.now();
      console.log('✅ Message sent successfully');
      console.log('📊 PERFORMANCE: API call completed', {
        timestamp: new Date().toISOString(),
        apiCallDuration: apiCallEndTime - apiCallStartTime,
        totalTimeFromClick: apiCallEndTime - sendStartTime
      });
      
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
      
      // Performance tracking - Total time
      const totalTime = performance.now() - sendStartTime;
      console.log('📊 PERFORMANCE: Send flow completed', {
        timestamp: new Date().toISOString(),
        totalDuration: totalTime,
        status: 'complete'
      });
    }
  }, [inputValue, sending, isProcessing, activeConversation, sendAsyncMessage, toast]);

  // Simplified message list - no more deduplication needed
  const messageList = useMemo(() => {
    return messages.map((message, index) => (
      <MessageBubble
        key={message.id}
        message={message}
        isStreaming={false}
        formatTime={(dateStr: string) => {
          const date = new Date(dateStr);
          const now = new Date();
          const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
          
          if (diffInSeconds < 60) return 'Just now';
          if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
          if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
          return date.toLocaleDateString();
        }}
      />
    ));
  }, [messages]);

  // Handle Enter key press
  const handleKeyPress = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  }, [handleSendMessage]);

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
        <Flex direction="column" height="100%" bg="gray.900">
      {/* Chat Header */}
      <ChatHeader 
        conversation={activeConversation}
        onUpdateTitle={async (newTitle) => {
          await updateConversation(activeConversation.id, { title: newTitle });
        }}
      />

      {/* Messages Area - Optimized */}
      <Box 
        flex={1} 
        overflowY="auto" 
        px={4} 
        py={4}
        bg="gray.900"
        css={{
          '&::-webkit-scrollbar': {
            width: '6px',
          },
          '&::-webkit-scrollbar-track': {
            background: '#2D3748',
            borderRadius: '3px',
          },
          '&::-webkit-scrollbar-thumb': {
            background: '#4A5568',
            borderRadius: '3px',
          },
          '&::-webkit-scrollbar-thumb:hover': {
            background: '#718096',
          },
        }}
      >
        <VStack spacing={4} align="stretch">
          {messageList}
          
          {/* Show processing indicator when AI is working */}
          {isProcessing && (
            <AsyncProcessingIndicator
              isProcessing={isProcessing}
              statusMessage="Almost there, passing to AI now..."
            />
          )}
          
          <div ref={messagesEndRef} />
        </VStack>
      </Box>

      {/* Chat Input - Fixed at bottom */}
      <Box 
        p={4} 
        borderTop="1px solid" 
        borderColor="gray.700" 
        bg="gray.850"
      >
         <ChatInput
           value={inputValue}
           onChange={setInputValue}
           onSend={handleSendMessage}
           disabled={sending || isProcessing}
           placeholder={
             isProcessing 
               ? "AI is responding..." 
               : sending 
                 ? "Sending..." 
                 : "Type your message..."
           }
         />
       </Box>
    </Flex>
  );
}); 