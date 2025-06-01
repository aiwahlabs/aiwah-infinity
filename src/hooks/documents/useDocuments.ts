'use client';

import { useState, useEffect, useCallback } from 'react';
import { supabaseBrowser } from '@/lib/supabase/browser';
import { Document, DocumentFilter } from './types';

export function useDocuments(initialFilter?: DocumentFilter) {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [filter, setFilter] = useState<DocumentFilter>(initialFilter || {});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [totalCount, setTotalCount] = useState(0);
  
  const fetchDocuments = useCallback(async (currentFilter: DocumentFilter = filter) => {
    try {
      setLoading(true);
      setError(null);
      
      const supabase = supabaseBrowser();
      let query = supabase
        .from('documents')
        .select('*', { count: 'exact' });
      
      // Apply filters
      if (currentFilter.status) {
        query = query.eq('status', currentFilter.status);
      }
      
      if (currentFilter.type) {
        query = query.eq('type', currentFilter.type);
      }
      
      if (currentFilter.search) {
        query = query.or(`title.ilike.%${currentFilter.search}%,content.ilike.%${currentFilter.search}%`);
      }
      
      // Apply sorting
      const sortBy = currentFilter.sortBy || 'created_at';
      const sortOrder = currentFilter.sortOrder || 'desc';
      query = query.order(sortBy, { ascending: sortOrder === 'asc' });
      
      // Apply pagination
      if (currentFilter.limit) {
        query = query.limit(currentFilter.limit);
      }
      
      if (currentFilter.offset) {
        query = query.range(
          currentFilter.offset, 
          currentFilter.offset + (currentFilter.limit || 10) - 1
        );
      }
      
      const { data, error, count } = await query;
      
      if (error) throw error;
      
      setDocuments(data as Document[]);
      if (count !== null) setTotalCount(count);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch documents'));
      console.error('Error fetching documents:', err);
    } finally {
      setLoading(false);
    }
  }, [filter]);
  
  // Fetch documents when the component mounts or filter changes
  useEffect(() => {
    fetchDocuments();
  }, [fetchDocuments]);
  
  // Update filter and refetch
  const updateFilter = useCallback((newFilter: Partial<DocumentFilter>) => {
    const updatedFilter = { ...filter, ...newFilter };
    setFilter(updatedFilter);
    fetchDocuments(updatedFilter);
  }, [filter, fetchDocuments]);
  
  return {
    documents,
    loading,
    error,
    totalCount,
    filter,
    updateFilter,
    refetch: fetchDocuments
  };
} 