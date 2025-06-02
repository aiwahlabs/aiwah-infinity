'use client';

import React from 'react';
import { Box } from '@chakra-ui/react';
import { AuthGuard } from '@/components/AuthGuard';
import { DocumentsTab } from '../components';
import { useRouter } from 'next/navigation';
import { Document } from '@/hooks/documents/types';

export default function DocumentsPage() {
  const router = useRouter();

  const handleCreateDocument = () => {
    router.push('/ghostwriter/documents/new');
  };

  const handleEditDocument = (document: Document) => {
    router.push(`/ghostwriter/documents/${document.id}`);
  };

  const handleViewDocument = (document: Document) => {
    router.push(`/ghostwriter/documents/${document.id}`);
  };

  return (
    <AuthGuard>
      <Box h="100%" overflow="auto" p={8}>
        <DocumentsTab 
          onCreateDocument={handleCreateDocument}
          onEditDocument={handleEditDocument}
          onViewDocument={handleViewDocument}
        />
      </Box>
    </AuthGuard>
  );
} 