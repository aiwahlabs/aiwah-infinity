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
  showHeader?: boolean;
  showFooter?: boolean;
}

export function AppLayout({ 
  children, 
  appName, 
  appIcon, 
  appIconSrc,
  showHeader = true,
  showFooter = true
}: AppLayoutProps) {
  return (
    <Flex 
      direction="column" 
      height="100vh"
      bg="gray.800"
      overflow="hidden"
    >
      {showHeader && (
        <AppHeader 
          appName={appName} 
          appIcon={appIcon} 
          appIconSrc={appIconSrc}
        />
      )}
      <Box 
        as="main" 
        flex="1" 
        overflow="hidden"
        position="relative"
      >
        {children}
      </Box>
      {showFooter && <Footer />}
    </Flex>
  );
} 