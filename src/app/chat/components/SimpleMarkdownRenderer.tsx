'use client';

import React from 'react';
import { Box, Text, Code, Link, UnorderedList, OrderedList, ListItem, Heading, Divider } from '@chakra-ui/react';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/cjs/styles/prism';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';

interface SimpleMarkdownRendererProps {
  content: string;
  isStreaming?: boolean;
}

export const SimpleMarkdownRenderer: React.FC<SimpleMarkdownRendererProps> = React.memo(
  function SimpleMarkdownRenderer({ content, isStreaming = false }) {
    return (
      <Box
        fontSize="sm"
        lineHeight="1.6"
        color="inherit"
        sx={{
          // Markdown-specific styles
          '& p': {
            marginBottom: '0.75rem',
            '&:last-child': {
              marginBottom: 0,
            },
          },
          '& h1, & h2, & h3, & h4, & h5, & h6': {
            marginTop: '1rem',
            marginBottom: '0.5rem',
            fontWeight: 'bold',
            '&:first-child': {
              marginTop: 0,
            },
          },
          '& ul, & ol': {
            marginBottom: '0.75rem',
            paddingLeft: '1.5rem',
          },
          '& li': {
            marginBottom: '0.25rem',
          },
          '& blockquote': {
            borderLeft: '4px solid',
            borderColor: 'gray.500',
            paddingLeft: '1rem',
            marginLeft: 0,
            marginBottom: '0.75rem',
            fontStyle: 'italic',
            opacity: 0.9,
          },
          '& hr': {
            marginY: '1rem',
            borderColor: 'gray.600',
          },
          '& table': {
            width: '100%',
            borderCollapse: 'collapse',
            marginBottom: '0.75rem',
          },
          '& th, & td': {
            border: '1px solid',
            borderColor: 'gray.600',
            padding: '0.5rem',
            textAlign: 'left',
          },
          '& th': {
            backgroundColor: 'gray.700',
            fontWeight: 'bold',
          },
          '& pre': {
            marginBottom: '0.75rem',
            borderRadius: 'md',
            overflow: 'auto',
          },
          '& :not(pre) > code': {
            backgroundColor: 'gray.700',
            color: 'gray.100',
            padding: '0.125rem 0.25rem',
            borderRadius: 'sm',
            fontSize: '0.875em',
            fontFamily: 'mono',
          },
        }}
      >
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          rehypePlugins={[rehypeRaw]}
          components={{
            // Custom component renderers
            h1: ({ children }) => (
              <Heading as="h1" size="lg" mb={2} mt={4} color="inherit">
                {children}
              </Heading>
            ),
            h2: ({ children }) => (
              <Heading as="h2" size="md" mb={2} mt={3} color="inherit">
                {children}
              </Heading>
            ),
            h3: ({ children }) => (
              <Heading as="h3" size="sm" mb={2} mt={3} color="inherit">
                {children}
              </Heading>
            ),
            h4: ({ children }) => (
              <Heading as="h4" size="xs" mb={1} mt={2} color="inherit">
                {children}
              </Heading>
            ),
            h5: ({ children }) => (
              <Heading as="h5" size="xs" mb={1} mt={2} color="inherit">
                {children}
              </Heading>
            ),
            h6: ({ children }) => (
              <Heading as="h6" size="xs" mb={1} mt={2} color="inherit">
                {children}
              </Heading>
            ),
            p: ({ children }) => (
              <Text mb={3} color="inherit" lineHeight="1.6">
                {children}
              </Text>
            ),
            ul: ({ children }) => (
              <UnorderedList mb={3} pl={4} color="inherit">
                {children}
              </UnorderedList>
            ),
            ol: ({ children }) => (
              <OrderedList mb={3} pl={4} color="inherit">
                {children}
              </OrderedList>
            ),
            li: ({ children }) => (
              <ListItem mb={1} color="inherit">
                {children}
              </ListItem>
            ),
            a: ({ href, children }) => (
              <Link href={href} color="blue.300" isExternal textDecoration="underline">
                {children}
              </Link>
            ),
            blockquote: ({ children }) => (
              <Box
                borderLeft="4px solid"
                borderColor="gray.500"
                pl={4}
                py={2}
                mb={3}
                fontStyle="italic"
                opacity={0.9}
                color="inherit"
              >
                {children}
              </Box>
            ),
            hr: () => <Divider my={4} borderColor="gray.600" />,
            code: ({ node, inline, className, children, ...props }: any) => {
              const match = /language-(\w+)/.exec(className || '');
              const language = match ? match[1] : '';
              
              if (!inline && language) {
                return (
                  <Box mb={3} borderRadius="md" overflow="hidden">
                    <SyntaxHighlighter
                      style={oneDark}
                      language={language}
                      PreTag="div"
                      customStyle={{
                        margin: 0,
                        borderRadius: '6px',
                        fontSize: '0.875rem',
                      } as any}
                      {...props}
                    >
                      {String(children).replace(/\n$/, '')}
                    </SyntaxHighlighter>
                  </Box>
                );
              }
              
              return (
                <Code
                  bg="gray.700"
                  color="gray.100"
                  px={1}
                  py={0.5}
                  borderRadius="sm"
                  fontSize="0.875em"
                  fontFamily="mono"
                  {...props}
                >
                  {children}
                </Code>
              );
            },
            pre: ({ children }) => (
              <Box
                as="pre"
                bg="gray.800"
                p={3}
                borderRadius="md"
                overflow="auto"
                mb={3}
                border="1px solid"
                borderColor="gray.700"
              >
                {children}
              </Box>
            ),
            table: ({ children }) => (
              <Box overflowX="auto" mb={3}>
                <Box 
                  as="table" 
                  width="100%" 
                  sx={{ borderCollapse: 'collapse' }}
                >
                  {children}
                </Box>
              </Box>
            ),
            th: ({ children }) => (
              <Box
                as="th"
                border="1px solid"
                borderColor="gray.600"
                p={2}
                bg="gray.700"
                fontWeight="bold"
                textAlign="left"
                color="inherit"
              >
                {children}
              </Box>
            ),
            td: ({ children }) => (
              <Box
                as="td"
                border="1px solid"
                borderColor="gray.600"
                p={2}
                textAlign="left"
                color="inherit"
              >
                {children}
              </Box>
            ),
          }}
        >
          {content}
        </ReactMarkdown>
        
        {/* Streaming cursor */}
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
      </Box>
    );
  }
); 