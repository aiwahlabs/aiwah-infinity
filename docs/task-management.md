# n8n Async Task System - Task Management 🔄

> **Living Document** — Broad steps for immediate implementation

**Status:** 📋 Planning → Implementation Phase  
**Last Updated:** 2025-01-01  
**Main Plan:** See `docs/chatbot-overhaul-plan.md` for architecture overview

---

## 🎯 **Immediate Steps**

### **🔥 Infrastructure Setup**
- [x] **Deploy n8n instance** → Get base URL and webhook access ✅
- [x] **Run database migrations** → Create async_tasks table + chat_messages update ✅  
  *Decision: Used generic async_tasks table for any automation type, not just chat*
- [ ] **Configure environment** → n8n URLs, Supabase keys, workflow IDs

### **⚡ Build MVP Workflow**
- [x] **Create n8n chat workflow** → Webhook trigger working! ✅ Next: add workflow nodes
- [x] **Build backend APIs** → `/api/tasks/create` + `/api/chat/send` ✅
- [x] **Create React hooks** → `useAsyncChat` with realtime updates ✅
- [x] **Update frontend components** → `ChatInterface` + `AsyncProcessingIndicator` ✅

### **✅ Test & Deploy**
- [ ] **End-to-end testing** → User sends message → AI responds with status updates
- [ ] **Error handling** → Timeouts, failures, retries
- [ ] **Go live** → Replace direct OpenRouter with async n8n workflow

---

## 📝 **Notes & Discoveries**

### **Key Decisions Made:**
- **Generic async_tasks table:** Chose fully generic approach vs chat-specific to support future automations (email, data import, etc.)
- **Status messaging:** Using descriptive messages like "AI is thinking..." instead of arbitrary percentages for better UX  
- **RLS enabled:** All tables have proper row-level security for multi-tenant safety
- **Realtime enabled:** async_tasks table has Supabase realtime for live status updates
- **Simplified payload:** n8n fetches conversation history directly from DB instead of receiving it in webhook payload

### **Database Schema Assumptions:**
- Users will primarily check task status via frontend (realtime), not direct DB queries
- n8n execution IDs are varchar(255) - sufficient for n8n's UUID format
- Error details stored as JSONB for flexibility in error handling
- Workflow IDs are config-based (env vars), not database-managed

### **Next Steps Context:**
- Webhook URL confirmed working: `https://n8n.srv795417.hstgr.cloud/webhook-test/chat/process` ✅
- Each workflow step will update async_tasks.status_message for real-time user feedback
- Chat messages link to tasks via async_task_id (nullable for existing messages)

### **Current Progress:**
- **✅ Webhook trigger responds** - `{"message":"Workflow was started"}`
- **🔄 Next: Add Supabase nodes** - Status updates + conversation history fetch
- **🔄 Then: Add OpenRouter node** - AI processing with hardcoded model config
- **🔄 Finally: Add completion nodes** - Save response + mark task complete

---

*Keep it simple, keep it focused, keep moving forward.* 🚀 