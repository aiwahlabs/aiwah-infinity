'use client';

import { useState, useEffect, useCallback } from 'react';
import { supabaseBrowser } from '@/lib/supabase/browser';
import { DocumentStats, DocumentStatus } from './types';

interface StatusCount {
  status: string;
  count: number;
}

interface TypeCount {
  type: string;
  count: number;
}

export function useDocumentStats() {
  const [stats, setStats] = useState<DocumentStats>({
    total: 0,
    byStatus: {
      draft: 0,
      approved: 0,
      rejected: 0,
      published: 0,
      'word-limit': 0
    },
    byType: {}
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchStats = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const supabase = supabaseBrowser();
      
      // Get total count
      const { count: totalCount, error: totalError } = await supabase
        .from('documents')
        .select('*', { count: 'exact', head: true });
      
      if (totalError) throw totalError;
      
      // Get counts by status
      const { data: statusData, error: statusError } = await supabase
        .rpc('get_document_counts_by_status') as { data: StatusCount[] | null, error: any };
      
      if (statusError) throw statusError;
      
      // Get counts by type
      const { data: typeData, error: typeError } = await supabase
        .rpc('get_document_counts_by_type') as { data: TypeCount[] | null, error: any };
      
      if (typeError) throw typeError;
      
      // Process status counts
      const statusCounts: Record<DocumentStatus, number> = {
        draft: 0,
        approved: 0,
        rejected: 0,
        published: 0,
        'word-limit': 0
      };
      
      statusData?.forEach((item: StatusCount) => {
        if (item.status && item.count) {
          statusCounts[item.status as DocumentStatus] = item.count;
        }
      });
      
      // Process type counts
      const typeCounts: Record<string, number> = {};
      
      typeData?.forEach((item: TypeCount) => {
        if (item.type && item.count) {
          typeCounts[item.type] = item.count;
        }
      });
      
      setStats({
        total: totalCount || 0,
        byStatus: statusCounts,
        byType: typeCounts
      });
      
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch document stats'));
      console.error('Error fetching document stats:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  return {
    stats,
    loading,
    error,
    refetch: fetchStats
  };
} 