'use client';

import React from 'react';
import { Box, Heading, Text, Card, CardBody, Icon, Flex, Container, VStack } from '@chakra-ui/react';
import { FiFileText, FiMessageCircle } from 'react-icons/fi';
import Link from 'next/link';
import { AuthGuard } from '@/components/AuthGuard';

export default function Home() {
  return (
    <AuthGuard>
      <Box minH="100vh" p={8}>
        <VStack spacing={4} align="stretch" w="400px">
          <Link href="/ghostwriter" passHref style={{ display: 'contents' }}>
            <Card 
              bg="gray.800" 
              borderColor="gray.700" 
              borderWidth="1px" 
              borderRadius="lg" 
              overflow="hidden" 
              _hover={{ 
                transform: 'translateY(-2px)', 
                boxShadow: 'xl',
                borderColor: "teal.400"
              }}
              transition="all 0.2s ease-in-out"
              cursor="pointer"
            >
              <CardBody p={4}>
                <Flex align="center">
                  <Box
                    bg="teal.500"
                    color="white"
                    p={3}
                    borderRadius="lg"
                    mr={4}
                    flexShrink={0}
                  >
                    <Icon as={FiFileText} boxSize={5} />
                  </Box>
                  <Box>
                    <Heading textStyle="section-heading" color="white" mb={1}>
                      Ghostwriter
                    </Heading>
                    <Text textStyle="body" color="gray.400">
                      Create and manage your content
                    </Text>
                  </Box>
                </Flex>
              </CardBody>
            </Card>
          </Link>
          
          <Link href="/chat" passHref style={{ display: 'contents' }}>
            <Card 
              bg="gray.800" 
              borderColor="gray.700" 
              borderWidth="1px" 
              borderRadius="lg" 
              overflow="hidden" 
              _hover={{ 
                transform: 'translateY(-2px)', 
                boxShadow: 'xl',
                borderColor: "teal.400"
              }}
              transition="all 0.2s ease-in-out"
              cursor="pointer"
            >
              <CardBody p={4}>
                <Flex align="center">
                  <Box
                    bg="teal.500"
                    color="white"
                    p={3}
                    borderRadius="lg"
                    mr={4}
                    flexShrink={0}
                  >
                    <Icon as={FiMessageCircle} boxSize={5} />
                  </Box>
                  <Box>
                    <Heading textStyle="section-heading" color="white" mb={1}>
                      Chat
                    </Heading>
                    <Text textStyle="body" color="gray.400">
                      Chat with AI assistant
                    </Text>
                  </Box>
                </Flex>
              </CardBody>
            </Card>
          </Link>
        </VStack>
      </Box>
    </AuthGuard>
  );
} 