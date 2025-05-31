'use client';

import { useLogin } from '@saas-ui/auth';
import { useRouter } from 'next/navigation';
import { Card, CardBody, Button, FormControl, FormLabel, Input, VStack, Heading, useColorModeValue, Container, Box } from '@chakra-ui/react';
import { useState } from 'react';
import { LayoutContainer } from '@/components/LayoutContainer';
import { AuthGuard } from '@/components/AuthGuard';

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [{ isLoading, error }, login] = useLogin();
  const cardBg = useColorModeValue('white', 'gray.800');
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login({ email, password });
      // AuthGuard will handle the redirect after successful login
      const redirectPath = sessionStorage.getItem('redirectAfterLogin') || '/';
      sessionStorage.removeItem('redirectAfterLogin');
      router.push(redirectPath);
    } catch (error) {
      console.error('Login error:', error);
    }
  };
  
  return (
    <AuthGuard requireAuth={false}>
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
                      colorScheme="brand" 
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
    </AuthGuard>
  );
} 