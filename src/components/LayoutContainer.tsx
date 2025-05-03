'use client';

import { Box, Flex } from '@chakra-ui/react';
import { ReactNode } from 'react';
import { NavBar } from './NavBar';
import { Footer } from './Footer';

interface LayoutContainerProps {
  children: ReactNode;
}

export function LayoutContainer({ children }: LayoutContainerProps) {
  return (
    <Flex 
      direction="column" 
      minH="100vh"
      bg="gray.900"
    >
      <NavBar />
      <Box as="main" flex="1" py={6}>
        {children}
      </Box>
      <Footer />
    </Flex>
  );
} 