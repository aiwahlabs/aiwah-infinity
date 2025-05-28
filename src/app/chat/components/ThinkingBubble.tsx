'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
  Box,
  Text,
  IconButton,
  Collapse,
  Card,
  CardBody,
  Flex,
  Icon,
} from '@chakra-ui/react';
import { FiChevronDown, FiChevronUp, FiZap } from 'react-icons/fi';

interface ThinkingBubbleProps {
  thinking: string;
  timestamp: string;
  isStreaming?: boolean;
}

export const ThinkingBubble = React.memo(function ThinkingBubble({ 
  thinking, 
  timestamp,
  isStreaming = false
}: ThinkingBubbleProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [displayedText, setDisplayedText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const typewriterRef = useRef<NodeJS.Timeout | null>(null);
  
  // Auto-expand for short content
  const shouldAutoExpand = thinking.length < 200;

  // Typewriter effect for streaming
  useEffect(() => {
    if (isStreaming && thinking) {
      setIsTyping(true);
      setDisplayedText('');
      
      let currentIndex = 0;
      const typeSpeed = Math.max(20, Math.min(80, 3000 / thinking.length));
      
      const typeWriter = () => {
        if (currentIndex < thinking.length) {
          setDisplayedText(thinking.slice(0, currentIndex + 1));
          currentIndex++;
          typewriterRef.current = setTimeout(typeWriter, typeSpeed);
        } else {
          setIsTyping(false);
        }
      };
      
      typeWriter();
      
      return () => {
        if (typewriterRef.current) {
          clearTimeout(typewriterRef.current);
        }
      };
    } else {
      setDisplayedText(thinking);
      setIsTyping(false);
    }
  }, [thinking, isStreaming]);

  // Auto-expand for short content
  useEffect(() => {
    if (shouldAutoExpand && !isExpanded && thinking && !isStreaming) {
      const timer = setTimeout(() => {
        setIsExpanded(true);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [shouldAutoExpand, isExpanded, thinking, isStreaming]);

  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <Box mb={2}>
      <Card 
        bg="purple.900" 
        borderColor="purple.600" 
        variant="outline"
        size="sm"
      >
        <CardBody p={1}>
          {/* Simple header */}
          <Flex 
            align="center" 
            justify="space-between" 
            cursor="pointer"
            onClick={toggleExpanded}
            px={2}
            py={1}
            borderRadius="md"
            _hover={{ bg: "purple.800" }}
          >
            <Flex align="center">
              <Icon 
                as={FiZap} 
                color="purple.300" 
                size="10px"
                mr={1}
              />
              <Text color="purple.200" fontSize="xs">
                Thinking
              </Text>
              {isTyping && (
                <Box
                  ml={1}
                  w="2px"
                  h="2px"
                  bg="purple.300"
                  borderRadius="full"
                  animation="pulse 1.5s infinite"
                />
              )}
            </Flex>
            
            <IconButton
              aria-label={isExpanded ? "Hide" : "Show"}
              icon={isExpanded ? <FiChevronUp /> : <FiChevronDown />}
              size="xs"
              variant="ghost"
              colorScheme="purple"
              onClick={(e) => {
                e.stopPropagation();
                toggleExpanded();
              }}
            />
          </Flex>
          
          {/* Content */}
          <Collapse in={isExpanded} animateOpacity>
            <Box mt={1} mx={1}>
              <Box
                maxH="200px"
                overflowY="auto"
                bg="purple.950"
                borderRadius="md"
                p={2}
                border="1px solid"
                borderColor="purple.700"
              >
                <Text 
                  color="purple.100" 
                  fontSize="xs" 
                  whiteSpace="pre-wrap"
                  lineHeight="1.4"
                >
                  {displayedText}
                  {isTyping && (
                    <Box
                      as="span"
                      display="inline-block"
                      w="1px"
                      h="0.8em"
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
                  )}
                </Text>
              </Box>
              
              <Text 
                color="purple.400" 
                fontSize="10px"
                mt={1}
                textAlign="right"
                px={1}
              >
                {timestamp}
              </Text>
            </Box>
          </Collapse>
        </CardBody>
      </Card>
    </Box>
  );
}); 