'use client';

import { Box, Flex, Button, HStack } from '@chakra-ui/react';
import { ReactNode } from 'react';
import { AppHeader } from './AppHeader';
import { Footer } from './Footer';
import { useAuth } from '@saas-ui/auth';
import { usePathname, useRouter } from 'next/navigation';

interface LayoutContainerProps {
  children: ReactNode;
}

export function LayoutContainer({ children }: LayoutContainerProps) {
  const pathname = usePathname();
  const isAuthPage = pathname === '/login' || pathname === '/signup';
  const { isAuthenticated, logOut } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    await logOut();
    router.push('/login');
  };

  const authControls = (
    <HStack spacing={4}>
      {isAuthenticated ? (
        <Button 
          onClick={handleLogout} 
          colorScheme="red" 
          variant="outline"
          size="sm"
          _hover={{
            bg: 'red.900',
            borderColor: 'red.500'
          }}
        >
          Logout
        </Button>
      ) : (
        <Button 
          as="a"
          href="/login"
          variant="ghost" 
          color="gray.300"
          size="sm"
          _hover={{
            bg: 'gray.800',
            color: 'white'
          }}
        >
          Login
        </Button>
      )}
    </HStack>
  );
  
  return (
    <Flex 
      direction="column" 
      height="100vh"
      bg="gray.900"
      overflow="hidden"
    >
      {!isAuthPage && (
        <AppHeader 
          appName="Infinity" 
          appIconSrc="/aiwah-logo.svg"
          variant="home"
          rightContent={authControls}
        />
      )}
      <Box 
        as="main" 
        flex="1" 
        overflow="auto"
        position="relative"
      >
        {children}
      </Box>
      {!isAuthPage && <Footer />}
    </Flex>
  );
} 