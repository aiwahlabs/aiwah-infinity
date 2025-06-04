import { NextRequest, NextResponse } from 'next/server';
import { supabaseServer } from '@/lib/supabase/server';
import { getWorkflowConfig } from '@/lib/workflow-config';

/**
 * Generic async task creation endpoint
 * Creates a task and triggers the appropriate n8n workflow
 */
export async function POST(request: NextRequest) {
  try {
    const { task_type, input_data } = await request.json();

    // Validate required fields
    if (!task_type || !input_data) {
      return NextResponse.json(
        { error: 'Missing required fields: task_type and input_data' },
        { status: 400 }
      );
    }

    // Get workflow configuration
    let workflowConfig;
    try {
      workflowConfig = getWorkflowConfig(task_type);
    } catch (error) {
      return NextResponse.json(
        { error: `Invalid task type: ${task_type}. ${(error as Error).message}` },
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

    // Create async task in database
    const { data: task, error: taskError } = await supabase
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

    if (taskError) {
      console.error('Failed to create task:', taskError);
      return NextResponse.json(
        { error: 'Failed to create task in database' },
        { status: 500 }
      );
    }

    // Prepare n8n webhook payload
    const webhookPayload = {
      task_id: task.id,
      task_type,
      input_data,
      user_id: user.id
    };

    // Trigger n8n workflow
    try {
      const response = await fetch(workflowConfig.webhook_url, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'User-Agent': 'Aiwah-App/1.0'
        },
        body: JSON.stringify(webhookPayload)
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      // Get n8n response (usually contains execution info)
      const n8nResponse = await response.json();
      
      // Update task with n8n execution info if available
      if (n8nResponse.executionId || n8nResponse.workflowId) {
        await supabase
          .from('async_tasks')
          .update({
            n8n_execution_id: n8nResponse.executionId,
            status_message: 'Workflow started successfully'
          })
          .eq('id', task.id);
      }

    } catch (webhookError) {
      console.error('Failed to trigger n8n workflow:', webhookError);
      
      // Update task status to failed
      await supabase
        .from('async_tasks')
        .update({
          status: 'failed',
          status_message: `Failed to start workflow: ${(webhookError as Error).message}`,
          error_details: {
            error: (webhookError as Error).message,
            webhook_url: workflowConfig.webhook_url,
            timestamp: new Date().toISOString()
          }
        })
        .eq('id', task.id);

      return NextResponse.json(
        { error: 'Failed to trigger workflow', task_id: task.id },
        { status: 500 }
      );
    }

    // Return success response
    return NextResponse.json({
      success: true,
      task_id: task.id,
      workflow_id: workflowConfig.workflow_id,
      task_type,
      status: 'pending',
      webhook_url: workflowConfig.webhook_url
    });

  } catch (error) {
    console.error('Task creation error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * Get task status endpoint
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const taskId = searchParams.get('id');

    if (!taskId) {
      return NextResponse.json(
        { error: 'Missing task ID parameter' },
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

    // Get task status
    const { data: task, error: taskError } = await supabase
      .from('async_tasks')
      .select('*')
      .eq('id', taskId)
      .eq('created_by', user.id)
      .single();

    if (taskError) {
      return NextResponse.json(
        { error: 'Task not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(task);

  } catch (error) {
    console.error('Task status error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 