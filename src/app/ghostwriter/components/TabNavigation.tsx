'use client';

import { Box, TabList, Tab, Icon, Flex, Button } from '@chakra-ui/react';
import { FiHome, FiClock, FiCheck, FiPlus } from 'react-icons/fi';
import { useRouter } from 'next/navigation';

export function TabNavigation() {
  const router = useRouter();

  const handleCreateDocument = () => {
    router.push('/ghostwriter/document/new');
  };

  return (
    <Box 
      position="sticky"
      top="0"
      zIndex="20"
      bg="gray.900"
      borderBottom="1px"
      borderColor="gray.700"
      boxShadow="sm"
    >
      <Box py={2} px={4}>
        <Flex justify="space-between" align="center">
          <TabList borderBottom="none">
            <Tab 
              fontWeight="medium" 
              py={4}
              px={4}
              _selected={{ color: "blue.400", borderColor: "blue.400" }}
            >
              <Icon as={FiHome} mr={2} /> Overview
            </Tab>
            <Tab 
              fontWeight="medium" 
              py={4}
              px={4}
              _selected={{ color: "blue.400", borderColor: "blue.400" }}
            >
              <Icon as={FiClock} mr={2} /> Drafts
            </Tab>
            <Tab 
              fontWeight="medium" 
              py={4}
              px={4}
              _selected={{ color: "blue.400", borderColor: "blue.400" }}
            >
              <Icon as={FiCheck} mr={2} /> Approved
            </Tab>
          </TabList>
          <Button 
            leftIcon={<FiPlus />} 
            colorScheme="blue" 
            size="sm" 
            onClick={handleCreateDocument}
          >
            New Document
          </Button>
        </Flex>
      </Box>
    </Box>
  );
} 