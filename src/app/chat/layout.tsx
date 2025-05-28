'use client';

import React from 'react';
import { AppLayout } from '@/components/AppLayout';
import { FiMessageCircle } from 'react-icons/fi';
import { ChatProvider } from '@/hooks/chat';
import { useAuth } from '@saas-ui/auth';
import { redirect } from 'next/navigation';

export default function ChatLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isAuthenticated, isLoading } = useAuth();
  
  // Check authentication
  if (!isLoading && !isAuthenticated) {
    redirect('/login');
  }
  
  return (
    <AppLayout appName="Chat" appIcon={FiMessageCircle}>
      <ChatProvider>
        {children}
      </ChatProvider>
    </AppLayout>
  );
} 