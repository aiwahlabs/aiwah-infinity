'use client';

import React, { useEffect } from 'react';
import { Container, SimpleGrid } from '@chakra-ui/react'; // Removed Box, Heading, Text, Card, CardBody, CardHeader, Icon, Flex
import { useAuth } from '@saas-ui/auth';
import { FiFileText, FiMessageCircle } from 'react-icons/fi';
// Link is no longer directly used, it's encapsulated in AppFeatureCard
import { LayoutContainer } from '@/components/LayoutContainer';
import { useRouter } from 'next/navigation';
import { LoadingScreen } from '@/components/LoadingScreen';
import { AppFeatureCard } from '@/components/AppFeatureCard'; // Corrected path

export default function Home() {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Only redirect if not loading and not authenticated
    if (!isLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isLoading, isAuthenticated, router]);

  // Show loading screen while checking authentication status
  if (isLoading) {
    return <LoadingScreen />;
  }

  // If not loading and not authenticated, router.push in useEffect will handle it.
  // Return null or a minimal component to prevent rendering the main content.
  if (!isAuthenticated) {
    return null; 
  }

  return (
    <LayoutContainer>
      <Container maxW="container.xl" py={12}>
        {/* <Heading size="lg" mb={8} color="white">Your Applications</Heading> */}
        <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={8}>
          <AppFeatureCard
            href="/ghostwriter"
            icon={FiFileText}
            title="Ghostwriter"
            description="Create and manage your content"
          />
          <AppFeatureCard
            href="/chat"
            icon={FiMessageCircle}
            title="Chat"
            description="Chat with AI assistant"
          />
        </SimpleGrid>
      </Container>
    </LayoutContainer>
  );
}
