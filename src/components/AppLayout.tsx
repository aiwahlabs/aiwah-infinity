'use client';

import { Box, Flex, Skeleton, SkeletonText, VStack, HStack } from '@chakra-ui/react';
import { ReactNode } from 'react';
import { AppHeader } from './AppHeader';
import { Footer } from './Footer';
import { useNavigationLoading } from './NavigationLoadingProvider';

interface AppLayoutProps {
  children: ReactNode;
  appName: string;
  appIcon?: React.ElementType;
  appIconSrc?: string;
  showHeader?: boolean;
  showFooter?: boolean;
  showSkeleton?: boolean;
}

// Simple skeleton content that adapts to different layouts
function AppSkeleton() {
  return (
    <Box h="100%" bg="gray.800" p={6}>
      <VStack spacing={6} align="stretch" h="100%">
        {/* Header area */}
        <HStack spacing={4}>
          <Skeleton height="40px" width="200px" borderRadius="md" />
          <Box flex="1" />
          <Skeleton height="40px" width="120px" borderRadius="md" />
          <Skeleton height="40px" width="80px" borderRadius="md" />
        </HStack>
        
        {/* Navigation/Tabs area */}
        <HStack spacing={6}>
          <Skeleton height="32px" width="100px" borderRadius="md" />
          <Skeleton height="32px" width="120px" borderRadius="md" />
          <Skeleton height="32px" width="90px" borderRadius="md" />
        </HStack>
        
        {/* Main content area */}
        <Box flex="1">
          <Flex h="100%" gap={6}>
            {/* Optional sidebar/left panel */}
            <Box w="300px" minW="300px">
              <VStack spacing={4} align="stretch">
                <Skeleton height="40px" borderRadius="md" />
                <VStack spacing={2} align="stretch">
                  {[...Array(6)].map((_, i) => (
                    <Skeleton key={i} height="32px" borderRadius="sm" />
                  ))}
                </VStack>
              </VStack>
            </Box>
            
            {/* Main content */}
            <Box flex="1" bg="gray.700" borderRadius="lg" p={6}>
              <VStack spacing={4} align="stretch" h="100%">
                <Skeleton height="32px" width="60%" borderRadius="md" />
                <SkeletonText mt="4" noOfLines={2} spacing="4" skeletonHeight="2" />
                <Box flex="1" mt={6}>
                  <VStack spacing={4} align="stretch">
                    <Skeleton height="120px" borderRadius="md" />
                    <Skeleton height="80px" borderRadius="md" />
                    <Skeleton height="100px" borderRadius="md" />
                  </VStack>
                </Box>
              </VStack>
            </Box>
          </Flex>
        </Box>
      </VStack>
    </Box>
  );
}

export function AppLayout({ 
  children, 
  appName, 
  appIcon, 
  appIconSrc,
  showHeader = true,
  showFooter = true,
  showSkeleton = false
}: AppLayoutProps) {
  const { isNavigating } = useNavigationLoading();
  
  // Show skeleton if explicitly requested or during navigation
  const shouldShowSkeleton = showSkeleton || isNavigating;

  return (
    <Flex 
      direction="column" 
      height="100vh"
      bg="gray.800"
      overflow="hidden"
    >
      {showHeader && (
        <AppHeader 
          appName={appName} 
          appIcon={appIcon} 
          appIconSrc={appIconSrc}
        />
      )}
      <Box 
        as="main" 
        flex="1" 
        overflow="hidden"
        position="relative"
      >
        {shouldShowSkeleton ? <AppSkeleton /> : children}
      </Box>
      {showFooter && <Footer />}
    </Flex>
  );
} 