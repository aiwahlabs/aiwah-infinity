'use client';

import React from 'react';
import { 
  Box, 
  Heading, 
  Text, 
  VStack, 
  HStack, 
  Icon
} from '@chakra-ui/react';
import { FiFileText } from 'react-icons/fi';
import { AuthGuard } from '@/components/AuthGuard';
import { DocumentsTab } from '../components';

export default function AllDocumentsPage() {
  return (
    <AuthGuard>
      <Box h="100%" overflow="auto" p={8}>
        <VStack spacing={6} align="stretch">
          <VStack align="start" spacing={1}>
            <HStack>
              <Icon as={FiFileText} color="blue.400" boxSize={5} />
              <Heading textStyle="page-title">All Documents</Heading>
            </HStack>
            <Text textStyle="body">Complete document library</Text>
          </VStack>
          
          <Box>
            <DocumentsTab />
          </Box>
        </VStack>
      </Box>
    </AuthGuard>
  );
} 