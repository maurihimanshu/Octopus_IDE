/**
* Conversation Manager - Manages multiple conversations, history, and context
*
* This class handles:
* - Multiple concurrent conversations
* - Conversation history persistence
* - Context management and switching
* - Conversation search and filtering
*/

import { EventEmitter } from 'events';
import { ChatMessage, ConversationContext } from './ChatPanel.js';

export interface Conversation {
  id: string;
  title: string;
  context: ConversationContext;
  messages: ChatMessage[];
  createdAt: number;
  updatedAt: number;
  metadata: ConversationMetadata;
}

export interface ConversationMetadata {
  totalMessages: number;
  totalTokens: number;
  lastModel: string;
  participants: string[];
  tags: string[];
  isArchived: boolean;
  isPinned: boolean;
}

export interface ConversationSummary {
  id: string;
  title: string;
  lastMessage: string;
  lastActivity: number;
  messageCount: number;
  isActive: boolean;
}

export interface SearchOptions {
  query?: string;
  tags?: string[];
  dateRange?: {
    start: number;
    end: number;
  };
  includeArchived?: boolean;
  sortBy?: 'recent' | 'title' | 'messages';
  limit?: number;
}

/**
* Conversation Manager Class
*/
export class ConversationManager extends EventEmitter {
  private conversations: Map<string, Conversation> = new Map();
  private activeConversationId: string | null = null;
  private maxConversations: number = 100;
  private autoSaveInterval: NodeJS.Timeout | null = null;

  constructor() {
    super();
    this.setupAutoSave();
    console.log('Conversation Manager initialized');
  }

  /**
   * Create a new conversation
   */
  async createConversation(context: ConversationContext, title?: string): Promise<Conversation> {
    const conversation: Conversation = {
      id: context.conversationId,
      title: title || this.generateConversationTitle(context),
      context,
      messages: [],
      createdAt: Date.now(),
      updatedAt: Date.now(),
      metadata: {
        totalMessages: 0,
        totalTokens: 0,
        lastModel: '',
        participants: ['user', 'assistant'],
        tags: this.generateInitialTags(context),
        isArchived: false,
        isPinned: false
      }
    };

    this.conversations.set(conversation.id, conversation);
    this.setActiveConversation(conversation.id);

    // Cleanup old conversations if we exceed the limit
    await this.cleanupOldConversations();

    this.emit('conversationCreated', conversation);
    console.log(`Created conversation: ${conversation.title} (${conversation.id})`);

    return conversation;
  }

  /**
   * Get a conversation by ID
   */
  getConversation(conversationId: string): Conversation | null {
    return this.conversations.get(conversationId) || null;
  }

  /**
   * Get the active conversation
   */
  getActiveConversation(): Conversation | null {
    if (!this.activeConversationId) return null;
    return this.getConversation(this.activeConversationId);
  }

  /**
   * Set the active conversation
   */
  setActiveConversation(conversationId: string): boolean {
    const conversation = this.getConversation(conversationId);
    if (!conversation) {
      console.warn(`Conversation ${conversationId} not found`);
      return false;
    }

    this.activeConversationId = conversationId;
    this.emit('activeConversationChanged', conversation);
    console.log(`Switched to conversation: ${conversation.title}`);

    return true;
  }

  /**
   * Add a message to a conversation
   */
  async addMessage(conversationId: string, message: ChatMessage): Promise<void> {
    const conversation = this.getConversation(conversationId);
    if (!conversation) {
      throw new Error(`Conversation ${conversationId} not found`);
    }

    // Add message to conversation
    conversation.messages.push(message);
    conversation.updatedAt = Date.now();
    conversation.metadata.totalMessages++;

    // Update token count if available
    if (message.metadata?.tokens) {
      conversation.metadata.totalTokens += message.metadata.tokens;
    }

    // Update last model used
    if (message.metadata?.model) {
      conversation.metadata.lastModel = message.metadata.model;
    }

    // Update conversation title if it's still the default and we have enough context
    if (conversation.title.startsWith('New Conversation') && conversation.messages.length >= 2) {
      conversation.title = this.generateSmartTitle(conversation);
    }

    this.emit('messageAdded', { conversationId, message });
    console.log(`Added message to conversation ${conversationId}: ${message.role}`);
  }

  /**
   * Update conversation context
   */
  async updateConversationContext(conversationId: string, newContext: Partial<ConversationContext>): Promise<void> {
    const conversation = this.getConversation(conversationId);
    if (!conversation) {
      throw new Error(`Conversation ${conversationId} not found`);
    }

    conversation.context = { ...conversation.context, ...newContext };
    conversation.updatedAt = Date.now();

    this.emit('conversationContextUpdated', { conversationId, context: conversation.context });
    console.log(`Updated context for conversation ${conversationId}`);
  }

  /**
   * Update conversation title
   */
  async updateConversationTitle(conversationId: string, title: string): Promise<void> {
    const conversation = this.getConversation(conversationId);
    if (!conversation) {
      throw new Error(`Conversation ${conversationId} not found`);
    }

    conversation.title = title;
    conversation.updatedAt = Date.now();

    this.emit('conversationTitleUpdated', { conversationId, title });
    console.log(`Updated title for conversation ${conversationId}: ${title}`);
  }

  /**
   * Delete a conversation
   */
  async deleteConversation(conversationId: string): Promise<boolean> {
    const conversation = this.getConversation(conversationId);
    if (!conversation) {
      return false;
    }

    this.conversations.delete(conversationId);

    // If this was the active conversation, switch to another one
    if (this.activeConversationId === conversationId) {
      const remainingConversations = this.getAllConversations();
      if (remainingConversations.length > 0) {
        this.setActiveConversation(remainingConversations[0].id);
      } else {
        this.activeConversationId = null;
      }
    }

    this.emit('conversationDeleted', { conversationId, conversation });
    console.log(`Deleted conversation: ${conversation.title}`);

    return true;
  }

  /**
   * Archive/Unarchive a conversation
   */
  async toggleArchiveConversation(conversationId: string): Promise<boolean> {
    const conversation = this.getConversation(conversationId);
    if (!conversation) {
      return false;
    }

    conversation.metadata.isArchived = !conversation.metadata.isArchived;
    conversation.updatedAt = Date.now();

    this.emit('conversationArchiveToggled', { conversationId, isArchived: conversation.metadata.isArchived });
    console.log(`${conversation.metadata.isArchived ? 'Archived' : 'Unarchived'} conversation: ${conversation.title}`);

    return true;
  }

  /**
   * Pin/Unpin a conversation
   */
  async togglePinConversation(conversationId: string): Promise<boolean> {
    const conversation = this.getConversation(conversationId);
    if (!conversation) {
      return false;
    }

    conversation.metadata.isPinned = !conversation.metadata.isPinned;
    conversation.updatedAt = Date.now();

    this.emit('conversationPinToggled', { conversationId, isPinned: conversation.metadata.isPinned });
    console.log(`${conversation.metadata.isPinned ? 'Pinned' : 'Unpinned'} conversation: ${conversation.title}`);

    return true;
  }

  /**
   * Search conversations
   */
  async searchConversations(options: SearchOptions = {}): Promise<Conversation[]> {
    const conversations = this.getAllConversations();
    let filtered = conversations;

    // Filter by query (search in title and message content)
    if (options.query) {
      const query = options.query.toLowerCase();
      filtered = filtered.filter(conv => {
        const titleMatch = conv.title.toLowerCase().includes(query);
        const messageMatch = conv.messages.some(msg =>
          msg.content.toLowerCase().includes(query)
        );
        return titleMatch || messageMatch;
      });
    }

    // Filter by tags
    if (options.tags && options.tags.length > 0) {
      filtered = filtered.filter(conv =>
        options.tags!.some(tag => conv.metadata.tags.includes(tag))
      );
    }

    // Filter by date range
    if (options.dateRange) {
      filtered = filtered.filter(conv =>
        conv.updatedAt >= options.dateRange!.start &&
        conv.updatedAt <= options.dateRange!.end
      );
    }

    // Filter archived conversations
    if (!options.includeArchived) {
      filtered = filtered.filter(conv => !conv.metadata.isArchived);
    }

    // Sort conversations
    const sortBy = options.sortBy || 'recent';
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'title':
          return a.title.localeCompare(b.title);
        case 'messages':
          return b.metadata.totalMessages - a.metadata.totalMessages;
        case 'recent':
        default:
          return b.updatedAt - a.updatedAt;
      }
    });

    // Apply limit
    if (options.limit && options.limit > 0) {
      filtered = filtered.slice(0, options.limit);
    }

    return filtered;
  }

  /**
   * Get conversation summaries
   */
  getConversationSummaries(): ConversationSummary[] {
    return this.getAllConversations().map(conv => ({
      id: conv.id,
      title: conv.title,
      lastMessage: this.getLastMessagePreview(conv),
      lastActivity: conv.updatedAt,
      messageCount: conv.metadata.totalMessages,
      isActive: conv.id === this.activeConversationId
    }));
  }

  /**
   * Get all conversations
   */
  getAllConversations(): Conversation[] {
    return Array.from(this.conversations.values());
  }

  /**
   * Clear all conversations
   */
  async clearAllConversations(): Promise<void> {
    const count = this.conversations.size;
    this.conversations.clear();
    this.activeConversationId = null;

    this.emit('allConversationsCleared', { count });
    console.log(`Cleared ${count} conversations`);
  }

  /**
   * Export conversations
   */
  async exportConversations(conversationIds?: string[]): Promise<any> {
    const conversations = conversationIds
      ? conversationIds.map(id => this.getConversation(id)).filter(Boolean)
      : this.getAllConversations();

    return {
      exportedAt: new Date().toISOString(),
      version: '1.0',
      totalConversations: conversations.length,
      conversations: conversations.map(conv => ({
        ...conv,
        messages: conv!.messages.map(msg => ({
          ...msg,
          // Remove any sensitive metadata
          metadata: msg.metadata ? {
            model: msg.metadata.model,
            tokens: msg.metadata.tokens,
            processingTime: msg.metadata.processingTime
          } : undefined
        }))
      }))
    };
  }

  /**
   * Import conversations
   */
  async importConversations(data: any): Promise<{ imported: number; errors: string[] }> {
    const errors: string[] = [];
    let imported = 0;

    try {
      if (!data.conversations || !Array.isArray(data.conversations)) {
        throw new Error('Invalid import data format');
      }

      for (const convData of data.conversations) {
        try {
          // Validate conversation data
          if (!convData.id || !convData.title || !convData.context) {
            errors.push(`Invalid conversation data: missing required fields`);
            continue;
          }

          // Generate new ID if conversation already exists
          let newId = convData.id;
          if (this.conversations.has(newId)) {
            newId = `imported_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
          }

          const conversation: Conversation = {
            ...convData,
            id: newId,
            updatedAt: Date.now()
          };

          this.conversations.set(newId, conversation);
          imported++;

        } catch (error) {
          errors.push(`Failed to import conversation ${convData.id}: ${error.message}`);
        }
      }

      this.emit('conversationsImported', { imported, errors });
      console.log(`Imported ${imported} conversations with ${errors.length} errors`);

    } catch (error) {
      errors.push(`Import failed: ${error.message}`);
    }

    return { imported, errors };
  }

  /**
   * Generate conversation title from context
   */
  private generateConversationTitle(context: ConversationContext): string {
    const timestamp = new Date().toLocaleString();

    if (context.activeFile) {
      const fileName = context.activeFile.split('/').pop() || context.activeFile;
      return `Discussion about ${fileName}`;
    }

    if (context.language) {
      return `${context.language} Development Chat`;
    }

    if (context.projectPath) {
      const projectName = context.projectPath.split('/').pop() || 'Project';
      return `${projectName} Project Chat`;
    }

    return `New Conversation - ${timestamp}`;
  }

  /**
   * Generate smart title based on conversation content
   */
  private generateSmartTitle(conversation: Conversation): string {
    // Get the first user message that's substantial
    const firstUserMessage = conversation.messages.find(msg =>
      msg.role === 'user' && msg.content.length > 10
    );

    if (firstUserMessage) {
      // Extract key words and create a title
      const content = firstUserMessage.content.toLowerCase();
      const words = content.split(' ').slice(0, 5);

      // Clean up and capitalize
      const title = words
        .filter(word => word.length > 2)
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');

      return title.length > 5 ? title : conversation.title;
    }

    return conversation.title;
  }

  /**
   * Generate initial tags from context
   */
  private generateInitialTags(context: ConversationContext): string[] {
    const tags: string[] = [];

    if (context.language) {
      tags.push(context.language.toLowerCase());
    }

    if (context.framework) {
      tags.push(context.framework.toLowerCase());
    }

    if (context.activeFile) {
      const extension = context.activeFile.split('.').pop();
      if (extension) {
        tags.push(extension.toLowerCase());
      }
    }

    // Add default tags
    tags.push('development', 'ai-assisted');

    return [...new Set(tags)]; // Remove duplicates
  }

  /**
   * Get last message preview
   */
  private getLastMessagePreview(conversation: Conversation): string {
    if (conversation.messages.length === 0) {
      return 'No messages yet';
    }

    const lastMessage = conversation.messages[conversation.messages.length - 1];
    const preview = lastMessage.content.substring(0, 50);
    return preview.length < lastMessage.content.length ? `${preview}...` : preview;
  }

  /**
   * Cleanup old conversations if we exceed the limit
   */
  private async cleanupOldConversations(): Promise<void> {
    if (this.conversations.size <= this.maxConversations) {
      return;
    }

    const conversations = this.getAllConversations()
      .filter(conv => !conv.metadata.isPinned) // Don't delete pinned conversations
      .sort((a, b) => a.updatedAt - b.updatedAt); // Sort by oldest first

    const toDelete = conversations.slice(0, this.conversations.size - this.maxConversations);

    for (const conv of toDelete) {
      await this.deleteConversation(conv.id);
    }

    console.log(`Cleaned up ${toDelete.length} old conversations`);
  }

  /**
   * Setup auto-save functionality
   */
  private setupAutoSave(): void {
    // Auto-save every 30 seconds
    this.autoSaveInterval = setInterval(() => {
      this.saveToLocalStorage();
    }, 30000);
  }

  /**
   * Save conversations to localStorage (for persistence)
   */
  private saveToLocalStorage(): void {
    try {
      const data = {
        conversations: Array.from(this.conversations.entries()),
        activeConversationId: this.activeConversationId,
        savedAt: Date.now()
      };

      localStorage.setItem('octopus-conversations', JSON.stringify(data));
      console.log('Conversations saved to localStorage');
    } catch (error) {
      console.error('Failed to save conversations:', error);
    }
  }

  /**
   * Load conversations from localStorage
   */
  async loadFromLocalStorage(): Promise<void> {
    try {
      const stored = localStorage.getItem('octopus-conversations');
      if (!stored) return;

      const data = JSON.parse(stored);
      if (!data.conversations) return;

      this.conversations = new Map(data.conversations);
      this.activeConversationId = data.activeConversationId;

      this.emit('conversationsLoaded', {
        count: this.conversations.size,
        activeId: this.activeConversationId
      });

      console.log(`Loaded ${this.conversations.size} conversations from localStorage`);
    } catch (error) {
      console.error('Failed to load conversations:', error);
    }
  }

  /**
   * Get usage statistics
   */
  getUsageStats(): any {
    const conversations = this.getAllConversations();

    return {
      totalConversations: conversations.length,
      totalMessages: conversations.reduce((sum, conv) => sum + conv.metadata.totalMessages, 0),
      totalTokens: conversations.reduce((sum, conv) => sum + conv.metadata.totalTokens, 0),
      activeConversations: conversations.filter(conv => !conv.metadata.isArchived).length,
      pinnedConversations: conversations.filter(conv => conv.metadata.isPinned).length,
      averageMessagesPerConversation: conversations.length > 0
        ? Math.round(conversations.reduce((sum, conv) => sum + conv.metadata.totalMessages, 0) / conversations.length)
        : 0
    };
  }

  /**
   * Cleanup resources
   */
  destroy(): void {
    if (this.autoSaveInterval) {
      clearInterval(this.autoSaveInterval);
      this.autoSaveInterval = null;
    }

    this.saveToLocalStorage();
    this.removeAllListeners();
    console.log('Conversation Manager destroyed');
  }
}

export default ConversationManager;