'use client';

import { Box, Heading, Text, Container, Card, CardBody, CardHeader } from '@chakra-ui/react';
import { useAuth } from '@saas-ui/auth';
import { redirect } from 'next/navigation';
import { useEffect } from 'react';

export default function Dashboard() {
  const { isAuthenticated, user, isLoading } = useAuth();
  
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      redirect('/login');
    }
  }, [isAuthenticated, isLoading]);

  if (isLoading) {
    return (
      <Container maxW="container.xl" py={8}>
        <Text>Loading...</Text>
      </Container>
    );
  }

  return (
    <Container maxW="container.xl">
      <Box mb={8}>
        <Heading as="h1" size="xl" mb={2} color="white">Dashboard</Heading>
        <Text color="gray.400">Welcome to your dashboard, {user?.email}</Text>
      </Box>
      
      <Box>
        <Card bg="gray.800" borderColor="gray.700">
          <CardHeader>
            <Heading size="md" color="white">Getting Started</Heading>
          </CardHeader>
          <CardBody>
            <Text color="gray.300">
              This is your dashboard. You can start building your application by customizing this page.
            </Text>
          </CardBody>
        </Card>
      </Box>
    </Container>
  );
} 