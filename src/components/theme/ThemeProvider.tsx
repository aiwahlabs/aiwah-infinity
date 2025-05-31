'use client';

import React, { ReactNode, useEffect } from 'react';
import { SaasProvider } from '@saas-ui/react';
import { 
  ColorModeScript, 
  ChakraProvider, 
  useColorMode
} from '@chakra-ui/react';
import { theme } from './theme';

// Force dark mode component
function ForceDarkMode({ children }: { children: ReactNode }) {
  const { setColorMode } = useColorMode();
  
  useEffect(() => {
    setColorMode('dark');
  }, [setColorMode]);
  
  return <>{children}</>;
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  return (
    <>
      <ColorModeScript initialColorMode={theme.config.initialColorMode} />
      <ChakraProvider theme={theme} resetCSS>
        <ForceDarkMode>
          <SaasProvider theme={theme}>
            {children}
          </SaasProvider>
        </ForceDarkMode>
      </ChakraProvider>
    </>
  );
} 