'use client';

import React from 'react';
import { Box, Heading, Text, Card, CardBody, CardHeader, Icon, Flex, Container, SimpleGrid } from '@chakra-ui/react';
import { FiFileText, FiMessageCircle } from 'react-icons/fi';
import Link from 'next/link';
import { AuthGuard } from '@/components/AuthGuard';

export default function Dashboard() {
  return (
    <AuthGuard>
      <Container maxW="container.xl" py={12}>
        <Heading size="lg" mb={8} color="white" textAlign="center">
          Your Applications
        </Heading>
        <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={8}>
          <Link href="/ghostwriter" passHref style={{ display: 'contents' }}>
            <Card 
              bg="gray.800" 
              borderColor="gray.700" 
              borderWidth="1px" 
              borderRadius="lg" 
              overflow="hidden" 
              _hover={{ 
                transform: 'translateY(-4px)', 
                boxShadow: 'xl',
                borderColor: "teal.400"
              }}
              transition="all 0.2s ease-in-out"
              cursor="pointer"
              height="100%"
              maxW="100%"
            >
              <CardHeader pb={4}>
                <Flex align="center">
                  <Box
                    bg="teal.500"
                    color="white"
                    p={3}
                    borderRadius="md"
                    mr={4}
                  >
                    <Icon as={FiFileText} boxSize={6} />
                  </Box>
                  <Heading size="md" color="white">Ghostwriter</Heading>
                </Flex>
              </CardHeader>
              <CardBody pt={0} pb={6}>
                <Text color="gray.300" fontSize="md">Create and manage your content</Text>
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
                transform: 'translateY(-4px)', 
                boxShadow: 'xl',
                borderColor: "teal.400"
              }}
              transition="all 0.2s ease-in-out"
              cursor="pointer"
              height="100%"
              maxW="100%"
            >
              <CardHeader pb={4}>
                <Flex align="center">
                  <Box
                    bg="teal.500"
                    color="white"
                    p={3}
                    borderRadius="md"
                    mr={4}
                  >
                    <Icon as={FiMessageCircle} boxSize={6} />
                  </Box>
                  <Heading size="md" color="white">Chat</Heading>
                </Flex>
              </CardHeader>
              <CardBody pt={0} pb={6}>
                <Text color="gray.300" fontSize="md">Chat with AI assistant</Text>
              </CardBody>
            </Card>
          </Link>
        </SimpleGrid>
      </Container>
    </AuthGuard>
  );
} 