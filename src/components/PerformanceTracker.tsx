'use client';

import { useEffect } from 'react';
import { chatPerformanceTracker } from '@/lib/performance-tracker';

/**
 * Component to automatically initialize the performance tracker
 * Include this in your app layout to enable performance tracking
 */
export function PerformanceTracker() {
  useEffect(() => {
    // Initialize performance tracker
    console.log('🚀 Chat Performance Tracker initialized');
    console.log('📊 To track message latency:');
    console.log('   1. Run: window.chatPerf.startTracking()');
    console.log('   2. Send a message in chat');
    console.log('   3. Run: window.chatPerf.analyze()');
    console.log('');
    console.log('🔍 You can also view detailed logs by filtering console for "PERFORMANCE"');
    
    // Auto-start tracking in development
    if (process.env.NODE_ENV === 'development') {
      chatPerformanceTracker.startTracking();
    }
  }, []);

  return null;
} 