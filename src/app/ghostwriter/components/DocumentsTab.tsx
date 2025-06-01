'use client';

import { 
  Box, 
  Heading, 
  Text, 
  Card, 
  CardBody,
  Input, 
  IconButton, 
  Select, 
  Flex, 
  Button, 
  HStack, 
  VStack,
  SimpleGrid,
  Menu, 
  MenuButton, 
  MenuList, 
  MenuItem, 
  Center, 
  Spinner,
  Badge,
  Divider,
  useToast
} from '@chakra-ui/react';
import { 
  FiSearch, 
  FiMoreVertical, 
  FiChevronLeft, 
  FiChevronRight, 
  FiEdit, 
  FiPlus,
  FiCalendar,
  FiMessageCircle,
  FiFileText,
  FiClock
} from 'react-icons/fi';
import { useDocumentsContext, DocumentStatus } from '@/hooks/documents';
import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { StatusBadge } from './StatusBadge';

// Define filter props interface
interface DocumentsTabProps {
  defaultStatus?: DocumentStatus;
  title?: string;
  description?: string;
  showCreateButton?: boolean;
  defaultLimit?: number;
}

// Format date for display
const formatDate = (dateStr: string | null) => {
  if (!dateStr) return null;
  return new Date(dateStr).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

// Truncate content for preview
const truncateContent = (content: string, maxLength: number = 150) => {
  if (content.length <= maxLength) return content;
  return content.slice(0, maxLength) + '...';
};

// Document Card Component
function DocumentCard({ document, onEdit, onStatusChange, onDelete }: {
  document: any;
  onEdit: (id: number) => void;
  onStatusChange: (id: number, status: DocumentStatus) => void;
  onDelete: (id: number) => void;
}) {
  const postedDate = formatDate(document.posted_on);
  const createdDate = formatDate(document.created_at);
  const hasUserComments = document.user_comments?.trim();
  const hasNotes = document.notes?.trim();

  return (
    <Card 
      bg="gray.800" 
      borderColor="gray.700" 
      borderWidth="1px"
      shadow="sm"
      _hover={{ 
        borderColor: 'gray.600',
        shadow: 'md',
        transform: 'translateY(-1px)'
      }}
      transition="all 0.2s ease"
      cursor="pointer"
      onClick={() => onEdit(document.id)}
    >
      <CardBody p={5}>
        <VStack align="stretch" spacing={4}>
          {/* Header with Status and Actions */}
          <Flex justify="space-between" align="start">
            <HStack spacing={3}>
              <Text textStyle="caption" color="gray.500" fontWeight="medium">
                #{document.id}
              </Text>
              <StatusBadge status={document.status} />
              {document.type && (
                <Badge colorScheme="blue" variant="subtle" fontSize="xs">
                  {document.type}
                </Badge>
              )}
            </HStack>
            
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
                  icon={<FiEdit />}
                  onClick={(e) => {
                    e.stopPropagation();
                    onEdit(document.id);
                  }}
                >
                  Edit Document
                </MenuItem>
                <Divider borderColor="gray.700" />
                <MenuItem 
                  bg="gray.800" 
                  _hover={{ bg: 'gray.700' }}
                  onClick={(e) => {
                    e.stopPropagation();
                    onStatusChange(document.id, 'draft');
                  }}
                >
                  Mark as Draft
                </MenuItem>
                <MenuItem 
                  bg="gray.800" 
                  _hover={{ bg: 'gray.700' }}
                  onClick={(e) => {
                    e.stopPropagation();
                    onStatusChange(document.id, 'approved');
                  }}
                >
                  Mark as Approved
                </MenuItem>
                <MenuItem 
                  bg="gray.800" 
                  _hover={{ bg: 'gray.700' }}
                  onClick={(e) => {
                    e.stopPropagation();
                    onStatusChange(document.id, 'rejected');
                  }}
                >
                  Mark as Rejected
                </MenuItem>
                <MenuItem 
                  bg="gray.800" 
                  _hover={{ bg: 'gray.700' }}
                  onClick={(e) => {
                    e.stopPropagation();
                    onStatusChange(document.id, 'published');
                  }}
                >
                  Mark as Published
                </MenuItem>
                <Divider borderColor="gray.700" />
                <MenuItem 
                  bg="gray.800" 
                  _hover={{ bg: 'red.900' }}
                  color="red.300"
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete(document.id);
                  }}
                >
                  Delete
                </MenuItem>
              </MenuList>
            </Menu>
          </Flex>

          {/* Main Content */}
          <Box>
            <Text 
              textStyle="body" 
              color="gray.200" 
              lineHeight="1.6"
              fontSize="md"
            >
              {truncateContent(document.content, 200)}
            </Text>
          </Box>

          {/* Footer with metadata */}
          <VStack spacing={3} align="stretch">
            {/* Dates */}
            <HStack spacing={4} wrap="wrap">
              <HStack spacing={2}>
                <FiClock size={14} color="var(--chakra-colors-gray-400)" />
                <Text textStyle="caption" color="gray.400">
                  Created {createdDate}
                </Text>
              </HStack>
              
              {postedDate && (
                <HStack spacing={2}>
                  <FiCalendar size={14} color="var(--chakra-colors-green-400)" />
                  <Text textStyle="caption" color="green.400" fontWeight="medium">
                    Posted {postedDate}
                  </Text>
                </HStack>
              )}
            </HStack>

            {/* Comments and Notes indicators */}
            {(hasUserComments || hasNotes) && (
              <HStack spacing={4}>
                {hasUserComments && (
                  <HStack spacing={2}>
                    <FiMessageCircle size={14} color="var(--chakra-colors-blue-400)" />
                    <Text textStyle="caption" color="blue.400">
                      Has feedback
                    </Text>
                  </HStack>
                )}
                
                {hasNotes && (
                  <HStack spacing={2}>
                    <FiFileText size={14} color="var(--chakra-colors-yellow-400)" />
                    <Text textStyle="caption" color="yellow.400">
                      Has notes
                    </Text>
                  </HStack>
                )}
              </HStack>
            )}
          </VStack>
        </VStack>
      </CardBody>
    </Card>
  );
}

export function DocumentsTab({ 
  defaultStatus,
  title = "Content Library",
  description,
  showCreateButton = true,
  defaultLimit = 10
}: DocumentsTabProps = {}) {
  const router = useRouter();
  const toast = useToast();
  const { 
    documents,
    loading,
    error,
    refreshDocuments,
    updateDocumentStatus,
    deleteDocument
  } = useDocumentsContext();
  
  // Local state for filtering and pagination
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<DocumentStatus | 'all'>(defaultStatus || 'all');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = defaultLimit;
  
  // Filter documents based on component props and user selections
  const filteredDocuments = useMemo(() => {
    let filtered = documents;
    
    // Apply default status filter if no manual selection is made
    if (selectedStatus !== 'all') {
      filtered = filtered.filter(doc => doc.status === selectedStatus);
    }
    
    // Apply type filter
    if (selectedType !== 'all') {
      filtered = filtered.filter(doc => doc.type === selectedType);
    }
    
    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(doc => 
        doc.content?.toLowerCase().includes(query) ||
        doc.title?.toLowerCase().includes(query)
      );
    }
    
    return filtered.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  }, [documents, selectedStatus, selectedType, searchQuery]);
  
  // Paginate filtered documents
  const totalCount = filteredDocuments.length;
  const totalPages = Math.ceil(totalCount / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const displayDocuments = filteredDocuments.slice(startIndex, endIndex);
  
  // Handle search submission
  const handleSearch = () => {
    setCurrentPage(1); // Reset to first page when searching
  };
  
  // Handle status filter change
  const handleStatusFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const status = e.target.value === 'all' ? 'all' : e.target.value as DocumentStatus;
    setSelectedStatus(status);
    setCurrentPage(1);
  };
  
  // Handle type filter change
  const handleTypeFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const type = e.target.value;
    setSelectedType(type);
    setCurrentPage(1);
  };
  
  // Handle pagination
  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };
  
  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };
  
  // Handle document actions
  const handleEditDocument = (id: number) => {
    router.push(`/ghostwriter/documents/${id}`);
  };
  
  const handleDeleteDocument = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this document?')) {
      const success = await deleteDocument(id);
      if (success) {
        refreshDocuments();
        toast({
          title: 'Document deleted',
          status: 'success',
          duration: 3000,
        });
      }
    }
  };
  
  const handleChangeStatus = async (id: number, status: DocumentStatus) => {
    const result = await updateDocumentStatus(id, status);
    if (result) {
      refreshDocuments();
      toast({
        title: `Document marked as ${status}`,
        status: 'success',
        duration: 3000,
      });
    }
  };
  
  // Handle create new document
  const handleCreateDocument = async () => {
    router.push('/ghostwriter/documents/new');
  };
  
  // Calculate pagination info
  const startItem = startIndex + 1;
  const endItem = Math.min(endIndex, totalCount);

  // Get status-specific stats for description
  const statusCounts = useMemo(() => ({
    draft: documents.filter(d => d.status === 'draft').length,
    approved: documents.filter(d => d.status === 'approved').length,
    published: documents.filter(d => d.status === 'published').length,
    rejected: documents.filter(d => d.status === 'rejected').length,
  }), [documents]);

  const getDescriptionText = () => {
    if (description) return description;
    
    if (defaultStatus === 'draft') {
      return `${statusCounts.draft} drafts pending review`;
    } else if (defaultStatus === 'approved') {
      return `${statusCounts.approved} documents ready for publication`;
    } else if (defaultStatus === 'published') {
      return `${statusCounts.published} documents published`;
    } else if (defaultStatus === 'rejected') {
      return `${statusCounts.rejected} documents rejected`;
    }
    
    return `${documents.length} documents • ${statusCounts.published} published`;
  };

  return (
    <Box>
      {/* Header */}
      <VStack spacing={6} align="stretch">
        <Flex justify="space-between" align="center">
          <VStack align="start" spacing={1}>
            <Heading textStyle="section-heading" color="gray.100">
              {title}
            </Heading>
            <Text textStyle="body" color="gray.400">
              {getDescriptionText()}
            </Text>
          </VStack>
          
          {showCreateButton && (
            <Button 
              leftIcon={<FiPlus />} 
              colorScheme="teal" 
              onClick={handleCreateDocument}
              size="md"
            >
              New Content
            </Button>
          )}
        </Flex>
        
        {/* Filters */}
        <Card bg="gray.800" borderColor="gray.700">
          <CardBody p={4}>
            <Flex direction={{ base: 'column', md: 'row' }} gap={4}>
              {/* Search bar */}
              <Flex flex="1" maxW={{ base: 'full', md: '400px' }}>
                <Input 
                  placeholder="Search content..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                  bg="gray.700"
                  borderColor="gray.600"
                  _focus={{ borderColor: 'teal.400' }}
                />
                <IconButton
                  aria-label="Search"
                  icon={<FiSearch />}
                  onClick={handleSearch}
                  ml={2}
                  colorScheme="teal"
                  variant="outline"
                />
              </Flex>
              
              {/* Filter selects */}
              <HStack spacing={3}>
                <Select 
                  placeholder="All Statuses"
                  onChange={handleStatusFilterChange}
                  value={selectedStatus}
                  bg="gray.700"
                  borderColor="gray.600"
                  maxW={160}
                  size="md"
                >
                  <option value="all">All Statuses</option>
                  <option value="draft">Draft</option>
                  <option value="approved">Approved</option>
                  <option value="rejected">Rejected</option>
                  <option value="published">Published</option>
                  <option value="word-limit">Word Limit</option>
                </Select>
                
                <Select 
                  placeholder="All Types"
                  onChange={handleTypeFilterChange} 
                  value={selectedType}
                  bg="gray.700"
                  borderColor="gray.600"
                  maxW={180}
                  size="md"
                >
                  <option value="all">All Types</option>
                  <option value="test">Test</option>
                  <option value="aiwah-content-test">Aiwah Content</option>
                </Select>
              </HStack>
            </Flex>
          </CardBody>
        </Card>
        
        {/* Document Grid */}
        {loading ? (
          <Center p={12}>
            <VStack spacing={4}>
              <Spinner color="teal.400" size="lg" />
              <Text textStyle="body" color="gray.400">Loading content...</Text>
            </VStack>
          </Center>
        ) : error ? (
          <Center p={12}>
            <VStack spacing={4}>
              <Text color="red.400" textStyle="body">Error loading documents</Text>
              <Button onClick={refreshDocuments} variant="outline" size="sm">
                Retry
              </Button>
            </VStack>
          </Center>
        ) : displayDocuments.length === 0 ? (
          <Center p={12}>
            <VStack spacing={4}>
              <Text textStyle="body" color="gray.400">
                No content found matching your criteria
              </Text>
              {showCreateButton && (
                <Button onClick={handleCreateDocument} colorScheme="teal" size="sm">
                  Create your first document
                </Button>
              )}
            </VStack>
          </Center>
        ) : (
          <>
            <SimpleGrid columns={{ base: 1, lg: 2, xl: 3 }} spacing={4}>
              {displayDocuments.map((doc) => (
                <DocumentCard
                  key={doc.id}
                  document={doc}
                  onEdit={handleEditDocument}
                  onStatusChange={handleChangeStatus}
                  onDelete={handleDeleteDocument}
                />
              ))}
            </SimpleGrid>
            
            {/* Pagination */}
            {totalPages > 1 && (
              <Flex justify="space-between" align="center" pt={6}>
                <Text textStyle="caption" color="gray.400">
                  Showing {startItem} to {endItem} of {totalCount} documents
                </Text>
                <HStack spacing={2}>
                  <Button
                    leftIcon={<FiChevronLeft />}
                    onClick={handlePreviousPage}
                    isDisabled={currentPage === 1}
                    variant="outline"
                    size="sm"
                  >
                    Previous
                  </Button>
                  <Text textStyle="caption" color="gray.400">
                    Page {currentPage} of {totalPages}
                  </Text>
                  <Button
                    rightIcon={<FiChevronRight />}
                    onClick={handleNextPage}
                    isDisabled={currentPage === totalPages}
                    variant="outline"
                    size="sm"
                  >
                    Next
                  </Button>
                </HStack>
              </Flex>
            )}
          </>
        )}
      </VStack>
    </Box>
  );
} 