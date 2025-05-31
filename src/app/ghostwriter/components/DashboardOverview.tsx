'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { 
  Box, 
  SimpleGrid, 
  Card, 
  CardHeader, 
  CardBody, 
  Heading, 
  Text, 
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  StatArrow,
  Icon,
  VStack,
  HStack,
  useColorModeValue,
  Badge,
  Progress,
  Button,
} from '@chakra-ui/react';
import { FiFileText, FiCheckCircle, FiXCircle, FiClock, FiTrendingUp, FiPlusCircle } from 'react-icons/fi';
import { useDocumentsContext } from '@/hooks/documents';
import { Document, DocumentStatus } from '@/hooks/documents/types';
import Link from 'next/link';
import { PageLoading } from '@/components/ui';

export const DashboardOverview = () => {
  const { statsLoading, documents } = useDocumentsContext();
  const cardBg = useColorModeValue('white', 'gray.800');
  
  // Calculate stats
  const stats = useMemo(() => {
    if (!statsLoading && documents) {
      const total = documents.length;
      const approved = documents.filter(doc => doc.status === 'approved').length;
      const drafts = documents.filter(doc => doc.status === 'draft').length;
      const rejected = documents.filter(doc => doc.status === 'rejected').length;
      const published = documents.filter(doc => doc.status === 'published').length;
      
      // Get recent documents (last 7 days)
      const lastWeek = new Date();
      lastWeek.setDate(lastWeek.getDate() - 7);
      const recentDocs = documents.filter(doc => 
        new Date(doc.created_at) > lastWeek
      );
      
      // Calculate approval rate
      const totalReviewed = approved + rejected;
      const approvalRate = totalReviewed > 0 ? (approved / totalReviewed) * 100 : 0;
      
      return {
        total,
        approved,
        drafts,
        rejected,
        published,
        recent: recentDocs.length,
        approvalRate: approvalRate.toFixed(1),
        productivity: total > 0 ? ((approved + published) / total * 100).toFixed(1) : '0',
      };
    }
    return {
      total: 0,
      approved: 0,
      drafts: 0,
      rejected: 0,
      published: 0,
      recent: 0,
      approvalRate: '0',
      productivity: '0',
    };
  }, [statsLoading, documents]);

  const [recentDocuments, setRecentDocuments] = useState<Document[]>([]);

  useEffect(() => {
    if (!statsLoading && documents) {
      // Get 5 most recent documents
      const sorted = [...documents]
        .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
        .slice(0, 5);
      setRecentDocuments(sorted);
    }
  }, [statsLoading, documents]);

  if (statsLoading) {
    return (
      <PageLoading 
        message="Loading dashboard data..."
        size="md"
        minHeight="60vh"
      />
    );
  }

  const getStatusColor = (status: DocumentStatus | null) => {
    if (!status) return 'gray';
    switch (status) {
      case 'approved': return 'green';
      case 'rejected': return 'red';
      case 'published': return 'blue';
      case 'word-limit': return 'orange';
      default: return 'yellow';
    }
  };

  const getStatusIcon = (status: DocumentStatus | null) => {
    if (!status) return FiClock;
    switch (status) {
      case 'approved': return FiCheckCircle;
      case 'rejected': return FiXCircle;
      case 'published': return FiFileText;
      default: return FiClock;
    }
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <Box>
      {/* Stats Grid */}
      <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={6} mb={8}>
        {/* Total Documents */}
        <Card bg={cardBg}>
          <CardBody>
            <Stat>
              <HStack justify="space-between" align="start">
                <VStack align="start" spacing={1}>
                  <StatLabel color="gray.500" fontSize="sm">Total Documents</StatLabel>
                  <StatNumber color="white">{stats.total}</StatNumber>
                  <StatHelpText color="gray.400" mb={0}>
                    <StatArrow type="increase" />
                    All time
                  </StatHelpText>
                </VStack>
                <Icon as={FiFileText} color="blue.400" boxSize={8} />
              </HStack>
            </Stat>
          </CardBody>
        </Card>

        {/* Approved */}
        <Card bg={cardBg}>
          <CardBody>
            <Stat>
              <HStack justify="space-between" align="start">
                <VStack align="start" spacing={1}>
                  <StatLabel color="gray.500" fontSize="sm">Approved</StatLabel>
                  <StatNumber color="white">{stats.approved}</StatNumber>
                  <StatHelpText color="gray.400" mb={0}>
                    {stats.approvalRate}% approval rate
                  </StatHelpText>
                </VStack>
                <Icon as={FiCheckCircle} color="green.400" boxSize={8} />
              </HStack>
            </Stat>
          </CardBody>
        </Card>

        {/* Drafts */}
        <Card bg={cardBg}>
          <CardBody>
            <Stat>
              <HStack justify="space-between" align="start">
                <VStack align="start" spacing={1}>
                  <StatLabel color="gray.500" fontSize="sm">Drafts</StatLabel>
                  <StatNumber color="white">{stats.drafts}</StatNumber>
                  <StatHelpText color="gray.400" mb={0}>
                    Pending review
                  </StatHelpText>
                </VStack>
                <Icon as={FiClock} color="yellow.400" boxSize={8} />
              </HStack>
            </Stat>
          </CardBody>
        </Card>

        {/* Productivity */}
        <Card bg={cardBg}>
          <CardBody>
            <Stat>
              <HStack justify="space-between" align="start">
                <VStack align="start" spacing={1}>
                  <StatLabel color="gray.500" fontSize="sm">Productivity</StatLabel>
                  <StatNumber color="white">{stats.productivity}%</StatNumber>
                  <StatHelpText color="gray.400" mb={0}>
                    <StatArrow type="increase" />
                    Success rate
                  </StatHelpText>
                </VStack>
                <Icon as={FiTrendingUp} color="teal.400" boxSize={8} />
              </HStack>
            </Stat>
          </CardBody>
        </Card>
      </SimpleGrid>

      {/* Recent Activity */}
      <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={6}>
        {/* Recent Documents */}
        <Card bg={cardBg}>
          <CardHeader>
            <HStack justify="space-between">
              <Heading size="md" color="white">Recent Documents</Heading>
              <Button size="sm" colorScheme="teal" as={Link} href="/ghostwriter/document/new">
                <Icon as={FiPlusCircle} mr={2} />
                New Document
              </Button>
            </HStack>
          </CardHeader>
          <CardBody pt={0}>
            <VStack spacing={3} align="stretch">
              {recentDocuments.length > 0 ? (
                recentDocuments.map((doc) => (
                  <HStack key={doc.id} justify="space-between" p={3} bg="gray.700" borderRadius="md">
                    <VStack align="start" spacing={1} flex={1}>
                      <Text color="white" fontWeight="medium" noOfLines={1}>
                        {doc.title || `Document #${doc.id}`}
                      </Text>
                      <Text color="gray.400" fontSize="xs">
                        {formatDate(doc.created_at)}
                      </Text>
                    </VStack>
                    <HStack spacing={2}>
                      <Badge 
                        colorScheme={getStatusColor(doc.status)} 
                        textTransform="capitalize"
                        variant="subtle"
                      >
                        {doc.status}
                      </Badge>
                      <Icon as={getStatusIcon(doc.status)} color="gray.400" />
                    </HStack>
                  </HStack>
                ))
              ) : (
                <Text color="gray.400" textAlign="center" py={4}>
                  No documents yet. Create your first document to get started.
                </Text>
              )}
            </VStack>
          </CardBody>
        </Card>

        {/* Quick Stats */}
        <Card bg={cardBg}>
          <CardHeader>
            <Heading size="md" color="white">Performance Overview</Heading>
          </CardHeader>
          <CardBody pt={0}>
            <VStack spacing={4} align="stretch">
              {/* Approval Rate */}
              <Box>
                <HStack justify="space-between" mb={2}>
                  <Text color="gray.300" fontSize="sm">Approval Rate</Text>
                  <Text color="white" fontSize="sm">{stats.approvalRate}%</Text>
                </HStack>
                <Progress 
                  value={parseFloat(stats.approvalRate)} 
                  colorScheme="green" 
                  bg="gray.700" 
                  borderRadius="full"
                  size="sm"
                />
              </Box>

              {/* Content Progress */}
              <Box>
                <HStack justify="space-between" mb={2}>
                  <Text color="gray.300" fontSize="sm">Content Progress</Text>
                  <Text color="white" fontSize="sm">{stats.productivity}%</Text>
                </HStack>
                <Progress 
                  value={parseFloat(stats.productivity)} 
                  colorScheme="teal" 
                  bg="gray.700" 
                  borderRadius="full"
                  size="sm"
                />
              </Box>

              {/* Quick Actions */}
              <VStack spacing={2} pt={4}>
                <Button as={Link} href="/ghostwriter/document/new" colorScheme="teal" size="sm" w="full">
                  Create New Document
                </Button>
                <Button as={Link} href="/ghostwriter?tab=1" variant="outline" size="sm" w="full">
                  Review Drafts ({stats.drafts})
                </Button>
              </VStack>
            </VStack>
          </CardBody>
        </Card>
      </SimpleGrid>
    </Box>
  );
}; 