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
  created_at: string;
  metadata?: {
    model?: string;
    tokens?: number;
    cost?: number;
    status_message?: string;
    [key: string]: unknown;
  };
  async_task_id?: number;
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
  metadata?: Record<string, unknown>;
}

export interface ChatResponse {
  content: string;
  model: string;
  usage?: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
  cost?: number;
} 