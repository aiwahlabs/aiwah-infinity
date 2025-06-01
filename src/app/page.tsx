'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@saas-ui/auth';
import { AuthGuard } from '@/components/AuthGuard';

export default function Home() {
  const router = useRouter();
  const { isAuthenticated, isLoading } = useAuth();

  useEffect(() => {
    // Redirect authenticated users to dashboard
    if (!isLoading && isAuthenticated) {
      router.push('/dashboard');
    }
  }, [isAuthenticated, isLoading, router]);

  return (
    <AuthGuard requireAuth={false}>
      {/* Simple entry point - will redirect to /login if not authenticated or /dashboard if authenticated */}
      <div style={{ 
        height: '100vh', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        backgroundColor: '#1A202C'
      }}>
        <div style={{ color: 'white', fontSize: '18px' }}>
          Welcome to Infinity...
        </div>
      </div>
    </AuthGuard>
  );
}
