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

    // Start async task creation in background (non-blocking)
    // This prevents the user from waiting for AI processing to start
    (async () => {
      try {
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
          return;
        }

        const { task_id } = await taskResponse.json();

        console.log('Background task processing started:', { task_id });
      } catch (error) {
        console.error('Background task creation failed:', error);
      }
    })();

    // Return user message immediately for fast UI response
    return NextResponse.json({
      success: true,
      user_message: userMessage,
      status: 'sent',
      message: 'AI processing started in background'
    });

  } catch (error) {
    console.error('Chat send error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 