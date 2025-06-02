// Workflow configuration for n8n async task system
// Manages routing between different automation types

interface WorkflowConfig {
  workflow_id: string;
  webhook_url: string;
  timeout_seconds: number;
  description: string;
}

/**
 * Configuration for all supported workflow types
 * Add new automation types here as they're implemented
 */
const WORKFLOW_CONFIGS: Record<string, WorkflowConfig> = {
  'chat': {
    workflow_id: process.env.N8N_CHAT_WORKFLOW_ID!,
    webhook_url: `${process.env.N8N_BASE_URL}${process.env.N8N_WEBHOOK_PATH}`,
    timeout_seconds: 180,
    description: 'AI chat message processing with OpenRouter'
  },
  
  // Future workflow types (uncomment when implemented)
  /*
  'email': {
    workflow_id: process.env.N8N_EMAIL_WORKFLOW_ID!,
    webhook_url: `${process.env.N8N_BASE_URL}/webhook/email/send`,
    timeout_seconds: 300,
    description: 'Email campaign sending and tracking'
  },
  
  'data_import': {
    workflow_id: process.env.N8N_DATA_IMPORT_WORKFLOW_ID!,
    webhook_url: `${process.env.N8N_BASE_URL}/webhook/data/import`,
    timeout_seconds: 600,
    description: 'CSV and API data import processing'
  }
  */
};

/**
 * Get workflow configuration by task type
 * @param taskType - The type of automation ('chat', 'email', etc.)
 * @returns Workflow configuration object
 * @throws Error if task type is not configured
 */
export const getWorkflowConfig = (taskType: string): WorkflowConfig => {
  const config = WORKFLOW_CONFIGS[taskType];
  
  if (!config) {
    const availableTypes = Object.keys(WORKFLOW_CONFIGS).join(', ');
    throw new Error(
      `No workflow configured for task type: "${taskType}". ` +
      `Available types: ${availableTypes}`
    );
  }

  // Validate required environment variables
  if (!config.workflow_id) {
    throw new Error(
      `Missing environment variable for ${taskType} workflow ID. ` +
      `Please set N8N_${taskType.toUpperCase()}_WORKFLOW_ID`
    );
  }

  if (!process.env.N8N_BASE_URL) {
    throw new Error('Missing N8N_BASE_URL environment variable');
  }

  return config;
};

/**
 * Get all available workflow types
 * @returns Array of configured task types
 */
export const getAvailableWorkflowTypes = (): string[] => {
  return Object.keys(WORKFLOW_CONFIGS);
};

/**
 * Check if a task type is supported
 * @param taskType - The task type to check
 * @returns Boolean indicating if the task type is supported
 */
export const isTaskTypeSupported = (taskType: string): boolean => {
  return taskType in WORKFLOW_CONFIGS;
};

/**
 * Get workflow configuration with validation
 * @param taskType - The task type
 * @returns Safe workflow config or null if invalid
 */
export const getSafeWorkflowConfig = (taskType: string): WorkflowConfig | null => {
  try {
    return getWorkflowConfig(taskType);
  } catch (error) {
    console.error(`Failed to get workflow config for ${taskType}:`, error);
    return null;
  }
}; 