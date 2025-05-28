'use client';

import React from 'react';
import { Card, CardHeader, CardBody, Heading, Text, Icon, Flex, Box } from '@chakra-ui/react';
import Link from 'next/link';
import { IconType } from 'react-icons';

/**
 * Props for the AppFeatureCard component.
 */
interface AppFeatureCardProps {
  /** The URL the card links to. */
  href: string;
  /** The react-icons IconType to display in the card. */
  icon: IconType;
  /** The title of the feature. */
  title: string;
  /** A brief description of the feature. */
  description: string;
}

/**
 * AppFeatureCard is a reusable UI component that displays a feature or application link
 * with an icon, title, and description. It's styled as a clickable card with hover effects.
 */
export const AppFeatureCard: React.FC<AppFeatureCardProps> = ({ href, icon, title, description }) => {
  return (
    // The Link component from Next.js is used for client-side navigation.
    // `passHref` is important when the Link's child is a custom component (like Chakra UI's Card)
    // that should receive the href property for proper anchor tag generation.
    // `style={{ display: 'contents' }}` makes the Link component not render a DOM element itself,
    // allowing the Card to be the direct child and control its own layout and styling.
    <Link href={href} passHref style={{ display: 'contents' }}>
      <Card
        bg="gray.800"
        borderColor="gray.700"
        borderWidth="1px"
        borderRadius="lg"
        overflow="hidden"
        _hover={{
          transform: 'translateY(-4px)',
          boxShadow: 'xl',
          borderColor: "blue.400"
        }}
        transition="all 0.2s ease-in-out"
        cursor="pointer"
        height="100%"
        maxW="100%"
      >
        <CardHeader pb={4}>
          <Flex align="center">
            <Box
              bg="blue.500"
              color="white"
              p={3}
              borderRadius="md"
              mr={4}
            >
              <Icon as={icon} boxSize={6} />
            </Box>
            <Heading size="md" color="white">{title}</Heading>
          </Flex>
        </CardHeader>
        <CardBody pt={0} pb={6}>
          <Text color="gray.300" fontSize="md">{description}</Text>
        </CardBody>
      </Card>
    </Link>
  );
};
