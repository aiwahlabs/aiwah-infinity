import { NextRequest, NextResponse } from 'next/server';
import { supabaseServer } from '@/lib/supabase/server';

/**
 * Chat-specific endpoint that creates async tasks for AI responses
 * This replaces the direct streaming approach with async n8n processing
 */
export async function POST(request: NextRequest) {
  // Performance tracking - Request start
  const requestStartTime = Date.now();
  console.log('📊 PERFORMANCE: /api/chat/send - Request received', {
    timestamp: new Date().toISOString(),
    method: 'POST'
  });
  
  try {
    // Performance tracking - Parse body
    const parseStartTime = Date.now();
    const { conversation_id, message } = await request.json();
    console.log('📊 PERFORMANCE: Request body parsed', {
      timestamp: new Date().toISOString(),
      parseDuration: Date.now() - parseStartTime,
      conversationId: conversation_id,
      messageLength: message?.length
    });

    // Validate required fields
    if (!conversation_id || !message) {
      return NextResponse.json(
        { error: 'Missing required fields: conversation_id and message' },
        { status: 400 }
      );
    }

    // Initialize Supabase client
    const supabaseInitTime = Date.now();
    const supabase = await supabaseServer();
    console.log('📊 PERFORMANCE: Supabase client initialized', {
      timestamp: new Date().toISOString(),
      initDuration: Date.now() - supabaseInitTime
    });

    // Get current user
    const authStartTime = Date.now();
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    console.log('📊 PERFORMANCE: Auth check completed', {
      timestamp: new Date().toISOString(),
      authDuration: Date.now() - authStartTime,
      authenticated: !!user
    });
    
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    // 1. Save user message first
    const userMessageStartTime = Date.now();
    const { data: userMessage, error: userMessageError } = await supabase
      .from('chat_messages')
      .insert({
        conversation_id,
        role: 'user',
        content: message,
      })
      .select()
      .single();

    console.log('📊 PERFORMANCE: User message saved', {
      timestamp: new Date().toISOString(),
      saveDuration: Date.now() - userMessageStartTime,
      messageId: userMessage?.id,
      error: !!userMessageError
    });

    if (userMessageError) {
      console.error('Failed to save user message:', userMessageError);
      return NextResponse.json(
        { error: 'Failed to save message' },
        { status: 500 }
      );
    }

    // Database commit should be immediate for real-time UI updates

    // 2. Create placeholder AI message first (before creating the task)
    // This way we can include the message_id in the task input_data from the start
    let aiMessage = null;
    
    try {
      const aiMessageStartTime = Date.now();
      const { data: placeholderAiMessage, error: aiMessageError } = await supabase
        .from('chat_messages')
        .insert({
          conversation_id,
          role: 'assistant',
          content: '', // Empty content - will be filled by n8n workflow
          metadata: { 
            placeholder: true,
            status_message: 'AIII is thinking' // Match n8n workflow status
          }
        })
        .select()
        .single();

      console.log('📊 PERFORMANCE: AI placeholder message created', {
        timestamp: new Date().toISOString(),
        createDuration: Date.now() - aiMessageStartTime,
        messageId: placeholderAiMessage?.id,
        error: !!aiMessageError
      });

      if (aiMessageError) {
        console.error('Failed to create placeholder AI message:', aiMessageError);
        throw new Error('Failed to create placeholder AI message');
      }

      aiMessage = placeholderAiMessage;
      console.log('Placeholder AI message created:', { messageId: aiMessage.id });

    } catch (error) {
      console.error('AI message creation failed:', error);
      return NextResponse.json(
        { error: 'Failed to create AI message placeholder' },
        { status: 500 }
      );
    }

    // 3. Create async task with complete input_data including message_id
    let taskId: number | null = null;
    
    try {
      const taskStartTime = Date.now();
      console.log('📊 PERFORMANCE: Starting task creation', {
        timestamp: new Date().toISOString(),
        endpoint: `${request.nextUrl.origin}/api/tasks/create`
      });
      
      const taskResponse = await fetch(`${request.nextUrl.origin}/api/tasks/create`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': request.headers.get('Authorization') || '',
          'Cookie': request.headers.get('Cookie') || ''
        },
        body: JSON.stringify({
          task_type: 'chat',
          input_data: {
            conversation_id,
            user_message_id: userMessage.id,
            message_id: aiMessage.id  // AI message ID included from the start
          }
        })
      });

      console.log('📊 PERFORMANCE: Task creation response received', {
        timestamp: new Date().toISOString(),
        taskCreationDuration: Date.now() - taskStartTime,
        status: taskResponse.status,
        ok: taskResponse.ok
      });

      if (taskResponse.ok) {
        const { task_id } = await taskResponse.json();
        taskId = task_id;
        console.log('Task created successfully with complete input_data:', { task_id, messageId: aiMessage.id });

        // 4. Update the AI message to link it to the task
        try {
          const linkStartTime = Date.now();
          await supabase
            .from('chat_messages')
            .update({
              async_task_id: task_id,
              metadata: { 
                placeholder: true,
                created_for_task: task_id
              }
            })
            .eq('id', aiMessage.id);
          
          console.log('📊 PERFORMANCE: AI message linked to task', {
            timestamp: new Date().toISOString(),
            linkDuration: Date.now() - linkStartTime,
            messageId: aiMessage.id,
            taskId
          });
        } catch (updateError) {
          console.error('Failed to link AI message to task:', updateError);
          // Non-critical error - the message will still work
        }
      } else {
        const error = await taskResponse.json();
        console.error('Failed to create async task:', error);
        
        // Clean up the AI message if task creation failed
        await supabase
          .from('chat_messages')
          .delete()
          .eq('id', aiMessage.id);
        
        aiMessage = null;
        // Don't fail the whole request - user message was saved successfully
      }
    } catch (error) {
      console.error('Task creation failed:', error);
      
      // Clean up the AI message if task creation failed
      if (aiMessage) {
        await supabase
          .from('chat_messages')
          .delete()
          .eq('id', aiMessage.id);
        aiMessage = null;
      }
      // Don't fail the whole request - user message was saved successfully
    }

    // Return success response with task and message details
    const response = {
      success: true,
      task_id: taskId,
      user_message: userMessage,
      ai_message: aiMessage,
      message: 'Message sent and AI processing started'
    };
    
    // Performance tracking - Total request time
    const totalRequestTime = Date.now() - requestStartTime;
    console.log('📊 PERFORMANCE: /api/chat/send - Request completed', {
      timestamp: new Date().toISOString(),
      totalDuration: totalRequestTime,
      userMessageId: userMessage.id,
      aiMessageId: aiMessage?.id,
      taskId: taskId,
      breakdown: {
        parseBody: 'see logs above',
        supabaseInit: 'see logs above', 
        authCheck: 'see logs above',
        saveUserMessage: 'see logs above',
        createAIMessage: 'see logs above',
        createTask: 'see logs above'
      }
    });
    
    return NextResponse.json(response);

  } catch (error) {
    console.error('Chat send error:', error);
    
    // Performance tracking - Error case
    console.log('📊 PERFORMANCE: /api/chat/send - Request failed', {
      timestamp: new Date().toISOString(),
      totalDuration: Date.now() - requestStartTime,
      error: error instanceof Error ? error.message : 'Unknown error'
    });
    
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 