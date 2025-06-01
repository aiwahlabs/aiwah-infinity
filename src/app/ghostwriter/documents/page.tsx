'use client';

import React from 'react';
import { Box } from '@chakra-ui/react';
import { AuthGuard } from '@/components/AuthGuard';
import { DocumentsTab } from '../components';
import { useSearchParams } from 'next/navigation';
import { DocumentStatus } from '@/hooks/documents';

export default function DocumentsPage() {
  const searchParams = useSearchParams();
  const statusParam = searchParams.get('status') as DocumentStatus | null;

  return (
    <AuthGuard>
      <Box h="100%" overflow="auto" p={8}>
        <DocumentsTab 
          title="Documents"
          description="Manage all your content"
          defaultStatus={statusParam || undefined}
        />
      </Box>
    </AuthGuard>
  );
} 