'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@saas-ui/auth';
import { AuthGuard } from '@/components/AuthGuard';
import { 
  Box, 
  VStack, 
  Text, 
  Spinner, 
  Image,
  Center,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  Button,
  Collapse,
  HStack,
  Badge
} from '@chakra-ui/react';
import { keyframes } from '@emotion/react';

// Subtle fade-in animation for the loading content
const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
`;

interface LoadingState {
  stage: 'initializing' | 'auth-loading' | 'auth-ready' | 'redirecting' | 'error' | 'timeout';
  error: string | null;
  details: string[];
  startTime: number;
}

export default function Home() {
  const router = useRouter();
  const { isAuthenticated, isLoading, user } = useAuth();
  const [loadingState, setLoadingState] = useState<LoadingState>({
    stage: 'initializing',
    error: null,
    details: [`${new Date().toLocaleTimeString()}: Starting initialization`],
    startTime: Date.now()
  });
  const [showDetails, setShowDetails] = useState(false);

  const addDetail = (detail: string) => {
    const timestamp = new Date().toLocaleTimeString();
    setLoadingState(prev => ({
      ...prev,
      details: [...prev.details, `${timestamp}: ${detail}`]
    }));
  };

  const updateStage = (stage: LoadingState['stage'], detail?: string) => {
    console.log(`[PAGE] Moving to stage: ${stage}`, detail);
    setLoadingState(prev => ({
      ...prev,
      stage,
      details: detail ? [...prev.details, `${new Date().toLocaleTimeString()}: ${detail}`] : prev.details
    }));
  };

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;

    // Set a timeout for the entire loading process
    timeoutId = setTimeout(() => {
      setLoadingState(prev => ({
        ...prev,
        stage: 'timeout',
        error: 'Page initialization timed out after 20 seconds. Please check your network connection and try again.',
        details: [...prev.details, `${new Date().toLocaleTimeString()}: TIMEOUT - Initialization took too long`]
      }));
    }, 20000);

    // Log auth state changes
    console.log('[PAGE] Auth state:', { isAuthenticated, isLoading, hasUser: !!user });
    
    if (isLoading) {
      updateStage('auth-loading', 'Waiting for authentication state');
      addDetail(`Auth loading: ${isLoading}, Authenticated: ${isAuthenticated}, User: ${user ? 'present' : 'none'}`);
    } else {
      updateStage('auth-ready', 'Authentication state resolved');
      addDetail(`Auth resolved - Authenticated: ${isAuthenticated}, User: ${user?.email || 'none'}`);
      
      // Redirect authenticated users to home
      if (isAuthenticated) {
        updateStage('redirecting', 'Redirecting authenticated user to home');
        addDetail('Redirecting to /home');
        router.push('/home');
      } else {
        addDetail('User not authenticated, staying on landing page');
      }
    }

    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [isAuthenticated, isLoading, router, user]);

  // Calculate elapsed time
  const elapsedTime = Math.floor((Date.now() - loadingState.startTime) / 1000);

  // Handle error and timeout states
  if (loadingState.stage === 'error' || loadingState.stage === 'timeout') {
    return (
      <Box height="100vh" bg="gray.925" p={8}>
        <Center height="100%">
          <VStack spacing={6} maxW="lg" textAlign="center">
            <Alert status="error" borderRadius="lg">
              <AlertIcon />
              <Box textAlign="left">
                <AlertTitle>Loading Error</AlertTitle>
                <AlertDescription>{loadingState.error}</AlertDescription>
              </Box>
            </Alert>

            <Button
              colorScheme="teal"
              onClick={() => window.location.reload()}
            >
              Reload Page
            </Button>

            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowDetails(!showDetails)}
            >
              {showDetails ? 'Hide' : 'Show'} Debug Details
            </Button>

            <Collapse in={showDetails}>
              <Box w="full" bg="gray.800" p={4} borderRadius="md" maxH="300px" overflowY="auto">
                <Text fontSize="sm" fontWeight="medium" color="gray.300" mb={2}>
                  Debug Log:
                </Text>
                <VStack align="start" spacing={1}>
                  {loadingState.details.map((detail, index) => (
                    <Text key={index} fontSize="xs" color="gray.400" fontFamily="mono">
                      {detail}
                    </Text>
                  ))}
                </VStack>
              </Box>
            </Collapse>
          </VStack>
        </Center>
      </Box>
    );
  }

  return (
    <AuthGuard requireAuth={false}>
      <Box 
        height="100vh" 
        bg="gray.925"
        position="relative"
        overflow="hidden"
      >
        {/* Subtle gradient overlay */}
        <Box
          position="absolute"
          top={0}
          left={0}
          right={0}
          bottom={0}
          bgGradient="radial(circle at center, rgba(20, 184, 166, 0.05) 0%, transparent 70%)"
          pointerEvents="none"
        />
        
        <Center height="100%" position="relative" zIndex={1}>
          <VStack 
            spacing={8}
            animation={`${fadeIn} 0.8s ease-out`}
            textAlign="center"
            maxW="400px"
            px={8}
          >
            {/* Logo */}
            <Box position="relative">
              <Image
                src="/aiwah-logo.svg"
                alt="Infinity Logo"
                width="80px"
                height="80px"
                filter="drop-shadow(0 4px 12px rgba(20, 184, 166, 0.3))"
                transition="all 0.3s ease"
                _hover={{
                  transform: 'scale(1.05)',
                  filter: 'drop-shadow(0 6px 20px rgba(20, 184, 166, 0.4))'
                }}
              />
            </Box>

            {/* App Name */}
            <VStack spacing={3}>
              <Text 
                textStyle="page-title"
                fontSize="3xl"
                fontWeight="bold"
                color="gray.100"
                letterSpacing="tight"
              >
                Infinity
              </Text>
              
              <Text 
                textStyle="body"
                color="gray.400"
                fontSize="md"
                maxW="300px"
                lineHeight="1.6"
              >
                Welcome to the future of AI-powered workflows
              </Text>
            </VStack>

            {/* Enhanced Loading Indicator */}
            <VStack spacing={4} pt={4}>
              <Spinner 
                size="md"
                color="brand.400"
                thickness="3px"
                speed="0.8s"
              />
              
              <VStack spacing={2}>
                <HStack spacing={2} align="center">
                  <Text 
                    textStyle="caption"
                    color="gray.500"
                    fontSize="sm"
                    fontWeight="medium"
                  >
                    {loadingState.stage === 'initializing' && 'Initializing...'}
                    {loadingState.stage === 'auth-loading' && 'Loading authentication...'}
                    {loadingState.stage === 'auth-ready' && 'Authentication ready'}
                    {loadingState.stage === 'redirecting' && 'Redirecting...'}
                  </Text>
                  <Badge colorScheme="gray" variant="subtle" fontSize="xs">
                    {elapsedTime}s
                  </Badge>
                </HStack>

                {/* Stage indicator */}
                <Text fontSize="xs" color="gray.600">
                  Stage: {loadingState.stage.replace('-', ' ').toUpperCase()}
                </Text>
              </VStack>
            </VStack>

            {/* Debug toggle for development */}
            {process.env.NODE_ENV === 'development' && (
              <Button
                variant="ghost"
                size="xs"
                color="gray.600"
                onClick={() => setShowDetails(!showDetails)}
              >
                Debug Info
              </Button>
            )}

            {/* Debug details */}
            <Collapse in={showDetails}>
              <Box 
                w="full" 
                bg="gray.800" 
                p={3} 
                borderRadius="md" 
                maxH="200px" 
                overflowY="auto"
                fontSize="xs"
                fontFamily="mono"
              >
                <Text color="gray.300" mb={1} fontWeight="medium">
                  Debug Log:
                </Text>
                {loadingState.details.map((detail, index) => (
                  <Text key={index} color="gray.500">
                    {detail}
                  </Text>
                ))}
              </Box>
            </Collapse>
          </VStack>
        </Center>
      </Box>
    </AuthGuard>
  );
}
