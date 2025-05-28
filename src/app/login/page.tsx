'use client';

import { useLogin, useAuth } from '@saas-ui/auth';
import { useRouter } from 'next/navigation';
import { Card, CardBody, Button, FormControl, FormLabel, Input, VStack, Heading, useColorModeValue, Container, Box } from '@chakra-ui/react';
import { useState, useEffect } from 'react';
import { LayoutContainer } from '@/components/LayoutContainer';

export default function Login() {
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [{ isLoading, error }, login] = useLogin();
  const cardBg = useColorModeValue('white', 'gray.800');
  
  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      router.push('/');
    }
  }, [isAuthenticated, router]);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login({ email, password });
      router.push('/');
    } catch (error) {
      console.error('Login error:', error);
    }
  };
  
  // Return null while checking auth state to prevent flash of login form
  if (isAuthenticated) {
    return null;
  }
  
  return (
    <LayoutContainer>
      <Container 
        maxW="container.sm" 
        centerContent 
        minH="calc(100vh - 140px)" 
        display="flex" 
        alignItems="center" 
        pt={16}
      >
        <Card 
          maxW="md" 
          width="100%" 
          bg={cardBg} 
          borderColor="gray.700" 
          borderWidth="1px" 
          borderRadius="lg" 
          boxShadow="lg" 
          overflow="hidden"
        >
          <CardBody p={8}>
            <VStack spacing={8} align="stretch">
              <Heading size="lg" textAlign="center" mb={2}>Login</Heading>
              
              {error && (
                <Box 
                  bg="red.900" 
                  color="white" 
                  p={3} 
                  borderRadius="md" 
                  fontSize="sm" 
                  textAlign="center"
                >
                  {error.message || 'An error occurred during login'}
                </Box>
              )}
              
              <form onSubmit={handleSubmit}>
                <VStack spacing={6}>
                  <FormControl id="email">
                    <FormLabel fontWeight="medium">Email</FormLabel>
                    <Input 
                      type="email" 
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      bg="gray.700"
                      borderColor="gray.600"
                      size="lg"
                      _hover={{ borderColor: "gray.500" }}
                      _focus={{ borderColor: "teal.400", boxShadow: "0 0 0 1px var(--chakra-colors-teal-400)" }}
                    />
                  </FormControl>
                  
                  <FormControl id="password">
                    <FormLabel fontWeight="medium">Password</FormLabel>
                    <Input 
                      type="password" 
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      bg="gray.700"
                      borderColor="gray.600"
                      size="lg"
                      _hover={{ borderColor: "gray.500" }}
                      _focus={{ borderColor: "teal.400", boxShadow: "0 0 0 1px var(--chakra-colors-teal-400)" }}
                    />
                  </FormControl>
                  
                  <Button 
                    type="submit" 
                    colorScheme="teal" 
                    width="full"
                    isLoading={isLoading}
                    size="lg"
                    mt={4}
                  >
                    Sign In
                  </Button>
                </VStack>
              </form>
            </VStack>
          </CardBody>
        </Card>
      </Container>
    </LayoutContainer>
  );
} 