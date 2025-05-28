'use client';

import React, { useEffect, useRef, ErrorInfo, ReactNode, useMemo } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import rehypeRaw from 'rehype-raw';
import mermaid from 'mermaid';
import {
  Box,
  Code,
  Text,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
  Divider,
  Link,
  UnorderedList,
  OrderedList,
  ListItem,
  Heading,
  useColorModeValue,
} from '@chakra-ui/react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark, oneLight } from 'react-syntax-highlighter/dist/esm/styles/prism';

// Initialize Mermaid
mermaid.initialize({
  startOnLoad: true,
  theme: 'dark',
  securityLevel: 'loose',
  fontFamily: 'monospace',
  fontSize: 14,
  flowchart: {
    useMaxWidth: true,
    htmlLabels: true,
  },
  sequence: {
    useMaxWidth: true,
  },
  gantt: {
    useMaxWidth: true,
  },
  // Suppress errors in production
  logLevel: 'warn',
  suppressErrorRendering: true,
});

interface MarkdownRendererProps {
  content: string;
  className?: string;
  isStreaming?: boolean;
}

// Function to sanitize Mermaid diagrams
const sanitizeMermaidDiagram = (chart: string): string => {
  // Replace problematic quotes in node labels
  // This handles cases like: A --> B["Text with quotes"]
  // Convert to: A --> B[Text with quotes]
  return chart
    .replace(/\[\"([^"]*)\"\]/g, '[$1]')  // Remove quotes from square brackets
    .replace(/\(\"([^"]*)\"\)/g, '($1)')  // Remove quotes from parentheses
    .replace(/\{\"([^"]*)\"\}/g, '{$1}')  // Remove quotes from curly braces
    .replace(/\>\"([^"]*)\"/g, '>$1')     // Remove quotes after arrows
    .replace(/\"([^"]*)\"\]/g, '$1]')     // Remove leading quotes before closing brackets
    .replace(/\[\"([^"]*)/g, '[$1')       // Remove quotes after opening brackets
    // Handle more complex cases
    .replace(/-->\s*\[\"([^"]*)\"\]/g, '--> [$1]')  // Arrow to quoted bracket
    .replace(/\[\s*\"([^"]*)\"\s*\]/g, '[$1]')      // Quoted content with spaces
    .replace(/\(\s*\"([^"]*)\"\s*\)/g, '($1)')      // Quoted content in parentheses with spaces
    .replace(/\{\s*\"([^"]*)\"\s*\}/g, '{$1}')      // Quoted content in braces with spaces
    // Handle node definitions with quotes
    .replace(/(\w+)\s*\[\s*\"([^"]*)\"\s*\]/g, '$1[$2]')  // Node[quoted text]
    .replace(/(\w+)\s*\(\s*\"([^"]*)\"\s*\)/g, '$1($2)')  // Node(quoted text)
    .replace(/(\w+)\s*\{\s*\"([^"]*)\"\s*\}/g, '$1{$2}')  // Node{quoted text}
    .trim();
};

// Optimized Mermaid diagram component with better error handling
const MermaidDiagram: React.FC<{ chart: string; id: string }> = React.memo(({ chart, id }) => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const renderMermaidSafely = async () => {
      if (!ref.current) return;

      try {
        // Sanitize the chart before rendering
        const sanitizedChart = sanitizeMermaidDiagram(chart);
        
        try {
          const { svg } = await mermaid.render(`mermaid-${id}`, sanitizedChart);
          if (ref.current) {
            ref.current.innerHTML = svg;
          }
          return;
        } catch (primaryError) {
          // Suppress console error for primary attempt
          console.warn('Mermaid primary render failed, trying fallback...');
          
          // Try a more aggressive sanitization as fallback
          const aggressivelySanitized = chart
            .replace(/["']/g, '')  // Remove all quotes
            .replace(/[^\w\s\-\>\[\]\(\)\{\}\|\n\r]/g, ' ')  // Keep only safe characters
            .replace(/\s+/g, ' ')  // Normalize whitespace
            .trim();
          
          try {
            const { svg } = await mermaid.render(`mermaid-fallback-${id}`, aggressivelySanitized);
            if (ref.current) {
              ref.current.innerHTML = `
                <div style="margin-bottom: 0.5rem; padding: 0.5rem; background: #4a5568; color: #ffa500; border-radius: 0.25rem; font-size: 0.875rem;">
                  ⚠️ Diagram rendered with simplified labels due to parsing issues
                </div>
                ${svg}
              `;
            }
            return;
          } catch (fallbackError) {
            // Both attempts failed, show as code block
            if (ref.current) {
              ref.current.innerHTML = `
                <div style="background: #1a1a1a; border-radius: 0.375rem; overflow: hidden; border: 1px solid #4a5568;">
                  <div style="background: #2d3748; color: #a0aec0; padding: 0.5rem; font-size: 0.75rem; border-bottom: 1px solid #4a5568;">
                    📊 Mermaid Diagram (click to expand)
                  </div>
                  <details style="margin: 0;">
                    <summary style="padding: 0.5rem; cursor: pointer; background: #2a2a2a; color: #ffa500; font-size: 0.875rem;">
                      ⚠️ Could not render diagram - view source
                    </summary>
                    <pre style="margin: 0; padding: 1rem; color: #f8f8f2; overflow-x: auto; font-size: 0.875rem; line-height: 1.5; background: #1a1a1a;"><code>${chart}</code></pre>
                  </details>
                </div>
              `;
            }
          }
        }
      } catch (error) {
        // Final catch-all to prevent any errors from bubbling up
        console.warn('Mermaid rendering completely failed, showing fallback');
        if (ref.current) {
          ref.current.innerHTML = `
            <div style="background: #2a2a2a; border-radius: 0.375rem; padding: 1rem; border: 1px solid #4a5568;">
              <div style="color: #a0aec0; font-size: 0.875rem; margin-bottom: 0.5rem;">📊 Diagram Content</div>
              <pre style="margin: 0; color: #f8f8f2; overflow-x: auto; font-size: 0.875rem; line-height: 1.5;"><code>${chart}</code></pre>
            </div>
          `;
        }
      }
    };

    renderMermaidSafely();
  }, [chart, id]);

  return (
    <Box
      ref={ref}
      bg="gray.900"
      p={4}
      borderRadius="md"
      border="1px solid"
      borderColor="gray.600"
      my={4}
      overflow="auto"
      sx={{
        '& svg': {
          maxWidth: '100%',
          height: 'auto',
        },
      }}
    />
  );
});

// Optimized code block component with better memoization
const CodeBlock: React.FC<{
  children: string;
  className?: string;
  inline?: boolean;
}> = React.memo(({ children, className, inline }) => {
  const match = /language-(\w+)/.exec(className || '');
  const language = match ? match[1] : '';
  
  // Check if it's a Mermaid diagram
  if (language === 'mermaid') {
    const id = Math.random().toString(36).substr(2, 9);
    const fallbackContent = (
      <Box my={4} borderRadius="md" overflow="hidden">
        <Box bg="gray.800" p={3} borderRadius="md" border="1px solid" borderColor="gray.600">
          <Text color="gray.300" fontSize="sm" mb={2}>📊 Diagram Content</Text>
          <Box bg="gray.900" p={3} borderRadius="sm" overflow="auto">
            <Text as="pre" color="gray.200" fontSize="sm" fontFamily="mono" whiteSpace="pre-wrap">
              {children}
            </Text>
          </Box>
        </Box>
      </Box>
    );
    
    return (
      <MermaidErrorBoundary fallback={fallbackContent}>
        <MermaidDiagram chart={children} id={id} />
      </MermaidErrorBoundary>
    );
  }

  // Inline code
  if (inline) {
    return (
      <Code
        bg="gray.700"
        color="teal.200"
        px={1}
        py={0.5}
        borderRadius="sm"
        fontSize="sm"
      >
        {children}
      </Code>
    );
  }

  // Block code with syntax highlighting - memoized
  return useMemo(() => (
    <Box my={4} borderRadius="md" overflow="hidden">
      <SyntaxHighlighter
        style={oneDark}
        language={language || 'text'}
        PreTag="div"
        customStyle={{
          margin: 0,
          borderRadius: '0.375rem',
          fontSize: '0.875rem',
          lineHeight: '1.5',
        }}
        codeTagProps={{
          style: {
            fontFamily: 'ui-monospace, SFMono-Regular, "SF Mono", Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
          },
        }}
      >
        {children}
      </SyntaxHighlighter>
    </Box>
  ), [children, language]);
});

// Error boundary for Mermaid diagrams
class MermaidErrorBoundary extends React.Component<
  { children: ReactNode; fallback: ReactNode },
  { hasError: boolean }
> {
  constructor(props: { children: ReactNode; fallback: ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): { hasError: boolean } {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.warn('Mermaid component error caught by boundary:', error);
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback;
    }

    return this.props.children;
  }
}

// Optimized main component with better memoization
export const MarkdownRenderer: React.FC<MarkdownRendererProps> = React.memo(({
  content,
  className,
  isStreaming = false,
}) => {
  // Memoize the markdown components to prevent unnecessary re-renders
  const markdownComponents = useMemo(() => ({
    // Headings
    h1: ({ children }: any) => (
      <Heading as="h1" size="xl" color="white" mb={4} mt={6} lineHeight="1.2">
        {children}
      </Heading>
    ),
    h2: ({ children }: any) => (
      <Heading as="h2" size="lg" color="white" mb={3} mt={5} lineHeight="1.3">
        {children}
      </Heading>
    ),
    h3: ({ children }: any) => (
      <Heading as="h3" size="md" color="white" mb={3} mt={4} lineHeight="1.4">
        {children}
      </Heading>
    ),
    h4: ({ children }: any) => (
      <Heading as="h4" size="sm" color="white" mb={2} mt={3} lineHeight="1.4">
        {children}
      </Heading>
    ),
    h5: ({ children }: any) => (
      <Heading as="h5" size="xs" color="white" mb={2} mt={3} lineHeight="1.4">
        {children}
      </Heading>
    ),
    h6: ({ children }: any) => (
      <Heading as="h6" size="xs" color="gray.300" mb={2} mt={3} lineHeight="1.4">
        {children}
      </Heading>
    ),

    // Paragraphs
    p: ({ children }: any) => (
      <Text color="white" mb={3} lineHeight="1.6" fontSize="sm">
        {children}
      </Text>
    ),

    // Code
    code: ({ children, className, ...props }: any) => {
      const inline = !className;
      return (
        <CodeBlock
          className={className}
          inline={inline}
          {...props}
        >
          {String(children).replace(/\n$/, '')}
        </CodeBlock>
      );
    },

    // Links
    a: ({ href, children }: any) => (
      <Link
        href={href}
        color="teal.300"
        textDecoration="underline"
        _hover={{ color: "teal.200" }}
        isExternal
      >
        {children}
      </Link>
    ),

    // Lists
    ul: ({ children }: any) => (
      <UnorderedList color="white" mb={3} pl={4} spacing={1}>
        {children}
      </UnorderedList>
    ),
    ol: ({ children }: any) => (
      <OrderedList color="white" mb={3} pl={4} spacing={1}>
        {children}
      </OrderedList>
    ),
    li: ({ children }: any) => (
      <ListItem mb={1} fontSize="sm" lineHeight="1.5">
        {children}
      </ListItem>
    ),

    // Blockquotes
    blockquote: ({ children }: any) => (
      <Box
        borderLeft="4px solid"
        borderColor="teal.400"
        pl={4}
        py={2}
        my={4}
        bg="gray.800"
        borderRadius="md"
        fontStyle="italic"
        color="gray.300"
      >
        {children}
      </Box>
    ),

    // Tables
    table: ({ children }: any) => (
      <TableContainer my={4} borderRadius="md" overflow="hidden">
        <Table variant="simple" size="sm" bg="gray.800">
          {children}
        </Table>
      </TableContainer>
    ),
    thead: ({ children }: any) => (
      <Thead bg="gray.700">
        {children}
      </Thead>
    ),
    tbody: ({ children }: any) => (
      <Tbody>
        {children}
      </Tbody>
    ),
    tr: ({ children }: any) => (
      <Tr>
        {children}
      </Tr>
    ),
    th: ({ children }: any) => (
      <Th color="white" borderColor="gray.600" fontSize="xs">
        {children}
      </Th>
    ),
    td: ({ children }: any) => (
      <Td color="white" borderColor="gray.600" fontSize="sm">
        {children}
      </Td>
    ),

    // Horizontal rule
    hr: () => (
      <Divider borderColor="gray.600" my={6} />
    ),

    // Strong/Bold
    strong: ({ children }: any) => (
      <Text as="strong" fontWeight="bold" color="white">
        {children}
      </Text>
    ),

    // Emphasis/Italic
    em: ({ children }: any) => (
      <Text as="em" fontStyle="italic" color="gray.200">
        {children}
      </Text>
    ),

    // Strikethrough
    del: ({ children }: any) => (
      <Text as="del" textDecoration="line-through" color="gray.400">
        {children}
      </Text>
    ),
  }), []);

  // Memoize the entire markdown rendering
  const renderedMarkdown = useMemo(() => (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      rehypePlugins={[rehypeHighlight, rehypeRaw]}
      components={markdownComponents}
    >
      {content}
    </ReactMarkdown>
  ), [content, markdownComponents]);

  return (
    <Box className={`markdown-content ${className || ''}`}>
      {renderedMarkdown}
    </Box>
  );
}); 