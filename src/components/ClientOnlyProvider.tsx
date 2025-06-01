'use client';

import { ReactNode, useEffect, useState } from 'react';

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

  // For root layout usage, we need to always render children to prevent routing issues
  // The mounting check is just for avoiding hydration mismatches, not for loading states
  if (!hasMounted) {
    return fallback ? <>{fallback}</> : <>{children}</>;
  }

  return <>{children}</>;
} 