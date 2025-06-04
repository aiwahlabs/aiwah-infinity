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

    // 2. Create async task for AI response processing
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
          message_id: userMessage.id  // n8n will fetch history and update this message
        }
      })
    });

    if (!taskResponse.ok) {
      const error = await taskResponse.json();
      console.error('Failed to create async task:', error);
      return NextResponse.json(
        { error: 'Failed to start AI processing' },
        { status: 500 }
      );
    }

    const { task_id } = await taskResponse.json();

    // 3. Create placeholder AI message linked to the task
    const { data: aiMessage, error: aiMessageError } = await supabase
      .from('chat_messages')
      .insert({
        conversation_id,
        role: 'assistant',
        content: '',  // Empty content initially - status shown via task
        async_task_id: task_id
      })
      .select()
      .single();

    if (aiMessageError) {
      console.error('Failed to create AI message placeholder:', aiMessageError);
      return NextResponse.json(
        { error: 'Failed to create AI message' },
        { status: 500 }
      );
    }

    // Return both messages and task info
    return NextResponse.json({
      success: true,
      user_message: userMessage,
      ai_message: aiMessage,
      task_id,
      status: 'processing'
    });

  } catch (error) {
    console.error('Chat send error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 