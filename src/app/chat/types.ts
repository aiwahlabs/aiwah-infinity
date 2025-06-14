export interface ChatConversation {
  id: number;
  user_id: string;
  title: string | null;
  created_at: string;
  updated_at: string;
  is_archived: boolean;
  metadata: Record<string, unknown>;
}

export interface ChatMessage {
  id: number;
  conversation_id: number;
  role: 'user' | 'assistant' | 'system';
  content: string;
  thinking?: string;
  created_at: string;
  metadata: Record<string, unknown>;
  async_task_id?: number; // For linking to async processing tasks
}

export interface ChatFilter {
  search?: string;
  limit?: number;
  offset?: number;
}

export interface CreateConversationData {
  title?: string;
  metadata?: Record<string, unknown>;
}

export interface CreateMessageData {
  conversation_id: number;
  role: 'user' | 'assistant' | 'system';
  content: string;
  thinking?: string;
  metadata?: Record<string, unknown>;
} 