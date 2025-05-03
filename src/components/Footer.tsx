'use client';

import { Box, Text, Container } from '@chakra-ui/react';

export function Footer() {
  return (
    <Box 
      as="footer" 
      py={4} 
      bg="gray.800" 
      borderTop="1px" 
      borderColor="gray.700" 
      width="100%"
      zIndex={10}
    >
      <Container maxW="container.xl">
        <Text color="gray.400" textAlign="center">
          © {new Date().getFullYear()} Aiwah Infinity. All rights reserved.
        </Text>
      </Container>
    </Box>
  );
} 