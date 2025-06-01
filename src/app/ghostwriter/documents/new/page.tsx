'use client';

import React, { useState } from 'react';
import { 
  Box, 
  Heading, 
  Text, 
  VStack, 
  HStack, 
  Button, 
  Input,
  Textarea,
  Select,
  FormControl,
  FormLabel,
  Card,
  CardBody,
  Icon,
  useToast
} from '@chakra-ui/react';
import { FiSave, FiFileText } from 'react-icons/fi';
import { AuthGuard } from '@/components/AuthGuard';
import { useDocumentsContext } from '@/hooks/documents';
import { useRouter } from 'next/navigation';
import { DocumentType, DocumentStatus } from '@/hooks/documents/types';

export default function NewDocumentPage() {
  const router = useRouter();
  const toast = useToast();
  const { createDocument, operationsLoading } = useDocumentsContext();

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [type, setType] = useState<DocumentType>('test');
  const [status, setStatus] = useState<DocumentStatus>('draft');
  const [notes, setNotes] = useState('');

  const handleSave = async () => {
    if (!content.trim()) {
      toast({
        title: 'Content Required',
        description: 'Please enter document content',
        status: 'warning',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    const document = await createDocument({
      title: title.trim() || undefined,
      content: content.trim(),
      type,
      status,
      notes: notes.trim() || undefined,
    });

    if (document) {
      toast({
        title: 'Document Created',
        description: 'Your document has been saved successfully',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
              router.push(`/ghostwriter/documents/${document.id}`);
    } else {
      toast({
        title: 'Error',
        description: 'Failed to create document',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  return (
    <AuthGuard>
      <Box h="100%" overflow="auto" p={8}>
        <VStack spacing={6} align="stretch">
          <HStack spacing={4} align="center" justify="space-between">
            <VStack align="start" spacing={1}>
              <HStack>
                <Icon as={FiFileText} color="teal.400" boxSize={5} />
                <Heading textStyle="page-title">Create New Document</Heading>
              </HStack>
              <Text textStyle="body">Write and save your content</Text>
            </VStack>
                          <Button
                leftIcon={<FiSave />}
                colorScheme="teal"
                onClick={handleSave}
                isLoading={operationsLoading}
              >
              Save Document
            </Button>
          </HStack>
          
          <Card bg="gray.800" borderColor="gray.700">
            <CardBody>
              <VStack spacing={6} align="stretch">
                <HStack spacing={4} align="end">
                  <FormControl flex={2}>
                    <FormLabel color="gray.300">Title (Optional)</FormLabel>
                    <Input
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="Enter document title..."
                      bg="gray.700"
                      border="none"
                      _placeholder={{ color: 'gray.400' }}
                    />
                  </FormControl>
                  
                  <FormControl maxW="200px">
                    <FormLabel color="gray.300">Type</FormLabel>
                    <Select
                      value={type}
                      onChange={(e) => setType(e.target.value as DocumentType)}
                      bg="gray.700"
                      border="none"
                    >
                      <option value="test">Test</option>
                      <option value="aiwah-content-test">Aiwah Content Test</option>
                    </Select>
                  </FormControl>
                  
                  <FormControl maxW="150px">
                    <FormLabel color="gray.300">Status</FormLabel>
                    <Select
                      value={status}
                      onChange={(e) => setStatus(e.target.value as DocumentStatus)}
                      bg="gray.700"
                      border="none"
                    >
                      <option value="draft">Draft</option>
                      <option value="approved">Approved</option>
                      <option value="rejected">Rejected</option>
                      <option value="published">Published</option>
                      <option value="word-limit">Word Limit</option>
                    </Select>
                  </FormControl>
                </HStack>
                
                <FormControl>
                  <FormLabel color="gray.300">Content *</FormLabel>
                  <Textarea
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="Start writing your content here..."
                    bg="gray.700"
                    border="none"
                    _placeholder={{ color: 'gray.400' }}
                    minH="400px"
                    resize="vertical"
                  />
                </FormControl>
                
                <FormControl>
                  <FormLabel color="gray.300">Notes (Optional)</FormLabel>
                  <Textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Add any notes or comments..."
                    bg="gray.700"
                    border="none"
                    _placeholder={{ color: 'gray.400' }}
                    minH="100px"
                    resize="vertical"
                  />
                </FormControl>
              </VStack>
            </CardBody>
          </Card>
        </VStack>
      </Box>
    </AuthGuard>
  );
} 