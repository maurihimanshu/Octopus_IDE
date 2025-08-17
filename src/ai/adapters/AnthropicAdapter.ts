/**
* Anthropic Adapter - Handles integration with Anthropic's Claude models
*
* Supports: Claude 3 Opus, Claude 3 Sonnet, Claude 3 Haiku, Claude 2
*/

import { EventEmitter } from 'events';

export interface AnthropicConfig {
  apiKey: string;
  baseUrl?: string;
  timeout?: number;
}

export interface AnthropicRequest {
  model: string;
  messages: ClaudeMessage[];
  maxTokens: number;
  temperature?: number;
  systemPrompt?: string;
  stream?: boolean;
}

export interface ClaudeMessage {
  role: 'user' | 'assistant';
  content: string;
}

export interface AnthropicResponse {
  id: string;
  model: string;
  content: ContentBlock[];
  usage: ClaudeUsage;
  stopReason: string;
  stopSequence?: string;
}

export interface ContentBlock {
  type: 'text';
  text: string;
}

export interface ClaudeUsage {
  inputTokens: number;
  outputTokens: number;
}

/**
* Anthropic Claude API Adapter
*/
export class AnthropicAdapter extends EventEmitter {
  private config: AnthropicConfig;
  private rateLimitInfo: RateLimitInfo = {
    requestsPerMinute: 1000,
    requestsRemaining: 1000,
    resetTime: Date.now() + 60000
  };

  constructor(config: AnthropicConfig) {
    super();
    this.config = {
      baseUrl: 'https://api.anthropic.com/v1',
      timeout: 30000,
      ...config
    };
    console.log('Anthropic Adapter initialized');
  }

  /**
   * Generate chat completion with Claude
   */
  async generateChat(request: AnthropicRequest): Promise<AnthropicResponse> {
    const startTime = Date.now();

    try {
      // Validate request
      this.validateRequest(request);

      // Check rate limits
      await this.checkRateLimit();

      // Prepare request payload
      const payload = {
        model: request.model,
        max_tokens: request.maxTokens || 4096,
        messages: request.messages,
        temperature: request.temperature ?? 0.0,
        stream: request.stream ?? false,
        ...(request.systemPrompt && { system: request.systemPrompt })
      };

      // Make API call
      const response = await this.makeRequest('/messages', payload);

      // Update rate limit info
      this.updateRateLimitInfo(response.headers);

      // Emit usage metrics
      this.emit('usage', {
        model: request.model,
        tokensUsed: response.data.usage.inputTokens + response.data.usage.outputTokens,
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
   * Generate code with Claude (specialized for code tasks)
   */
  async generateCode(prompt: string, options: any = {}): Promise<any> {
    const systemPrompt = `You are Claude, an AI assistant created by Anthropic. You are an expert software developer with deep knowledge of programming languages, best practices, and software engineering principles.

When generating code:
1. Write clean, readable, and well-documented code
2. Follow language-specific best practices and conventions
3. Include error handling where appropriate
4. Add helpful comments explaining complex logic
5. Consider security and performance implications

Language: ${options.language || 'TypeScript'}
Framework: ${options.framework || 'None specified'}`;

    const request: AnthropicRequest = {
      model: options.model || 'claude-3-sonnet-20240229',
      messages: [
        {
          role: 'user',
          content: prompt
        }
      ],
      maxTokens: options.maxTokens || 2048,
      temperature: options.temperature || 0.1,
      systemPrompt
    };

    return this.generateChat(request);
  }

  /**
   * Code review with Claude (specialized for code analysis)
   */
  async reviewCode(code: string, options: any = {}): Promise<any> {
    const systemPrompt = `You are an expert code reviewer. Analyze the provided code and provide constructive feedback on:

1. Code quality and readability
2. Potential bugs or issues
3. Security vulnerabilities
4. Performance improvements
5. Best practices and conventions
6. Suggestions for refactoring

Be thorough but constructive in your feedback.`;

    const request: AnthropicRequest = {
      model: options.model || 'claude-3-opus-20240229',
      messages: [
        {
          role: 'user',
          content: `Please review the following code:\n\n\`\`\`${options.language || 'typescript'}\n${code}\n\`\`\``
        }
      ],
      maxTokens: options.maxTokens || 3000,
      temperature: 0.0,
      systemPrompt
    };

    return this.generateChat(request);
  }

  /**
   * Make HTTP request to Anthropic API
   */
  private async makeRequest(endpoint: string, payload: any): Promise<any> {
    const url = `${this.config.baseUrl}${endpoint}`;

    try {
      // For development, return mock response if no API key
      if (!this.config.apiKey || this.config.apiKey.startsWith('sk-ant-your-')) {
        return this.createMockResponse(payload);
      }

      // In a real implementation, this would use fetch or a HTTP client
      // For now, we'll simulate the API call
      const response = await this.simulateAPICall(url, payload);
      return response;

    } catch (error) {
      throw new Error(`Anthropic API request failed: ${error.message}`);
    }
  }

  /**
   * Create mock response for development
   */
  private createMockResponse(payload: any): any {
    const mockResponse = {
      data: {
        id: `msg_${Date.now()}`,
        model: payload.model,
        content: [
          {
            type: 'text',
            text: this.generateMockContent(payload)
          }
        ],
        usage: {
          inputTokens: this.estimateTokens(JSON.stringify(payload.messages)),
          outputTokens: 200
        },
        stopReason: 'end_turn',
        stopSequence: null
      },
      headers: new Map([
        ['x-ratelimit-requests-limit', '1000'],
        ['x-ratelimit-requests-remaining', '999'],
        ['x-ratelimit-requests-reset', new Date(Date.now() + 60000).toISOString()]
      ])
    };

    console.log(`🤖 Claude Mock Response (${payload.model}):`, mockResponse.data.content[0].text.substring(0, 100) + '...');
    return mockResponse;
  }

  /**
   * Generate appropriate mock content based on request
   */
  private generateMockContent(payload: any): string {
    const lastMessage = payload.messages[payload.messages.length - 1];
    const content = lastMessage.content.toLowerCase();

    if (content.includes('review') || content.includes('analyze')) {
      return `## Code Review Analysis

I've analyzed the provided code. Here's my feedback:

### ✅ Strengths:
- Clean and readable code structure
- Good use of TypeScript types
- Proper error handling patterns

### 🔍 Areas for Improvement:
- Consider adding more detailed comments for complex logic
- Input validation could be enhanced
- Performance could be optimized in certain areas

### 🛡️ Security Considerations:
- Ensure proper input sanitization
- Validate API keys securely
- Consider rate limiting implementation

### 📝 Recommendations:
1. Add unit tests for critical functions
2. Implement proper logging
3. Consider using dependency injection for better testability

This is a mock response from Claude. In production, this would contain detailed, specific feedback about your actual code.`;
    } else if (content.includes('function') || content.includes('code')) {
      return `Here's a well-structured implementation for your request:

\`\`\`typescript
/**
* ${lastMessage.content}
*/
export class ExampleImplementation {
  private readonly logger: Logger;

  constructor(logger: Logger) {
    this.logger = logger;
  }

  /**
   * Main function implementation
   */
  public async execute(input: string): Promise<string> {
    try {
      // Validate input
      if (!input || input.trim().length === 0) {
        throw new Error('Input cannot be empty');
      }

      // Process the request
      const result = await this.processInput(input);

      this.logger.info('Operation completed successfully');
      return result;
    } catch (error) {
      this.logger.error('Operation failed:', error);
      throw error;
    }
  }

  private async processInput(input: string): Promise<string> {
    // Mock implementation
    return \`Processed: \${input}\`;
  }
}
\`\`\`

This implementation follows TypeScript best practices with proper error handling, logging, and type safety. The code is designed to be maintainable and testable.`;
    } else {
      return `I understand you're asking about: "${lastMessage.content}"

This is a thoughtful response from Claude (mock version). Here are some key points to consider:

1. **Context Understanding**: I've analyzed your request and understand the requirements.

2. **Comprehensive Approach**: I'll provide a thorough response that addresses all aspects of your question.

3. **Best Practices**: Any recommendations I provide will follow industry best practices and proven methodologies.

4. **Safety First**: I always prioritize safe, secure, and ethical approaches to problem-solving.

This mock response demonstrates Claude's characteristic careful, thorough approach to tasks. In production, you'd receive detailed, contextually appropriate responses based on my training.

Model used: ${payload.model}
System prompt: ${payload.system ? 'Custom system prompt provided' : 'Default coding assistant prompt'}`;
    }
  }

  /**
   * Simulate API call with delay
   */
  private async simulateAPICall(url: string, payload: any): Promise<any> {
    // Simulate network delay (Claude typically takes a bit longer)
    await new Promise(resolve => setTimeout(resolve, 800 + Math.random() * 1500));

    // Return mock response
    return this.createMockResponse(payload);
  }

  /**
   * Validate request parameters
   */
  private validateRequest(request: AnthropicRequest): void {
    if (!request.model) {
      throw new Error('Model is required');
    }

    if (!request.messages || request.messages.length === 0) {
      throw new Error('Messages are required');
    }

    if (!request.maxTokens || request.maxTokens <= 0) {
      throw new Error('maxTokens must be a positive number');
    }

    // Validate model name
    const supportedModels = [
      'claude-3-opus-20240229',
      'claude-3-sonnet-20240229',
      'claude-3-haiku-20240307',
      'claude-2.1',
      'claude-2.0'
    ];

    if (!supportedModels.includes(request.model)) {
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
    const remaining = headers.get('x-ratelimit-requests-remaining');
    const reset = headers.get('x-ratelimit-requests-reset');

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
  private calculateCost(model: string, usage: ClaudeUsage): number {
    const pricing: Record<string, { input: number; output: number }> = {
      'claude-3-opus': { input: 0.015, output: 0.075 },
      'claude-3-sonnet': { input: 0.003, output: 0.015 },
      'claude-3-haiku': { input: 0.00025, output: 0.00125 },
      'claude-2': { input: 0.008, output: 0.024 }
    };

    const modelKey = Object.keys(pricing).find(key => model.includes(key)) || 'claude-3-haiku';
    const rates = pricing[modelKey];

    return (usage.inputTokens / 1000) * rates.input +
      (usage.outputTokens / 1000) * rates.output;
  }

  /**
   * Estimate token count (rough approximation)
   */
  private estimateTokens(text: string): number {
    // Claude uses similar tokenization to GPT models
    return Math.ceil(text.length / 4);
  }

  /**
   * Get adapter status
   */
  public getStatus(): any {
    return {
      provider: 'anthropic',
      connected: true,
      rateLimitInfo: this.rateLimitInfo,
      supportedModels: [
        'claude-3-opus-20240229',
        'claude-3-sonnet-20240229',
        'claude-3-haiku-20240307',
        'claude-2.1',
        'claude-2.0'
      ]
    };
  }
}

interface RateLimitInfo {
  requestsPerMinute: number;
  requestsRemaining: number;
  resetTime: number;
}