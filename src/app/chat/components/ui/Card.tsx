'use client';

import React, { forwardRef } from 'react';
import { Box, BoxProps } from '@chakra-ui/react';
import { designTokens } from '../../design/tokens';

export interface CardProps extends BoxProps {
  variant?: 'default' | 'elevated' | 'glass' | 'bordered' | 'gradient';
  padding?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
  hover?: boolean;
  interactive?: boolean;
}

const variantStyles = {
  default: {
    bg: 'gray.900',
    border: '1px solid',
    borderColor: 'gray.800',
    boxShadow: designTokens.shadows.sm,
  },
  elevated: {
    bg: 'gray.900',
    border: '1px solid',
    borderColor: 'gray.800',
    boxShadow: designTokens.shadows.lg,
  },
  glass: {
    bg: 'rgba(255, 255, 255, 0.05)',
    backdropFilter: 'blur(10px)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    boxShadow: designTokens.shadows.md,
  },
  bordered: {
    bg: 'transparent',
    border: '1px solid',
    borderColor: 'gray.700',
  },
  gradient: {
    bg: 'linear-gradient(135deg, rgba(14, 165, 233, 0.1) 0%, rgba(139, 92, 246, 0.1) 100%)',
    border: '1px solid',
    borderColor: 'gray.800',
    boxShadow: designTokens.shadows.md,
  },
};

const paddingStyles = {
  none: { p: 0 },
  sm: { p: 3 },
  md: { p: 4 },
  lg: { p: 6 },
  xl: { p: 8 },
};

const hoverStyles = {
  transform: 'translateY(-2px)',
  boxShadow: designTokens.shadows.xl,
  borderColor: 'gray.700',
};

const interactiveStyles = {
  cursor: 'pointer',
  transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
  _hover: hoverStyles,
  _active: {
    transform: 'translateY(0)',
    boxShadow: designTokens.shadows.md,
  },
};

export const Card = forwardRef<HTMLDivElement, CardProps>(
  ({
    variant = 'default',
    padding = 'md',
    hover = false,
    interactive = false,
    children,
    ...props
  }, ref) => {
    const shouldHover = hover || interactive;

    return (
      <Box
        ref={ref}
        borderRadius="xl"
        overflow="hidden"
        position="relative"
        transition="all 0.2s cubic-bezier(0.4, 0, 0.2, 1)"
        {...variantStyles[variant]}
        {...paddingStyles[padding]}
        {...(shouldHover && {
          _hover: hoverStyles,
        })}
        {...(interactive && interactiveStyles)}
        _before={{
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          borderRadius: 'inherit',
          padding: '1px',
          background: variant === 'gradient' 
            ? 'linear-gradient(135deg, rgba(14, 165, 233, 0.3), rgba(139, 92, 246, 0.3))'
            : 'transparent',
          mask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
          maskComposite: 'xor',
          WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
          WebkitMaskComposite: 'xor',
          pointerEvents: 'none',
          opacity: variant === 'gradient' ? 1 : 0,
        }}
        {...props}
      >
        {children}
      </Box>
    );
  }
);

Card.displayName = 'Card';

// Card sub-components for better composition
export const CardHeader = forwardRef<HTMLDivElement, BoxProps>(
  ({ children, ...props }, ref) => (
    <Box
      ref={ref}
      pb={4}
      borderBottom="1px solid"
      borderColor="gray.800"
      mb={4}
      {...props}
    >
      {children}
    </Box>
  )
);

CardHeader.displayName = 'CardHeader';

export const CardBody = forwardRef<HTMLDivElement, BoxProps>(
  ({ children, ...props }, ref) => (
    <Box ref={ref} {...props}>
      {children}
    </Box>
  )
);

CardBody.displayName = 'CardBody';

export const CardFooter = forwardRef<HTMLDivElement, BoxProps>(
  ({ children, ...props }, ref) => (
    <Box
      ref={ref}
      pt={4}
      borderTop="1px solid"
      borderColor="gray.800"
      mt={4}
      {...props}
    >
      {children}
    </Box>
  )
);

CardFooter.displayName = 'CardFooter'; 