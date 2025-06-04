'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback, useMemo } from 'react';
import { supabaseBrowser } from '@/lib/supabase/browser';
import { ChatConversation, ChatMessage, ChatFilter, CreateConversationData, CreateMessageData } from '../../app/chat/types';
import { logger } from '@/lib/logger';

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
  updateConversation: (id: number, updates: Partial<ChatConversation>) => Promise<boolean>;
  deleteConversation: (id: number) => Promise<boolean>;
  deleteMessage: (messageId: number) => Promise<boolean>;
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
      console.log('Loading conversations...');
      setLoading(true);
      setError(null);

      // Get the current user
      const { data: user, error: userError } = await supabase.auth.getUser();
      console.log('User data:', user, 'User error:', userError);
      
      if (userError) {
        console.error('Auth error:', userError);
        setError(`Authentication error: ${userError.message}`);
        setLoading(false);
        return;
      }
      
      if (!user.user) {
        console.log('No user found, user not authenticated');
        setError('Please log in to access your conversations');
        setLoading(false);
        return;
      }

      console.log('User authenticated, loading conversations for user:', user.user.id);

      let query = supabase
        .from('chat_conversations')
        .select('*', { count: 'exact' })
        .eq('user_id', user.user.id) // Filter by current user
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

      console.log('Executing query...');
      const { data, error: queryError, count } = await query;
      console.log('Query result:', { data, queryError, count });

      if (queryError) {
        console.error('Query error:', queryError);
        if (queryError.code === 'PGRST116') {
          setError('Database table not found. Please check your database setup.');
        } else {
          setError(`Database error: ${queryError.message}`);
        }
        setLoading(false);
        return;
      }

      console.log('Successfully loaded conversations:', data?.length || 0);
      setConversations(data || []);
      setTotalCount(count || 0);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load conversations';
      console.error('Error loading conversations:', err);
      setError(errorMessage);
    } finally {
      console.log('Setting loading to false');
      setLoading(false);
    }
  }, [filter.search, filter.limit, filter.offset, supabase]);

  const loadMessages = useCallback(async (conversationId: number) => {
    try {
      // Don't set global loading for messages, only for conversations
      setError(null);

      const { data, error: queryError } = await supabase
        .from('chat_messages')
        .select('*')
        .eq('conversation_id', conversationId)
        .order('created_at', { ascending: true });

      if (queryError) {
        console.error('Error loading messages:', queryError);
        setError(`Failed to load messages: ${queryError.message}`);
        return;
      }

      setMessages(data || []);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load messages';
      setError(errorMessage);
      console.error('Error loading messages:', err);
    }
  }, [supabase]);

  // Subscribe to real-time message updates for the current conversation
  useEffect(() => {
    if (!currentConversation?.id) return;

    const messagesChannel = supabase
      .channel(`chat_messages_${currentConversation.id}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'chat_messages',
          filter: `conversation_id=eq.${currentConversation.id}`
        },
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (payload: any) => {
          logger.chat('useChatContext', 'Realtime message update received', payload);
          console.log('Message real-time update:', payload);
          
          if (payload.eventType === 'INSERT') {
            // Add new message
            const newMessage = payload.new as ChatMessage;
            logger.chat('useChatContext', 'Processing INSERT event', { newMessage });
            setMessages(prev => {
              // Avoid duplicates
              if (prev.some(msg => msg.id === newMessage.id)) {
                logger.chat('useChatContext', 'Duplicate message, skipping', { messageId: newMessage.id });
                return prev;
              }
              logger.chat('useChatContext', 'Adding new message to state', { messageId: newMessage.id, totalMessages: prev.length + 1 });
              return [...prev, newMessage];
            });
          } else if (payload.eventType === 'UPDATE') {
            // Update existing message
            const updatedMessage = payload.new as ChatMessage;
            logger.chat('useChatContext', 'Processing UPDATE event', { updatedMessage });
            setMessages(prev => 
              prev.map(msg => 
                msg.id === updatedMessage.id ? updatedMessage : msg
              )
            );
          } else if (payload.eventType === 'DELETE') {
            // Remove deleted message
            const deletedMessage = payload.old as ChatMessage;
            logger.chat('useChatContext', 'Processing DELETE event', { deletedMessage });
            setMessages(prev => 
              prev.filter(msg => msg.id !== deletedMessage.id)
            );
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(messagesChannel);
    };
  }, [currentConversation?.id, supabase]);

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

  const updateConversation = useCallback(async (id: number, updates: Partial<ChatConversation>): Promise<boolean> => {
    try {
      setError(null);

      const { error: updateError } = await supabase
        .from('chat_conversations')
        .update(updates)
        .eq('id', id);

      if (updateError) throw updateError;

      // Update state immediately
      setConversations(prev => prev.map(conv => conv.id === id ? { ...conv, ...updates } : conv));

      // Also update currentConversation if it's the one being updated
      if (currentConversation?.id === id) {
        setCurrentConversation(prev => prev ? { ...prev, ...updates } : prev);
      }

      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update conversation');
      console.error('Error updating conversation:', err);
      return false;
    }
  }, [supabase, currentConversation?.id]);

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

  const deleteMessage = useCallback(async (messageId: number): Promise<boolean> => {
    try {
      setError(null);

      const { error: deleteError } = await supabase
        .from('chat_messages')
        .delete()
        .eq('id', messageId);

      if (deleteError) throw deleteError;

      // Update messages list immediately without reload
      setMessages(prev => prev.filter(message => message.id !== messageId));

      // Update conversation's updated_at timestamp
      const updatedAt = new Date().toISOString();
      const { error: updateError } = await supabase
        .from('chat_conversations')
        .update({ updated_at: updatedAt })
        .eq('id', currentConversation?.id);

      if (updateError) {
        console.warn('Failed to update conversation timestamp:', updateError);
        // Don't throw here as the message was deleted successfully
      }

      // Update the conversation in the list
      setConversations(prev => 
        prev.map(conv => 
          conv.id === currentConversation?.id 
            ? { ...conv, updated_at: updatedAt }
            : conv
        ).sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime())
      );

      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : `Unknown error: ${JSON.stringify(err)}`;
      setError(errorMessage);
      console.error('Error deleting message:', errorMessage, err);
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
    updateConversation,
    deleteConversation,
    deleteMessage,
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
    updateConversation,
    deleteConversation,
    deleteMessage,
    setCurrentConversation,
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