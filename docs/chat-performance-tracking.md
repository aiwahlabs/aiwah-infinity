# Chat Performance Tracking

This document explains how to track and analyze the latency between hitting send and your message appearing in chat.

## Overview

We've added comprehensive performance logging throughout the chat system to track:
- UI interactions (button click, state updates)
- API call timing (request/response)
- Database operations (user message, AI message creation)
- Real-time subscription updates
- UI rendering

## How to Use

### Automatic Tracking (Development Mode)

In development mode, performance tracking starts automatically. Just:
1. Open your browser console
2. Send a message in chat
3. Look for logs starting with `📊 PERFORMANCE:`

### Manual Tracking with Analysis Tool

For a more detailed analysis:

1. **Start tracking:**
   ```javascript
   window.chatPerf.startTracking()
   ```

2. **Send a message in chat**

3. **Analyze the results:**
   ```javascript
   window.chatPerf.analyze()
   ```

This will show:
- Total time from click to API response
- Total time from click to message appearing in UI
- Detailed breakdown of each stage
- Optimization recommendations

### Understanding the Logs

The logs track the following stages:

1. **Send button clicked** - When you click send or press Enter
2. **API call start** - When the frontend starts calling the API
3. **API receives request** - Server-side processing begins
4. **Auth check** - User authentication verification
5. **User message saved** - Your message is saved to the database
6. **AI message created** - Placeholder for AI response is created
7. **Task created** - Async task for AI processing is created
8. **API response sent** - Server sends response back
9. **Real-time update** - Message appears in UI via subscription

### Key Performance Metrics

Look for these in the console:

- **📊 PERFORMANCE: Send button clicked** - Start of the flow
- **📊 PERFORMANCE: API call completed** - Frontend received response
- **📊 PERFORMANCE: /api/chat/send - Request completed** - Total server time
- **📊 PERFORMANCE: Real-time INSERT - Message appearing in UI** - Message visible to user

### Optimization Opportunities

Based on the logging, here are the main areas that affect latency:

1. **API Call Network Latency** - Time for request to reach server
2. **Supabase Client Initialization** - One-time setup cost
3. **Database Operations** - Saving messages and creating tasks
4. **Real-time Subscription Delay** - Time for Supabase to broadcast changes

### Filtering Logs

To see only performance logs in your browser console:
1. Type "PERFORMANCE" in the console filter
2. Or filter by "📊" emoji

## Next Steps for Optimization

Based on the performance data, consider:

1. **Optimistic UI Updates** - Show message immediately while saving
2. **Connection Pooling** - Reuse database connections
3. **Batch Operations** - Combine multiple database calls
4. **Edge Functions** - Move API closer to users
5. **WebSocket Keep-Alive** - Maintain real-time connection 