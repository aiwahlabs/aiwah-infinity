'use client';

import { useState, useCallback } from 'react';
import { supabaseBrowser } from '@/lib/supabase/browser';
import { Document, DocumentCreate, DocumentUpdate } from './types';

export function useDocumentOperations() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  
  // Create a new document
  const createDocument = useCallback(async (document: DocumentCreate): Promise<Document | null> => {
    try {
      setLoading(true);
      setError(null);
      
      const supabase = supabaseBrowser();
      const { data, error } = await supabase
        .from('documents')
        .insert({
          ...document,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .select()
        .single();
      
      if (error) throw error;
      
      return data as Document;
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to create document'));
      console.error('Error creating document:', err);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);
  
  // Retrieve a document by ID
  const getDocument = useCallback(async (id: number): Promise<Document | null> => {
    try {
      setLoading(true);
      setError(null);
      
      const supabase = supabaseBrowser();
      const { data, error } = await supabase
        .from('documents')
        .select('*')
        .eq('id', id)
        .single();
      
      if (error) throw error;
      
      return data as Document;
    } catch (err) {
      setError(err instanceof Error ? err : new Error(`Failed to get document with ID ${id}`));
      console.error(`Error getting document with ID ${id}:`, err);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);
  
  // Update a document
  const updateDocument = useCallback(async (document: DocumentUpdate): Promise<Document | null> => {
    try {
      setLoading(true);
      setError(null);
      
      const supabase = supabaseBrowser();
      const { data, error } = await supabase
        .from('documents')
        .update({
          ...document,
          updated_at: new Date().toISOString()
        })
        .eq('id', document.id)
        .select()
        .single();
      
      if (error) throw error;
      
      return data as Document;
    } catch (err) {
      setError(err instanceof Error ? err : new Error(`Failed to update document with ID ${document.id}`));
      console.error(`Error updating document with ID ${document.id}:`, err);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);
  
  // Delete a document
  const deleteDocument = useCallback(async (id: number): Promise<boolean> => {
    try {
      setLoading(true);
      setError(null);
      
      const supabase = supabaseBrowser();
      const { error } = await supabase
        .from('documents')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      return true;
    } catch (err) {
      setError(err instanceof Error ? err : new Error(`Failed to delete document with ID ${id}`));
      console.error(`Error deleting document with ID ${id}:`, err);
      return false;
    } finally {
      setLoading(false);
    }
  }, []);
  
  // Update document status
  const updateDocumentStatus = useCallback(async (id: number, status: string): Promise<Document | null> => {
    try {
      setLoading(true);
      setError(null);
      
      const supabase = supabaseBrowser();
      const { data, error } = await supabase
        .from('documents')
        .update({ 
          status, 
          updated_at: new Date().toISOString() 
        })
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      
      return data as Document;
    } catch (err) {
      setError(err instanceof Error ? err : new Error(`Failed to update status for document with ID ${id}`));
      console.error(`Error updating status for document with ID ${id}:`, err);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);
  
  return {
    loading,
    error,
    createDocument,
    getDocument,
    updateDocument,
    deleteDocument,
    updateDocumentStatus
  };
} 