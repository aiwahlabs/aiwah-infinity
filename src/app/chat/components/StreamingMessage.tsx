'use client';

import React, { useMemo } from 'react';
import {
  Box,
  Flex,
  Text,
  HStack,
  Divider,
} from '@chakra-ui/react';
import {
  FiChevronDown,
} from 'react-icons/fi';
import { SimpleMarkdownRenderer } from './SimpleMarkdownRenderer';
import { MessageStreamingLoading } from './loading';

interface StreamingMessageProps {
  streamingContent: string;
  streamingThinking: string;
  botTyping: boolean;
}

// Optimized streaming content component with clean styling
const StreamingContent = React.memo(function StreamingContent({ 
  content 
}: { 
  content: string 
}) {
  // Memoize the markdown rendering to prevent unnecessary re-renders
  const renderedContent = useMemo(() => {
    if (!content) return null;
    return <SimpleMarkdownRenderer content={content} isStreaming={true} />;
  }, [content]);

  return (
    <Box color="white">
      {renderedContent}
      {/* Typing indicator */}
      <HStack spacing={2} mt={2}>
        <MessageStreamingLoading />
      </HStack>
    </Box>
  );
});

// Clean thinking bubble for streaming
const StreamingThinking = React.memo(function StreamingThinking({ 
  thinking 
}: { 
  thinking: string 
}) {
  return (
    <Box mb={4}>
      <Flex 
        align="center" 
        justify="space-between"
        py={2}
        px={3}
        borderRadius="md"
        bg="gray.700"
        border="1px solid"
        borderColor="gray.600"
      >
        <HStack spacing={2}>
          <Text color="purple.300" fontSize="xs" fontWeight="medium">
            Thoughts
          </Text>
          <MessageStreamingLoading />
        </HStack>
        <Box
          as={FiChevronDown}
          color="purple.300"
          fontSize="12px"
        />
      </Flex>
      
      <Box
        bg="gray.800"
        borderRadius="md"
        p={3}
        border="1px solid"
        borderColor="gray.600"
        mt={2}
      >
        <Text 
          color="gray.300" 
          fontSize="sm" 
          whiteSpace="pre-wrap"
          lineHeight="1.5"
        >
          {thinking}
          <Box
            as="span"
            display="inline-block"
            w="1px"
            h="1em"
            bg="purple.300"
            ml={1}
            animation="blink 1s infinite"
            css={{
              '@keyframes blink': {
                '0%, 50%': { opacity: 1 },
                '51%, 100%': { opacity: 0 },
              },
            }}
          />
        </Text>
      </Box>
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
      <Box>
        {/* Message row */}
        <Box py={4}>
          {/* Message header */}
          <Flex justify="space-between" align="center" mb={3}>
            <Text
              fontSize="sm"
              fontWeight="medium"
              color="gray.300"
            >
              AI Assistant
            </Text>
            
            <HStack spacing={2}>
              <Text fontSize="xs" color="gray.500">
                Just now
              </Text>
            </HStack>
          </Flex>

          {/* Typing indicator */}
          <HStack spacing={3}>
            <MessageStreamingLoading />
          </HStack>
        </Box>

        {/* Separator */}
        <Divider borderColor="gray.700" />
      </Box>
    );
  }

  // Show streaming content and thinking
  return (
    <Box>
      {/* Message row */}
      <Box py={4}>
        {/* Message header */}
        <Flex justify="space-between" align="center" mb={3}>
          <Text
            fontSize="sm"
            fontWeight="medium"
            color="gray.300"
          >
            AI Assistant
          </Text>
          
          <HStack spacing={2}>
            <Text fontSize="xs" color="gray.500">
              Just now
            </Text>
          </HStack>
        </Flex>

        {/* Show streaming thinking bubble if available */}
        {streamingThinking && (
          <StreamingThinking thinking={streamingThinking} />
        )}
        
        {/* Show streaming content bubble if available */}
        {streamingContent && (
          <StreamingContent content={streamingContent} />
        )}
      </Box>

      {/* Separator */}
      <Divider borderColor="gray.700" />
    </Box>
  );
}); 