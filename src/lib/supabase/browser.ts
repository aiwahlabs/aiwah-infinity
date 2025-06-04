import { createBrowserClient } from '@supabase/ssr';

const logger = {
  info: (message: string, data?: unknown) => {
    if (process.env.NEXT_PUBLIC_DEBUG_MODE === 'on') {
      console.log(`[SUPABASE-BROWSER] ${message}`, data || '');
    }
  },
  error: (message: string, error?: Error | unknown) => {
    if (process.env.NEXT_PUBLIC_DEBUG_MODE === 'on') {
      console.error(`[SUPABASE-BROWSER-ERROR] ${message}`, error || '');
    }
  },
  warn: (message: string, data?: unknown) => {
    if (process.env.NEXT_PUBLIC_DEBUG_MODE === 'on') {
      console.warn(`[SUPABASE-BROWSER-WARN] ${message}`, data || '');
    }
  }
};

export function supabaseBrowser() {
  try {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    logger.info('Creating Supabase browser client', {
      hasUrl: !!url,
      hasKey: !!key,
      environment: process.env.NODE_ENV
    });

    if (!url) {
      const error = new Error('NEXT_PUBLIC_SUPABASE_URL is not defined');
      logger.error('Missing Supabase URL', error);
      throw error;
    }

    if (!key) {
      const error = new Error('NEXT_PUBLIC_SUPABASE_ANON_KEY is not defined');
      logger.error('Missing Supabase anonymous key', error);
      throw error;
    }

    // Validate URL format
    try {
      new URL(url);
    } catch {
      const error = new Error(`Invalid Supabase URL format: ${url}`);
      logger.error('Invalid URL format', error);
      throw error;
    }

    const client = createBrowserClient(url, key);
    
    logger.info('Supabase browser client created successfully');
    
    return client;
  } catch (error: unknown) {
    logger.error('Failed to create Supabase browser client', error);
    throw error;
  }
} 