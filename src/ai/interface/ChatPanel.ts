/**
* Chat Panel - Main conversational interface for Octopus AI IDE
*
* This component provides:
* - Real-time chat interface with AI models
* - Message history and conversation management
* - Code highlighting and formatting in responses
* - Context-aware conversations
*/

import { EventEmitter } from 'events';
import { aiOrchestrator } from '../orchestrator/AIOrchestrator.js';

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: number;
  metadata?: {
    model?: string;
    tokens?: number;
    processingTime?: number;
    codeBlocks?: CodeBlock[];
  };
}

export interface CodeBlock {
  language: string;
  code: string;
  startLine: number;
  endLine: number;
}

export interface ConversationContext {
  projectPath?: string;
  activeFile?: string;
  selectedCode?: string;
  language?: string;
  framework?: string;
  conversationId: string;
}

export interface ChatOptions {
  model?: string;
  temperature?: number;
  maxTokens?: number;
  includeContext?: boolean;
}

/**
* Chat Panel Component
*/
export class ChatPanel extends EventEmitter {
  private messages: ChatMessage[] = [];
  private context: ConversationContext;
  private isProcessing: boolean = false;
  private container: HTMLElement | null = null;

  constructor(context: ConversationContext) {
    super();
    this.context = context;
    console.log('Chat Panel initialized for conversation:', context.conversationId);
  }

  /**
   * Initialize the chat panel UI
   */
  async initialize(containerElement: HTMLElement): Promise<void> {
    this.container = containerElement;
    this.setupUI();
    this.setupEventListeners();

    // Add welcome message
    await this.addSystemMessage(
      "👋 Welcome to Octopus AI IDE! I'm your AI coding assistant. How can I help you today?"
    );

    this.emit('initialized');
    console.log('Chat Panel UI initialized');
  }

  /**
   * Send a message to the AI
   */
  async sendMessage(content: string, options: ChatOptions = {}): Promise<void> {
    if (this.isProcessing) {
      console.warn('Already processing a message, please wait');
      return;
    }

    try {
      this.isProcessing = true;

      // Add user message to chat
      const userMessage = await this.addUserMessage(content);

      // Show typing indicator
      this.showTypingIndicator();

      // Prepare AI request
      const request = {
        id: `req_${Date.now()}`,
        type: this.detectIntentType(content),
        content,
        context: {
          projectId: this.context.projectPath,
          language: this.context.language,
          framework: this.context.framework,
          selectedCode: this.context.selectedCode
        },
        options: {
          model: options.model,
          temperature: options.temperature || 0.2,
          maxTokens: options.maxTokens || 2048,
          includeContext: options.includeContext !== false
        }
      };

      // Get AI response
      const aiResponse = await aiOrchestrator.processRequest(request);

      // Hide typing indicator
      this.hideTypingIndicator();

      // Add AI response to chat
      await this.addAssistantMessage(aiResponse.content, {
        model: aiResponse.model,
        tokens: aiResponse.usage.totalTokens,
        processingTime: aiResponse.metadata.processingTime
      });

      // Emit conversation event
      this.emit('messageExchange', {
        userMessage,
        aiResponse,
        context: this.context
      });

    } catch (error) {
      this.hideTypingIndicator();
      await this.addErrorMessage(`Sorry, I encountered an error: ${error.message}`);
      this.emit('error', error);
    } finally {
      this.isProcessing = false;
    }
  }

  /**
   * Add user message to conversation
   */
  private async addUserMessage(content: string): Promise<ChatMessage> {
    const message: ChatMessage = {
      id: `msg_${Date.now()}_user`,
      role: 'user',
      content,
      timestamp: Date.now()
    };

    this.messages.push(message);
    this.renderMessage(message);
    this.scrollToBottom();

    return message;
  }

  /**
   * Add assistant message to conversation
   */
  private async addAssistantMessage(content: string, metadata?: any): Promise<ChatMessage> {
    const message: ChatMessage = {
      id: `msg_${Date.now()}_assistant`,
      role: 'assistant',
      content,
      timestamp: Date.now(),
      metadata: {
        ...metadata,
        codeBlocks: this.extractCodeBlocks(content)
      }
    };

    this.messages.push(message);
    this.renderMessage(message);
    this.scrollToBottom();

    return message;
  }

  /**
   * Add system message to conversation
   */
  private async addSystemMessage(content: string): Promise<ChatMessage> {
    const message: ChatMessage = {
      id: `msg_${Date.now()}_system`,
      role: 'system',
      content,
      timestamp: Date.now()
    };

    this.messages.push(message);
    this.renderMessage(message);
    this.scrollToBottom();

    return message;
  }

  /**
   * Add error message to conversation
   */
  private async addErrorMessage(content: string): Promise<ChatMessage> {
    const message: ChatMessage = {
      id: `msg_${Date.now()}_error`,
      role: 'system',
      content: `❌ ${content}`,
      timestamp: Date.now()
    };

    this.messages.push(message);
    this.renderMessage(message);
    this.scrollToBottom();

    return message;
  }

  /**
   * Detect the intent type from user message
   */
  private detectIntentType(content: string): string {
    const lowerContent = content.toLowerCase();

    // Code generation patterns
    if (lowerContent.includes('create') || lowerContent.includes('generate') ||
      lowerContent.includes('write') || lowerContent.includes('implement')) {
      return 'code-generation';
    }

    // Code review patterns
    if (lowerContent.includes('review') || lowerContent.includes('check') ||
      lowerContent.includes('analyze') || lowerContent.includes('feedback')) {
      return 'code-review';
    }

    // Refactoring patterns
    if (lowerContent.includes('refactor') || lowerContent.includes('improve') ||
      lowerContent.includes('optimize') || lowerContent.includes('clean up')) {
      return 'refactoring';
    }

    // Debug patterns
    if (lowerContent.includes('debug') || lowerContent.includes('fix') ||
      lowerContent.includes('error') || lowerContent.includes('bug')) {
      return 'debugging';
    }

    // Explain patterns
    if (lowerContent.includes('explain') || lowerContent.includes('what does') ||
      lowerContent.includes('how does') || lowerContent.includes('why')) {
      return 'explanation';
    }

    // Default to chat
    return 'chat';
  }

  /**
   * Extract code blocks from message content
   */
  private extractCodeBlocks(content: string): CodeBlock[] {
    const codeBlocks: CodeBlock[] = [];
    const codeBlockRegex = /```(\w+)?\n([\s\S]*?)```/g;
    let match;

    while ((match = codeBlockRegex.exec(content)) !== null) {
      codeBlocks.push({
        language: match[1] || 'text',
        code: match[2].trim(),
        startLine: 0,
        endLine: 0
      });
    }

    return codeBlocks;
  }

  /**
   * Setup the chat panel UI (mock implementation for now)
   */
  private setupUI(): void {
    if (!this.container) return;

    this.container.innerHTML = `
      <div class="octopus-chat-panel">
        <div class="chat-header">
          <h3>🐙 Octopus AI Assistant</h3>
          <div class="chat-controls">
            <button class="clear-chat" title="Clear conversation">🗑️</button>
            <button class="settings" title="Chat settings">⚙️</button>
          </div>
        </div>
        <div class="chat-messages" id="chatMessages">
          <!-- Messages will be rendered here -->
        </div>
        <div class="typing-indicator" id="typingIndicator" style="display: none;">
          <div class="typing-dots">
            <span></span><span></span><span></span>
          </div>
          <span>AI is thinking...</span>
        </div>
        <div class="chat-input-container">
          <div class="context-info" id="contextInfo">
            <!-- Context information will be shown here -->
          </div>
          <div class="input-wrapper">
            <textarea
              id="chatInput"
              placeholder="Ask me anything about your code..."
              rows="3"
              class="chat-input"
            ></textarea>
            <button id="sendButton" class="send-button" title="Send message">
              ➤
            </button>
          </div>
        </div>
      </div>
    `;

    // Apply basic styling
    this.applyStyles();
  }

  /**
   * Setup event listeners
   */
  private setupEventListeners(): void {
    if (!this.container) return;

    const chatInput = this.container.querySelector('#chatInput') as HTMLTextAreaElement;
    const sendButton = this.container.querySelector('#sendButton') as HTMLButtonElement;
    const clearButton = this.container.querySelector('.clear-chat') as HTMLButtonElement;

    // Send message on button click
    sendButton?.addEventListener('click', () => {
      this.handleSendMessage();
    });

    // Send message on Enter (but allow Shift+Enter for new lines)
    chatInput?.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        this.handleSendMessage();
      }
    });

    // Auto-resize textarea
    chatInput?.addEventListener('input', () => {
      this.autoResizeTextarea(chatInput);
    });

    // Clear conversation
    clearButton?.addEventListener('click', () => {
      this.clearConversation();
    });
  }

  /**
   * Handle send message action
   */
  private handleSendMessage(): void {
    const chatInput = this.container?.querySelector('#chatInput') as HTMLTextAreaElement;
    if (!chatInput) return;

    const content = chatInput.value.trim();
    if (!content || this.isProcessing) return;

    chatInput.value = '';
    this.autoResizeTextarea(chatInput);

    this.sendMessage(content);
  }

  /**
   * Render a message in the chat
   */
  private renderMessage(message: ChatMessage): void {
    const messagesContainer = this.container?.querySelector('#chatMessages');
    if (!messagesContainer) return;

    const messageElement = document.createElement('div');
    messageElement.className = `message message-${message.role}`;
    messageElement.setAttribute('data-message-id', message.id);

    const timeStr = new Date(message.timestamp).toLocaleTimeString();
    const modelInfo = message.metadata?.model ? ` (${message.metadata.model})` : '';

    messageElement.innerHTML = `
      <div class="message-header">
        <span class="message-role">${this.getRoleIcon(message.role)} ${message.role}${modelInfo}</span>
        <span class="message-time">${timeStr}</span>
      </div>
      <div class="message-content">
        ${this.formatMessageContent(message.content)}
      </div>
      ${message.metadata ? this.renderMessageMetadata(message.metadata) : ''}
    `;

    messagesContainer.appendChild(messageElement);
  }

  /**
   * Get role icon
   */
  private getRoleIcon(role: string): string {
    switch (role) {
      case 'user': return '👤';
      case 'assistant': return '🤖';
      case 'system': return '💡';
      default: return '❓';
    }
  }

  /**
   * Format message content with syntax highlighting
   */
  private formatMessageContent(content: string): string {
    // Basic markdown-style formatting
    let formatted = content
      .replace(/```(\w+)?\n([\s\S]*?)```/g, (match, lang, code) => {
        return `<pre class="code-block" data-language="${lang || 'text'}"><code>${this.escapeHtml(code.trim())}</pre>`;
      })
      .replace(/`([^`]+)`/g, '<code class="inline-code">$1</code>')
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/\n/g, '<br>');

    return formatted;
  }

  /**
   * Render message metadata
   */
  private renderMessageMetadata(metadata: any): string {
    if (!metadata.tokens && !metadata.processingTime) return '';

    return `
      <div class="message-metadata">
        ${metadata.tokens ? `<span class="metadata-item">📊 ${metadata.tokens} tokens</span>` : ''}
        ${metadata.processingTime ? `<span class="metadata-item">⏱️ ${metadata.processingTime.toFixed(2)}s</span>` : ''}
      </div>
    `;
  }

  /**
   * Show typing indicator
   */
  private showTypingIndicator(): void {
    const indicator = this.container?.querySelector('#typingIndicator');
    if (indicator) {
      indicator.style.display = 'flex';
      this.scrollToBottom();
    }
  }

  /**
   * Hide typing indicator
   */
  private hideTypingIndicator(): void {
    const indicator = this.container?.querySelector('#typingIndicator');
    if (indicator) {
      indicator.style.display = 'none';
    }
  }

  /**
   * Auto-resize textarea
   */
  private autoResizeTextarea(textarea: HTMLTextAreaElement): void {
    textarea.style.height = 'auto';
    textarea.style.height = Math.min(textarea.scrollHeight, 120) + 'px';
  }

  /**
   * Scroll to bottom of messages
   */
  private scrollToBottom(): void {
    const messagesContainer = this.container?.querySelector('#chatMessages');
    if (messagesContainer) {
      messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }
  }

  /**
   * Clear conversation
   */
  private clearConversation(): void {
    this.messages = [];
    const messagesContainer = this.container?.querySelector('#chatMessages');
    if (messagesContainer) {
      messagesContainer.innerHTML = '';
    }
    this.addSystemMessage("Conversation cleared. How can I help you?");
    this.emit('conversationCleared');
  }

  /**
   * Escape HTML for safe rendering
   */
  private escapeHtml(text: string): string {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  /**
   * Apply basic CSS styles (embedded for now)
   */
  private applyStyles(): void {
    if (!this.container) return;

    const style = document.createElement('style');
    style.textContent = `
      .octopus-chat-panel {
        display: flex;
        flex-direction: column;
        height: 100%;
        background: #1e1e1e;
        color: #cccccc;
        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      }

      .chat-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 12px 16px;
        background: #2d2d30;
        border-bottom: 1px solid #3e3e42;
      }

      .chat-header h3 {
        margin: 0;
        font-size: 14px;
        font-weight: 600;
      }

      .chat-controls {
        display: flex;
        gap: 8px;
      }

      .chat-controls button {
        background: none;
        border: none;
        color: #cccccc;
        cursor: pointer;
        padding: 4px;
        border-radius: 4px;
        font-size: 14px;
      }

      .chat-controls button:hover {
        background: #3e3e42;
      }

      .chat-messages {
        flex: 1;
        overflow-y: auto;
        padding: 16px;
        display: flex;
        flex-direction: column;
        gap: 16px;
      }

      .message {
        display: flex;
        flex-direction: column;
        gap: 4px;
      }

      .message-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        font-size: 12px;
        opacity: 0.7;
      }

      .message-role {
        font-weight: 600;
      }

      .message-content {
        padding: 12px;
        border-radius: 8px;
        line-height: 1.5;
      }

      .message-user .message-content {
        background: #0e639c;
        margin-left: 20%;
      }

      .message-assistant .message-content {
        background: #2d2d30;
        margin-right: 20%;
      }

      .message-system .message-content {
        background: #3a3d41;
        text-align: center;
        font-style: italic;
      }

      .code-block {
        background: #1a1a1a;
        border: 1px solid #3e3e42;
        border-radius: 4px;
        padding: 12px;
        margin: 8px 0;
        overflow-x: auto;
      }

      .inline-code {
        background: #3e3e42;
        padding: 2px 4px;
        border-radius: 3px;
        font-family: 'Consolas', 'Monaco', monospace;
        font-size: 0.9em;
      }

      .message-metadata {
        font-size: 11px;
        opacity: 0.6;
        display: flex;
        gap: 12px;
        margin-top: 4px;
      }

      .typing-indicator {
        display: flex;
        align-items: center;
        gap: 8px;
        padding: 12px 16px;
        font-size: 12px;
        opacity: 0.7;
      }

      .typing-dots {
        display: flex;
        gap: 4px;
      }

      .typing-dots span {
        width: 6px;
        height: 6px;
        background: #cccccc;
        border-radius: 50%;
        animation: typing 1.4s infinite ease-in-out both;
      }

      .typing-dots span:nth-child(1) { animation-delay: -0.32s; }
      .typing-dots span:nth-child(2) { animation-delay: -0.16s; }

      @keyframes typing {
        0%, 80%, 100% {
          transform: scale(0);
          opacity: 0.5;
        }
        40% {
          transform: scale(1);
          opacity: 1;
        }
      }

      .chat-input-container {
        padding: 16px;
        background: #2d2d30;
        border-top: 1px solid #3e3e42;
      }

      .input-wrapper {
        display: flex;
        gap: 8px;
        align-items: flex-end;
      }

      .chat-input {
        flex: 1;
        background: #1e1e1e;
        border: 1px solid #3e3e42;
        border-radius: 6px;
        padding: 12px;
        color: #cccccc;
        font-family: inherit;
        font-size: 14px;
        resize: none;
        min-height: 20px;
        max-height: 120px;
      }

      .chat-input:focus {
        outline: none;
        border-color: #0e639c;
      }

      .send-button {
        background: #0e639c;
        border: none;
        border-radius: 6px;
        color: white;
        width: 40px;
        height: 40px;
        cursor: pointer;
        font-size: 16px;
        display: flex;
        align-items: center;
        justify-content: center;
      }

      .send-button:hover {
        background: #1177bb;
      }

      .send-button:disabled {
        background: #3e3e42;
        cursor: not-allowed;
      }
    `;

    document.head.appendChild(style);
  }

  /**
   * Update conversation context
   */
  updateContext(newContext: Partial<ConversationContext>): void {
    this.context = { ...this.context, ...newContext };
    this.updateContextDisplay();
    this.emit('contextUpdated', this.context);
  }

  /**
   * Update context display
   */
  private updateContextDisplay(): void {
    const contextInfo = this.container?.querySelector('#contextInfo');
    if (!contextInfo) return;

    let contextText = '';
    if (this.context.activeFile) {
      contextText += `📄 ${this.context.activeFile}`;
    }
    if (this.context.language) {
      contextText += ` (${this.context.language})`;
    }
    if (this.context.selectedCode) {
      contextText += ` • Selected: ${this.context.selectedCode.length} chars`;
    }

    contextInfo.textContent = contextText;
    contextInfo.style.display = contextText ? 'block' : 'none';
  }

  /**
   * Get conversation history
   */
  getMessages(): ChatMessage[] {
    return [...this.messages];
  }

  /**
   * Get conversation context
   */
  getContext(): ConversationContext {
    return { ...this.context };
  }

  /**
   * Export conversation
   */
  exportConversation(): any {
    return {
      conversationId: this.context.conversationId,
      context: this.context,
      messages: this.messages,
      exportedAt: new Date().toISOString()
    };
  }
}

export default ChatPanel;