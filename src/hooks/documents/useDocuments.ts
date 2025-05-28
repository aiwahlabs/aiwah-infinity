'use client';

import { useState, useEffect, useCallback } from 'react';
import { supabaseBrowser } from '@/lib/supabase/browser';
import { Document, DocumentFilter } from './types';

/**
 * Custom hook for fetching and managing documents from Supabase.
 *
 * @param {DocumentFilter} [initialFilter={}] - Optional initial filter to apply when fetching documents.
 * @returns {object} An object containing:
 *  - `documents`: An array of fetched documents.
 *  - `loading`: A boolean indicating if documents are currently being fetched.
 *  - `error`: An error object if fetching failed, otherwise null.
 *  - `totalCount`: The total number of documents matching the current filter (ignoring pagination).
 *  - `filter`: The current filter object.
 *  - `updateFilter`: A function to update the filter and refetch documents.
 *  - `refetch`: A function to manually refetch documents with the current filter.
 */
export function useDocuments(initialFilter?: DocumentFilter) {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [filter, setFilter] = useState<DocumentFilter>(initialFilter || {});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [totalCount, setTotalCount] = useState(0);

  // Callback function to fetch documents from Supabase based on the current filter.
  const fetchDocuments = useCallback(async (currentFilter: DocumentFilter = filter) => {
    try {
      setLoading(true);
      setError(null);

      const supabase = supabaseBrowser();
      let query = supabase
        .from('documents')
        .select('*', { count: 'exact' }); // Also fetch the total count

      // Apply filtering conditions based on `currentFilter`
      if (currentFilter.status) {
        query = query.eq('status', currentFilter.status);
      }

      if (currentFilter.type) {
        query = query.eq('type', currentFilter.type);
      }

      if (currentFilter.search) {
        // Search across title and content fields
        query = query.or(`title.ilike.%${currentFilter.search}%,content.ilike.%${currentFilter.search}%`);
      }

      // Apply sorting
      const sortBy = currentFilter.sortBy || 'created_at'; // Default sort by creation date
      const sortOrder = currentFilter.sortOrder || 'desc'; // Default sort order descending
      query = query.order(sortBy, { ascending: sortOrder === 'asc' });

      // Apply pagination
      if (currentFilter.limit) {
        query = query.limit(currentFilter.limit);
      }

      if (currentFilter.offset) {
        const effectiveLimit = currentFilter.limit || 10; // Default to 10 if limit is not provided for range calculation
        query = query.range(
          currentFilter.offset,
          currentFilter.offset + effectiveLimit - 1
        );
      }

      // Execute the query
      const { data, error: queryError, count } = await query;

      if (queryError) {
        // Handle query error
        throw queryError;
      }

      setDocuments(data as Document[]);
      if (count !== null) {
        setTotalCount(count); // Set the total count of documents matching the filter
      }
    } catch (err) {
      // Handle any errors during the fetch process
      const fetchError = err instanceof Error ? err : new Error('Failed to fetch documents');
      setError(fetchError);
      console.error('Error fetching documents:', fetchError);
    } finally {
      setLoading(false); // Ensure loading is set to false after operation completes
    }
  }, [filter]); // Dependencies: re-create fetchDocuments if `filter` object reference changes (should be stable due to how `updateFilter` works)

  // useEffect hook to fetch documents when the component mounts or when `fetchDocuments` callback changes.
  // `fetchDocuments` changes if its dependency `filter` changes, ensuring data is refetched.
  useEffect(() => {
    fetchDocuments();
  }, [fetchDocuments]); // `fetchDocuments` is memoized by useCallback and only changes if `filter` changes.

  // Callback to update parts of the filter and then trigger a refetch of documents.
  const updateFilter = useCallback((newFilter: Partial<DocumentFilter>) => {
    // Merge new filter properties with the existing filter
    const updatedFilter = { ...filter, ...newFilter };
    setFilter(updatedFilter); // Update the state with the new filter
    // fetchDocuments(updatedFilter); // Directly call fetchDocuments with the new filter to avoid waiting for state update to propagate
    // Note: The above line is commented out because `useEffect` listening to `fetchDocuments` (which depends on `filter`) will trigger the refetch.
    // However, if immediate refetch is desired without waiting for the effect, it can be called directly.
    // The current setup relies on the useEffect dependency chain.
  }, [filter, fetchDocuments]); // Depends on the current `filter` and the `fetchDocuments` callback.

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