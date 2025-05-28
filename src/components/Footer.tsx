'use client';

import { Box, Text } from '@chakra-ui/react';

export function Footer() {
  return (
    <Box 
      as="footer" 
      py={4} 
      px={4}
      bg="gray.800" 
      borderTop="1px" 
      borderColor="gray.700" 
      width="100%"
      zIndex={10}
    >
      <Text color="gray.400" textAlign="center">
        Crafting the future, one line at a time ✨
      </Text>
    </Box>
  );
} 