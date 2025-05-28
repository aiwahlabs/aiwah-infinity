'use client';

import React from 'react';
import { AppLayout } from '@/components/AppLayout';
import { FiFileText } from 'react-icons/fi';
import { DocumentsProvider } from '@/hooks/documents';
import { useAuth } from '@saas-ui/auth';
import { redirect } from 'next/navigation';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isAuthenticated, isLoading } = useAuth();

  // Show loading screen or redirect while checking authentication status
  // If still loading, the page content won't be rendered yet by parent or this component will wait.
  // If not loading and not authenticated, redirect to login.
  if (!isLoading && !isAuthenticated) {
    redirect('/login');
  }
  
  // Note: If `isLoading` is true, this component might still render its children,
  // relying on a parent component or the page itself to show a loading indicator.
  // For a consistent loading experience across all authenticated routes,
  // a top-level layout or individual pages should handle the `isLoading` state.
  // This layout primarily handles redirection if not authenticated *after* loading is complete.

  return (
    <AppLayout appName="Ghostwriter" appIcon={FiFileText}>
      <DocumentsProvider>
        {children}
      </DocumentsProvider>
    </AppLayout>
  );
} 