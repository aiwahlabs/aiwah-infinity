'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useDocumentsContext } from '@/hooks/documents';
import { Document, DocumentStatus } from '@/hooks/documents/types';
import {
  Box,
  Container,
  Flex,
  HStack,
  VStack,
  Grid,
  Text,
  Heading,
  Input,
  Textarea,
  Select,
  Button,
  Badge,
  useToast,
  Spacer,
  Card,
  CardBody,
  Icon,
  Center,
  Spinner
} from '@chakra-ui/react';
import { FiArrowLeft, FiCheckCircle, FiXCircle, FiTrash2, FiSave, FiInfo } from 'react-icons/fi';
import { AuthGuard } from '@/components/AuthGuard';


// Define document status options
const statusOptions = [
  { label: 'Draft', value: 'draft' },
  { label: 'Approved', value: 'approved' },
  { label: 'Rejected', value: 'rejected' },
  { label: 'Published', value: 'published' },
  { label: 'Word Limit', value: 'word-limit' }
];

// Define document type options
const typeOptions = [
  { label: 'Test', value: 'test' },
  { label: 'Aiwah Content Test', value: 'aiwah-content-test' }
];

// Status badge component
function StatusBadge({ status }: { status: DocumentStatus | null }) {
  const colorScheme = 
    status === 'draft' ? 'yellow' : 
    status === 'approved' ? 'green' :
    status === 'published' ? 'blue' :
    status === 'rejected' ? 'red' : 'gray';
  
  return (
    <Badge colorScheme={colorScheme} textTransform="capitalize" px={2} py={1}>
      {status || 'unknown'}
    </Badge>
  );
}

export default function DocumentDetail() {
  const router = useRouter();
  const params = useParams();
  const id = typeof params.id === 'string' ? parseInt(params.id) : 0;
  const isNewDoc = id === 0 || params.id === 'new';
  
  const { 
    getDocument, 
    updateDocument, 
    deleteDocument, 
    operationsLoading, 
    updateDocumentStatus,
    createDocument
  } = useDocumentsContext();
  
  const [document, setDocument] = useState<Document | null>(null);
  const [loading, setLoading] = useState(!isNewDoc);
  const [error, setError] = useState<string | null>(null);
  const toast = useToast();

  // Form state
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [type, setType] = useState<string>('');
  const [status, setStatus] = useState<DocumentStatus>('draft');
  const [userComments, setUserComments] = useState('');
  const [notes, setNotes] = useState('');
  const [postedOn, setPostedOn] = useState('');
  const [submitting, setSubmitting] = useState(false);
  
  // Fetch document on load or initialize a new one
  useEffect(() => {
    async function loadDocument() {
      if (isNewDoc) {
        // Initialize a new document
        setDocument({
          id: 0,
          title: '',
          content: '',
          status: 'draft' as DocumentStatus,
          type: 'test',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          tags: [],
          user_comments: '',
          notes: '',
          posted_on: null
        });
        setLoading(false);
        return;
      }
      
      if (id) {
        try {
          setLoading(true);
          const doc = await getDocument(id);
          if (doc) {
            setDocument(doc);
            setTitle(doc.title || '');
            setContent(doc.content || '');
            setType(doc.type || '');
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
    }
    
    loadDocument();
  }, [id, getDocument, isNewDoc]);
  
  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    
    try {
      // Format the data to match what Supabase expects
      const formData = {
        title: title || undefined,
        content: content || '',
        type: type || undefined,
        status: status || undefined,
        user_comments: userComments || undefined,
        notes: notes || undefined,
        posted_on: postedOn || undefined
      };
      
      if (isNewDoc) {
        // Create a new document
        const newDoc = await createDocument(formData);
        if (newDoc) {
          setDocument(newDoc);
          toast({
            title: 'Document created',
            status: 'success',
            duration: 3000,
            isClosable: true,
          });
          // Navigate to the new document
          router.push(`/ghostwriter/document/${newDoc.id}`);
        }
      } else if (document) {
        // Update existing document
        const updatedDoc = await updateDocument({
          id: document.id,
          ...formData
        });
        
        if (updatedDoc) {
          setDocument(updatedDoc);
          toast({
            title: 'Document saved',
            status: 'success',
            duration: 3000,
            isClosable: true,
          });
        }
      }
    } catch (err) {
      toast({
        title: isNewDoc ? 'Failed to create document' : 'Failed to save document',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };
  
  // Handle status change
  const handleStatusChange = async (status: DocumentStatus) => {
    if (!document || isNewDoc) return;
    
    try {
      const updatedDoc = await updateDocumentStatus(document.id, status);
      if (updatedDoc) {
        setDocument(updatedDoc);
        setStatus(status);
        toast({
          title: `Document marked as ${status}`,
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
      }
    } catch (err) {
      toast({
        title: 'Failed to update status',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      console.error(err);
    }
  };
  
  // Handle document deletion
  const handleDelete = async () => {
    if (!document || isNewDoc) return;
    
    if (window.confirm('Are you sure you want to delete this document? This action cannot be undone.')) {
      try {
        const success = await deleteDocument(document.id);
        if (success) {
          toast({
            title: 'Document deleted',
            status: 'info',
            duration: 3000,
            isClosable: true,
          });
          router.push('/ghostwriter');
        }
      } catch (err) {
        toast({
          title: 'Failed to delete document',
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
        console.error(err);
      }
    }
  };
  
  // Format date for display
  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return 'N/A';
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  
  // Format date for input value
  const formatDateForInput = (dateStr: string | null) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return date.toISOString().split('T')[0]; // Returns YYYY-MM-DD
  };
  
  if (loading) {
    return (
      <Container maxW="container.xl" py={8}>
        <Center p={10}>
          <Spinner color="teal.400" size="lg" />
        </Center>
      </Container>
    );
  }
  
  if (error || (!document && !isNewDoc)) {
    return (
      <Container maxW="container.xl" py={8}>
        <Center p={10} flexDirection="column">
          <Icon as={FiInfo} boxSize={16} color="red.400" mb={4} />
          <Heading size="lg" mb={2} color="white">Document Not Found</Heading>
          <Text color="gray.400" mb={6}>The document you&apos;re looking for doesn&apos;t exist or couldn&apos;t be loaded.</Text>
          <Button 
            leftIcon={<FiArrowLeft />} 
            colorScheme="teal"
            onClick={() => router.push('/ghostwriter')}
          >
            Back to Ghostwriter
          </Button>
        </Center>
      </Container>
    );
  }
  
  return (
    <AuthGuard>
      <Container maxW="container.xl" py={6}>
        {/* Header with Title and Action Buttons */}
        <Box mb={6}>
          <Flex align="center" mb={4}>
            <Button 
              leftIcon={<FiArrowLeft />} 
              variant="ghost" 
              onClick={() => router.push('/ghostwriter')}
              size="sm"
              color="gray.400"
              _hover={{ color: 'white' }}
            >
              Back to Ghostwriter
            </Button>
            <Spacer />
            <HStack spacing={3}>
              <Button
                type="submit"
                leftIcon={<FiSave />}
                colorScheme="teal"
                onClick={handleSubmit}
                isLoading={submitting}
                size="sm"
              >
                Save Changes
              </Button>
              {!isNewDoc && (
                <>
                  <Button
                    leftIcon={<FiCheckCircle />}
                    colorScheme="green"
                    variant="outline"
                    onClick={() => handleStatusChange('approved')}
                    isLoading={operationsLoading}
                    isDisabled={document?.status === 'approved'}
                    size="sm"
                  >
                    Approve
                  </Button>
                  <Button
                    leftIcon={<FiXCircle />}
                    colorScheme="red"
                    variant="outline"
                    onClick={() => handleStatusChange('rejected')}
                    isLoading={operationsLoading}
                    isDisabled={document?.status === 'rejected'}
                    size="sm"
                  >
                    Reject
                  </Button>
                  <Button
                    leftIcon={<FiTrash2 />}
                    colorScheme="red"
                    variant="ghost"
                    onClick={handleDelete}
                    isLoading={operationsLoading}
                    size="sm"
                  >
                    Delete
                  </Button>
                </>
              )}
            </HStack>
          </Flex>
          
          {/* Document Title and Info */}
          <Flex align="center" mb={2}>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Document Title"
              variant="unstyled"
              fontSize="2xl"
              fontWeight="bold"
              color="white"
              size="lg"
              _placeholder={{ color: 'gray.500' }}
              maxW="70%"
            />
            <Spacer />
            {!isNewDoc && (
              <HStack spacing={4}>
                <StatusBadge status={status} />
                <Text color="gray.400" fontSize="sm">ID: {document?.id}</Text>
                <Text color="gray.400" fontSize="sm">Type: {document?.type || 'N/A'}</Text>
              </HStack>
            )}
          </Flex>
          <Text color="gray.400" fontSize="sm" mb={4}>
            {!isNewDoc && `Last Updated: ${formatDate(document?.updated_at || null)}`}
          </Text>
        </Box>
        
        <form onSubmit={handleSubmit}>
          {/* Top Row: Content and Comments (2 columns) */}
          <Grid templateColumns="1fr 1fr" gap={6} mb={6}>
            {/* Content Column */}
            <Box>
              <Heading as="h3" size="md" color="white" mb={3}>
                Content
              </Heading>
              <Textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Enter document content..."
                bg="gray.800"
                border="1px solid"
                borderColor="gray.700"
                borderRadius="md"
                size="md"
                height="300px"
                p={4}
                resize="none"
                _focus={{
                  borderColor: 'teal.400',
                  boxShadow: '0 0 0 1px var(--chakra-colors-teal-400)'
                }}
                whiteSpace="pre-wrap"
                lineHeight="1.8"
                fontSize="md"
              />
            </Box>
            
            {/* Comments Column */}
            <Box>
              <Heading as="h3" size="md" color="white" mb={3}>
                User Comments
              </Heading>
              <Textarea
                value={userComments}
                onChange={(e) => setUserComments(e.target.value)}
                placeholder="Enter user comments..."
                bg="gray.800"
                border="1px solid"
                borderColor="gray.700"
                borderRadius="md"
                size="md"
                height="300px"
                p={4}
                resize="none"
                _focus={{
                  borderColor: 'teal.400',
                  boxShadow: '0 0 0 1px var(--chakra-colors-teal-400)'
                }}
                whiteSpace="pre-wrap"
                lineHeight="1.8"
                fontSize="md"
              />
            </Box>
          </Grid>
          
          {/* Middle Row: Notes (full width) */}
          <Box mb={6}>
            <Heading as="h3" size="md" color="white" mb={3}>
              Notes
            </Heading>
            <Textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Enter internal notes..."
              bg="gray.800"
              border="1px solid"
              borderColor="gray.700"
              borderRadius="md"
              size="md"
              height="200px"
              p={4}
              resize="none"
              _focus={{
                borderColor: 'teal.400',
                boxShadow: '0 0 0 1px var(--chakra-colors-teal-400)'
              }}
              whiteSpace="pre-wrap"
              lineHeight="1.8"
              fontSize="md"
            />
          </Box>
          
          {/* Bottom Row: Form Fields (2 columns) */}
          <Grid templateColumns="1fr 1fr" gap={6} mb={6}>
            {/* Left Column */}
            <Card bg="gray.800" borderColor="gray.700" variant="outline">
              <CardBody>
                <Heading as="h3" size="md" color="white" mb={4}>
                  Document Information
                </Heading>
                
                <VStack spacing={4} align="stretch">
                  <Box>
                    <Text color="gray.400" fontSize="sm" mb={1}>Title</Text>
                    <Input
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="Document title"
                      bg="gray.700"
                      border="1px solid"
                      borderColor="gray.600"
                      size="sm"
                    />
                    <Text color="gray.500" fontSize="xs" mt={1}>Document title</Text>
                  </Box>
                  
                  <Box>
                    <Text color="gray.400" fontSize="sm" mb={1}>Type</Text>
                    <Select
                      value={type}
                      onChange={(e) => setType(e.target.value)}
                      bg="gray.700"
                      border="1px solid"
                      borderColor="gray.600"
                      size="sm"
                    >
                      <option value="">Select Type</option>
                      {typeOptions.map(option => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </Select>
                    <Text color="gray.500" fontSize="xs" mt={1}>Document type</Text>
                  </Box>
                </VStack>
              </CardBody>
            </Card>
            
            {/* Right Column */}
            <Card bg="gray.800" borderColor="gray.700" variant="outline">
              <CardBody>
                <Heading as="h3" size="md" color="white" mb={4}>
                  Status Information
                </Heading>
                
                <VStack spacing={4} align="stretch">
                  <Box>
                    <Text color="gray.400" fontSize="sm" mb={1}>Status</Text>
                    <Select
                      value={status}
                      onChange={(e) => setStatus(e.target.value as DocumentStatus)}
                      bg="gray.700"
                      border="1px solid"
                      borderColor="gray.600"
                      size="sm"
                    >
                      {statusOptions.map(option => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </Select>
                    <Text color="gray.500" fontSize="xs" mt={1}>Document status</Text>
                  </Box>
                  
                  <Box>
                    <Text color="gray.400" fontSize="sm" mb={1}>Posted On</Text>
                    <Input
                      type="date"
                      value={postedOn}
                      onChange={(e) => setPostedOn(e.target.value)}
                      bg="gray.700"
                      border="1px solid"
                      borderColor="gray.600"
                      size="sm"
                    />
                    <Text color="gray.500" fontSize="xs" mt={1}>Date when document was posted</Text>
                  </Box>
                </VStack>
              </CardBody>
            </Card>
          </Grid>
          
          {/* Footer - Creation Info */}
          {!isNewDoc && (
            <Box mb={6}>
              <HStack spacing={4} color="gray.500" fontSize="sm">
                <Text>Created: {formatDate(document?.created_at || null)}</Text>
                <Text>Last Updated: {formatDate(document?.updated_at || null)}</Text>
              </HStack>
            </Box>
          )}
        </form>
      </Container>
    </AuthGuard>
  );
} 