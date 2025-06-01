'use client';

import { Box, Heading, Text, Card, Input, IconButton, Select, Flex, Table, Thead, Tbody, Tr, Th, Td, ButtonGroup, Button, HStack, Menu, MenuButton, MenuList, MenuItem } from '@chakra-ui/react';
import { FiSearch, FiMoreVertical, FiChevronLeft, FiChevronRight, FiEye, FiEdit, FiPlus } from 'react-icons/fi';
import { useDocumentsContext, DocumentStatus } from '@/hooks/documents';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { StatusBadge } from './StatusBadge';
import { DocumentsTabLoading } from './loading';

export function DocumentsTab() {
  const router = useRouter();
  const { 
    documents,
    loading,
    error,
    totalCount,
    filter,
    updateFilter,
    refreshDocuments,
    updateDocumentStatus,
    deleteDocument
  } = useDocumentsContext();
  
  // Local state for search input
  const [searchQuery, setSearchQuery] = useState('');
  
  // Handle search submission
  const handleSearch = () => {
    updateFilter({ search: searchQuery, offset: 0 });
  };
  
  // Handle status filter change
  const handleStatusFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const status = e.target.value === 'all' ? undefined : e.target.value as DocumentStatus;
    updateFilter({ status, offset: 0 });
  };
  
  // Handle type filter change
  const handleTypeFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const type = e.target.value === 'all' ? undefined : e.target.value;
    updateFilter({ type, offset: 0 });
  };
  
  // Handle pagination
  const handlePreviousPage = () => {
    if ((filter.offset || 0) > 0) {
      const newOffset = Math.max(0, (filter.offset || 0) - (filter.limit || 10));
      updateFilter({ offset: newOffset });
    }
  };
  
  const handleNextPage = () => {
    const newOffset = (filter.offset || 0) + (filter.limit || 10);
    if (newOffset < totalCount) {
      updateFilter({ offset: newOffset });
    }
  };
  
  // Handle document actions
  const handleViewDocument = (id: number) => {
    router.push(`/ghostwriter/document/${id}`);
  };
  
  const handleEditDocument = (id: number) => {
    router.push(`/ghostwriter/document/${id}`);
  };
  
  const handleDeleteDocument = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this document?')) {
      const success = await deleteDocument(id);
      if (success) {
        refreshDocuments();
      }
    }
  };
  
  const handleChangeStatus = async (id: number, status: DocumentStatus) => {
    const result = await updateDocumentStatus(id, status);
    if (result) {
      refreshDocuments();
    }
  };
  
  // Handle create new document
  const handleCreateDocument = async () => {
    router.push('/ghostwriter/document/new');
  };
  
  // Calculate pagination info
  const currentPage = Math.floor((filter.offset || 0) / (filter.limit || 10)) + 1;
  const totalPages = Math.ceil(totalCount / (filter.limit || 10));
  const startItem = (filter.offset || 0) + 1;
  const endItem = Math.min((filter.offset || 0) + (filter.limit || 10), totalCount);

  return (
    <Box>
      <Box mb={6}>
        <Flex justify="space-between" align="center" mb={4}>
          <Box>
            <Heading as="h2" size="lg" mb={2} color="white">Documents</Heading>
            <Text color="gray.400">Manage your documents collection</Text>
          </Box>
          <Button 
            leftIcon={<FiPlus />} 
            colorScheme="teal" 
            onClick={handleCreateDocument}
          >
            Create Document
          </Button>
        </Flex>
      </Box>
      
      <Card bg="gray.800" borderColor="gray.700" mb={8}>
        <Box p={4}>
          <Flex direction={{ base: 'column', md: 'row' }} gap={4} mb={6}>
            {/* Search bar */}
            <Flex flex="1">
              <Input 
                placeholder="Search documents..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                bg="gray.700"
                border="none"
              />
              <IconButton
                aria-label="Search"
                icon={<FiSearch />}
                onClick={handleSearch}
                ml={2}
                colorScheme="teal"
              />
            </Flex>
            
            {/* Filters */}
            <Flex gap={2}>
              <Select 
                placeholder="Status" 
                onChange={handleStatusFilterChange}
                value={filter.status || 'all'}
                bg="gray.700"
                border="none"
                maxW={200}
              >
                <option value="all">All Statuses</option>
                <option value="draft">Draft</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
                <option value="published">Published</option>
                <option value="word-limit">Word Limit</option>
              </Select>
              
              <Select 
                placeholder="Type" 
                onChange={handleTypeFilterChange} 
                value={filter.type || 'all'}
                bg="gray.700"
                border="none"
                maxW={200}
              >
                <option value="all">All Types</option>
                <option value="test">Test</option>
                <option value="aiwah-content-test">Aiwah Content Test</option>
              </Select>
            </Flex>
          </Flex>
          
          {/* Document List */}
          {loading ? (
            <DocumentsTabLoading />
          ) : error ? (
            <Box textAlign="center" p={6} color="red.400">
              <Text>Error loading documents. Please try again.</Text>
            </Box>
          ) : documents.length === 0 ? (
            <Box textAlign="center" p={10} color="gray.400">
              <Text>No documents found matching your criteria.</Text>
            </Box>
          ) : (
            <>
              <Box overflowX="auto">
                <Table variant="simple" size="md" color="gray.200">
                  <Thead>
                    <Tr>
                      <Th color="gray.400">Title</Th>
                      <Th color="gray.400">Type</Th>
                      <Th color="gray.400">Status</Th>
                      <Th color="gray.400">Created</Th>
                      <Th color="gray.400">Updated</Th>
                      <Th color="gray.400" textAlign="right">Actions</Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {documents.map((doc) => (
                      <Tr key={doc.id} _hover={{ bg: 'gray.700' }}>
                        <Td>
                          <Text
                            fontWeight="medium"
                            _hover={{ color: 'teal.400', cursor: 'pointer' }}
                            onClick={() => handleViewDocument(doc.id)}
                            noOfLines={1}
                          >
                            {doc.title || 'Untitled Document'}
                          </Text>
                        </Td>
                        <Td>
                          <Text color="gray.400">{doc.type || 'Unknown'}</Text>
                        </Td>
                        <Td>
                          <StatusBadge status={doc.status} />
                        </Td>
                        <Td>
                          <Text color="gray.400">{new Date(doc.created_at).toLocaleDateString()}</Text>
                        </Td>
                        <Td>
                          <Text color="gray.400">{new Date(doc.updated_at).toLocaleDateString()}</Text>
                        </Td>
                        <Td textAlign="right">
                          <HStack spacing={1} justifyContent="flex-end">
                            <IconButton
                              aria-label="View document"
                              icon={<FiEye />}
                              size="sm"
                              variant="ghost"
                              onClick={() => handleViewDocument(doc.id)}
                            />
                            <IconButton
                              aria-label="Edit document"
                              icon={<FiEdit />}
                              size="sm"
                              variant="ghost"
                              onClick={() => handleEditDocument(doc.id)}
                            />
                            <Menu>
                              <MenuButton
                                as={IconButton}
                                aria-label="More options"
                                icon={<FiMoreVertical />}
                                size="sm"
                                variant="ghost"
                              />
                              <MenuList bg="gray.800" borderColor="gray.700">
                                <MenuItem 
                                  bg="gray.800" 
                                  _hover={{ bg: 'gray.700' }}
                                  onClick={() => handleChangeStatus(doc.id, 'draft')}
                                >
                                  Mark as Draft
                                </MenuItem>
                                <MenuItem 
                                  bg="gray.800" 
                                  _hover={{ bg: 'gray.700' }}
                                  onClick={() => handleChangeStatus(doc.id, 'approved')}
                                >
                                  Mark as Approved
                                </MenuItem>
                                <MenuItem 
                                  bg="gray.800" 
                                  _hover={{ bg: 'gray.700' }}
                                  onClick={() => handleChangeStatus(doc.id, 'rejected')}
                                >
                                  Mark as Rejected
                                </MenuItem>
                                <MenuItem 
                                  bg="gray.800" 
                                  _hover={{ bg: 'gray.700' }}
                                  onClick={() => handleChangeStatus(doc.id, 'published')}
                                >
                                  Mark as Published
                                </MenuItem>
                                <MenuItem 
                                  bg="gray.800" 
                                  _hover={{ bg: 'red.900' }}
                                  color="red.300"
                                  onClick={() => handleDeleteDocument(doc.id)}
                                >
                                  Delete
                                </MenuItem>
                              </MenuList>
                            </Menu>
                          </HStack>
                        </Td>
                      </Tr>
                    ))}
                  </Tbody>
                </Table>
              </Box>
              
              {/* Pagination */}
              <Flex justify="space-between" align="center" mt={6}>
                <Text color="gray.400">
                  Showing {startItem} to {endItem} of {totalCount} documents
                </Text>
                <ButtonGroup>
                  <Button
                    leftIcon={<FiChevronLeft />}
                    onClick={handlePreviousPage}
                    isDisabled={currentPage === 1}
                    variant="outline"
                    size="sm"
                  >
                    Previous
                  </Button>
                  <Button
                    rightIcon={<FiChevronRight />}
                    onClick={handleNextPage}
                    isDisabled={currentPage === totalPages}
                    variant="outline"
                    size="sm"
                  >
                    Next
                  </Button>
                </ButtonGroup>
              </Flex>
            </>
          )}
        </Box>
      </Card>
    </Box>
  );
} 