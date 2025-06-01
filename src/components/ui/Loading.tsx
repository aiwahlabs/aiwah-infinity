'use client';

import React from 'react';
import {
  Box,
  Center,
  VStack,
  Spinner,
  Text,
  Portal,
  SpinnerProps,
  BoxProps,
  TextProps,
} from '@chakra-ui/react';
import { colors } from '@/components/theme';
import { CardSkeleton, ListSkeleton, InlineSkeleton, TableSkeleton, ProfileSkeleton, DashboardSkeleton, ChatSkeleton, SidebarSkeleton } from './skeletons';

// Loading variant types
export type LoadingVariant = 
  | 'fullscreen'     // Full screen overlay
  | 'page'           // Full page content area
  | 'card'           // Card/container overlay
  | 'inline'         // Inline within content
  | 'button'         // Small loading for buttons
  | 'modal'          // Modal/popup overlay
  | 'widget';        // Widget/component overlay

// Loading size types
export type LoadingSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

// Loading background types
export type LoadingBackground = 
  | 'none'           // No background
  | 'transparent'    // Transparent overlay
  | 'blur'           // Blurred backdrop
  | 'solid'          // Solid grayed out background
  | 'dark'           // Dark semi-transparent
  | 'light';         // Light semi-transparent

export interface LoadingProps {
  /** Loading variant determines the positioning and size */
  variant?: LoadingVariant;
  
  /** Size of the spinner */
  size?: LoadingSize;
  
  /** Background style */
  background?: LoadingBackground;
  
  /** Loading message */
  message?: string;
  
  /** Custom spinner color */
  color?: string;
  
  /** Whether to show the loading state */
  isLoading?: boolean;
  
  /** Minimum height for page/card variants */
  minHeight?: string | number;
  
  /** Custom z-index for overlays */
  zIndex?: number;
  
  /** Custom positioning for overlays */
  position?: 'absolute' | 'fixed';
  
  /** Custom container props */
  containerProps?: BoxProps;
  
  /** Custom spinner props */
  spinnerProps?: SpinnerProps;
  
  /** Custom text props */
  textProps?: TextProps;
  
  /** Whether to use portal for fullscreen/modal variants */
  usePortal?: boolean;
  
  /** Custom overlay opacity */
  overlayOpacity?: number;
  
  /** Disable backdrop blur for performance */
  disableBlur?: boolean;
  
  /** Skeleton variant */
  skeletonVariant?: 'card' | 'list' | 'inline' | 'table' | 'profile' | 'dashboard' | 'chat' | 'sidebar';
  
  /** Skeleton count */
  skeletonCount?: number;
  
  /** Skeleton rows */
  skeletonRows?: number;
  
  /** Skeleton columns */
  skeletonColumns?: number;
}

// Variant configurations
const variantConfig = {
  fullscreen: {
    position: 'fixed' as const,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 9999,
    usePortal: true,
  },
  page: {
    position: 'absolute' as const,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 10,
    minHeight: '50vh',
    usePortal: false,
  },
  card: {
    position: 'absolute' as const,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 5,
    minHeight: '200px',
    borderRadius: 'lg',
    usePortal: false,
  },
  inline: {
    position: 'relative' as const,
    zIndex: 1,
    minHeight: '100px',
    usePortal: false,
  },
  button: {
    position: 'relative' as const,
    zIndex: 1,
    minHeight: 'auto',
    usePortal: false,
  },
  modal: {
    position: 'absolute' as const,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 15,
    borderRadius: 'md',
    usePortal: false,
  },
  widget: {
    position: 'absolute' as const,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 3,
    borderRadius: 'md',
    usePortal: false,
  },
};

// Background styles
const backgroundStyles = {
  none: {} as Record<string, unknown>,
  transparent: {
    bg: 'transparent',
  },
  blur: {
    bg: 'rgba(23, 23, 23, 0.8)', // gray.900 with opacity
    backdropFilter: 'blur(8px)',
  },
  solid: {
    bg: colors.gray[900],
    opacity: 0.95,
  },
  dark: {
    bg: 'rgba(23, 23, 23, 0.85)', // gray.900 with opacity
  },
  light: {
    bg: 'rgba(255, 255, 255, 0.1)',
  },
};

// Size configurations for different elements
const sizeConfig = {
  xs: { spinner: 'sm', text: 'sm' },
  sm: { spinner: 'md', text: 'sm' },
  md: { spinner: 'lg', text: 'md' },
  lg: { spinner: 'xl', text: 'lg' },
  xl: { spinner: 'xl', text: 'xl' },
};

export function Loading({
  variant = 'page',
  size = 'md',
  background = 'solid',
  message = 'Loading...',
  color = colors.brand[500],
  isLoading = true,
  minHeight,
  zIndex,
  position,
  containerProps = {},
  spinnerProps = {},
  textProps = {},
  usePortal,
  overlayOpacity,
  disableBlur = false,
  skeletonVariant,
  skeletonCount = 3,
  skeletonRows = 5,
  skeletonColumns = 4,
  ...props
}: LoadingProps) {
  if (skeletonVariant) {
    switch (skeletonVariant) {
      case 'card':
        return <CardSkeleton />;
      case 'list':
        return <ListSkeleton count={skeletonCount} />;
      case 'inline':
        return <InlineSkeleton />;
      case 'table':
        return <TableSkeleton rows={skeletonRows} columns={skeletonColumns} />;
      case 'profile':
        return <ProfileSkeleton />;
      case 'dashboard':
        return <DashboardSkeleton />;
      case 'chat':
        return <ChatSkeleton />;
      case 'sidebar':
        return <SidebarSkeleton />;
      default:
        return null;
    }
  }
  
  // Don't render if not loading
  if (!isLoading) return null;
  
  // Get variant configuration
  const config = variantConfig[variant];
  const bgStyles = backgroundStyles[background];
  const sizes = sizeConfig[size];
  
  // Determine if we should use portal
  const shouldUsePortal = usePortal ?? config.usePortal ?? false;
  
  // Apply backdrop blur disable if requested
  const finalBgStyles = disableBlur && background === 'blur' 
    ? { ...bgStyles, backdropFilter: undefined }
    : bgStyles;
  
  // Custom opacity override
  if (overlayOpacity !== undefined && finalBgStyles.bg) {
    if (typeof finalBgStyles.bg === 'string' && finalBgStyles.bg.includes('rgba')) {
      // Replace existing opacity in rgba
      finalBgStyles.bg = finalBgStyles.bg.replace(/,\s*[\d.]+\)$/, `, ${overlayOpacity})`);
    }
  }
  
  const loadingContent = (
    <Box
      position={position || config.position}
      top={('top' in config) ? config.top : undefined}
      left={('left' in config) ? config.left : undefined}
      right={('right' in config) ? config.right : undefined}
      bottom={('bottom' in config) ? config.bottom : undefined}
      zIndex={zIndex || config.zIndex}
      minHeight={minHeight || ('minHeight' in config ? config.minHeight : undefined)}
      borderRadius={('borderRadius' in config) ? config.borderRadius : undefined}
      display="flex"
      alignItems="center"
      justifyContent="center"
      {...finalBgStyles}
      {...containerProps}
      {...props}
    >
      <Center>
        <VStack spacing={4}>
          <Spinner
            size={sizes.spinner as SpinnerProps['size']}
            color={color}
            thickness="3px"
            speed="0.8s"
            {...spinnerProps}
          />
          {message && (
            <Text
              color={colors.gray[100]}
              fontSize={sizes.text}
              fontWeight="medium"
              textAlign="center"
              {...textProps}
            >
              {message}
            </Text>
          )}
        </VStack>
      </Center>
    </Box>
  );
  
  // Use portal for fullscreen and modal overlays
  if (shouldUsePortal) {
    return <Portal>{loadingContent}</Portal>;
  }
  
  return loadingContent;
}

// Convenience components for common use cases
export const FullScreenLoading = (props: Omit<LoadingProps, 'variant'>) => (
  <Loading variant="fullscreen" {...props} />
);

export const PageLoading = (props: Omit<LoadingProps, 'variant'>) => (
  <Loading variant="page" {...props} />
);

export const CardLoading = (props: Omit<LoadingProps, 'variant'>) => (
  <Loading variant="card" {...props} />
);

export const InlineLoading = (props: Omit<LoadingProps, 'variant'>) => (
  <Loading variant="inline" background="none" {...props} />
);

export const ButtonLoading = (props: Omit<LoadingProps, 'variant'>) => (
  <Loading variant="button" size="xs" background="none" message="" {...props} />
);

export const ModalLoading = (props: Omit<LoadingProps, 'variant'>) => (
  <Loading variant="modal" background="dark" {...props} />
);

export const WidgetLoading = (props: Omit<LoadingProps, 'variant'>) => (
  <Loading variant="widget" size="sm" {...props} />
);

// Hook for programmatic loading control
export function useLoading() {
  const [isLoading, setIsLoading] = React.useState(false);
  
  const startLoading = React.useCallback(() => setIsLoading(true), []);
  const stopLoading = React.useCallback(() => setIsLoading(false), []);
  const toggleLoading = React.useCallback(() => setIsLoading(prev => !prev), []);
  
  return {
    isLoading,
    startLoading,
    stopLoading,
    toggleLoading,
    setIsLoading,
  };
}

// Higher-order component for wrapping components with loading
export function withLoading<P extends object>(
  Component: React.ComponentType<P>,
  loadingProps?: Partial<LoadingProps>
) {
  return function LoadingWrapper(props: P & { isLoading?: boolean }) {
    const { isLoading, ...componentProps } = props;
    
    return (
      <Box position="relative">
        <Component {...(componentProps as P)} />
        <Loading isLoading={isLoading} variant="card" {...loadingProps} />
      </Box>
    );
  };
} 