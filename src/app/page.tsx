'use client';

import React from 'react';
import { Box, Heading, Text, Button, VStack, Container, SimpleGrid, Card, CardBody, CardHeader, Icon, Flex, HStack } from '@chakra-ui/react';
import { useAuth } from '@saas-ui/auth';
import { FiGrid, FiSettings } from 'react-icons/fi';
import Link from 'next/link';
import { LayoutContainer } from '@/components/LayoutContainer';

export default function Home() {
  const { isAuthenticated, user } = useAuth();

  return (
    <LayoutContainer>
      <Container maxW="container.xl">
        <VStack spacing={10} align="center" textAlign="center">
          <Box>
            <Heading as="h1" size="2xl" mb={4} color="white">Welcome to Aiwah Infinity</Heading>
            <Text fontSize="xl" maxW="container.md" color="gray.300">
              Your intelligent workspace
            </Text>
          </Box>

          {isAuthenticated ? (
            <VStack spacing={8} width="100%">
              <Text fontSize="lg" color="gray.300">Welcome back, {user?.email}</Text>
              
              {/* Apps Section */}
              <Box width="100%">
                <Heading as="h2" size="lg" mb={6} color="white" textAlign="left">
                  Your Apps
                </Heading>
                <SimpleGrid columns={{ base: 1, sm: 2, md: 3, lg: 4 }} spacing={6}>
                  <AppCard
                    icon={FiGrid}
                    title="Dashboard"
                    description="View your main dashboard"
                    href="/dashboard"
                    iconColor="blue.400"
                  />
                  <AppCard
                    icon={FiSettings}
                    title="Settings"
                    description="Configure your account"
                    href="/settings"
                    iconColor="gray.400"
                  />
                </SimpleGrid>
              </Box>
            </VStack>
          ) : (
            <VStack spacing={4}>
              <Text fontSize="lg" color="gray.300">Get started by creating an account or logging in</Text>
              <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
                <Link href="/signup" passHref>
                  <Button colorScheme="blue" size="lg" width="full">Sign Up</Button>
                </Link>
                <Link href="/login" passHref>
                  <Button variant="outline" colorScheme="blue" size="lg" width="full">Login</Button>
                </Link>
              </SimpleGrid>
            </VStack>
          )}
        </VStack>
      </Container>
    </LayoutContainer>
  );
}

function AppCard({ icon, title, description, href, iconColor }: { 
  icon: React.ElementType; 
  title: string; 
  description: string;
  href: string;
  iconColor: string;
}) {
  return (
    <Link href={href} passHref>
      <Card 
        bg="gray.800" 
        borderColor="gray.700" 
        borderWidth="1px" 
        borderRadius="lg" 
        overflow="hidden" 
        _hover={{ 
          transform: 'translateY(-4px)', 
          boxShadow: 'lg',
          borderColor: 'gray.600'
        }}
        transition="all 0.2s ease-in-out"
        cursor="pointer"
        height="100%"
      >
        <CardHeader pb={0}>
          <HStack spacing={4} align="center">
            <Flex
              bg={`${iconColor.split('.')[0]}.600`}
              w="40px"
              h="40px"
              borderRadius="md"
              justify="center"
              align="center"
            >
              <Icon as={icon} boxSize={5} color="white" />
            </Flex>
            <Heading size="md" color="white">{title}</Heading>
          </HStack>
        </CardHeader>
        <CardBody>
          <Text color="gray.300">{description}</Text>
        </CardBody>
      </Card>
    </Link>
  );
}
