import {
  OpenRouterRequest,
  OpenRouterResponse,
  OpenRouterStreamChunk,
  OpenRouterError,
  OpenRouterModel,
  OPENROUTER_MODELS,
} from './types';

export class OpenRouterClient {
  private apiKey: string;
  private baseUrl = 'https://openrouter.ai/api/v1';
  private defaultModel: OpenRouterModel = OPENROUTER_MODELS.DEEPSEEK_CHAT;

  constructor(apiKey?: string) {
    this.apiKey = apiKey || process.env.OPENROUTER_API_KEY || '';
    if (!this.apiKey) {
      throw new Error('OpenRouter API key is required');
    }
  }

  private async makeRequest(
    endpoint: string,
    options: RequestInit
  ): Promise<Response> {
    const url = `${this.baseUrl}${endpoint}`;
    
    const headers = {
      'Authorization': `Bearer ${this.apiKey}`,
      'Content-Type': 'application/json',
      'HTTP-Referer': process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
      'X-Title': 'Infinity Chat',
      ...options.headers,
    };

    const response = await fetch(url, {
      ...options,
      headers,
    });

    return response;
  }

  private async retryWithBackoff<T>(
    operation: () => Promise<T>,
    maxRetries = 3,
    baseDelay = 1000
  ): Promise<T> {
    let lastError: Error;

    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      try {
        return await operation();
      } catch (error) {
        lastError = error as Error;
        
        // Don't retry on certain errors
        if (error instanceof Error && (
          error.message.includes('401') || 
          error.message.includes('403') ||
          error.message.includes('invalid_api_key')
        )) {
          throw error;
        }

        if (attempt === maxRetries) {
          break;
        }

        // Exponential backoff with jitter
        const delay = baseDelay * Math.pow(2, attempt) + Math.random() * 1000;
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }

    throw lastError!;
  }

  async createChatCompletion(
    request: Omit<OpenRouterRequest, 'model'> & { model?: OpenRouterModel }
  ): Promise<OpenRouterResponse> {
    const payload: OpenRouterRequest = {
      model: request.model || this.defaultModel,
      temperature: request.temperature ?? 0.7,
      max_tokens: request.max_tokens ?? 1024,
      top_p: request.top_p ?? 0.95,
      stream: false,
      ...request,
    };

    return this.retryWithBackoff(async () => {
      const response = await this.makeRequest('/chat/completions', {
        method: 'POST',
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({})) as OpenRouterError;
        const errorMessage = errorData.error?.message || `HTTP ${response.status}: ${response.statusText}`;
        throw new Error(errorMessage);
      }

      return response.json() as Promise<OpenRouterResponse>;
    });
  }

  async createChatCompletionStream(
    request: Omit<OpenRouterRequest, 'model' | 'stream'> & { model?: OpenRouterModel }
  ): Promise<ReadableStream<OpenRouterStreamChunk>> {
    const payload: OpenRouterRequest = {
      model: request.model || this.defaultModel,
      temperature: request.temperature ?? 0.7,
      max_tokens: request.max_tokens ?? 1024,
      top_p: request.top_p ?? 0.95,
      stream: true,
      ...request,
    };

    return this.retryWithBackoff(async () => {
      const response = await this.makeRequest('/chat/completions', {
        method: 'POST',
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({})) as OpenRouterError;
        const errorMessage = errorData.error?.message || `HTTP ${response.status}: ${response.statusText}`;
        throw new Error(errorMessage);
      }

      if (!response.body) {
        throw new Error('No response body received');
      }

      return new ReadableStream<OpenRouterStreamChunk>({
        start(controller) {
          const reader = response.body!.getReader();
          const decoder = new TextDecoder();

          function pump(): Promise<void> {
            return reader.read().then(({ done, value }) => {
              if (done) {
                controller.close();
                return;
              }

              const chunk = decoder.decode(value, { stream: true });
              const lines = chunk.split('\n');

              for (const line of lines) {
                const trimmed = line.trim();
                if (trimmed.startsWith('data: ')) {
                  const data = trimmed.slice(6);
                  
                  if (data === '[DONE]') {
                    controller.close();
                    return;
                  }

                  try {
                    const parsed = JSON.parse(data) as OpenRouterStreamChunk;
                    controller.enqueue(parsed);
                  } catch (error) {
                    console.warn('Failed to parse SSE data:', data, error);
                  }
                }
              }

              return pump();
            });
          }

          return pump().catch(error => {
            controller.error(error);
          });
        },
      });
    });
  }

  async testConnection(): Promise<boolean> {
    try {
      const response = await this.createChatCompletion({
        messages: [{ role: 'user', content: 'Hello' }],
        max_tokens: 10,
      });
      return !!response.choices?.[0]?.message?.content;
    } catch (error) {
      console.error('OpenRouter connection test failed:', error);
      return false;
    }
  }

  setDefaultModel(model: OpenRouterModel): void {
    this.defaultModel = model;
  }

  getDefaultModel(): OpenRouterModel {
    return this.defaultModel;
  }
}

// Singleton instance
let openRouterClient: OpenRouterClient | null = null;

export function getOpenRouterClient(): OpenRouterClient {
  if (!openRouterClient) {
    openRouterClient = new OpenRouterClient();
  }
  return openRouterClient;
}

export function createOpenRouterClient(apiKey?: string): OpenRouterClient {
  return new OpenRouterClient(apiKey);
} 