'use client';

import { ReactNode } from 'react';
import { AuthProvider as SaasAuthProvider } from '@saas-ui/auth';
import { createAuthService } from '@saas-ui/supabase';
import { supabaseBrowser } from '@/lib/supabase/browser';

interface AuthProviderProps {
  children: ReactNode;
}

// Internal provider that uses browser-specific APIs
function InternalAuthProvider({ children }: AuthProviderProps) {
  // Safe to use window here as this component will only be loaded on the client
  const origin = typeof window !== 'undefined' ? window.location.origin : '';
  
  const supabase = supabaseBrowser();
  const authService = createAuthService(supabase, {
    loginOptions: {
      redirectTo: `${origin}/auth/callback`,
    },
    signupOptions: {
      emailRedirectTo: `${origin}/auth/callback`,
    },
  });

  return <SaasAuthProvider {...authService}>{children}</SaasAuthProvider>;
}

// Public-facing component that ensures children are always rendered
export function AuthProvider({ children }: AuthProviderProps) {
  return (
    <InternalAuthProvider>{children}</InternalAuthProvider>
  );
} 