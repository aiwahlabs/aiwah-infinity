'use client';

import { Box, Flex } from '@chakra-ui/react';
import { ReactNode } from 'react';
import { AppHeader } from './AppHeader';
import { Footer } from './Footer';

interface AppLayoutProps {
  children: ReactNode;
  appName: string;
  appIcon?: React.ElementType;
  appIconSrc?: string;
}

export function AppLayout({ 
  children, 
  appName, 
  appIcon, 
  appIconSrc
}: AppLayoutProps) {
  return (
    <Flex 
      direction="column" 
      height="100vh"
      bg="gray.900"
      overflow="hidden"
    >
      <AppHeader 
        appName={appName} 
        appIcon={appIcon} 
        appIconSrc={appIconSrc}
      />
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