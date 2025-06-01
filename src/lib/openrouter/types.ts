export interface OpenRouterMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface OpenRouterRequest {
  model: string;
  messages: OpenRouterMessage[];
  temperature?: number;
  max_tokens?: number;
  top_p?: number;
  frequency_penalty?: number;
  presence_penalty?: number;
  stream?: boolean;
}

export interface OpenRouterResponse {
  id: string;
  object: string;
  created: number;
  model: string;
  choices: {
    index: number;
    message: {
      role: string;
      content: string;
      reasoning?: string;
    };
    finish_reason: string;
  }[];
  usage: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

export interface OpenRouterStreamChunk {
  id: string;
  object: string;
  created: number;
  model: string;
  choices: {
    index: number;
    delta: {
      role?: string;
      content?: string;
      reasoning?: string;
    };
    finish_reason?: string;
  }[];
}

export interface OpenRouterError {
  error: {
    message: string;
    type: string;
    code?: string;
  };
}

export const OPENROUTER_MODELS = {
  // Fast and efficient models
  QWEN3_8B: 'qwen/qwen3-8b:free',
  LLAMA_3_3_8B: 'meta-llama/llama-3.3-8b-instruct:free',
  
  // More powerful models
  QWEN3_30B: 'qwen/qwen3-30b-a3b:free',
  GEMINI_2_5_PRO: 'google/gemini-2.5-pro-exp-03-25:free',
  
  // Specialized models
  DEEPSEEK_CHAT: 'deepseek/deepseek-chat-v3-0324:free',
  MISTRAL_SMALL: 'mistralai/mistral-small-3.1-24b-instruct:free',
} as const;

export type OpenRouterModel = typeof OPENROUTER_MODELS[keyof typeof OPENROUTER_MODELS];

export interface ModelInfo {
  id: OpenRouterModel;
  name: string;
  description: string;
  contextLength: number;
  speed: 'fast' | 'medium' | 'slow';
  capabilities: string[];
  isThinkingModel?: boolean;
}

export const MODEL_INFO: Record<OpenRouterModel, ModelInfo> = {
  [OPENROUTER_MODELS.QWEN3_8B]: {
    id: OPENROUTER_MODELS.QWEN3_8B,
    name: 'Qwen3 8B',
    description: 'Fast and efficient model with good reasoning capabilities',
    contextLength: 40960,
    speed: 'fast',
    capabilities: ['reasoning', 'coding', 'multilingual', 'general'],
    isThinkingModel: true,
  },
  [OPENROUTER_MODELS.LLAMA_3_3_8B]: {
    id: OPENROUTER_MODELS.LLAMA_3_3_8B,
    name: 'Llama 3.3 8B',
    description: 'Ultra-fast lightweight model for quick responses',
    contextLength: 128000,
    speed: 'fast',
    capabilities: ['general', 'conversation', 'quick-responses'],
    isThinkingModel: false,
  },
  [OPENROUTER_MODELS.QWEN3_30B]: {
    id: OPENROUTER_MODELS.QWEN3_30B,
    name: 'Qwen3 30B A3B',
    description: 'Powerful model with advanced reasoning and coding capabilities',
    contextLength: 40960,
    speed: 'medium',
    capabilities: ['advanced-reasoning', 'coding', 'mathematics', 'multilingual'],
    isThinkingModel: true,
  },
  [OPENROUTER_MODELS.GEMINI_2_5_PRO]: {
    id: OPENROUTER_MODELS.GEMINI_2_5_PRO,
    name: 'Gemini 2.5 Pro',
    description: 'Google\'s advanced model with excellent reasoning',
    contextLength: 1000000,
    speed: 'slow',
    capabilities: ['advanced-reasoning', 'long-context', 'multimodal'],
    isThinkingModel: false,
  },
  [OPENROUTER_MODELS.DEEPSEEK_CHAT]: {
    id: OPENROUTER_MODELS.DEEPSEEK_CHAT,
    name: 'DeepSeek V3 0324',
    description: 'Advanced reasoning model with excellent coding and mathematical capabilities',
    contextLength: 163840,
    speed: 'medium',
    capabilities: ['advanced-reasoning', 'coding', 'mathematics', 'technical', 'conversation'],
    isThinkingModel: true,
  },
  [OPENROUTER_MODELS.MISTRAL_SMALL]: {
    id: OPENROUTER_MODELS.MISTRAL_SMALL,
    name: 'Mistral Small 3.1',
    description: 'Balanced model with function calling capabilities',
    contextLength: 96000,
    speed: 'medium',
    capabilities: ['function-calling', 'reasoning', 'multilingual'],
    isThinkingModel: false,
  },
}; 