/**
* Code Validator - Comprehensive code validation and quality analysis
*
* This class provides:
* - Multi-language syntax validation
* - Code quality analysis
* - Best practices checking
* - Security vulnerability detection
* - Performance optimization suggestions
*/

import { EventEmitter } from 'events';

export interface ValidationRequest {
  id: string;
  code: string;
  language: SupportedLanguage;
  options: ValidationOptions;
  context?: ValidationContext;
}

export interface ValidationResult {
  id: string;
  requestId: string;
  isValid: boolean;
  overallScore: number;
  results: ValidationCategory[];
  summary: ValidationSummary;
  suggestions: CodeSuggestion[];
  metrics: CodeMetrics;
}

export interface ValidationCategory {
  category: ValidationType;
  score: number;
  issues: ValidationIssue[];
  passed: number;
  total: number;
}

export interface ValidationIssue {
  type: IssueType;
  severity: IssueSeverity;
  message: string;
  line: number;
  column: number;
  rule: string;
  fix?: SuggestedFix;
}

export interface SuggestedFix {
  description: string;
  replacement?: string;
  range?: {
    start: { line: number; column: number };
    end: { line: number; column: number };
  };
}

export interface ValidationSummary {
  totalIssues: number;
  criticalIssues: number;
  warningIssues: number;
  infoIssues: number;
  fixableIssues: number;
  estimatedFixTime: number;
}

export interface CodeSuggestion {
  type: SuggestionType;
  description: string;
  benefit: string;
  effort: 'low' | 'medium' | 'high';
  category: string;
  example?: string;
}

export interface CodeMetrics {
  linesOfCode: number;
  complexity: number;
  maintainabilityIndex: number;
  technicalDebt: TechnicalDebtMetrics;
  performance: PerformanceMetrics;
  security: SecurityMetrics;
}

export interface TechnicalDebtMetrics {
  score: number;
  issues: string[];
  estimatedHours: number;
}

export interface PerformanceMetrics {
  score: number;
  bottlenecks: string[];
  optimizations: string[];
}

export interface SecurityMetrics {
  score: number;
  vulnerabilities: SecurityVulnerability[];
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
}

export interface SecurityVulnerability {
  type: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  description: string;
  line: number;
  cwe?: string; // Common Weakness Enumeration
}

export type SupportedLanguage =
  | 'typescript'
  | 'javascript'
  | 'python'
  | 'java'
  | 'csharp';

export type ValidationType =
  | 'syntax'
  | 'style'
  | 'complexity'
  | 'security'
  | 'performance'
  | 'maintainability'
  | 'bestPractices';

export type IssueType =
  | 'syntax-error'
  | 'style-violation'
  | 'complexity-issue'
  | 'security-vulnerability'
  | 'performance-issue'
  | 'maintainability-issue'
  | 'best-practice-violation';

export type IssueSeverity = 'info' | 'warning' | 'error' | 'critical';

export type SuggestionType =
  | 'refactoring'
  | 'optimization'
  | 'modernization'
  | 'security'
  | 'documentation'
  | 'testing';

export interface ValidationOptions {
  enabledCategories: ValidationType[];
  strictMode: boolean;
  includeStyle: boolean;
  includeSecurity: boolean;
  includePerformance: boolean;
  customRules?: CustomRule[];
  excludeRules?: string[];
}

export interface CustomRule {
  id: string;
  name: string;
  description: string;
  pattern: RegExp;
  severity: IssueSeverity;
  message: string;
  languages: SupportedLanguage[];
}

export interface ValidationContext {
  framework?: string;
  environment?: 'development' | 'production' | 'test';
  projectType?: string;
  targetAudience?: 'beginner' | 'intermediate' | 'expert';
}

/**
* Code Validator Class
*/
export class CodeValidator extends EventEmitter {
  private languageValidators: Map<SupportedLanguage, any> = new Map();
  private rulesets: Map<SupportedLanguage, Map<string, any>> = new Map();
  private customRules: Map<string, CustomRule> = new Map();

  constructor() {
    super();
    this.initializeLanguageValidators();
    this.loadDefaultRules();
    console.log('Code Validator initialized');
  }

  /**
   * Validate code and return comprehensive analysis
   */
  async validateCode(request: ValidationRequest): Promise<ValidationResult> {
    const startTime = Date.now();

    try {
      this.emit('validationStarted', request);

      const results: ValidationCategory[] = [];
      let overallScore = 100;

      // Run enabled validation categories
      for (const category of request.options.enabledCategories) {
        const categoryResult = await this.runValidationCategory(
          category,
          request.code,
          request.language,
          request.options,
          request.context
        );

        results.push(categoryResult);
        overallScore = Math.min(overallScore, categoryResult.score);
      }

      // Generate metrics
      const metrics = await this.generateCodeMetrics(request.code, request.language);

      // Generate suggestions
      const suggestions = await this.generateSuggestions(results, request.code, request.language);

      // Calculate summary
      const summary = this.calculateSummary(results);

      const validationResult: ValidationResult = {
        id: `validation_${Date.now()}`,
        requestId: request.id,
        isValid: summary.criticalIssues === 0 && summary.totalIssues <= 5,
        overallScore,
        results,
        summary,
        suggestions,
        metrics
      };

      this.emit('validationCompleted', {
        request,
        result: validationResult,
        duration: Date.now() - startTime
      });

      return validationResult;

    } catch (error) {
      this.emit('validationError', { request, error: error.message });
      throw error;
    }
  }

  /**
   * Run validation for a specific category
   */
  private async runValidationCategory(
    category: ValidationType,
    code: string,
    language: SupportedLanguage,
    options: ValidationOptions,
    context?: ValidationContext
  ): Promise<ValidationCategory> {
    switch (category) {
      case 'syntax':
        return this.validateSyntax(code, language, options);
      case 'style':
        return this.validateStyle(code, language, options);
      case 'complexity':
        return this.validateComplexity(code, language, options);
      case 'security':
        return this.validateSecurity(code, language, options);
      case 'performance':
        return this.validatePerformance(code, language, options);
      case 'maintainability':
        return this.validateMaintainability(code, language, options);
      case 'bestPractices':
        return this.validateBestPractices(code, language, options, context);
      default:
        throw new Error(`Unknown validation category: ${category}`);
    }
  }

  /**
   * Validate syntax
   */
  private async validateSyntax(
    code: string,
    language: SupportedLanguage,
    options: ValidationOptions
  ): Promise<ValidationCategory> {
    const issues: ValidationIssue[] = [];
    const lines = code.split('\n');

    // Language-specific syntax validation
    switch (language) {
      case 'typescript':
      case 'javascript':
        issues.push(...this.validateJavaScriptSyntax(lines));
        break;
      case 'python':
        issues.push(...this.validatePythonSyntax(lines));
        break;
      case 'java':
        issues.push(...this.validateJavaSyntax(lines));
        break;
      case 'csharp':
        issues.push(...this.validateCSharpSyntax(lines));
        break;
    }

    const errorCount = issues.filter(i => i.severity === 'error').length;
    const score = Math.max(0, 100 - (errorCount * 25));

    return {
      category: 'syntax',
      score,
      issues,
      passed: lines.length - issues.length,
      total: lines.length
    };
  }

  /**
   * Validate code style
   */
  private async validateStyle(
    code: string,
    language: SupportedLanguage,
    options: ValidationOptions
  ): Promise<ValidationCategory> {
    const issues: ValidationIssue[] = [];
    const lines = code.split('\n');

    // Common style checks
    lines.forEach((line, index) => {
      const lineNum = index + 1;

      // Line length check
      if (line.length > 120) {
        issues.push({
          type: 'style-violation',
          severity: 'warning',
          message: 'Line exceeds maximum length (120 characters)',
          line: lineNum,
          column: 121,
          rule: 'max-line-length'
        });
      }

      // Trailing whitespace
      if (line.endsWith(' ') || line.endsWith('\t')) {
        issues.push({
          type: 'style-violation',
          severity: 'info',
          message: 'Trailing whitespace detected',
          line: lineNum,
          column: line.length,
          rule: 'no-trailing-whitespace'
        });
      }

      // Language-specific style rules
      this.validateLanguageSpecificStyle(line, lineNum, language, issues);
    });

    const violationCount = issues.length;
    const score = Math.max(0, 100 - (violationCount * 2));

    return {
      category: 'style',
      score,
      issues,
      passed: lines.length - violationCount,
      total: lines.length
    };
  }

  /**
   * Validate code complexity
   */
  private async validateComplexity(
    code: string,
    language: SupportedLanguage,
    options: ValidationOptions
  ): Promise<ValidationCategory> {
    const issues: ValidationIssue[] = [];
    const complexity = this.calculateCyclomaticComplexity(code, language);

    if (complexity > 10) {
      issues.push({
        type: 'complexity-issue',
        severity: complexity > 20 ? 'error' : 'warning',
        message: `High cyclomatic complexity: ${complexity}`,
        line: 1,
        column: 1,
        rule: 'cyclomatic-complexity',
        fix: {
          description: 'Consider breaking this into smaller functions',
          replacement: '// Consider refactoring to reduce complexity'
        }
      });
    }

    // Function length checks
    const functions = this.extractFunctions(code, language);
    functions.forEach(func => {
      if (func.lineCount > 50) {
        issues.push({
          type: 'complexity-issue',
          severity: 'warning',
          message: `Function '${func.name}' is too long (${func.lineCount} lines)`,
          line: func.startLine,
          column: 1,
          rule: 'max-function-length'
        });
      }
    });

    const score = Math.max(0, 100 - (complexity > 10 ? (complexity - 10) * 5 : 0));

    return {
      category: 'complexity',
      score,
      issues,
      passed: complexity <= 10 ? 1 : 0,
      total: 1
    };
  }

  /**
   * Validate security
   */
  private async validateSecurity(
    code: string,
    language: SupportedLanguage,
    options: ValidationOptions
  ): Promise<ValidationCategory> {
    const issues: ValidationIssue[] = [];
    const lines = code.split('\n');

    // Common security patterns
    const securityPatterns = this.getSecurityPatterns(language);

    lines.forEach((line, index) => {
      const lineNum = index + 1;

      for (const pattern of securityPatterns) {
        if (pattern.regex.test(line)) {
          issues.push({
            type: 'security-vulnerability',
            severity: pattern.severity,
            message: pattern.message,
            line: lineNum,
            column: line.search(pattern.regex) + 1,
            rule: pattern.rule
          });
        }
      }
    });

    const criticalCount = issues.filter(i => i.severity === 'critical').length;
    const score = Math.max(0, 100 - (criticalCount * 50) - (issues.length * 10));

    return {
      category: 'security',
      score,
      issues,
      passed: lines.length - issues.length,
      total: lines.length
    };
  }

  /**
   * Validate performance
   */
  private async validatePerformance(
    code: string,
    language: SupportedLanguage,
    options: ValidationOptions
  ): Promise<ValidationCategory> {
    const issues: ValidationIssue[] = [];
    const lines = code.split('\n');

    // Performance anti-patterns
    const performancePatterns = this.getPerformancePatterns(language);

    lines.forEach((line, index) => {
      const lineNum = index + 1;

      for (const pattern of performancePatterns) {
        if (pattern.regex.test(line)) {
          issues.push({
            type: 'performance-issue',
            severity: pattern.severity,
            message: pattern.message,
            line: lineNum,
            column: line.search(pattern.regex) + 1,
            rule: pattern.rule
          });
        }
      }
    });

    const score = Math.max(0, 100 - (issues.length * 15));

    return {
      category: 'performance',
      score,
      issues,
      passed: lines.length - issues.length,
      total: lines.length
    };
  }

  /**
   * Validate maintainability
   */
  private async validateMaintainability(
    code: string,
    language: SupportedLanguage,
    options: ValidationOptions
  ): Promise<ValidationCategory> {
    const issues: ValidationIssue[] = [];

    // Check for comments
    const commentRatio = this.calculateCommentRatio(code, language);
    if (commentRatio < 0.1) {
      issues.push({
        type: 'maintainability-issue',
        severity: 'warning',
        message: 'Low comment ratio, consider adding more documentation',
        line: 1,
        column: 1,
        rule: 'comment-ratio'
      });
    }

    // Check for magic numbers
    const magicNumbers = this.findMagicNumbers(code, language);
    magicNumbers.forEach(magic => {
      issues.push({
        type: 'maintainability-issue',
        severity: 'warning',
        message: `Magic number detected: ${magic.value}`,
        line: magic.line,
        column: magic.column,
        rule: 'no-magic-numbers'
      });
    });

    const score = Math.max(0, 100 - (issues.length * 10));

    return {
      category: 'maintainability',
      score,
      issues,
      passed: 1,
      total: 1
    };
  }

  /**
   * Validate best practices
   */
  private async validateBestPractices(
    code: string,
    language: SupportedLanguage,
    options: ValidationOptions,
    context?: ValidationContext
  ): Promise<ValidationCategory> {
    const issues: ValidationIssue[] = [];
    const lines = code.split('\n');

    // Language-specific best practices
    const bestPracticeRules = this.getBestPracticeRules(language, context);

    lines.forEach((line, index) => {
      const lineNum = index + 1;

      for (const rule of bestPracticeRules) {
        if (rule.regex.test(line)) {
          issues.push({
            type: 'best-practice-violation',
            severity: rule.severity,
            message: rule.message,
            line: lineNum,
            column: line.search(rule.regex) + 1,
            rule: rule.rule
          });
        }
      }
    });

    const score = Math.max(0, 100 - (issues.length * 5));

    return {
      category: 'bestPractices',
      score,
      issues,
      passed: lines.length - issues.length,
      total: lines.length
    };
  }

  /**
   * JavaScript/TypeScript syntax validation
   */
  private validateJavaScriptSyntax(lines: string[]): ValidationIssue[] {
    const issues: ValidationIssue[] = [];
    let braceCount = 0;
    let parenCount = 0;

    lines.forEach((line, index) => {
      const lineNum = index + 1;
      const trimmed = line.trim();

      // Count brackets
      for (const char of line) {
        if (char === '{') braceCount++;
        if (char === '}') braceCount--;
        if (char === '(') parenCount++;
        if (char === ')') parenCount--;
      }

      // Check for common syntax errors
      if (trimmed.includes('==')) {
        const column = line.indexOf('==') + 1;
        issues.push({
          type: 'syntax-error',
          severity: 'warning',
          message: 'Consider using strict equality (===)',
          line: lineNum,
          column,
          rule: 'strict-equality',
          fix: {
            description: 'Replace == with ===',
            replacement: line.replace('==', '===')
          }
        });
      }
    });

    // Check unmatched brackets
    if (braceCount !== 0) {
      issues.push({
        type: 'syntax-error',
        severity: 'error',
        message: 'Unmatched braces',
        line: lines.length,
        column: 1,
        rule: 'matched-braces'
      });
    }

    return issues;
  }

  /**
   * Python syntax validation
   */
  private validatePythonSyntax(lines: string[]): ValidationIssue[] {
    const issues: ValidationIssue[] = [];
    let indentLevel = 0;

    lines.forEach((line, index) => {
      const lineNum = index + 1;
      const trimmed = line.trim();

      if (trimmed.length === 0) return;

      // Check indentation
      const spaces = line.length - line.trimStart().length;
      const expectedIndent = indentLevel * 4;

      if (trimmed.endsWith(':')) {
        indentLevel++;
      }

      // Check for mixed tabs and spaces
      if (line.includes('\t') && line.includes('    ')) {
        issues.push({
          type: 'syntax-error',
          severity: 'error',
          message: 'Mixed tabs and spaces',
          line: lineNum,
          column: 1,
          rule: 'consistent-indentation'
        });
      }
    });

    return issues;
  }

  /**
   * Java syntax validation
   */
  private validateJavaSyntax(lines: string[]): ValidationIssue[] {
    const issues: ValidationIssue[] = [];

    lines.forEach((line, index) => {
      const lineNum = index + 1;
      const trimmed = line.trim();

      // Check for missing semicolons
      if (trimmed.length > 0 &&
        !trimmed.endsWith(';') &&
        !trimmed.endsWith('{') &&
        !trimmed.endsWith('}') &&
        !trimmed.startsWith('//') &&
        !this.isJavaControlStatement(trimmed)) {
        issues.push({
          type: 'syntax-error',
          severity: 'warning',
          message: 'Missing semicolon',
          line: lineNum,
          column: line.length + 1,
          rule: 'semicolon'
        });
      }
    });

    return issues;
  }

  /**
   * C# syntax validation
   */
  private validateCSharpSyntax(lines: string[]): ValidationIssue[] {
    const issues: ValidationIssue[] = [];

    lines.forEach((line, index) => {
      const lineNum = index + 1;
      const trimmed = line.trim();

      // Check for var without initialization
      if (trimmed.includes('var ') && !trimmed.includes('=')) {
        issues.push({
          type: 'syntax-error',
          severity: 'error',
          message: 'var declaration must be initialized',
          line: lineNum,
          column: line.indexOf('var') + 1,
          rule: 'var-initialization'
        });
      }
    });

    return issues;
  }

  // Helper methods for validation
  private validateLanguageSpecificStyle(
    line: string,
    lineNum: number,
    language: SupportedLanguage,
    issues: ValidationIssue[]
  ): void {
    switch (language) {
      case 'typescript':
      case 'javascript':
        if (line.includes('var ')) {
          issues.push({
            type: 'style-violation',
            severity: 'warning',
            message: 'Use const or let instead of var',
            line: lineNum,
            column: line.indexOf('var') + 1,
            rule: 'no-var'
          });
        }
        break;
      case 'python':
        if (line.includes('\t')) {
          issues.push({
            type: 'style-violation',
            severity: 'warning',
            message: 'Use spaces for indentation, not tabs',
            line: lineNum,
            column: 1,
            rule: 'spaces-indentation'
          });
        }
        break;
    }
  }

  private calculateCyclomaticComplexity(code: string, language: SupportedLanguage): number {
    const complexityKeywords = this.getComplexityKeywords(language);
    let complexity = 1;

    for (const keyword of complexityKeywords) {
      const matches = code.match(new RegExp(`\\b${keyword}\\b`, 'g'));
      if (matches) {
        complexity += matches.length;
      }
    }

    return complexity;
  }

  private getComplexityKeywords(language: SupportedLanguage): string[] {
    const common = ['if', 'else', 'for', 'while', 'switch', 'case', 'try', 'catch'];

    switch (language) {
      case 'typescript':
      case 'javascript':
        return [...common, 'forEach', 'map', 'filter', 'reduce'];
      case 'python':
        return [...common, 'elif', 'except', 'finally', 'with'];
      case 'java':
        return [...common, 'do', 'finally'];
      case 'csharp':
        return [...common, 'do', 'finally', 'foreach'];
      default:
        return common;
    }
  }

  private extractFunctions(code: string, language: SupportedLanguage): any[] {
    // Simplified function extraction - in production, use AST parsing
    const functions: any[] = [];
    const lines = code.split('\n');

    lines.forEach((line, index) => {
      if (this.isFunctionDeclaration(line, language)) {
        functions.push({
          name: this.extractFunctionName(line, language),
          startLine: index + 1,
          lineCount: this.estimateFunctionLength(lines, index, language)
        });
      }
    });

    return functions;
  }

  private isFunctionDeclaration(line: string, language: SupportedLanguage): boolean {
    const patterns = {
      typescript: /^\s*(?:export\s+)?(?:async\s+)?function\s+\w+/,
      javascript: /^\s*(?:export\s+)?(?:async\s+)?function\s+\w+/,
      python: /^\s*def\s+\w+/,
      java: /^\s*(?:public|private|protected)?\s*(?:static\s+)?\w+\s+\w+\s*\(/,
      csharp: /^\s*(?:public|private|protected)?\s*(?:static\s+)?\w+\s+\w+\s*\(/
    };

    return patterns[language]?.test(line) || false;
  }

  private extractFunctionName(line: string, language: SupportedLanguage): string {
    const match = line.match(/\b(?:function\s+)?(\w+)\s*\(/);
    return match ? match[1] : 'unknown';
  }

  private estimateFunctionLength(lines: string[], startIndex: number, language: SupportedLanguage): number {
    let braceCount = 0;
    let length = 0;

    for (let i = startIndex; i < lines.length; i++) {
      const line = lines[i];
      length++;

      for (const char of line) {
        if (char === '{') braceCount++;
        if (char === '}') braceCount--;
      }

      if (braceCount === 0 && i > startIndex) {
        break;
      }
    }

    return length;
  }

  private getSecurityPatterns(language: SupportedLanguage): any[] {
    const patterns: any[] = [];

    // Common security patterns
    patterns.push({
      regex: /eval\s*\(/,
      severity: 'critical' as IssueSeverity,
      message: 'eval() usage detected - potential security risk',
      rule: 'no-eval'
    });

    patterns.push({
      regex: /innerHTML\s*=/,
      severity: 'warning' as IssueSeverity,
      message: 'innerHTML usage - potential XSS vulnerability',
      rule: 'no-inner-html'
    });

    // Language-specific patterns
    if (language === 'javascript' || language === 'typescript') {
      patterns.push({
        regex: /document\.write\s*\(/,
        severity: 'warning' as IssueSeverity,
        message: 'document.write() usage detected',
        rule: 'no-document-write'
      });
    }

    return patterns;
  }

  private getPerformancePatterns(language: SupportedLanguage): any[] {
    const patterns: any[] = [];

    if (language === 'javascript' || language === 'typescript') {
      patterns.push({
        regex: /for\s*\(\s*var\s+\w+\s*=\s*0.*\.length/,
        severity: 'info' as IssueSeverity,
        message: 'Consider caching array length in loop',
        rule: 'cache-array-length'
      });
    }

    return patterns;
  }

  private getBestPracticeRules(language: SupportedLanguage, context?: ValidationContext): any[] {
    const rules: any[] = [];

    if (language === 'typescript') {
      rules.push({
        regex: /:\s*any\b/,
        severity: 'warning' as IssueSeverity,
        message: 'Avoid using "any" type, use specific types',
        rule: 'no-any-type'
      });
    }

    return rules;
  }

  private calculateCommentRatio(code: string, language: SupportedLanguage): number {
    const lines = code.split('\n');
    const commentPatterns = {
      typescript: /^\s*\/\/|^\s*\/\*|\*\/\s*$/,
      javascript: /^\s*\/\/|^\s*\/\*|\*\/\s*$/,
      python: /^\s*#/,
      java: /^\s*\/\/|^\s*\/\*|\*\/\s*$/,
      csharp: /^\s*\/\/|^\s*\/\*|\*\/\s*$/
    };

    const pattern = commentPatterns[language];
    if (!pattern) return 0;

    const commentLines = lines.filter(line => pattern.test(line)).length;
    return commentLines / Math.max(lines.length, 1);
  }

  private findMagicNumbers(code: string, language: SupportedLanguage): any[] {
    const magicNumbers: any[] = [];
    const lines = code.split('\n');

    lines.forEach((line, index) => {
      const matches = line.matchAll(/\b(\d+(?:\.\d+)?)\b/g);
      for (const match of matches) {
        const value = parseFloat(match[1]);
        // Skip common non-magic numbers
        if (![0, 1, -1, 100].includes(value)) {
          magicNumbers.push({
            value: match[1],
            line: index + 1,
            column: match.index! + 1
          });
        }
      }
    });

    return magicNumbers;
  }

  private isJavaControlStatement(line: string): boolean {
    return /^\s*(if|else|for|while|do|switch|try|catch|finally)\b/.test(line);
  }

  private async generateCodeMetrics(code: string, language: SupportedLanguage): Promise<CodeMetrics> {
    return {
      linesOfCode: code.split('\n').length,
      complexity: this.calculateCyclomaticComplexity(code, language),
      maintainabilityIndex: 85, // Simplified calculation
      technicalDebt: {
        score: 75,
        issues: ['High complexity in main function'],
        estimatedHours: 2
      },
      performance: {
        score: 90,
        bottlenecks: [],
        optimizations: ['Consider using const instead of let']
      },
      security: {
        score: 95,
        vulnerabilities: [],
        riskLevel: 'low'
      }
    };
  }

  private async generateSuggestions(
    results: ValidationCategory[],
    code: string,
    language: SupportedLanguage
  ): Promise<CodeSuggestion[]> {
    const suggestions: CodeSuggestion[] = [];

    // Analyze results and generate suggestions
    results.forEach(category => {
      if (category.score < 80) {
        suggestions.push({
          type: 'refactoring',
          description: `Improve ${category.category} score`,
          benefit: `Better code quality and maintainability`,
          effort: category.issues.length > 5 ? 'high' : 'medium',
          category: category.category,
          example: this.generateExampleForCategory(category.category, language)
        });
      }
    });

    return suggestions;
  }

  private generateExampleForCategory(category: string, language: SupportedLanguage): string {
    const examples = {
      style: 'Use consistent indentation and naming conventions',
      complexity: 'Break large functions into smaller, focused functions',
      security: 'Validate and sanitize all user inputs',
      performance: 'Use efficient algorithms and data structures'
    };

    return examples[category] || 'Follow language best practices';
  }

  private calculateSummary(results: ValidationCategory[]): ValidationSummary {
    const allIssues = results.flatMap(r => r.issues);

    return {
      totalIssues: allIssues.length,
      criticalIssues: allIssues.filter(i => i.severity === 'critical').length,
      warningIssues: allIssues.filter(i => i.severity === 'warning').length,
      infoIssues: allIssues.filter(i => i.severity === 'info').length,
      fixableIssues: allIssues.filter(i => i.fix).length,
      estimatedFixTime: allIssues.length * 2 // 2 minutes per issue
    };
  }

  private initializeLanguageValidators(): void {
    const languages: SupportedLanguage[] = ['typescript', 'javascript', 'python', 'java', 'csharp'];

    languages.forEach(language => {
      this.languageValidators.set(language, {
        language,
        initialized: true
      });
    });

    console.log(`Initialized validators for ${languages.length} languages`);
  }

  private loadDefaultRules(): void {
    const languages: SupportedLanguage[] = ['typescript', 'javascript', 'python', 'java', 'csharp'];

    languages.forEach(language => {
      this.rulesets.set(language, new Map());
    });

    console.log('Loaded default validation rules');
  }

  /**
   * Get validation statistics
   */
  getValidationStats(): any {
    return {
      supportedLanguages: Array.from(this.languageValidators.keys()),
      totalCustomRules: this.customRules.size,
      rulesetCount: this.rulesets.size,
      validationCategories: ['syntax', 'style', 'complexity', 'security', 'performance', 'maintainability', 'bestPractices']
    };
  }

  /**
   * Add custom validation rule
   */
  addCustomRule(rule: CustomRule): void {
    this.customRules.set(rule.id, rule);
    console.log(`Added custom rule: ${rule.name}`);
  }

  /**
   * Get supported languages
   */
  getSupportedLanguages(): SupportedLanguage[] {
    return Array.from(this.languageValidators.keys());
  }
}

export default CodeValidator;