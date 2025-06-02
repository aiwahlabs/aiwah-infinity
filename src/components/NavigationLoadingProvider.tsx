'use client';

import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';

interface NavigationLoadingContextType {
  isNavigating: boolean;
}

const NavigationLoadingContext = createContext<NavigationLoadingContextType>({
  isNavigating: false,
});

export const useNavigationLoading = () => useContext(NavigationLoadingContext);

interface NavigationLoadingProviderProps {
  children: React.ReactNode;
}

export function NavigationLoadingProvider({ children }: NavigationLoadingProviderProps) {
  const [isNavigating, setIsNavigating] = useState(false);
  const pathname = usePathname();
  const previousPathnameRef = useRef<string>(pathname);
  const navigationTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Clear any existing timeout
    if (navigationTimeoutRef.current) {
      clearTimeout(navigationTimeoutRef.current);
    }

    // Check if pathname actually changed
    if (previousPathnameRef.current !== pathname) {
      // Start navigation loading
      setIsNavigating(true);
      
      // Set timeout to end navigation loading
      navigationTimeoutRef.current = setTimeout(() => {
        setIsNavigating(false);
        navigationTimeoutRef.current = null;
      }, 200);
    }
    
    // Update previous pathname
    previousPathnameRef.current = pathname;

    // Cleanup function
    return () => {
      if (navigationTimeoutRef.current) {
        clearTimeout(navigationTimeoutRef.current);
        navigationTimeoutRef.current = null;
      }
    };
  }, [pathname]);

  // Also cleanup on unmount
  useEffect(() => {
    return () => {
      if (navigationTimeoutRef.current) {
        clearTimeout(navigationTimeoutRef.current);
      }
    };
  }, []);

  return (
    <NavigationLoadingContext.Provider value={{ isNavigating }}>
      {children}
    </NavigationLoadingContext.Provider>
  );
} 