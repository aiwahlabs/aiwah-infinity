'use client';

import { Box, Text } from '@chakra-ui/react';

export function Footer() {
  return (
    <Box 
      as="footer" 
      py={2} 
      px={4}
      bg="gray.700" 
      borderTop="1px" 
      borderColor="gray.600" 
      width="100%"
      zIndex={10}
    >
      <Text color="gray.400" textAlign="center">
        Crafting the future, one line at a time ✨
      </Text>
    </Box>
  );
} 