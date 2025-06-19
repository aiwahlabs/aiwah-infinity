'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@saas-ui/auth';
import { AppLoading } from '@/components/AppLoading';

export default function Home() {
  const router = useRouter();
  const { isAuthenticated, isLoading, user } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const [debugLogs, setDebugLogs] = useState<string[]>([]);

  const addLog = (log: string) => {
    const timestamp = new Date().toLocaleTimeString();
    setDebugLogs(prev => [...prev, `${timestamp}: ${log}`]);
    
    // Always log to console for debugging
    console.log(`[PAGE] ${log}`);
  };

  useEffect(() => {
    try {
      addLog('Page mounted - checking authentication state');
      addLog(`Auth loading: ${isLoading}, Authenticated: ${isAuthenticated}, User: ${user ? user.email || 'present' : 'none'}`);

      if (isLoading) {
        addLog('Waiting for authentication to complete...');
        return;
      }

      // Auth has finished loading, now decide where to go
      if (isAuthenticated) {
        addLog('User is authenticated - redirecting to /home');
        router.push('/home');
      } else {
        addLog('User is not authenticated - redirecting to /login');
        router.push('/login');
      }
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      addLog(`ERROR: ${errorMessage}`);
      setError(errorMessage);
    }
  }, [isAuthenticated, isLoading, router, user]);

  // Handle any errors that occur
  if (error) {
    return (
      <AppLoading
        stage="error"
        message="An error occurred"
        error={error}
        onRetry={() => {
          setError(null);
          setDebugLogs([]);
          window.location.reload();
        }}
        debugLogs={debugLogs}
      />
    );
  }

  // Show loading while we decide what to do
  const getMessage = () => {
    if (isLoading) return 'Checking authentication...';
    if (isAuthenticated) return 'Redirecting to home...';
    return 'Redirecting to login...';
  };

  const getStage = () => {
    if (isLoading) return 'auth-check';
    if (isAuthenticated) return 'redirecting-home';
    return 'redirecting-login';
  };

  return (
    <AppLoading
      stage={getStage()}
      message={getMessage()}
      debugLogs={debugLogs}
    />
  );
}
