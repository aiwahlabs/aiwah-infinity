'use client';

import React, { useMemo } from 'react';
import {
  Box,
  Flex,
  Text,
  Spinner,
  VStack,
  Badge,
  HStack,
} from '@chakra-ui/react';
import { ThinkingBubble } from './ThinkingBubble';
import { MarkdownRenderer } from './MarkdownRenderer';
import { Avatar, Card } from './ui';
import { designTokens } from '../design/tokens';

interface StreamingMessageProps {
  streamingContent: string;
  streamingThinking: string;
  botTyping: boolean;
}

// Optimized streaming content component with enhanced styling
const StreamingContent = React.memo(function StreamingContent({ 
  content 
}: { 
  content: string 
}) {
  // Memoize the markdown rendering to prevent unnecessary re-renders
  const renderedContent = useMemo(() => {
    if (!content) return null;
    return <MarkdownRenderer content={content} isStreaming={true} />;
  }, [content]);

  return (
    <Card variant="elevated" padding="md" bg="gray.850" borderColor="gray.700">
      <VStack spacing={3} align="stretch">
        {renderedContent}
        <HStack justify="space-between" align="center">
          <HStack spacing={2}>
            <Spinner size="xs" color="brand.400" />
            <Text color="gray.400" fontSize="xs">
              AI is typing...
            </Text>
          </HStack>
          <Badge colorScheme="teal" variant="subtle" fontSize="xs">
            Streaming
          </Badge>
        </HStack>
      </VStack>
    </Card>
  );
});

// Optimized thinking bubble for streaming with enhanced styling
const StreamingThinking = React.memo(function StreamingThinking({ 
  thinking 
}: { 
  thinking: string 
}) {
  return (
    <Box mb={3}>
      <HStack spacing={2} mb={2}>
        <Spinner size="xs" color="purple.400" />
        <Text fontSize="xs" color="gray.400">
          AI Reasoning
        </Text>
        <Badge colorScheme="purple" variant="subtle" fontSize="xs">
          Thinking
        </Badge>
      </HStack>
      <ThinkingBubble 
        thinking={thinking} 
        timestamp="Processing..."
        isStreaming={true}
      />
    </Box>
  );
});

export const StreamingMessage = React.memo(function StreamingMessage({
  streamingContent,
  streamingThinking,
  botTyping
}: StreamingMessageProps) {
  // Only show if we have content or are typing
  if (!botTyping) return null;

  // Show typing indicator when no content yet
  if (!streamingContent && !streamingThinking) {
    return (
      <Flex justify="flex-start" align="flex-start" gap={3}>
        <Avatar
          size="sm"
          name="AI Assistant"
          isBot={true}
          variant="glow"
          showStatus={true}
          status="online"
        />
        <Card 
          variant="glass" 
          padding="md" 
          bg="rgba(14, 165, 233, 0.05)"
          borderColor="brand.500"
          boxShadow={designTokens.shadows.glow}
        >
          <HStack spacing={3}>
            <Spinner size="sm" color="brand.400" thickness="2px" />
            <VStack spacing={1} align="flex-start">
              <Text color="gray.200" fontSize="sm" fontWeight="medium">
                AI is thinking...
              </Text>
              <Text color="gray.400" fontSize="xs">
                Analyzing your request
              </Text>
            </VStack>
          </HStack>
        </Card>
      </Flex>
    );
  }

  // Show streaming content and thinking
  return (
    <Flex 
      justify="flex-start" 
      align="flex-start"
      gap={3}
      opacity={0.95}
      transition="opacity 0.2s"
    >
      <Avatar
        size="sm"
        name="AI Assistant"
        isBot={true}
        variant="glow"
        showStatus={true}
        status="online"
      />
      
      <VStack spacing={3} align="stretch" flex="1" minW={0} maxW="85%">
        {/* Show streaming thinking bubble if available */}
        {streamingThinking && (
          <StreamingThinking thinking={streamingThinking} />
        )}
        
        {/* Show streaming content bubble if available */}
        {streamingContent && (
          <StreamingContent content={streamingContent} />
        )}
      </VStack>
    </Flex>
  );
}); 