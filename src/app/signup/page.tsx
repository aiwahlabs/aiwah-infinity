'use client';

import { useSignUp } from '@saas-ui/auth';
import { useRouter } from 'next/navigation';
import { Card, CardBody, Button, FormControl, FormLabel, Input, VStack, Heading, Text, Link, useColorModeValue } from '@chakra-ui/react';
import { useState } from 'react';

export default function SignUp() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [{ isLoading, error }, signUp] = useSignUp();
  const cardBg = useColorModeValue('white', 'gray.800');
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await signUp({ email, password });
      router.push('/login?message=Check your email to confirm your account');
    } catch (error) {
      console.error('Signup error:', error);
    }
  };
  
  return (
    <div className="flex justify-center items-center min-h-screen p-4">
      <Card maxW="md" mx="auto" bg={cardBg}>
        <CardBody>
          <VStack spacing={6} align="stretch">
            <Heading size="lg" textAlign="center">Sign Up</Heading>
            
            {error && (
              <Text color="red.500" textAlign="center">
                {error.message || 'An error occurred during signup'}
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
                  Create Account
                </Button>
              </VStack>
            </form>
            
            <Text textAlign="center">
              Already have an account? <Link color="blue.400" href="/login">Sign in</Link>
            </Text>
          </VStack>
        </CardBody>
      </Card>
    </div>
  );
} 