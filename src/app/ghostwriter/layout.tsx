'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import { AppLayout } from '@/components/AppLayout';
import { FiFileText, FiHome, FiEdit3, FiPlusCircle } from 'react-icons/fi';
import { DocumentsProvider } from '@/hooks/documents';
import { AuthGuard } from '@/components/AuthGuard';

export default function GhostwriterLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  // Generate dynamic breadcrumbs based on current pathname
  const getBreadcrumbs = () => {
    const breadcrumbs = [
      {
        label: 'Home', // This label is used for identification, not display
        href: '/home',
        icon: FiHome,
      },
      {
        label: 'Ghostwriter',
        href: '/ghostwriter',
        icon: FiFileText,
        isActive: pathname === '/ghostwriter',
      },
    ];

    // Add sub-page breadcrumbs based on pathname
    if (pathname === '/ghostwriter/documents') {
      breadcrumbs.push({
        label: 'Documents',
        href: '/ghostwriter/documents',
        icon: FiFileText,
        isActive: true,
      });
    } else if (pathname === '/ghostwriter/documents/new') {
      breadcrumbs.push({
        label: 'Documents',
        href: '/ghostwriter/documents',
        icon: FiFileText,
        isActive: false,
      });
      breadcrumbs.push({
        label: 'New Document',
        href: '/ghostwriter/documents/new',
        icon: FiPlusCircle,
        isActive: true,
      });
    } else if (pathname.startsWith('/ghostwriter/documents/') && pathname !== '/ghostwriter/documents/new') {
      breadcrumbs.push({
        label: 'Documents',
        href: '/ghostwriter/documents',
        icon: FiFileText,
        isActive: false,
      });
      breadcrumbs.push({
        label: 'Edit Document',
        href: pathname,
        icon: FiEdit3,
        isActive: true,
      });
    }

    return breadcrumbs;
  };

  return (
    <AuthGuard>
      <DocumentsProvider>
        <AppLayout 
          appName="Ghostwriter" 
          appIcon={FiFileText} 
          breadcrumbs={getBreadcrumbs()}
        >
          {children}
        </AppLayout>
      </DocumentsProvider>
    </AuthGuard>
  );
} 