# Database Migrations

This directory contains SQL migration files for setting up the chat functionality.

## Setup Instructions

### 1. Run the Chat Tables Migration

To set up the chat functionality, you need to run the SQL migration in your Supabase database:

1. Go to your Supabase Dashboard
2. Navigate to the SQL Editor
3. Copy and paste the contents of `001_create_chat_tables.sql`
4. Run the SQL script

### 2. Verify the Setup

After running the migration, you should have:

- `chat_conversations` table with proper RLS policies
- `chat_messages` table with proper RLS policies
- Indexes for performance optimization
- Automatic `updated_at` timestamp updates

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
- `created_at` (TIMESTAMPTZ)
- `metadata` (JSONB)

## Security

Both tables have Row Level Security (RLS) enabled with policies that ensure:
- Users can only access their own conversations and messages
- Proper authentication is required for all operations
- Data isolation between users 