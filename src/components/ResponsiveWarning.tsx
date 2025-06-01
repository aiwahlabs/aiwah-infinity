'use client';

import { Box, Heading, Text, VStack, useMediaQuery, Container } from '@chakra-ui/react';

export function ResponsiveWarning() {
  const [isSmallScreen] = useMediaQuery('(max-width: 799px), (max-height: 499px)');

  if (!isSmallScreen) {
    return null;
  }

  return (
    <Box
      position="fixed"
      top="0"
      left="0"
      width="100%"
      height="100%"
      bg="gray.900"
      zIndex="overlay"
      display="flex"
      alignItems="center"
      justifyContent="center"
      p={4}
    >
      <Container maxW="md">
        <VStack spacing={6} textAlign="center">
          <Heading size="lg" color="white">Screen Size Not Supported</Heading>
          <Text color="gray.300">
            This application requires a screen width of at least 800px and height of at least 500px.
          </Text>
          <Text fontSize="sm" color="gray.400">
            Please use a larger device or resize your browser window.
          </Text>
        </VStack>
      </Container>
    </Box>
  );
} 