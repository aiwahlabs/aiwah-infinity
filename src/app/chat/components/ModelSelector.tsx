'use client';

import React, { useState } from 'react';
import {
  Box,
  Select,
  Text,
  VStack,
  HStack,
  Badge,
  Tooltip,
  Icon,
  Flex,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverBody,
  Button,
} from '@chakra-ui/react';
import { FiInfo, FiZap, FiCpu, FiClock, FiChevronDown } from 'react-icons/fi';
import { OPENROUTER_MODELS, MODEL_INFO, OpenRouterModel } from '@/lib/openrouter';
import { getChatService } from '@/lib/ai/chatService';

interface ModelSelectorProps {
  selectedModel?: OpenRouterModel;
  onModelChange?: (model: OpenRouterModel) => void;
  compact?: boolean;
}

export function ModelSelector({ 
  selectedModel, 
  onModelChange,
  compact = false 
}: ModelSelectorProps) {
  const chatService = getChatService();
  const [currentModel, setCurrentModel] = useState<OpenRouterModel>(
    selectedModel || chatService.getDefaultModel()
  );
  const modelInfo = MODEL_INFO[currentModel];

  const handleModelChange = (newModel: OpenRouterModel) => {
    setCurrentModel(newModel);
    chatService.setDefaultModel(newModel);
    onModelChange?.(newModel);
  };

  const getSpeedIcon = (speed: string) => {
    switch (speed) {
      case 'fast': return FiZap;
      case 'medium': return FiCpu;
      case 'slow': return FiClock;
      default: return FiCpu;
    }
  };

  const getSpeedColor = (speed: string) => {
    switch (speed) {
      case 'fast': return 'green';
      case 'medium': return 'yellow';
      case 'slow': return 'orange';
      default: return 'gray';
    }
  };

  if (compact) {
    return (
      <Select
        value={currentModel}
        onChange={(e) => handleModelChange(e.target.value as OpenRouterModel)}
        size="sm"
        bg="gray.800"
        borderColor="gray.600"
        color="white"
        _focus={{ borderColor: 'teal.400' }}
      >
        {Object.values(OPENROUTER_MODELS).map((model) => (
          <option key={model} value={model} style={{ backgroundColor: '#374151', color: 'white' }}>
            {MODEL_INFO[model].name}
          </option>
        ))}
      </Select>
    );
  }

  return (
    <Popover trigger="hover" placement="bottom-end" gutter={8}>
      <PopoverTrigger>
        <Button
          variant="outline"
          size="sm"
          rightIcon={<FiChevronDown />}
          bg="gray.800"
          borderColor="gray.600"
          color="white"
          _hover={{ bg: "gray.600", borderColor: "gray.600" }}
          _focus={{ borderColor: 'teal.400' }}
          fontWeight="normal"
          fontSize="sm"
        >
          {modelInfo.name}
        </Button>
      </PopoverTrigger>
      
      <PopoverContent
        bg="gray.800"
        borderColor="gray.600"
        boxShadow="xl"
        w="320px"
      >
        <PopoverBody p={4}>
          <VStack spacing={3} align="stretch">
            {/* Current Model Info */}
            <Box>
              <Flex justify="space-between" align="center" mb={2}>
                <Text fontSize="sm" fontWeight="medium" color="white">
                  Current Model
                </Text>
                <Badge
                  colorScheme={getSpeedColor(modelInfo.speed)}
                  variant="subtle"
                  display="flex"
                  alignItems="center"
                  gap={1}
                >
                  <Icon as={getSpeedIcon(modelInfo.speed)} boxSize={3} />
                  {modelInfo.speed}
                </Badge>
              </Flex>
              
              <Text fontSize="xs" color="gray.400" mb={2}>
                {modelInfo.description}
              </Text>

              <HStack spacing={1} flexWrap="wrap" mb={2}>
                {modelInfo.capabilities.slice(0, 3).map((capability) => (
                  <Badge
                    key={capability}
                    size="sm"
                    variant="outline"
                    colorScheme="teal"
                    fontSize="xs"
                  >
                    {capability}
                  </Badge>
                ))}
                {modelInfo.capabilities.length > 3 && (
                  <Badge
                    size="sm"
                    variant="outline"
                    colorScheme="gray"
                    fontSize="xs"
                  >
                    +{modelInfo.capabilities.length - 3}
                  </Badge>
                )}
              </HStack>

              <Flex align="center" gap={1} fontSize="xs" color="gray.400">
                <Icon as={FiInfo} boxSize={3} />
                <Text>Context: {modelInfo.contextLength.toLocaleString()} tokens</Text>
              </Flex>
            </Box>

            {/* Model Selection */}
            <Box>
              <Text fontSize="sm" fontWeight="medium" color="white" mb={2}>
                Switch Model
              </Text>
              <VStack spacing={1} align="stretch">
                {Object.values(OPENROUTER_MODELS).map((model) => {
                  const info = MODEL_INFO[model];
                  const isSelected = model === currentModel;
                  
                  return (
                    <Button
                      key={model}
                      variant={isSelected ? "solid" : "ghost"}
                      colorScheme={isSelected ? "teal" : "gray"}
                      size="sm"
                      justifyContent="flex-start"
                      onClick={() => handleModelChange(model)}
                      _hover={{ bg: isSelected ? "teal.600" : "gray.600" }}
                    >
                      <Flex justify="space-between" align="center" w="full">
                        <Text fontSize="xs">{info.name}</Text>
                        <Badge
                          size="xs"
                          colorScheme={getSpeedColor(info.speed)}
                          variant="subtle"
                        >
                          {info.speed}
                        </Badge>
                      </Flex>
                    </Button>
                  );
                })}
              </VStack>
            </Box>
          </VStack>
        </PopoverBody>
      </PopoverContent>
    </Popover>
  );
} 