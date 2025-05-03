'use client';

import React, { useEffect } from 'react';
import { Box, Heading, Text, Card, CardBody, CardHeader, Icon, Flex, Container, SimpleGrid } from '@chakra-ui/react';
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
      <Container maxW="container.xl" py={12}>
        {/* <Heading size="lg" mb={8} color="white">Your Applications</Heading> */}
        <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={8}>
          <Link href="/dashboard" passHref style={{ display: 'contents' }}>
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
              maxW="100%"
            >
              <CardHeader pb={4}>
                <Flex align="center">
                  <Box
                    bg="blue.500"
                    color="white"
                    p={3}
                    borderRadius="md"
                    mr={4}
                  >
                    <Icon as={FiFileText} boxSize={6} />
                  </Box>
                  <Heading size="md" color="white">Ghostwriter</Heading>
                </Flex>
              </CardHeader>
              <CardBody pt={0} pb={6}>
                <Text color="gray.300" fontSize="md">Create and manage your content</Text>
              </CardBody>
            </Card>
          </Link>
        </SimpleGrid>
      </Container>
    </LayoutContainer>
  );
}
