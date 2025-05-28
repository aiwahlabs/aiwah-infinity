'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback, useMemo } from 'react';
import { supabaseBrowser } from '@/lib/supabase/browser';
import { ChatConversation, ChatMessage, ChatFilter, CreateConversationData, CreateMessageData } from '../../app/chat/types';

interface ChatContextType {
  conversations: ChatConversation[];
  currentConversation: ChatConversation | null;
  messages: ChatMessage[];
  loading: boolean;
  error: string | null;
  filter: ChatFilter;
  totalCount: number;
  
  // Actions
  loadConversations: () => Promise<void>;
  loadMessages: (conversationId: number) => Promise<void>;
  createConversation: (data: CreateConversationData) => Promise<ChatConversation | null>;
  createMessage: (data: CreateMessageData) => Promise<ChatMessage | null>;
  deleteConversation: (id: number) => Promise<boolean>;
  setCurrentConversation: (conversation: ChatConversation | null) => void;
  updateFilter: (newFilter: Partial<ChatFilter>) => void;
  refreshConversations: () => Promise<void>;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export function ChatProvider({ children }: { children: ReactNode }) {
  const [conversations, setConversations] = useState<ChatConversation[]>([]);
  const [currentConversation, setCurrentConversation] = useState<ChatConversation | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [totalCount, setTotalCount] = useState(0);
  const [filter, setFilter] = useState<ChatFilter>({
    limit: 20,
    offset: 0
  });

  const supabase = useMemo(() => supabaseBrowser(), []);

  const loadConversations = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      let query = supabase
        .from('chat_conversations')
        .select('*', { count: 'exact' })
        .eq('is_archived', false)
        .order('updated_at', { ascending: false });

      if (filter.search) {
        query = query.ilike('title', `%${filter.search}%`);
      }

      if (filter.limit) {
        query = query.limit(filter.limit);
      }

      if (filter.offset) {
        query = query.range(filter.offset, filter.offset + (filter.limit || 20) - 1);
      }

      const { data, error: queryError, count } = await query;

      if (queryError) throw queryError;

      setConversations(data || []);
      setTotalCount(count || 0);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load conversations');
      console.error('Error loading conversations:', err);
    } finally {
      setLoading(false);
    }
  }, [filter.search, filter.limit, filter.offset, supabase]);

  const loadMessages = useCallback(async (conversationId: number) => {
    try {
      setLoading(true);
      setError(null);

      const { data, error: queryError } = await supabase
        .from('chat_messages')
        .select('*')
        .eq('conversation_id', conversationId)
        .order('created_at', { ascending: true });

      if (queryError) throw queryError;

      setMessages(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load messages');
      console.error('Error loading messages:', err);
    } finally {
      setLoading(false);
    }
  }, [supabase]);

  const createConversation = useCallback(async (data: CreateConversationData): Promise<ChatConversation | null> => {
    try {
      setError(null);

      const { data: user } = await supabase.auth.getUser();
      if (!user.user) throw new Error('User not authenticated');

      const conversationData = {
        user_id: user.user.id,
        title: data.title || 'New Conversation',
        metadata: data.metadata || {}
      };

      const { data: newConversation, error: insertError } = await supabase
        .from('chat_conversations')
        .insert(conversationData)
        .select()
        .single();

      if (insertError) throw insertError;

      // Update conversations list without full reload
      setConversations(prev => [newConversation, ...prev]);
      setTotalCount(prev => prev + 1);
      
      return newConversation;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create conversation');
      console.error('Error creating conversation:', err);
      return null;
    }
  }, [supabase]);

  const createMessage = useCallback(async (data: CreateMessageData): Promise<ChatMessage | null> => {
    try {
      setError(null);

      const { data: newMessage, error: insertError } = await supabase
        .from('chat_messages')
        .insert(data)
        .select()
        .single();

      if (insertError) {
        console.error('Supabase insert error:', insertError);
        throw new Error(`Failed to insert message: ${insertError.message || JSON.stringify(insertError)}`);
      }

      // Update messages list immediately without reload
      setMessages(prev => [...prev, newMessage]);

      // Update conversation's updated_at timestamp
      const updatedAt = new Date().toISOString();
      const { error: updateError } = await supabase
        .from('chat_conversations')
        .update({ updated_at: updatedAt })
        .eq('id', data.conversation_id);

      if (updateError) {
        console.warn('Failed to update conversation timestamp:', updateError);
        // Don't throw here as the message was created successfully
      }

      // Update the conversation in the list
      setConversations(prev => 
        prev.map(conv => 
          conv.id === data.conversation_id 
            ? { ...conv, updated_at: updatedAt }
            : conv
        ).sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime())
      );

      return newMessage;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : `Unknown error: ${JSON.stringify(err)}`;
      setError(errorMessage);
      console.error('Error creating message:', errorMessage, err);
      return null;
    }
  }, [supabase]);

  const deleteConversation = useCallback(async (id: number): Promise<boolean> => {
    try {
      setError(null);

      const { error: deleteError } = await supabase
        .from('chat_conversations')
        .delete()
        .eq('id', id);

      if (deleteError) throw deleteError;

      // Update state immediately
      setConversations(prev => prev.filter(conv => conv.id !== id));
      setTotalCount(prev => prev - 1);

      if (currentConversation?.id === id) {
        setCurrentConversation(null);
        setMessages([]);
      }

      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete conversation');
      console.error('Error deleting conversation:', err);
      return false;
    }
  }, [supabase, currentConversation?.id]);

  const updateFilter = useCallback((newFilter: Partial<ChatFilter>) => {
    setFilter(prev => ({ ...prev, ...newFilter }));
  }, []);

  const refreshConversations = useCallback(async () => {
    await loadConversations();
  }, [loadConversations]);

  // Load conversations on mount and when filter changes
  useEffect(() => {
    loadConversations();
  }, [loadConversations]);

  const value = useMemo<ChatContextType>(() => ({
    conversations,
    currentConversation,
    messages,
    loading,
    error,
    filter,
    totalCount,
    loadConversations,
    loadMessages,
    createConversation,
    createMessage,
    deleteConversation,
    setCurrentConversation,
    updateFilter,
    refreshConversations
  }), [
    conversations,
    currentConversation,
    messages,
    loading,
    error,
    filter,
    totalCount,
    loadConversations,
    loadMessages,
    createConversation,
    createMessage,
    deleteConversation,
    updateFilter,
    refreshConversations
  ]);

  return (
    <ChatContext.Provider value={value}>
      {children}
    </ChatContext.Provider>
  );
}

export function useChatContext() {
  const context = useContext(ChatContext);
  if (context === undefined) {
    throw new Error('useChatContext must be used within a ChatProvider');
  }
  return context;
} 