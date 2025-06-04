'use client';

import { ReactNode, useEffect, useState } from 'react';
import { AuthProvider as SaasAuthProvider } from '@saas-ui/auth';
import { createAuthService } from '@saas-ui/supabase';
import { supabaseBrowser } from '@/lib/supabase/browser';
import { Box, VStack, Text, Spinner, Alert, AlertIcon, AlertTitle, AlertDescription, Button } from '@chakra-ui/react';

interface AuthProviderProps {
  children: ReactNode;
}

interface AuthState {
  isInitialized: boolean;
  isLoading: boolean;
  error: string | null;
  stage: 'starting' | 'creating-client' | 'creating-service' | 'initializing-auth' | 'ready' | 'error' | 'timeout';
  details: string[];
}

// Enhanced logging utility
const logger = {
  info: (stage: string, message: string, data?: any) => {
    const timestamp = new Date().toISOString();
    console.log(`[AUTH-${timestamp}] ${stage}: ${message}`, data || '');
  },
  error: (stage: string, message: string, error?: any) => {
    const timestamp = new Date().toISOString();
    console.error(`[AUTH-ERROR-${timestamp}] ${stage}: ${message}`, error || '');
  },
  warn: (stage: string, message: string, data?: any) => {
    const timestamp = new Date().toISOString();
    console.warn(`[AUTH-WARN-${timestamp}] ${stage}: ${message}`, data || '');
  }
};

// Internal provider that uses browser-specific APIs
function InternalAuthProvider({ children }: AuthProviderProps) {
  const [authState, setAuthState] = useState<AuthState>({
    isInitialized: false,
    isLoading: true,
    error: null,
    stage: 'starting',
    details: []
  });

  const addDetail = (detail: string) => {
    setAuthState(prev => ({
      ...prev,
      details: [...prev.details, `${new Date().toLocaleTimeString()}: ${detail}`]
    }));
  };

  const updateStage = (stage: AuthState['stage'], detail?: string) => {
    logger.info('STAGE', `Moving to stage: ${stage}`, detail);
    setAuthState(prev => ({
      ...prev,
      stage,
      details: detail ? [...prev.details, `${new Date().toLocaleTimeString()}: ${detail}`] : prev.details
    }));
  };

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    let isComponentMounted = true;

    const initializeAuth = async () => {
      try {
        logger.info('INIT', 'Starting auth initialization');
        addDetail('Starting authentication initialization');

        // Set timeout for the entire initialization process
        timeoutId = setTimeout(() => {
          if (isComponentMounted) {
            logger.error('TIMEOUT', 'Auth initialization timeout after 15 seconds');
            setAuthState(prev => ({
              ...prev,
              stage: 'timeout',
              error: 'Authentication initialization timed out. This might be due to network issues or configuration problems.',
              isLoading: false
            }));
          }
        }, 15000);

        updateStage('creating-client', 'Creating Supabase client');

        // Check environment variables
        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
        const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
        
        logger.info('ENV', 'Environment check', {
          hasUrl: !!supabaseUrl,
          hasKey: !!supabaseKey,
          urlLength: supabaseUrl?.length || 0,
          keyLength: supabaseKey?.length || 0,
          origin: typeof window !== 'undefined' ? window.location.origin : 'SSR'
        });

        if (!supabaseUrl || !supabaseKey) {
          throw new Error(`Missing Supabase environment variables: ${!supabaseUrl ? 'NEXT_PUBLIC_SUPABASE_URL ' : ''}${!supabaseKey ? 'NEXT_PUBLIC_SUPABASE_ANON_KEY' : ''}`);
        }

        addDetail(`Environment variables OK (URL: ${supabaseUrl.substring(0, 20)}...)`);

        // Create Supabase client
        const supabase = supabaseBrowser();
        logger.info('CLIENT', 'Supabase client created successfully');
        addDetail('Supabase client created');

        updateStage('creating-service', 'Creating auth service');

        // Test connection to Supabase with more detailed diagnostics
        try {
          addDetail('Testing Supabase connection...');
          const connectionStartTime = Date.now();
          
          const { data: connectionTest, error: connectionError } = await supabase.auth.getSession();
          const connectionTime = Date.now() - connectionStartTime;
          
          logger.info('CONNECTION', `Connection test completed in ${connectionTime}ms`, {
            hasError: !!connectionError,
            hasSession: !!connectionTest.session,
            connectionTime
          });

          if (connectionError) {
            logger.warn('CONNECTION', 'Session retrieval had error but continuing', connectionError);
            addDetail(`Session check warning: ${connectionError.message} (${connectionTime}ms)`);
            
            // If it's a network error, try a simple ping
            if (connectionError.message.includes('fetch') || connectionError.message.includes('network')) {
              try {
                addDetail('Testing basic connectivity...');
                const pingStartTime = Date.now();
                const response = await fetch(`${supabaseUrl}/rest/v1/`, {
                  method: 'HEAD',
                  headers: {
                    'apikey': supabaseKey,
                    'Authorization': `Bearer ${supabaseKey}`
                  }
                });
                const pingTime = Date.now() - pingStartTime;
                
                logger.info('PING', `Basic connectivity test: ${response.status}`, {
                  status: response.status,
                  statusText: response.statusText,
                  pingTime
                });
                addDetail(`Connectivity test: ${response.status} ${response.statusText} (${pingTime}ms)`);
              } catch (pingError: any) {
                logger.error('PING', 'Basic connectivity test failed', pingError);
                addDetail(`Connectivity test failed: ${pingError.message}`);
              }
            }
          } else {
            logger.info('CONNECTION', 'Successfully connected to Supabase', {
              hasSession: !!connectionTest.session,
              sessionId: connectionTest.session?.access_token ? 'present' : 'none',
              connectionTime
            });
            addDetail(`Connection test successful: ${connectionTest.session ? 'Found existing session' : 'No existing session'} (${connectionTime}ms)`);
          }
        } catch (connectionTestError: any) {
          logger.error('CONNECTION', 'Connection test threw exception', connectionTestError);
          addDetail(`Connection test error: ${connectionTestError.message}`);
          
          // Don't fail completely on connection test error, just log it
        }

        // Safe to use window here as this component will only be loaded on the client
        const origin = typeof window !== 'undefined' ? window.location.origin : '';
        logger.info('ORIGIN', 'Using origin for redirects', { origin });
        addDetail(`Redirect origin: ${origin}`);

        updateStage('initializing-auth', 'Setting up auth service');

        const authService = createAuthService(supabase, {
          loginOptions: {
            redirectTo: `${origin}/auth/callback`,
          },
          signupOptions: {
            emailRedirectTo: `${origin}/auth/callback`,
          },
        });

        logger.info('SERVICE', 'Auth service created successfully');
        addDetail('Auth service initialized');

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

      } catch (error: any) {
        logger.error('ERROR', 'Auth initialization failed', error);
        if (isComponentMounted) {
          setAuthState(prev => ({
            ...prev,
            stage: 'error',
            error: error.message || 'Unknown error during authentication initialization',
            isLoading: false,
            details: [...prev.details, `${new Date().toLocaleTimeString()}: ERROR - ${error.message}`]
          }));
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

  // Show detailed loading/error states
  if (!authState.isInitialized) {
    return (
      <Box minH="100vh" bg="gray.900" p={8}>
        <VStack spacing={6} maxW="lg" mx="auto" pt={20}>
          {authState.stage === 'error' || authState.stage === 'timeout' ? (
            <Alert status="error" borderRadius="lg">
              <AlertIcon />
              <Box>
                <AlertTitle>Authentication Error</AlertTitle>
                <AlertDescription>{authState.error}</AlertDescription>
              </Box>
            </Alert>
          ) : (
            <VStack spacing={4}>
              <Spinner size="lg" color="teal.500" thickness="3px" />
              <Text fontSize="lg" fontWeight="medium" color="white">
                Initializing Authentication...
              </Text>
              <Text fontSize="sm" color="gray.400" textAlign="center">
                Stage: {authState.stage.replace('-', ' ').toUpperCase()}
              </Text>
            </VStack>
          )}

          {/* Detailed logs for debugging */}
          <Box w="full" bg="gray.800" p={4} borderRadius="md" maxH="300px" overflowY="auto">
            <Text fontSize="sm" fontWeight="medium" color="gray.300" mb={2}>
              Initialization Log:
            </Text>
            <VStack align="start" spacing={1}>
              {authState.details.map((detail, index) => (
                <Text key={index} fontSize="xs" color="gray.400" fontFamily="mono">
                  {detail}
                </Text>
              ))}
            </VStack>
          </Box>

          {authState.stage === 'error' || authState.stage === 'timeout' ? (
            <Button
              colorScheme="teal"
              onClick={() => {
                setAuthState({
                  isInitialized: false,
                  isLoading: true,
                  error: null,
                  stage: 'starting',
                  details: []
                });
                window.location.reload();
              }}
            >
              Retry Initialization
            </Button>
          ) : null}
        </VStack>
      </Box>
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