'use client';

import { ReactNode, useEffect, useState } from 'react';
import { useAuth } from '@saas-ui/auth';
import { useRouter, usePathname } from 'next/navigation';
import { useToast } from '@chakra-ui/react';
import { HomePageLoading } from '@/app/components/loading/HomeLoading';

interface AuthGuardProps {
  children: ReactNode;
  requireAuth?: boolean;
  redirectTo?: string;
  fallback?: ReactNode;
}

export function AuthGuard({ 
  children, 
  requireAuth = true, 
  redirectTo = '/login',
  fallback
}: AuthGuardProps) {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const toast = useToast();
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    // Short delay to ensure auth state is stable
    const timer = setTimeout(() => {
      setIsInitialized(true);
    }, 50);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!isInitialized || isLoading) return;

    if (requireAuth && !isAuthenticated) {
      // Store the current path for redirect after login
      if (pathname !== '/login' && pathname !== '/signup') {
        sessionStorage.setItem('redirectAfterLogin', pathname);
      }
      
      // Show toast notification for auth requirement
      toast({
        title: 'Authentication required',
        description: 'Please sign in to access this page.',
        status: 'info',
        duration: 3000,
        isClosable: true,
      });
      
      router.push(redirectTo);
    } else if (!requireAuth && isAuthenticated && (pathname === '/login' || pathname === '/signup')) {
      // Redirect authenticated users away from auth pages
      const redirectPath = sessionStorage.getItem('redirectAfterLogin') || '/';
      sessionStorage.removeItem('redirectAfterLogin');
      router.push(redirectPath);
    }
  }, [isAuthenticated, isLoading, isInitialized, requireAuth, redirectTo, router, pathname, toast]);

  // Show loading during auth state resolution
  if (!isInitialized || isLoading) {
    return fallback || <HomePageLoading />;
  }

  // For auth-required pages, show loading while redirecting
  if (requireAuth && !isAuthenticated) {
    return fallback || <HomePageLoading />;
  }

  // For non-auth pages (login/signup), show loading while redirecting
  if (!requireAuth && isAuthenticated && (pathname === '/login' || pathname === '/signup')) {
    return fallback || <HomePageLoading />;
  }

  return <>{children}</>;
} 