'use client';

import React from 'react';
import {
  Box,
  VStack,
  Text,
  Flex,
  Input,
  IconButton,
  Card,
  CardBody,
  Avatar,
  Spinner,
  Center,
  useToast
} from '@chakra-ui/react';
import { FiSend, FiMessageCircle } from 'react-icons/fi';
import { useState, useEffect, useRef, useCallback } from 'react';
import { useChatContext } from '@/hooks/chat';
import { ChatConversation, ChatMessage } from '../types';

interface ChatInterfaceProps {
  conversation: ChatConversation | null;
}

export const ChatInterface = React.memo(function ChatInterface({ conversation }: ChatInterfaceProps) {
  const {
    messages,
    loading,
    createMessage,
    loadMessages
  } = useChatContext();
  
  const [inputValue, setInputValue] = useState('');
  const [sending, setSending] = useState(false);
  const [botTyping, setBotTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const toast = useToast();

  // Load messages when conversation changes
  useEffect(() => {
    if (conversation?.id) {
      loadMessages(conversation.id);
    }
  }, [conversation?.id, loadMessages]);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages.length, botTyping]);

  const simulateBotResponse = useCallback(async (conversationId: number, userMessage: string) => {
    setBotTyping(true);
    
    try {
      console.log('Starting bot response for conversation:', conversationId);
      
      // Simulate thinking time
      await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000));
      
      // Simple bot response - always the same for now
      const botResponse = "Thanks for your message! I'm a simple bot that always responds with this message. In the future, I'll be much smarter and provide helpful responses based on your input.";
      
      console.log('Creating bot message for conversation:', conversationId);
      
      const botMessage = await createMessage({
        conversation_id: conversationId,
        role: 'assistant',
        content: botResponse,
        metadata: {
          response_time: Date.now(),
          user_message: userMessage
        }
      });
      
      if (botMessage) {
        console.log('Bot message created successfully:', botMessage.id);
      } else {
        console.error('Failed to create bot message - no message returned');
      }
    } catch (error) {
      console.error('Error creating bot response:', error);
      toast({
        title: 'Bot response failed',
        description: error instanceof Error ? error.message : 'Unknown error occurred',
        status: 'warning',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setBotTyping(false);
    }
  }, [createMessage, toast]);

  const handleSendMessage = useCallback(async () => {
    if (!inputValue.trim() || !conversation || sending) return;

    const messageContent = inputValue.trim();
    setInputValue('');
    setSending(true);

    try {
      console.log('Sending message to conversation:', conversation.id, 'Content:', messageContent);
      
      // Send user message
      const userMessage = await createMessage({
        conversation_id: conversation.id,
        role: 'user',
        content: messageContent,
        metadata: {
          timestamp: Date.now()
        }
      });

      if (userMessage) {
        console.log('User message created successfully:', userMessage.id);
        // Simulate bot response
        simulateBotResponse(conversation.id, messageContent);
      } else {
        console.error('Failed to create user message - no message returned');
        throw new Error('Failed to create user message');
      }
    } catch (error) {
      console.error('Error in handleSendMessage:', error);
      toast({
        title: 'Failed to send message',
        description: error instanceof Error ? error.message : 'Unknown error occurred',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
      setInputValue(messageContent); // Restore the message
    } finally {
      setSending(false);
    }
  }, [inputValue, conversation, sending, createMessage, simulateBotResponse, toast]);

  const handleKeyPress = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  }, [handleSendMessage]);

  const formatMessageTime = useCallback((dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  }, []);

  if (!conversation) {
    return (
      <Box
        flex="1"
        bg="gray.900"
        display="flex"
        alignItems="center"
        justifyContent="center"
      >
        <Center flexDirection="column">
          <FiMessageCircle size={64} color="gray.500" />
          <Text color="gray.400" fontSize="xl" mt={4}>
            Select a conversation to start chatting
          </Text>
          <Text color="gray.500" fontSize="md" mt={2}>
            Choose from the sidebar or create a new conversation
          </Text>
        </Center>
      </Box>
    );
  }

  return (
    <Box
      flex="1"
      bg="gray.900"
      display="flex"
      flexDirection="column"
      h="100%"
    >
      {/* Header */}
      <Box
        p={4}
        borderBottom="1px"
        borderColor="gray.700"
        bg="gray.800"
      >
        <Text fontSize="lg" fontWeight="bold" color="white">
          {conversation.title || 'Untitled Conversation'}
        </Text>
        <Text fontSize="sm" color="gray.400">
          AI Assistant • Always online
        </Text>
      </Box>

      {/* Messages */}
      <Box
        flex="1"
        overflowY="auto"
        p={4}
      >
        {loading ? (
          <Center h="100%">
            <Spinner size="xl" color="blue.400" />
          </Center>
        ) : (
          <VStack spacing={4} align="stretch">
            {messages.map((message: ChatMessage) => (
              <MessageBubble 
                key={message.id} 
                message={message} 
                formatTime={formatMessageTime}
              />
            ))}
            
            {/* Bot typing indicator */}
            {botTyping && (
              <Flex justify="flex-start">
                <Flex maxW="70%" align="flex-start">
                  <Avatar
                    size="sm"
                    bg="blue.500"
                    color="white"
                    name="AI"
                    mr={3}
                  />
                  <Card bg="gray.700" borderColor="gray.600" variant="outline">
                    <CardBody p={3}>
                      <Flex align="center">
                        <Spinner size="sm" color="blue.400" mr={2} />
                        <Text color="gray.400" fontSize="sm">
                          AI is typing...
                        </Text>
                      </Flex>
                    </CardBody>
                  </Card>
                </Flex>
              </Flex>
            )}
            
            <div ref={messagesEndRef} />
          </VStack>
        )}
      </Box>

      {/* Input */}
      <Box
        p={4}
        borderTop="1px"
        borderColor="gray.700"
        bg="gray.800"
      >
        <Flex>
          <Input
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type your message..."
            bg="gray.700"
            border="1px solid"
            borderColor="gray.600"
            _focus={{
              borderColor: 'blue.400',
              boxShadow: '0 0 0 1px var(--chakra-colors-blue-400)'
            }}
            disabled={sending || botTyping}
          />
          <IconButton
            aria-label="Send message"
            icon={<FiSend />}
            onClick={handleSendMessage}
            ml={2}
            colorScheme="blue"
            isLoading={sending}
            disabled={!inputValue.trim() || botTyping}
          />
        </Flex>
      </Box>
    </Box>
  );
});

// Separate memoized component for message bubbles
const MessageBubble = React.memo(function MessageBubble({ 
  message, 
  formatTime 
}: { 
  message: ChatMessage; 
  formatTime: (dateStr: string) => string;
}) {
  return (
    <Flex
      justify={message.role === 'user' ? 'flex-end' : 'flex-start'}
    >
      <Flex
        maxW="70%"
        align="flex-start"
        direction={message.role === 'user' ? 'row-reverse' : 'row'}
      >
        <Avatar
          size="sm"
          bg={message.role === 'user' ? 'blue.500' : 'blue.500'}
          color="white"
          name={message.role === 'user' ? 'You' : 'AI'}
          ml={message.role === 'user' ? 3 : 0}
          mr={message.role === 'user' ? 0 : 3}
        />
        <Card
          bg={message.role === 'user' ? 'blue.600' : 'gray.700'}
          borderColor={message.role === 'user' ? 'blue.500' : 'gray.600'}
          variant="outline"
        >
          <CardBody p={3}>
            <Text
              color="white"
              fontSize="sm"
              whiteSpace="pre-wrap"
              lineHeight="1.5"
            >
              {message.content}
            </Text>
            <Text
              color="gray.400"
              fontSize="xs"
              mt={2}
              textAlign={message.role === 'user' ? 'right' : 'left'}
            >
              {formatTime(message.created_at)}
            </Text>
          </CardBody>
        </Card>
      </Flex>
    </Flex>
  );
}); 