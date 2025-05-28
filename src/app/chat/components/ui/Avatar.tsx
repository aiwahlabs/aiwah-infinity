'use client';

import React, { forwardRef } from 'react';
import {
  Avatar as ChakraAvatar,
  AvatarProps as ChakraAvatarProps,
  Box,
  AvatarBadge,
} from '@chakra-ui/react';
import { designTokens } from '../../design/tokens';

export interface AvatarProps extends Omit<ChakraAvatarProps, 'size'> {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  status?: 'online' | 'offline' | 'away' | 'busy';
  showStatus?: boolean;
  variant?: 'default' | 'gradient' | 'glow';
  isBot?: boolean;
}

const sizeMap = {
  xs: '6',
  sm: '8',
  md: '10',
  lg: '12',
  xl: '16',
  '2xl': '20',
};

const statusColors = {
  online: 'green.400',
  offline: 'gray.400',
  away: 'yellow.400',
  busy: 'red.400',
};

const variantStyles = {
  default: {},
  gradient: {
    bg: 'linear-gradient(135deg, #0ea5e9 0%, #8b5cf6 100%)',
    color: 'white',
  },
  glow: {
    boxShadow: designTokens.shadows.glow,
    border: '2px solid',
    borderColor: 'brand.500',
  },
};

export const Avatar = forwardRef<HTMLSpanElement, AvatarProps>(
  ({
    size = 'md',
    status,
    showStatus = false,
    variant = 'default',
    isBot = false,
    name,
    src,
    ...props
  }, ref) => {
    const avatarSize = sizeMap[size];
    
    // Generate initials from name
    const getInitials = (name?: string) => {
      if (!name) return isBot ? 'AI' : '?';
      return name
        .split(' ')
        .map(word => word[0])
        .join('')
        .toUpperCase()
        .slice(0, 2);
    };

    // Bot-specific styling
    const botStyles = isBot ? {
      bg: 'linear-gradient(135deg, #0ea5e9 0%, #3b82f6 100%)',
      color: 'white',
      fontWeight: 'bold',
      border: '2px solid',
      borderColor: 'brand.400',
      boxShadow: '0 0 20px rgba(14, 165, 233, 0.3)',
    } : {};

    return (
      <Box position="relative" display="inline-block">
        <ChakraAvatar
          ref={ref}
          size={avatarSize}
          name={name}
          src={src}
          {...variantStyles[variant]}
          {...botStyles}
          transition="all 0.2s cubic-bezier(0.4, 0, 0.2, 1)"
          _hover={{
            transform: 'scale(1.05)',
            ...(variant === 'glow' && {
              boxShadow: designTokens.shadows['glow-lg'],
            }),
          }}
          {...props}
        >
          {!src && getInitials(name)}
          
          {showStatus && status && (
            <AvatarBadge
              boxSize="1.25em"
              bg={statusColors[status]}
              border="2px solid"
              borderColor="gray.900"
            />
          )}
        </ChakraAvatar>
        
        {/* Animated ring for active states */}
        {(isBot || variant === 'glow') && (
          <Box
            position="absolute"
            top="-2px"
            left="-2px"
            right="-2px"
            bottom="-2px"
            borderRadius="full"
            border="2px solid"
            borderColor="brand.500"
            opacity={0.6}
            animation="pulse 2s infinite"
            sx={{
              '@keyframes pulse': {
                '0%, 100%': {
                  opacity: 0.6,
                  transform: 'scale(1)',
                },
                '50%': {
                  opacity: 0.3,
                  transform: 'scale(1.05)',
                },
              },
            }}
          />
        )}
      </Box>
    );
  }
);

Avatar.displayName = 'Avatar'; 