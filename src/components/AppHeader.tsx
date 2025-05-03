'use client';

import { Box, Flex, Heading, IconButton, Container, Image } from '@chakra-ui/react';
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
      borderBottom="1px" 
      borderColor="gray.700" 
      bg="gray.900"
      width="100%"
      zIndex={10}
    >
      <Container maxW="container.xl">
        <Flex justifyContent="space-between" alignItems="center">
          <Flex alignItems="center" cursor="pointer">
            {AppIcon && (
              <Box bg="blue.600" p={2} borderRadius="md" mr={3}>
                <AppIcon size={20} color="white" />
              </Box>
            )}
            {appIconSrc && (
              <Image src={appIconSrc} alt={`${appName} Icon`} h="32px" mr={3} />
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
      </Container>
    </Box>
  );
} 