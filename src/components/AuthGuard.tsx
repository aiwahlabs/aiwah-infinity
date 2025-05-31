'use client';

import { ReactNode, useEffect, useState } from 'react';
import { useAuth } from '@saas-ui/auth';
import { useRouter, usePathname } from 'next/navigation';
import { Center, Spinner, VStack, Text, Box } from '@chakra-ui/react';

interface AuthGuardProps {
  children: ReactNode;
  requireAuth?: boolean;
  redirectTo?: string;
  fallback?: ReactNode;
  preserveLayout?: boolean;
}

export function AuthGuard({ 
  children, 
  requireAuth = true, 
  redirectTo = '/login',
  fallback,
  preserveLayout = false
}: AuthGuardProps) {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    // Small delay to prevent flash and ensure auth state is stable
    const timer = setTimeout(() => {
      setIsInitialized(true);
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!isInitialized || isLoading) return;

    if (requireAuth && !isAuthenticated) {
      // Store the current path for redirect after login
      if (pathname !== '/login' && pathname !== '/signup') {
        sessionStorage.setItem('redirectAfterLogin', pathname);
      }
      router.push(redirectTo);
    } else if (!requireAuth && isAuthenticated && (pathname === '/login' || pathname === '/signup')) {
      // Redirect authenticated users away from auth pages
      const redirectPath = sessionStorage.getItem('redirectAfterLogin') || '/';
      sessionStorage.removeItem('redirectAfterLogin');
      router.push(redirectPath);
    }
  }, [isAuthenticated, isLoading, isInitialized, requireAuth, redirectTo, router, pathname]);

  // Show loading state while checking auth
  // Use a content-area loading instead of full-screen when preserveLayout is true
  if (!isInitialized || isLoading) {
    return fallback || (
      <Box 
        display="flex" 
        alignItems="center" 
        justifyContent="center" 
        h={preserveLayout ? "100%" : "100vh"} 
        bg={preserveLayout ? "transparent" : "gray.900"}
        position={preserveLayout ? "relative" : "fixed"}
        top={preserveLayout ? "auto" : 0}
        left={preserveLayout ? "auto" : 0}
        right={preserveLayout ? "auto" : 0}
        bottom={preserveLayout ? "auto" : 0}
        zIndex={preserveLayout ? 1 : 9999}
      >
        <VStack spacing={4}>
          <Spinner size="xl" color="teal.500" thickness="3px" />
          <Text color="gray.300" fontSize="lg">
            Checking authentication...
          </Text>
        </VStack>
      </Box>
    );
  }

  // For auth-required pages, don't render if not authenticated
  if (requireAuth && !isAuthenticated) {
    return null;
  }

  // For non-auth pages (login/signup), don't render if authenticated
  if (!requireAuth && isAuthenticated) {
    return null;
  }

  return <>{children}</>;
} 