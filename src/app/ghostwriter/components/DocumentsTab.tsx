'use client';

import React, { useState, useMemo } from 'react';
import {
  Box,
  VStack,
  HStack,
  Text,
  Button,
  Input,
  InputGroup,
  InputLeftElement,
  Select,
  Flex,
  Icon,
  Badge,
  Center,
  useToast,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  IconButton,
  Spinner,
  Alert,
  AlertIcon,
} from '@chakra-ui/react';
import {
  FiSearch,
  FiPlus,
  FiMoreVertical,
  FiEdit,
  FiTrash2,
  FiEye,
  FiClock,
  FiCalendar,
} from 'react-icons/fi';
import { useDocumentsContext } from '@/hooks/documents';
import { Document, DocumentStatus } from '@/hooks/documents/types';

interface DocumentsTabProps {
  onCreateDocument: () => void;
  onEditDocument: (document: Document) => void;
  onViewDocument: (document: Document) => void;
}

export function DocumentsTab({ onCreateDocument, onEditDocument, onViewDocument }: DocumentsTabProps) {
  const { documents, loading, error, deleteDocument } = useDocumentsContext();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<DocumentStatus | 'all'>('all');
  const toast = useToast();

  // Filter documents based on search and status
  const filteredDocuments = useMemo(() => {
    return documents.filter((doc: Document) => {
      const matchesSearch = (doc.title || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
                          doc.content.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = statusFilter === 'all' || doc.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [documents, searchQuery, statusFilter]);

  const handleDeleteDocument = async (documentId: number) => {
    if (window.confirm('Are you sure you want to delete this document?')) {
      const success = await deleteDocument(documentId);
      if (success) {
        toast({
          title: 'Document deleted',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
      } else {
        toast({
          title: 'Failed to delete document',
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
      }
    }
  };

  if (loading) {
    return (
      <Center p={8}>
        <VStack spacing={4}>
          <Spinner color="brand.400" size="lg" />
          <Text textStyle="body" color="gray.400">Loading documents...</Text>
        </VStack>
      </Center>
    );
  }

  if (error) {
    return (
      <Alert status="error" bg="red.950" borderColor="red.800">
        <AlertIcon color="red.400" />
        <Text color="red.300">Failed to load documents: {String(error)}</Text>
      </Alert>
    );
  }

  return (
    <Box>
      <VStack spacing={6} align="stretch">
        {/* Header */}
        <Flex justify="space-between" align="center">
          <VStack align="start" spacing={1}>
            <Text textStyle="section-heading" color="gray.100" fontWeight="600">
              Documents
            </Text>
            <Text textStyle="body" color="gray.400">
              {filteredDocuments.length} documents found
            </Text>
          </VStack>
          
          <Button 
            leftIcon={<FiPlus />} 
            colorScheme="teal" 
            onClick={onCreateDocument}
          >
            New Document
          </Button>
        </Flex>

        {/* Filters */}
        <HStack spacing={4}>
          <InputGroup maxW="400px">
            <InputLeftElement pointerEvents="none">
              <Icon as={FiSearch} color="gray.400" />
            </InputLeftElement>
            <Input
              placeholder="Search documents..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              bg="gray.800"
              borderColor="gray.600"
              _focus={{ borderColor: 'brand.400' }}
            />
          </InputGroup>

          <Select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as DocumentStatus | 'all')}
            maxW="200px"
            bg="gray.800"
            borderColor="gray.600"
          >
            <option value="all">All Status</option>
            <option value="draft">Draft</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
            <option value="published">Published</option>
          </Select>
        </HStack>

        {/* Documents Grid */}
        {filteredDocuments.length === 0 ? (
          <Center p={12}>
            <VStack spacing={4}>
              <Text textStyle="body" color="gray.400">
                No documents found
              </Text>
              <Button onClick={onCreateDocument} colorScheme="teal" size="sm">
                Create your first document
              </Button>
            </VStack>
          </Center>
        ) : (
          <VStack spacing={4} align="stretch">
            {filteredDocuments.map((doc: Document) => (
              <Box
                key={doc.id}
                p={6}
                bg="gray.800"
                borderRadius="lg"
                border="1px solid"
                borderColor="gray.700"
                cursor="pointer"
                onClick={() => onViewDocument(doc)}
                _hover={{
                  borderColor: 'gray.600',
                  transform: 'translateY(-1px)',
                  shadow: 'lg'
                }}
                transition="all 0.2s"
              >
                <Flex justify="space-between" align="start">
                  <VStack align="start" spacing={3} flex={1} mr={4}>
                    <HStack spacing={3}>
                      <Badge
                        colorScheme={
                          doc.status === 'published' ? 'green' :
                          doc.status === 'approved' ? 'blue' :
                          doc.status === 'rejected' ? 'red' : 'gray'
                        }
                        variant="subtle"
                      >
                        {doc.status}
                      </Badge>
                      <Text textStyle="caption" color="gray.500">
                        #{doc.id}
                      </Text>
                    </HStack>

                    <Text textStyle="body" color="gray.200" noOfLines={3}>
                      {doc.content.slice(0, 200)}...
                    </Text>

                    <HStack spacing={4}>
                      <HStack spacing={2}>
                        <Icon as={FiClock} color="gray.400" boxSize={4} />
                        <Text textStyle="caption" color="gray.400">
                          {new Date(doc.created_at).toLocaleDateString()}
                        </Text>
                      </HStack>
                      {doc.posted_on && (
                        <HStack spacing={2}>
                          <Icon as={FiCalendar} color="green.400" boxSize={4} />
                          <Text textStyle="caption" color="green.400">
                            Published {new Date(doc.posted_on).toLocaleDateString()}
                          </Text>
                        </HStack>
                      )}
                    </HStack>
                  </VStack>

                  <Menu>
                    <MenuButton
                      as={IconButton}
                      aria-label="More options"
                      icon={<FiMoreVertical />}
                      size="sm"
                      variant="ghost"
                      onClick={(e) => e.stopPropagation()}
                    />
                    <MenuList bg="gray.800" borderColor="gray.700">
                      <MenuItem
                        bg="gray.800"
                        _hover={{ bg: 'gray.700' }}
                        icon={<FiEye />}
                        onClick={(e) => {
                          e.stopPropagation();
                          onViewDocument(doc);
                        }}
                      >
                        View
                      </MenuItem>
                      <MenuItem
                        bg="gray.800"
                        _hover={{ bg: 'gray.700' }}
                        icon={<FiEdit />}
                        onClick={(e) => {
                          e.stopPropagation();
                          onEditDocument(doc);
                        }}
                      >
                        Edit
                      </MenuItem>
                      <MenuItem
                        bg="gray.800"
                        _hover={{ bg: 'red.900' }}
                        color="red.300"
                        icon={<FiTrash2 />}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteDocument(doc.id);
                        }}
                      >
                        Delete
                      </MenuItem>
                    </MenuList>
                  </Menu>
                </Flex>
              </Box>
            ))}
          </VStack>
        )}
      </VStack>
    </Box>
  );
} 