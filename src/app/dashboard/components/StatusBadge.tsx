'use client';

import { Badge } from '@chakra-ui/react';
import { DocumentStatus } from '@/hooks/documents';

export function StatusBadge({ status }: { status: DocumentStatus | null }) {
  const colorScheme = 
    status === 'draft' ? 'yellow' : 
    status === 'approved' ? 'green' :
    status === 'published' ? 'blue' :
    status === 'rejected' ? 'red' : 'gray';
  
  return (
    <Badge colorScheme={colorScheme} textTransform="capitalize">
      {status || 'unknown'}
    </Badge>
  );
} 