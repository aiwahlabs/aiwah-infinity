import { Skeleton, SkeletonText, Box, VStack, HStack } from '@chakra-ui/react';

// Card Skeleton
export function CardSkeleton() {
  return (
    <Box p={4} borderWidth="1px" borderRadius="lg" overflow="hidden">
      <Skeleton height="20px" mb={2} />
      <SkeletonText noOfLines={3} spacing="2" skeletonHeight="16px" />
      <Skeleton height="40px" mt={4} width="80%" />
    </Box>
  );
}

// List Skeleton
export function ListSkeleton({ count = 3 }: { count?: number }) {
  return (
    <Box>
      {Array.from({ length: count }).map((_, i) => (
        <Skeleton key={i} height="40px" mb={2} />
      ))}
    </Box>
  );
}

// Inline Skeleton (for text/buttons)
export function InlineSkeleton() {
  return <Skeleton height="20px" width="100px" />;
}

// Table Skeleton
export function TableSkeleton({ rows = 5, columns = 4 }: { rows?: number; columns?: number }) {
  return (
    <Box>
      <Skeleton height="40px" mb={2} />
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <HStack key={rowIndex} spacing={2} mb={2}>
          {Array.from({ length: columns }).map((_, colIndex) => (
            <Skeleton key={colIndex} height="30px" flex="1" />
          ))}
        </HStack>
      ))}
    </Box>
  );
}

// Profile Skeleton
export function ProfileSkeleton() {
  return (
    <Box p={4} borderWidth="1px" borderRadius="lg">
      <HStack spacing={4}>
        <Skeleton height="80px" width="80px" borderRadius="full" />
        <VStack align="start" flex="1">
          <Skeleton height="20px" width="150px" />
          <Skeleton height="16px" width="100px" />
          <SkeletonText noOfLines={2} spacing="2" skeletonHeight="14px" width="80%" />
        </VStack>
      </HStack>
    </Box>
  );
}

// Dashboard Skeleton
export function DashboardSkeleton() {
  return (
    <Box>
      <Skeleton height="40px" mb={4} width="200px" />
      <HStack spacing={4} mb={4}>
        <CardSkeleton />
        <CardSkeleton />
      </HStack>
      <Box mb={4}>
        <Skeleton height="200px" />
      </Box>
      <TableSkeleton rows={3} />
    </Box>
  );
}

// Chat Skeleton
export function ChatSkeleton() {
  return (
    <Box p={4}>
      {Array.from({ length: 6 }).map((_, i) => (
        <Box key={i} mb={4} display="flex" justifyContent={i % 2 === 0 ? "flex-start" : "flex-end"}>
          <Box
            maxW="70%"
            p={3}
            bg={i % 2 === 0 ? "gray.700" : "teal.600"}
            borderRadius="lg"
          >
            <SkeletonText 
              noOfLines={Math.floor(Math.random() * 3) + 1} 
              spacing="2" 
              skeletonHeight="16px" 
            />
          </Box>
        </Box>
      ))}
    </Box>
  );
}

// Sidebar Skeleton
export function SidebarSkeleton() {
  return (
    <VStack spacing={2} align="stretch" p={4}>
      <Skeleton height="40px" mb={4} />
      {Array.from({ length: 8 }).map((_, i) => (
        <HStack key={i} spacing={3} p={3} borderRadius="md">
          <Skeleton height="32px" width="32px" borderRadius="md" />
          <VStack align="start" spacing={1} flex={1}>
            <Skeleton height="16px" width="80%" />
            <Skeleton height="12px" width="60%" />
          </VStack>
        </HStack>
      ))}
    </VStack>
  );
} 