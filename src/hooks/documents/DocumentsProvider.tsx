'use client';

import React, { createContext, useContext, ReactNode, useState, useEffect } from 'react';
import { useDocuments } from './useDocuments';
import { useDocumentStats } from './useDocumentStats';
import { useDocumentOperations } from './useDocumentOperations';
import { Document, DocumentFilter, DocumentCreate, DocumentUpdate, DocumentStats } from './types';

interface DocumentsContextType {
  // Document list state
  documents: Document[];
  loading: boolean;
  error: Error | null;
  totalCount: number;
  
  // Filtering
  filter: DocumentFilter;
  updateFilter: (newFilter: Partial<DocumentFilter>) => void;
  
  // Stats
  stats: DocumentStats;
  statsLoading: boolean;
  statsError: Error | null;
  
  // CRUD operations
  operationsLoading: boolean;
  operationsError: Error | null;
  createDocument: (document: DocumentCreate) => Promise<Document | null>;
  getDocument: (id: number) => Promise<Document | null>;
  updateDocument: (document: DocumentUpdate) => Promise<Document | null>;
  deleteDocument: (id: number) => Promise<boolean>;
  updateDocumentStatus: (id: number, status: string) => Promise<Document | null>;
  
  // Refresh functions
  refreshDocuments: () => Promise<void>;
  refreshStats: () => Promise<void>;
}

const DocumentsContext = createContext<DocumentsContextType | undefined>(undefined);

export function DocumentsProvider({ children, initialFilter }: { children: ReactNode, initialFilter?: DocumentFilter }) {
  const {
    documents,
    loading,
    error,
    totalCount,
    filter,
    updateFilter,
    refetch: refreshDocuments
  } = useDocuments(initialFilter);
  
  const {
    stats,
    loading: statsLoading,
    error: statsError,
    refetch: refreshStats
  } = useDocumentStats();
  
  const {
    loading: operationsLoading,
    error: operationsError,
    createDocument,
    getDocument,
    updateDocument,
    deleteDocument,
    updateDocumentStatus
  } = useDocumentOperations();
  
  const value = {
    // Document list state
    documents,
    loading,
    error,
    totalCount,
    
    // Filtering
    filter,
    updateFilter,
    
    // Stats
    stats,
    statsLoading,
    statsError,
    
    // CRUD operations
    operationsLoading,
    operationsError,
    createDocument,
    getDocument,
    updateDocument,
    deleteDocument,
    updateDocumentStatus,
    
    // Refresh functions
    refreshDocuments,
    refreshStats
  };
  
  return (
    <DocumentsContext.Provider value={value}>
      {children}
    </DocumentsContext.Provider>
  );
}

export function useDocumentsContext() {
  const context = useContext(DocumentsContext);
  if (context === undefined) {
    throw new Error('useDocumentsContext must be used within a DocumentsProvider');
  }
  return context;
} 