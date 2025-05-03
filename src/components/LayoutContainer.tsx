'use client';

import { Box, Flex } from '@chakra-ui/react';
import { ReactNode } from 'react';
import { NavBar } from './NavBar';
import { Footer } from './Footer';
import { usePathname } from 'next/navigation';

interface LayoutContainerProps {
  children: ReactNode;
}

export function LayoutContainer({ children }: LayoutContainerProps) {
  const pathname = usePathname();
  const isAuthPage = pathname === '/login' || pathname === '/signup';
  
  return (
    <Flex 
      direction="column" 
      height="100vh"
      bg="gray.900"
      overflow="hidden"
    >
      {!isAuthPage && <NavBar />}
      <Box 
        as="main" 
        flex="1" 
        overflow="auto"
        position="relative"
      >
        {children}
      </Box>
      <Footer />
    </Flex>
  );
} 