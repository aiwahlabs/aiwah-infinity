# n8n Integration Plan: Async Task System ✅ EXECUTION READY

> **Version:** 2025-06-01-DETAILED — General async automation platform with chat as first use case

---

## 1 │ Executive Summary

Build a **general-purpose async task system** powered by **n8n workflows** that can handle any type of automation. Chat processing is the **first use case** to validate the architecture, with the system designed to support:

* ✅ **Any automation type** - chat, email, data processing, reports, etc.
* ✅ **Async task processing** with descriptive real-time status updates  
* ✅ **Multiple n8n workflows** - one per automation type
* ✅ **Config-based workflow management** - simple and version controlled
* ✅ **Domain-specific frontends** that plug into the generic system
* ✅ **Horizontal scaling** without frontend changes

---

## 2 │ Current State Analysis ✅

### 2.1 Existing Database Schema
```sql
-- VERIFIED: Current chat-specific tables
chat_conversations (id, user_id, title, created_at, updated_at, is_archived, metadata)
chat_messages (id, conversation_id, role, content, created_at, metadata, thinking)

-- VERIFIED: Database constraints
- chat_conversations.user_id → auth.users.id
- chat_messages.conversation_id → chat_conversations.id
- RLS enabled on both tables
```

### 2.2 Current Chat Implementation
- **Frontend:** Next.js + Chakra UI with streaming hooks (`useChatStream`)
- **Database:** Supabase PostgreSQL (Project: rozmxiysbvsnzfoytjly)
- **LLM Integration:** OpenRouter with real-time streaming
- **Architecture:** Direct API call → OpenRouter → Streaming response

### 2.3 Supabase Configuration ✅
```bash
NEXT_PUBLIC_SUPABASE_URL=https://rozmxiysbvsnzfoytjly.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

---

## 3 │ Target Architecture (Generic + Extensible)

```
Any App Feature → Generic Task API
       │
           async_tasks Table (generic)
                      │
         Config-based Workflow Routing
                      │
    Specific n8n Workflows (chat, email, data, etc.)
                      │
         Status Updates → Supabase Realtime
                      │
      Domain-Specific Frontend Components
```

### 3.1 Supported Task Types (Current + Future)

| Task Type | Description | Status |
|-----------|-------------|---------|
| **chat** | AI conversation processing | 🎯 **First Implementation** |
| **email** | Campaign sending & tracking | 🔄 **Future** |
| **data_import** | CSV/API data processing | 🔄 **Future** |
| **report_generation** | Analytics & PDF creation | 🔄 **Future** |
| **image_processing** | AI analysis & transformations | 🔄 **Future** |
| **notification_broadcast** | Multi-channel alerts | 🔄 **Future** |

---

## 4 │ Database Schema Migration ✅ READY

### 4.1 New Generic `async_tasks` Table
```sql
-- MIGRATION 1: Create generic async task system
CREATE TABLE async_tasks (
  id BIGSERIAL PRIMARY KEY,
  task_type VARCHAR(50) NOT NULL,     -- 'chat', 'email', 'data_import', etc.
  workflow_id VARCHAR(100),           -- n8n workflow reference ID
  input_data JSONB NOT NULL,          -- domain-specific input payload
  output_data JSONB DEFAULT '{}',     -- domain-specific output results
  status VARCHAR(20) DEFAULT 'pending'
    CHECK (status IN ('pending','processing','completed','failed','cancelled','timeout')),
  current_step VARCHAR(50),           -- 'initializing', 'calling_ai', 'saving_response', etc.
  status_message TEXT,                -- 'AI is thinking about your request...'
  n8n_execution_id VARCHAR(255),
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  processing_started_at TIMESTAMPTZ,
  processing_completed_at TIMESTAMPTZ,
  error_details JSONB,
  metadata JSONB DEFAULT '{}'         -- additional tracking data
);

-- INDEXES for performance
CREATE INDEX idx_async_tasks_type ON async_tasks(task_type);
CREATE INDEX idx_async_tasks_status ON async_tasks(status);
CREATE INDEX idx_async_tasks_user ON async_tasks(created_by);
CREATE INDEX idx_async_tasks_n8n_exec ON async_tasks(n8n_execution_id);
CREATE INDEX idx_async_tasks_processing ON async_tasks(processing_started_at) 
  WHERE status IN ('pending', 'processing');

-- RLS Policy
ALTER TABLE async_tasks ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can access their own tasks" ON async_tasks 
  FOR ALL USING (created_by = auth.uid());
```

### 4.2 Updated `chat_messages` Table (Links to Tasks)
```sql
-- MIGRATION 2: Link chat messages to async tasks
ALTER TABLE chat_messages
  ADD COLUMN async_task_id BIGINT REFERENCES async_tasks(id) ON DELETE SET NULL;

-- Index for joining
CREATE INDEX idx_chat_messages_task ON chat_messages(async_task_id);
```

### 4.3 Task Event Logging (Optional)
```sql
-- MIGRATION 3: Generic task event logging (optional for detailed tracking)
CREATE TABLE task_events (
  id BIGSERIAL PRIMARY KEY,
  task_id BIGINT REFERENCES async_tasks(id) ON DELETE CASCADE,
  event_type VARCHAR(50) NOT NULL,      -- 'status_change', 'step_update', 'error', 'webhook_sent'
  event_data JSONB NOT NULL,
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Indexes
CREATE INDEX idx_task_events_task_id ON task_events(task_id);
CREATE INDEX idx_task_events_type ON task_events(event_type);
CREATE INDEX idx_task_events_created_at ON task_events(created_at);
```

### 4.4 Supabase Realtime Setup
```sql
-- MIGRATION 4: Enable realtime on required tables
ALTER PUBLICATION supabase_realtime ADD TABLE async_tasks;
ALTER PUBLICATION supabase_realtime ADD TABLE task_events;  -- if using event logging
```

---

## 5 │ n8n Setup & Workflows ✅ READY

### 5.1 Environment Setup
```bash
# n8n configuration
N8N_BASIC_AUTH_ACTIVE=true
N8N_BASIC_AUTH_USER=admin
N8N_BASIC_AUTH_PASSWORD=secure_password_here
N8N_HOST=0.0.0.0
N8N_PORT=5678
N8N_PROTOCOL=https
N8N_BASE_URL=https://n8n.yourdomain.com

# Integration credentials (configured in n8n)
SUPABASE_URL=https://rozmxiysbvsnzfoytjly.supabase.co
SUPABASE_SERVICE_KEY=your_service_role_key
OPENROUTER_API_KEY=your_openrouter_key

# AI model configuration (hardcoded in n8n workflows)
# Chat workflow uses: openai/gpt-4o, temperature=0.7, max_tokens=2000

# Workflow IDs (configured after creating workflows)
N8N_CHAT_WORKFLOW_ID=workflow_abc123
N8N_EMAIL_WORKFLOW_ID=workflow_def456  # future
N8N_DATA_IMPORT_WORKFLOW_ID=workflow_ghi789  # future
```

### 5.2 Workflow Architecture

**Config-Based Workflow Management:**
- **Chat Processor:** `/webhook/chat/process` 
- **Email Sender:** `/webhook/email/send` (future)
- **Data Importer:** `/webhook/data/import` (future)
- **Report Generator:** `/webhook/report/generate` (future)

### 5.3 Chat Processing Workflow 📋 (First Implementation)

**Webhook Trigger Configuration:**
- Path: `/webhook/chat/process`
- HTTP Method: POST
- Authentication: None (internal)
- Response: "Immediately" with workflow started

**Expected Input Payload:**
```json
{
  "task_id": 123,
  "task_type": "chat",
  "input_data": {
    "conversation_id": 45,
    "message_id": 67
  },
  "user_id": "uuid-here"
}
```

**Workflow Steps:**

1. **Webhook Trigger** → Initialize

2. **Status: "Starting Processing"** (Supabase)
   ```sql
   UPDATE async_tasks 
   SET status = 'processing', 
       current_step = 'initializing',
       status_message = 'Starting to process your chat message...',
       processing_started_at = NOW(),
       n8n_execution_id = '{{ $execution.id }}'
   WHERE id = {{ $json.task_id }}
   ```

3. **Status: "Preparing AI Request"** (Supabase)
   ```sql
   UPDATE async_tasks 
   SET current_step = 'preparing_request',
       status_message = 'Preparing your conversation for the AI model...'
   WHERE id = {{ $json.task_id }}
   ```

4. **Status: "Calling AI Model"** (Supabase)
   ```sql
   UPDATE async_tasks 
   SET current_step = 'calling_ai',
       status_message = 'Sending your message to OpenAI GPT-4. This usually takes 10-30 seconds...'
   WHERE id = {{ $json.task_id }}
   ```

5. **Fetch Conversation History** (Supabase Query)
   ```sql
   SELECT role, content, thinking FROM chat_messages 
   WHERE conversation_id = {{ $json.input_data.conversation_id }}
   ORDER BY created_at ASC
   ```

6. **OpenRouter LLM Call** (configured in n8n)
   - Model: `openai/gpt-4o` (hardcoded in workflow)
   - Temperature: `0.7` (hardcoded in workflow)
   - Max Tokens: `2000` (hardcoded in workflow)
   - Messages: `{{ $node["Fetch Conversation History"].json }}`
   - Stream: true

7. **Status: "Processing Response"** (Supabase)
   ```sql
   UPDATE async_tasks 
   SET current_step = 'processing_response',
       status_message = 'AI responded! Now formatting and saving the response...'
   WHERE id = {{ $json.task_id }}
   ```

8. **Save Results** (Supabase)
   ```sql
   UPDATE async_tasks 
   SET current_step = 'saving_response',
       status_message = 'Saving AI response to your chat...',
       output_data = '{{ {
         "ai_response": $json.ai_response,
         "thinking": $json.ai_thinking,
         "tokens_used": $json.tokens_used,
         "model_used": "openai/gpt-4o",
         "response_time_seconds": Math.round(($execution.startedAt - new Date()) / 1000)
       } }}'
   WHERE id = {{ $json.task_id }}
   ```

9. **Update Chat Message** (Domain-specific)
   ```sql
   UPDATE chat_messages 
   SET content = '{{ $json.ai_response }}',
       thinking = '{{ $json.ai_thinking }}'
   WHERE id = {{ $json.input_data.message_id }}
   ```

10. **Final Status: "Complete"** (Supabase)
   ```sql
   UPDATE async_tasks 
   SET status = 'completed',
       current_step = 'completed',
       status_message = 'Response complete! AI generated {{ $json.tokens_used }} tokens in {{ Math.round(($execution.startedAt - new Date()) / 1000) }} seconds.',
       processing_completed_at = NOW()
   WHERE id = {{ $json.task_id }}
   ```

### 5.4 Error Handling (Generic Pattern)

**Timeout Handler:**
```sql
UPDATE async_tasks 
SET status = 'timeout',
    current_step = 'timeout',
    status_message = 'Request timed out after 180 seconds. Please try again.',
    error_details = '{"error": "Workflow timeout after 180 seconds"}',
    processing_completed_at = NOW()
WHERE id = {{ $json.task_id }}
```

**Failure Handler:**
```sql
UPDATE async_tasks 
SET status = 'failed',
    current_step = 'failed',
    status_message = 'Processing failed: {{ $json.error_info.message || "Unknown error occurred" }}',
    error_details = '{{ $json.error_info }}',
    processing_completed_at = NOW()
WHERE id = {{ $json.task_id }}
```

---

## 6 │ Config-Based API Layer ✅ READY

### 6.1 Workflow Configuration
```typescript
// src/lib/workflow-config.ts
interface WorkflowConfig {
  workflow_id: string;
  webhook_url: string;
  timeout_seconds: number;
}

const WORKFLOW_CONFIGS: Record<string, WorkflowConfig> = {
  'chat': {
    workflow_id: process.env.N8N_CHAT_WORKFLOW_ID!,
    webhook_url: `${process.env.N8N_BASE_URL}/webhook/chat/process`,
    timeout_seconds: 180
  },
  'email': {
    workflow_id: process.env.N8N_EMAIL_WORKFLOW_ID!,
    webhook_url: `${process.env.N8N_BASE_URL}/webhook/email/send`,
    timeout_seconds: 300
  },
  'data_import': {
    workflow_id: process.env.N8N_DATA_IMPORT_WORKFLOW_ID!,
    webhook_url: `${process.env.N8N_BASE_URL}/webhook/data/import`,
    timeout_seconds: 600
  }
};

export const getWorkflowConfig = (taskType: string): WorkflowConfig => {
  const config = WORKFLOW_CONFIGS[taskType];
  if (!config) {
    throw new Error(`No workflow configured for task type: ${taskType}`);
  }
  return config;
};
```

### 6.2 Core Task Management API

```typescript
// src/app/api/tasks/create/route.ts
import { getWorkflowConfig } from '@/lib/workflow-config';

export async function POST(request: NextRequest) {
  const { task_type, input_data } = await request.json();
  
  // Get workflow configuration
  const workflowConfig = getWorkflowConfig(task_type);
  
  // Create generic task
  const task = await supabase
    .from('async_tasks')
    .insert({
      task_type,
      workflow_id: workflowConfig.workflow_id,
      input_data,
      created_by: user.id,
      status: 'pending',
      status_message: 'Task created, waiting to start...'
    })
    .select()
    .single();

  // Trigger n8n workflow
  const response = await fetch(workflowConfig.webhook_url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      task_id: task.id,
      task_type,
      input_data,
      user_id: user.id
    })
  });

  if (!response.ok) {
    throw new Error(`Failed to trigger workflow: ${response.statusText}`);
  }

  return NextResponse.json({ 
    success: true, 
    task_id: task.id,
    workflow_id: workflowConfig.workflow_id
  });
}
```

### 6.3 Task Status API

```typescript
// src/app/api/tasks/[id]/route.ts
export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  const task = await supabase
    .from('async_tasks')
    .select('*')
    .eq('id', params.id)
    .eq('created_by', user.id)
    .single();

  return NextResponse.json(task);
}
```

---

## 7 │ Chat Integration (First Use Case) ✅ READY

### 7.1 Chat-Specific API

```typescript
// src/app/api/chat/send/route.ts
export async function POST(request: NextRequest) {
  const { conversation_id, message } = await request.json();
  
  // 1. Save user message
  const userMessage = await supabase
    .from('chat_messages')
    .insert({
      conversation_id,
      role: 'user',
      content: message,
    })
    .select()
    .single();

  // 2. Create async task for AI response
  const taskResponse = await fetch('/api/tasks/create', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      task_type: 'chat',
      input_data: {
        conversation_id,
        user_message: message,
        conversation_history: await getConversationHistory(conversation_id),
        model: 'openai/gpt-4o',
        temperature: 0.7,
        max_tokens: 2000
      }
    })
  });

  const { task_id } = await taskResponse.json();

  // 3. Create placeholder AI message linked to task
  const aiMessage = await supabase
    .from('chat_messages')
    .insert({
      conversation_id,
      role: 'assistant',
      content: '',
      async_task_id: task_id
    })
    .select()
    .single();

  return NextResponse.json({ 
    user_message: userMessage,
    ai_message: aiMessage,
    task_id 
  });
}
```

### 7.2 Chat-Specific Frontend Hooks

```typescript
// src/hooks/chat/useChatMessage.ts
export function useChatMessage(messageId: number) {
  const [message, setMessage] = useState(null);
  const [task, setTask] = useState(null);
  
  // Subscribe to message changes
  useEffect(() => {
    const messageChannel = supabase
      .channel('chat-message')
      .on('postgres_changes', {
        event: 'UPDATE',
        schema: 'public',
        table: 'chat_messages',
        filter: `id=eq.${messageId}`
      }, (payload) => {
        setMessage(payload.new);
      })
      .subscribe();

    return () => messageChannel.unsubscribe();
  }, [messageId]);

  // Subscribe to task changes (if message has async_task_id)
  useEffect(() => {
    if (!message?.async_task_id) return;

    const taskChannel = supabase
      .channel('async-task')
      .on('postgres_changes', {
        event: 'UPDATE',
        schema: 'public',
        table: 'async_tasks',
        filter: `id=eq.${message.async_task_id}`
      }, (payload) => {
        setTask(payload.new);
      })
      .subscribe();

    return () => taskChannel.unsubscribe();
  }, [message?.async_task_id]);

  return { message, task };
}
```

### 7.3 Chat Message Component

```typescript
// MessageBubble with async task integration
const MessageBubble = ({ message }) => {
  const { task } = useChatMessage(message.id);
  
  // Show task status for AI messages
  if (message.role === 'assistant' && task) {
    if (task.status === 'pending') {
      return (
        <div className="ai-message pending">
          <Spinner />
          <span>{task.status_message || 'Queued for processing...'}</span>
        </div>
      );
    }
    
    if (task.status === 'processing') {
      return (
        <div className="ai-message processing">
          <ProcessingDots />
          <div>
            <strong>{getStepDescription(task.current_step)}</strong>
            <p className="status-detail">{task.status_message}</p>
          </div>
        </div>
      );
    }
    
    if (task.status === 'failed') {
      return (
        <div className="ai-message error">
          <ErrorIcon />
          <div>
            <span>Failed: {task.status_message || 'Unknown error'}</span>
            <RetryButton taskId={task.id} />
          </div>
        </div>
      );
    }
  }
  
  // Show final message content
  return (
    <div className="ai-message completed">
      <AIAvatar />
      <div className="content">
        {message.content}
        {task?.output_data && (
          <div className="metadata">
            Generated in {task.output_data.response_time_seconds}s using {task.output_data.model_used}
          </div>
        )}
      </div>
    </div>
  );
};

function getStepDescription(step: string) {
  const descriptions = {
    'initializing': '🔄 Starting up...',
    'preparing_request': '📝 Preparing request...',
    'calling_ai': '🧠 AI is thinking...',
    'processing_response': '⚡ Processing response...',
    'saving_response': '💾 Saving response...',
    'completed': '✅ Complete!'
  };
  return descriptions[step] || '⏳ Processing...';
}
```

---

## 8 │ Extensibility Examples ✅

### 8.1 Future Task Type: Email Campaign

**Task Creation:**
```typescript
await fetch('/api/tasks/create', {
  method: 'POST',
  body: JSON.stringify({
    task_type: 'email',
    input_data: {
      campaign_id: 123,
      recipients: ['user1@example.com', 'user2@example.com'],
      template: 'welcome_series_1',
      personalization: { ... }
    }
  })
});
```

**Workflow Status Updates:**
```sql
-- Email workflow status messages
'Preparing email list...'
'Loading email template...'
'Sending batch 1 of 10 (100 emails)...'
'Batch 1 complete: 98 sent, 2 bounced'
'Sending batch 2 of 10 (100 emails)...'
'Campaign complete! 996 sent, 4 bounced, estimated 249 opens'
```

### 8.2 Future Task Type: Data Import

**Task Creation:**
```typescript
await fetch('/api/tasks/create', {
  method: 'POST',
  body: JSON.stringify({
    task_type: 'data_import',
    input_data: {
      source_type: 'csv',
      file_url: 'https://...',
      mapping_config: { ... },
      destination_table: 'contacts'
    }
  })
});
```

**Workflow Status Updates:**
```sql
-- Data import status messages
'Downloading CSV file...'
'Validating data format...'
'Processing row 500 of 2,000...'
'Importing validated records...'
'Import complete! 1,847 records imported, 153 skipped due to errors'
```

---

## 11 │ Benefits ✅

* ✅ **Truly generic** - supports any automation type
* ✅ **Config-based simplicity** - workflow management through environment variables
* ✅ **Descriptive status updates** - users always know exactly what's happening
* ✅ **Chat as proof of concept** - validates architecture with real use case  
* ✅ **Easy extensibility** - add new automations by updating config
* ✅ **Independent workflows** - each automation type isolated and scalable
* ✅ **Version controlled** - workflow IDs managed in codebase
* ✅ **Environment-specific** - different workflows per environment
* ✅ **Better UX** - meaningful status messages instead of arbitrary percentages
* ✅ **Future-proof** - architecture scales from simple to enterprise complexity

---

## 12 │ Next Steps 🎯

### **Immediate Priorities (This Week)**
1. **🔥 Deploy n8n instance** → Get base URL and credentials
2. **🔥 Run database migrations** → Create async_tasks table with status messaging
3. **🔥 Build basic n8n chat workflow** → Test webhook communication

### **Following Steps (Next 1-2 Weeks)**
4. **⚡ Create workflow config** → Environment setup and routing
5. **⚡ Implement backend APIs** → /api/tasks/create and /api/chat/send
6. **⚡ Update frontend components** → Async status display

### **Context & Coordination**
- **Detailed Task Management:** See `docs/task-management.md` for comprehensive tracking
- **Architecture Status:** Core design complete ✅, implementation starting
- **Risk Level:** Low - well-defined scope with clear fallback to existing system

---

**🚀 Ready for implementation with clear next steps and robust architecture!**

---
