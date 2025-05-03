'use client';

import { Box, Card, CardBody, CardHeader, Heading, Text, Flex, Icon, VStack, Badge, Spinner, Center, Button } from '@chakra-ui/react';
import { FiCheck, FiMessageSquare, FiExternalLink } from 'react-icons/fi';
import { useDocumentsContext } from '@/hooks/documents';
import { Document } from '@/hooks/documents/types';
import { useEffect, useState, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';

export function ApprovedPostsTab() {
  const router = useRouter();
  const { statsLoading, documents } = useDocumentsContext();
  const [approvedPosts, setApprovedPosts] = useState<Document[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [allApprovedPosts, setAllApprovedPosts] = useState<Document[]>([]);
  const ITEMS_PER_PAGE = 5;
  const observer = useRef<IntersectionObserver | null>(null);
  
  // Set up all approved posts when documents are loaded
  useEffect(() => {
    if (!statsLoading && documents) {
      // Get all approved documents sorted by creation date (newest first)
      const approved = documents
        .filter(doc => doc.status === 'approved')
        .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
      
      setAllApprovedPosts(approved);
      loadInitialPosts(approved);
    }
  }, [statsLoading, documents]);
  
  // Load initial batch of approved posts
  const loadInitialPosts = (posts: Document[]) => {
    const initialPosts = posts.slice(0, ITEMS_PER_PAGE);
    setApprovedPosts(initialPosts);
    setHasMore(posts.length > ITEMS_PER_PAGE);
    setPage(1);
  };
  
  // Load more approved posts when scrolling
  const loadMorePosts = useCallback(() => {
    if (loading || !hasMore) return;
    
    setLoading(true);
    const nextPage = page + 1;
    const startIndex = (nextPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    
    // Simulate network delay for smoother UX
    setTimeout(() => {
      const newPosts = allApprovedPosts.slice(0, endIndex);
      setApprovedPosts(newPosts);
      setPage(nextPage);
      setHasMore(endIndex < allApprovedPosts.length);
      setLoading(false);
    }, 500);
  }, [loading, hasMore, page, allApprovedPosts]);
  
  // Setup the intersection observer for infinite scrolling
  const lastPostElementRef = useCallback((node: HTMLDivElement) => {
    if (loading) return;
    
    if (observer.current) observer.current.disconnect();
    
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore) {
        loadMorePosts();
      }
    }, { threshold: 0.5 });
    
    if (node) observer.current.observe(node);
  }, [loading, hasMore, loadMorePosts]);
  
  // Helper function to format date
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Navigate to document details
  const navigateToDocument = (id: number) => {
    router.push(`/dashboard/document/${id}`);
  };

  return (
    <Box>
      <Text color="gray.400" mb={6}>View your approved content</Text>
      
      {statsLoading ? (
        <Box textAlign="center" p={10} color="gray.400">
          <Text>Loading approved posts...</Text>
        </Box>
      ) : (
        <Card bg="gray.800" borderColor="gray.700">
          <CardHeader>
            <Flex align="center">
              <Icon as={FiCheck} boxSize={5} color="green.400" mr={2} />
              <Heading size="md" color="white">Approved Posts</Heading>
            </Flex>
          </CardHeader>
          <CardBody>
            {approvedPosts.length > 0 ? (
              <VStack spacing={6} align="stretch">
                {approvedPosts.map((post, index) => {
                  const isLastElement = index === approvedPosts.length - 1;
                  return (
                    <Card 
                      key={post.id} 
                      bg="gray.700" 
                      borderColor="gray.600" 
                      variant="outline"
                      ref={isLastElement ? lastPostElementRef : null}
                      onClick={() => navigateToDocument(post.id)}
                      cursor="pointer"
                      _hover={{ borderColor: "blue.400", transform: "translateY(-2px)" }}
                      transition="all 0.2s"
                    >
                      <CardBody>
                        <Flex justify="space-between" mb={3}>
                          <Badge colorScheme="green">Approved</Badge>
                          <Text color="gray.400" fontSize="sm">{formatDate(post.created_at)}</Text>
                        </Flex>
                        
                        <Heading size="sm" color="white" mb={2}>
                          {post.title || 'Untitled Document'}
                        </Heading>
                        
                        <Text 
                          color="gray.300" 
                          mb={4} 
                          fontSize="md" 
                          noOfLines={4}
                          whiteSpace="pre-line"
                          sx={{
                            overflowWrap: 'break-word',
                            lineHeight: '1.6'
                          }}
                        >
                          {post.content}
                        </Text>
                        
                        {post.user_comments && (
                          <Box mb={4} bg="gray.800" p={3} borderRadius="md">
                            <Flex align="center" mb={2}>
                              <Icon as={FiMessageSquare} color="blue.400" mr={2} />
                              <Text color="blue.300" fontWeight="medium">Comments</Text>
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
                              {post.user_comments}
                            </Text>
                          </Box>
                        )}
                        
                        <Flex justify="flex-end">
                          <Button 
                            rightIcon={<FiExternalLink />} 
                            size="sm" 
                            variant="ghost" 
                            colorScheme="blue"
                            onClick={(e) => {
                              e.stopPropagation();
                              navigateToDocument(post.id);
                            }}
                          >
                            View Details
                          </Button>
                        </Flex>
                      </CardBody>
                    </Card>
                  );
                })}
                {loading && (
                  <Center p={4}>
                    <Spinner color="blue.400" size="md" />
                  </Center>
                )}
              </VStack>
            ) : (
              <Text color="gray.400" textAlign="center">No approved posts available</Text>
            )}
          </CardBody>
        </Card>
      )}
    </Box>
  );
} 