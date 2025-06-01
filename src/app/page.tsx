'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@saas-ui/auth';
import { AuthGuard } from '@/components/AuthGuard';
import { 
  Box, 
  VStack, 
  Text, 
  Spinner, 
  Image,
  Center
} from '@chakra-ui/react';
import { keyframes } from '@emotion/react';

// Subtle fade-in animation for the loading content
const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
`;

export default function Home() {
  const router = useRouter();
  const { isAuthenticated, isLoading } = useAuth();

  useEffect(() => {
    // Redirect authenticated users to home
    if (!isLoading && isAuthenticated) {
      router.push('/home');
    }
  }, [isAuthenticated, isLoading, router]);

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

            {/* Loading Indicator */}
            <VStack spacing={4} pt={4}>
              <Spinner 
                size="md"
                color="brand.400"
                thickness="3px"
                speed="0.8s"
              />
              
              <Text 
                textStyle="caption"
                color="gray.500"
                fontSize="sm"
                fontWeight="medium"
              >
                Initializing...
              </Text>
            </VStack>
          </VStack>
        </Center>
      </Box>
    </AuthGuard>
  );
}
