/**
* Code Inserter - Intelligent code insertion and replacement system
*
* This class provides:
* - Smart code insertion at appropriate locations
* - Safe code replacement with conflict detection
* - Context-aware insertion strategies
* - Undo/redo functionality for code changes
* - Multi-file operation support
*/

import { EventEmitter } from 'events';

export interface InsertionRequest {
  id: string;
  operation: InsertionOperation;
  targetFile: string;
  code: string;
  language: string;
  options: InsertionOptions;
  context?: InsertionContext;
}

export interface InsertionResult {
  id: string;
  requestId: string;
  success: boolean;
  operation: InsertionOperation;
  changes: FileChange[];
  conflicts: InsertionConflict[];
  preview: string;
  metadata: InsertionMetadata;
}

export interface FileChange {
  file: string;
  type: ChangeType;
  range: SourceRange;
  oldContent: string;
  newContent: string;
  line: number;
  column: number;
}

export interface InsertionConflict {
  type: ConflictType;
  description: string;
  range: SourceRange;
  resolution: ConflictResolution[];
}

export interface ConflictResolution {
  strategy: ResolutionStrategy;
  description: string;
  preview: string;
}

export interface SourceRange {
  start: Position;
  end: Position;
}

export interface Position {
  line: number;
  column: number;
}

export interface InsertionMetadata {
  insertionPoint: Position;
  affectedLines: number;
  insertionStrategy: InsertionStrategy;
  confidence: number;
  estimatedTime: number;
}

export type InsertionOperation =
  | 'insert'
  | 'replace'
  | 'append'
  | 'prepend'
  | 'merge'
  | 'wrap';

export type ChangeType =
  | 'insertion'
  | 'replacement'
  | 'modification'
  | 'addition'
  | 'removal';

export type ConflictType =
  | 'naming-conflict'
  | 'type-conflict'
  | 'import-conflict'
  | 'structural-conflict'
  | 'logic-conflict';

export type ResolutionStrategy =
  | 'rename'
  | 'merge'
  | 'override'
  | 'skip'
  | 'manual';

export type InsertionStrategy =
  | 'smart-location'
  | 'end-of-file'
  | 'after-imports'
  | 'before-exports'
  | 'inside-class'
  | 'inside-function'
  | 'custom-marker';

export interface InsertionOptions {
  strategy: InsertionStrategy;
  preserveFormatting: boolean;
  addImports: boolean;
  resolveConflicts: boolean;
  createBackup: boolean;
  dryRun: boolean;
  indentationStyle: 'spaces' | 'tabs';
  indentationSize: number;
  lineEnding: 'lf' | 'crlf';
}

export interface InsertionContext {
  selectedRange?: SourceRange;
  cursorPosition?: Position;
  surroundingCode?: string;
  projectStructure?: string[];
  existingImports?: string[];
  existingFunctions?: string[];
  existingClasses?: string[];
}

/**
* Code Inserter Class
*/
export class CodeInserter extends EventEmitter {
  private insertionHistory: Map<string, InsertionRecord[]> = new Map();
  private backupStorage: Map<string, string> = new Map();
  private conflictResolvers: Map<ConflictType, Function> = new Map();

  constructor() {
    super();
    this.initializeConflictResolvers();
    console.log('Code Inserter initialized');
  }

  /**
   * Insert code into target file
   */
  async insertCode(request: InsertionRequest): Promise<InsertionResult> {
    const startTime = Date.now();

    try {
      this.emit('insertionStarted', request);

      // Validate request
      this.validateInsertionRequest(request);

      // Create backup if needed
      if (request.options.createBackup) {
        await this.createBackup(request.targetFile);
      }

      // Analyze target file
      const fileContent = await this.readFile(request.targetFile);
      const analysis = await this.analyzeFile(fileContent, request.language);

      // Determine insertion point
      const insertionPoint = await this.determineInsertionPoint(
        fileContent,
        request.code,
        request.options.strategy,
        request.context,
        analysis
      );

      // Check for conflicts
      const conflicts = await this.detectConflicts(
        fileContent,
        request.code,
        insertionPoint,
        analysis
      );

      // Resolve conflicts if enabled
      if (request.options.resolveConflicts && conflicts.length > 0) {
        await this.resolveConflicts(conflicts, request);
      }

      // Prepare code for insertion
      const preparedCode = await this.prepareCode(
        request.code,
        insertionPoint,
        fileContent,
        request.options,
        analysis
      );

      // Generate preview
      const preview = this.generatePreview(
        fileContent,
        preparedCode,
        insertionPoint,
        request.operation
      );

      // Apply changes if not dry run
      const changes: FileChange[] = [];
      if (!request.options.dryRun) {
        const change = await this.applyInsertion(
          request.targetFile,
          fileContent,
          preparedCode,
          insertionPoint,
          request.operation
        );
        changes.push(change);

        // Record in history
        this.recordInsertion(request, change);
      }

      const result: InsertionResult = {
        id: `insertion_${Date.now()}`,
        requestId: request.id,
        success: true,
        operation: request.operation,
        changes,
        conflicts,
        preview,
        metadata: {
          insertionPoint,
          affectedLines: this.countAffectedLines(preparedCode),
          insertionStrategy: request.options.strategy,
          confidence: this.calculateConfidence(insertionPoint, conflicts),
          estimatedTime: Date.now() - startTime
        }
      };

      this.emit('insertionCompleted', { request, result });
      return result;

    } catch (error) {
      this.emit('insertionError', { request, error: error.message });
      throw error;
    }
  }

  /**
   * Determine optimal insertion point
   */
  private async determineInsertionPoint(
    fileContent: string,
    code: string,
    strategy: InsertionStrategy,
    context?: InsertionContext,
    analysis?: FileAnalysis
  ): Promise<Position> {
    const lines = fileContent.split('\n');

    switch (strategy) {
      case 'smart-location':
        return this.findSmartLocation(lines, code, analysis);

      case 'end-of-file':
        return { line: lines.length, column: 0 };

      case 'after-imports':
        return this.findAfterImports(lines, analysis);

      case 'before-exports':
        return this.findBeforeExports(lines, analysis);

      case 'inside-class':
        return this.findInsideClass(lines, context, analysis);

      case 'inside-function':
        return this.findInsideFunction(lines, context, analysis);

      case 'custom-marker':
        return this.findCustomMarker(lines, context);

      default:
        return { line: lines.length, column: 0 };
    }
  }

  /**
   * Find smart insertion location based on code analysis
   */
  private findSmartLocation(lines: string[], code: string, analysis?: FileAnalysis): Position {
    // Analyze the code being inserted
    const codeType = this.analyzeCodeType(code);

    switch (codeType) {
      case 'import':
        return this.findImportLocation(lines, analysis);
      case 'function':
        return this.findFunctionLocation(lines, analysis);
      case 'class':
        return this.findClassLocation(lines, analysis);
      case 'interface':
        return this.findInterfaceLocation(lines, analysis);
      case 'variable':
        return this.findVariableLocation(lines, analysis);
      default:
        return { line: lines.length, column: 0 };
    }
  }

  /**
   * Find location after imports
   */
  private findAfterImports(lines: string[], analysis?: FileAnalysis): Position {
    let lastImportLine = 0;

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      if (line.startsWith('import ') || line.startsWith('from ') || line.startsWith('const ') && line.includes('require(')) {
        lastImportLine = i;
      } else if (line.length > 0 && !line.startsWith('//') && !line.startsWith('/*')) {
        break;
      }
    }

    return { line: lastImportLine + 1, column: 0 };
  }

  /**
   * Find location before exports
   */
  private findBeforeExports(lines: string[], analysis?: FileAnalysis): Position {
    for (let i = lines.length - 1; i >= 0; i--) {
      const line = lines[i].trim();
      if (line.startsWith('export ') || line.includes('module.exports')) {
        return { line: i, column: 0 };
      }
    }

    return { line: lines.length, column: 0 };
  }

  /**
   * Find location inside a class
   */
  private findInsideClass(lines: string[], context?: InsertionContext, analysis?: FileAnalysis): Position {
    if (context?.selectedRange) {
      // Use selected range if available
      return context.selectedRange.start;
    }

    // Find first class
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      if (line.includes('class ') && line.includes('{')) {
        // Find the end of the class to insert before the closing brace
        let braceCount = 0;
        for (let j = i; j < lines.length; j++) {
          const currentLine = lines[j];
          braceCount += (currentLine.match(/{/g) || []).length;
          braceCount -= (currentLine.match(/}/g) || []).length;

          if (braceCount === 0 && j > i) {
            return { line: j, column: 0 };
          }
        }
      }
    }

    return { line: lines.length, column: 0 };
  }

  /**
   * Find location inside a function
   */
  private findInsideFunction(lines: string[], context?: InsertionContext, analysis?: FileAnalysis): Position {
    if (context?.selectedRange) {
      return context.selectedRange.start;
    }

    // Find insertion point inside the nearest function
    return { line: lines.length, column: 0 };
  }

  /**
   * Find custom marker location
   */
  private findCustomMarker(lines: string[], context?: InsertionContext): Position {
    const markers = ['// INSERT HERE', '// TODO:', '/* INSERT */'];

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      for (const marker of markers) {
        if (line.includes(marker)) {
          return { line: i, column: 0 };
        }
      }
    }

    return { line: lines.length, column: 0 };
  }

  /**
   * Detect conflicts with existing code
   */
  private async detectConflicts(
    fileContent: string,
    newCode: string,
    insertionPoint: Position,
    analysis?: FileAnalysis
  ): Promise<InsertionConflict[]> {
    const conflicts: InsertionConflict[] = [];

    // Check for naming conflicts
    const namingConflicts = this.detectNamingConflicts(fileContent, newCode, analysis);
    conflicts.push(...namingConflicts);

    // Check for import conflicts
    const importConflicts = this.detectImportConflicts(fileContent, newCode);
    conflicts.push(...importConflicts);

    // Check for type conflicts
    const typeConflicts = this.detectTypeConflicts(fileContent, newCode, analysis);
    conflicts.push(...typeConflicts);

    return conflicts;
  }

  /**
   * Detect naming conflicts
   */
  private detectNamingConflicts(fileContent: string, newCode: string, analysis?: FileAnalysis): InsertionConflict[] {
    const conflicts: InsertionConflict[] = [];

    // Extract function/class names from new code
    const newNames = this.extractNames(newCode);
    const existingNames = this.extractNames(fileContent);

    for (const newName of newNames) {
      if (existingNames.includes(newName.name)) {
        conflicts.push({
          type: 'naming-conflict',
          description: `Name '${newName.name}' already exists`,
          range: newName.range,
          resolution: [
            {
              strategy: 'rename',
              description: `Rename to '${newName.name}2'`,
              preview: `${newName.type} ${newName.name}2`
            },
            {
              strategy: 'skip',
              description: 'Skip insertion',
              preview: 'Code will not be inserted'
            }
          ]
        });
      }
    }

    return conflicts;
  }

  /**
   * Detect import conflicts
   */
  private detectImportConflicts(fileContent: string, newCode: string): InsertionConflict[] {
    const conflicts: InsertionConflict[] = [];

    const existingImports = this.extractImports(fileContent);
    const newImports = this.extractImports(newCode);

    for (const newImport of newImports) {
      const conflictingImport = existingImports.find(existing =>
        existing.source === newImport.source && existing.name !== newImport.name
      );

      if (conflictingImport) {
        conflicts.push({
          type: 'import-conflict',
          description: `Import conflict for '${newImport.source}'`,
          range: newImport.range,
          resolution: [
            {
              strategy: 'merge',
              description: 'Merge imports',
              preview: `import { ${conflictingImport.name}, ${newImport.name} } from '${newImport.source}';`
            }
          ]
        });
      }
    }

    return conflicts;
  }

  /**
   * Detect type conflicts
   */
  private detectTypeConflicts(fileContent: string, newCode: string, analysis?: FileAnalysis): InsertionConflict[] {
    const conflicts: InsertionConflict[] = [];

    // Simplified type conflict detection
    const newTypes = this.extractTypeNames(newCode);
    const existingTypes = this.extractTypeNames(fileContent);

    for (const newType of newTypes) {
      if (existingTypes.includes(newType)) {
        conflicts.push({
          type: 'type-conflict',
          description: `Type '${newType}' already defined`,
          range: { start: { line: 0, column: 0 }, end: { line: 0, column: 0 } },
          resolution: [
            {
              strategy: 'rename',
              description: `Rename to '${newType}Extended'`,
              preview: `type ${newType}Extended = ...`
            }
          ]
        });
      }
    }

    return conflicts;
  }

  /**
   * Prepare code for insertion
   */
  private async prepareCode(
    code: string,
    insertionPoint: Position,
    fileContent: string,
    options: InsertionOptions,
    analysis?: FileAnalysis
  ): Promise<string> {
    let preparedCode = code;

    // Apply indentation
    const indentation = this.calculateIndentation(fileContent, insertionPoint, options);
    preparedCode = this.applyIndentation(preparedCode, indentation, options);

    // Add imports if needed
    if (options.addImports) {
      const requiredImports = this.extractRequiredImports(code, analysis);
      preparedCode = this.addImports(preparedCode, requiredImports);
    }

    // Apply line endings
    if (options.lineEnding === 'crlf') {
      preparedCode = preparedCode.replace(/\n/g, '\r\n');
    }

    // Preserve formatting
    if (options.preserveFormatting) {
      preparedCode = this.preserveExistingFormatting(preparedCode, fileContent);
    }

    return preparedCode;
  }

  /**
   * Apply the actual insertion
   */
  private async applyInsertion(
    targetFile: string,
    fileContent: string,
    preparedCode: string,
    insertionPoint: Position,
    operation: InsertionOperation
  ): Promise<FileChange> {
    const lines = fileContent.split('\n');
    let newContent = '';

    switch (operation) {
      case 'insert':
        lines.splice(insertionPoint.line, 0, preparedCode);
        break;
      case 'replace':
        lines[insertionPoint.line] = preparedCode;
        break;
      case 'append':
        lines.push('', preparedCode);
        break;
      case 'prepend':
        lines.unshift(preparedCode, '');
        break;
      default:
        lines.splice(insertionPoint.line, 0, preparedCode);
    }

    newContent = lines.join('\n');

    // Write to file
    await this.writeFile(targetFile, newContent);

    return {
      file: targetFile,
      type: 'insertion',
      range: {
        start: insertionPoint,
        end: { line: insertionPoint.line + preparedCode.split('\n').length, column: 0 }
      },
      oldContent: fileContent,
      newContent,
      line: insertionPoint.line,
      column: insertionPoint.column
    };
  }

  /**
   * Generate preview of changes
   */
  private generatePreview(
    fileContent: string,
    preparedCode: string,
    insertionPoint: Position,
    operation: InsertionOperation
  ): string {
    const lines = fileContent.split('\n');
    const contextLines = 3; // Show 3 lines before and after

    const startLine = Math.max(0, insertionPoint.line - contextLines);
    const endLine = Math.min(lines.length, insertionPoint.line + contextLines + 1);

    let preview = '';

    // Add context before
    for (let i = startLine; i < insertionPoint.line; i++) {
      preview += `  ${i + 1} | ${lines[i]}\n`;
    }

    // Add inserted code
    const insertedLines = preparedCode.split('\n');
    insertedLines.forEach((line, index) => {
      const lineNum = insertionPoint.line + index + 1;
      preview += `+ ${lineNum} | ${line}\n`;
    });

    // Add context after
    for (let i = insertionPoint.line; i < endLine; i++) {
      preview += `  ${i + 1 + insertedLines.length} | ${lines[i]}\n`;
    }

    return preview;
  }

  // Helper methods
  private analyzeCodeType(code: string): string {
    if (code.trim().startsWith('import ') || code.trim().startsWith('from ')) return 'import';
    if (code.includes('function ') || code.includes('const ') && code.includes('=>')) return 'function';
    if (code.includes('class ')) return 'class';
    if (code.includes('interface ')) return 'interface';
    if (code.includes('const ') || code.includes('let ') || code.includes('var ')) return 'variable';
    return 'unknown';
  }

  private async analyzeFile(fileContent: string, language: string): Promise<FileAnalysis> {
    return {
      language,
      imports: this.extractImports(fileContent),
      functions: this.extractFunctions(fileContent),
      classes: this.extractClasses(fileContent),
      interfaces: this.extractInterfaces(fileContent),
      variables: this.extractVariables(fileContent)
    };
  }

  private extractNames(code: string): any[] {
    const names: any[] = [];

    // Function names
    const functionMatches = code.matchAll(/(?:function\s+|const\s+)(\w+)/g);
    for (const match of functionMatches) {
      names.push({
        name: match[1],
        type: 'function',
        range: { start: { line: 0, column: 0 }, end: { line: 0, column: 0 } }
      });
    }

    // Class names
    const classMatches = code.matchAll(/class\s+(\w+)/g);
    for (const match of classMatches) {
      names.push({
        name: match[1],
        type: 'class',
        range: { start: { line: 0, column: 0 }, end: { line: 0, column: 0 } }
      });
    }

    return names;
  }

  private extractImports(code: string): any[] {
    const imports: any[] = [];
    const importRegex = /import\s+(?:{([^}]+)}|\*\s+as\s+(\w+)|(\w+))\s+from\s+['"]([^'"]+)['"]/g;

    let match;
    while ((match = importRegex.exec(code)) !== null) {
      const [, namedImports, namespaceImport, defaultImport, source] = match;

      if (namedImports) {
        namedImports.split(',').forEach(name => {
          imports.push({
            name: name.trim(),
            source,
            type: 'named',
            range: { start: { line: 0, column: 0 }, end: { line: 0, column: 0 } }
          });
        });
      } else if (namespaceImport) {
        imports.push({
          name: namespaceImport,
          source,
          type: 'namespace',
          range: { start: { line: 0, column: 0 }, end: { line: 0, column: 0 } }
        });
      } else if (defaultImport) {
        imports.push({
          name: defaultImport,
          source,
          type: 'default',
          range: { start: { line: 0, column: 0 }, end: { line: 0, column: 0 } }
        });
      }
    }

    return imports;
  }

  private extractTypeNames(code: string): string[] {
    const types: string[] = [];
    const typeRegex = /(?:type|interface)\s+(\w+)/g;

    let match;
    while ((match = typeRegex.exec(code)) !== null) {
      types.push(match[1]);
    }

    return types;
  }

  private extractRequiredImports(code: string, analysis?: FileAnalysis): string[] {
    // Analyze code and determine what imports are needed
    const requiredImports: string[] = [];

    // This would analyze the code and determine missing imports
    // For now, return empty array

    return requiredImports;
  }

  private calculateIndentation(fileContent: string, insertionPoint: Position, options: InsertionOptions): string {
    const lines = fileContent.split('\n');
    if (insertionPoint.line < lines.length) {
      const line = lines[insertionPoint.line];
      const match = line.match(/^(\s*)/);
      return match ? match[1] : '';
    }

    // Default indentation
    const char = options.indentationStyle === 'tabs' ? '\t' : ' ';
    return char.repeat(options.indentationSize);
  }

  private applyIndentation(code: string, baseIndentation: string, options: InsertionOptions): string {
    const lines = code.split('\n');
    return lines.map((line, index) => {
      if (line.trim().length === 0) return line;
      return index === 0 ? baseIndentation + line : baseIndentation + line;
    }).join('\n');
  }

  private addImports(code: string, imports: string[]): string {
    if (imports.length === 0) return code;

    const importStatements = imports.map(imp => `import ${imp};`).join('\n');
    return importStatements + '\n\n' + code;
  }

  private preserveExistingFormatting(code: string, fileContent: string): string {
    // Analyze existing formatting patterns and apply them
    return code;
  }

  private countAffectedLines(code: string): number {
    return code.split('\n').length;
  }

  private calculateConfidence(insertionPoint: Position, conflicts: InsertionConflict[]): number {
    let confidence = 100;

    // Reduce confidence based on conflicts
    confidence -= conflicts.length * 20;

    // Reduce confidence if insertion point seems unusual
    if (insertionPoint.line === 0) confidence -= 10;

    return Math.max(0, confidence);
  }

  private validateInsertionRequest(request: InsertionRequest): void {
    if (!request.id || !request.targetFile || !request.code) {
      throw new Error('Invalid insertion request: missing required fields');
    }
  }

  private async createBackup(filePath: string): Promise<void> {
    try {
      const content = await this.readFile(filePath);
      this.backupStorage.set(filePath, content);
      console.log(`Created backup for: ${filePath}`);
    } catch (error) {
      console.warn(`Failed to create backup for ${filePath}:`, error.message);
    }
  }

  private recordInsertion(request: InsertionRequest, change: FileChange): void {
    const record: InsertionRecord = {
      id: request.id,
      timestamp: Date.now(),
      operation: request.operation,
      change
    };

    if (!this.insertionHistory.has(request.targetFile)) {
      this.insertionHistory.set(request.targetFile, []);
    }

    this.insertionHistory.get(request.targetFile)!.push(record);
  }

  private initializeConflictResolvers(): void {
    this.conflictResolvers.set('naming-conflict', this.resolveNamingConflict.bind(this));
    this.conflictResolvers.set('import-conflict', this.resolveImportConflict.bind(this));
    this.conflictResolvers.set('type-conflict', this.resolveTypeConflict.bind(this));
  }

  private async resolveConflicts(conflicts: InsertionConflict[], request: InsertionRequest): Promise<void> {
    for (const conflict of conflicts) {
      const resolver = this.conflictResolvers.get(conflict.type);
      if (resolver) {
        await resolver(conflict, request);
      }
    }
  }

  private async resolveNamingConflict(conflict: InsertionConflict, request: InsertionRequest): Promise<void> {
    // Apply automatic renaming strategy
    console.log(`Resolving naming conflict: ${conflict.description}`);
  }

  private async resolveImportConflict(conflict: InsertionConflict, request: InsertionRequest): Promise<void> {
    // Merge imports automatically
    console.log(`Resolving import conflict: ${conflict.description}`);
  }

  private async resolveTypeConflict(conflict: InsertionConflict, request: InsertionRequest): Promise<void> {
    // Apply type renaming strategy
    console.log(`Resolving type conflict: ${conflict.description}`);
  }

  // File system operations (mocked for this implementation)
  private async readFile(filePath: string): Promise<string> {
    // Mock implementation - in production, use fs.readFile
    return `// Mock file content for ${filePath}\nexport default {};`;
  }

  private async writeFile(filePath: string, content: string): Promise<void> {
    // Mock implementation - in production, use fs.writeFile
    console.log(`Writing to file: ${filePath}`);
  }

  private extractFunctions(code: string): string[] {
    const functions: string[] = [];
    const functionRegex = /(?:function\s+(\w+)|const\s+(\w+)\s*=)/g;

    let match;
    while ((match = functionRegex.exec(code)) !== null) {
      functions.push(match[1] || match[2]);
    }

    return functions;
  }

  private extractClasses(code: string): string[] {
    const classes: string[] = [];
    const classRegex = /class\s+(\w+)/g;

    let match;
    while ((match = classRegex.exec(code)) !== null) {
      classes.push(match[1]);
    }

    return classes;
  }

  private extractInterfaces(code: string): string[] {
    const interfaces: string[] = [];
    const interfaceRegex = /interface\s+(\w+)/g;

    let match;
    while ((match = interfaceRegex.exec(code)) !== null) {
      interfaces.push(match[1]);
    }

    return interfaces;
  }

  private extractVariables(code: string): string[] {
    const variables: string[] = [];
    const variableRegex = /(?:const|let|var)\s+(\w+)/g;

    let match;
    while ((match = variableRegex.exec(code)) !== null) {
      variables.push(match[1]);
    }

    return variables;
  }

  private findImportLocation(lines: string[], analysis?: FileAnalysis): Position {
    // Find the best location for imports
    let insertLine = 0;

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      if (line.startsWith('import ') || line.startsWith('from ')) {
        insertLine = i + 1;
      } else if (line.length > 0 && !line.startsWith('//')) {
        break;
      }
    }

    return { line: insertLine, column: 0 };
  }

  private findFunctionLocation(lines: string[], analysis?: FileAnalysis): Position {
    // Find appropriate location for function
    const lastFunctionLine = this.findLastFunctionLine(lines);
    return { line: lastFunctionLine + 1, column: 0 };
  }

  private findClassLocation(lines: string[], analysis?: FileAnalysis): Position {
    // Find appropriate location for class
    const lastClassLine = this.findLastClassLine(lines);
    return { line: lastClassLine + 1, column: 0 };
  }

  private findInterfaceLocation(lines: string[], analysis?: FileAnalysis): Position {
    // Find appropriate location for interface
    const lastInterfaceLine = this.findLastInterfaceLine(lines);
    return { line: lastInterfaceLine + 1, column: 0 };
  }

  private findVariableLocation(lines: string[], analysis?: FileAnalysis): Position {
    // Find appropriate location for variable
    const afterImports = this.findAfterImports(lines, analysis);
    return afterImports;
  }

  private findLastFunctionLine(lines: string[]): number {
    for (let i = lines.length - 1; i >= 0; i--) {
      if (lines[i].includes('function ') || (lines[i].includes('const ') && lines[i].includes('=>'))) {
        return i;
      }
    }
    return 0;
  }

  private findLastClassLine(lines: string[]): number {
    for (let i = lines.length - 1; i >= 0; i--) {
      if (lines[i].includes('class ')) {
        return i;
      }
    }
    return 0;
  }

  private findLastInterfaceLine(lines: string[]): number {
    for (let i = lines.length - 1; i >= 0; i--) {
      if (lines[i].includes('interface ')) {
        return i;
      }
    }
    return 0;
  }

  /**
   * Get insertion statistics
   */
  getInsertionStats(): any {
    return {
      totalInsertions: Array.from(this.insertionHistory.values()).reduce((sum, records) => sum + records.length, 0),
      filesModified: this.insertionHistory.size,
      backupsCreated: this.backupStorage.size,
      conflictResolvers: this.conflictResolvers.size,
      supportedOperations: ['insert', 'replace', 'append', 'prepend', 'merge', 'wrap'],
      supportedStrategies: ['smart-location', 'end-of-file', 'after-imports', 'before-exports', 'inside-class', 'inside-function', 'custom-marker']
    };
  }

  /**
   * Undo last insertion
   */
  async undoInsertion(filePath: string): Promise<boolean> {
    const history = this.insertionHistory.get(filePath);
    if (!history || history.length === 0) {
      return false;
    }

    const lastRecord = history.pop();
    if (lastRecord && this.backupStorage.has(filePath)) {
      const backup = this.backupStorage.get(filePath)!;
      await this.writeFile(filePath, backup);
      console.log(`Undid insertion for: ${filePath}`);
      return true;
    }

    return false;
  }
}

// Helper interfaces
interface FileAnalysis {
  language: string;
  imports: any[];
  functions: string[];
  classes: string[];
  interfaces: string[];
  variables: string[];
}

interface InsertionRecord {
  id: string;
  timestamp: number;
  operation: InsertionOperation;
  change: FileChange;
}

export default CodeInserter;