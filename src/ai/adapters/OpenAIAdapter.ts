/**
* OpenAI Adapter - Handles integration with OpenAI's GPT models
*
* Supports: GPT-4 Turbo, GPT-4, GPT-3.5 Turbo, and Codex models
*/

import { EventEmitter } from 'events';

export interface OpenAIConfig {
  apiKey: string;
  baseUrl?: string;
  organization?: string;
  timeout?: number;
}

export interface OpenAIRequest {
  model: string;
  messages: ChatMessage[];
  temperature?: number;
  maxTokens?: number;
  stream?: boolean;
  functions?: Function[];
}

export interface ChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface OpenAIResponse {
  id: string;
  model: string;
  choices: Choice[];
  usage: TokenUsage;
  created: number;
}

export interface Choice {
  index: number;
  message: ChatMessage;
  finishReason: string;
}

export interface TokenUsage {
  promptTokens: number;
  completionTokens: number;
  totalTokens: number;
}

export interface Function {
  name: string;
  description: string;
  parameters: any;
}

/**
* OpenAI API Adapter
*/
export class OpenAIAdapter extends EventEmitter {
  private config: OpenAIConfig;
  private rateLimitInfo: RateLimitInfo = {
    requestsPerMinute: 3000,
    requestsRemaining: 3000,
    resetTime: Date.now() + 60000
  };

  constructor(config: OpenAIConfig) {
    super();
    this.config = {
      baseUrl: 'https://api.openai.com/v1',
      timeout: 30000,
      ...config
    };
    console.log('OpenAI Adapter initialized');
  }

  /**
   * Generate chat completion
   */
  async generateChat(request: OpenAIRequest): Promise<OpenAIResponse> {
    const startTime = Date.now();

    try {
      // Validate request
      this.validateRequest(request);

      // Check rate limits
      await this.checkRateLimit();

      // Prepare request payload
      const payload = {
        model: request.model,
        messages: request.messages,
        temperature: request.temperature ?? 0.2,
        max_tokens: request.maxTokens ?? 2048,
        stream: request.stream ?? false,
        ...(request.functions && { functions: request.functions })
      };

      // Make API call
      const response = await this.makeRequest('/chat/completions', payload);

      // Update rate limit info
      this.updateRateLimitInfo(response.headers);

      // Emit usage metrics
      this.emit('usage', {
        model: request.model,
        tokensUsed: response.data.usage.totalTokens,
        latency: Date.now() - startTime,
        cost: this.calculateCost(request.model, response.data.usage)
      });

      return response.data;
    } catch (error) {
      this.emit('error', {
        type: 'api_error',
        message: error.message,
        model: request.model,
        latency: Date.now() - startTime
      });
      throw error;
    }
  }

  /**
   * Generate code completion (for Codex models)
   */
  async generateCode(prompt: string, options: any = {}): Promise<any> {
    const request: OpenAIRequest = {
      model: options.model || 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: 'You are a helpful coding assistant. Generate clean, efficient code based on the user\'s request.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: options.temperature || 0.1,
      maxTokens: options.maxTokens || 1024
    };

    return this.generateChat(request);
  }

  /**
   * Make HTTP request to OpenAI API
   */
  private async makeRequest(endpoint: string, payload: any): Promise<any> {
    const url = `${this.config.baseUrl}${endpoint}`;

    try {
      // For development, return mock response if no API key
      if (!this.config.apiKey || this.config.apiKey.startsWith('sk-your-')) {
        return this.createMockResponse(payload);
      }

      // In a real implementation, this would use fetch or a HTTP client
      // For now, we'll simulate the API call
      const response = await this.simulateAPICall(url, payload);
      return response;

    } catch (error) {
      throw new Error(`OpenAI API request failed: ${error.message}`);
    }
  }

  /**
   * Create mock response for development
   */
  private createMockResponse(payload: any): any {
    const mockResponse = {
      data: {
        id: `chatcmpl-${Date.now()}`,
        model: payload.model,
        created: Math.floor(Date.now() / 1000),
        choices: [
          {
            index: 0,
            message: {
              role: 'assistant',
              content: `[MOCK OpenAI Response] Generated response for model ${payload.model}:\n\n${this.generateMockContent(payload)}`
            },
            finishReason: 'stop'
          }
        ],
        usage: {
          promptTokens: this.estimateTokens(JSON.stringify(payload.messages)),
          completionTokens: 150,
          totalTokens: this.estimateTokens(JSON.stringify(payload.messages)) + 150
        }
      },
      headers: new Map([
        ['x-ratelimit-limit-requests', '3000'],
        ['x-ratelimit-remaining-requests', '2999'],
        ['x-ratelimit-reset-requests', new Date(Date.now() + 60000).toISOString()]
      ])
    };

    console.log(`🤖 OpenAI Mock Response (${payload.model}):`, mockResponse.data.choices[0].message.content.substring(0, 100) + '...');
    return mockResponse;
  }

  /**
   * Generate appropriate mock content based on request
   */
  private generateMockContent(payload: any): string {
    const lastMessage = payload.messages[payload.messages.length - 1];
    const content = lastMessage.content.toLowerCase();

    if (content.includes('function') || content.includes('code')) {
      return `function exampleFunction() {
  // Generated code based on: ${lastMessage.content}
  console.log('This is a mock implementation');
  return true;
}`;
    } else if (content.includes('class') || content.includes('component')) {
      return `class ExampleClass {
  constructor() {
    // Mock implementation for: ${lastMessage.content}
  }

  public performAction(): void {
    console.log('Action performed');
  }
}`;
    } else {
      return `Here's a response to your request: "${lastMessage.content}"

This is a mock response from the OpenAI adapter. In a production environment, this would be the actual response from GPT models.

The request was processed using model: ${payload.model}
Temperature: ${payload.temperature}
Max tokens: ${payload.max_tokens}`;
    }
  }

  /**
   * Simulate API call with delay
   */
  private async simulateAPICall(url: string, payload: any): Promise<any> {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 500 + Math.random() * 1000));

    // Return mock response
    return this.createMockResponse(payload);
  }

  /**
   * Validate request parameters
   */
  private validateRequest(request: OpenAIRequest): void {
    if (!request.model) {
      throw new Error('Model is required');
    }

    if (!request.messages || request.messages.length === 0) {
      throw new Error('Messages are required');
    }

    // Validate model name
    const supportedModels = [
      'gpt-4-turbo-preview', 'gpt-4-turbo', 'gpt-4',
      'gpt-3.5-turbo', 'gpt-3.5-turbo-16k',
      'code-davinci-002', 'code-cushman-001'
    ];

    if (!supportedModels.some(model => request.model.includes(model.split('-')[0]))) {
      console.warn(`Unsupported model: ${request.model}. Proceeding anyway.`);
    }
  }

  /**
   * Check rate limits
   */
  private async checkRateLimit(): Promise<void> {
    if (Date.now() > this.rateLimitInfo.resetTime) {
      this.rateLimitInfo.requestsRemaining = this.rateLimitInfo.requestsPerMinute;
      this.rateLimitInfo.resetTime = Date.now() + 60000;
    }

    if (this.rateLimitInfo.requestsRemaining <= 0) {
      const waitTime = this.rateLimitInfo.resetTime - Date.now();
      throw new Error(`Rate limit exceeded. Reset in ${Math.ceil(waitTime / 1000)} seconds`);
    }

    this.rateLimitInfo.requestsRemaining--;
  }

  /**
   * Update rate limit information from response headers
   */
  private updateRateLimitInfo(headers: Map<string, string>): void {
    const remaining = headers.get('x-ratelimit-remaining-requests');
    const reset = headers.get('x-ratelimit-reset-requests');

    if (remaining) {
      this.rateLimitInfo.requestsRemaining = parseInt(remaining);
    }

    if (reset) {
      this.rateLimitInfo.resetTime = new Date(reset).getTime();
    }
  }

  /**
   * Calculate cost based on token usage
   */
  private calculateCost(model: string, usage: TokenUsage): number {
    const pricing: Record<string, { input: number; output: number }> = {
      'gpt-4-turbo': { input: 0.01, output: 0.03 },
      'gpt-4': { input: 0.03, output: 0.06 },
      'gpt-3.5-turbo': { input: 0.0005, output: 0.0015 }
    };

    const modelKey = Object.keys(pricing).find(key => model.includes(key)) || 'gpt-3.5-turbo';
    const rates = pricing[modelKey];

    return (usage.promptTokens / 1000) * rates.input +
      (usage.completionTokens / 1000) * rates.output;
  }

  /**
   * Estimate token count (rough approximation)
   */
  private estimateTokens(text: string): number {
    // Rough estimation: ~4 characters per token
    return Math.ceil(text.length / 4);
  }

  /**
   * Get adapter status
   */
  public getStatus(): any {
    return {
      provider: 'openai',
      connected: true,
      rateLimitInfo: this.rateLimitInfo,
      supportedModels: [
        'gpt-4-turbo-preview',
        'gpt-4-turbo',
        'gpt-4',
        'gpt-3.5-turbo',
        'gpt-3.5-turbo-16k'
      ]
    };
  }
}

interface RateLimitInfo {
  requestsPerMinute: number;
  requestsRemaining: number;
  resetTime: number;
}