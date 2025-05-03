'use client';

import { Box, Container, Tabs, TabPanels, TabPanel } from '@chakra-ui/react';
import { DashboardOverview, TabNavigation, RecentDraftsTab, ApprovedPostsTab } from './components';

export default function Dashboard() {
  return (
    <Box>
      <Tabs variant="line" colorScheme="blue" size="md" isLazy>
        <TabNavigation />
        
        <Container maxW="container.xl" py={6} px={4}>
          <TabPanels>
            <TabPanel p={0}>
              <DashboardOverview />
            </TabPanel>
            <TabPanel p={0}>
              <RecentDraftsTab />
            </TabPanel>
            <TabPanel p={0}>
              <ApprovedPostsTab />
            </TabPanel>
          </TabPanels>
        </Container>
      </Tabs>
    </Box>
  );
} 