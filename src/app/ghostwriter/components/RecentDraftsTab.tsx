'use client';

import { Box, Card, CardBody, CardHeader, Heading, Text, Flex, Icon, VStack, Badge, ButtonGroup, Button, useToast, Spinner, Center } from '@chakra-ui/react';
import { FiClock, FiCheck, FiX, FiTrash2, FiMessageSquare, FiEdit } from 'react-icons/fi';
import { useDocumentsContext } from '@/hooks/documents';
import { Document } from '@/hooks/documents/types';
import { useEffect, useState, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';

export function RecentDraftsTab() {
  const router = useRouter();
  const { statsLoading, documents, updateDocumentStatus, deleteDocument, refreshDocuments } = useDocumentsContext();
  const [recentDrafts, setRecentDrafts] = useState<Document[]>([]);
  const [loadingActions, setLoadingActions] = useState<{[key: number]: string}>({});
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [allDrafts, setAllDrafts] = useState<Document[]>([]);
  const ITEMS_PER_PAGE = 5;
  const observer = useRef<IntersectionObserver | null>(null);
  const toast = useToast();
  
  // Set up all drafts when documents are loaded
  useEffect(() => {
    if (!statsLoading && documents) {
      // Get all draft documents sorted by creation date (newest first)
      const drafts = documents
        .filter(doc => doc.status === 'draft')
        .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
      
      setAllDrafts(drafts);
      loadInitialDrafts(drafts);
    }
  }, [statsLoading, documents]);
  
  // Load initial batch of drafts
  const loadInitialDrafts = (drafts: Document[]) => {
    const initialDrafts = drafts.slice(0, ITEMS_PER_PAGE);
    setRecentDrafts(initialDrafts);
    setHasMore(drafts.length > ITEMS_PER_PAGE);
    setPage(1);
  };
  
  // Load more drafts when scrolling
  const loadMoreDrafts = useCallback(() => {
    if (loading || !hasMore) return;
    
    setLoading(true);
    const nextPage = page + 1;
    const startIndex = (nextPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    
    // Simulate network delay for smoother UX
    setTimeout(() => {
      const newDrafts = allDrafts.slice(0, endIndex);
      setRecentDrafts(newDrafts);
      setPage(nextPage);
      setHasMore(endIndex < allDrafts.length);
      setLoading(false);
    }, 500);
  }, [loading, hasMore, page, allDrafts]);
  
  // Setup the intersection observer for infinite scrolling
  const lastDraftElementRef = useCallback((node: HTMLDivElement) => {
    if (loading) return;
    
    if (observer.current) observer.current.disconnect();
    
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore) {
        loadMoreDrafts();
      }
    }, { threshold: 0.5 });
    
    if (node) observer.current.observe(node);
  }, [loading, hasMore, loadMoreDrafts]);
  
  // Handle document approval
  const handleApprove = async (id: number) => {
    setLoadingActions(prev => ({ ...prev, [id]: 'approve' }));
    try {
      const success = await updateDocumentStatus(id, 'approved');
      if (success) {
        toast({
          title: "Document approved",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
        refreshDocuments();
      }
    } catch (error) {
      console.error("Error approving document:", error);
      toast({
        title: "Failed to approve document",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setLoadingActions(prev => {
        const newState = { ...prev };
        delete newState[id];
        return newState;
      });
    }
  };
  
  // Handle document rejection
  const handleReject = async (id: number) => {
    setLoadingActions(prev => ({ ...prev, [id]: 'reject' }));
    try {
      const success = await updateDocumentStatus(id, 'rejected');
      if (success) {
        toast({
          title: "Document rejected",
          status: "info",
          duration: 3000,
          isClosable: true,
        });
        refreshDocuments();
      }
    } catch (error) {
      console.error("Error rejecting document:", error);
      toast({
        title: "Failed to reject document",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setLoadingActions(prev => {
        const newState = { ...prev };
        delete newState[id];
        return newState;
      });
    }
  };
  
  // Handle document deletion
  const handleDelete = async (id: number) => {
    if (!window.confirm("Are you sure you want to delete this document? This action cannot be undone.")) {
      return;
    }
    
    setLoadingActions(prev => ({ ...prev, [id]: 'delete' }));
    try {
      const success = await deleteDocument(id);
      if (success) {
        toast({
          title: "Document deleted",
          status: "info",
          duration: 3000,
          isClosable: true,
        });
        refreshDocuments();
      }
    } catch (error) {
      console.error("Error deleting document:", error);
      toast({
        title: "Failed to delete document",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setLoadingActions(prev => {
        const newState = { ...prev };
        delete newState[id];
        return newState;
      });
    }
  };

  // Handle navigation to document detail page
  const handleViewDocument = (id: number) => {
    router.push(`/ghostwriter/document/${id}`);
  };

  return (
    <Box>
      <Text color="gray.400" mb={6}>Review and manage draft documents</Text>
      
      {statsLoading ? (
        <Box textAlign="center" p={10} color="gray.400">
          <Text>Loading drafts...</Text>
        </Box>
      ) : (
        <Card bg="gray.800" borderColor="gray.700">
          <CardHeader>
            <Flex align="center">
              <Icon as={FiClock} boxSize={5} color="yellow.400" mr={2} />
              <Heading size="md" color="white">Recent Drafts</Heading>
            </Flex>
          </CardHeader>
          <CardBody>
            {recentDrafts.length > 0 ? (
              <VStack spacing={6} align="stretch">
                {recentDrafts.map((draft, index) => {
                  const isLastElement = index === recentDrafts.length - 1;
                  return (
                    <Card 
                      key={draft.id} 
                      bg="gray.700" 
                      borderColor="gray.600" 
                      variant="outline"
                      ref={isLastElement ? lastDraftElementRef : null}
                      cursor="pointer"
                      _hover={{ borderColor: "teal.400", transform: "translateY(-2px)" }}
                      transition="all 0.2s"
                      onClick={() => handleViewDocument(draft.id)}
                    >
                      <CardBody>
                        <Flex justify="space-between" mb={2}>
                          <Badge colorScheme="yellow">Draft</Badge>
                          <Text color="gray.400" fontSize="sm">{new Date(draft.created_at).toLocaleDateString()}</Text>
                        </Flex>
                        
                        <Text 
                          color="gray.100" 
                          mb={4} 
                          fontSize="lg"
                          fontWeight="medium"
                          noOfLines={6}
                          whiteSpace="pre-line"
                          sx={{
                            overflowWrap: 'break-word',
                            lineHeight: '1.6',
                            fontSize: '1.1rem'
                          }}
                        >
                          {draft.content}
                        </Text>
                        
                        {draft.user_comments && (
                          <Box mb={4} bg="gray.800" p={3} borderRadius="md" onClick={(e) => e.stopPropagation()}>
                            <Flex align="center" mb={2}>
                              <Icon as={FiMessageSquare} color="teal.400" mr={2} />
                              <Text color="teal.300" fontWeight="medium">Comments</Text>
                            </Flex>
                            <Text 
                              color="gray.300" 
                              fontSize="sm"
                              noOfLines={3}
                              whiteSpace="pre-line"
                              sx={{
                                overflowWrap: 'break-word',
                                lineHeight: '1.5'
                              }}
                            >
                              {draft.user_comments}
                            </Text>
                          </Box>
                        )}
                        
                        {draft.notes && (
                          <Box mb={4} bg="gray.800" p={3} borderRadius="md" onClick={(e) => e.stopPropagation()}>
                            <Flex align="center" mb={2}>
                              <Icon as={FiMessageSquare} color="purple.400" mr={2} />
                              <Text color="purple.300" fontWeight="medium">Notes</Text>
                            </Flex>
                            <Text 
                              color="gray.300" 
                              fontSize="sm"
                              noOfLines={3}
                              whiteSpace="pre-line"
                              sx={{
                                overflowWrap: 'break-word',
                                lineHeight: '1.5'
                              }}
                            >
                              {draft.notes}
                            </Text>
                          </Box>
                        )}
                        
                        <ButtonGroup spacing={3} width="100%" justifyContent="flex-end" onClick={(e) => e.stopPropagation()}>
                          <Button
                            leftIcon={<FiEdit />}
                            colorScheme="teal"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleViewDocument(draft.id);
                            }}
                          >
                            View/Edit
                          </Button>
                          <Button
                            leftIcon={<FiCheck />}
                            colorScheme="green"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleApprove(draft.id);
                            }}
                            isLoading={loadingActions[draft.id] === 'approve'}
                          >
                            Approve
                          </Button>
                          <Button
                            leftIcon={<FiX />}
                            colorScheme="red"
                            size="sm"
                            variant="outline"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleReject(draft.id);
                            }}
                            isLoading={loadingActions[draft.id] === 'reject'}
                          >
                            Reject
                          </Button>
                          <Button
                            leftIcon={<FiTrash2 />}
                            colorScheme="gray"
                            size="sm"
                            variant="ghost"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDelete(draft.id);
                            }}
                            isLoading={loadingActions[draft.id] === 'delete'}
                          >
                            Delete
                          </Button>
                        </ButtonGroup>
                      </CardBody>
                    </Card>
                  );
                })}
                {loading && (
                  <Center p={4}>
                    <Spinner color="teal.400" size="md" />
                  </Center>
                )}
              </VStack>
            ) : (
              <Text color="gray.400" textAlign="center">No recent drafts available</Text>
            )}
          </CardBody>
        </Card>
      )}
    </Box>
  );
} 