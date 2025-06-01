'use client';

import React from 'react';
import { AppLayout } from '@/components/AppLayout';
import { FiGrid } from 'react-icons/fi';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AppLayout appName="Dashboard" appIcon={FiGrid} showFooter={true}>
      {children}
    </AppLayout>
  );
} 