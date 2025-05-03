/* eslint-disable @typescript-eslint/no-explicit-any */
export type DocumentStatus = 'draft' | 'approved' | 'rejected' | 'published' | 'word-limit';
export type DocumentType = 'test' | 'aiwah-content-test' | string;

export interface Document {
  id: number;
  title: string | null;
  content: string;
  tags: any | null;
  created_at: string;
  updated_at: string;
  type: DocumentType | null;
  status: DocumentStatus | null;
  user_comments: string | null;
  notes: string | null;
  posted_on: string | null;
}

export interface DocumentFilter {
  status?: DocumentStatus;
  type?: DocumentType;
  search?: string;
  limit?: number;
  offset?: number;
  sortBy?: 'created_at' | 'updated_at' | 'title';
  sortOrder?: 'asc' | 'desc';
}

export interface DocumentStats {
  total: number;
  byStatus: Record<DocumentStatus, number>;
  byType: Record<string, number>;
}

export interface DocumentCreate {
  title?: string;
  content: string;
  tags?: any;
  type?: DocumentType;
  status?: DocumentStatus;
  user_comments?: string;
  notes?: string;
}

export interface DocumentUpdate {
  id: number;
  title?: string;
  content?: string;
  tags?: any;
  type?: DocumentType;
  status?: DocumentStatus;
  user_comments?: string;
  notes?: string;
  posted_on?: string | null;
} 