'use client';

import React, { forwardRef, useState } from 'react';
import {
  Input as ChakraInput,
  InputGroup,
  InputLeftElement,
  InputRightElement,
  InputProps as ChakraInputProps,
  Box,
  Text,
  FormControl,
  FormLabel,
  FormErrorMessage,
  IconButton,
} from '@chakra-ui/react';
import { FiEye, FiEyeOff } from 'react-icons/fi';
import { designTokens } from '../../design/tokens';

export interface InputProps extends Omit<ChakraInputProps, 'size'> {
  label?: string;
  error?: string;
  hint?: string;
  leftIcon?: React.ReactElement;
  rightIcon?: React.ReactElement;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'filled' | 'outline' | 'ghost';
  showPasswordToggle?: boolean;
}

const sizeStyles = {
  sm: {
    h: '8',
    fontSize: 'sm',
    px: '3',
  },
  md: {
    h: '10',
    fontSize: 'sm',
    px: '4',
  },
  lg: {
    h: '12',
    fontSize: 'base',
    px: '4',
  },
};

const variantStyles = {
  filled: {
    bg: 'gray.800',
    border: '1px solid',
    borderColor: 'gray.700',
    color: 'gray.100',
    _hover: {
      borderColor: 'gray.600',
      bg: 'gray.750',
    },
    _focus: {
      borderColor: 'brand.500',
      boxShadow: `0 0 0 1px ${designTokens.colors.primary[500]}`,
      bg: 'gray.800',
    },
    _invalid: {
      borderColor: 'red.500',
      boxShadow: `0 0 0 1px ${designTokens.colors.error[500]}`,
    },
    _placeholder: {
      color: 'gray.400',
    },
  },
  outline: {
    bg: 'transparent',
    border: '1px solid',
    borderColor: 'gray.600',
    color: 'gray.100',
    _hover: {
      borderColor: 'gray.500',
    },
    _focus: {
      borderColor: 'brand.500',
      boxShadow: `0 0 0 1px ${designTokens.colors.primary[500]}`,
    },
    _invalid: {
      borderColor: 'red.500',
      boxShadow: `0 0 0 1px ${designTokens.colors.error[500]}`,
    },
    _placeholder: {
      color: 'gray.400',
    },
  },
  ghost: {
    bg: 'transparent',
    border: 'none',
    color: 'gray.100',
    _hover: {
      bg: 'gray.800',
    },
    _focus: {
      bg: 'gray.800',
      boxShadow: `0 0 0 1px ${designTokens.colors.primary[500]}`,
    },
    _placeholder: {
      color: 'gray.400',
    },
  },
};

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({
    label,
    error,
    hint,
    leftIcon,
    rightIcon,
    size = 'md',
    variant = 'filled',
    showPasswordToggle = false,
    type = 'text',
    ...props
  }, ref) => {
    const [showPassword, setShowPassword] = useState(false);
    const [isFocused, setIsFocused] = useState(false);

    const inputType = showPasswordToggle ? (showPassword ? 'text' : 'password') : type;
    const hasError = Boolean(error);

    const inputElement = (
      <ChakraInput
        ref={ref}
        type={inputType}
        {...sizeStyles[size]}
        {...variantStyles[variant]}
        borderRadius="lg"
        fontFamily="inherit"
        transition="all 0.2s cubic-bezier(0.4, 0, 0.2, 1)"
        isInvalid={hasError}
        onFocus={(e) => {
          setIsFocused(true);
          props.onFocus?.(e);
        }}
        onBlur={(e) => {
          setIsFocused(false);
          props.onBlur?.(e);
        }}
        {...props}
      />
    );

    const inputWithIcons = (leftIcon || rightIcon || showPasswordToggle) ? (
      <InputGroup size={size}>
        {leftIcon && (
          <InputLeftElement
            pointerEvents="none"
            color="gray.400"
            fontSize={size === 'lg' ? 'lg' : 'md'}
          >
            {leftIcon}
          </InputLeftElement>
        )}
        {inputElement}
        {(rightIcon || showPasswordToggle) && (
          <InputRightElement>
            {showPasswordToggle ? (
              <IconButton
                aria-label={showPassword ? 'Hide password' : 'Show password'}
                icon={showPassword ? <FiEyeOff /> : <FiEye />}
                variant="ghost"
                size="sm"
                color="gray.400"
                _hover={{ color: 'gray.300' }}
                onClick={() => setShowPassword(!showPassword)}
              />
            ) : (
              <Box color="gray.400" fontSize={size === 'lg' ? 'lg' : 'md'}>
                {rightIcon}
              </Box>
            )}
          </InputRightElement>
        )}
      </InputGroup>
    ) : inputElement;

    if (label || error || hint) {
      return (
        <FormControl isInvalid={hasError}>
          {label && (
            <FormLabel
              fontSize="sm"
              fontWeight="medium"
              color="gray.200"
              mb={2}
              transition="color 0.2s"
              sx={{
                color: isFocused ? 'brand.400' : 'gray.200',
              }}
            >
              {label}
            </FormLabel>
          )}
          {inputWithIcons}
          {error && (
            <FormErrorMessage fontSize="sm" mt={1}>
              {error}
            </FormErrorMessage>
          )}
          {hint && !error && (
            <Text fontSize="sm" color="gray.400" mt={1}>
              {hint}
            </Text>
          )}
        </FormControl>
      );
    }

    return inputWithIcons;
  }
);

Input.displayName = 'Input'; 