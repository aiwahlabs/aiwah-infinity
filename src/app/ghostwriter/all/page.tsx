'use client';

import React from 'react';
import { 
  Box, 
  Heading, 
  Text, 
  VStack, 
  HStack, 
  Button, 
  Icon
} from '@chakra-ui/react';
import { FiArrowLeft, FiFileText } from 'react-icons/fi';
import { AuthGuard } from '@/components/AuthGuard';
import { DocumentsTab } from '../components';
import { useRouter } from 'next/navigation';

export default function AllDocumentsPage() {
  const router = useRouter();

  return (
    <AuthGuard>
      <Box h="100%" overflow="auto" p={8}>
        <VStack spacing={6} align="stretch">
          <HStack spacing={4} align="center">
            <Button
              leftIcon={<FiArrowLeft />}
              variant="ghost"
              onClick={() => router.back()}
            >
              Back
            </Button>
            <VStack align="start" spacing={1} flex={1}>
              <HStack>
                <Icon as={FiFileText} color="blue.400" boxSize={6} />
                <Heading size="lg" color="gray.100">All Documents</Heading>
              </HStack>
              <Text color="gray.400">Complete document library</Text>
            </VStack>
          </HStack>
          
          <Box>
            <DocumentsTab />
          </Box>
        </VStack>
      </Box>
    </AuthGuard>
  );
} 