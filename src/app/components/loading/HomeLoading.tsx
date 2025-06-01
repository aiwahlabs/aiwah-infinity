'use client';

import { Box, SimpleGrid, Container, Flex, Skeleton } from '@chakra-ui/react';

// Home Page Loading - Shows skeleton cards that match the actual app cards
export function HomePageLoading() {
  return (
    <Container maxW="container.xl" py={12}>
      <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={8}>
        {Array.from({ length: 2 }).map((_, i) => (
          <AppCardLoading key={i} />
        ))}
      </SimpleGrid>
    </Container>
  );
}

// App Card Loading - Matches the exact structure of the real app cards
export function AppCardLoading() {
  return (
    <Box 
      bg="gray.800" 
      borderColor="gray.700" 
      borderWidth="1px" 
      borderRadius="lg" 
      overflow="hidden"
      height="100%"
      maxW="100%"
      transition="all 0.2s ease-in-out"
    >
      {/* CardHeader equivalent */}
      <Box pb={4} p={6}>
        <Flex align="center">
          {/* Icon container skeleton */}
          <Skeleton
            width="48px"
            height="48px"
            borderRadius="md"
            mr={4}
            startColor="gray.700"
            endColor="gray.600"
          />
          {/* Title skeleton */}
          <Skeleton 
            height="24px" 
            width="120px" 
            borderRadius="md"
            startColor="gray.700"
            endColor="gray.600"
          />
        </Flex>
      </Box>
      
      {/* CardBody equivalent */}
      <Box pt={0} pb={6} px={6}>
        {/* Description skeleton */}
        <Skeleton 
          height="16px" 
          width="200px" 
          borderRadius="md"
          startColor="gray.700"
          endColor="gray.600"
        />
      </Box>
    </Box>
  );
} 