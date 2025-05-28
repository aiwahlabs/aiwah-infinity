export interface ChatConversation {
  id: number;
  user_id: string;
  title: string | null;
  created_at: string;
  updated_at: string;
  is_archived: boolean;
  metadata: Record<string, any>;
}

export interface ChatMessage {
  id: number;
  conversation_id: number;
  role: 'user' | 'assistant' | 'system';
  content: string;
  thinking?: string;
  created_at: string;
  metadata: Record<string, any>;
}

export interface ChatFilter {
  search?: string;
  limit?: number;
  offset?: number;
}

export interface CreateConversationData {
  title?: string;
  metadata?: Record<string, any>;
}

export interface CreateMessageData {
  conversation_id: number;
  role: 'user' | 'assistant' | 'system';
  content: string;
  thinking?: string;
  metadata?: Record<string, any>;
} 