'use client';

import React from 'react';
import { 
  Box, 
  SimpleGrid, 
  Card, 
  CardBody, 
  Heading, 
  Text, 
  Icon, 
  VStack, 
  HStack, 
  Button, 
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  useColorModeValue,
  Skeleton,
  Center,
  Spinner
} from '@chakra-ui/react';
import { 
  FiFileText, 
  FiPlusCircle, 
  FiClock, 
  FiCheckCircle, 
  FiXCircle,
  FiEdit3,
  FiArchive
} from 'react-icons/fi';
import { AuthGuard } from '@/components/AuthGuard';
import { useDocumentsContext } from '@/hooks/documents';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function GhostwriterDashboard() {
  const { 
    documents, 
    loading, 
    error, 
    stats, 
    statsLoading 
  } = useDocumentsContext();
  const router = useRouter();
  const cardBg = useColorModeValue('white', 'gray.800');

  // Get recent documents (last 5)
  const recentDocuments = React.useMemo(() => {
    if (!documents) return [];
    return [...documents]
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
      .slice(0, 5);
  }, [documents]);

  const handleCreateDocument = () => {
    router.push('/ghostwriter/document/new');
  };

  if (loading || statsLoading) {
    return (
      <AuthGuard>
        <Box h="100%" overflow="auto" p={8}>
          <VStack spacing={8} align="stretch">
            <Skeleton height="60px" borderRadius="md" />
            <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={6}>
              {[...Array(4)].map((_, i) => (
                <Card key={i} bg={cardBg}>
                  <CardBody>
                    <Skeleton height="80px" borderRadius="md" />
                  </CardBody>
                </Card>
              ))}
            </SimpleGrid>
            <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={6}>
              <Skeleton height="300px" borderRadius="md" />
              <Skeleton height="300px" borderRadius="md" />
            </SimpleGrid>
          </VStack>
        </Box>
      </AuthGuard>
    );
  }

  if (error) {
    return (
      <AuthGuard>
        <Center h="100%" p={8}>
          <VStack spacing={4}>
            <Text color="red.400">Error loading ghostwriter</Text>
            <Text color="gray.400">{error.message}</Text>
            <Button onClick={() => window.location.reload()}>Retry</Button>
          </VStack>
        </Center>
      </AuthGuard>
    );
  }

  return (
    <AuthGuard>
      <Box h="100%" overflow="auto" p={8}>
        <VStack spacing={6} align="stretch">
          {/* Header Section */}
          <HStack justify="space-between" align="center" mb={2}>
            <VStack align="start" spacing={1}>
              <Heading textStyle="page-title">Document Management</Heading>
              <Text textStyle="body" color="gray.400">
                Create, edit, and manage your content workflow
              </Text>
            </VStack>
            <Button 
              leftIcon={<FiPlusCircle />} 
              colorScheme="teal" 
              size="lg"
              onClick={handleCreateDocument}
            >
              New Document
            </Button>
          </HStack>

          {/* Stats Overview - More compact */}
          <SimpleGrid columns={{ base: 2, lg: 4 }} spacing={4}>
            <Card bg={cardBg} _hover={{ transform: 'translateY(-2px)', transition: 'all 0.2s' }}>
              <CardBody p={4}>
                <HStack justify="space-between" align="center">
                  <VStack align="start" spacing={0}>
                    <Text textStyle="caption" color="gray.500">Total Documents</Text>
                    <Text textStyle="section-heading" color="gray.100">{stats.total}</Text>
                  </VStack>
                  <Icon as={FiFileText} color="blue.400" boxSize={6} />
                </HStack>
              </CardBody>
            </Card>

            <Card bg={cardBg} _hover={{ transform: 'translateY(-2px)', transition: 'all 0.2s' }}>
              <CardBody p={4}>
                <HStack justify="space-between" align="center">
                  <VStack align="start" spacing={0}>
                    <Text textStyle="caption" color="gray.500">Drafts</Text>
                    <Text textStyle="section-heading" color="gray.100">{stats.byStatus.draft}</Text>
                  </VStack>
                  <Icon as={FiClock} color="yellow.400" boxSize={6} />
                </HStack>
              </CardBody>
            </Card>

            <Card bg={cardBg} _hover={{ transform: 'translateY(-2px)', transition: 'all 0.2s' }}>
              <CardBody p={4}>
                <HStack justify="space-between" align="center">
                  <VStack align="start" spacing={0}>
                    <Text textStyle="caption" color="gray.500">Approved</Text>
                    <Text textStyle="section-heading" color="gray.100">{stats.byStatus.approved}</Text>
                  </VStack>
                  <Icon as={FiCheckCircle} color="green.400" boxSize={6} />
                </HStack>
              </CardBody>
            </Card>

            <Card bg={cardBg} _hover={{ transform: 'translateY(-2px)', transition: 'all 0.2s' }}>
              <CardBody p={4}>
                <HStack justify="space-between" align="center">
                  <VStack align="start" spacing={0}>
                    <Text textStyle="caption" color="gray.500">Published</Text>
                    <Text textStyle="section-heading" color="gray.100">{stats.byStatus.published}</Text>
                  </VStack>
                  <Icon as={FiArchive} color="teal.400" boxSize={6} />
                </HStack>
              </CardBody>
            </Card>
          </SimpleGrid>

          {/* Main Content - 3 Column Layout */}
          <SimpleGrid columns={{ base: 1, lg: 3 }} spacing={6}>
            {/* Quick Actions - Smaller column */}
            <Card bg={cardBg}>
              <CardBody p={5}>
                <VStack align="stretch" spacing={4}>
                  <Text textStyle="section-heading">Quick Actions</Text>
                  
                  <VStack spacing={2}>
                    <Button
                      leftIcon={<FiPlusCircle />}
                      colorScheme="teal"
                      width="full"
                      size="sm"
                      onClick={handleCreateDocument}
                    >
                      Create Document
                    </Button>
                    
                    <Link href="/ghostwriter/drafts" style={{ width: '100%' }}>
                      <Button
                        leftIcon={<FiEdit3 />}
                        variant="outline"
                        size="sm"
                        width="full"
                      >
                        Drafts ({stats.byStatus.draft})
                      </Button>
                    </Link>
                    
                    <Link href="/ghostwriter/approved" style={{ width: '100%' }}>
                      <Button
                        leftIcon={<FiCheckCircle />}
                        variant="outline"
                        size="sm"
                        width="full"
                      >
                        Approved ({stats.byStatus.approved})
                      </Button>
                    </Link>

                    <Link href="/ghostwriter/all" style={{ width: '100%' }}>
                      <Button
                        leftIcon={<FiFileText />}
                        variant="outline"
                        size="sm"
                        width="full"
                      >
                        All Documents
                      </Button>
                    </Link>
                  </VStack>
                </VStack>
              </CardBody>
            </Card>

            {/* Recent Documents - Takes 2 columns */}
            <Box gridColumn={{ lg: "span 2" }}>
              <Card bg={cardBg} h="full">
                <CardBody p={5}>
                  <VStack align="stretch" spacing={4} h="full">
                    <HStack justify="space-between">
                      <Text textStyle="section-heading">Recent Documents</Text>
                      <Link href="/ghostwriter/all">
                        <Button variant="ghost" size="sm" color="teal.400">
                          View All
                        </Button>
                      </Link>
                    </HStack>
                    
                    {recentDocuments.length === 0 ? (
                      <Center flex={1} py={8}>
                        <VStack spacing={3}>
                          <Icon as={FiFileText} color="gray.500" boxSize={12} />
                          <Text textStyle="card-title">No documents yet</Text>
                          <Text textStyle="body" color="gray.400" textAlign="center">
                            Start creating your first document to see it here
                          </Text>
                          <Button 
                            size="sm" 
                            colorScheme="teal" 
                            onClick={handleCreateDocument}
                          >
                            Create your first document
                          </Button>
                        </VStack>
                      </Center>
                    ) : (
                      <VStack spacing={2} align="stretch">
                        {recentDocuments.map((doc) => (
                          <Link key={doc.id} href={`/ghostwriter/document/${doc.id}`}>
                            <Card 
                              size="sm" 
                              variant="outline" 
                              _hover={{ borderColor: 'teal.400', transform: 'translateY(-1px)' }}
                              transition="all 0.2s"
                              cursor="pointer"
                            >
                              <CardBody p={3}>
                                <HStack justify="space-between" align="start">
                                  <VStack align="start" spacing={1} flex={1}>
                                    <Text 
                                      textStyle="card-title"
                                      color="gray.100" 
                                      noOfLines={1}
                                    >
                                      {doc.title || 'Untitled Document'}
                                    </Text>
                                    <Text 
                                      textStyle="body"
                                      color="gray.400" 
                                      noOfLines={2}
                                    >
                                      {doc.content.substring(0, 100)}...
                                    </Text>
                                    <Text textStyle="caption" color="gray.500">
                                      {new Date(doc.created_at).toLocaleDateString()}
                                    </Text>
                                  </VStack>
                                  <Icon 
                                    as={
                                      doc.status === 'approved' ? FiCheckCircle :
                                      doc.status === 'rejected' ? FiXCircle :
                                      doc.status === 'published' ? FiArchive :
                                      FiClock
                                    }
                                    color={
                                      doc.status === 'approved' ? 'green.400' :
                                      doc.status === 'rejected' ? 'red.400' :
                                      doc.status === 'published' ? 'teal.400' :
                                      'yellow.400'
                                    }
                                    boxSize={4}
                                  />
                                </HStack>
                              </CardBody>
                            </Card>
                          </Link>
                        ))}
                      </VStack>
                    )}
                  </VStack>
                </CardBody>
              </Card>
            </Box>
          </SimpleGrid>
        </VStack>
      </Box>
    </AuthGuard>
  );
} 