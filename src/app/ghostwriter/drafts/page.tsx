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
import { FiArrowLeft, FiEdit3 } from 'react-icons/fi';
import { AuthGuard } from '@/components/AuthGuard';
import { RecentDraftsTab } from '../components';
import { useRouter } from 'next/navigation';

export default function DraftsPage() {
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
                <Icon as={FiEdit3} color="yellow.400" boxSize={6} />
                <Heading size="lg" color="gray.100">Draft Documents</Heading>
              </HStack>
              <Text color="gray.400">Documents pending review and approval</Text>
            </VStack>
          </HStack>
          
          <Box>
            <RecentDraftsTab />
          </Box>
        </VStack>
      </Box>
    </AuthGuard>
  );
} 