'use client';

import { Box, Flex, Button, Heading, HStack, Container, Image } from '@chakra-ui/react';
import { useAuth } from '@saas-ui/auth';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export function NavBar() {
  const { isAuthenticated, logOut } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    await logOut();
    router.push('/login');
  };

  return (
    <Box 
      as="header" 
      py={4} 
      borderBottom="1px" 
      borderColor="gray.800" 
      bg="gray.950"
      width="100%"
      zIndex={10}
    >
      <Container maxW="container.xl">
        <Flex justifyContent="space-between" alignItems="center">
          <Link href="/" passHref>
            <Flex alignItems="center" cursor="pointer">
              <Image src="/aiwah-logo.svg" alt="Logo" h="32px" mr={3} />
              <Heading size="md" color="white">Infinity</Heading>
            </Flex>
          </Link>
          
          <HStack spacing={4}>
            {isAuthenticated ? (
              <Button 
                onClick={handleLogout} 
                colorScheme="red" 
                variant="outline"
                _hover={{
                  bg: 'red.900',
                  borderColor: 'red.500'
                }}
              >
                Logout
              </Button>
            ) : (
              <Link href="/login" passHref>
                <Button 
                  variant="ghost" 
                  color="gray.300"
                  _hover={{
                    bg: 'gray.800',
                    color: 'white'
                  }}
                >
                  Login
                </Button>
              </Link>
            )}
          </HStack>
        </Flex>
      </Container>
    </Box>
  );
} 