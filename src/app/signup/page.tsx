'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function SignUp() {
  const router = useRouter();
  
  useEffect(() => {
    // Redirect to login page since signup is not available
    router.push('/login');
  }, [router]);
  
  return null; // Don't render anything while redirecting
} 