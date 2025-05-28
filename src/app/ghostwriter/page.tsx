'use client';

import { Box, Tabs, TabPanels, TabPanel } from '@chakra-ui/react';
import { DashboardOverview, TabNavigation, RecentDraftsTab, ApprovedPostsTab } from './components';

export default function Dashboard() {
  return (
    <Box h="100%">
      <Tabs variant="line" colorScheme="blue" size="md" isLazy h="100%" display="flex" flexDirection="column">
        <TabNavigation />
        
        <Box flex="1" py={6} px={4} overflow="auto">
          <TabPanels h="100%">
            <TabPanel p={0} h="100%">
              <DashboardOverview />
            </TabPanel>
            <TabPanel p={0} h="100%">
              <RecentDraftsTab />
            </TabPanel>
            <TabPanel p={0} h="100%">
              <ApprovedPostsTab />
            </TabPanel>
          </TabPanels>
        </Box>
      </Tabs>
    </Box>
  );
} 