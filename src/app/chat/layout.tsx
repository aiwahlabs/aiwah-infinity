'use client';

import React from 'react';
import { AppLayout } from '@/components/AppLayout';
import { FiMessageSquare } from 'react-icons/fi';
import { ChatProvider } from '@/hooks/chat';

export default function ChatLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AppLayout appName="Chat" appIcon={FiMessageSquare} showFooter={true}>
      <ChatProvider>
        {children}
      </ChatProvider>
    </AppLayout>
  );
} 