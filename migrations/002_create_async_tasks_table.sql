-- Migration 002: Create async task system for n8n workflows
-- Purpose: Generic async task processing with real-time status updates
-- Created: 2025-01-01 for n8n integration

-- Create async_tasks table (generic for any automation type)
CREATE TABLE IF NOT EXISTS async_tasks (
    id BIGSERIAL PRIMARY KEY,
    task_type VARCHAR(50) NOT NULL,     -- 'chat', 'email', 'data_import', etc.
    workflow_id VARCHAR(100),           -- n8n workflow reference ID
    input_data JSONB NOT NULL,          -- domain-specific input payload
    output_data JSONB DEFAULT '{}',     -- domain-specific output results
    status VARCHAR(20) DEFAULT 'pending'
        CHECK (status IN ('pending','processing','completed','failed','cancelled','timeout')),
    current_step VARCHAR(50),           -- 'initializing', 'calling_ai', 'saving_response', etc.
    status_message TEXT,                -- 'AI is thinking about your request...'
    n8n_execution_id VARCHAR(255),      -- n8n workflow execution tracking
    created_by UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    processing_started_at TIMESTAMPTZ,
    processing_completed_at TIMESTAMPTZ,
    error_details JSONB,
    metadata JSONB DEFAULT '{}'         -- additional tracking data
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_async_tasks_type ON async_tasks(task_type);
CREATE INDEX IF NOT EXISTS idx_async_tasks_status ON async_tasks(status);
CREATE INDEX IF NOT EXISTS idx_async_tasks_user ON async_tasks(created_by);
CREATE INDEX IF NOT EXISTS idx_async_tasks_n8n_exec ON async_tasks(n8n_execution_id);
CREATE INDEX IF NOT EXISTS idx_async_tasks_processing ON async_tasks(processing_started_at) 
    WHERE status IN ('pending', 'processing');

-- Enable Row Level Security (RLS)
ALTER TABLE async_tasks ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for async_tasks
CREATE POLICY "Users can view their own tasks" ON async_tasks
    FOR SELECT USING (created_by = auth.uid());

CREATE POLICY "Users can insert their own tasks" ON async_tasks
    FOR INSERT WITH CHECK (created_by = auth.uid());

CREATE POLICY "Users can update their own tasks" ON async_tasks
    FOR UPDATE USING (created_by = auth.uid());

CREATE POLICY "Users can delete their own tasks" ON async_tasks
    FOR DELETE USING (created_by = auth.uid());

-- Enable realtime for live status updates
ALTER PUBLICATION supabase_realtime ADD TABLE async_tasks; 