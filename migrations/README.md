# Database Migrations

This directory contains SQL migration files for setting up the chat functionality and async task system.

## Migration Overview

- **001_create_chat_tables.sql** - Original chat tables (conversations, messages)
- **002_create_async_tasks_table.sql** - Generic async task system for n8n workflows
- **003_link_chat_messages_to_tasks.sql** - Links chat messages to async processing tasks

## Setup Instructions

### 1. Run All Migrations

To set up the complete system, run these migrations in order:

1. Go to your Supabase Dashboard
2. Navigate to the SQL Editor
3. Run each migration file in sequence:
   - `001_create_chat_tables.sql`
   - `002_create_async_tasks_table.sql` 
   - `003_link_chat_messages_to_tasks.sql`

### 2. Verify the Setup

After running all migrations, you should have:

- `chat_conversations` table with proper RLS policies
- `chat_messages` table with proper RLS policies (now with `async_task_id`)
- `async_tasks` table for generic workflow processing
- Indexes for performance optimization
- Automatic `updated_at` timestamp updates
- Realtime enabled on `async_tasks` for live status updates

### 3. Test the Setup

You can test the setup by:

1. Creating a user account through the login page
2. Navigating to `/chat`
3. Creating a new conversation
4. Sending messages and receiving AI responses

## Tables Created

### chat_conversations
- `id` (BIGSERIAL PRIMARY KEY)
- `user_id` (UUID, references auth.users)
- `title` (TEXT)
- `created_at` (TIMESTAMPTZ)
- `updated_at` (TIMESTAMPTZ)
- `is_archived` (BOOLEAN)
- `metadata` (JSONB)

### chat_messages
- `id` (BIGSERIAL PRIMARY KEY)
- `conversation_id` (BIGINT, references chat_conversations)
- `role` (TEXT, 'user' or 'assistant')
- `content` (TEXT)
- `thinking` (TEXT)
- `created_at` (TIMESTAMPTZ)
- `metadata` (JSONB)
- `async_task_id` (BIGINT, references async_tasks) *NEW*

### async_tasks *(NEW - for n8n workflows)*
- `id` (BIGSERIAL PRIMARY KEY)
- `task_type` (VARCHAR, e.g. 'chat', 'email')
- `workflow_id` (VARCHAR, n8n workflow reference)
- `input_data` (JSONB, workflow input)
- `output_data` (JSONB, workflow results)
- `status` (VARCHAR, 'pending'|'processing'|'completed'|'failed'|'timeout')
- `current_step` (VARCHAR, workflow step name)
- `status_message` (TEXT, human-readable status)
- `n8n_execution_id` (VARCHAR, n8n tracking)
- `created_by` (UUID, references auth.users)
- `created_at` (TIMESTAMPTZ)
- `processing_started_at` (TIMESTAMPTZ)
- `processing_completed_at` (TIMESTAMPTZ)
- `error_details` (JSONB)
- `metadata` (JSONB)

## Security

Both tables have Row Level Security (RLS) enabled with policies that ensure:
- Users can only access their own conversations and messages
- Proper authentication is required for all operations
- Data isolation between users 