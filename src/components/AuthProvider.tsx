'use client';

import { ReactNode, useEffect, useState } from 'react';
import { AuthProvider as SaasAuthProvider } from '@saas-ui/auth';
import { createAuthService } from '@saas-ui/supabase';
import { supabaseBrowser } from '@/lib/supabase/browser';
import { AppLoading } from './AppLoading';

interface AuthProviderProps {
  children: ReactNode;
}

interface AuthState {
  isInitialized: boolean;
  isLoading: boolean;
  error: string | null;
  stage: 'starting' | 'creating-client' | 'testing-connection' | 'creating-service' | 'ready' | 'error' | 'timeout';
  debugLogs: string[];
}

// Enhanced logging utility - only logs if debug mode is on
const logger = {
  info: (stage: string, message: string, data?: unknown) => {
    if (process.env.NEXT_PUBLIC_DEBUG_MODE === 'on') {
      const timestamp = new Date().toISOString();
      console.log(`[AUTH-${timestamp}] ${stage}: ${message}`, data || '');
    }
  },
  error: (stage: string, message: string, error?: Error | unknown) => {
    if (process.env.NEXT_PUBLIC_DEBUG_MODE === 'on') {
      const timestamp = new Date().toISOString();
      console.error(`[AUTH-ERROR-${timestamp}] ${stage}: ${message}`, error || '');
    }
  },
  warn: (stage: string, message: string, data?: unknown) => {
    if (process.env.NEXT_PUBLIC_DEBUG_MODE === 'on') {
      const timestamp = new Date().toISOString();
      console.warn(`[AUTH-WARN-${timestamp}] ${stage}: ${message}`, data || '');
    }
  }
};

// Internal provider that uses browser-specific APIs
function InternalAuthProvider({ children }: AuthProviderProps) {
  const [authState, setAuthState] = useState<AuthState>({
    isInitialized: false,
    isLoading: true,
    error: null,
    stage: 'starting',
    debugLogs: []
  });

  const addDebugLog = (log: string) => {
    if (process.env.NEXT_PUBLIC_DEBUG_MODE === 'on') {
      const timestamp = new Date().toLocaleTimeString();
      setAuthState(prev => ({
        ...prev,
        debugLogs: [...prev.debugLogs, `${timestamp}: ${log}`]
      }));
    }
  };

  const updateStage = (stage: AuthState['stage'], log?: string) => {
    logger.info('STAGE', `Moving to stage: ${stage}`, log);
    setAuthState(prev => ({
      ...prev,
      stage
    }));
    if (log) addDebugLog(log);
  };

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    let isComponentMounted = true;

    const initializeAuth = async () => {
      try {
        logger.info('INIT', 'Starting auth initialization');
        addDebugLog('Starting authentication initialization');

        // Set timeout for the entire initialization process
        timeoutId = setTimeout(() => {
          if (isComponentMounted) {
            logger.error('TIMEOUT', 'Auth initialization timeout after 10 seconds');
            setAuthState(prev => ({
              ...prev,
              stage: 'timeout',
              error: 'Authentication took too long to initialize',
              isLoading: false
            }));
          }
        }, 10000);

        updateStage('creating-client', 'Creating Supabase client');

        // Check environment variables
        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
        const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
        
        if (!supabaseUrl || !supabaseKey) {
          throw new Error(`Missing Supabase environment variables: ${!supabaseUrl ? 'URL ' : ''}${!supabaseKey ? 'KEY' : ''}`);
        }

        addDebugLog(`Environment variables validated`);

        // Create Supabase client
        const supabase = supabaseBrowser();
        logger.info('CLIENT', 'Supabase client created successfully');
        addDebugLog('Supabase client created');

        updateStage('testing-connection', 'Testing connection');

        // Quick connection test
        try {
          const { error: connectionError } = await supabase.auth.getSession();
          if (connectionError) {
            logger.warn('CONNECTION', 'Session check warning', connectionError);
            addDebugLog(`Connection warning: ${connectionError.message}`);
          } else {
            addDebugLog('Connection test successful');
          }
        } catch (connectionTestError: unknown) {
          logger.error('CONNECTION', 'Connection test failed', connectionTestError);
          addDebugLog('Connection test failed - continuing anyway');
        }

        updateStage('creating-service', 'Setting up authentication service');

        // Create auth service
        const origin = typeof window !== 'undefined' ? window.location.origin : '';
        addDebugLog(`Using origin: ${origin}`);

        logger.info('SERVICE', 'Auth service will be created after initialization');
        addDebugLog('Auth service setup complete');

        // Small delay to ensure everything is properly set up
        await new Promise(resolve => setTimeout(resolve, 100));

        if (isComponentMounted) {
          updateStage('ready', 'Authentication ready');
          setAuthState(prev => ({
            ...prev,
            isInitialized: true,
            isLoading: false,
            error: null,
            stage: 'ready'
          }));
          logger.info('SUCCESS', 'Auth initialization completed successfully');
        }

      } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : 'Authentication initialization failed';
        logger.error('ERROR', 'Auth initialization failed', error);
        if (isComponentMounted) {
          setAuthState(prev => ({
            ...prev,
            stage: 'error',
            error: errorMessage,
            isLoading: false
          }));
          addDebugLog(`ERROR: ${errorMessage}`);
        }
      } finally {
        if (timeoutId) {
          clearTimeout(timeoutId);
        }
      }
    };

    initializeAuth();

    return () => {
      isComponentMounted = false;
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, []);

  // Show loading state using unified component
  if (!authState.isInitialized) {
    const getMessage = () => {
      switch (authState.stage) {
        case 'starting': return 'Starting up...';
        case 'creating-client': return 'Connecting to services...';
        case 'testing-connection': return 'Testing connection...';
        case 'creating-service': return 'Setting up authentication...';
        case 'ready': return 'Almost ready...';
        case 'error': return 'Authentication Error';
        case 'timeout': return 'Connection Timeout';
        default: return 'Initializing...';
      }
    };

    return (
      <AppLoading
        stage={authState.stage}
        message={getMessage()}
        error={authState.error}
        onRetry={authState.error ? () => window.location.reload() : undefined}
        debugLogs={authState.debugLogs}
      />
    );
  }

  // Create auth service only after successful initialization
  const origin = typeof window !== 'undefined' ? window.location.origin : '';
  const supabase = supabaseBrowser();
  const authService = createAuthService(supabase, {
    loginOptions: {
      redirectTo: `${origin}/auth/callback`,
    },
    signupOptions: {
      emailRedirectTo: `${origin}/auth/callback`,
    },
  });

  return <SaasAuthProvider {...authService}>{children}</SaasAuthProvider>;
}

// Public-facing component that ensures children are always rendered
export function AuthProvider({ children }: AuthProviderProps) {
  return (
    <InternalAuthProvider>{children}</InternalAuthProvider>
  );
} 