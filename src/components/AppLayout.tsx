'use client';

import { Box, Flex, Skeleton, VStack } from '@chakra-ui/react';
import { ReactNode } from 'react';
import { AppHeader, BreadcrumbItem } from './AppHeader';
import { Footer } from './Footer';
import { useNavigationLoading } from './NavigationLoadingProvider';

interface AppLayoutProps {
  children: ReactNode;
  appName: string;
  appIcon?: React.ElementType;
  appIconSrc?: string;
  variant?: 'app' | 'home';
  showHeader?: boolean;
  showFooter?: boolean;
  showSkeleton?: boolean;
  breadcrumbs?: BreadcrumbItem[];
}

// Very simple generic skeleton that could be anything
function AppSkeleton() {
  return (
    <Box h="100%" bg="gray.800" p={8} overflow="hidden">
      <VStack spacing={8} align="stretch" h="100%">
        {/* Generic blocks that could be anything */}
        <Skeleton height="60px" borderRadius="lg" />
        <Skeleton height="40px" width="70%" borderRadius="lg" />
        <Box flex="1" overflow="hidden">
          <VStack spacing={6} h="100%">
            <Skeleton height="100px" borderRadius="lg" />
            <Skeleton height="80px" borderRadius="lg" />
            <Skeleton height="120px" borderRadius="lg" />
          </VStack>
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
  variant = 'app',
  showHeader = true,
  showFooter = true,
  showSkeleton = false,
  breadcrumbs
}: AppLayoutProps) {
  const { isNavigating } = useNavigationLoading();
  
  // Show skeleton if explicitly requested or during navigation
  const shouldShowSkeleton = showSkeleton || isNavigating;

  return (
    <Flex 
      direction="column" 
      height="100vh"
      width="100vw"
      bg="gray.800"
      overflow="hidden"
      position="fixed"
      top={0}
      left={0}
    >
      {showHeader && (
        <AppHeader 
          appName={appName} 
          appIcon={appIcon} 
          appIconSrc={appIconSrc}
          variant={variant}
          breadcrumbs={breadcrumbs}
        />
      )}
      <Box 
        as="main" 
        flex="1" 
        overflow="hidden"
        position="relative"
        height="100%"
      >
        {shouldShowSkeleton ? <AppSkeleton /> : children}
      </Box>
      {showFooter && <Footer />}
    </Flex>
  );
} 