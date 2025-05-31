'use client';

import React from 'react';
import { AppLayout } from '@/components/AppLayout';
import { FiFileText } from 'react-icons/fi';
import { DocumentsProvider } from '@/hooks/documents';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AppLayout appName="Ghostwriter" appIcon={FiFileText}>
      <DocumentsProvider>
        {children}
      </DocumentsProvider>
    </AppLayout>
  );
} 