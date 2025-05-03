'use client';

import { Box, Card, CardBody, CardHeader, SimpleGrid, Heading, Text, Flex, Icon, Button } from '@chakra-ui/react';
import { useAuth } from '@saas-ui/auth';
import { FiFileText, FiCalendar, FiAlertCircle, FiCheck } from 'react-icons/fi';
import { useDocumentsContext } from '@/hooks/documents';
import { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { useRouter } from 'next/navigation';

interface DailyCount {
  date: string;
  count: number;
}

export function DashboardOverview() {
  const { user } = useAuth();
  const { statsLoading, documents } = useDocumentsContext();
  const router = useRouter();
  
  const [createdLastWeek, setCreatedLastWeek] = useState<DailyCount[]>([]);
  const [publishedLastWeek, setPublishedLastWeek] = useState<DailyCount[]>([]);
  const [draftCount, setDraftCount] = useState(0);
  const [approvedCount, setApprovedCount] = useState(0);
  
  useEffect(() => {
    if (!statsLoading && documents) {
      // Get dates for the last 7 days
      const lastSevenDays = Array.from({ length: 7 }, (_, i) => {
        const date = new Date();
        date.setDate(date.getDate() - i);
        return date.toISOString().split('T')[0];
      }).reverse();
      
      // Initialize counters for each date
      const createdCounter: Record<string, number> = {};
      const publishedCounter: Record<string, number> = {};
      
      lastSevenDays.forEach(date => {
        createdCounter[date] = 0;
        publishedCounter[date] = 0;
      });
      
      // Count drafts that need attention
      const drafts = documents.filter(doc => doc.status === 'draft');
      setDraftCount(drafts.length);
      
      // Count approved documents
      const approved = documents.filter(doc => doc.status === 'approved');
      setApprovedCount(approved.length);
      
      // Count documents created and published in the last 7 days
      documents.forEach(doc => {
        const createdDate = new Date(doc.created_at).toISOString().split('T')[0];
        if (createdCounter[createdDate] !== undefined) {
          createdCounter[createdDate]++;
        }
        
        // Count published documents (only those with 'published' status)
        if (doc.status === 'published') {
          const updatedDate = new Date(doc.updated_at).toISOString().split('T')[0];
          if (publishedCounter[updatedDate] !== undefined) {
            publishedCounter[updatedDate]++;
          }
        }
      });
      
      // Format data for the charts
      setCreatedLastWeek(
        lastSevenDays.map(date => ({
          date: formatDate(date),
          count: createdCounter[date]
        }))
      );
      
      setPublishedLastWeek(
        lastSevenDays.map(date => ({
          date: formatDate(date),
          count: publishedCounter[date]
        }))
      );
    }
  }, [statsLoading, documents]);
  
  // Helper function to format dates
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return `${date.getDate()}/${date.getMonth() + 1}`;
  };
  
  // Custom tooltip for charts
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <Box bg="gray.800" p={2} borderRadius="md" borderColor="gray.700" borderWidth="1px">
          <Text color="gray.200">{`${label}: ${payload[0].value} documents`}</Text>
        </Box>
      );
    }
    return null;
  };
  
  const handleViewDrafts = () => {
    // Navigate to the Drafts tab (index 1)
    const tabsElement = document.querySelector('[role="tablist"]');
    if (tabsElement) {
      const draftTab = tabsElement.children[1] as HTMLElement;
      if (draftTab) draftTab.click();
    }
  };
  
  const handleViewApproved = () => {
    // Navigate to the Approved tab (index 2)
    const tabsElement = document.querySelector('[role="tablist"]');
    if (tabsElement) {
      const approvedTab = tabsElement.children[2] as HTMLElement;
      if (approvedTab) approvedTab.click();
    }
  };

  return (
    <Box>
      <Text color="gray.400" mb={6}>Welcome to your Ghostwriter dashboard, {user?.email}</Text>
      
      {statsLoading ? (
        <Box textAlign="center" p={10} color="gray.400">
          <Text>Loading dashboard data...</Text>
        </Box>
      ) : (
        <>
          {/* Drafts Attention Widget */}
          <Card bg="gray.800" borderColor="gray.700" mb={6}>
            <CardBody>
              <Flex align="center" justify="space-between">
                <Flex align="center">
                  <Icon as={FiAlertCircle} boxSize={6} color="yellow.400" mr={3} />
                  <Box>
                    <Heading size="md" color="white">{draftCount} Drafts need your attention</Heading>
                    <Text color="gray.400" mt={1}>Review and approve/reject pending drafts</Text>
                  </Box>
                </Flex>
                <Button 
                  colorScheme="yellow" 
                  variant="outline" 
                  onClick={handleViewDrafts}
                >
                  View Drafts
                </Button>
              </Flex>
            </CardBody>
          </Card>
          
          {/* Approved Posts Widget */}
          <Card bg="gray.800" borderColor="gray.700" mb={6}>
            <CardBody>
              <Flex align="center" justify="space-between">
                <Flex align="center">
                  <Icon as={FiCheck} boxSize={6} color="green.400" mr={3} />
                  <Box>
                    <Heading size="md" color="white">{approvedCount} Approved posts</Heading>
                    <Text color="gray.400" mt={1}>View your approved content</Text>
                  </Box>
                </Flex>
                <Button 
                  colorScheme="green" 
                  variant="outline" 
                  onClick={handleViewApproved}
                >
                  View Approved
                </Button>
              </Flex>
            </CardBody>
          </Card>
          
          <SimpleGrid columns={{ base: 1, md: 1, lg: 2 }} spacing={6}>
            {/* Created in last 7 days */}
            <Card bg="gray.800" borderColor="gray.700">
              <CardHeader>
                <Flex align="center">
                  <Icon as={FiCalendar} boxSize={5} color="blue.400" mr={2} />
                  <Heading size="md" color="white">Created in last 7 days</Heading>
                </Flex>
              </CardHeader>
              <CardBody>
                <Box height="250px">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={createdLastWeek}
                      margin={{ top: 10, right: 10, left: -20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke="#333" vertical={false} />
                      <XAxis 
                        dataKey="date" 
                        tick={{ fill: '#A0AEC0' }} 
                        axisLine={{ stroke: '#333' }}
                      />
                      <YAxis 
                        tick={{ fill: '#A0AEC0' }} 
                        axisLine={{ stroke: '#333' }}
                      />
                      <Tooltip content={<CustomTooltip />} />
                      <Bar 
                        dataKey="count" 
                        fill="#4299E1" 
                        radius={[4, 4, 0, 0]} 
                        name="Documents" 
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </Box>
              </CardBody>
            </Card>
            
            {/* Published in last 7 days */}
            <Card bg="gray.800" borderColor="gray.700">
              <CardHeader>
                <Flex align="center">
                  <Icon as={FiFileText} boxSize={5} color="green.400" mr={2} />
                  <Heading size="md" color="white">Published in last 7 days</Heading>
                </Flex>
              </CardHeader>
              <CardBody>
                <Box height="250px">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={publishedLastWeek}
                      margin={{ top: 10, right: 10, left: -20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke="#333" vertical={false} />
                      <XAxis 
                        dataKey="date" 
                        tick={{ fill: '#A0AEC0' }} 
                        axisLine={{ stroke: '#333' }}
                      />
                      <YAxis 
                        tick={{ fill: '#A0AEC0' }} 
                        axisLine={{ stroke: '#333' }}
                      />
                      <Tooltip content={<CustomTooltip />} />
                      <Bar 
                        dataKey="count" 
                        fill="#48BB78" 
                        radius={[4, 4, 0, 0]} 
                        name="Documents" 
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </Box>
              </CardBody>
            </Card>
          </SimpleGrid>
        </>
      )}
    </Box>
  );
} 