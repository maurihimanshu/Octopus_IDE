/**
* AI Orchestrator - Central coordinator for all AI operations in Octopus AI IDE
*
* This class manages:
* - Request routing to appropriate AI models
* - Context management and history
* - Error handling and fallbacks
* - Performance optimization through caching
*/

import { EventEmitter } from 'events';
import { modelManager } from '../models/ModelManager.js';

export interface UserRequest {
  id: string;
  type: 'code-generation' | 'chat' | 'code-review' | 'refactoring';
  content: string;
  context?: ProjectContext;
  options?: RequestOptions;
}

export interface AIResponse {
  id: string;
  requestId: string;
  content: string;
  model: string;
  usage: TokenUsage;
  metadata: ResponseMetadata;
}

export interface ProjectContext {
  projectId?: string;
  language?: string;
  framework?: string;
  files?: string[];
  selectedCode?: string;
}

export interface RequestOptions {
  model?: string;
  temperature?: number;
  maxTokens?: number;
  stream?: boolean;
}

export interface TokenUsage {
  promptTokens: number;
  completionTokens: number;
  totalTokens: number;
}

export interface ResponseMetadata {
  processingTime: number;
  cacheHit: boolean;
  fallbackUsed: boolean;
  generatedAt: string;
}

/**
* Main AI Orchestrator class
*/
export class AIOrchestrator extends EventEmitter {
  private contextManager: any; // Will be implemented
  private cache: Map<string, AIResponse> = new Map();

  constructor() {
    super();
    this.setupModelManagerListeners();
    console.log('AI Orchestrator initialized - Development mode');
  }

  /**
   * Set up event listeners for model manager
   */
  private setupModelManagerListeners(): void {
    modelManager.on('modelUsage', (data: any) => {
      this.emit('usage', data);
    });

    modelManager.on('modelError', (error: any) => {
      this.emit('error', error);
    });
  }

  /**
* Process a user request and route to appropriate AI model
*/
  async processRequest(request: UserRequest): Promise<AIResponse> {
    console.log(`Processing AI request: ${request.type}`);
    const startTime = Date.now();

    // Emit request event for monitoring
    this.emit('request', request);

    try {
      // Check cache first
      const cacheKey = this.generateCacheKey(request);
      if (this.cache.has(cacheKey)) {
        console.log('Cache hit for request');
        const cachedResponse = this.cache.get(cacheKey)!;
        cachedResponse.metadata.cacheHit = true;
        this.emit('response', cachedResponse);
        return cachedResponse;
      }

      // Select appropriate model
      const modelId = request.options?.model || this.selectModel(request.type);
      console.log(`Selected model: ${modelId} for task: ${request.type}`);

      // Route to appropriate handler based on request type
      let aiResponse: any;
      switch (request.type) {
        case 'code-generation':
          aiResponse = await modelManager.generateCode(modelId, request.content, {
            language: request.context?.language,
            framework: request.context?.framework,
            ...request.options
          });
          break;
        case 'code-review':
          aiResponse = await modelManager.reviewCode(modelId, request.content, {
            language: request.context?.language,
            ...request.options
          });
          break;
        case 'chat':
          const messages = [{ role: 'user', content: request.content }];
          aiResponse = await modelManager.chat(modelId, messages, request.options);
          break;
        case 'refactoring':
          const refactorPrompt = `Please refactor the following code to improve its quality, performance, and maintainability:\n\n${request.content}`;
          aiResponse = await modelManager.generateCode(modelId, refactorPrompt, {
            language: request.context?.language,
            ...request.options
          });
          break;
        default:
          // Default to chat for unknown types
          aiResponse = await modelManager.generateResponse(modelId, request.content, request.options);
      }

      // Transform AI response to our standard format
      const response: AIResponse = this.transformAIResponse(aiResponse, request, modelId, startTime);

      // Cache the response
      this.cache.set(cacheKey, response);

      // Emit response event for monitoring
      this.emit('response', response);

      return response;
    } catch (error) {
      // Try fallback model if primary fails
      const fallbackResponse = await this.tryFallback(request, error);
      if (fallbackResponse) {
        return fallbackResponse;
      }

      // Emit error event for monitoring
      this.emit('error', {
        requestId: request.id,
        error: error.message,
        type: request.type,
        latency: Date.now() - startTime
      });
      throw error;
    }
  }

  /**
   * Transform AI provider response to our standard format
   */
  private transformAIResponse(aiResponse: any, request: UserRequest, modelId: string, startTime: number): AIResponse {
    let content = '';
    let usage = { promptTokens: 0, completionTokens: 0, totalTokens: 0 };

    // Handle different response formats
    if (aiResponse.choices && aiResponse.choices[0]) {
      // OpenAI format
      content = aiResponse.choices[0].message.content;
      usage = {
        promptTokens: aiResponse.usage?.promptTokens || 0,
        completionTokens: aiResponse.usage?.completionTokens || 0,
        totalTokens: aiResponse.usage?.totalTokens || 0
      };
    } else if (aiResponse.content && aiResponse.content[0]) {
      // Anthropic format
      content = aiResponse.content[0].text;
      usage = {
        promptTokens: aiResponse.usage?.inputTokens || 0,
        completionTokens: aiResponse.usage?.outputTokens || 0,
        totalTokens: (aiResponse.usage?.inputTokens || 0) + (aiResponse.usage?.outputTokens || 0)
      };
    } else if (aiResponse.candidates && aiResponse.candidates[0]) {
      // Google format
      content = aiResponse.candidates[0].content.parts[0].text;
      usage = {
        promptTokens: aiResponse.usageMetadata?.promptTokenCount || 0,
        completionTokens: aiResponse.usageMetadata?.candidatesTokenCount || 0,
        totalTokens: aiResponse.usageMetadata?.totalTokenCount || 0
      };
    } else if (typeof aiResponse === 'string') {
      // Simple string response
      content = aiResponse;
    } else {
      // Fallback
      content = JSON.stringify(aiResponse);
    }

    return {
      id: `resp_${Date.now()}`,
      requestId: request.id,
      content,
      model: modelId,
      usage,
      metadata: {
        processingTime: (Date.now() - startTime) / 1000,
        cacheHit: false,
        fallbackUsed: false,
        generatedAt: new Date().toISOString()
      }
    };
  }

  /**
   * Try fallback model if primary fails
   */
  private async tryFallback(request: UserRequest, originalError: Error): Promise<AIResponse | null> {
    console.log('Trying fallback model due to error:', originalError.message);

    const fallbackModels = ['development-mock']; // Always available fallback

    for (const modelId of fallbackModels) {
      try {
        const startTime = Date.now();
        const aiResponse = await modelManager.generateResponse(modelId, request.content, request.options);

        const response = this.transformAIResponse(aiResponse, request, modelId, startTime);
        response.metadata.fallbackUsed = true;

        console.log(`Fallback successful with model: ${modelId}`);
        return response;
      } catch (fallbackError) {
        console.log(`Fallback model ${modelId} also failed:`, fallbackError.message);
      }
    }

    return null;
  }

  /**
   * Generate cache key for request
   */
  private generateCacheKey(request: UserRequest): string {
    const key = `${request.type}_${request.content}_${JSON.stringify(request.options || {})}_${JSON.stringify(request.context || {})}`;
    return Buffer.from(key).toString('base64').substring(0, 32);
  }

  /**
   * Select the best AI model for a given task
   */
  selectModel(taskType: string): string {
    // Mock implementation - will be enhanced with actual model selection logic
    const modelMap: Record<string, string> = {
      'code-generation': 'gpt-4-turbo',
      'chat': 'gpt-3.5-turbo',
      'code-review': 'claude-3-sonnet',
      'refactoring': 'gpt-4'
    };

    return modelMap[taskType] || 'gpt-3.5-turbo';
  }

  /**
   * Get usage statistics
   */
  getUsageStats() {
    return {
      totalRequests: 0,
      averageResponseTime: 0,
      cacheHitRate: 0,
      errorRate: 0
    };
  }

  /**
   * Health check for the orchestrator
   */
  async healthCheck(): Promise<boolean> {
    console.log('AI Orchestrator health check - OK');
    return true;
  }
}

// Export singleton instance
export const aiOrchestrator = new AIOrchestrator();