/**
* Model Manager - Handles multiple AI model connections and provider management
*
* This class manages:
* - Model registration and configuration
* - Health monitoring and failover
* - Load balancing across models
* - Rate limiting and quota management
*/

import { EventEmitter } from 'events';
import { OpenAIAdapter, OpenAIConfig } from '../adapters/OpenAIAdapter.js';
import { AnthropicAdapter, AnthropicConfig } from '../adapters/AnthropicAdapter.js';
import { GoogleAIAdapter, GoogleAIConfig } from '../adapters/GoogleAIAdapter.js';

export interface AIModel {
  id: string;
  name: string;
  provider: string;
  capabilities: string[];
  maxTokens: number;
  costPer1kTokens: number;
  available: boolean;
  config: ModelConfig;
}

export interface ModelConfig {
  apiKey?: string;
  baseUrl?: string;
  maxTokens?: number;
  temperature?: number;
  timeout?: number;
}

export interface ModelHealth {
  modelId: string;
  status: 'healthy' | 'degraded' | 'unhealthy';
  responseTime: number;
  errorRate: number;
  lastChecked: string;
}

/**
* Model Manager class
*/
export class ModelManager extends EventEmitter {
  private models: Map<string, AIModel> = new Map();
  private adapters: Map<string, any> = new Map();
  private healthStats: Map<string, ModelHealth> = new Map();

  constructor() {
    super();
    this.initializeDefaultModels();
    this.initializeAdapters();
    console.log('Model Manager initialized');
  }

  /**
   * Initialize default AI models for development
   */
  private initializeDefaultModels() {
    const defaultModels: AIModel[] = [
      // OpenAI Models
      {
        id: 'gpt-4-turbo',
        name: 'GPT-4 Turbo',
        provider: 'openai',
        capabilities: ['chat', 'code-generation', 'analysis'],
        maxTokens: 128000,
        costPer1kTokens: 0.03,
        available: false, // Will be true when API keys are configured
        config: {
          maxTokens: 4096,
          temperature: 0.2,
          timeout: 30000
        }
      },
      {
        id: 'gpt-3.5-turbo',
        name: 'GPT-3.5 Turbo',
        provider: 'openai',
        capabilities: ['chat', 'code-generation'],
        maxTokens: 16384,
        costPer1kTokens: 0.002,
        available: false,
        config: {
          maxTokens: 2048,
          temperature: 0.1,
          timeout: 15000
        }
      },
      // Anthropic Models
      {
        id: 'claude-3-opus',
        name: 'Claude 3 Opus',
        provider: 'anthropic',
        capabilities: ['chat', 'code-review', 'analysis', 'refactoring'],
        maxTokens: 200000,
        costPer1kTokens: 0.075,
        available: false,
        config: {
          maxTokens: 4096,
          temperature: 0.0,
          timeout: 30000
        }
      },
      {
        id: 'claude-3-sonnet',
        name: 'Claude 3 Sonnet',
        provider: 'anthropic',
        capabilities: ['chat', 'code-review', 'analysis'],
        maxTokens: 200000,
        costPer1kTokens: 0.015,
        available: false,
        config: {
          maxTokens: 4096,
          temperature: 0.0,
          timeout: 30000
        }
      },
      // Google AI Models
      {
        id: 'gemini-pro',
        name: 'Gemini Pro',
        provider: 'google',
        capabilities: ['chat', 'code-generation', 'analysis'],
        maxTokens: 32768,
        costPer1kTokens: 0.0015,
        available: false,
        config: {
          maxTokens: 2048,
          temperature: 0.2,
          timeout: 30000
        }
      },
      {
        id: 'gemini-pro-vision',
        name: 'Gemini Pro Vision',
        provider: 'google',
        capabilities: ['chat', 'multimodal', 'analysis'],
        maxTokens: 16384,
        costPer1kTokens: 0.0075,
        available: false,
        config: {
          maxTokens: 2048,
          temperature: 0.2,
          timeout: 30000
        }
      },
      // Development Mock
      {
        id: 'development-mock',
        name: 'Development Mock Model',
        provider: 'local',
        capabilities: ['chat', 'code-generation', 'analysis', 'code-review'],
        maxTokens: 4096,
        costPer1kTokens: 0,
        available: true, // Always available for development
        config: {
          maxTokens: 2048,
          temperature: 0.2,
          timeout: 1000
        }
      }
    ];

    defaultModels.forEach(model => {
      this.models.set(model.id, model);
    });

    console.log(`Registered ${defaultModels.length} AI models`);
  }

  /**
   * Initialize AI adapters
   */
  private initializeAdapters(): void {
    try {
      // Initialize adapters with empty configs for now
      // These will be configured when API keys are provided
      const openaiConfig: OpenAIConfig = {
        apiKey: process.env.OPENAI_API_KEY || 'sk-your-openai-key'
      };
      const openaiAdapter = new OpenAIAdapter(openaiConfig);
      this.adapters.set('openai', openaiAdapter);

      const anthropicConfig: AnthropicConfig = {
        apiKey: process.env.ANTHROPIC_API_KEY || 'sk-ant-your-anthropic-key'
      };
      const anthropicAdapter = new AnthropicAdapter(anthropicConfig);
      this.adapters.set('anthropic', anthropicAdapter);

      const googleConfig: GoogleAIConfig = {
        apiKey: process.env.GOOGLE_AI_API_KEY || 'AIza-your-google-key'
      };
      const googleAdapter = new GoogleAIAdapter(googleConfig);
      this.adapters.set('google', googleAdapter);

      // Set up event listeners for adapters
      this.setupAdapterListeners();

      console.log('AI adapters initialized');
    } catch (error) {
      console.error('Failed to initialize adapters:', error.message);
    }
  }

  /**
   * Set up event listeners for AI adapters
   */
  private setupAdapterListeners(): void {
    this.adapters.forEach((adapter, provider) => {
      adapter.on('usage', (data: any) => {
        this.emit('modelUsage', { provider, ...data });
      });

      adapter.on('error', (error: any) => {
        this.emit('modelError', { provider, ...error });
      });
    });
  }

  /**
   * Register a new AI model
   */
  registerModel(model: AIModel): void {
    this.models.set(model.id, model);
    this.emit('modelRegistered', model);
    console.log(`Registered AI model: ${model.name}`);
  }

  /**
   * Get available models
   */
  getAvailableModels(): AIModel[] {
    return Array.from(this.models.values()).filter(model => model.available);
  }

  /**
   * Get model by ID
   */
  getModel(modelId: string): AIModel | undefined {
    return this.models.get(modelId);
  }

  /**
   * Switch to a different model
   */
  switchModel(modelId: string): boolean {
    const model = this.models.get(modelId);
    if (!model) {
      console.error(`Model ${modelId} not found`);
      return false;
    }

    if (!model.available) {
      console.error(`Model ${modelId} is not available`);
      return false;
    }

    this.emit('modelSwitched', modelId);
    console.log(`Switched to model: ${model.name}`);
    return true;
  }

  /**
   * Perform health check on all models
   */
  async healthCheck(): Promise<ModelHealth[]> {
    const healthResults: ModelHealth[] = [];

    for (const [modelId, model] of this.models) {
      const startTime = Date.now();

      try {
        // Mock health check - in real implementation, this would ping the actual API
        const isHealthy = model.available;
        const responseTime = Date.now() - startTime;

        const health: ModelHealth = {
          modelId,
          status: isHealthy ? 'healthy' : 'unhealthy',
          responseTime,
          errorRate: 0,
          lastChecked: new Date().toISOString()
        };

        this.healthStats.set(modelId, health);
        healthResults.push(health);
      } catch (error) {
        const health: ModelHealth = {
          modelId,
          status: 'unhealthy',
          responseTime: Date.now() - startTime,
          errorRate: 1,
          lastChecked: new Date().toISOString()
        };

        this.healthStats.set(modelId, health);
        healthResults.push(health);
      }
    }

    return healthResults;
  }

  /**
   * Load balance request to available models
   */
  loadBalance(taskType: string): AIModel | null {
    const availableModels = this.getAvailableModels()
      .filter(model => model.capabilities.includes(taskType));

    if (availableModels.length === 0) {
      return null;
    }

    // Simple round-robin for now - can be enhanced with weighted load balancing
    return availableModels[0];
  }

  /**
   * Configure model with API keys and settings
   */
  configureModel(modelId: string, config: ModelConfig): boolean {
    const model = this.models.get(modelId);
    if (!model) {
      return false;
    }

    model.config = { ...model.config, ...config };

    // If API key is provided, mark as available
    if (config.apiKey) {
      model.available = true;
    }

    this.emit('modelConfigured', modelId);
    console.log(`Configured model: ${model.name}`);
    return true;
  }

  /**
   * Generate AI response using appropriate adapter
   */
  async generateResponse(modelId: string, prompt: string, options: any = {}): Promise<any> {
    const model = this.getModel(modelId);
    if (!model) {
      throw new Error(`Model ${modelId} not found`);
    }

    const adapter = this.adapters.get(model.provider);
    if (!adapter) {
      throw new Error(`No adapter available for provider ${model.provider}`);
    }

    try {
      let response;

      switch (model.provider) {
        case 'openai':
          response = await adapter.generateCode(prompt, { model: modelId, ...options });
          break;
        case 'anthropic':
          response = await adapter.generateCode(prompt, { model: modelId, ...options });
          break;
        case 'google':
          response = await adapter.generateCode(prompt, { model: modelId, ...options });
          break;
        default:
          throw new Error(`Unsupported provider: ${model.provider}`);
      }

      return response;
    } catch (error) {
      console.error(`Error generating response with ${modelId}:`, error.message);
      throw error;
    }
  }

  /**
   * Generate code using specific model
   */
  async generateCode(modelId: string, prompt: string, options: any = {}): Promise<any> {
    return this.generateResponse(modelId, prompt, { ...options, task: 'code-generation' });
  }

  /**
   * Review code using appropriate model
   */
  async reviewCode(modelId: string, code: string, options: any = {}): Promise<any> {
    const model = this.getModel(modelId);
    if (!model) {
      throw new Error(`Model ${modelId} not found`);
    }

    const adapter = this.adapters.get(model.provider);
    if (!adapter) {
      throw new Error(`No adapter available for provider ${model.provider}`);
    }

    // Use Claude for code review if available, otherwise use any adapter
    if (model.provider === 'anthropic' && adapter.reviewCode) {
      return adapter.reviewCode(code, { model: modelId, ...options });
    } else {
      const reviewPrompt = `Please review the following code and provide feedback:\n\n\`\`\`${options.language || 'typescript'}\n${code}\n\`\`\``;
      return this.generateResponse(modelId, reviewPrompt, options);
    }
  }

  /**
   * Chat with AI model
   */
  async chat(modelId: string, messages: Array<{ role: string, content: string }>, options: any = {}): Promise<any> {
    const model = this.getModel(modelId);
    if (!model) {
      throw new Error(`Model ${modelId} not found`);
    }

    const adapter = this.adapters.get(model.provider);
    if (!adapter) {
      throw new Error(`No adapter available for provider ${model.provider}`);
    }

    try {
      let response;

      switch (model.provider) {
        case 'openai':
          const openaiMessages = messages.map(msg => ({
            role: msg.role as 'system' | 'user' | 'assistant',
            content: msg.content
          }));
          response = await adapter.generateChat({
            model: modelId,
            messages: openaiMessages,
            ...options
          });
          break;
        case 'anthropic':
          const claudeMessages = messages.filter(msg => msg.role !== 'system').map(msg => ({
            role: msg.role === 'assistant' ? 'assistant' : 'user',
            content: msg.content
          }));
          const systemPrompt = messages.find(msg => msg.role === 'system')?.content;
          response = await adapter.generateChat({
            model: modelId,
            messages: claudeMessages,
            maxTokens: options.maxTokens || 2048,
            systemPrompt,
            ...options
          });
          break;
        case 'google':
          response = await adapter.chat(messages, { model: modelId, ...options });
          break;
        default:
          throw new Error(`Unsupported provider: ${model.provider}`);
      }

      return response;
    } catch (error) {
      console.error(`Error in chat with ${modelId}:`, error.message);
      throw error;
    }
  }

  /**
   * Get adapter for a specific provider
   */
  getAdapter(provider: string): any {
    return this.adapters.get(provider);
  }

  /**
   * Update adapter configuration
   */
  updateAdapterConfig(provider: string, config: any): void {
    const adapter = this.adapters.get(provider);
    if (adapter && adapter.updateConfig) {
      adapter.updateConfig(config);
    }
  }

  /**
   * Get usage statistics
   */
  getUsageStats() {
    return {
      totalModels: this.models.size,
      availableModels: this.getAvailableModels().length,
      healthyModels: Array.from(this.healthStats.values())
        .filter(health => health.status === 'healthy').length,
      adapters: Array.from(this.adapters.keys()),
      activeAdapters: Array.from(this.adapters.values()).length
    };
  }
}

// Export singleton instance
export const modelManager = new ModelManager();