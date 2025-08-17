/**
* Template Engine - Code template processing and scaffolding system
*
* This class provides:
* - Template-based code generation
* - Dynamic placeholder replacement
* - Multi-language template support
* - Conditional template rendering
* - Template composition and inheritance
*/

import { EventEmitter } from 'events';

export interface CodeTemplate {
  id: string;
  name: string;
  description: string;
  language: string;
  category: TemplateCategory;
  framework?: string;
  content: string;
  placeholders: TemplatePlaceholder[];
  metadata: TemplateMetadata;
  dependencies?: string[];
  files?: TemplateFile[];
}

export interface TemplateFile {
  path: string;
  content: string;
  isDirectory?: boolean;
}

export interface TemplatePlaceholder {
  name: string;
  type: PlaceholderType;
  description: string;
  required: boolean;
  defaultValue?: any;
  validation?: PlaceholderValidation;
  options?: string[];
}

export interface PlaceholderValidation {
  pattern?: RegExp;
  minLength?: number;
  maxLength?: number;
  custom?: (value: any) => boolean;
}

export type PlaceholderType =
  | 'string'
  | 'number'
  | 'boolean'
  | 'array'
  | 'object'
  | 'enum'
  | 'code'
  | 'identifier'
  | 'type';

export type TemplateCategory =
  | 'function'
  | 'class'
  | 'interface'
  | 'component'
  | 'service'
  | 'module'
  | 'test'
  | 'configuration'
  | 'boilerplate'
  | 'pattern'
  | 'utility';

export interface TemplateMetadata {
  version: string;
  author: string;
  tags: string[];
  complexity: 'simple' | 'medium' | 'complex';
  estimatedLines: number;
  lastModified: number;
  usage: number;
}

export interface TemplateRenderContext {
  values: Record<string, any>;
  options: TemplateRenderOptions;
  helpers: Record<string, Function>;
}

export interface TemplateRenderOptions {
  strict?: boolean;
  preserveWhitespace?: boolean;
  indentSize?: number;
  indentType?: 'spaces' | 'tabs';
  lineEnding?: 'lf' | 'crlf';
  trimOutput?: boolean;
}

export interface TemplateRenderResult {
  content: string;
  files?: TemplateFile[];
  metadata: {
    placeholdersUsed: string[];
    renderTime: number;
    outputSize: number;
  };
}

/**
* Template Engine Class
*/
export class TemplateEngine extends EventEmitter {
  private templates: Map<string, CodeTemplate> = new Map();
  private helpers: Map<string, Function> = new Map();
  private partials: Map<string, string> = new Map();

  constructor() {
    super();
    this.initializeHelpers();
    this.loadBuiltInTemplates();
    console.log('Template Engine initialized');
  }

  /**
   * Register a new template
   */
  registerTemplate(template: CodeTemplate): void {
    this.validateTemplate(template);
    this.templates.set(template.id, template);
    this.emit('templateRegistered', template);
    console.log(`Registered template: ${template.name} (${template.language})`);
  }

  /**
   * Render a template with given context
   */
  async renderTemplate(
    templateId: string,
    context: TemplateRenderContext
  ): Promise<TemplateRenderResult> {
    const startTime = Date.now();

    try {
      const template = this.templates.get(templateId);
      if (!template) {
        throw new Error(`Template not found: ${templateId}`);
      }

      // Validate context values
      this.validateContext(template, context);

      // Render main content
      const renderedContent = await this.processTemplate(template.content, context);

      // Render additional files if any
      const renderedFiles: TemplateFile[] = [];
      if (template.files) {
        for (const file of template.files) {
          const processedFile: TemplateFile = {
            path: await this.processTemplate(file.path, context),
            content: await this.processTemplate(file.content, context),
            isDirectory: file.isDirectory
          };
          renderedFiles.push(processedFile);
        }
      }

      // Apply formatting options
      const formattedContent = this.applyFormatting(renderedContent, context.options);

      const result: TemplateRenderResult = {
        content: formattedContent,
        files: renderedFiles.length > 0 ? renderedFiles : undefined,
        metadata: {
          placeholdersUsed: this.extractUsedPlaceholders(template.content, context.values),
          renderTime: Date.now() - startTime,
          outputSize: formattedContent.length
        }
      };

      // Update usage statistics
      template.metadata.usage++;

      this.emit('templateRendered', { template, context, result });
      return result;

    } catch (error) {
      this.emit('renderError', { templateId, context, error: error.message });
      throw error;
    }
  }

  /**
   * Process template content with context
   */
  private async processTemplate(content: string, context: TemplateRenderContext): Promise<string> {
    let processed = content;

    // Process placeholders ({{placeholder}})
    processed = this.processPlaceholders(processed, context);

    // Process conditionals ({{#if condition}})
    processed = this.processConditionals(processed, context);

    // Process loops ({{#each array}})
    processed = this.processLoops(processed, context);

    // Process helpers ({{helper arg1 arg2}})
    processed = this.processHelpers(processed, context);

    // Process partials ({{>partial}})
    processed = this.processPartials(processed, context);

    return processed;
  }

  /**
   * Process simple placeholders
   */
  private processPlaceholders(content: string, context: TemplateRenderContext): string {
    return content.replace(/\{\{([^#/>][^}]*)\}\}/g, (match, placeholder) => {
      const trimmed = placeholder.trim();

      // Handle nested properties (e.g., {{object.property}})
      const value = this.getNestedValue(context.values, trimmed);

      if (value === undefined || value === null) {
        if (context.options.strict) {
          throw new Error(`Undefined placeholder: ${trimmed}`);
        }
        return match; // Keep original if not found
      }

      return String(value);
    });
  }

  /**
   * Process conditional blocks
   */
  private processConditionals(content: string, context: TemplateRenderContext): string {
    const conditionalRegex = /\{\{#if\s+([^}]+)\}\}([\s\S]*?)\{\{\/if\}\}/g;

    return content.replace(conditionalRegex, (match, condition, block) => {
      const conditionValue = this.evaluateCondition(condition.trim(), context);
      return conditionValue ? block : '';
    });
  }

  /**
   * Process loop blocks
   */
  private processLoops(content: string, context: TemplateRenderContext): string {
    const loopRegex = /\{\{#each\s+([^}]+)\}\}([\s\S]*?)\{\{\/each\}\}/g;

    return content.replace(loopRegex, (match, arrayName, block) => {
      const array = this.getNestedValue(context.values, arrayName.trim());

      if (!Array.isArray(array)) {
        return context.options.strict ? (() => {
          throw new Error(`Invalid array for loop: ${arrayName}`);
        })() : '';
      }

      return array.map((item, index) => {
        const itemContext = {
          ...context,
          values: {
            ...context.values,
            this: item,
            '@index': index,
            '@first': index === 0,
            '@last': index === array.length - 1
          }
        };

        return this.processPlaceholders(block, itemContext);
      }).join('');
    });
  }

  /**
   * Process helper functions
   */
  private processHelpers(content: string, context: TemplateRenderContext): string {
    const helperRegex = /\{\{([a-zA-Z_][a-zA-Z0-9_]*)\s*([^}]*)\}\}/g;

    return content.replace(helperRegex, (match, helperName, args) => {
      const helper = this.helpers.get(helperName) || context.helpers[helperName];

      if (helper) {
        const parsedArgs = this.parseHelperArgs(args, context);
        try {
          const result = helper(...parsedArgs);
          return result !== undefined ? String(result) : '';
        } catch (error) {
          if (context.options.strict) {
            throw new Error(`Helper error (${helperName}): ${error.message}`);
          }
          return match;
        }
      }

      return match;
    });
  }

  /**
   * Process partials
   */
  private processPartials(content: string, context: TemplateRenderContext): string {
    const partialRegex = /\{\{>\s*([^}]+)\}\}/g;

    return content.replace(partialRegex, (match, partialName) => {
      const partial = this.partials.get(partialName.trim());

      if (partial) {
        return this.processTemplate(partial, context);
      }

      return context.options.strict ? (() => {
        throw new Error(`Partial not found: ${partialName}`);
      })() : match;
    });
  }

  /**
   * Get nested value from object
   */
  private getNestedValue(obj: any, path: string): any {
    return path.split('.').reduce((current, key) => {
      return current && current[key] !== undefined ? current[key] : undefined;
    }, obj);
  }

  /**
   * Evaluate condition
   */
  private evaluateCondition(condition: string, context: TemplateRenderContext): boolean {
    // Simple condition evaluation - in production, use a safe evaluator
    const value = this.getNestedValue(context.values, condition);

    if (typeof value === 'boolean') return value;
    if (typeof value === 'number') return value !== 0;
    if (typeof value === 'string') return value.length > 0;
    if (Array.isArray(value)) return value.length > 0;
    if (typeof value === 'object') return value !== null;

    return false;
  }

  /**
   * Parse helper arguments
   */
  private parseHelperArgs(argsString: string, context: TemplateRenderContext): any[] {
    if (!argsString.trim()) return [];

    // Simple argument parsing - split by spaces, resolve values
    const args = argsString.trim().split(/\s+/);

    return args.map(arg => {
      // String literal
      if (arg.startsWith('"') && arg.endsWith('"')) {
        return arg.slice(1, -1);
      }

      // Number literal
      if (/^\d+(\.\d+)?$/.test(arg)) {
        return parseFloat(arg);
      }

      // Boolean literal
      if (arg === 'true') return true;
      if (arg === 'false') return false;

      // Variable reference
      return this.getNestedValue(context.values, arg);
    });
  }

  /**
   * Apply formatting options
   */
  private applyFormatting(content: string, options: TemplateRenderOptions): string {
    let formatted = content;

    // Handle line endings
    if (options.lineEnding === 'crlf') {
      formatted = formatted.replace(/\n/g, '\r\n');
    }

    // Handle indentation
    if (options.indentSize && options.indentType) {
      const indent = options.indentType === 'tabs' ? '\t' : ' '.repeat(options.indentSize);
      formatted = formatted.replace(/^(\s*)/gm, (match, spaces) => {
        const level = Math.floor(spaces.length / (options.indentSize || 2));
        return indent.repeat(level);
      });
    }

    // Trim output
    if (options.trimOutput) {
      formatted = formatted.trim();
    }

    // Preserve whitespace or normalize
    if (!options.preserveWhitespace) {
      formatted = formatted.replace(/\n\s*\n\s*\n/g, '\n\n'); // Remove excessive blank lines
    }

    return formatted;
  }

  /**
   * Extract used placeholders
   */
  private extractUsedPlaceholders(content: string, values: Record<string, any>): string[] {
    const placeholders: string[] = [];
    const regex = /\{\{([^#/>][^}]*)\}\}/g;
    let match;

    while ((match = regex.exec(content)) !== null) {
      const placeholder = match[1].trim();
      if (values.hasOwnProperty(placeholder)) {
        placeholders.push(placeholder);
      }
    }

    return [...new Set(placeholders)];
  }

  /**
   * Validate template
   */
  private validateTemplate(template: CodeTemplate): void {
    if (!template.id || !template.name || !template.content) {
      throw new Error('Template must have id, name, and content');
    }

    if (this.templates.has(template.id)) {
      throw new Error(`Template with id '${template.id}' already exists`);
    }

    // Validate placeholders in content
    const contentPlaceholders = this.extractPlaceholdersFromContent(template.content);
    const definedPlaceholders = template.placeholders.map(p => p.name);

    const undefinedPlaceholders = contentPlaceholders.filter(p => !definedPlaceholders.includes(p));
    if (undefinedPlaceholders.length > 0) {
      console.warn(`Template '${template.id}' has undefined placeholders: ${undefinedPlaceholders.join(', ')}`);
    }
  }

  /**
   * Validate context values
   */
  private validateContext(template: CodeTemplate, context: TemplateRenderContext): void {
    const requiredPlaceholders = template.placeholders.filter(p => p.required);

    for (const placeholder of requiredPlaceholders) {
      const value = context.values[placeholder.name];

      if (value === undefined || value === null) {
        throw new Error(`Required placeholder missing: ${placeholder.name}`);
      }

      // Type validation
      if (!this.validatePlaceholderType(value, placeholder)) {
        throw new Error(`Invalid type for placeholder '${placeholder.name}': expected ${placeholder.type}`);
      }

      // Custom validation
      if (placeholder.validation) {
        if (!this.validatePlaceholderValue(value, placeholder.validation)) {
          throw new Error(`Validation failed for placeholder '${placeholder.name}'`);
        }
      }
    }
  }

  /**
   * Validate placeholder type
   */
  private validatePlaceholderType(value: any, placeholder: TemplatePlaceholder): boolean {
    switch (placeholder.type) {
      case 'string': return typeof value === 'string';
      case 'number': return typeof value === 'number';
      case 'boolean': return typeof value === 'boolean';
      case 'array': return Array.isArray(value);
      case 'object': return typeof value === 'object' && value !== null;
      case 'enum': return placeholder.options ? placeholder.options.includes(value) : true;
      case 'identifier': return typeof value === 'string' && /^[a-zA-Z_][a-zA-Z0-9_]*$/.test(value);
      case 'type': return typeof value === 'string';
      case 'code': return typeof value === 'string';
      default: return true;
    }
  }

  /**
   * Validate placeholder value
   */
  private validatePlaceholderValue(value: any, validation: PlaceholderValidation): boolean {
    if (validation.pattern && typeof value === 'string') {
      if (!validation.pattern.test(value)) return false;
    }

    if (validation.minLength && typeof value === 'string') {
      if (value.length < validation.minLength) return false;
    }

    if (validation.maxLength && typeof value === 'string') {
      if (value.length > validation.maxLength) return false;
    }

    if (validation.custom) {
      return validation.custom(value);
    }

    return true;
  }

  /**
   * Extract placeholders from template content
   */
  private extractPlaceholdersFromContent(content: string): string[] {
    const placeholders: string[] = [];
    const regex = /\{\{([^#/>][^}]*)\}\}/g;
    let match;

    while ((match = regex.exec(content)) !== null) {
      placeholders.push(match[1].trim());
    }

    return [...new Set(placeholders)];
  }

  /**
   * Initialize built-in helper functions
   */
  private initializeHelpers(): void {
    // String helpers
    this.helpers.set('capitalize', (str: string) => str.charAt(0).toUpperCase() + str.slice(1));
    this.helpers.set('lowercase', (str: string) => str.toLowerCase());
    this.helpers.set('uppercase', (str: string) => str.toUpperCase());
    this.helpers.set('camelCase', (str: string) => str.replace(/[-_\s]+(.)?/g, (_, c) => c ? c.toUpperCase() : ''));
    this.helpers.set('kebabCase', (str: string) => str.replace(/[A-Z]/g, letter => `-${letter.toLowerCase()}`));
    this.helpers.set('snakeCase', (str: string) => str.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`));

    // Array helpers
    this.helpers.set('join', (arr: any[], separator = ', ') => arr.join(separator));
    this.helpers.set('length', (arr: any[]) => arr.length);
    this.helpers.set('first', (arr: any[]) => arr[0]);
    this.helpers.set('last', (arr: any[]) => arr[arr.length - 1]);

    // Conditional helpers
    this.helpers.set('eq', (a: any, b: any) => a === b);
    this.helpers.set('ne', (a: any, b: any) => a !== b);
    this.helpers.set('gt', (a: number, b: number) => a > b);
    this.helpers.set('lt', (a: number, b: number) => a < b);

    // Code formatting helpers
    this.helpers.set('indent', (text: string, level = 1, size = 2) => {
      const indent = ' '.repeat(level * size);
      return text.split('\n').map(line => line ? indent + line : line).join('\n');
    });

    this.helpers.set('comment', (text: string, style = '//') => {
      return text.split('\n').map(line => line ? `${style} ${line}` : line).join('\n');
    });

    console.log(`Initialized ${this.helpers.size} template helpers`);
  }

  /**
   * Load built-in templates
   */
  private loadBuiltInTemplates(): void {
    const builtInTemplates: CodeTemplate[] = [
      {
        id: 'typescript-function',
        name: 'TypeScript Function',
        description: 'Basic TypeScript function template',
        language: 'typescript',
        category: 'function',
        content: `{{#if isExported}}export {{/if}}{{#if isAsync}}async {{/if}}function {{name}}({{#each parameters}}{{name}}: {{type}}{{#unless @last}}, {{/unless}}{{/each}}){{#if returnType}}: {{returnType}}{{/if}} {
  {{#if body}}{{body}}{{else}}// TODO: Implement {{name}}
  throw new Error('Not implemented');{{/if}}
}`,
        placeholders: [
          { name: 'name', type: 'identifier', description: 'Function name', required: true },
          { name: 'parameters', type: 'array', description: 'Function parameters', required: false, defaultValue: [] },
          { name: 'returnType', type: 'type', description: 'Return type', required: false, defaultValue: 'void' },
          { name: 'body', type: 'code', description: 'Function body', required: false },
          { name: 'isExported', type: 'boolean', description: 'Export function', required: false, defaultValue: true },
          { name: 'isAsync', type: 'boolean', description: 'Async function', required: false, defaultValue: false }
        ],
        metadata: {
          version: '1.0.0',
          author: 'Octopus AI IDE',
          tags: ['function', 'typescript'],
          complexity: 'simple',
          estimatedLines: 5,
          lastModified: Date.now(),
          usage: 0
        }
      },
      {
        id: 'react-component',
        name: 'React Component',
        description: 'React functional component with TypeScript',
        language: 'typescript',
        category: 'component',
        framework: 'react',
        content: `import React{{#if hasState}}, { useState }{{/if}}{{#if hasEffect}}, { useEffect }{{/if}} from 'react';

{{#if hasProps}}interface {{name}}Props {
{{#each props}}  {{name}}{{#if optional}}?{{/if}}: {{type}};
{{/each}}}

{{/if}}const {{name}}: React.FC{{#if hasProps}}<{{name}}Props>{{/if}} = ({{#if hasProps}}props{{/if}}) => {
{{#each state}}  const [{{name}}, set{{capitalize name}}] = useState<{{type}}>({{defaultValue}});
{{/each}}
{{#if hasEffect}}
  useEffect(() => {
    // TODO: Implement effect
  }, []);
{{/if}}

  return (
    <div className="{{kebabCase name}}">
      <h1>{{name}}</h1>
      {{content}}
    </div>
  );
};

export default {{name}};`,
        placeholders: [
          { name: 'name', type: 'identifier', description: 'Component name', required: true },
          { name: 'props', type: 'array', description: 'Component props', required: false, defaultValue: [] },
          { name: 'state', type: 'array', description: 'Component state', required: false, defaultValue: [] },
          { name: 'content', type: 'code', description: 'Component content', required: false, defaultValue: '{/* TODO: Add component content */}' },
          { name: 'hasProps', type: 'boolean', description: 'Has props', required: false, defaultValue: false },
          { name: 'hasState', type: 'boolean', description: 'Uses state', required: false, defaultValue: false },
          { name: 'hasEffect', type: 'boolean', description: 'Uses effects', required: false, defaultValue: false }
        ],
        metadata: {
          version: '1.0.0',
          author: 'Octopus AI IDE',
          tags: ['react', 'component', 'typescript'],
          complexity: 'medium',
          estimatedLines: 15,
          lastModified: Date.now(),
          usage: 0
        }
      }
    ];

    builtInTemplates.forEach(template => {
      this.templates.set(template.id, template);
    });

    console.log(`Loaded ${builtInTemplates.length} built-in templates`);
  }

  /**
   * Get all templates
   */
  getTemplates(): CodeTemplate[] {
    return Array.from(this.templates.values());
  }

  /**
   * Get templates by language
   */
  getTemplatesByLanguage(language: string): CodeTemplate[] {
    return Array.from(this.templates.values()).filter(t => t.language === language);
  }

  /**
   * Get templates by category
   */
  getTemplatesByCategory(category: TemplateCategory): CodeTemplate[] {
    return Array.from(this.templates.values()).filter(t => t.category === category);
  }

  /**
   * Search templates
   */
  searchTemplates(query: string): CodeTemplate[] {
    const queryLower = query.toLowerCase();
    return Array.from(this.templates.values()).filter(template =>
      template.name.toLowerCase().includes(queryLower) ||
      template.description.toLowerCase().includes(queryLower) ||
      template.metadata.tags.some(tag => tag.toLowerCase().includes(queryLower))
    );
  }

  /**
   * Register helper function
   */
  registerHelper(name: string, helper: Function): void {
    this.helpers.set(name, helper);
    console.log(`Registered helper: ${name}`);
  }

  /**
   * Register partial template
   */
  registerPartial(name: string, content: string): void {
    this.partials.set(name, content);
    console.log(`Registered partial: ${name}`);
  }

  /**
   * Get template engine statistics
   */
  getStats(): any {
    const templates = Array.from(this.templates.values());

    return {
      totalTemplates: templates.length,
      languageBreakdown: this.getLanguageBreakdown(templates),
      categoryBreakdown: this.getCategoryBreakdown(templates),
      totalHelpers: this.helpers.size,
      totalPartials: this.partials.size,
      averageComplexity: this.getAverageComplexity(templates),
      mostUsedTemplates: this.getMostUsedTemplates(templates, 5)
    };
  }

  private getLanguageBreakdown(templates: CodeTemplate[]): Record<string, number> {
    const breakdown: Record<string, number> = {};
    templates.forEach(t => {
      breakdown[t.language] = (breakdown[t.language] || 0) + 1;
    });
    return breakdown;
  }

  private getCategoryBreakdown(templates: CodeTemplate[]): Record<string, number> {
    const breakdown: Record<string, number> = {};
    templates.forEach(t => {
      breakdown[t.category] = (breakdown[t.category] || 0) + 1;
    });
    return breakdown;
  }

  private getAverageComplexity(templates: CodeTemplate[]): string {
    const complexityScores = { simple: 1, medium: 2, complex: 3 };
    const totalScore = templates.reduce((sum, t) => sum + complexityScores[t.metadata.complexity], 0);
    const average = totalScore / templates.length;

    if (average <= 1.5) return 'simple';
    if (average <= 2.5) return 'medium';
    return 'complex';
  }

  private getMostUsedTemplates(templates: CodeTemplate[], limit: number): CodeTemplate[] {
    return templates
      .sort((a, b) => b.metadata.usage - a.metadata.usage)
      .slice(0, limit);
  }
}

export default TemplateEngine;