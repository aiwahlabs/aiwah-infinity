'use client';

import React from 'react';
import { AppLayout } from '@/components/AppLayout';
import { FiMessageSquare } from 'react-icons/fi';
import { ChatProvider } from '@/hooks/chat';
import { useAuth } from '@saas-ui/auth';
import { Box, Center, Spinner, VStack, Text } from '@chakra-ui/react';
import { redirect } from 'next/navigation';

export default function ChatLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isAuthenticated, isLoading } = useAuth();
  
  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <AppLayout appName="Chat" appIcon={FiMessageSquare} showFooter={true}>
        <Center h="100%">
          <VStack spacing={4}>
            <Spinner size="xl" color="teal.500" thickness="3px" />
            <Text color="gray.400" fontSize="lg">
              Initializing chat...
            </Text>
          </VStack>
        </Center>
      </AppLayout>
    );
  }
  
  // Redirect if not authenticated
  if (!isAuthenticated) {
    redirect('/login');
  }
  
  return (
    <AppLayout appName="Chat" appIcon={FiMessageSquare} showFooter={true}>
      <ChatProvider>
        {children}
      </ChatProvider>
    </AppLayout>
  );
} 