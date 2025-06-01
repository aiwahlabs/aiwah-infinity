'use client';

import { Box, Flex, Button, HStack, Skeleton, SkeletonText, VStack } from '@chakra-ui/react';
import { ReactNode } from 'react';
import { AppHeader } from './AppHeader';
import { Footer } from './Footer';
import { useAuth } from '@saas-ui/auth';
import { usePathname, useRouter } from 'next/navigation';
import { useNavigationLoading } from './NavigationLoadingProvider';

interface LayoutContainerProps {
  children: ReactNode;
}

// Simple skeleton for main page layout
function MainPageSkeleton() {
  return (
    <Box h="100%" bg="gray.900" p={6}>
      <VStack spacing={8} align="stretch" h="100%" justify="center" maxW="container.xl" mx="auto">
        {/* Header skeleton */}
        <Box textAlign="center">
          <Skeleton height="40px" width="300px" mx="auto" borderRadius="md" />
        </Box>
        
        {/* Cards grid skeleton */}
        <Flex justify="center" gap={8} wrap="wrap">
          {[...Array(3)].map((_, i) => (
            <Box key={i} w="300px" h="200px">
              <Skeleton height="100%" borderRadius="lg" />
            </Box>
          ))}
        </Flex>
      </VStack>
    </Box>
  );
}

export function LayoutContainer({ children }: LayoutContainerProps) {
  const pathname = usePathname();
  const isAuthPage = pathname === '/login' || pathname === '/signup';
  const { isAuthenticated, logOut } = useAuth();
  const router = useRouter();
  const { isNavigating } = useNavigationLoading();

  const handleLogout = async () => {
    await logOut();
    router.push('/login');
  };

  const authControls = (
    <HStack spacing={4}>
      {isAuthenticated ? (
        <Button 
          onClick={handleLogout} 
          colorScheme="red" 
          variant="outline"
          size="sm"
          _hover={{
            bg: 'red.900',
            borderColor: 'red.500'
          }}
        >
          Logout
        </Button>
      ) : (
        <Button 
          as="a"
          href="/login"
          variant="ghost" 
          color="gray.300"
          size="sm"
          _hover={{
            bg: 'gray.800',
            color: 'white'
          }}
        >
          Login
        </Button>
      )}
    </HStack>
  );
  
  return (
    <Flex 
      direction="column" 
      height="100vh"
      bg="gray.900"
      overflow="hidden"
    >
      {!isAuthPage && (
        <AppHeader 
          appName="Infinity" 
          appIconSrc="/aiwah-logo.svg"
          variant="home"
          rightContent={authControls}
        />
      )}
      <Box 
        as="main" 
        flex="1" 
        overflow="auto"
        position="relative"
      >
        {isNavigating ? <MainPageSkeleton /> : children}
      </Box>
      {!isAuthPage && <Footer />}
    </Flex>
  );
} 