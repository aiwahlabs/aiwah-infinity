'use client';

import React from 'react';
import { Box, Text } from '@chakra-ui/react';

interface SimpleMarkdownRendererProps {
  content: string;
  isStreaming?: boolean;
}

export const SimpleMarkdownRenderer: React.FC<SimpleMarkdownRendererProps> = React.memo(
  function SimpleMarkdownRenderer({ content, isStreaming = false }) {
    // For now, just render as pre-formatted text
    // This is a temporary solution to get the app building
    return (
      <Box
        as="pre"
        whiteSpace="pre-wrap"
        wordBreak="break-word"
        fontFamily="inherit"
        fontSize="sm"
        lineHeight="1.6"
        color="inherit"
        overflow="hidden"
      >
        <Text as="span">
          {content}
          {isStreaming && (
            <Box
              as="span"
              display="inline-block"
              w="2px"
              h="1.2em"
              bg="currentColor"
              ml={1}
              animation="blink 1s infinite"
              sx={{
                '@keyframes blink': {
                  '0%, 50%': { opacity: 1 },
                  '51%, 100%': { opacity: 0 },
                },
              }}
            />
          )}
        </Text>
      </Box>
    );
  }
); 