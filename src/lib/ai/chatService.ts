import { OpenRouterMessage, OpenRouterModel, OPENROUTER_MODELS, MODEL_INFO, getOpenRouterClient } from '@/lib/openrouter';
import { ChatMessage } from '@/app/chat/types';

export interface ChatServiceOptions {
  model?: OpenRouterModel;
  temperature?: number;
  maxTokens?: number;
  stream?: boolean;
  systemPrompt?: string;
}

export interface StreamingResponse {
  content: string;
  thinking?: string;
  isComplete: boolean;
  error?: string;
}

export interface ChatResponse {
  content: string;
  thinking?: string;
}

export class ChatService {
  private defaultOptions: ChatServiceOptions = {
    model: OPENROUTER_MODELS.LLAMA_3_3_8B,
    temperature: 0.7,
    maxTokens: 1024,
    stream: true,
    systemPrompt: 'You are a helpful AI assistant. Provide clear, accurate, and helpful responses.',
  };

  constructor(options?: Partial<ChatServiceOptions>) {
    this.defaultOptions = { ...this.defaultOptions, ...options };
  }

  private convertChatMessagesToOpenRouter(
    messages: ChatMessage[],
    systemPrompt?: string
  ): OpenRouterMessage[] {
    const openRouterMessages: OpenRouterMessage[] = [];

    // Add system prompt if provided
    if (systemPrompt) {
      openRouterMessages.push({
        role: 'system',
        content: systemPrompt,
      });
    }

    // Convert chat messages to OpenRouter format
    for (const message of messages) {
      if (message.role === 'user' || message.role === 'assistant') {
        openRouterMessages.push({
          role: message.role,
          content: message.content,
        });
      }
    }

    return openRouterMessages;
  }

  private extractResponseContent(response: any, model: OpenRouterModel): ChatResponse {
    const choice = response.choices?.[0];
    if (!choice) return { content: 'No response generated' };

    const message = choice.message;
    if (!message) return { content: 'No response generated' };

    const modelInfo = MODEL_INFO[model];
    
    // For thinking models, return both thinking and content separately
    if (modelInfo?.isThinkingModel) {
      return {
        thinking: message.reasoning?.trim() || undefined,
        content: message.content?.trim() || 'No response generated'
      };
    }

    // For non-thinking models, just return content
    return {
      content: message.content?.trim() || 'No response generated'
    };
  }

  private isServerSide(): boolean {
    return typeof window === 'undefined';
  }

  async generateResponse(
    messages: ChatMessage[],
    options?: Partial<ChatServiceOptions>
  ): Promise<ChatResponse> {
    const config = { ...this.defaultOptions, ...options };
    
    const openRouterMessages = this.convertChatMessagesToOpenRouter(
      messages,
      config.systemPrompt
    );

    try {
      // If running on server side, use OpenRouter client directly
      if (this.isServerSide()) {
        const client = getOpenRouterClient();
        const response = await client.createChatCompletion({
          messages: openRouterMessages,
          model: config.model,
          temperature: config.temperature,
          max_tokens: config.maxTokens,
        });
        return this.extractResponseContent(response, config.model || this.defaultOptions.model!);
      }

      // Client-side: use fetch to API route
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: openRouterMessages,
          model: config.model,
          temperature: config.temperature,
          max_tokens: config.maxTokens,
          stream: false,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      return this.extractResponseContent(data, config.model || this.defaultOptions.model!);
    } catch (error) {
      console.error('Error generating AI response:', error);
      throw error;
    }
  }

  async *generateStreamingResponse(
    messages: ChatMessage[],
    options?: Partial<ChatServiceOptions>
  ): AsyncGenerator<StreamingResponse, void, unknown> {
    const config = { ...this.defaultOptions, ...options };
    
    const openRouterMessages = this.convertChatMessagesToOpenRouter(
      messages,
      config.systemPrompt
    );

    try {
      // If running on server side, use OpenRouter client directly
      if (this.isServerSide()) {
        const client = getOpenRouterClient();
        const streamResponse = await client.createChatCompletionStream({
          messages: openRouterMessages,
          model: config.model,
          temperature: config.temperature,
          max_tokens: config.maxTokens,
        });

        const reader = streamResponse.getReader();
        let content = '';
        let reasoning = '';
        const modelInfo = MODEL_INFO[config.model || this.defaultOptions.model!];

        try {
          while (true) {
            const { done, value } = await reader.read();
            
            if (done) {
              // Return final response with separate thinking and content
              yield { 
                content, 
                thinking: modelInfo?.isThinkingModel ? reasoning || undefined : undefined,
                isComplete: true 
              };
              break;
            }

            const delta = value.choices?.[0]?.delta;
            if (delta) {
              // Accumulate thinking and content separately
              if (modelInfo?.isThinkingModel && delta.reasoning) {
                reasoning += delta.reasoning;
              }
              if (delta.content) {
                content += delta.content;
              }
              
              // Yield progressive response with separate fields
              yield { 
                content, 
                thinking: modelInfo?.isThinkingModel ? reasoning || undefined : undefined,
                isComplete: false 
              };
            }

            if (value.choices?.[0]?.finish_reason) {
              // Return final response with separate thinking and content
              yield { 
                content, 
                thinking: modelInfo?.isThinkingModel ? reasoning || undefined : undefined,
                isComplete: true 
              };
              return;
            }
          }
        } finally {
          reader.releaseLock();
        }
      }

      // Client-side: use fetch to API route
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: openRouterMessages,
          model: config.model,
          temperature: config.temperature,
          max_tokens: config.maxTokens,
          stream: true,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `HTTP ${response.status}: ${response.statusText}`);
      }

      if (!response.body) {
        throw new Error('No response body received');
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let content = '';
      let reasoning = '';
      const modelInfo = MODEL_INFO[config.model || this.defaultOptions.model!];

      try {
        while (true) {
          const { done, value } = await reader.read();
          
          if (done) {
            // Return final response with separate thinking and content
            yield { 
              content, 
              thinking: modelInfo?.isThinkingModel ? reasoning || undefined : undefined,
              isComplete: true 
            };
            break;
          }

          const chunk = decoder.decode(value, { stream: true });
          const lines = chunk.split('\n');

          for (const line of lines) {
            const trimmed = line.trim();
            if (trimmed.startsWith('data: ')) {
              const data = trimmed.slice(6);
              
              if (data === '[DONE]') {
                // Return final response with separate thinking and content
                yield { 
                  content, 
                  thinking: modelInfo?.isThinkingModel ? reasoning || undefined : undefined,
                  isComplete: true 
                };
                return;
              }

              try {
                const parsed = JSON.parse(data);
                
                if (parsed.error) {
                  yield { content, isComplete: true, error: parsed.error };
                  return;
                }

                const delta = parsed.choices?.[0]?.delta;
                if (delta) {
                  // Accumulate thinking and content separately
                  if (modelInfo?.isThinkingModel && delta.reasoning) {
                    reasoning += delta.reasoning;
                  }
                  if (delta.content) {
                    content += delta.content;
                  }
                  
                  // Yield progressive response with separate fields
                  yield { 
                    content, 
                    thinking: modelInfo?.isThinkingModel ? reasoning || undefined : undefined,
                    isComplete: false 
                  };
                }

                if (parsed.choices?.[0]?.finish_reason) {
                  // Return final response with separate thinking and content
                  yield { 
                    content, 
                    thinking: modelInfo?.isThinkingModel ? reasoning || undefined : undefined,
                    isComplete: true 
                  };
                  return;
                }
              } catch (parseError) {
                console.warn('Failed to parse SSE data:', data, parseError);
              }
            }
          }
        }
      } finally {
        reader.releaseLock();
      }
    } catch (error) {
      console.error('Error in streaming response:', error);
      yield { 
        content: '', 
        isComplete: true, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      };
    }
  }

  async testConnection(): Promise<boolean> {
    try {
      const testMessages: ChatMessage[] = [{
        id: 0,
        conversation_id: 0,
        role: 'user',
        content: 'Hello',
        created_at: new Date().toISOString(),
        metadata: {},
      }];

      const response = await this.generateResponse(testMessages, { maxTokens: 10 });
      return !!response.content;
    } catch (error) {
      console.error('Chat service connection test failed:', error);
      return false;
    }
  }

  setDefaultModel(model: OpenRouterModel): void {
    this.defaultOptions.model = model;
  }

  getDefaultModel(): OpenRouterModel {
    return this.defaultOptions.model || OPENROUTER_MODELS.LLAMA_3_3_8B;
  }

  setDefaultSystemPrompt(prompt: string): void {
    this.defaultOptions.systemPrompt = prompt;
  }

  getDefaultSystemPrompt(): string {
    return this.defaultOptions.systemPrompt || '';
  }
}

// Singleton instance
let chatService: ChatService | null = null;

export function getChatService(): ChatService {
  if (!chatService) {
    chatService = new ChatService();
  }
  return chatService;
}

export function createChatService(options?: Partial<ChatServiceOptions>): ChatService {
  return new ChatService(options);
} 