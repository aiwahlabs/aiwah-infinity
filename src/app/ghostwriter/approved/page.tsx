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
import { FiCheckCircle } from 'react-icons/fi';
import { AuthGuard } from '@/components/AuthGuard';
import { ApprovedPostsTab } from '../components';

export default function ApprovedPage() {
  return (
    <AuthGuard>
      <Box h="100%" overflow="auto" p={8}>
        <VStack spacing={6} align="stretch">
          <VStack align="start" spacing={1}>
            <HStack>
              <Icon as={FiCheckCircle} color="green.400" boxSize={5} />
              <Heading textStyle="page-title">Approved Documents</Heading>
            </HStack>
            <Text textStyle="body">Documents ready for publication</Text>
          </VStack>
          
          <Box>
            <ApprovedPostsTab />
          </Box>
        </VStack>
      </Box>
    </AuthGuard>
  );
} 