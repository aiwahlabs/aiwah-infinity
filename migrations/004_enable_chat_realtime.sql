-- Migration 004: Enable realtime for chat tables
-- Purpose: Enable real-time subscriptions for immediate message updates
-- Created: 2025-01-01 for real-time chat functionality

-- Enable realtime for chat tables
ALTER PUBLICATION supabase_realtime ADD TABLE chat_conversations;
ALTER PUBLICATION supabase_realtime ADD TABLE chat_messages; 