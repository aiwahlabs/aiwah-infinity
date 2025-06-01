'use client';

import { Box, VStack, HStack } from '@chakra-ui/react';
import { DashboardSkeleton, ListSkeleton, CardSkeleton, TableSkeleton } from '@/components/ui/skeletons';

// Dashboard Overview Loading
export function DashboardOverviewLoading() {
  return <DashboardSkeleton />;
}

// Documents Tab Loading
export function DocumentsTabLoading() {
  return (
    <Box>
      {/* Header skeleton */}
      <Box mb={6}>
        <Box height="32px" width="200px" bg="gray.700" borderRadius="md" mb={2} />
        <Box height="16px" width="300px" bg="gray.700" borderRadius="md" />
      </Box>
      
      {/* Search and filters skeleton */}
      <Box mb={6} p={4} bg="gray.800" borderRadius="lg" borderWidth="1px" borderColor="gray.700">
        <HStack spacing={4} mb={4}>
          <Box flex="1" height="40px" bg="gray.700" borderRadius="md" />
          <Box height="40px" width="40px" bg="gray.700" borderRadius="md" />
        </HStack>
        <HStack spacing={2}>
          <Box height="40px" width="200px" bg="gray.700" borderRadius="md" />
          <Box height="40px" width="200px" bg="gray.700" borderRadius="md" />
        </HStack>
      </Box>
      
      {/* Table skeleton */}
      <TableSkeleton rows={5} columns={6} />
    </Box>
  );
}

// Document Detail Loading
export function DocumentDetailLoading() {
  return <CardSkeleton />;
}

// Approved Posts Tab Loading
export function ApprovedPostsLoading() {
  return <ListSkeleton count={5} />;
}

// Recent Drafts Tab Loading
export function RecentDraftsLoading() {
  return <ListSkeleton count={5} />;
}

// Document Form Loading (for editing/creating)
export function DocumentFormLoading() {
  return (
    <VStack spacing={6} align="stretch">
      {/* Header */}
      <HStack spacing={4} mb={4}>
        <Box height="40px" width="120px" bg="gray.700" borderRadius="md" />
        <Box flex={1} />
        <Box height="40px" width="100px" bg="gray.700" borderRadius="md" />
        <Box height="40px" width="100px" bg="gray.700" borderRadius="md" />
      </HStack>
      
      {/* Title */}
      <Box height="60px" width="70%" bg="gray.700" borderRadius="md" />
      
      {/* Content areas */}
      <HStack spacing={6} align="start">
        <Box flex="1" height="300px" bg="gray.700" borderRadius="md" />
        <Box flex="1" height="300px" bg="gray.700" borderRadius="md" />
      </HStack>
      
      {/* Notes area */}
      <Box height="200px" bg="gray.700" borderRadius="md" />
      
      {/* Form fields */}
      <HStack spacing={6} align="start">
        <Box flex="1" height="200px" bg="gray.700" borderRadius="md" />
        <Box flex="1" height="200px" bg="gray.700" borderRadius="md" />
      </HStack>
    </VStack>
  );
} 