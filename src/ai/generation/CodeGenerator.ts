/**
* Code Generator - Core engine for transforming natural language into functional code
*
* This class provides:
* - Natural language to code transformation
* - Multi-language code generation support
* - Template-based code scaffolding
* - Context-aware code generation
* - Code validation and syntax checking
*/

import { EventEmitter } from 'events';
import { aiOrchestrator } from '../orchestrator/AIOrchestrator.js';

export interface CodeGenerationRequest {
  id: string;
  description: string;
  language: SupportedLanguage;
  type: CodeType;
  context?: GenerationContext;
  options?: GenerationOptions;
}

export interface CodeGenerationResponse {
  id: string;
  requestId: string;
  generatedCode: string;
  explanation: string;
  language: SupportedLanguage;
  type: CodeType;
  metadata: CodeMetadata;
  validation: ValidationResult;
}

export type SupportedLanguage =
  | 'typescript'
  | 'javascript'
  | 'python'
  | 'java'
  | 'csharp';

export type CodeType =
  | 'function'
  | 'class'
  | 'interface'
  | 'component'
  | 'module'
  | 'test'
  | 'api'
  | 'utility'
  | 'snippet';

export interface GenerationContext {
  activeFile?: string;
  selectedCode?: string;
  surroundingCode?: string;
  imports?: string[];
  variables?: VariableInfo[];
  functions?: FunctionInfo[];
  classes?: ClassInfo[];
  projectType?: string;
  framework?: string;
}

export interface GenerationOptions {
  style?: 'functional' | 'object-oriented' | 'procedural';
  complexity?: 'simple' | 'intermediate' | 'advanced';
  includeComments?: boolean;
  includeTests?: boolean;
  includeDocumentation?: boolean;
  maxLines?: number;
  targetAudience?: 'beginner' | 'intermediate' | 'expert';
  bestPractices?: boolean;
}

export interface VariableInfo {
  name: string;
  type: string;
  scope: string;
}

export interface FunctionInfo {
  name: string;
  parameters: string[];
  returnType: string;
}

export interface ClassInfo {
  name: string;
  methods: string[];
  properties: string[];
}

export interface CodeMetadata {
  linesOfCode: number;
  complexity: number;
  dependencies: string[];
  suggestedImports: string[];
  performance: PerformanceMetrics;
  security: SecurityMetrics;
}

export interface PerformanceMetrics {
  timeComplexity: string;
  spaceComplexity: string;
  optimizationTips: string[];
}

export interface SecurityMetrics {
  vulnerabilities: SecurityIssue[];
  recommendations: string[];
  securityScore: number;
}

export interface SecurityIssue {
  type: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  description: string;
  line?: number;
}

export interface ValidationResult {
  isValid: boolean;
  syntaxErrors: SyntaxError[];
  warnings: Warning[];
  suggestions: Suggestion[];
  score: number;
}

export interface SyntaxError {
  line: number;
  column: number;
  message: string;
  severity: 'error' | 'warning';
}

export interface Warning {
  line: number;
  message: string;
  type: string;
}

export interface Suggestion {
  line: number;
  message: string;
  improvement: string;
}

/**
* Code Generator Class
*/
export class CodeGenerator extends EventEmitter {
  private languageGenerators: Map<SupportedLanguage, any> = new Map();
  private templateEngine: any; // Will be implemented
  private validationEngine: any; // Will be implemented
  private requestHistory: Map<string, CodeGenerationRequest> = new Map();

  constructor() {
    super();
    this.initializeLanguageGenerators();
    console.log('Code Generator initialized');
  }

  /**
   * Generate code from natural language description
   */
  async generateCode(request: CodeGenerationRequest): Promise<CodeGenerationResponse> {
    const startTime = Date.now();

    try {
      // Validate request
      this.validateRequest(request);

      // Store request in history
      this.requestHistory.set(request.id, request);

      // Emit generation started event
      this.emit('generationStarted', request);

      // Prepare AI prompt for code generation
      const prompt = await this.prepareGenerationPrompt(request);

      // Get AI response
      const aiRequest = {
        id: `gen_${request.id}`,
        type: 'code-generation' as const,
        content: prompt,
        context: {
          language: request.language,
          framework: request.context?.framework,
          projectId: request.context?.activeFile
        },
        options: {
          temperature: 0.1, // Low temperature for consistent code generation
          maxTokens: Math.min(request.options?.maxLines ? request.options.maxLines * 50 : 2048, 4096)
        }
      };

      const aiResponse = await aiOrchestrator.processRequest(aiRequest);

      // Extract generated code from AI response
      const extractedCode = this.extractCodeFromResponse(aiResponse.content, request.language);

      // Validate generated code
      const validation = await this.validateGeneratedCode(extractedCode, request.language);

      // Generate metadata
      const metadata = await this.generateCodeMetadata(extractedCode, request);

      // Prepare response
      const response: CodeGenerationResponse = {
        id: `resp_${Date.now()}`,
        requestId: request.id,
        generatedCode: extractedCode.code,
        explanation: extractedCode.explanation,
        language: request.language,
        type: request.type,
        metadata,
        validation
      };

      // Emit generation completed event
      this.emit('generationCompleted', { request, response, duration: Date.now() - startTime });

      console.log(`Generated ${request.language} ${request.type} (${metadata.linesOfCode} lines)`);
      return response;

    } catch (error) {
      this.emit('generationError', { request, error: error.message, duration: Date.now() - startTime });
      throw new Error(`Code generation failed: ${error.message}`);
    }
  }

  /**
   * Generate code from template
   */
  async generateFromTemplate(
    templateName: string,
    parameters: Record<string, any>,
    language: SupportedLanguage
  ): Promise<string> {
    try {
      const template = this.getTemplate(templateName, language);
      if (!template) {
        throw new Error(`Template '${templateName}' not found for ${language}`);
      }

      const generatedCode = this.processTemplate(template, parameters);
      return generatedCode;

    } catch (error) {
      throw new Error(`Template generation failed: ${error.message}`);
    }
  }

  /**
   * Prepare AI prompt for code generation
   */
  private async prepareGenerationPrompt(request: CodeGenerationRequest): Promise<string> {
    const { description, language, type, context, options } = request;

    let prompt = `Generate ${language} code for the following request:\n\n`;
    prompt += `**Request**: ${description}\n`;
    prompt += `**Type**: ${type}\n`;
    prompt += `**Language**: ${language}\n\n`;

    // Add context information
    if (context) {
      prompt += `**Context**:\n`;

      if (context.framework) {
        prompt += `- Framework: ${context.framework}\n`;
      }

      if (context.projectType) {
        prompt += `- Project Type: ${context.projectType}\n`;
      }

      if (context.imports && context.imports.length > 0) {
        prompt += `- Available Imports: ${context.imports.join(', ')}\n`;
      }

      if (context.variables && context.variables.length > 0) {
        prompt += `- Available Variables: ${context.variables.map(v => `${v.name}: ${v.type}`).join(', ')}\n`;
      }

      if (context.functions && context.functions.length > 0) {
        prompt += `- Available Functions: ${context.functions.map(f => f.name).join(', ')}\n`;
      }

      if (context.selectedCode) {
        prompt += `- Selected Code Context:\n\`\`\`${language}\n${context.selectedCode}\n\`\`\`\n`;
      }

      prompt += '\n';
    }

    // Add generation options
    if (options) {
      prompt += `**Requirements**:\n`;

      if (options.style) {
        prompt += `- Programming Style: ${options.style}\n`;
      }

      if (options.complexity) {
        prompt += `- Complexity Level: ${options.complexity}\n`;
      }

      if (options.includeComments) {
        prompt += `- Include detailed comments and documentation\n`;
      }

      if (options.includeTests) {
        prompt += `- Include unit tests\n`;
      }

      if (options.bestPractices) {
        prompt += `- Follow best practices and design patterns\n`;
      }

      if (options.maxLines) {
        prompt += `- Maximum lines: ${options.maxLines}\n`;
      }

      prompt += '\n';
    }

    // Add language-specific guidelines
    prompt += this.getLanguageSpecificGuidelines(language, type);

    prompt += `\n**Output Format**:
Please provide:
1. The complete, functional code
2. A brief explanation of the implementation
3. Any important usage notes or considerations

Make sure the code is:
- Syntactically correct and runnable
- Well-structured and readable
- Following ${language} best practices
- Properly commented
- Error-handled where appropriate`;

    return prompt;
  }

  /**
   * Get language-specific generation guidelines
   */
  private getLanguageSpecificGuidelines(language: SupportedLanguage, type: CodeType): string {
    const guidelines: Record<SupportedLanguage, Record<CodeType, string>> = {
      typescript: {
        function: '- Use proper TypeScript types and interfaces\n- Include parameter and return type annotations\n- Use modern ES6+ features',
        class: '- Use proper access modifiers (public, private, protected)\n- Include constructor with typed parameters\n- Use interfaces for contracts',
        interface: '- Define clear, specific interfaces\n- Use generic types where appropriate\n- Include JSDoc comments',
        component: '- Use React functional components with TypeScript\n- Include proper prop types\n- Use hooks appropriately',
        module: '- Use ES6 module syntax\n- Include proper exports\n- Structure for maintainability',
        test: '- Use Jest/Vitest testing framework\n- Include describe, it, and expect\n- Test both positive and negative cases',
        api: '- Use Express.js with TypeScript\n- Include proper error handling\n- Use async/await patterns',
        utility: '- Create pure functions when possible\n- Include comprehensive error handling\n- Use generic types for reusability',
        snippet: '- Focus on the specific functionality\n- Keep it concise but complete\n- Include necessary imports'
      },
      javascript: {
        function: '- Use modern ES6+ syntax\n- Include JSDoc comments\n- Use arrow functions where appropriate',
        class: '- Use class syntax\n- Include constructor\n- Use proper method definitions',
        interface: '- Use JSDoc for type documentation\n- Consider using TypeScript interfaces\n- Document expected structure',
        component: '- Use React functional components\n- Include PropTypes validation\n- Use hooks appropriately',
        module: '- Use ES6 module syntax\n- Include proper exports\n- Consider CommonJS if needed',
        test: '- Use Jest testing framework\n- Include describe, it, and expect\n- Test edge cases',
        api: '- Use Express.js\n- Include proper error handling\n- Use async/await or promises',
        utility: '- Create pure functions\n- Include error handling\n- Use modern JavaScript features',
        snippet: '- Focus on functionality\n- Keep concise\n- Include context comments'
      },
      python: {
        function: '- Use proper function documentation (docstrings)\n- Follow PEP 8 style guidelines\n- Include type hints',
        class: '- Use proper class structure\n- Include __init__ method\n- Follow naming conventions',
        interface: '- Use abstract base classes or protocols\n- Include proper documentation\n- Define clear contracts',
        component: '- Structure for reusability\n- Include proper documentation\n- Follow Python conventions',
        module: '- Include module docstring\n- Use proper imports\n- Structure for maintainability',
        test: '- Use pytest or unittest\n- Include fixtures where needed\n- Test various scenarios',
        api: '- Use Flask or FastAPI\n- Include proper error handling\n- Use decorators appropriately',
        utility: '- Create pure functions\n- Include comprehensive docstrings\n- Handle edge cases',
        snippet: '- Focus on specific task\n- Include brief documentation\n- Use Pythonic patterns'
      },
      java: {
        function: '- Use proper access modifiers\n- Include Javadoc comments\n- Follow naming conventions',
        class: '- Use proper class structure\n- Include constructors\n- Use appropriate design patterns',
        interface: '- Define clear contracts\n- Include documentation\n- Use generic types where appropriate',
        component: '- Structure for reusability\n- Include proper annotations\n- Follow Java conventions',
        module: '- Use package structure\n- Include proper imports\n- Structure for maintainability',
        test: '- Use JUnit framework\n- Include @Test annotations\n- Test multiple scenarios',
        api: '- Use Spring Boot or similar\n- Include proper annotations\n- Use REST conventions',
        utility: '- Create static utility methods\n- Include proper documentation\n- Handle exceptions',
        snippet: '- Focus on functionality\n- Include necessary imports\n- Use Java best practices'
      },
      csharp: {
        function: '- Use proper access modifiers\n- Include XML documentation\n- Follow C# naming conventions',
        class: '- Use proper class structure\n- Include constructors and properties\n- Use appropriate modifiers',
        interface: '- Define clear contracts\n- Include documentation\n- Use generic constraints',
        component: '- Structure for reusability\n- Include proper attributes\n- Follow .NET conventions',
        module: '- Use namespace structure\n- Include proper using statements\n- Structure for maintainability',
        test: '- Use MSTest, NUnit, or xUnit\n- Include test attributes\n- Test various scenarios',
        api: '- Use ASP.NET Core\n- Include proper attributes\n- Use dependency injection',
        utility: '- Create static utility methods\n- Include comprehensive documentation\n- Handle exceptions properly',
        snippet: '- Focus on specific functionality\n- Include necessary using statements\n- Use C# best practices'
      }
    };

    return guidelines[language]?.[type] || '- Follow language best practices\n- Include proper documentation\n- Structure code clearly';
  }

  /**
   * Extract code from AI response
   */
  private extractCodeFromResponse(response: string, language: SupportedLanguage): { code: string; explanation: string } {
    // Extract code blocks from the response
    const codeBlockRegex = new RegExp(`\`\`\`(?:${language}|\\w*)\\n([\\s\\S]*?)\`\`\``, 'gi');
    const matches = response.match(codeBlockRegex);

    let extractedCode = '';
    let explanation = response;

    if (matches && matches.length > 0) {
      // Get the largest code block (most likely the main implementation)
      const codeBlocks = matches.map(match => {
        const code = match.replace(/```\w*\n/, '').replace(/```$/, '').trim();
        return code;
      });

      extractedCode = codeBlocks.reduce((longest, current) =>
        current.length > longest.length ? current : longest, ''
      );

      // Remove code blocks from explanation
      explanation = response.replace(codeBlockRegex, '[CODE_BLOCK]').trim();
    } else {
      // If no code blocks found, try to extract the main content
      const lines = response.split('\n');
      const codeLines: string[] = [];
      const explanationLines: string[] = [];

      let inCodeSection = false;

      for (const line of lines) {
        if (line.trim().length === 0) continue;

        // Heuristics to detect code vs explanation
        if (this.looksLikeCode(line, language)) {
          inCodeSection = true;
          codeLines.push(line);
        } else if (inCodeSection && this.isCodeContinuation(line)) {
          codeLines.push(line);
        } else {
          inCodeSection = false;
          explanationLines.push(line);
        }
      }

      extractedCode = codeLines.join('\n');
      explanation = explanationLines.join('\n');
    }

    return {
      code: extractedCode || response, // Fallback to full response if no code extracted
      explanation: explanation || 'Generated code based on the provided requirements.'
    };
  }

  /**
   * Check if a line looks like code
   */
  private looksLikeCode(line: string, language: SupportedLanguage): boolean {
    const trimmed = line.trim();

    // Common code patterns
    const codePatterns = {
      typescript: [/^(export\s+)?(interface|class|function|const|let|var|type)\s+/, /^import\s+/, /.*[{};]$/],
      javascript: [/^(export\s+)?(function|const|let|var|class)\s+/, /^import\s+/, /.*[{};]$/],
      python: [/^(def|class|import|from)\s+/, /^@\w+/, /.*:$/],
      java: [/^(public|private|protected)?\s*(static\s+)?(class|interface|void|int|String)/, /^import\s+/, /.*[{};]$/],
      csharp: [/^(public|private|protected)?\s*(static\s+)?(class|interface|void|int|string)/, /^using\s+/, /.*[{};]$/]
    };

    const patterns = codePatterns[language] || [];
    return patterns.some(pattern => pattern.test(trimmed));
  }

  /**
   * Check if a line is a continuation of code
   */
  private isCodeContinuation(line: string): boolean {
    const trimmed = line.trim();

    // Indentation suggests code continuation
    if (line.startsWith('  ') || line.startsWith('\t')) {
      return true;
    }

    // Common code continuation patterns
    const continuationPatterns = [
      /^[.})\]]/,  // Closing brackets or method chaining
      /^[,;]$/,     // Semicolons or commas
      /^\s*\)/,     // Closing parentheses
      /^\s*else/,   // Else statements
      /^\s*catch/,  // Catch blocks
    ];

    return continuationPatterns.some(pattern => pattern.test(trimmed));
  }

  /**
   * Validate generated code
   */
  private async validateGeneratedCode(code: string, language: SupportedLanguage): Promise<ValidationResult> {
    const result: ValidationResult = {
      isValid: true,
      syntaxErrors: [],
      warnings: [],
      suggestions: [],
      score: 100
    };

    try {
      // Basic syntax validation
      const syntaxValidation = this.validateSyntax(code, language);
      result.syntaxErrors = syntaxValidation.errors;

      // Code quality checks
      const qualityValidation = this.validateCodeQuality(code, language);
      result.warnings = qualityValidation.warnings;
      result.suggestions = qualityValidation.suggestions;

      // Calculate overall score
      result.isValid = result.syntaxErrors.length === 0;
      result.score = Math.max(0, 100 - (result.syntaxErrors.length * 20) - (result.warnings.length * 5));

    } catch (error) {
      result.isValid = false;
      result.syntaxErrors.push({
        line: 1,
        column: 1,
        message: `Validation error: ${error.message}`,
        severity: 'error'
      });
      result.score = 0;
    }

    return result;
  }

  /**
   * Basic syntax validation
   */
  private validateSyntax(code: string, language: SupportedLanguage): { errors: SyntaxError[] } {
    const errors: SyntaxError[] = [];
    const lines = code.split('\n');

    // Language-specific syntax checks
    switch (language) {
      case 'typescript':
      case 'javascript':
        this.validateJSTypeSyntax(lines, errors);
        break;
      case 'python':
        this.validatePythonSyntax(lines, errors);
        break;
      case 'java':
        this.validateJavaSyntax(lines, errors);
        break;
      case 'csharp':
        this.validateCSharpSyntax(lines, errors);
        break;
    }

    return { errors };
  }

  /**
   * Validate JavaScript/TypeScript syntax
   */
  private validateJSTypeSyntax(lines: string[], errors: SyntaxError[]): void {
    let braceCount = 0;
    let parenCount = 0;
    let bracketCount = 0;

    lines.forEach((line, index) => {
      const lineNum = index + 1;

      // Count brackets
      for (const char of line) {
        switch (char) {
          case '{': braceCount++; break;
          case '}': braceCount--; break;
          case '(': parenCount++; break;
          case ')': parenCount--; break;
          case '[': bracketCount++; break;
          case ']': bracketCount--; break;
        }
      }

      // Check for common syntax errors
      if (line.trim().endsWith(',') && !line.includes('[') && !line.includes('{')) {
        errors.push({
          line: lineNum,
          column: line.length,
          message: 'Unexpected comma at end of line',
          severity: 'warning'
        });
      }
    });

    // Check unmatched brackets
    if (braceCount !== 0) {
      errors.push({
        line: lines.length,
        column: 1,
        message: `Unmatched braces: ${braceCount > 0 ? 'missing closing' : 'extra closing'} brace(s)`,
        severity: 'error'
      });
    }

    if (parenCount !== 0) {
      errors.push({
        line: lines.length,
        column: 1,
        message: `Unmatched parentheses: ${parenCount > 0 ? 'missing closing' : 'extra closing'} parenthesis`,
        severity: 'error'
      });
    }
  }

  /**
   * Validate Python syntax
   */
  private validatePythonSyntax(lines: string[], errors: SyntaxError[]): void {
    let indentLevel = 0;

    lines.forEach((line, index) => {
      const lineNum = index + 1;
      const trimmed = line.trim();

      if (trimmed.length === 0) return;

      // Check indentation
      const leadingSpaces = line.length - line.trimStart().length;
      const expectedIndent = indentLevel * 4;

      if (trimmed.endsWith(':')) {
        indentLevel++;
      }

      // Check for common Python syntax issues
      if (trimmed.includes('=') && !trimmed.includes('==') && !trimmed.includes('!=')) {
        const parts = trimmed.split('=');
        if (parts.length === 2 && parts[1].trim().startsWith('=')) {
          errors.push({
            line: lineNum,
            column: line.indexOf('='),
            message: 'Possible assignment instead of comparison',
            severity: 'warning'
          });
        }
      }
    });
  }

  /**
   * Validate Java syntax
   */
  private validateJavaSyntax(lines: string[], errors: SyntaxError[]): void {
    let braceCount = 0;
    let inClass = false;

    lines.forEach((line, index) => {
      const lineNum = index + 1;
      const trimmed = line.trim();

      // Count braces
      braceCount += (line.match(/{/g) || []).length;
      braceCount -= (line.match(/}/g) || []).length;

      // Check for class declaration
      if (trimmed.includes('class ')) {
        inClass = true;
      }

      // Check for missing semicolons
      if (trimmed.length > 0 &&
        !trimmed.endsWith(';') &&
        !trimmed.endsWith('{') &&
        !trimmed.endsWith('}') &&
        !trimmed.startsWith('//') &&
        !trimmed.includes('class ') &&
        !trimmed.includes('if ') &&
        !trimmed.includes('for ') &&
        !trimmed.includes('while ')) {
        errors.push({
          line: lineNum,
          column: line.length,
          message: 'Missing semicolon',
          severity: 'warning'
        });
      }
    });
  }

  /**
   * Validate C# syntax
   */
  private validateCSharpSyntax(lines: string[], errors: SyntaxError[]): void {
    // Similar to Java validation with C#-specific rules
    this.validateJavaSyntax(lines, errors);

    lines.forEach((line, index) => {
      const lineNum = index + 1;
      const trimmed = line.trim();

      // Check for C#-specific patterns
      if (trimmed.includes('var ') && !trimmed.includes('=')) {
        errors.push({
          line: lineNum,
          column: line.indexOf('var'),
          message: 'var declaration must be initialized',
          severity: 'error'
        });
      }
    });
  }

  /**
   * Validate code quality
   */
  private validateCodeQuality(code: string, language: SupportedLanguage): { warnings: Warning[]; suggestions: Suggestion[] } {
    const warnings: Warning[] = [];
    const suggestions: Suggestion[] = [];
    const lines = code.split('\n');

    lines.forEach((line, index) => {
      const lineNum = index + 1;
      const trimmed = line.trim();

      // Check line length
      if (line.length > 120) {
        warnings.push({
          line: lineNum,
          message: 'Line too long (>120 characters)',
          type: 'style'
        });
      }

      // Check for TODO comments
      if (trimmed.toLowerCase().includes('todo')) {
        suggestions.push({
          line: lineNum,
          message: 'TODO comment found',
          improvement: 'Consider implementing or removing TODO items'
        });
      }

      // Check for console.log/print statements
      if (trimmed.includes('console.log') || trimmed.includes('print(')) {
        suggestions.push({
          line: lineNum,
          message: 'Debug statement found',
          improvement: 'Consider removing debug statements in production code'
        });
      }
    });

    return { warnings, suggestions };
  }

  /**
   * Generate code metadata
   */
  private async generateCodeMetadata(code: string, request: CodeGenerationRequest): Promise<CodeMetadata> {
    const lines = code.split('\n').filter(line => line.trim().length > 0);

    return {
      linesOfCode: lines.length,
      complexity: this.calculateComplexity(code),
      dependencies: this.extractDependencies(code, request.language),
      suggestedImports: this.suggestImports(code, request.language),
      performance: {
        timeComplexity: 'O(n)', // Simplified
        spaceComplexity: 'O(1)', // Simplified
        optimizationTips: ['Consider using more efficient algorithms', 'Cache results when possible']
      },
      security: {
        vulnerabilities: [],
        recommendations: ['Validate all inputs', 'Use parameterized queries'],
        securityScore: 85
      }
    };
  }

  /**
   * Calculate code complexity (simplified)
   */
  private calculateComplexity(code: string): number {
    const complexityKeywords = ['if', 'else', 'for', 'while', 'switch', 'case', 'try', 'catch'];
    let complexity = 1; // Base complexity

    for (const keyword of complexityKeywords) {
      const matches = code.match(new RegExp(`\\b${keyword}\\b`, 'g'));
      if (matches) {
        complexity += matches.length;
      }
    }

    return complexity;
  }

  /**
   * Extract dependencies from code
   */
  private extractDependencies(code: string, language: SupportedLanguage): string[] {
    const dependencies: string[] = [];

    const importPatterns = {
      typescript: /import\s+.*?\s+from\s+['"]([^'"]+)['"]/g,
      javascript: /import\s+.*?\s+from\s+['"]([^'"]+)['"]/g,
      python: /(?:from\s+(\w+)|import\s+(\w+))/g,
      java: /import\s+([\w.]+)/g,
      csharp: /using\s+([\w.]+)/g
    };

    const pattern = importPatterns[language];
    if (pattern) {
      let match;
      while ((match = pattern.exec(code)) !== null) {
        dependencies.push(match[1] || match[2]);
      }
    }

    return [...new Set(dependencies)]; // Remove duplicates
  }

  /**
   * Suggest imports based on code content
   */
  private suggestImports(code: string, language: SupportedLanguage): string[] {
    const suggestions: string[] = [];

    // Common patterns that suggest specific imports
    const importSuggestions = {
      typescript: {
        'React': /React\.|JSX\.Element|useState|useEffect/,
        'lodash': /_.(\w+)/,
        'axios': /axios\./
      },
      python: {
        'datetime': /datetime\.|date\.|time\./,
        'json': /json\./,
        'requests': /requests\./
      },
      java: {
        'java.util.List': /List<|ArrayList/,
        'java.util.Map': /Map<|HashMap/,
        'java.time.LocalDateTime': /LocalDateTime/
      }
    };

    const patterns = importSuggestions[language] || {};

    for (const [importName, pattern] of Object.entries(patterns)) {
      if (pattern.test(code)) {
        suggestions.push(importName);
      }
    }

    return suggestions;
  }

  /**
   * Get template by name and language
   */
  private getTemplate(templateName: string, language: SupportedLanguage): string | null {
    // Mock implementation - in real implementation, this would load from template files
    const templates: Record<string, Record<SupportedLanguage, string>> = {
      'function': {
        typescript: `export function {{name}}({{parameters}}): {{returnType}} {\n  // TODO: Implement function\n  {{body}}\n}`,
        javascript: `export function {{name}}({{parameters}}) {\n  // TODO: Implement function\n  {{body}}\n}`,
        python: `def {{name}}({{parameters}}):\n    """{{description}}"""\n    # TODO: Implement function\n    {{body}}`,
        java: `public {{returnType}} {{name}}({{parameters}}) {\n    // TODO: Implement method\n    {{body}}\n}`,
        csharp: `public {{returnType}} {{name}}({{parameters}})\n{\n    // TODO: Implement method\n    {{body}}\n}`
      }
    };

    return templates[templateName]?.[language] || null;
  }

  /**
   * Process template with parameters
   */
  private processTemplate(template: string, parameters: Record<string, any>): string {
    let result = template;

    for (const [key, value] of Object.entries(parameters)) {
      const placeholder = `{{${key}}}`;
      result = result.replace(new RegExp(placeholder, 'g'), String(value));
    }

    return result;
  }

  /**
   * Validate generation request
   */
  private validateRequest(request: CodeGenerationRequest): void {
    if (!request.id) {
      throw new Error('Request ID is required');
    }

    if (!request.description || request.description.trim().length === 0) {
      throw new Error('Description is required');
    }

    if (!request.language) {
      throw new Error('Language is required');
    }

    const supportedLanguages: SupportedLanguage[] = ['typescript', 'javascript', 'python', 'java', 'csharp'];
    if (!supportedLanguages.includes(request.language)) {
      throw new Error(`Unsupported language: ${request.language}`);
    }
  }

  /**
   * Initialize language generators
   */
  private initializeLanguageGenerators(): void {
    // Placeholder for language-specific generators
    const languages: SupportedLanguage[] = ['typescript', 'javascript', 'python', 'java', 'csharp'];

    languages.forEach(language => {
      this.languageGenerators.set(language, {
        language,
        initialized: true,
        templates: new Map(),
        validators: new Map()
      });
    });

    console.log(`Initialized generators for ${languages.length} languages`);
  }

  /**
   * Get generation statistics
   */
  getGenerationStats(): any {
    return {
      supportedLanguages: Array.from(this.languageGenerators.keys()),
      totalRequests: this.requestHistory.size,
      languageGenerators: this.languageGenerators.size,
      templateEngine: !!this.templateEngine,
      validationEngine: !!this.validationEngine
    };
  }

  /**
   * Get supported languages
   */
  getSupportedLanguages(): SupportedLanguage[] {
    return Array.from(this.languageGenerators.keys());
  }

  /**
   * Get supported code types
   */
  getSupportedCodeTypes(): CodeType[] {
    return ['function', 'class', 'interface', 'component', 'module', 'test', 'api', 'utility', 'snippet'];
  }
}

export default CodeGenerator;