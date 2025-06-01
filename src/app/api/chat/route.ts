import { NextRequest, NextResponse } from 'next/server';
import { getOpenRouterClient, OpenRouterMessage, OpenRouterModel } from '@/lib/openrouter';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { 
      messages, 
      model, 
      stream = false,
      temperature,
      max_tokens,
      top_p 
    }: {
      messages: OpenRouterMessage[];
      model?: OpenRouterModel;
      stream?: boolean;
      temperature?: number;
      max_tokens?: number;
      top_p?: number;
    } = body;

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json(
        { error: 'Messages array is required and cannot be empty' },
        { status: 400 }
      );
    }

    const client = getOpenRouterClient();
    const selectedModel = model || client.getDefaultModel();

    if (stream) {
      // Handle streaming response
      const streamResponse = await client.createChatCompletionStream({
        messages,
        model: selectedModel,
        temperature,
        max_tokens,
        top_p,
      });

      // Create a readable stream that formats the data for the client
      const readableStream = new ReadableStream({
        start(controller) {
          const reader = streamResponse.getReader();

          function pump(): Promise<void> {
            return reader.read().then(({ done, value }) => {
              if (done) {
                controller.close();
                return;
              }

              // Format the chunk for SSE
              const chunk = `data: ${JSON.stringify(value)}\n\n`;
              controller.enqueue(new TextEncoder().encode(chunk));

              return pump();
            });
          }

          return pump().catch(error => {
            console.error('Stream error:', error);
            const errorChunk = `data: ${JSON.stringify({ error: error.message })}\n\n`;
            controller.enqueue(new TextEncoder().encode(errorChunk));
            controller.close();
          });
        },
      });

      return new Response(readableStream, {
        headers: {
          'Content-Type': 'text/event-stream',
          'Cache-Control': 'no-cache',
          'Connection': 'keep-alive',
        },
      });
    } else {
      // Handle non-streaming response
      const response = await client.createChatCompletion({
        messages,
        model: selectedModel,
        temperature,
        max_tokens,
        top_p,
      });

      return NextResponse.json(response);
    }
  } catch (error) {
    console.error('Chat API error:', error);
    
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    const statusCode = errorMessage.includes('401') || errorMessage.includes('403') ? 401 : 500;
    
    return NextResponse.json(
      { 
        error: errorMessage,
        type: 'api_error',
        details: error instanceof Error ? error.stack : undefined
      },
      { status: statusCode }
    );
  }
}

export async function GET() {
  return NextResponse.json(
    { message: 'Chat API is running. Use POST to send messages.' },
    { status: 200 }
  );
} 