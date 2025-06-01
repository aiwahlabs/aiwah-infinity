'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import { AppLayout } from '@/components/AppLayout';
import { FiFileText, FiHome, FiEdit3, FiCheckCircle, FiPlusCircle } from 'react-icons/fi';
import { DocumentsProvider } from '@/hooks/documents';

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
    if (pathname === '/ghostwriter/drafts') {
      breadcrumbs.push({
        label: 'Drafts',
        href: '/ghostwriter/drafts',
        icon: FiEdit3,
        isActive: true,
      });
    } else if (pathname === '/ghostwriter/approved') {
      breadcrumbs.push({
        label: 'Approved',
        href: '/ghostwriter/approved',
        icon: FiCheckCircle,
        isActive: true,
      });
    } else if (pathname === '/ghostwriter/all') {
      breadcrumbs.push({
        label: 'All Documents',
        href: '/ghostwriter/all',
        icon: FiFileText,
        isActive: true,
      });
    } else if (pathname === '/ghostwriter/document/new') {
      breadcrumbs.push({
        label: 'New Document',
        href: '/ghostwriter/document/new',
        icon: FiPlusCircle,
        isActive: true,
      });
    } else if (pathname.startsWith('/ghostwriter/document/') && pathname !== '/ghostwriter/document/new') {
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
    <DocumentsProvider>
      <AppLayout 
        appName="Ghostwriter" 
        appIcon={FiFileText} 
        breadcrumbs={getBreadcrumbs()}
      >
        {children}
      </AppLayout>
    </DocumentsProvider>
  );
} 