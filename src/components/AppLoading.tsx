'use client';

import { 
  Box, 
  VStack, 
  Text, 
  Spinner,
  Collapse,
  Button,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription
} from '@chakra-ui/react';
import { useState } from 'react';

interface AppLoadingProps {
  stage?: string;
  message?: string;
  error?: string | null;
  onRetry?: () => void;
  debugLogs?: string[];
}

export function AppLoading({ 
  stage = 'initializing',
  message = 'Loading...',
  error,
  onRetry,
  debugLogs = []
}: AppLoadingProps) {
  const [showDebug, setShowDebug] = useState(false);
  const isDebugMode = process.env.NEXT_PUBLIC_DEBUG_MODE === 'on';

  // Always log to console for debugging (not just in debug mode)
  if (debugLogs.length > 0) {
    console.log(`[APP-LOADING] ${stage}:`, debugLogs[debugLogs.length - 1]);
  }

  return (
    <Box 
      minH="100vh" 
      bg="gray.900" 
      display="flex" 
      alignItems="center" 
      justifyContent="center"
      p={8}
    >
      <VStack spacing={6} maxW="md" textAlign="center" w="full">
        {error ? (
          <>
            <Alert status="error" borderRadius="lg" bg="red.900" borderColor="red.600">
              <AlertIcon color="red.400" />
              <Box textAlign="left">
                <AlertTitle color="red.400">Error</AlertTitle>
                <AlertDescription color="red.200">
                  {error}
                </AlertDescription>
              </Box>
            </Alert>
            
            {onRetry && (
              <Button colorScheme="teal" onClick={onRetry}>
                Retry
              </Button>
            )}

            {/* Always show debug toggle for errors */}
            <Button
              variant="ghost"
              size="sm"
              color="gray.500"
              onClick={() => setShowDebug(!showDebug)}
            >
              {showDebug ? 'Hide' : 'Show'} Debug Info
            </Button>
          </>
        ) : (
          <>
            <Spinner 
              size="lg" 
              color="teal.400" 
              thickness="3px"
              speed="0.8s"
            />
            <VStack spacing={2}>
              <Text fontSize="lg" color="gray.100" fontWeight="medium">
                {message}
              </Text>
              {isDebugMode && (
                <Text fontSize="sm" color="gray.400">
                  {stage.replace('-', ' ').toUpperCase()}
                </Text>
              )}
            </VStack>

            {/* Debug toggle - only show in debug mode or when there are logs */}
            {(isDebugMode || debugLogs.length > 0) && (
              <Button
                variant="ghost"
                size="sm"
                color="gray.500"
                onClick={() => setShowDebug(!showDebug)}
              >
                {showDebug ? 'Hide' : 'Show'} Debug Info
              </Button>
            )}
          </>
        )}

        {/* Debug panel - show for errors or in debug mode */}
        {(error || isDebugMode) && debugLogs.length > 0 && (
          <Collapse in={showDebug}>
            <Box 
              bg="gray.800" 
              p={4} 
              borderRadius="md" 
              maxH="300px" 
              overflowY="auto"
              w="full"
              fontSize="xs"
              fontFamily="mono"
            >
              <Text color="gray.300" mb={2} fontWeight="medium">
                Debug Log:
              </Text>
              <VStack align="start" spacing={1}>
                {debugLogs.map((log, index) => (
                  <Text key={index} color="gray.400">
                    {log}
                  </Text>
                ))}
              </VStack>
            </Box>
          </Collapse>
        )}
      </VStack>
    </Box>
  );
} 