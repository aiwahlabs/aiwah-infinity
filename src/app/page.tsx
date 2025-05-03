'use client';

import React, { useEffect } from 'react';
import { Box, Heading, Text, Card, CardBody, CardHeader, Icon, Flex } from '@chakra-ui/react';
import { useAuth } from '@saas-ui/auth';
import { FiFileText } from 'react-icons/fi';
import Link from 'next/link';
import { LayoutContainer } from '@/components/LayoutContainer';
import { useRouter } from 'next/navigation';

export default function Home() {
  const { isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, router]);

  if (!isAuthenticated) {
    return null; // Don't render anything while redirecting
  }

  return (
    <LayoutContainer>
      <Box width="100%" maxW="400px" mt={4} ml={4}>
        <Link href="/dashboard" passHref>
          <Card 
            bg="gray.800" 
            borderColor="gray.700" 
            borderWidth="1px" 
            borderRadius="lg" 
            overflow="hidden" 
            _hover={{ 
              transform: 'translateY(-4px)', 
              boxShadow: 'xl',
              borderColor: "blue.400"
            }}
            transition="all 0.2s ease-in-out"
            cursor="pointer"
            height="100%"
          >
            <CardHeader pb={2}>
              <Flex align="center" mb={2}>
                <Flex
                  bg="blue.600"
                  w="48px"
                  h="48px"
                  borderRadius="md"
                  justify="center"
                  align="center"
                  mr={4}
                >
                  <Icon as={FiFileText} boxSize={6} color="white" />
                </Flex>
                <Heading size="md" color="white">Ghostwriter</Heading>
              </Flex>
            </CardHeader>
            <CardBody pt={0}>
              <Text color="gray.300">Create and manage your content</Text>
            </CardBody>
          </Card>
        </Link>
      </Box>
    </LayoutContainer>
  );
}
