'use client';

import React, { forwardRef } from 'react';
import { Button as ChakraButton, ButtonProps as ChakraButtonProps, Spinner, Box } from '@chakra-ui/react';
import { designTokens } from '../../design/tokens';

export interface ButtonProps extends Omit<ChakraButtonProps, 'variant' | 'size'> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger' | 'success';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  leftIcon?: React.ReactElement;
  rightIcon?: React.ReactElement;
  fullWidth?: boolean;
}

const variantStyles = {
  primary: {
    bg: 'brand.500',
    color: 'white',
    border: 'none',
    _hover: {
      bg: 'brand.600',
      transform: 'translateY(-1px)',
      boxShadow: designTokens.shadows.lg,
    },
    _active: {
      bg: 'brand.700',
      transform: 'translateY(0)',
    },
    _disabled: {
      bg: 'gray.700',
      color: 'gray.400',
      _hover: {
        bg: 'gray.700',
        transform: 'none',
        boxShadow: 'none',
      },
    },
  },
  secondary: {
    bg: 'gray.800',
    color: 'gray.100',
    border: '1px solid',
    borderColor: 'gray.700',
    _hover: {
      bg: 'gray.700',
      borderColor: 'gray.600',
      transform: 'translateY(-1px)',
    },
    _active: {
      bg: 'gray.750',
      transform: 'translateY(0)',
    },
  },
  ghost: {
    bg: 'transparent',
    color: 'gray.300',
    border: 'none',
    _hover: {
      bg: 'gray.800',
      color: 'gray.100',
    },
    _active: {
      bg: 'gray.750',
    },
  },
  danger: {
    bg: 'red.500',
    color: 'white',
    border: 'none',
    _hover: {
      bg: 'red.600',
      transform: 'translateY(-1px)',
      boxShadow: designTokens.shadows.lg,
    },
    _active: {
      bg: 'red.700',
      transform: 'translateY(0)',
    },
  },
  success: {
    bg: 'green.500',
    color: 'white',
    border: 'none',
    _hover: {
      bg: 'green.600',
      transform: 'translateY(-1px)',
      boxShadow: designTokens.shadows.lg,
    },
    _active: {
      bg: 'green.700',
      transform: 'translateY(0)',
    },
  },
};

const sizeStyles = {
  sm: {
    h: '8',
    px: '3',
    fontSize: 'sm',
    fontWeight: 'medium',
  },
  md: {
    h: '10',
    px: '4',
    fontSize: 'sm',
    fontWeight: 'medium',
  },
  lg: {
    h: '12',
    px: '6',
    fontSize: 'base',
    fontWeight: 'semibold',
  },
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ 
    variant = 'primary', 
    size = 'md', 
    loading = false, 
    leftIcon, 
    rightIcon, 
    fullWidth = false,
    children, 
    disabled,
    ...props 
  }, ref) => {
    const isDisabled = disabled || loading;

    return (
      <ChakraButton
        ref={ref}
        {...variantStyles[variant]}
        {...sizeStyles[size]}
        w={fullWidth ? 'full' : 'auto'}
        borderRadius="lg"
        fontFamily="inherit"
        transition="all 0.2s cubic-bezier(0.4, 0, 0.2, 1)"
        position="relative"
        overflow="hidden"
        disabled={isDisabled}
        _focus={{
          outline: 'none',
          boxShadow: `0 0 0 2px ${designTokens.colors.primary[500]}40`,
        }}
        _before={{
          content: '""',
          position: 'absolute',
          top: 0,
          left: '-100%',
          width: '100%',
          height: '100%',
          background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent)',
          transition: 'left 0.5s',
        }}
        _hover={{
          ...variantStyles[variant]._hover,
          _before: {
            left: '100%',
          },
        }}
        {...props}
      >
        {loading && (
          <Spinner
            size="sm"
            mr={children ? 2 : 0}
            color="currentColor"
          />
        )}
        {!loading && leftIcon && (
          <Box mr={2} display="inline-flex" alignItems="center">
            {leftIcon}
          </Box>
        )}
        {children}
        {!loading && rightIcon && (
          <Box ml={2} display="inline-flex" alignItems="center">
            {rightIcon}
          </Box>
        )}
      </ChakraButton>
    );
  }
);

Button.displayName = 'Button'; 