import { NextResponse } from 'next/server';
import { getChatService } from '@/lib/ai/chatService';

export async function GET() {
  let chatService;
  
  try {
    chatService = getChatService();
    
    console.log('Testing OpenRouter with model:', chatService.getDefaultModel());
    console.log('API Key present:', !!process.env.OPENROUTER_API_KEY);
    
    // Test connection with a simple message
    const testMessages = [{
      id: 0,
      conversation_id: 0,
      role: 'user' as const,
      content: 'Hello! Please respond with just "OpenRouter is working!"',
      created_at: new Date().toISOString(),
      metadata: {},
    }];

    const response = await chatService.generateResponse(testMessages, { maxTokens: 20 });
    
    return NextResponse.json({
      success: true,
      message: 'OpenRouter connection successful',
      response: response,
      model: chatService.getDefaultModel(),
    });
  } catch (error) {
    console.error('OpenRouter test failed:', error);
    
    // Try to get more details about the error
    let errorDetails = 'Unknown error';
    if (error instanceof Error) {
      errorDetails = error.message;
      
      // If it's a fetch error, try to get the response
      if (error.message.includes('HTTP')) {
        console.log('HTTP Error details:', error);
      }
    }
    
    return NextResponse.json(
      {
        success: false,
        error: errorDetails,
        apiKeyPresent: !!process.env.OPENROUTER_API_KEY,
        model: chatService?.getDefaultModel() || 'unknown',
        details: error instanceof Error ? error.stack : undefined,
      },
      { status: 500 }
    );
  }
}