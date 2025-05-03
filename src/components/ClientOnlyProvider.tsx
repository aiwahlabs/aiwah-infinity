'use client';

import { ReactNode, useEffect, useState } from 'react';
import { LoadingScreen } from './LoadingScreen';

interface ClientOnlyProps {
  children: ReactNode;
  fallback?: ReactNode;
}

export function ClientOnly({ children, fallback }: ClientOnlyProps) {
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    // Use requestAnimationFrame to ensure we're fully in the client
    // This helps avoid hydration mismatches with Chakra UI
    const animationFrameId = requestAnimationFrame(() => {
      setHasMounted(true);
    });

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  if (!hasMounted) {
    return fallback ? <>{fallback}</> : <LoadingScreen />;
  }

  return <>{children}</>;
} 