'use client';

import { ReactNode, useEffect, useState } from 'react';
import { useAuth } from '@saas-ui/auth';
import { useRouter, usePathname } from 'next/navigation';
import { FullScreenLoading } from '@/components/ui';

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
  if (!isInitialized || isLoading) {
    return fallback || (
      <FullScreenLoading 
        message="Checking authentication..."
        size="lg"
      />
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