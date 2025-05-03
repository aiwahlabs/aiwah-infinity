'use client';

import React from 'react';
import { AppLayout } from '@/components/AppLayout';
import { FiGrid } from 'react-icons/fi';
import { DocumentsProvider } from '@/hooks/documents';
import { useAuth } from '@saas-ui/auth';
import { redirect } from 'next/navigation';

export default function DashboardLayout({
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
    <AppLayout appName="Ghostwriter" appIcon={FiGrid}>
      <DocumentsProvider>
        {children}
      </DocumentsProvider>
    </AppLayout>
  );
} 