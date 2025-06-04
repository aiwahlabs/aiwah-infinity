-- Migration 003: Link chat messages to async tasks
-- Purpose: Connect chat messages with their async processing tasks
-- Created: 2025-01-01 for n8n integration

-- Add async_task_id column to chat_messages
ALTER TABLE chat_messages
    ADD COLUMN IF NOT EXISTS async_task_id BIGINT REFERENCES async_tasks(id) ON DELETE SET NULL;

-- Create index for joining
CREATE INDEX IF NOT EXISTS idx_chat_messages_task ON chat_messages(async_task_id);

-- Add comment for clarity
COMMENT ON COLUMN chat_messages.async_task_id IS 'Links chat message to its async processing task (for AI responses)'; 