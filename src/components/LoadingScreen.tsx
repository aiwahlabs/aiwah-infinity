'use client';

import { FullScreenLoading } from '@/components/ui';

export function LoadingScreen() {
  // Using the new centralized loading system
  // This ensures consistent theming and better performance
  return (
    <FullScreenLoading 
      message="Loading application..."
      size="xl"
      background="solid"
    />
  );
} 