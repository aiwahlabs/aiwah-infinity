'use client';

import { useLogin } from '@saas-ui/auth';
import { useRouter } from 'next/navigation';
import { Card, CardBody, Button, FormControl, FormLabel, Input, VStack, Heading, Text, Link, useColorModeValue, Container } from '@chakra-ui/react';
import { useState } from 'react';
import { LayoutContainer } from '@/components/LayoutContainer';

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
      router.push('/');
    } catch (error) {
      console.error('Login error:', error);
    }
  };
  
  return (
    <LayoutContainer>
      <Container maxW="container.xl" centerContent py={12}>
        <Card maxW="md" mx="auto" bg={cardBg}>
          <CardBody>
            <VStack spacing={6} align="stretch">
              <Heading size="lg" textAlign="center">Login</Heading>
              
              {error && (
                <Text color="red.500" textAlign="center">
                  {error.message || 'An error occurred during login'}
                </Text>
              )}
              
              <form onSubmit={handleSubmit}>
                <VStack spacing={4}>
                  <FormControl id="email">
                    <FormLabel>Email</FormLabel>
                    <Input 
                      type="email" 
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </FormControl>
                  
                  <FormControl id="password">
                    <FormLabel>Password</FormLabel>
                    <Input 
                      type="password" 
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                  </FormControl>
                  
                  <Button 
                    type="submit" 
                    colorScheme="blue" 
                    width="full"
                    isLoading={isLoading}
                  >
                    Sign In
                  </Button>
                </VStack>
              </form>
              
              <Text textAlign="center">
                Don&apos;t have an account? <Link color="blue.400" href="/signup">Sign up</Link>
              </Text>
            </VStack>
          </CardBody>
        </Card>
      </Container>
    </LayoutContainer>
  );
} 