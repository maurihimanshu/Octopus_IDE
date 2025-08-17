/**
* Auto-Completion Engine - Intelligent, context-aware code completions
*
* This class provides:
* - Context-aware AI-powered code completions
* - Multi-provider intelligence for optimal suggestions
* - Learning from user acceptance patterns
* - Real-time completion generation
* - Smart ranking and filtering
*/

import { EventEmitter } from 'events';
import { aiOrchestrator } from '../../orchestrator/AIOrchestrator.js';

export interface CompletionRequest {
  id: string;
  text: string;
  position: CompletionPosition;
  context: CompletionContext;
  language: string;
  options?: CompletionOptions;
}

export interface CompletionPosition {
  line: number;
  column: number;
  offset: number;
}

export interface CompletionContext {
  filePath: string;
  fileContent: string;
  cursorContext: CursorContext;
  projectContext: ProjectContext;
  semanticContext: SemanticContext;
  userContext: UserContext;
}

export interface CursorContext {
  beforeCursor: string;
  afterCursor: string;
  currentLine: string;
  previousLines: string[];
  nextLines: string[];
  indentLevel: number;
  inFunction: boolean;
  inClass: boolean;
  inComment: boolean;
  inString: boolean;
}

export interface ProjectContext {
  projectType: string;
  framework: string;
  dependencies: string[];
  codeStyle: CodeStyle;
  commonPatterns: CodePattern[];
  recentFiles: RecentFile[];
}

export interface SemanticContext {
  availableVariables: VariableInfo[];
  availableFunctions: FunctionInfo[];
  availableTypes: TypeInfo[];
  imports: ImportInfo[];
  scope: ScopeInfo;
  expectedType: TypeExpectation;
}

export interface UserContext {
  preferences: UserPreferences;
  recentCompletions: RecentCompletion[];
  acceptancePatterns: AcceptancePattern[];
  codingStyle: CodingStyle;
  experienceLevel: ExperienceLevel;
}

export interface CodeStyle {
  indentSize: number;
  indentType: 'spaces' | 'tabs';
  quotes: 'single' | 'double';
  semicolons: boolean;
  trailingCommas: boolean;
  maxLineLength: number;
}

export interface CodePattern {
  name: string;
  pattern: string;
  frequency: number;
  context: string[];
  suggestions: string[];
}

export interface RecentFile {
  path: string;
  language: string;
  lastModified: number;
  similarity: number;
}

export interface VariableInfo {
  name: string;
  type: string;
  scope: string;
  line: number;
  isUsed: boolean;
  confidence: number;
}

export interface FunctionInfo {
  name: string;
  parameters: ParameterInfo[];
  returnType: string;
  scope: string;
  documentation: string;
  usage: FunctionUsage;
}

export interface ParameterInfo {
  name: string;
  type: string;
  optional: boolean;
  defaultValue?: string;
}

export interface FunctionUsage {
  callCount: number;
  lastUsed: number;
  commonContexts: string[];
}

export interface TypeInfo {
  name: string;
  kind: TypeKind;
  properties: PropertyInfo[];
  methods: MethodInfo[];
  documentation: string;
}

export interface PropertyInfo {
  name: string;
  type: string;
  optional: boolean;
  readonly: boolean;
}

export interface MethodInfo {
  name: string;
  parameters: ParameterInfo[];
  returnType: string;
  accessibility: AccessibilityLevel;
}

export interface ImportInfo {
  module: string;
  imports: string[];
  alias?: string;
  isDefault: boolean;
  line: number;
}

export interface ScopeInfo {
  type: ScopeType;
  name: string;
  variables: string[];
  functions: string[];
  parent?: ScopeInfo;
}

export interface TypeExpectation {
  expectedType: string;
  confidence: number;
  alternatives: string[];
  reasoning: string;
}

export interface UserPreferences {
  completionStyle: CompletionStyle;
  verbosity: VerbosityLevel;
  autoAccept: boolean;
  learningEnabled: boolean;
  preferredProviders: string[];
}

export interface RecentCompletion {
  suggestion: string;
  context: string;
  accepted: boolean;
  timestamp: number;
  provider: string;
}

export interface AcceptancePattern {
  pattern: string;
  acceptanceRate: number;
  context: string[];
  provider: string;
}

export interface CodingStyle {
  naming: NamingConvention;
  structure: StructurePreference;
  verbosity: VerbosityLevel;
  patterns: PreferredPattern[];
}

export interface CompletionOptions {
  maxSuggestions?: number;
  minConfidence?: number;
  includeSnippets?: boolean;
  includeDocumentation?: boolean;
  filterDuplicates?: boolean;
  rankByRelevance?: boolean;
  enableLearning?: boolean;
  providers?: string[];
}

export interface CompletionResponse {
  id: string;
  requestId: string;
  completions: IntelligentCompletion[];
  metadata: CompletionMetadata;
  timing: CompletionTiming;
}

export interface IntelligentCompletion {
  id: string;
  text: string;
  insertText: string;
  kind: CompletionKind;
  detail: string;
  documentation: CompletionDocumentation;
  confidence: number;
  reasoning: string;
  provider: string;
  context: CompletionCompletionContext;
  ranking: RankingInfo;
  alternatives: AlternativeCompletion[];
}

export interface CompletionDocumentation {
  summary: string;
  description: string;
  examples: CodeExample[];
  references: DocumentationReference[];
  tags: DocumentationTag[];
}

export interface CodeExample {
  title: string;
  code: string;
  explanation: string;
}

export interface DocumentationReference {
  title: string;
  url: string;
  type: ReferenceType;
}

export interface DocumentationTag {
  name: string;
  value: string;
}

export interface CompletionCompletionContext {
  triggerCharacter?: string;
  triggerKind: TriggerKind;
  semanticTokens: SemanticToken[];
  syntaxTree: SyntaxNode;
}

export interface RankingInfo {
  relevanceScore: number;
  frequencyScore: number;
  recentUsageScore: number;
  userPreferenceScore: number;
  overallScore: number;
  factors: RankingFactor[];
}

export interface RankingFactor {
  name: string;
  weight: number;
  value: number;
  contribution: number;
}

export interface AlternativeCompletion {
  text: string;
  confidence: number;
  reasoning: string;
  ranking: number;
}

export interface CompletionMetadata {
  totalSuggestions: number;
  providersUsed: string[];
  cacheHit: boolean;
  contextAnalysisTime: number;
  generationTime: number;
  rankingTime: number;
}

export interface CompletionTiming {
  requestReceived: number;
  contextAnalyzed: number;
  suggestionsGenerated: number;
  ranked: number;
  responseReady: number;
  totalTime: number;
}

export interface SemanticToken {
  start: number;
  length: number;
  tokenType: string;
  tokenModifiers: string[];
}

export interface SyntaxNode {
  type: string;
  start: number;
  end: number;
  children: SyntaxNode[];
  text: string;
}

export type TypeKind = 'class' | 'interface' | 'enum' | 'type' | 'primitive' | 'union' | 'generic';
export type AccessibilityLevel = 'public' | 'private' | 'protected' | 'internal';
export type ScopeType = 'global' | 'module' | 'class' | 'function' | 'block';
export type CompletionStyle = 'minimal' | 'balanced' | 'verbose' | 'educational';
export type VerbosityLevel = 'minimal' | 'normal' | 'detailed' | 'educational';
export type ExperienceLevel = 'beginner' | 'intermediate' | 'advanced' | 'expert';
export type NamingConvention = 'camelCase' | 'PascalCase' | 'snake_case' | 'kebab-case' | 'mixed';
export type StructurePreference = 'compact' | 'expanded' | 'functional' | 'object-oriented';
export type PreferredPattern = 'mvc' | 'component' | 'functional' | 'reactive' | 'imperative';
export type CompletionKind = 'text' | 'method' | 'function' | 'constructor' | 'field' | 'variable' | 'class' | 'interface' | 'module' | 'property' | 'unit' | 'value' | 'enum' | 'keyword' | 'snippet' | 'color' | 'file' | 'reference' | 'folder' | 'enumMember' | 'constant' | 'struct' | 'event' | 'operator' | 'typeParameter';
export type TriggerKind = 'invoke' | 'triggerCharacter' | 'triggerForIncompleteCompletions';
export type ReferenceType = 'documentation' | 'tutorial' | 'example' | 'api' | 'specification';

/**
* Auto-Completion Engine Class
*/
export class AutoCompletionEngine extends EventEmitter {
  private completionCache: Map<string, CompletionResponse> = new Map();
  private userLearning: Map<string, UserLearningData> = new Map();
  private providerPreferences: Map<string, ProviderPreference> = new Map();
  private contextAnalyzer: ContextAnalyzer;
  private rankingEngine: RankingEngine;
  private learningEngine: LearningEngine;

  constructor() {
    super();
    this.contextAnalyzer = new ContextAnalyzer();
    this.rankingEngine = new RankingEngine();
    this.learningEngine = new LearningEngine();
    this.initializeProviderPreferences();
    console.log('Auto-Completion Engine initialized');
  }

  /**
   * Generate intelligent code completions
   */
  async generateCompletions(request: CompletionRequest): Promise<CompletionResponse> {
    const startTime = Date.now();

    try {
      this.emit('completionRequested', { request });

      // Check cache for recent similar requests
      const cacheKey = this.generateCacheKey(request);
      if (this.completionCache.has(cacheKey)) {
        const cached = this.completionCache.get(cacheKey)!;
        if (Date.now() - cached.timing.requestReceived < 30000) { // 30 seconds cache
          this.emit('completionCacheHit', cached);
          return cached;
        }
      }

      // Analyze context comprehensively
      const contextAnalysisStart = Date.now();
      const enhancedContext = await this.contextAnalyzer.analyzeContext(request);
      const contextAnalysisTime = Date.now() - contextAnalysisStart;

      // Generate completions from multiple providers
      const generationStart = Date.now();
      const rawCompletions = await this.generateRawCompletions(request, enhancedContext);
      const generationTime = Date.now() - generationStart;

      // Rank and filter completions
      const rankingStart = Date.now();
      const rankedCompletions = await this.rankingEngine.rankCompletions(
        rawCompletions,
        enhancedContext,
        this.getUserLearning(request.context.userContext)
      );
      const rankingTime = Date.now() - rankingStart;

      // Filter and limit results
      const finalCompletions = this.filterCompletions(rankedCompletions, request.options);

      // Create response
      const response: CompletionResponse = {
        id: `completion_${Date.now()}`,
        requestId: request.id,
        completions: finalCompletions,
        metadata: {
          totalSuggestions: rawCompletions.length,
          providersUsed: this.getUsedProviders(rawCompletions),
          cacheHit: false,
          contextAnalysisTime,
          generationTime,
          rankingTime
        },
        timing: {
          requestReceived: startTime,
          contextAnalyzed: contextAnalysisStart + contextAnalysisTime,
          suggestionsGenerated: generationStart + generationTime,
          ranked: rankingStart + rankingTime,
          responseReady: Date.now(),
          totalTime: Date.now() - startTime
        }
      };

      // Cache response
      this.completionCache.set(cacheKey, response);

      // Update learning if enabled
      if (request.options?.enableLearning !== false) {
        this.learningEngine.recordRequest(request, response);
      }

      this.emit('completionGenerated', {
        request,
        response,
        timing: response.timing
      });

      return response;

    } catch (error) {
      this.emit('completionError', { request, error: error.message });
      throw error;
    }
  }

  /**
   * Record user acceptance for learning
   */
  async recordAcceptance(completionId: string, accepted: boolean, context: any): Promise<void> {
    try {
      const learning = this.getUserLearning(context.userContext);

      const acceptance = {
        completionId,
        accepted,
        timestamp: Date.now(),
        context: context.contextSignature || 'unknown'
      };

      learning.acceptanceHistory.push(acceptance);

      // Update acceptance patterns
      this.learningEngine.updateAcceptancePatterns(learning, acceptance);

      // Adjust provider preferences
      this.updateProviderPreferences(completionId, accepted);

      this.emit('acceptanceRecorded', { completionId, accepted, learning });

    } catch (error) {
      this.emit('acceptanceError', { completionId, error: error.message });
    }
  }

  /**
   * Generate raw completions from multiple providers
   */
  private async generateRawCompletions(
    request: CompletionRequest,
    context: EnhancedContext
  ): Promise<RawCompletion[]> {
    const completions: RawCompletion[] = [];
    const providers = this.selectProviders(request, context);

    // Generate completions from each provider in parallel
    const providerPromises = providers.map(async (provider) => {
      try {
        const providerCompletions = await this.generateProviderCompletions(
          provider,
          request,
          context
        );
        return providerCompletions.map(comp => ({ ...comp, provider }));
      } catch (error) {
        console.warn(`Provider ${provider} failed:`, error.message);
        return [];
      }
    });

    const providerResults = await Promise.all(providerPromises);
    providerResults.forEach(result => completions.push(...result));

    // Add built-in completions
    const builtInCompletions = await this.generateBuiltInCompletions(request, context);
    completions.push(...builtInCompletions);

    return completions;
  }

  /**
   * Generate completions from a specific AI provider
   */
  private async generateProviderCompletions(
    provider: string,
    request: CompletionRequest,
    context: EnhancedContext
  ): Promise<RawCompletion[]> {
    const prompt = this.createCompletionPrompt(request, context);

    try {
      const aiResponse = await aiOrchestrator.processRequest({
        id: `completion_${Date.now()}`,
        type: 'code-completion',
        content: prompt,
        context: {
          language: request.language,
          filePath: request.context.filePath,
          position: request.position
        },
        options: {
          model: provider,
          maxTokens: 500,
          temperature: 0.3,
          includeReasoning: true
        }
      });

      return this.parseAICompletions(aiResponse, provider);

    } catch (error) {
      console.warn(`AI completion failed for provider ${provider}:`, error.message);
      return [];
    }
  }

  /**
   * Generate built-in completions based on context
   */
  private async generateBuiltInCompletions(
    request: CompletionRequest,
    context: EnhancedContext
  ): Promise<RawCompletion[]> {
    const completions: RawCompletion[] = [];

    // Variable completions
    context.semanticContext.availableVariables.forEach(variable => {
      if (variable.name.startsWith(request.text)) {
        completions.push({
          text: variable.name,
          kind: 'variable',
          detail: `${variable.type} - ${variable.scope}`,
          confidence: variable.confidence,
          provider: 'built-in',
          reasoning: `Available variable in ${variable.scope} scope`
        });
      }
    });

    // Function completions
    context.semanticContext.availableFunctions.forEach(func => {
      if (func.name.startsWith(request.text)) {
        const paramString = func.parameters.map(p => `${p.name}: ${p.type}`).join(', ');
        completions.push({
          text: func.name,
          insertText: `${func.name}(${func.parameters.map(p => p.name).join(', ')})`,
          kind: 'function',
          detail: `${func.name}(${paramString}): ${func.returnType}`,
          confidence: 0.8,
          provider: 'built-in',
          reasoning: 'Available function in current scope',
          documentation: func.documentation
        });
      }
    });

    // Keyword completions
    const keywords = this.getLanguageKeywords(request.language);
    keywords.forEach(keyword => {
      if (keyword.startsWith(request.text)) {
        completions.push({
          text: keyword,
          kind: 'keyword',
          detail: `${request.language} keyword`,
          confidence: 0.6,
          provider: 'built-in',
          reasoning: 'Language keyword'
        });
      }
    });

    return completions;
  }

  /**
   * Create AI completion prompt
   */
  private createCompletionPrompt(request: CompletionRequest, context: EnhancedContext): string {
    const beforeCursor = context.cursorContext.beforeCursor;
    const afterCursor = context.cursorContext.afterCursor;
    const currentLine = context.cursorContext.currentLine;

    return `Complete the following ${request.language} code at the cursor position.

Project Context:
- Type: ${context.projectContext.projectType}
- Framework: ${context.projectContext.framework}
- Language: ${request.language}

Code Context:
\`\`\`${request.language}
${beforeCursor}[CURSOR]${afterCursor}
\`\`\`

Current line: "${currentLine}"
Position: line ${request.position.line}, column ${request.position.column}

Available variables: ${context.semanticContext.availableVariables.slice(0, 5).map(v => `${v.name}: ${v.type}`).join(', ')}
Available functions: ${context.semanticContext.availableFunctions.slice(0, 5).map(f => f.name).join(', ')}

Provide intelligent code completions that:
1. Are contextually relevant to the current position
2. Follow the project's coding style and patterns
3. Are syntactically correct and meaningful
4. Include brief explanations for complex suggestions

Return completions in this format:
COMPLETION: <code>
EXPLANATION: <brief explanation>
CONFIDENCE: <0.0-1.0>
---`;
  }

  /**
   * Parse AI completions from response
   */
  private parseAICompletions(aiResponse: any, provider: string): RawCompletion[] {
    const completions: RawCompletion[] = [];

    try {
      const content = aiResponse.content || aiResponse.response || '';
      const completionBlocks = content.split('---').filter(block => block.trim());

      completionBlocks.forEach(block => {
        const lines = block.trim().split('\n');
        let completion: Partial<RawCompletion> = { provider };

        lines.forEach(line => {
          const trimmed = line.trim();
          if (trimmed.startsWith('COMPLETION:')) {
            completion.text = trimmed.substring(11).trim();
            completion.insertText = completion.text;
          } else if (trimmed.startsWith('EXPLANATION:')) {
            completion.reasoning = trimmed.substring(12).trim();
          } else if (trimmed.startsWith('CONFIDENCE:')) {
            completion.confidence = parseFloat(trimmed.substring(11).trim()) || 0.5;
          }
        });

        if (completion.text) {
          completions.push({
            text: completion.text,
            insertText: completion.insertText || completion.text,
            kind: this.inferCompletionKind(completion.text),
            detail: completion.reasoning || '',
            confidence: completion.confidence || 0.5,
            provider,
            reasoning: completion.reasoning || 'AI-generated completion'
          });
        }
      });

    } catch (error) {
      console.warn(`Failed to parse AI completions from ${provider}:`, error.message);
    }

    return completions;
  }

  /**
   * Filter completions based on options and quality
   */
  private filterCompletions(
    completions: IntelligentCompletion[],
    options?: CompletionOptions
  ): IntelligentCompletion[] {
    let filtered = [...completions];

    // Filter by confidence threshold
    if (options?.minConfidence) {
      filtered = filtered.filter(comp => comp.confidence >= options.minConfidence!);
    }

    // Remove duplicates if requested
    if (options?.filterDuplicates !== false) {
      const seen = new Set<string>();
      filtered = filtered.filter(comp => {
        const key = comp.text.toLowerCase();
        if (seen.has(key)) return false;
        seen.add(key);
        return true;
      });
    }

    // Limit number of suggestions
    if (options?.maxSuggestions) {
      filtered = filtered.slice(0, options.maxSuggestions);
    }

    return filtered;
  }

  /**
   * Select best providers for the request
   */
  private selectProviders(request: CompletionRequest, context: EnhancedContext): string[] {
    const providers: string[] = [];

    // Use user-specified providers if available
    if (request.options?.providers?.length) {
      return request.options.providers;
    }

    // Select based on language and context
    if (request.language === 'typescript' || request.language === 'javascript') {
      providers.push('openai-gpt-4', 'anthropic-claude-3-sonnet');
    } else if (request.language === 'python') {
      providers.push('openai-gpt-4', 'google-gemini-pro');
    } else {
      providers.push('openai-gpt-4');
    }

    // Add preferred providers based on user learning
    const userLearning = this.getUserLearning(context.userContext);
    const topProvider = this.getTopPerformingProvider(userLearning);
    if (topProvider && !providers.includes(topProvider)) {
      providers.unshift(topProvider);
    }

    return providers.slice(0, 3); // Limit to 3 providers for performance
  }

  /**
   * Helper methods
   */
  private generateCacheKey(request: CompletionRequest): string {
    const context = {
      text: request.text,
      position: request.position,
      file: request.context.filePath,
      beforeCursor: request.context.cursorContext.beforeCursor.slice(-50),
      language: request.language
    };
    return btoa(JSON.stringify(context)).substring(0, 32);
  }

  private getUserLearning(userContext: UserContext): UserLearningData {
    const userId = this.generateUserId(userContext);
    if (!this.userLearning.has(userId)) {
      this.userLearning.set(userId, {
        userId,
        acceptanceHistory: [],
        patterns: [],
        preferences: userContext.preferences,
        lastUpdated: Date.now()
      });
    }
    return this.userLearning.get(userId)!;
  }

  private generateUserId(userContext: UserContext): string {
    // Generate anonymous user ID based on preferences and patterns
    const data = JSON.stringify({
      style: userContext.codingStyle,
      preferences: userContext.preferences
    });
    return btoa(data).substring(0, 16);
  }

  private getUsedProviders(completions: RawCompletion[]): string[] {
    const providers = new Set<string>();
    completions.forEach(comp => providers.add(comp.provider));
    return Array.from(providers);
  }

  private inferCompletionKind(text: string): CompletionKind {
    if (text.includes('(') && text.includes(')')) return 'function';
    if (text.startsWith('class ')) return 'class';
    if (text.startsWith('interface ')) return 'interface';
    if (text.startsWith('const ') || text.startsWith('let ') || text.startsWith('var ')) return 'variable';
    if (['if', 'for', 'while', 'switch', 'try', 'catch'].some(kw => text.startsWith(kw))) return 'keyword';
    return 'text';
  }

  private getLanguageKeywords(language: string): string[] {
    const keywords: Record<string, string[]> = {
      typescript: ['const', 'let', 'var', 'function', 'class', 'interface', 'type', 'enum', 'import', 'export', 'if', 'else', 'for', 'while', 'switch', 'case', 'default', 'try', 'catch', 'finally', 'throw', 'return', 'break', 'continue'],
      javascript: ['const', 'let', 'var', 'function', 'class', 'import', 'export', 'if', 'else', 'for', 'while', 'switch', 'case', 'default', 'try', 'catch', 'finally', 'throw', 'return', 'break', 'continue'],
      python: ['def', 'class', 'import', 'from', 'if', 'else', 'elif', 'for', 'while', 'try', 'except', 'finally', 'raise', 'return', 'break', 'continue', 'pass', 'lambda', 'with', 'as'],
      java: ['public', 'private', 'protected', 'static', 'final', 'class', 'interface', 'extends', 'implements', 'import', 'package', 'if', 'else', 'for', 'while', 'switch', 'case', 'default', 'try', 'catch', 'finally', 'throw', 'return', 'break', 'continue'],
      csharp: ['public', 'private', 'protected', 'internal', 'static', 'readonly', 'class', 'interface', 'struct', 'enum', 'using', 'namespace', 'if', 'else', 'for', 'foreach', 'while', 'switch', 'case', 'default', 'try', 'catch', 'finally', 'throw', 'return', 'break', 'continue']
    };
    return keywords[language] || [];
  }

  private getTopPerformingProvider(learning: UserLearningData): string | null {
    const providerStats = new Map<string, { total: number; accepted: number }>();

    learning.acceptanceHistory.forEach(acceptance => {
      // Note: We'd need to track provider info in acceptance history
      // This is a simplified implementation
    });

    let bestProvider: string | null = null;
    let bestRate = 0;

    providerStats.forEach((stats, provider) => {
      const rate = stats.total > 0 ? stats.accepted / stats.total : 0;
      if (rate > bestRate) {
        bestRate = rate;
        bestProvider = provider;
      }
    });

    return bestProvider;
  }

  private updateProviderPreferences(completionId: string, accepted: boolean): void {
    // Update provider preferences based on acceptance
    // Implementation would track completion ID to provider mapping
  }

  private initializeProviderPreferences(): void {
    // Initialize default provider preferences
    this.providerPreferences.set('openai-gpt-4', {
      weight: 1.0,
      languages: ['typescript', 'javascript', 'python', 'java', 'csharp'],
      contexts: ['general', 'complex-reasoning'],
      acceptanceRate: 0.85
    });

    this.providerPreferences.set('anthropic-claude-3-sonnet', {
      weight: 0.9,
      languages: ['typescript', 'javascript', 'python'],
      contexts: ['code-review', 'optimization'],
      acceptanceRate: 0.82
    });

    this.providerPreferences.set('google-gemini-pro', {
      weight: 0.8,
      languages: ['python', 'java', 'javascript'],
      contexts: ['documentation', 'analysis'],
      acceptanceRate: 0.78
    });
  }

  /**
   * Get completion engine statistics
   */
  getCompletionStats(): any {
    return {
      cacheSize: this.completionCache.size,
      userLearningData: this.userLearning.size,
      providerPreferences: this.providerPreferences.size,
      features: [
        'context-aware-completions',
        'multi-provider-intelligence',
        'user-learning-adaptation',
        'real-time-generation',
        'smart-ranking-filtering'
      ],
      supportedLanguages: ['typescript', 'javascript', 'python', 'java', 'csharp'],
      completionKinds: ['text', 'method', 'function', 'variable', 'class', 'interface', 'keyword', 'snippet']
    };
  }

  /**
   * Clear completion cache
   */
  clearCache(): void {
    this.completionCache.clear();
    console.log('Completion cache cleared');
  }
}

// Helper interfaces and classes
interface RawCompletion {
  text: string;
  insertText?: string;
  kind?: CompletionKind;
  detail?: string;
  documentation?: string;
  confidence: number;
  provider: string;
  reasoning: string;
}

interface EnhancedContext extends CompletionContext {
  analysisMetadata: ContextAnalysisMetadata;
}

interface ContextAnalysisMetadata {
  complexity: number;
  analysisTime: number;
  confidence: number;
  features: string[];
}

interface UserLearningData {
  userId: string;
  acceptanceHistory: AcceptanceRecord[];
  patterns: LearnedPattern[];
  preferences: UserPreferences;
  lastUpdated: number;
}

interface AcceptanceRecord {
  completionId: string;
  accepted: boolean;
  timestamp: number;
  context: string;
}

interface LearnedPattern {
  pattern: string;
  acceptanceRate: number;
  frequency: number;
  contexts: string[];
}

interface ProviderPreference {
  weight: number;
  languages: string[];
  contexts: string[];
  acceptanceRate: number;
}

// Helper classes
class ContextAnalyzer {
  async analyzeContext(request: CompletionRequest): Promise<EnhancedContext> {
    const startTime = Date.now();

    // Enhanced context analysis
    const enhanced: EnhancedContext = {
      ...request.context,
      analysisMetadata: {
        complexity: this.calculateComplexity(request.context),
        analysisTime: 0,
        confidence: 0.85,
        features: this.extractFeatures(request.context)
      }
    };

    enhanced.analysisMetadata.analysisTime = Date.now() - startTime;
    return enhanced;
  }

  private calculateComplexity(context: CompletionContext): number {
    let complexity = 0;

    // Factor in various complexity indicators
    complexity += context.semanticContext.availableVariables.length * 0.1;
    complexity += context.semanticContext.availableFunctions.length * 0.2;
    complexity += context.cursorContext.indentLevel * 0.5;

    if (context.cursorContext.inFunction) complexity += 1;
    if (context.cursorContext.inClass) complexity += 2;

    return Math.min(complexity, 10); // Cap at 10
  }

  private extractFeatures(context: CompletionContext): string[] {
    const features: string[] = [];

    if (context.cursorContext.inFunction) features.push('in-function');
    if (context.cursorContext.inClass) features.push('in-class');
    if (context.cursorContext.inComment) features.push('in-comment');
    if (context.cursorContext.inString) features.push('in-string');
    if (context.semanticContext.expectedType.expectedType !== 'any') features.push('typed-context');
    if (context.projectContext.framework) features.push(`framework-${context.projectContext.framework}`);

    return features;
  }
}

class RankingEngine {
  async rankCompletions(
    completions: RawCompletion[],
    context: EnhancedContext,
    userLearning: UserLearningData
  ): Promise<IntelligentCompletion[]> {
    const ranked: IntelligentCompletion[] = [];

    for (const completion of completions) {
      const ranking = this.calculateRanking(completion, context, userLearning);

      ranked.push({
        id: `comp_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        text: completion.text,
        insertText: completion.insertText || completion.text,
        kind: completion.kind || 'text',
        detail: completion.detail || '',
        documentation: {
          summary: completion.documentation || '',
          description: completion.reasoning,
          examples: [],
          references: [],
          tags: []
        },
        confidence: completion.confidence,
        reasoning: completion.reasoning,
        provider: completion.provider,
        context: {
          triggerKind: 'invoke',
          semanticTokens: [],
          syntaxTree: { type: 'root', start: 0, end: 0, children: [], text: '' }
        },
        ranking,
        alternatives: []
      });
    }

    // Sort by overall ranking score
    return ranked.sort((a, b) => b.ranking.overallScore - a.ranking.overallScore);
  }

  private calculateRanking(
    completion: RawCompletion,
    context: EnhancedContext,
    userLearning: UserLearningData
  ): RankingInfo {
    const relevanceScore = this.calculateRelevanceScore(completion, context);
    const frequencyScore = this.calculateFrequencyScore(completion, userLearning);
    const recentUsageScore = this.calculateRecentUsageScore(completion, userLearning);
    const userPreferenceScore = this.calculateUserPreferenceScore(completion, userLearning);

    const weights = {
      relevance: 0.4,
      frequency: 0.2,
      recentUsage: 0.2,
      userPreference: 0.2
    };

    const overallScore =
      relevanceScore * weights.relevance +
      frequencyScore * weights.frequency +
      recentUsageScore * weights.recentUsage +
      userPreferenceScore * weights.userPreference;

    return {
      relevanceScore,
      frequencyScore,
      recentUsageScore,
      userPreferenceScore,
      overallScore,
      factors: [
        { name: 'relevance', weight: weights.relevance, value: relevanceScore, contribution: relevanceScore * weights.relevance },
        { name: 'frequency', weight: weights.frequency, value: frequencyScore, contribution: frequencyScore * weights.frequency },
        { name: 'recentUsage', weight: weights.recentUsage, value: recentUsageScore, contribution: recentUsageScore * weights.recentUsage },
        { name: 'userPreference', weight: weights.userPreference, value: userPreferenceScore, contribution: userPreferenceScore * weights.userPreference }
      ]
    };
  }

  private calculateRelevanceScore(completion: RawCompletion, context: EnhancedContext): number {
    let score = completion.confidence || 0.5;

    // Boost score for contextually appropriate completions
    if (context.cursorContext.inFunction && completion.kind === 'variable') score += 0.2;
    if (context.cursorContext.inClass && completion.kind === 'method') score += 0.2;
    if (context.semanticContext.expectedType.expectedType !== 'any') score += 0.1;

    return Math.min(score, 1.0);
  }

  private calculateFrequencyScore(completion: RawCompletion, userLearning: UserLearningData): number {
    // Calculate based on how often similar completions were accepted
    const pattern = completion.text.toLowerCase();
    const matchingPattern = userLearning.patterns.find(p => p.pattern === pattern);
    return matchingPattern ? matchingPattern.acceptanceRate : 0.5;
  }

  private calculateRecentUsageScore(completion: RawCompletion, userLearning: UserLearningData): number {
    // Calculate based on recent usage patterns
    const recentAcceptances = userLearning.acceptanceHistory
      .filter(h => h.timestamp > Date.now() - 86400000) // Last 24 hours
      .filter(h => h.accepted);

    if (recentAcceptances.length === 0) return 0.5;

    const recentlyUsed = recentAcceptances.some(h =>
      h.context.includes(completion.text.substring(0, 10))
    );

    return recentlyUsed ? 0.8 : 0.4;
  }

  private calculateUserPreferenceScore(completion: RawCompletion, userLearning: UserLearningData): number {
    // Calculate based on user preferences
    let score = 0.5;

    const prefs = userLearning.preferences;

    // Prefer provider based on historical performance
    if (prefs.preferredProviders.includes(completion.provider)) {
      score += 0.2;
    }

    // Adjust for verbosity preferences
    if (prefs.verbosity === 'minimal' && completion.text.length > 50) {
      score -= 0.1;
    } else if (prefs.verbosity === 'detailed' && completion.text.length < 20) {
      score -= 0.1;
    }

    return Math.max(0, Math.min(score, 1.0));
  }
}

class LearningEngine {
  recordRequest(request: CompletionRequest, response: CompletionResponse): void {
    // Record completion request for learning
    console.log(`Learning: Recorded completion request with ${response.completions.length} suggestions`);
  }

  updateAcceptancePatterns(learning: UserLearningData, acceptance: AcceptanceRecord): void {
    // Update user's acceptance patterns based on new data
    const pattern = acceptance.context.substring(0, 20);

    let existingPattern = learning.patterns.find(p => p.pattern === pattern);

    if (!existingPattern) {
      existingPattern = {
        pattern,
        acceptanceRate: 0,
        frequency: 0,
        contexts: []
      };
      learning.patterns.push(existingPattern);
    }

    // Update pattern statistics
    existingPattern.frequency++;
    const totalAcceptances = learning.acceptanceHistory
      .filter(h => h.context === acceptance.context).length;
    const successfulAcceptances = learning.acceptanceHistory
      .filter(h => h.context === acceptance.context && h.accepted).length;

    existingPattern.acceptanceRate = totalAcceptances > 0 ? successfulAcceptances / totalAcceptances : 0;

    // Update contexts
    if (!existingPattern.contexts.includes(acceptance.context)) {
      existingPattern.contexts.push(acceptance.context);
    }

    learning.lastUpdated = Date.now();
  }
}

export default AutoCompletionEngine;