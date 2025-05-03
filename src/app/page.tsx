'use client';

import React from 'react';
import { Box, Heading, Text, Button, Container, SimpleGrid, Card, CardBody, CardHeader, Icon, Flex } from '@chakra-ui/react';
import { useAuth } from '@saas-ui/auth';
import { FiFileText } from 'react-icons/fi';
import Link from 'next/link';
import { LayoutContainer } from '@/components/LayoutContainer';

export default function Home() {
  const { isAuthenticated, user } = useAuth();

  return (
    <LayoutContainer>
      <Container maxW="container.xl" py={8}>
        {isAuthenticated ? (
          <Box width="100%" maxW="400px" mt={4}>
            <Link href="/dashboard" passHref>
              <Card 
                bg="gray.800" 
                borderColor="gray.700" 
                borderWidth="1px" 
                borderRadius="lg" 
                overflow="hidden" 
                _hover={{ 
                  transform: 'translateY(-4px)', 
                  boxShadow: 'xl',
                  borderColor: "blue.400"
                }}
                transition="all 0.2s ease-in-out"
                cursor="pointer"
                height="100%"
              >
                <CardHeader pb={2}>
                  <Flex align="center" mb={2}>
                    <Flex
                      bg="blue.600"
                      w="48px"
                      h="48px"
                      borderRadius="md"
                      justify="center"
                      align="center"
                      mr={4}
                    >
                      <Icon as={FiFileText} boxSize={6} color="white" />
                    </Flex>
                    <Heading size="md" color="white">Ghostwriter</Heading>
                  </Flex>
                </CardHeader>
                <CardBody pt={0}>
                  <Text color="gray.300">Create and manage your content</Text>
                </CardBody>
              </Card>
            </Link>
          </Box>
        ) : (
          <Box my={8} width="100%" textAlign="center">
            <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4} maxW="md" mx="auto">
              <Link href="/signup" passHref>
                <Button colorScheme="blue" size="lg" width="full">Sign Up</Button>
              </Link>
              <Link href="/login" passHref>
                <Button variant="outline" colorScheme="blue" size="lg" width="full">Login</Button>
              </Link>
            </SimpleGrid>
          </Box>
        )}
      </Container>
    </LayoutContainer>
  );
}
