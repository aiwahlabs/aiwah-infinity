import { NextRequest, NextResponse } from 'next/server';
import { supabaseServer } from '@/lib/supabase/server';

/**
 * Chat-specific endpoint that creates async tasks for AI responses
 * This replaces the direct streaming approach with async n8n processing
 */
export async function POST(request: NextRequest) {
  try {
    const { conversation_id, message } = await request.json();

    // Validate required fields
    if (!conversation_id || !message) {
      return NextResponse.json(
        { error: 'Missing required fields: conversation_id and message' },
        { status: 400 }
      );
    }

    // Initialize Supabase client
    const supabase = await supabaseServer();

    // Get current user
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    // 1. Save user message first
    const { data: userMessage, error: userMessageError } = await supabase
      .from('chat_messages')
      .insert({
        conversation_id,
        role: 'user',
        content: message,
      })
      .select()
      .single();

    if (userMessageError) {
      console.error('Failed to save user message:', userMessageError);
      return NextResponse.json(
        { error: 'Failed to save message' },
        { status: 500 }
      );
    }

    // Add a tiny delay to ensure database commit is flushed before real-time notifications
    await new Promise(resolve => setTimeout(resolve, 50));

    // 2. Create placeholder AI message first (before creating the task)
    // This way we can include the message_id in the task input_data from the start
    let aiMessage = null;
    
    try {
      const { data: placeholderAiMessage, error: aiMessageError } = await supabase
        .from('chat_messages')
        .insert({
          conversation_id,
          role: 'assistant',
          content: '', // Empty content - will be filled by n8n workflow
          metadata: { 
            placeholder: true,
            pending_task: true
          }
        })
        .select()
        .single();

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

      if (taskResponse.ok) {
        const { task_id } = await taskResponse.json();
        taskId = task_id;
        console.log('Task created successfully with complete input_data:', { task_id, messageId: aiMessage.id });

        // 4. Update the AI message to link it to the task
        try {
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
          
          console.log('AI message linked to task:', { messageId: aiMessage.id, taskId });
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
    return NextResponse.json({
      success: true,
      task_id: taskId,
      user_message: userMessage,
      ai_message: aiMessage,
      message: 'Message sent and AI processing started'
    });

  } catch (error) {
    console.error('Chat send error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 