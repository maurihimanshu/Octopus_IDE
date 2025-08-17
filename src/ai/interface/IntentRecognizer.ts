/**
* Intent Recognizer - Natural language understanding for user requests
*
* This class provides:
* - Intent classification for user messages
* - Entity extraction from requests
* - Context-aware intent resolution
* - Confidence scoring for intent predictions
*/

import { EventEmitter } from 'events';

export interface Intent {
  type: IntentType;
  confidence: number;
  entities: ExtractedEntity[];
  metadata: IntentMetadata;
}

export type IntentType =
  | 'code-generation'
  | 'code-review'
  | 'code-refactoring'
  | 'code-debugging'
  | 'code-explanation'
  | 'file-operation'
  | 'project-analysis'
  | 'general-chat'
  | 'help-request'
  | 'settings-change'
  | 'search-query';

export interface ExtractedEntity {
  type: EntityType;
  value: string;
  confidence: number;
  startIndex: number;
  endIndex: number;
}

export type EntityType =
  | 'language'
  | 'framework'
  | 'file-path'
  | 'function-name'
  | 'class-name'
  | 'variable-name'
  | 'error-type'
  | 'tool-name'
  | 'command'
  | 'number'
  | 'date-time';

export interface IntentMetadata {
  complexity: 'simple' | 'medium' | 'complex';
  urgency: 'low' | 'medium' | 'high';
  category: 'development' | 'assistance' | 'configuration' | 'general';
  requiresContext: boolean;
  suggestedModel: string;
  estimatedTokens: number;
}

export interface RecognitionContext {
  activeFile?: string;
  selectedCode?: string;
  projectLanguage?: string;
  recentIntents?: Intent[];
  conversationHistory?: string[];
}

/**
* Intent Recognizer Class
*/
export class IntentRecognizer extends EventEmitter {
  private patterns: Map<IntentType, IntentPattern[]> = new Map();
  private entityExtractors: Map<EntityType, EntityExtractor> = new Map();
  private contextualModifiers: ContextualModifier[] = [];

  constructor() {
    super();
    this.initializePatterns();
    this.initializeEntityExtractors();
    this.initializeContextualModifiers();
    console.log('Intent Recognizer initialized');
  }

  /**
   * Recognize intent from user message
   */
  async recognizeIntent(message: string, context?: RecognitionContext): Promise<Intent> {
    const normalizedMessage = this.normalizeMessage(message);

    // Extract entities first
    const entities = await this.extractEntities(normalizedMessage);

    // Recognize primary intent
    const intentScores = await this.scoreIntents(normalizedMessage, entities, context);

    // Get best intent with confidence
    const bestIntent = this.getBestIntent(intentScores);

    // Apply contextual modifications
    const contextualIntent = this.applyContextualModifiers(bestIntent, context, entities);

    // Generate metadata
    const metadata = this.generateIntentMetadata(contextualIntent, message, entities, context);

    const finalIntent: Intent = {
      type: contextualIntent.type,
      confidence: contextualIntent.confidence,
      entities,
      metadata
    };

    this.emit('intentRecognized', { message, intent: finalIntent, context });
    console.log(`Recognized intent: ${finalIntent.type} (confidence: ${finalIntent.confidence.toFixed(2)})`);

    return finalIntent;
  }

  /**
   * Initialize intent recognition patterns
   */
  private initializePatterns(): void {
    // Code Generation Patterns
    this.patterns.set('code-generation', [
      { pattern: /\b(create|generate|write|build|implement|make)\b.*\b(function|class|component|method|api|interface)\b/i, weight: 0.9 },
      { pattern: /\b(add|create)\b.*\b(feature|functionality)\b/i, weight: 0.8 },
      { pattern: /\bshow me how to\b.*\b(code|implement|create)\b/i, weight: 0.85 },
      { pattern: /\bi need\b.*\b(function|class|component|script)\b/i, weight: 0.8 },
      { pattern: /\b(scaffold|boilerplate|template)\b/i, weight: 0.7 },
      { pattern: /\bcan you (write|create|generate|code)\b/i, weight: 0.75 }
    ]);

    // Code Review Patterns
    this.patterns.set('code-review', [
      { pattern: /\b(review|check|analyze|examine|look at)\b.*\bcode\b/i, weight: 0.9 },
      { pattern: /\b(feedback|suggestions|improvements)\b.*\bcode\b/i, weight: 0.85 },
      { pattern: /\bis this.*\b(correct|good|right|proper)\b/i, weight: 0.8 },
      { pattern: /\b(optimize|improve|enhance)\b.*\bcode\b/i, weight: 0.75 },
      { pattern: /\bwhat.*wrong.*\bcode\b/i, weight: 0.8 },
      { pattern: /\b(validate|verify)\b.*\bcode\b/i, weight: 0.7 }
    ]);

    // Code Refactoring Patterns
    this.patterns.set('code-refactoring', [
      { pattern: /\b(refactor|restructure|reorganize|clean up)\b/i, weight: 0.9 },
      { pattern: /\b(simplify|optimize|improve)\b.*\bcode\b/i, weight: 0.8 },
      { pattern: /\bmake.*\b(cleaner|better|more efficient)\b/i, weight: 0.75 },
      { pattern: /\b(extract|split|merge)\b.*\b(function|method|class)\b/i, weight: 0.85 },
      { pattern: /\breduce.*\b(complexity|duplication)\b/i, weight: 0.8 }
    ]);

    // Code Debugging Patterns
    this.patterns.set('code-debugging', [
      { pattern: /\b(debug|fix|solve|troubleshoot)\b/i, weight: 0.9 },
      { pattern: /\b(error|bug|issue|problem)\b/i, weight: 0.85 },
      { pattern: /\b(not working|broken|failing)\b/i, weight: 0.8 },
      { pattern: /\bwhy.*\b(error|fail|crash|break)\b/i, weight: 0.85 },
      { pattern: /\b(exception|stack trace|runtime error)\b/i, weight: 0.9 },
      { pattern: /\bhelp.*\b(fix|solve|debug)\b/i, weight: 0.75 }
    ]);

    // Code Explanation Patterns
    this.patterns.set('code-explanation', [
      { pattern: /\b(explain|describe|what does|how does|why does)\b/i, weight: 0.9 },
      { pattern: /\b(understand|meaning|purpose)\b.*\bcode\b/i, weight: 0.85 },
      { pattern: /\bwhat is\b.*\b(function|class|method|variable)\b/i, weight: 0.8 },
      { pattern: /\bhow.*\b(work|function|operate)\b/i, weight: 0.75 },
      { pattern: /\b(documentation|comments)\b.*\bcode\b/i, weight: 0.7 }
    ]);

    // File Operation Patterns
    this.patterns.set('file-operation', [
      { pattern: /\b(open|create|delete|rename|move)\b.*\bfile\b/i, weight: 0.9 },
      { pattern: /\b(save|load|import|export)\b.*\bfile\b/i, weight: 0.85 },
      { pattern: /\bfile.*\b(structure|organization|management)\b/i, weight: 0.8 },
      { pattern: /\b(find|search|locate)\b.*\bfile\b/i, weight: 0.75 }
    ]);

    // Project Analysis Patterns
    this.patterns.set('project-analysis', [
      { pattern: /\b(analyze|overview|summary)\b.*\bproject\b/i, weight: 0.9 },
      { pattern: /\bproject.*\b(structure|architecture|dependencies)\b/i, weight: 0.85 },
      { pattern: /\b(codebase|repository)\b.*\b(analysis|review)\b/i, weight: 0.8 },
      { pattern: /\bwhat.*\bproject.*\b(about|contain|include)\b/i, weight: 0.75 }
    ]);

    // General Chat Patterns
    this.patterns.set('general-chat', [
      { pattern: /^(hi|hello|hey|good (morning|afternoon|evening))/i, weight: 0.9 },
      { pattern: /\b(thank you|thanks|appreciate)\b/i, weight: 0.8 },
      { pattern: /\bhow are you\b/i, weight: 0.9 },
      { pattern: /\b(chat|talk|discuss)\b(?!.*\bcode\b)/i, weight: 0.7 }
    ]);

    // Help Request Patterns
    this.patterns.set('help-request', [
      { pattern: /\b(help|assist|support)\b/i, weight: 0.9 },
      { pattern: /\bcan you.*\bhelp\b/i, weight: 0.85 },
      { pattern: /\bi (need|want|require).*\bhelp\b/i, weight: 0.8 },
      { pattern: /\b(guidance|assistance|support)\b/i, weight: 0.75 },
      { pattern: /\bhow do i\b/i, weight: 0.8 }
    ]);

    // Settings Change Patterns
    this.patterns.set('settings-change', [
      { pattern: /\b(setting|config|configuration|preference)\b/i, weight: 0.9 },
      { pattern: /\b(change|modify|update|adjust)\b.*\b(setting|config)\b/i, weight: 0.85 },
      { pattern: /\bconfigure\b/i, weight: 0.8 },
      { pattern: /\b(enable|disable|turn (on|off))\b/i, weight: 0.75 }
    ]);

    // Search Query Patterns
    this.patterns.set('search-query', [
      { pattern: /\b(search|find|look for|locate)\b/i, weight: 0.9 },
      { pattern: /\bwhere is\b/i, weight: 0.85 },
      { pattern: /\bshow me.*\b(files|functions|classes)\b/i, weight: 0.8 },
      { pattern: /\blist.*\b(all|files|functions)\b/i, weight: 0.75 }
    ]);

    console.log(`Initialized ${this.patterns.size} intent pattern categories`);
  }

  /**
   * Initialize entity extractors
   */
  private initializeEntityExtractors(): void {
    // Language extractor
    this.entityExtractors.set('language', {
      pattern: /\b(javascript|typescript|python|java|c\+\+|c#|php|ruby|go|rust|swift|kotlin|dart|scala)\b/gi,
      confidence: 0.9
    });

    // Framework extractor
    this.entityExtractors.set('framework', {
      pattern: /\b(react|angular|vue|express|django|flask|spring|laravel|rails|next\.?js|nuxt\.?js|svelte|electron)\b/gi,
      confidence: 0.85
    });

    // File path extractor
    this.entityExtractors.set('file-path', {
      pattern: /[\/\\]?[\w\-\.]+[\/\\][\w\-\.\/\\]*\.\w+|\b[\w\-]+\.\w{2,4}\b/g,
      confidence: 0.8
    });

    // Function name extractor
    this.entityExtractors.set('function-name', {
      pattern: /\b[a-zA-Z_$][a-zA-Z0-9_$]*\(\)/g,
      confidence: 0.75
    });

    // Class name extractor
    this.entityExtractors.set('class-name', {
      pattern: /\bclass\s+([A-Z][a-zA-Z0-9_$]*)\b|\b([A-Z][a-zA-Z0-9_$]*)\s+class\b/g,
      confidence: 0.8
    });

    // Variable name extractor
    this.entityExtractors.set('variable-name', {
      pattern: /\b[a-zA-Z_$][a-zA-Z0-9_$]*\b/g,
      confidence: 0.6
    });

    // Error type extractor
    this.entityExtractors.set('error-type', {
      pattern: /\b(syntax error|runtime error|type error|reference error|null pointer|undefined|exception)\b/gi,
      confidence: 0.9
    });

    // Tool name extractor
    this.entityExtractors.set('tool-name', {
      pattern: /\b(git|npm|yarn|webpack|babel|eslint|prettier|jest|mocha|cypress|docker|kubernetes)\b/gi,
      confidence: 0.85
    });

    // Command extractor
    this.entityExtractors.set('command', {
      pattern: /\b(npm (install|run|start|build|test)|git (add|commit|push|pull|clone)|yarn (add|install|start))\b/gi,
      confidence: 0.9
    });

    // Number extractor
    this.entityExtractors.set('number', {
      pattern: /\b\d+(\.\d+)?\b/g,
      confidence: 0.8
    });

    console.log(`Initialized ${this.entityExtractors.size} entity extractors`);
  }

  /**
   * Initialize contextual modifiers
   */
  private initializeContextualModifiers(): void {
    this.contextualModifiers = [
      // If user has selected code, boost code-review and refactoring intents
      {
        condition: (context) => !!context?.selectedCode,
        modifier: (intent, context) => {
          if (intent.type === 'code-review' || intent.type === 'code-refactoring') {
            return { ...intent, confidence: Math.min(intent.confidence + 0.2, 1.0) };
          }
          return intent;
        }
      },

      // If user is in a specific file, boost file-related intents
      {
        condition: (context) => !!context?.activeFile,
        modifier: (intent, context) => {
          if (intent.type === 'file-operation' || intent.type === 'code-explanation') {
            return { ...intent, confidence: Math.min(intent.confidence + 0.15, 1.0) };
          }
          return intent;
        }
      },

      // If recent intent was debugging, boost debugging-related intents
      {
        condition: (context) => context?.recentIntents?.some(i => i.type === 'code-debugging'),
        modifier: (intent, context) => {
          if (intent.type === 'code-debugging' || intent.type === 'code-explanation') {
            return { ...intent, confidence: Math.min(intent.confidence + 0.1, 1.0) };
          }
          return intent;
        }
      }
    ];

    console.log(`Initialized ${this.contextualModifiers.length} contextual modifiers`);
  }

  /**
   * Normalize message for processing
   */
  private normalizeMessage(message: string): string {
    return message
      .toLowerCase()
      .trim()
      .replace(/\s+/g, ' ') // Normalize whitespace
      .replace(/[^\w\s.,!?()-]/g, ''); // Remove special characters except basic punctuation
  }

  /**
   * Extract entities from message
   */
  private async extractEntities(message: string): Promise<ExtractedEntity[]> {
    const entities: ExtractedEntity[] = [];

    for (const [entityType, extractor] of this.entityExtractors) {
      const matches = message.matchAll(extractor.pattern);

      for (const match of matches) {
        if (match.index !== undefined) {
          entities.push({
            type: entityType,
            value: match[0],
            confidence: extractor.confidence,
            startIndex: match.index,
            endIndex: match.index + match[0].length
          });
        }
      }
    }

    // Sort by position in text
    entities.sort((a, b) => a.startIndex - b.startIndex);

    return entities;
  }

  /**
   * Score all intents for the message
   */
  private async scoreIntents(
    message: string,
    entities: ExtractedEntity[],
    context?: RecognitionContext
  ): Promise<Map<IntentType, number>> {
    const scores = new Map<IntentType, number>();

    for (const [intentType, patterns] of this.patterns) {
      let totalScore = 0;
      let matchCount = 0;

      for (const pattern of patterns) {
        if (pattern.pattern.test(message)) {
          totalScore += pattern.weight;
          matchCount++;
        }
      }

      // Calculate average score
      const avgScore = matchCount > 0 ? totalScore / patterns.length : 0;

      // Boost score based on relevant entities
      const entityBoost = this.calculateEntityBoost(intentType, entities);

      const finalScore = Math.min(avgScore + entityBoost, 1.0);
      scores.set(intentType, finalScore);
    }

    return scores;
  }

  /**
   * Calculate entity boost for intent
   */
  private calculateEntityBoost(intentType: IntentType, entities: ExtractedEntity[]): number {
    let boost = 0;

    // Map entity types to intent types
    const entityRelevance: Partial<Record<IntentType, EntityType[]>> = {
      'code-generation': ['language', 'framework', 'function-name', 'class-name'],
      'code-review': ['language', 'function-name', 'class-name', 'file-path'],
      'code-debugging': ['error-type', 'language', 'function-name'],
      'file-operation': ['file-path', 'command'],
      'project-analysis': ['framework', 'tool-name', 'language'],
      'settings-change': ['tool-name', 'command']
    };

    const relevantEntityTypes = entityRelevance[intentType] || [];
    const relevantEntities = entities.filter(e => relevantEntityTypes.includes(e.type));

    if (relevantEntities.length > 0) {
      boost = Math.min(relevantEntities.length * 0.1, 0.3);
    }

    return boost;
  }

  /**
   * Get best intent from scores
   */
  private getBestIntent(scores: Map<IntentType, number>): { type: IntentType; confidence: number } {
    let bestIntent: IntentType = 'general-chat';
    let bestScore = 0;

    for (const [intentType, score] of scores) {
      if (score > bestScore) {
        bestScore = score;
        bestIntent = intentType;
      }
    }

    // If no strong match, default to general chat
    if (bestScore < 0.3) {
      bestIntent = 'general-chat';
      bestScore = 0.5;
    }

    return { type: bestIntent, confidence: bestScore };
  }

  /**
   * Apply contextual modifiers
   */
  private applyContextualModifiers(
    intent: { type: IntentType; confidence: number },
    context?: RecognitionContext,
    entities?: ExtractedEntity[]
  ): { type: IntentType; confidence: number } {
    let modifiedIntent = { ...intent };

    for (const modifier of this.contextualModifiers) {
      if (modifier.condition(context)) {
        modifiedIntent = modifier.modifier(modifiedIntent, context);
      }
    }

    return modifiedIntent;
  }

  /**
   * Generate intent metadata
   */
  private generateIntentMetadata(
    intent: { type: IntentType; confidence: number },
    originalMessage: string,
    entities: ExtractedEntity[],
    context?: RecognitionContext
  ): IntentMetadata {
    // Determine complexity
    let complexity: 'simple' | 'medium' | 'complex' = 'simple';
    if (originalMessage.length > 100 || entities.length > 3) {
      complexity = 'medium';
    }
    if (originalMessage.length > 200 || entities.length > 5 || context?.selectedCode) {
      complexity = 'complex';
    }

    // Determine urgency
    let urgency: 'low' | 'medium' | 'high' = 'low';
    if (intent.type === 'code-debugging' || originalMessage.includes('urgent') || originalMessage.includes('help')) {
      urgency = 'high';
    } else if (intent.type === 'code-generation' || intent.type === 'code-review') {
      urgency = 'medium';
    }

    // Determine category
    let category: 'development' | 'assistance' | 'configuration' | 'general' = 'general';
    if (['code-generation', 'code-review', 'code-refactoring', 'code-debugging', 'code-explanation'].includes(intent.type)) {
      category = 'development';
    } else if (intent.type === 'help-request') {
      category = 'assistance';
    } else if (intent.type === 'settings-change') {
      category = 'configuration';
    }

    // Determine if context is required
    const requiresContext = ['code-review', 'code-refactoring', 'code-debugging', 'file-operation'].includes(intent.type);

    // Suggest optimal model
    let suggestedModel = 'gpt-3.5-turbo';
    if (intent.type === 'code-review' || complexity === 'complex') {
      suggestedModel = 'claude-3-sonnet';
    } else if (intent.type === 'code-generation' || intent.type === 'code-refactoring') {
      suggestedModel = 'gpt-4-turbo';
    }

    // Estimate tokens needed
    let estimatedTokens = Math.max(500, originalMessage.length * 3);
    if (complexity === 'complex') estimatedTokens *= 2;
    if (context?.selectedCode) estimatedTokens += context.selectedCode.length;

    return {
      complexity,
      urgency,
      category,
      requiresContext,
      suggestedModel,
      estimatedTokens: Math.min(estimatedTokens, 4096)
    };
  }

  /**
   * Add custom intent pattern
   */
  addCustomPattern(intentType: IntentType, pattern: RegExp, weight: number): void {
    if (!this.patterns.has(intentType)) {
      this.patterns.set(intentType, []);
    }

    this.patterns.get(intentType)!.push({ pattern, weight });
    console.log(`Added custom pattern for intent: ${intentType}`);
  }

  /**
   * Get intent statistics
   */
  getIntentStats(): any {
    return {
      totalPatterns: Array.from(this.patterns.values()).reduce((sum, patterns) => sum + patterns.length, 0),
      intentTypes: Array.from(this.patterns.keys()),
      entityTypes: Array.from(this.entityExtractors.keys()),
      contextualModifiers: this.contextualModifiers.length
    };
  }
}

interface IntentPattern {
  pattern: RegExp;
  weight: number;
}

interface EntityExtractor {
  pattern: RegExp;
  confidence: number;
}

interface ContextualModifier {
  condition: (context?: RecognitionContext) => boolean;
  modifier: (intent: { type: IntentType; confidence: number }, context?: RecognitionContext) => { type: IntentType; confidence: number };
}

export default IntentRecognizer;