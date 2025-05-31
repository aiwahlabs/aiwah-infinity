'use client';

// Example usage of the centralized Loading system
// This file demonstrates various ways to use the Loading components

import React from 'react';
import { Box, Button, Card, CardBody, VStack, Text } from '@chakra-ui/react';
import {
  Loading,
  FullScreenLoading,
  PageLoading,
  CardLoading,
  InlineLoading,
  ButtonLoading,
  ModalLoading,
  WidgetLoading,
  useLoading,
  withLoading,
} from './Loading';

// 1. Basic usage with different variants
export function BasicLoadingExamples() {
  return (
    <VStack spacing={8} p={6}>
      <Text fontSize="xl" fontWeight="bold">Loading Variants</Text>
      
      {/* Full screen loading */}
      <Button onClick={() => {
        // This would typically be triggered by some action
        // <FullScreenLoading message="Processing your request..." />
      }}>
        Show Full Screen Loading
      </Button>
      
      {/* Page loading */}
      <Box position="relative" h="300px" w="100%" bg="gray.800" borderRadius="md">
        <PageLoading message="Loading page content..." />
      </Box>
      
      {/* Card loading */}
      <Card position="relative" h="200px" w="100%">
        <CardBody>
          <Text>This card has loading overlay</Text>
        </CardBody>
        <CardLoading message="Loading card data..." />
      </Card>
      
      {/* Inline loading */}
      <InlineLoading message="Loading inline content..." size="sm" />
      
      {/* Widget loading */}
      <Box position="relative" h="150px" w="300px" bg="gray.700" borderRadius="md">
        <WidgetLoading message="Loading widget..." />
      </Box>
    </VStack>
  );
}

// 2. Using different background styles
export function BackgroundStylesExample() {
  const [activeStyle, setActiveStyle] = React.useState<string | null>(null);
  
  return (
    <VStack spacing={4} p={6}>
      <Text fontSize="xl" fontWeight="bold">Background Styles</Text>
      
      <Box position="relative" h="200px" w="100%" bg="gray.800" borderRadius="md">
        <Text p={4} color="white">Content behind loading overlay</Text>
        
        {/* Different background styles */}
        {activeStyle === 'solid' && (
          <Loading variant="card" background="solid" message="Solid background" />
        )}
        {activeStyle === 'blur' && (
          <Loading variant="card" background="blur" message="Blurred background" />
        )}
        {activeStyle === 'dark' && (
          <Loading variant="card" background="dark" message="Dark background" />
        )}
        {activeStyle === 'transparent' && (
          <Loading variant="card" background="transparent" message="Transparent background" />
        )}
      </Box>
      
      <VStack>
        <Button onClick={() => setActiveStyle('solid')}>Solid Background</Button>
        <Button onClick={() => setActiveStyle('blur')}>Blur Background</Button>
        <Button onClick={() => setActiveStyle('dark')}>Dark Background</Button>
        <Button onClick={() => setActiveStyle('transparent')}>Transparent</Button>
        <Button onClick={() => setActiveStyle(null)}>Clear</Button>
      </VStack>
    </VStack>
  );
}

// 3. Using the useLoading hook
export function UseLoadingExample() {
  const { isLoading, startLoading, stopLoading } = useLoading();
  
  const simulateAsyncOperation = async () => {
    startLoading();
    // Simulate async operation
    await new Promise(resolve => setTimeout(resolve, 2000));
    stopLoading();
  };
  
  return (
    <VStack spacing={4} p={6}>
      <Text fontSize="xl" fontWeight="bold">useLoading Hook</Text>
      
      <Box position="relative" h="200px" w="100%" bg="gray.800" borderRadius="md" p={4}>
        <Text color="white">Content that can be loading</Text>
        <Button 
          mt={4} 
          onClick={simulateAsyncOperation} 
          isDisabled={isLoading}
        >
          Start Loading
        </Button>
        
        <Loading 
          variant="card" 
          isLoading={isLoading} 
          message="Processing..."
          background="solid"
        />
      </Box>
    </VStack>
  );
}

// 4. Higher-order component example
const MyCard = ({ children }: { children: React.ReactNode }) => (
  <Card h="150px" w="300px">
    <CardBody>
      {children}
    </CardBody>
  </Card>
);

const LoadingCard = withLoading(MyCard, { 
  message: "Loading card content...",
  background: "solid" 
});

export function HOCExample() {
  const [isLoading, setIsLoading] = React.useState(false);
  
  return (
    <VStack spacing={4} p={6}>
      <Text fontSize="xl" fontWeight="bold">Higher-Order Component</Text>
      
      <LoadingCard isLoading={isLoading}>
        <Text>This card can show loading state</Text>
      </LoadingCard>
      
      <Button onClick={() => setIsLoading(!isLoading)}>
        Toggle Loading
      </Button>
    </VStack>
  );
}

// 5. Custom configurations
export function CustomConfigExample() {
  return (
    <VStack spacing={4} p={6}>
      <Text fontSize="xl" fontWeight="bold">Custom Configurations</Text>
      
      {/* Custom spinner props */}
      <Box position="relative" h="150px" w="100%" bg="gray.800" borderRadius="md">
        <Loading
          variant="card"
          message="Custom spinner..."
          spinnerProps={{
            size: 'xl',
            color: 'purple.500',
            thickness: '4px',
            speed: '0.6s',
          }}
          textProps={{
            color: 'purple.300',
            fontSize: 'lg',
            fontWeight: 'bold',
          }}
        />
      </Box>
      
      {/* Custom overlay opacity */}
      <Box position="relative" h="150px" w="100%" bg="gray.800" borderRadius="md">
        <Text p={4} color="white">Semi-visible content</Text>
        <Loading
          variant="card"
          background="dark"
          overlayOpacity={0.5}
          message="50% opacity overlay"
        />
      </Box>
      
      {/* No background, just spinner */}
      <InlineLoading 
        message="Just a spinner"
        size="lg"
        spinnerProps={{ color: 'brand.500' }}
      />
    </VStack>
  );
}

// 6. Real-world usage patterns
export function RealWorldExamples() {
  const [submitLoading, setSubmitLoading] = React.useState(false);
  const [dataLoading, setDataLoading] = React.useState(false);
  
  const handleSubmit = async () => {
    setSubmitLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    setSubmitLoading(false);
  };
  
  const loadData = async () => {
    setDataLoading(true);
    await new Promise(resolve => setTimeout(resolve, 2000));
    setDataLoading(false);
  };
  
  return (
    <VStack spacing={6} p={6}>
      <Text fontSize="xl" fontWeight="bold">Real-world Usage</Text>
      
      {/* Form submission */}
      <Card w="100%">
        <CardBody>
          <Text mb={4}>Form Submission Example</Text>
          <Button 
            onClick={handleSubmit}
            isLoading={submitLoading}
            loadingText="Submitting..."
            colorScheme="brand"
          >
            Submit Form
          </Button>
        </CardBody>
      </Card>
      
      {/* Data fetching */}
      <Card w="100%" position="relative">
        <CardBody>
          <Text mb={4}>Data Fetching Example</Text>
          <Button onClick={loadData} isDisabled={dataLoading} mb={4}>
            Load Data
          </Button>
          
          {!dataLoading ? (
            <Text color="gray.400">Data would appear here</Text>
          ) : null}
        </CardBody>
        
        <CardLoading 
          isLoading={dataLoading}
          message="Fetching data from server..."
        />
      </Card>
      
      {/* Page transitions */}
      <Text fontSize="lg" fontWeight="semibold">Page Transitions</Text>
      <Text color="gray.400" fontSize="sm">
        Use `PageLoading` for route changes, `FullScreenLoading` for app-wide operations,
        and `CardLoading` for component-level loading states.
      </Text>
    </VStack>
  );
}

// Complete example component
export function LoadingSystemDemo() {
  return (
    <VStack spacing={12} p={8} maxW="4xl" mx="auto">
      <Text fontSize="2xl" fontWeight="bold" textAlign="center">
        Centralized Loading System Demo
      </Text>
      
      <BasicLoadingExamples />
      <BackgroundStylesExample />
      <UseLoadingExample />
      <HOCExample />
      <CustomConfigExample />
      <RealWorldExamples />
    </VStack>
  );
} 