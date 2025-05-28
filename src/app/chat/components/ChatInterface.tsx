'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  Box,
  VStack,
  Center,
  Spinner,
  useToast,
  Flex,
  Text,
  HStack,
  IconButton,
  Tooltip,
} from '@chakra-ui/react';
import { FiRefreshCw } from 'react-icons/fi';
import { ChatConversation, ChatMessage } from '../types';
import { useChatContext } from '@/hooks/chat/useChatContext';
import { useChatStream } from '../hooks/useChatStream';
import { ChatHeader } from './ChatHeader';
import { MessageBubble } from './MessageBubble';
import { StreamingMessage } from './StreamingMessage';
import { ChatInput } from './ChatInput';
import { Card } from './ui';
import { designTokens } from '../design/tokens';

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
  
  const {
    streamState,
    sendMessage,
    cancelStream,
    resetStream,
  } = useChatStream();
  
  // Use currentConversation from context with fallback to prop
  const activeConversation = currentConversation || conversation;
  
  const [inputValue, setInputValue] = useState('');
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const toast = useToast();

  // Load messages when conversation changes
  useEffect(() => {
    if (activeConversation?.id) {
      loadMessages(activeConversation.id);
      resetStream();
    }
  }, [activeConversation?.id, loadMessages, resetStream]);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, streamState.streamingContent, streamState.streamingThinking]);

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

  // Handle sending messages
  const handleSendMessage = useCallback(async () => {
    if (!inputValue.trim() || sending || streamState.isStreaming || !activeConversation) return;

    const userMessage = inputValue.trim();
    setInputValue('');
    setSending(true);

    try {
      // Add user message to database
      const userMessageData = await createMessage({
        conversation_id: activeConversation.id,
        role: 'user',
        content: userMessage,
      });

      if (!userMessageData) {
        throw new Error('Failed to create user message');
      }

      // Get all messages for context (including the new user message)
      const allMessages = [...messages, userMessageData];
      
      // Send message with streaming
      await sendMessage(allMessages, {
        onComplete: async (finalContent: string, finalThinking?: string) => {
          // Save the complete AI response to database
          if (finalContent.trim()) {
            await createMessage({
              conversation_id: activeConversation.id,
              role: 'assistant',
              content: finalContent,
              thinking: finalThinking || undefined,
            });
          }
        },
        onError: (error: string) => {
          toast({
            title: 'Error sending message',
            description: error,
            status: 'error',
            duration: 5000,
            isClosable: true,
          });
        }
      });
    } catch (error) {
      console.error('Error sending message:', error);
      toast({
        title: 'Error sending message',
        description: error instanceof Error ? error.message : 'Please try again',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setSending(false);
    }
  }, [inputValue, sending, streamState.isStreaming, activeConversation, createMessage, messages, sendMessage, toast]);

  // Handle updating conversation title
  const handleUpdateTitle = useCallback(async (newTitle: string) => {
    if (!activeConversation) return;
    await updateConversation(activeConversation.id, { title: newTitle });
  }, [activeConversation, updateConversation]);

  const handleRefreshConversation = useCallback(() => {
    if (activeConversation?.id) {
      loadMessages(activeConversation.id);
      toast({
        title: 'Conversation refreshed',
        status: 'success',
        duration: 2000,
      });
    }
  }, [activeConversation, loadMessages, toast]);

  if (!activeConversation) {
    return (
      <Box h="100%" display="flex" flexDirection="column" bg="gray.800">
        <Center h="100%">
          <VStack spacing={4} textAlign="center" maxW="md">
            <Text fontSize="xl" fontWeight="medium" color="gray.100">
              Welcome to AI Chat
            </Text>
            <Text color="gray.400" fontSize="md">
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
          {loading ? (
            <Center h="400px">
              <Spinner size="lg" color="teal.400" />
            </Center>
          ) : (
            <VStack spacing={4} align="stretch">
              {/* Messages */}
              {messages.length === 0 ? (
                <Center py={20}>
                  <VStack spacing={3} textAlign="center">
                    <Text fontSize="lg" fontWeight="medium" color="gray.100">
                      Start a conversation
                    </Text>
                    <Text color="gray.400">
                      Ask me anything! I'm here to help.
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
              
              {/* Streaming AI response */}
              <StreamingMessage
                streamingContent={streamState.streamingContent}
                streamingThinking={streamState.streamingThinking}
                botTyping={streamState.isStreaming}
              />
              
              {/* Error state */}
              {streamState.error && (
                <Box p={3} bg="red.900" borderRadius="md" border="1px solid" borderColor="red.700">
                  <Text color="red.200" fontSize="sm">
                    {streamState.error}
                  </Text>
                </Box>
              )}
              
              <div ref={messagesEndRef} />
            </VStack>
          )}
        </Box>
      </Box>

      {/* Input Area - Fixed at bottom */}
      <Box 
        p={4} 
        bg="gray.800"
        borderTop="1px"
        borderColor="gray.600"
        flexShrink={0}
      >
        <Box maxW="4xl" mx="auto">
          <ChatInput
            value={inputValue}
            onChange={setInputValue}
            onSend={handleSendMessage}
            onCancel={cancelStream}
            disabled={sending}
            isStreaming={streamState.isStreaming}
            placeholder="Ask me anything..."
          />
        </Box>
      </Box>
    </Box>
  );
}); 