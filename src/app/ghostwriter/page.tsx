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
        <VStack spacing={8} align="stretch">
          {/* Header */}
          <HStack justify="space-between" align="center">
            <VStack align="start" spacing={1}>
              <Heading size="lg" color="gray.100">Document Management</Heading>
              <Text color="gray.400">Create, manage, and track your content</Text>
            </VStack>
            <Button 
              leftIcon={<FiPlusCircle />} 
              colorScheme="teal" 
              onClick={handleCreateDocument}
              size="lg"
            >
              New Document
            </Button>
          </HStack>

          {/* Stats Overview */}
          <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={6}>
            <Card bg={cardBg} _hover={{ transform: 'translateY(-2px)', transition: 'all 0.2s' }}>
              <CardBody>
                <Stat>
                  <HStack justify="space-between" align="start">
                    <VStack align="start" spacing={1}>
                      <StatLabel color="gray.500" fontSize="sm">Total Documents</StatLabel>
                      <StatNumber color="gray.100">{stats.total}</StatNumber>
                      <StatHelpText color="gray.400" mb={0}>All time</StatHelpText>
                    </VStack>
                    <Icon as={FiFileText} color="blue.400" boxSize={8} />
                  </HStack>
                </Stat>
              </CardBody>
            </Card>

            <Card bg={cardBg} _hover={{ transform: 'translateY(-2px)', transition: 'all 0.2s' }}>
              <CardBody>
                <Stat>
                  <HStack justify="space-between" align="start">
                    <VStack align="start" spacing={1}>
                      <StatLabel color="gray.500" fontSize="sm">Drafts</StatLabel>
                      <StatNumber color="gray.100">{stats.byStatus.draft}</StatNumber>
                      <StatHelpText color="gray.400" mb={0}>Pending review</StatHelpText>
                    </VStack>
                    <Icon as={FiClock} color="yellow.400" boxSize={8} />
                  </HStack>
                </Stat>
              </CardBody>
            </Card>

            <Card bg={cardBg} _hover={{ transform: 'translateY(-2px)', transition: 'all 0.2s' }}>
              <CardBody>
                <Stat>
                  <HStack justify="space-between" align="start">
                    <VStack align="start" spacing={1}>
                      <StatLabel color="gray.500" fontSize="sm">Approved</StatLabel>
                      <StatNumber color="gray.100">{stats.byStatus.approved}</StatNumber>
                      <StatHelpText color="gray.400" mb={0}>Ready to publish</StatHelpText>
                    </VStack>
                    <Icon as={FiCheckCircle} color="green.400" boxSize={8} />
                  </HStack>
                </Stat>
              </CardBody>
            </Card>

            <Card bg={cardBg} _hover={{ transform: 'translateY(-2px)', transition: 'all 0.2s' }}>
              <CardBody>
                <Stat>
                  <HStack justify="space-between" align="start">
                    <VStack align="start" spacing={1}>
                      <StatLabel color="gray.500" fontSize="sm">Published</StatLabel>
                      <StatNumber color="gray.100">{stats.byStatus.published}</StatNumber>
                      <StatHelpText color="gray.400" mb={0}>Live content</StatHelpText>
                    </VStack>
                    <Icon as={FiArchive} color="teal.400" boxSize={8} />
                  </HStack>
                </Stat>
              </CardBody>
            </Card>
          </SimpleGrid>

          {/* Main Content Areas */}
          <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={8}>
            {/* Quick Actions */}
            <Card bg={cardBg}>
              <CardBody>
                <VStack align="stretch" spacing={4}>
                  <Heading size="md" color="gray.100">Quick Actions</Heading>
                  
                  <VStack spacing={3}>
                    <Button
                      leftIcon={<FiPlusCircle />}
                      colorScheme="teal"
                      size="lg"
                      width="full"
                      onClick={handleCreateDocument}
                    >
                      Create New Document
                    </Button>
                    
                    <SimpleGrid columns={2} spacing={3} width="full">
                      <Link href="/ghostwriter/drafts">
                        <Button
                          leftIcon={<FiEdit3 />}
                          variant="outline"
                          size="md"
                          width="full"
                        >
                          View Drafts ({stats.byStatus.draft})
                        </Button>
                      </Link>
                      
                      <Link href="/ghostwriter/approved">
                        <Button
                          leftIcon={<FiCheckCircle />}
                          variant="outline"
                          size="md"
                          width="full"
                        >
                          Approved ({stats.byStatus.approved})
                        </Button>
                      </Link>
                    </SimpleGrid>
                  </VStack>
                </VStack>
              </CardBody>
            </Card>

            {/* Recent Documents */}
            <Card bg={cardBg}>
              <CardBody>
                <VStack align="stretch" spacing={4}>
                  <HStack justify="space-between">
                    <Heading size="md" color="gray.100">Recent Documents</Heading>
                    <Link href="/ghostwriter/all">
                      <Button variant="ghost" size="sm" color="teal.400">
                        View All
                      </Button>
                    </Link>
                  </HStack>
                  
                  {recentDocuments.length === 0 ? (
                    <Center py={8}>
                      <VStack spacing={2}>
                        <Icon as={FiFileText} color="gray.500" boxSize={12} />
                        <Text color="gray.500">No documents yet</Text>
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
                    <VStack spacing={3} align="stretch">
                      {recentDocuments.map((doc) => (
                        <Link key={doc.id} href={`/ghostwriter/document/${doc.id}`}>
                          <Card 
                            size="sm" 
                            variant="outline" 
                            _hover={{ borderColor: 'teal.400', transform: 'translateY(-1px)' }}
                            transition="all 0.2s"
                            cursor="pointer"
                          >
                            <CardBody py={3}>
                              <HStack justify="space-between" align="start">
                                <VStack align="start" spacing={1} flex={1}>
                                  <Text 
                                    fontWeight="medium" 
                                    color="gray.100" 
                                    noOfLines={1}
                                  >
                                    {doc.title || 'Untitled Document'}
                                  </Text>
                                  <Text 
                                    fontSize="sm" 
                                    color="gray.400" 
                                    noOfLines={2}
                                  >
                                    {doc.content.substring(0, 100)}...
                                  </Text>
                                  <Text fontSize="xs" color="gray.500">
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
                                  boxSize={5}
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
          </SimpleGrid>
        </VStack>
      </Box>
    </AuthGuard>
  );
} 