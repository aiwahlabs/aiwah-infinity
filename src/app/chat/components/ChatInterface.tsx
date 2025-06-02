'use client';

import React, { useCallback, useRef, useEffect, useState } from 'react';
import {
  Box,
  VStack,
  Center,
  useToast,
  Text,
  Divider,
} from '@chakra-ui/react';
import { ChatMessage, ChatConversation } from '../types';
import { useChatContext } from '@/hooks/chat/useChatContext';
import { useAsyncChat } from '@/hooks/chat/useAsyncChat';
import { ChatHeader } from './ChatHeader';
import { MessageBubble } from './MessageBubble';
import { AsyncProcessingIndicator } from './AsyncProcessingIndicator';
import { ChatInput } from './ChatInput';


interface ChatInterfaceProps {
  conversation: ChatConversation | null;
}

export const ChatInterface = React.memo(function ChatInterface({ conversation }: ChatInterfaceProps) {
  const { 
    currentConversation, 
    messages, 
    loading, 
    updateConversation,
    createMessage,
    loadMessages 
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

  // Format message timestamp with relative time
  const formatMessageTime = useCallback((dateStr: string) => {
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
  }, []);

  // Handle sending messages with async processing
  const handleSendMessage = useCallback(async () => {
    if (!inputValue.trim() || sending || isProcessing || !activeConversation) return;

    const userMessage = inputValue.trim();
    setInputValue('');
    setSending(true);

    try {
      // Send message and trigger async processing
      await sendAsyncMessage(activeConversation.id, userMessage);
      
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
  }, [inputValue, sending, isProcessing, activeConversation, sendAsyncMessage, toast]);

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
      <Box h="100%" display="flex" flexDirection="column" bg="gray.800">
        <Center h="100%">
          <VStack spacing={4} textAlign="center" maxW="md">
            <Text textStyle="section-heading" fontWeight="medium" color="gray.100">
              Welcome to AI Chat
            </Text>
            <Text textStyle="body" color="gray.300">
              Select a conversation from the sidebar or create a new one to get started.
            </Text>
          </VStack>
        </Center>
      </Box>
    );
  }

  return (
    <Box 
      h="100%" 
      display="flex" 
      flexDirection="column" 
      bg="gray.800"
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
        bg="gray.800"
        minH={0}
      >
        <Box p={4} maxW="4xl" mx="auto">
            <VStack spacing={0} align="stretch">
              {/* Messages */}
              {messages.length === 0 ? (
                <Center py={20}>
                  <VStack spacing={3} textAlign="center">
                    <Text textStyle="section-heading" fontWeight="medium" color="gray.100">
                      Start a conversation
                    </Text>
                    <Text textStyle="body" color="gray.300">
                      Ask me anything! I&apos;m here to help.
                    </Text>
                  </VStack>
                </Center>
              ) : (
                messages.map((message: ChatMessage) => (
                  <MessageBubble 
                    key={message.id} 
                    message={message} 
                    formatTime={formatMessageTime}
                  />
                ))
              )}
              
              {/* Async processing indicator */}
              <AsyncProcessingIndicator
                isProcessing={isProcessing}
                error={asyncError}
              />
              
              <div ref={messagesEndRef} />
            </VStack>
        </Box>
      </Box>

      {/* Input Area - Fixed at bottom */}
      <Box 
        p={4} 
        bg="gray.800"
        flexShrink={0}
      >
        <Box maxW="4xl" mx="auto">
          <ChatInput
            value={inputValue}
            onChange={setInputValue}
            onSend={handleSendMessage}
            onCancel={handleCancel}
            disabled={sending || loading}
            isStreaming={isProcessing}
            placeholder="Ask me anything..."
          />
        </Box>
      </Box>
    </Box>
  );
}); 