/**
* Context Manager - Manages conversation context and workspace awareness
*
* This class provides:
* - Workspace and project context tracking
* - Intelligent context injection for AI requests
* - Context history and persistence
* - File and code context analysis
*/

import { EventEmitter } from 'events';
import { ConversationContext } from './ChatPanel.js';
import { Intent } from './IntentRecognizer.js';

export interface WorkspaceContext {
  projectPath: string;
  projectName: string;
  projectType: ProjectType;
  primaryLanguage: string;
  frameworks: string[];
  dependencies: Dependency[];
  fileStructure: FileNode[];
  recentFiles: RecentFile[];
  gitInfo?: GitContext;
}

export interface ProjectType {
  type: 'web' | 'mobile' | 'desktop' | 'library' | 'api' | 'unknown';
  subtype?: string;
  confidence: number;
}

export interface Dependency {
  name: string;
  version: string;
  type: 'production' | 'development';
  category: 'framework' | 'utility' | 'testing' | 'build' | 'other';
}

export interface FileNode {
  path: string;
  name: string;
  type: 'file' | 'directory';
  language?: string;
  size?: number;
  lastModified?: number;
  children?: FileNode[];
}

export interface RecentFile {
  path: string;
  lastAccessed: number;
  accessCount: number;
  language: string;
}

export interface GitContext {
  branch: string;
  hasUncommittedChanges: boolean;
  recentCommits: GitCommit[];
}

export interface GitCommit {
  hash: string;
  message: string;
  author: string;
  timestamp: number;
}

export interface CodeContext {
  activeFile?: string;
  selectedCode?: string;
  selectedRange?: {
    startLine: number;
    endLine: number;
  };
  surroundingCode?: string;
  functionContext?: FunctionContext;
  classContext?: ClassContext;
  imports?: string[];
  variables?: VariableInfo[];
}

export interface FunctionContext {
  name: string;
  parameters: Parameter[];
  returnType?: string;
  documentation?: string;
  callers?: string[];
  callees?: string[];
}

export interface ClassContext {
  name: string;
  methods: string[];
  properties: string[];
  inheritance?: string[];
  interfaces?: string[];
}

export interface Parameter {
  name: string;
  type?: string;
  optional: boolean;
  defaultValue?: string;
}

export interface VariableInfo {
  name: string;
  type?: string;
  scope: 'local' | 'class' | 'global';
  value?: string;
}

export interface ContextInjection {
  includeWorkspace: boolean;
  includeActiveFile: boolean;
  includeSelectedCode: boolean;
  includeRecentFiles: boolean;
  includeGitInfo: boolean;
  maxContextTokens: number;
  priority: ContextPriority[];
}

export type ContextPriority =
  | 'selected-code'
  | 'active-file'
  | 'function-context'
  | 'class-context'
  | 'imports'
  | 'recent-files'
  | 'project-info'
  | 'git-info';

/**
* Context Manager Class
*/
export class ContextManager extends EventEmitter {
  private workspaceContext: WorkspaceContext | null = null;
  private codeContext: CodeContext = {};
  private contextHistory: Map<string, any[]> = new Map();
  private isAnalyzing: boolean = false;

  constructor() {
    super();
    console.log('Context Manager initialized');
  }

  /**
   * Initialize context manager with workspace
   */
  async initialize(projectPath: string): Promise<void> {
    try {
      this.isAnalyzing = true;
      console.log('Analyzing workspace context...');

      this.workspaceContext = await this.analyzeWorkspace(projectPath);

      this.emit('workspaceAnalyzed', this.workspaceContext);
      console.log(`Workspace analyzed: ${this.workspaceContext.projectName} (${this.workspaceContext.projectType.type})`);

    } catch (error) {
      console.error('Failed to initialize context:', error);
      this.emit('error', error);
    } finally {
      this.isAnalyzing = false;
    }
  }

  /**
   * Update code context when user interacts with editor
   */
  updateCodeContext(codeContext: Partial<CodeContext>): void {
    this.codeContext = { ...this.codeContext, ...codeContext };

    // Analyze code context if new file is active
    if (codeContext.activeFile && codeContext.activeFile !== this.codeContext.activeFile) {
      this.analyzeCodeContext(codeContext.activeFile);
    }

    this.emit('codeContextUpdated', this.codeContext);
    console.log('Code context updated:', Object.keys(codeContext));
  }

  /**
   * Generate smart context for AI requests
   */
  async generateContext(intent: Intent, injection: ContextInjection): Promise<string> {
    if (!this.workspaceContext) {
      return '';
    }

    const contextParts: string[] = [];
    let currentTokens = 0;

    // Process context by priority
    for (const priority of injection.priority) {
      if (currentTokens >= injection.maxContextTokens) break;

      const contextPart = await this.getContextByPriority(priority, injection);
      if (contextPart) {
        const tokenEstimate = this.estimateTokens(contextPart);

        if (currentTokens + tokenEstimate <= injection.maxContextTokens) {
          contextParts.push(contextPart);
          currentTokens += tokenEstimate;
        }
      }
    }

    const context = contextParts.join('\n\n');

    // Store context in history
    this.storeContextHistory(intent.type, context);

    return context;
  }

  /**
   * Get context by priority type
   */
  private async getContextByPriority(priority: ContextPriority, injection: ContextInjection): Promise<string | null> {
    switch (priority) {
      case 'selected-code':
        if (injection.includeSelectedCode && this.codeContext.selectedCode) {
          return this.formatSelectedCodeContext();
        }
        break;

      case 'active-file':
        if (injection.includeActiveFile && this.codeContext.activeFile) {
          return this.formatActiveFileContext();
        }
        break;

      case 'function-context':
        if (this.codeContext.functionContext) {
          return this.formatFunctionContext();
        }
        break;

      case 'class-context':
        if (this.codeContext.classContext) {
          return this.formatClassContext();
        }
        break;

      case 'imports':
        if (this.codeContext.imports && this.codeContext.imports.length > 0) {
          return this.formatImportsContext();
        }
        break;

      case 'recent-files':
        if (injection.includeRecentFiles && this.workspaceContext?.recentFiles) {
          return this.formatRecentFilesContext();
        }
        break;

      case 'project-info':
        if (injection.includeWorkspace && this.workspaceContext) {
          return this.formatProjectContext();
        }
        break;

      case 'git-info':
        if (injection.includeGitInfo && this.workspaceContext?.gitInfo) {
          return this.formatGitContext();
        }
        break;
    }

    return null;
  }

  /**
   * Format selected code context
   */
  private formatSelectedCodeContext(): string {
    if (!this.codeContext.selectedCode) return '';

    const { selectedCode, selectedRange, activeFile } = this.codeContext;
    const fileName = activeFile ? activeFile.split('/').pop() : 'file';

    let context = `**Selected Code in ${fileName}:**\n`;

    if (selectedRange) {
      context += `Lines ${selectedRange.startLine}-${selectedRange.endLine}:\n`;
    }

    context += `\`\`\`${this.getFileLanguage(activeFile)}\n${selectedCode}\n\`\`\``;

    // Add surrounding context if available
    if (this.codeContext.surroundingCode) {
      context += `\n\n**Surrounding Context:**\n\`\`\`${this.getFileLanguage(activeFile)}\n${this.codeContext.surroundingCode}\n\`\`\``;
    }

    return context;
  }

  /**
   * Format active file context
   */
  private formatActiveFileContext(): string {
    if (!this.codeContext.activeFile) return '';

    const fileName = this.codeContext.activeFile.split('/').pop();
    const language = this.getFileLanguage(this.codeContext.activeFile);

    return `**Current File:** ${fileName} (${language})`;
  }

  /**
   * Format function context
   */
  private formatFunctionContext(): string {
    const func = this.codeContext.functionContext!;

    let context = `**Current Function:** ${func.name}\n`;

    if (func.parameters.length > 0) {
      context += `**Parameters:** ${func.parameters.map(p =>
        `${p.name}${p.type ? `: ${p.type}` : ''}${p.optional ? '?' : ''}`
      ).join(', ')}\n`;
    }

    if (func.returnType) {
      context += `**Returns:** ${func.returnType}\n`;
    }

    if (func.documentation) {
      context += `**Documentation:** ${func.documentation}\n`;
    }

    return context;
  }

  /**
   * Format class context
   */
  private formatClassContext(): string {
    const cls = this.codeContext.classContext!;

    let context = `**Current Class:** ${cls.name}\n`;

    if (cls.methods.length > 0) {
      context += `**Methods:** ${cls.methods.join(', ')}\n`;
    }

    if (cls.properties.length > 0) {
      context += `**Properties:** ${cls.properties.join(', ')}\n`;
    }

    if (cls.inheritance && cls.inheritance.length > 0) {
      context += `**Extends:** ${cls.inheritance.join(', ')}\n`;
    }

    return context;
  }

  /**
   * Format imports context
   */
  private formatImportsContext(): string {
    const imports = this.codeContext.imports!;
    return `**File Imports:**\n${imports.map(imp => `- ${imp}`).join('\n')}`;
  }

  /**
   * Format recent files context
   */
  private formatRecentFilesContext(): string {
    const recentFiles = this.workspaceContext!.recentFiles.slice(0, 5);

    return `**Recent Files:**\n${recentFiles.map(file =>
      `- ${file.path.split('/').pop()} (${file.language})`
    ).join('\n')}`;
  }

  /**
   * Format project context
   */
  private formatProjectContext(): string {
    const project = this.workspaceContext!;

    let context = `**Project:** ${project.projectName}\n`;
    context += `**Type:** ${project.projectType.type}`;

    if (project.projectType.subtype) {
      context += ` (${project.projectType.subtype})`;
    }

    context += `\n**Primary Language:** ${project.primaryLanguage}\n`;

    if (project.frameworks.length > 0) {
      context += `**Frameworks:** ${project.frameworks.join(', ')}\n`;
    }

    if (project.dependencies.length > 0) {
      const mainDeps = project.dependencies
        .filter(dep => dep.type === 'production')
        .slice(0, 5)
        .map(dep => dep.name);

      if (mainDeps.length > 0) {
        context += `**Main Dependencies:** ${mainDeps.join(', ')}\n`;
      }
    }

    return context;
  }

  /**
   * Format git context
   */
  private formatGitContext(): string {
    const git = this.workspaceContext!.gitInfo!;

    let context = `**Git Branch:** ${git.branch}\n`;

    if (git.hasUncommittedChanges) {
      context += `**Status:** Uncommitted changes present\n`;
    }

    if (git.recentCommits.length > 0) {
      const recentCommit = git.recentCommits[0];
      context += `**Last Commit:** ${recentCommit.message.substring(0, 50)}...`;
    }

    return context;
  }

  /**
   * Analyze workspace to extract context
   */
  private async analyzeWorkspace(projectPath: string): Promise<WorkspaceContext> {
    // Mock implementation - in real implementation, this would scan the file system
    const projectName = projectPath.split('/').pop() || 'Unknown Project';

    // Simulate project analysis
    await new Promise(resolve => setTimeout(resolve, 100));

    const mockContext: WorkspaceContext = {
      projectPath,
      projectName,
      projectType: {
        type: 'web',
        subtype: 'react-typescript',
        confidence: 0.9
      },
      primaryLanguage: 'TypeScript',
      frameworks: ['React', 'Node.js', 'Express'],
      dependencies: [
        { name: 'react', version: '^18.0.0', type: 'production', category: 'framework' },
        { name: 'typescript', version: '^5.0.0', type: 'development', category: 'build' },
        { name: 'express', version: '^4.18.0', type: 'production', category: 'framework' },
        { name: 'jest', version: '^29.0.0', type: 'development', category: 'testing' }
      ],
      fileStructure: [
        {
          path: '/src',
          name: 'src',
          type: 'directory',
          children: [
            { path: '/src/components', name: 'components', type: 'directory' },
            { path: '/src/utils', name: 'utils', type: 'directory' },
            { path: '/src/types', name: 'types', type: 'directory' }
          ]
        }
      ],
      recentFiles: [
        { path: '/src/components/App.tsx', lastAccessed: Date.now() - 300000, accessCount: 15, language: 'TypeScript' },
        { path: '/src/utils/helpers.ts', lastAccessed: Date.now() - 600000, accessCount: 8, language: 'TypeScript' },
        { path: '/package.json', lastAccessed: Date.now() - 900000, accessCount: 3, language: 'JSON' }
      ],
      gitInfo: {
        branch: 'main',
        hasUncommittedChanges: true,
        recentCommits: [
          {
            hash: 'abc123',
            message: 'Add new component feature',
            author: 'Developer',
            timestamp: Date.now() - 3600000
          }
        ]
      }
    };

    return mockContext;
  }

  /**
   * Analyze code context for a specific file
   */
  private async analyzeCodeContext(filePath: string): Promise<void> {
    // Mock implementation - in real implementation, this would parse the actual file
    console.log(`Analyzing code context for: ${filePath}`);

    // Simulate file analysis
    await new Promise(resolve => setTimeout(resolve, 50));

    const mockCodeAnalysis = {
      imports: [
        'import React from "react"',
        'import { useState, useEffect } from "react"',
        'import { Button } from "./components/Button"'
      ],
      functionContext: {
        name: 'ComponentFunction',
        parameters: [
          { name: 'props', type: 'ComponentProps', optional: false }
        ],
        returnType: 'JSX.Element',
        documentation: 'Main component function',
        callers: ['App.tsx'],
        callees: ['useState', 'useEffect']
      },
      variables: [
        { name: 'count', type: 'number', scope: 'local' as const, value: '0' },
        { name: 'isVisible', type: 'boolean', scope: 'local' as const, value: 'true' }
      ]
    };

    this.codeContext = { ...this.codeContext, ...mockCodeAnalysis };
    this.emit('codeAnalyzed', { filePath, context: mockCodeAnalysis });
  }

  /**
   * Get file language from extension
   */
  private getFileLanguage(filePath?: string): string {
    if (!filePath) return 'text';

    const extension = filePath.split('.').pop()?.toLowerCase();
    const languageMap: Record<string, string> = {
      'ts': 'typescript',
      'tsx': 'typescript',
      'js': 'javascript',
      'jsx': 'javascript',
      'py': 'python',
      'java': 'java',
      'cpp': 'cpp',
      'c': 'c',
      'cs': 'csharp',
      'php': 'php',
      'rb': 'ruby',
      'go': 'go',
      'rs': 'rust',
      'swift': 'swift',
      'kt': 'kotlin',
      'dart': 'dart',
      'html': 'html',
      'css': 'css',
      'scss': 'scss',
      'json': 'json',
      'xml': 'xml',
      'yaml': 'yaml',
      'yml': 'yaml',
      'md': 'markdown'
    };

    return languageMap[extension || ''] || 'text';
  }

  /**
   * Estimate token count for text
   */
  private estimateTokens(text: string): number {
    // Rough estimation: ~4 characters per token
    return Math.ceil(text.length / 4);
  }

  /**
   * Store context in history
   */
  private storeContextHistory(intentType: string, context: string): void {
    if (!this.contextHistory.has(intentType)) {
      this.contextHistory.set(intentType, []);
    }

    const history = this.contextHistory.get(intentType)!;
    history.unshift({
      context,
      timestamp: Date.now(),
      tokens: this.estimateTokens(context)
    });

    // Keep only last 10 entries
    if (history.length > 10) {
      history.splice(10);
    }
  }

  /**
   * Get default context injection settings
   */
  getDefaultInjection(): ContextInjection {
    return {
      includeWorkspace: true,
      includeActiveFile: true,
      includeSelectedCode: true,
      includeRecentFiles: false,
      includeGitInfo: false,
      maxContextTokens: 1000,
      priority: [
        'selected-code',
        'function-context',
        'class-context',
        'active-file',
        'imports',
        'project-info',
        'recent-files',
        'git-info'
      ]
    };
  }

  /**
   * Get context for intent type
   */
  getContextForIntent(intentType: string): ContextInjection {
    const defaults = this.getDefaultInjection();

    // Customize based on intent type
    switch (intentType) {
      case 'code-review':
        return {
          ...defaults,
          priority: ['selected-code', 'function-context', 'class-context', 'imports', 'active-file'],
          maxContextTokens: 1500
        };

      case 'code-refactoring':
        return {
          ...defaults,
          priority: ['selected-code', 'function-context', 'class-context', 'imports', 'project-info'],
          maxContextTokens: 1200
        };

      case 'code-debugging':
        return {
          ...defaults,
          includeGitInfo: true,
          priority: ['selected-code', 'function-context', 'imports', 'recent-files', 'git-info'],
          maxContextTokens: 1000
        };

      case 'project-analysis':
        return {
          ...defaults,
          includeRecentFiles: true,
          includeGitInfo: true,
          priority: ['project-info', 'recent-files', 'git-info', 'active-file'],
          maxContextTokens: 800
        };

      default:
        return defaults;
    }
  }

  /**
   * Get workspace context
   */
  getWorkspaceContext(): WorkspaceContext | null {
    return this.workspaceContext;
  }

  /**
   * Get code context
   */
  getCodeContext(): CodeContext {
    return { ...this.codeContext };
  }

  /**
   * Get context statistics
   */
  getContextStats(): any {
    return {
      hasWorkspaceContext: !!this.workspaceContext,
      hasCodeContext: Object.keys(this.codeContext).length > 0,
      contextHistorySize: this.contextHistory.size,
      isAnalyzing: this.isAnalyzing,
      projectType: this.workspaceContext?.projectType.type,
      primaryLanguage: this.workspaceContext?.primaryLanguage
    };
  }

  /**
   * Clear context history
   */
  clearContextHistory(): void {
    this.contextHistory.clear();
    this.emit('contextHistoryCleared');
    console.log('Context history cleared');
  }

  /**
   * Cleanup resources
   */
  destroy(): void {
    this.contextHistory.clear();
    this.workspaceContext = null;
    this.codeContext = {};
    this.removeAllListeners();
    console.log('Context Manager destroyed');
  }
}

export default ContextManager;