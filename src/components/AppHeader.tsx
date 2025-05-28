'use client';

import { Box, Flex, Heading, IconButton, Image } from '@chakra-ui/react';
import Link from 'next/link';
import { FiHome } from 'react-icons/fi';

interface AppHeaderProps {
  appName: string;
  appIcon?: React.ElementType;
  appIconSrc?: string;
}

export function AppHeader({ 
  appName, 
  appIcon: AppIcon, 
  appIconSrc
}: AppHeaderProps) {
  return (
    <Box 
      as="header" 
      py={4} 
      px={4}
      borderBottom="1px" 
      borderColor="gray.700" 
      bg="gray.900"
      width="100%"
      zIndex={10}
    >
      <Flex justifyContent="space-between" alignItems="center">
        <Flex alignItems="center" cursor="pointer">
          {AppIcon && (
            <Flex
              alignItems="center"
              color="blue.400"
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
        
        <Link href="/" passHref>
          <IconButton
            icon={<FiHome />}
            aria-label="Back to home"
            colorScheme="blue"
            variant="outline"
          />
        </Link>
      </Flex>
    </Box>
  );
} 