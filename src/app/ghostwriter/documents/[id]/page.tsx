'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useDocumentsContext } from '@/hooks/documents';
import { Document, DocumentStatus, DocumentType } from '@/hooks/documents/types';
import {
  Box,
  VStack,
  HStack,
  Text,
  Heading,
  Input,
  Textarea,
  Select,
  Button,
  Badge,
  useToast,
  Card,
  CardBody,
  Icon,
  Center,
  Spinner,
  FormControl,
  FormLabel,
  SimpleGrid,
} from '@chakra-ui/react';
import { FiCheckCircle, FiXCircle, FiTrash2, FiSave, FiFileText, FiInfo } from 'react-icons/fi';
import { AuthGuard } from '@/components/AuthGuard';

// Document status options
const statusOptions: { label: string; value: DocumentStatus }[] = [
  { label: 'Draft', value: 'draft' },
  { label: 'Approved', value: 'approved' },
  { label: 'Rejected', value: 'rejected' },
  { label: 'Published', value: 'published' },
  { label: 'Word Limit', value: 'word-limit' }
];

// Document type options
const typeOptions: { label: string; value: DocumentType }[] = [
  { label: 'Test', value: 'test' },
  { label: 'Aiwah Content Test', value: 'aiwah-content-test' }
];

// Status badge component
function StatusBadge({ status }: { status: DocumentStatus }) {
  const colorScheme = 
    status === 'draft' ? 'yellow' : 
    status === 'approved' ? 'green' :
    status === 'published' ? 'blue' :
    status === 'rejected' ? 'red' : 'gray';
  
  return (
    <Badge colorScheme={colorScheme} textTransform="capitalize" px={2} py={1}>
      {status}
    </Badge>
  );
}

export default function DocumentDetailPage() {
  const router = useRouter();
  const params = useParams();
  const id = typeof params.id === 'string' ? parseInt(params.id) : 0;
  
  const { 
    getDocument, 
    updateDocument, 
    deleteDocument, 
    operationsLoading, 
    updateDocumentStatus
  } = useDocumentsContext();
  
  const [document, setDocument] = useState<Document | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const toast = useToast();

  // Form state
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [type, setType] = useState<DocumentType>('test');
  const [status, setStatus] = useState<DocumentStatus>('draft');
  const [userComments, setUserComments] = useState('');
  const [notes, setNotes] = useState('');
  const [postedOn, setPostedOn] = useState('');
  
  // Load document on mount
  useEffect(() => {
    async function loadDocument() {
      if (!id) {
        setError('Invalid document ID');
        setLoading(false);
        return;
      }
      
      try {
        setLoading(true);
        const doc = await getDocument(id);
        if (doc) {
          setDocument(doc);
          setTitle(doc.title || '');
          setContent(doc.content || '');
          setType(doc.type || 'test');
          setStatus(doc.status || 'draft');
          setUserComments(doc.user_comments || '');
          setNotes(doc.notes || '');
          setPostedOn(formatDateForInput(doc.posted_on));
        } else {
          setError('Document not found');
        }
      } catch (err) {
        setError('Failed to load document');
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    
    loadDocument();
  }, [id, getDocument]);
  
  // Save document changes
  const handleSave = async () => {
    if (!document || !content.trim()) {
      toast({
        title: 'Content Required',
        description: 'Please enter document content',
        status: 'warning',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    try {
      const updatedDoc = await updateDocument({
        id: document.id,
        title: title.trim() || undefined,
        content: content.trim(),
        type,
        status,
        user_comments: userComments.trim() || undefined,
        notes: notes.trim() || undefined,
        posted_on: postedOn || undefined
      });
      
      if (updatedDoc) {
        setDocument(updatedDoc);
        toast({
          title: 'Document Saved',
          description: 'Your changes have been saved successfully',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
      }
    } catch (err) {
      toast({
        title: 'Save Failed',
        description: 'Failed to save document changes',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      console.error(err);
    }
  };
  
  // Handle status changes (approve/reject)
  const handleStatusChange = async (newStatus: DocumentStatus) => {
    if (!document) return;
    
    try {
      const updatedDoc = await updateDocumentStatus(document.id, newStatus);
      if (updatedDoc) {
        setDocument(updatedDoc);
        setStatus(newStatus);
        toast({
          title: 'Status Updated',
          description: `Document ${newStatus}`,
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
      }
    } catch (err) {
      toast({
        title: 'Status Update Failed',
        description: `Failed to ${newStatus} document`,
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      console.error(err);
    }
  };
  
  // Delete document
  const handleDelete = async () => {
    if (!document) return;
    
    if (!confirm('Are you sure you want to delete this document? This action cannot be undone.')) {
      return;
    }
    
    try {
      await deleteDocument(document.id);
      toast({
        title: 'Document Deleted',
        description: 'The document has been permanently deleted',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      router.push('/ghostwriter');
    } catch (err) {
      toast({
        title: 'Delete Failed',
        description: 'Failed to delete document',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      console.error(err);
    }
  };
  
  // Format date for display
  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return 'N/A';
    return new Date(dateStr).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  
  // Format date for input field
  const formatDateForInput = (dateStr: string | null) => {
    if (!dateStr) return '';
    return new Date(dateStr).toISOString().slice(0, 16);
  };

  // Loading state
  if (loading) {
    return (
      <AuthGuard>
        <Box h="100%" overflow="auto" p={8}>
          <Center h="400px">
            <VStack spacing={4}>
              <Spinner color="teal.400" size="lg" />
              <Text textStyle="body">Loading document...</Text>
            </VStack>
          </Center>
        </Box>
      </AuthGuard>
    );
  }

  // Error state
  if (error || !document) {
    return (
      <AuthGuard>
        <Box h="100%" overflow="auto" p={8}>
          <Center h="400px">
            <VStack spacing={4}>
              <Icon as={FiInfo} boxSize={16} color="red.400" />
              <Heading textStyle="section-heading" color="red.400">Document Not Found</Heading>
              <Text textStyle="body" textAlign="center">
                The document you are looking for does not exist or could not be loaded.
              </Text>
              <Button 
                colorScheme="teal"
                onClick={() => router.push('/ghostwriter')}
              >
                Back to Ghostwriter
              </Button>
            </VStack>
          </Center>
        </Box>
      </AuthGuard>
    );
  }

  return (
    <AuthGuard>
      <Box h="100%" overflow="auto" p={8}>
        <VStack spacing={8} align="stretch">
          {/* Header Section */}
          <HStack justify="space-between" align="center">
            <VStack align="start" spacing={2}>
              <HStack spacing={3}>
                <Icon as={FiFileText} color="teal.400" boxSize={6} />
                <Heading textStyle="page-title">Edit Document</Heading>
                <StatusBadge status={status} />
              </HStack>
              <Text textStyle="body" color="gray.400">
                ID: {document.id} • Last updated: {formatDate(document.updated_at)} • Type: {document.type}
              </Text>
            </VStack>
            
            <HStack spacing={3}>
              <Button
                leftIcon={<FiSave />}
                colorScheme="teal"
                onClick={handleSave}
                isLoading={operationsLoading}
                size="md"
                fontWeight="medium"
              >
                Save Changes
              </Button>
              <Button
                leftIcon={<FiCheckCircle />}
                colorScheme="green"
                variant="outline"
                onClick={() => handleStatusChange('approved')}
                isLoading={operationsLoading}
                isDisabled={status === 'approved'}
                size="md"
                fontWeight="medium"
              >
                Approve
              </Button>
              <Button
                leftIcon={<FiXCircle />}
                colorScheme="red"
                variant="outline"
                onClick={() => handleStatusChange('rejected')}
                isLoading={operationsLoading}
                isDisabled={status === 'rejected'}
                size="md"
                fontWeight="medium"
              >
                Reject
              </Button>
              <Button
                leftIcon={<FiTrash2 />}
                colorScheme="red"
                variant="ghost"
                onClick={handleDelete}
                isLoading={operationsLoading}
                size="md"
                fontWeight="medium"
              >
                Delete
              </Button>
            </HStack>
          </HStack>
          
          <Card bg="gray.800" borderColor="gray.700" borderWidth="1px" shadow="lg">
            <CardBody p={8}>
              <VStack spacing={8} align="stretch">
                {/* Basic Info Row */}
                <SimpleGrid columns={{ base: 1, lg: 3 }} spacing={6}>
                  <FormControl>
                    <FormLabel color="gray.300" fontWeight="medium" mb={3}>
                      Title
                    </FormLabel>
                    <Input
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="Enter document title..."
                      bg="gray.700"
                      borderColor="gray.600"
                      borderWidth="1px"
                      _hover={{ borderColor: 'gray.500' }}
                      _focus={{ 
                        borderColor: 'teal.400',
                        boxShadow: '0 0 0 1px var(--chakra-colors-teal-400)'
                      }}
                      _placeholder={{ color: 'gray.400' }}
                      fontSize="sm"
                      h="44px"
                    />
                  </FormControl>
                  
                  <FormControl>
                    <FormLabel color="gray.300" fontWeight="medium" mb={3}>
                      Type
                    </FormLabel>
                    <Select
                      value={type}
                      onChange={(e) => setType(e.target.value as DocumentType)}
                      bg="gray.700"
                      borderColor="gray.600"
                      borderWidth="1px"
                      _hover={{ borderColor: 'gray.500' }}
                      _focus={{ 
                        borderColor: 'teal.400',
                        boxShadow: '0 0 0 1px var(--chakra-colors-teal-400)'
                      }}
                      fontSize="sm"
                      h="44px"
                    >
                      {typeOptions.map(option => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </Select>
                  </FormControl>
                  
                  <FormControl>
                    <FormLabel color="gray.300" fontWeight="medium" mb={3}>
                      Status
                    </FormLabel>
                    <Select
                      value={status}
                      onChange={(e) => setStatus(e.target.value as DocumentStatus)}
                      bg="gray.700"
                      borderColor="gray.600"
                      borderWidth="1px"
                      _hover={{ borderColor: 'gray.500' }}
                      _focus={{ 
                        borderColor: 'teal.400',
                        boxShadow: '0 0 0 1px var(--chakra-colors-teal-400)'
                      }}
                      fontSize="sm"
                      h="44px"
                    >
                      {statusOptions.map(option => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </Select>
                  </FormControl>
                </SimpleGrid>
                
                {/* Content Section */}
                <FormControl>
                  <FormLabel color="gray.300" fontWeight="medium" mb={3}>
                    Content <Text as="span" color="red.400">*</Text>
                  </FormLabel>
                  <Textarea
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="Enter document content..."
                    bg="gray.700"
                    borderColor="gray.600"
                    borderWidth="1px"
                    _hover={{ borderColor: 'gray.500' }}
                    _focus={{ 
                      borderColor: 'teal.400',
                      boxShadow: '0 0 0 1px var(--chakra-colors-teal-400)'
                    }}
                    _placeholder={{ color: 'gray.400' }}
                    minH="320px"
                    resize="vertical"
                    fontSize="sm"
                    lineHeight="1.6"
                    p={4}
                  />
                </FormControl>
                
                {/* Two Column Layout for Comments and Notes */}
                <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={8}>
                  <FormControl>
                    <FormLabel color="gray.300" fontWeight="medium" mb={3}>
                      User Comments
                    </FormLabel>
                    <Textarea
                      value={userComments}
                      onChange={(e) => setUserComments(e.target.value)}
                      placeholder="Enter user comments..."
                      bg="gray.700"
                      borderColor="gray.600"
                      borderWidth="1px"
                      _hover={{ borderColor: 'gray.500' }}
                      _focus={{ 
                        borderColor: 'teal.400',
                        boxShadow: '0 0 0 1px var(--chakra-colors-teal-400)'
                      }}
                      _placeholder={{ color: 'gray.400' }}
                      minH="220px"
                      resize="vertical"
                      fontSize="sm"
                      lineHeight="1.6"
                      p={4}
                    />
                  </FormControl>
                  
                  <FormControl>
                    <FormLabel color="gray.300" fontWeight="medium" mb={3}>
                      Internal Notes
                    </FormLabel>
                    <Textarea
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder="Add internal notes..."
                      bg="gray.700"
                      borderColor="gray.600"
                      borderWidth="1px"
                      _hover={{ borderColor: 'gray.500' }}
                      _focus={{ 
                        borderColor: 'teal.400',
                        boxShadow: '0 0 0 1px var(--chakra-colors-teal-400)'
                      }}
                      _placeholder={{ color: 'gray.400' }}
                      minH="220px"
                      resize="vertical"
                      fontSize="sm"
                      lineHeight="1.6"
                      p={4}
                    />
                  </FormControl>
                </SimpleGrid>
                
                {/* Posted On Date */}
                <FormControl maxW="320px">
                  <FormLabel color="gray.300" fontWeight="medium" mb={3}>
                    Posted On
                  </FormLabel>
                  <Input
                    type="datetime-local"
                    value={postedOn}
                    onChange={(e) => setPostedOn(e.target.value)}
                    bg="gray.700"
                    borderColor="gray.600"
                    borderWidth="1px"
                    _hover={{ borderColor: 'gray.500' }}
                    _focus={{ 
                      borderColor: 'teal.400',
                      boxShadow: '0 0 0 1px var(--chakra-colors-teal-400)'
                    }}
                    fontSize="sm"
                    h="44px"
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