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
import { FiEdit3 } from 'react-icons/fi';
import { AuthGuard } from '@/components/AuthGuard';
import { RecentDraftsTab } from '../components';

export default function DraftsPage() {
  return (
    <AuthGuard>
      <Box h="100%" overflow="auto" p={8}>
        <VStack spacing={6} align="stretch">
          <VStack align="start" spacing={1}>
            <HStack>
              <Icon as={FiEdit3} color="yellow.400" boxSize={5} />
              <Heading textStyle="page-title">Draft Documents</Heading>
            </HStack>
            <Text textStyle="body">Documents pending review and approval</Text>
          </VStack>
          
          <Box>
            <RecentDraftsTab />
          </Box>
        </VStack>
      </Box>
    </AuthGuard>
  );
} 