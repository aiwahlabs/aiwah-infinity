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
      borderColor="gray.600" 
      bg="gray.700"
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
      </Flex>
    </Box>
  );
} 