export * from './types';
export * from './client';

// Re-export commonly used items for convenience
export { 
  getOpenRouterClient, 
  createOpenRouterClient, 
  OpenRouterClient 
} from './client';

export { 
  OPENROUTER_MODELS, 
  MODEL_INFO,
  type OpenRouterModel,
  type ModelInfo,
  type OpenRouterMessage,
  type OpenRouterRequest,
  type OpenRouterResponse 
} from './types'; 