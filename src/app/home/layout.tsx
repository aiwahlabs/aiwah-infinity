'use client';

import React from 'react';
import { AppLayout } from '@/components/AppLayout';
import { FiHome } from 'react-icons/fi';

export default function HomeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AppLayout appName="Home" appIcon={FiHome} variant="home" showFooter={true}>
      {children}
    </AppLayout>
  );
} 