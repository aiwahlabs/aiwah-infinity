'use client';

import React from 'react';
import { AppLayout } from '@/components/AppLayout';
import { FiMessageSquare, FiHome } from 'react-icons/fi';
import { ChatProvider } from '@/hooks/chat';

export default function ChatLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const breadcrumbs = [
    {
      label: 'Home', // This label is used for identification, not display
      href: '/home',
      icon: FiHome,
    },
    {
      label: 'Chat',
      href: '/chat',
      icon: FiMessageSquare,
      isActive: true,
    },
  ];

  return (
    <AppLayout 
      appName="Chat" 
      appIcon={FiMessageSquare} 
      breadcrumbs={breadcrumbs}
      showFooter={true}
    >
      <ChatProvider>
        {children}
      </ChatProvider>
    </AppLayout>
  );
} 