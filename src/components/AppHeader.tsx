'use client';

import { Box, Flex, Heading, IconButton, Image, Button } from '@chakra-ui/react';
import Link from 'next/link';
import { FiHome, FiGrid } from 'react-icons/fi';
import { ReactNode } from 'react';

interface AppHeaderProps {
  appName: string;
  appIcon?: React.ElementType;
  appIconSrc?: string;
  variant?: 'app' | 'home';
  rightContent?: ReactNode;
}

export function AppHeader({ 
  appName, 
  appIcon: AppIcon, 
  appIconSrc,
  variant = 'app',
  rightContent
}: AppHeaderProps) {
  const isHome = variant === 'home';
  
  return (
    <Box 
      as="header" 
      py={4} 
      px={4}
      borderBottom="1px" 
      borderColor="gray.600" 
      bg="gray.800"
      width="100%"
      zIndex={10}
    >
      <Flex justifyContent="space-between" alignItems="center">
        <Flex alignItems="center" cursor="pointer">
          {AppIcon && (
            <Flex
              alignItems="center"
              color="teal.400"
              mr={2}
            >
              <AppIcon size={24} />
            </Flex>
          )}
          {appIconSrc && (
            <Image src={appIconSrc} alt={`${appName} Icon`} h="24px" mr={2} />
          )}
          <Heading size="md" color="white">{appName}</Heading>
        </Flex>
        
        {rightContent || (
          isHome ? (
            <Button
              as={Link}
              href="/ghostwriter"
              leftIcon={<FiGrid />}
              colorScheme="teal"
              variant="outline"
              size="sm"
              _hover={{
                bg: 'gray.600',
                borderColor: 'teal.500'
              }}
            >
              Apps
            </Button>
          ) : (
            <Link href="/" passHref>
              <IconButton
                icon={<FiHome />}
                aria-label="Back to home"
                colorScheme="teal"
                variant="outline"
                _hover={{
                  bg: 'gray.600',
                  borderColor: 'teal.500'
                }}
              />
            </Link>
          )
        )}
      </Flex>
    </Box>
  );
} 