/**
* File Analyzer - Comprehensive file structure analysis and understanding
*
* This class provides:
* - Deep file structure analysis and mapping
* - File type detection and classification
* - Code relationship mapping
* - Project organization understanding
* - Change detection and monitoring
*/

import { EventEmitter } from 'events';

export interface FileStructureAnalysis {
  id: string;
  projectPath: string;
  analyzedAt: number;
  structure: ProjectStructure;
  metrics: ProjectMetrics;
  insights: ProjectInsights;
  recommendations: StructureRecommendation[];
}

export interface ProjectStructure {
  rootPath: string;
  totalFiles: number;
  totalDirectories: number;
  maxDepth: number;
  directories: DirectoryNode[];
  files: FileNode[];
  languageDistribution: LanguageDistribution;
  organizationPattern: OrganizationPattern;
}

export interface DirectoryNode {
  path: string;
  name: string;
  depth: number;
  fileCount: number;
  subdirectories: string[];
  files: FileReference[];
  purpose: DirectoryPurpose;
  importance: ImportanceLevel;
}

export interface FileNode {
  path: string;
  name: string;
  extension: string;
  language: string;
  size: number;
  lines: number;
  lastModified: number;
  type: FileType;
  role: FileRole;
  complexity: ComplexityMetrics;
  dependencies: FileDependency[];
  exports: FileExport[];
  imports: FileImport[];
}

export interface FileReference {
  path: string;
  name: string;
  type: FileType;
  importance: ImportanceLevel;
}

export interface FileDependency {
  path: string;
  type: DependencyType;
  isExternal: boolean;
  isOptional: boolean;
}

export interface FileExport {
  name: string;
  type: ExportType;
  isDefault: boolean;
  line: number;
}

export interface FileImport {
  source: string;
  imports: string[];
  type: ImportType;
  line: number;
}

export interface ComplexityMetrics {
  cyclomaticComplexity: number;
  cognitiveComplexity: number;
  maintainabilityIndex: number;
  technicalDebt: number;
}

export interface LanguageDistribution {
  primary: string;
  secondary: string[];
  breakdown: Record<string, LanguageStats>;
}

export interface LanguageStats {
  fileCount: number;
  lineCount: number;
  percentage: number;
  complexity: number;
}

export interface OrganizationPattern {
  type: PatternType;
  confidence: number;
  characteristics: string[];
  adherence: number;
}

export interface ProjectMetrics {
  codeQuality: QualityMetrics;
  maintainability: MaintainabilityMetrics;
  testCoverage: TestCoverageMetrics;
  documentation: DocumentationMetrics;
}

export interface QualityMetrics {
  overallScore: number;
  codeSmells: number;
  duplications: number;
  violations: number;
  hotspots: string[];
}

export interface MaintainabilityMetrics {
  index: number;
  technicalDebt: number;
  complexity: number;
  coupling: number;
  cohesion: number;
}

export interface TestCoverageMetrics {
  percentage: number;
  testFiles: number;
  sourceFiles: number;
  uncoveredFiles: string[];
}

export interface DocumentationMetrics {
  coverage: number;
  readmeScore: number;
  commentRatio: number;
  missingDocs: string[];
}

export interface ProjectInsights {
  strengths: ProjectStrength[];
  weaknesses: ProjectWeakness[];
  opportunities: ProjectOpportunity[];
  risks: ProjectRisk[];
}

export interface ProjectStrength {
  category: InsightCategory;
  description: string;
  impact: ImpactLevel;
  evidence: string[];
}

export interface ProjectWeakness {
  category: InsightCategory;
  description: string;
  severity: SeverityLevel;
  affectedFiles: string[];
  suggestions: string[];
}

export interface ProjectOpportunity {
  category: InsightCategory;
  description: string;
  potential: PotentialLevel;
  implementation: string[];
}

export interface ProjectRisk {
  category: InsightCategory;
  description: string;
  probability: ProbabilityLevel;
  impact: ImpactLevel;
  mitigation: string[];
}

export interface StructureRecommendation {
  type: RecommendationType;
  priority: PriorityLevel;
  description: string;
  rationale: string;
  implementation: ImplementationStep[];
  estimatedEffort: EffortLevel;
}

export interface ImplementationStep {
  step: number;
  action: string;
  description: string;
  files: string[];
}

export type FileType =
  | 'source'
  | 'test'
  | 'config'
  | 'documentation'
  | 'asset'
  | 'build'
  | 'data'
  | 'template'
  | 'script'
  | 'unknown';

export type FileRole =
  | 'entry-point'
  | 'core-module'
  | 'utility'
  | 'component'
  | 'service'
  | 'model'
  | 'controller'
  | 'view'
  | 'middleware'
  | 'configuration'
  | 'test'
  | 'documentation'
  | 'build-script'
  | 'data-file'
  | 'asset'
  | 'unknown';

export type DirectoryPurpose =
  | 'source-code'
  | 'tests'
  | 'documentation'
  | 'configuration'
  | 'assets'
  | 'build-output'
  | 'dependencies'
  | 'tools'
  | 'data'
  | 'templates'
  | 'scripts'
  | 'unknown';

export type DependencyType =
  | 'import'
  | 'require'
  | 'include'
  | 'reference'
  | 'inheritance'
  | 'composition'
  | 'aggregation';

export type ExportType =
  | 'function'
  | 'class'
  | 'interface'
  | 'type'
  | 'constant'
  | 'variable'
  | 'module'
  | 'namespace';

export type ImportType =
  | 'named'
  | 'default'
  | 'namespace'
  | 'side-effect'
  | 'dynamic';

export type PatternType =
  | 'mvc'
  | 'mvp'
  | 'mvvm'
  | 'component-based'
  | 'layered'
  | 'microservices'
  | 'monolithic'
  | 'domain-driven'
  | 'feature-based'
  | 'flat'
  | 'unknown';

export type ImportanceLevel = 'critical' | 'high' | 'medium' | 'low';
export type ImpactLevel = 'critical' | 'high' | 'medium' | 'low';
export type SeverityLevel = 'critical' | 'high' | 'medium' | 'low';
export type PotentialLevel = 'high' | 'medium' | 'low';
export type ProbabilityLevel = 'high' | 'medium' | 'low';
export type PriorityLevel = 'urgent' | 'high' | 'medium' | 'low';
export type EffortLevel = 'small' | 'medium' | 'large' | 'extra-large';

export type InsightCategory =
  | 'architecture'
  | 'code-quality'
  | 'performance'
  | 'security'
  | 'maintainability'
  | 'testing'
  | 'documentation'
  | 'dependencies'
  | 'organization';

export type RecommendationType =
  | 'restructure'
  | 'refactor'
  | 'split'
  | 'merge'
  | 'move'
  | 'rename'
  | 'add'
  | 'remove'
  | 'standardize';

/**
* File Analyzer Class
*/
export class FileAnalyzer extends EventEmitter {
  private analysisCache: Map<string, FileStructureAnalysis> = new Map();
  private watchedPaths: Set<string> = new Set();
  private analysisQueue: Map<string, Promise<FileStructureAnalysis>> = new Map();

  constructor() {
    super();
    console.log('File Analyzer initialized');
  }

  /**
   * Analyze project file structure comprehensively
   */
  async analyzeProject(projectPath: string, options: AnalysisOptions = {}): Promise<FileStructureAnalysis> {
    const startTime = Date.now();

    try {
      this.emit('analysisStarted', { projectPath, options });

      // Check cache if not forced refresh
      if (!options.forceRefresh && this.analysisCache.has(projectPath)) {
        const cached = this.analysisCache.get(projectPath)!;
        if (Date.now() - cached.analyzedAt < (options.cacheTimeout || 300000)) { // 5 min default
          this.emit('analysisCacheHit', cached);
          return cached;
        }
      }

      // Check if analysis is already in progress
      if (this.analysisQueue.has(projectPath)) {
        return await this.analysisQueue.get(projectPath)!;
      }

      // Start new analysis
      const analysisPromise = this.performAnalysis(projectPath, options);
      this.analysisQueue.set(projectPath, analysisPromise);

      const analysis = await analysisPromise;

      // Cache result
      this.analysisCache.set(projectPath, analysis);
      this.analysisQueue.delete(projectPath);

      // Setup watching if requested
      if (options.watchForChanges) {
        this.setupWatching(projectPath);
      }

      this.emit('analysisCompleted', {
        analysis,
        duration: Date.now() - startTime,
        options
      });

      return analysis;

    } catch (error) {
      this.analysisQueue.delete(projectPath);
      this.emit('analysisError', { projectPath, error: error.message, options });
      throw error;
    }
  }

  /**
   * Perform the actual file structure analysis
   */
  private async performAnalysis(projectPath: string, options: AnalysisOptions): Promise<FileStructureAnalysis> {
    console.log(`Analyzing project structure: ${projectPath}`);

    // Scan file system
    const fileSystem = await this.scanFileSystem(projectPath, options);

    // Analyze each file in detail
    const detailedFiles = await this.analyzeFiles(fileSystem.files, options);

    // Build directory structure
    const directoryStructure = await this.buildDirectoryStructure(fileSystem.directories, detailedFiles);

    // Detect organization patterns
    const organizationPattern = await this.detectOrganizationPattern(directoryStructure, detailedFiles);

    // Calculate language distribution
    const languageDistribution = this.calculateLanguageDistribution(detailedFiles);

    // Generate project metrics
    const metrics = await this.calculateProjectMetrics(detailedFiles, directoryStructure);

    // Generate insights
    const insights = await this.generateProjectInsights(directoryStructure, detailedFiles, metrics);

    // Generate recommendations
    const recommendations = await this.generateRecommendations(insights, directoryStructure, metrics);

    const analysis: FileStructureAnalysis = {
      id: `analysis_${Date.now()}`,
      projectPath,
      analyzedAt: Date.now(),
      structure: {
        rootPath: projectPath,
        totalFiles: detailedFiles.length,
        totalDirectories: directoryStructure.length,
        maxDepth: Math.max(...directoryStructure.map(d => d.depth)),
        directories: directoryStructure,
        files: detailedFiles,
        languageDistribution,
        organizationPattern
      },
      metrics,
      insights,
      recommendations
    };

    return analysis;
  }

  /**
   * Scan file system to get basic structure
   */
  private async scanFileSystem(projectPath: string, options: AnalysisOptions): Promise<{ files: string[]; directories: string[] }> {
    // Mock implementation - in production, use fs.readdir recursively
    const mockFiles = [
      'package.json',
      'src/index.ts',
      'src/components/App.tsx',
      'src/components/Header.tsx',
      'src/utils/helpers.ts',
      'src/services/api.ts',
      'src/types/index.ts',
      'tests/app.test.ts',
      'tests/utils/helpers.test.ts',
      'README.md',
      'tsconfig.json',
      '.gitignore',
      'webpack.config.js'
    ];

    const mockDirectories = [
      'src',
      'src/components',
      'src/utils',
      'src/services',
      'src/types',
      'tests',
      'tests/utils',
      'node_modules',
      'dist'
    ];

    // Simulate file system scan delay
    await new Promise(resolve => setTimeout(resolve, 100));

    return {
      files: mockFiles.map(f => `${projectPath}/${f}`),
      directories: mockDirectories.map(d => `${projectPath}/${d}`)
    };
  }

  /**
   * Analyze each file in detail
   */
  private async analyzeFiles(filePaths: string[], options: AnalysisOptions): Promise<FileNode[]> {
    const files: FileNode[] = [];

    for (const filePath of filePaths) {
      try {
        const fileAnalysis = await this.analyzeIndividualFile(filePath, options);
        files.push(fileAnalysis);
      } catch (error) {
        console.warn(`Failed to analyze file ${filePath}:`, error.message);
      }
    }

    return files;
  }

  /**
   * Analyze individual file
   */
  private async analyzeIndividualFile(filePath: string, options: AnalysisOptions): Promise<FileNode> {
    const fileName = filePath.split('/').pop() || '';
    const extension = fileName.split('.').pop() || '';

    // Mock file content analysis
    const mockContent = await this.readFileContent(filePath);

    return {
      path: filePath,
      name: fileName,
      extension,
      language: this.detectLanguage(extension),
      size: mockContent.length,
      lines: mockContent.split('\n').length,
      lastModified: Date.now() - Math.random() * 86400000, // Random within last day
      type: this.detectFileType(fileName, extension),
      role: this.detectFileRole(filePath, fileName),
      complexity: await this.calculateFileComplexity(mockContent, extension),
      dependencies: await this.extractFileDependencies(mockContent, extension),
      exports: await this.extractFileExports(mockContent, extension),
      imports: await this.extractFileImports(mockContent, extension)
    };
  }

  /**
   * Build directory structure with metadata
   */
  private async buildDirectoryStructure(directoryPaths: string[], files: FileNode[]): Promise<DirectoryNode[]> {
    const directories: DirectoryNode[] = [];

    for (const dirPath of directoryPaths) {
      const dirName = dirPath.split('/').pop() || '';
      const depth = dirPath.split('/').length - 1;

      // Find files in this directory
      const dirFiles = files.filter(f => f.path.startsWith(dirPath + '/') && !f.path.substring(dirPath.length + 1).includes('/'));

      // Find subdirectories
      const subdirs = directoryPaths.filter(d =>
        d.startsWith(dirPath + '/') &&
        d !== dirPath &&
        d.split('/').length === dirPath.split('/').length + 1
      );

      directories.push({
        path: dirPath,
        name: dirName,
        depth,
        fileCount: dirFiles.length,
        subdirectories: subdirs.map(d => d.split('/').pop() || ''),
        files: dirFiles.map(f => ({
          path: f.path,
          name: f.name,
          type: f.type,
          importance: this.calculateFileImportance(f)
        })),
        purpose: this.detectDirectoryPurpose(dirName, dirFiles),
        importance: this.calculateDirectoryImportance(dirName, dirFiles.length, depth)
      });
    }

    return directories;
  }

  /**
   * Detect organization pattern
   */
  private async detectOrganizationPattern(directories: DirectoryNode[], files: FileNode[]): Promise<OrganizationPattern> {
    const patterns = this.analyzePatterns(directories, files);

    // Find the most likely pattern
    const bestPattern = patterns.reduce((best, current) =>
      current.confidence > best.confidence ? current : best
    );

    return bestPattern;
  }

  /**
   * Analyze possible organization patterns
   */
  private analyzePatterns(directories: DirectoryNode[], files: FileNode[]): OrganizationPattern[] {
    const patterns: OrganizationPattern[] = [];

    // Component-based pattern
    const hasComponents = directories.some(d => d.name.toLowerCase().includes('component'));
    const componentConfidence = hasComponents ? 0.8 : 0.2;
    patterns.push({
      type: 'component-based',
      confidence: componentConfidence,
      characteristics: hasComponents ? ['component directory', 'UI-focused structure'] : [],
      adherence: componentConfidence
    });

    // MVC pattern
    const hasControllers = directories.some(d => d.name.toLowerCase().includes('controller'));
    const hasViews = directories.some(d => d.name.toLowerCase().includes('view'));
    const hasModels = directories.some(d => d.name.toLowerCase().includes('model'));
    const mvcScore = (hasControllers ? 0.33 : 0) + (hasViews ? 0.33 : 0) + (hasModels ? 0.33 : 0);
    patterns.push({
      type: 'mvc',
      confidence: mvcScore,
      characteristics: [
        ...(hasControllers ? ['controller directory'] : []),
        ...(hasViews ? ['view directory'] : []),
        ...(hasModels ? ['model directory'] : [])
      ],
      adherence: mvcScore
    });

    // Feature-based pattern
    const featureDirs = directories.filter(d =>
      d.files.some(f => f.type === 'source') &&
      d.files.some(f => f.type === 'test')
    );
    const featureConfidence = featureDirs.length > 0 ? 0.7 : 0.3;
    patterns.push({
      type: 'feature-based',
      confidence: featureConfidence,
      characteristics: featureDirs.length > 0 ? ['co-located features', 'feature directories'] : [],
      adherence: featureConfidence
    });

    return patterns;
  }

  /**
   * Calculate language distribution
   */
  private calculateLanguageDistribution(files: FileNode[]): LanguageDistribution {
    const languageStats: Record<string, LanguageStats> = {};
    let totalLines = 0;

    // Count by language
    files.forEach(file => {
      if (!languageStats[file.language]) {
        languageStats[file.language] = {
          fileCount: 0,
          lineCount: 0,
          percentage: 0,
          complexity: 0
        };
      }

      languageStats[file.language].fileCount++;
      languageStats[file.language].lineCount += file.lines;
      languageStats[file.language].complexity += file.complexity.cyclomaticComplexity;
      totalLines += file.lines;
    });

    // Calculate percentages
    Object.values(languageStats).forEach(stats => {
      stats.percentage = (stats.lineCount / totalLines) * 100;
    });

    // Sort by usage
    const sortedLanguages = Object.entries(languageStats)
      .sort(([, a], [, b]) => b.percentage - a.percentage);

    return {
      primary: sortedLanguages[0]?.[0] || 'unknown',
      secondary: sortedLanguages.slice(1, 4).map(([lang]) => lang),
      breakdown: languageStats
    };
  }

  /**
   * Calculate comprehensive project metrics
   */
  private async calculateProjectMetrics(files: FileNode[], directories: DirectoryNode[]): Promise<ProjectMetrics> {
    // Code quality metrics
    const totalComplexity = files.reduce((sum, f) => sum + f.complexity.cyclomaticComplexity, 0);
    const avgComplexity = totalComplexity / files.length;
    const qualityScore = Math.max(0, 100 - (avgComplexity - 5) * 10);

    // Test coverage metrics
    const testFiles = files.filter(f => f.type === 'test');
    const sourceFiles = files.filter(f => f.type === 'source');
    const coveragePercentage = sourceFiles.length > 0 ? (testFiles.length / sourceFiles.length) * 100 : 0;

    // Documentation metrics
    const docFiles = files.filter(f => f.type === 'documentation');
    const hasReadme = files.some(f => f.name.toLowerCase().includes('readme'));
    const docCoverage = (docFiles.length / files.length) * 100;

    return {
      codeQuality: {
        overallScore: qualityScore,
        codeSmells: Math.floor(files.length * 0.1),
        duplications: Math.floor(files.length * 0.05),
        violations: Math.floor(avgComplexity * 2),
        hotspots: files
          .filter(f => f.complexity.cyclomaticComplexity > 10)
          .map(f => f.path)
          .slice(0, 5)
      },
      maintainability: {
        index: Math.max(0, 100 - avgComplexity * 5),
        technicalDebt: Math.floor(totalComplexity * 0.5),
        complexity: avgComplexity,
        coupling: this.calculateCoupling(files),
        cohesion: this.calculateCohesion(directories)
      },
      testCoverage: {
        percentage: coveragePercentage,
        testFiles: testFiles.length,
        sourceFiles: sourceFiles.length,
        uncoveredFiles: sourceFiles
          .filter(sf => !testFiles.some(tf => tf.name.includes(sf.name.split('.')[0])))
          .map(f => f.path)
      },
      documentation: {
        coverage: docCoverage,
        readmeScore: hasReadme ? 85 : 0,
        commentRatio: this.calculateCommentRatio(files),
        missingDocs: sourceFiles
          .filter(f => f.complexity.cyclomaticComplexity > 5)
          .map(f => f.path)
          .slice(0, 10)
      }
    };
  }

  /**
   * Generate project insights
   */
  private async generateProjectInsights(
    directories: DirectoryNode[],
    files: FileNode[],
    metrics: ProjectMetrics
  ): Promise<ProjectInsights> {
    const strengths: ProjectStrength[] = [];
    const weaknesses: ProjectWeakness[] = [];
    const opportunities: ProjectOpportunity[] = [];
    const risks: ProjectRisk[] = [];

    // Analyze strengths
    if (metrics.testCoverage.percentage > 70) {
      strengths.push({
        category: 'testing',
        description: 'Strong test coverage',
        impact: 'high',
        evidence: [`${metrics.testCoverage.percentage.toFixed(1)}% test coverage`]
      });
    }

    if (metrics.codeQuality.overallScore > 80) {
      strengths.push({
        category: 'code-quality',
        description: 'High code quality',
        impact: 'high',
        evidence: [`Quality score: ${metrics.codeQuality.overallScore.toFixed(1)}`]
      });
    }

    // Analyze weaknesses
    if (metrics.maintainability.complexity > 10) {
      weaknesses.push({
        category: 'maintainability',
        description: 'High code complexity',
        severity: 'high',
        affectedFiles: metrics.codeQuality.hotspots,
        suggestions: ['Refactor complex functions', 'Extract smaller methods', 'Reduce cyclomatic complexity']
      });
    }

    if (metrics.documentation.coverage < 20) {
      weaknesses.push({
        category: 'documentation',
        description: 'Low documentation coverage',
        severity: 'medium',
        affectedFiles: metrics.documentation.missingDocs,
        suggestions: ['Add JSDoc comments', 'Create README files', 'Document API endpoints']
      });
    }

    // Analyze opportunities
    if (files.some(f => f.language === 'javascript') && !files.some(f => f.language === 'typescript')) {
      opportunities.push({
        category: 'code-quality',
        description: 'Migration to TypeScript',
        potential: 'high',
        implementation: ['Add TypeScript configuration', 'Gradually convert files', 'Add type definitions']
      });
    }

    // Analyze risks
    if (metrics.maintainability.technicalDebt > 100) {
      risks.push({
        category: 'maintainability',
        description: 'High technical debt',
        probability: 'high',
        impact: 'high',
        mitigation: ['Schedule refactoring sprints', 'Implement code review process', 'Add linting rules']
      });
    }

    return { strengths, weaknesses, opportunities, risks };
  }

  /**
   * Generate structure recommendations
   */
  private async generateRecommendations(
    insights: ProjectInsights,
    directories: DirectoryNode[],
    metrics: ProjectMetrics
  ): Promise<StructureRecommendation[]> {
    const recommendations: StructureRecommendation[] = [];

    // Recommend test organization
    if (metrics.testCoverage.percentage < 50) {
      recommendations.push({
        type: 'add',
        priority: 'high',
        description: 'Improve test organization and coverage',
        rationale: 'Low test coverage increases maintenance risk',
        implementation: [
          { step: 1, action: 'create', description: 'Create test directory structure', files: ['tests/'] },
          { step: 2, action: 'add', description: 'Add test files for main modules', files: ['tests/unit/', 'tests/integration/'] },
          { step: 3, action: 'configure', description: 'Setup test runner configuration', files: ['jest.config.js', 'package.json'] }
        ],
        estimatedEffort: 'medium'
      });
    }

    // Recommend documentation improvements
    if (metrics.documentation.coverage < 30) {
      recommendations.push({
        type: 'add',
        priority: 'medium',
        description: 'Enhance project documentation',
        rationale: 'Better documentation improves maintainability and onboarding',
        implementation: [
          { step: 1, action: 'create', description: 'Add comprehensive README', files: ['README.md'] },
          { step: 2, action: 'add', description: 'Create API documentation', files: ['docs/api.md'] },
          { step: 3, action: 'add', description: 'Add inline code comments', files: ['src/**/*.ts'] }
        ],
        estimatedEffort: 'medium'
      });
    }

    return recommendations;
  }

  // Helper methods
  private async readFileContent(filePath: string): Promise<string> {
    // Mock implementation - in production, use fs.readFile
    const mockContents = {
      'package.json': '{"name": "octopus-project", "version": "1.0.0"}',
      'src/index.ts': 'import { App } from "./App";\n\nconst app = new App();\napp.start();',
      'src/components/App.tsx': 'import React from "react";\n\nexport const App = () => {\n  return <div>Hello World</div>;\n};'
    };

    const fileName = filePath.split('/').pop() || '';
    return mockContents[fileName] || `// Mock content for ${fileName}\nexport default {};`;
  }

  private detectLanguage(extension: string): string {
    const languageMap: Record<string, string> = {
      'ts': 'typescript',
      'tsx': 'typescript',
      'js': 'javascript',
      'jsx': 'javascript',
      'py': 'python',
      'java': 'java',
      'cs': 'csharp',
      'cpp': 'cpp',
      'c': 'c',
      'html': 'html',
      'css': 'css',
      'scss': 'scss',
      'json': 'json',
      'md': 'markdown',
      'yml': 'yaml',
      'yaml': 'yaml'
    };

    return languageMap[extension.toLowerCase()] || 'unknown';
  }

  private detectFileType(fileName: string, extension: string): FileType {
    if (fileName.includes('test') || fileName.includes('spec')) return 'test';
    if (fileName.includes('config') || extension === 'json' && fileName.includes('config')) return 'config';
    if (extension === 'md' || fileName.toLowerCase().includes('readme')) return 'documentation';
    if (['js', 'ts', 'jsx', 'tsx', 'py', 'java', 'cs'].includes(extension)) return 'source';
    if (['png', 'jpg', 'jpeg', 'gif', 'svg', 'ico'].includes(extension)) return 'asset';
    if (fileName.includes('build') || fileName.includes('webpack')) return 'build';
    return 'unknown';
  }

  private detectFileRole(filePath: string, fileName: string): FileRole {
    if (fileName === 'index.ts' || fileName === 'index.js' || fileName === 'main.ts') return 'entry-point';
    if (filePath.includes('component')) return 'component';
    if (filePath.includes('service')) return 'service';
    if (filePath.includes('util') || filePath.includes('helper')) return 'utility';
    if (filePath.includes('model')) return 'model';
    if (filePath.includes('controller')) return 'controller';
    if (filePath.includes('view')) return 'view';
    if (filePath.includes('middleware')) return 'middleware';
    if (filePath.includes('config')) return 'configuration';
    if (filePath.includes('test')) return 'test';
    if (fileName.includes('README') || fileName.endsWith('.md')) return 'documentation';
    return 'unknown';
  }

  private async calculateFileComplexity(content: string, extension: string): Promise<ComplexityMetrics> {
    // Simplified complexity calculation
    const lines = content.split('\n');
    const cyclomaticComplexity = this.calculateCyclomaticComplexity(content);

    return {
      cyclomaticComplexity,
      cognitiveComplexity: cyclomaticComplexity * 1.2,
      maintainabilityIndex: Math.max(0, 100 - cyclomaticComplexity * 5),
      technicalDebt: cyclomaticComplexity > 10 ? cyclomaticComplexity * 2 : 0
    };
  }

  private calculateCyclomaticComplexity(content: string): number {
    const complexityKeywords = ['if', 'else', 'for', 'while', 'switch', 'case', 'catch', 'try'];
    let complexity = 1;

    for (const keyword of complexityKeywords) {
      const matches = content.match(new RegExp(`\\b${keyword}\\b`, 'g'));
      if (matches) {
        complexity += matches.length;
      }
    }

    return complexity;
  }

  private async extractFileDependencies(content: string, extension: string): Promise<FileDependency[]> {
    const dependencies: FileDependency[] = [];

    // Extract import/require statements
    const importRegex = /(?:import|require)\s*\(?['"]([^'"]+)['"]\)?/g;
    let match;

    while ((match = importRegex.exec(content)) !== null) {
      dependencies.push({
        path: match[1],
        type: 'import',
        isExternal: !match[1].startsWith('.'),
        isOptional: false
      });
    }

    return dependencies;
  }

  private async extractFileExports(content: string, extension: string): Promise<FileExport[]> {
    const exports: FileExport[] = [];

    // Extract export statements
    const exportRegex = /export\s+(?:default\s+)?(?:class|function|const|let|var|interface|type)\s+(\w+)/g;
    let match;
    let lineNumber = 1;

    while ((match = exportRegex.exec(content)) !== null) {
      const beforeMatch = content.substring(0, match.index);
      lineNumber = beforeMatch.split('\n').length;

      exports.push({
        name: match[1],
        type: this.detectExportType(match[0]),
        isDefault: match[0].includes('default'),
        line: lineNumber
      });
    }

    return exports;
  }

  private async extractFileImports(content: string, extension: string): Promise<FileImport[]> {
    const imports: FileImport[] = [];

    // Extract import statements
    const importRegex = /import\s+(?:{([^}]+)}|(\w+)|\*\s+as\s+(\w+))\s+from\s+['"]([^'"]+)['"]/g;
    let match;
    let lineNumber = 1;

    while ((match = importRegex.exec(content)) !== null) {
      const beforeMatch = content.substring(0, match.index);
      lineNumber = beforeMatch.split('\n').length;

      const [, namedImports, defaultImport, namespaceImport, source] = match;
      const importNames: string[] = [];

      if (namedImports) {
        importNames.push(...namedImports.split(',').map(s => s.trim()));
      } else if (defaultImport) {
        importNames.push(defaultImport);
      } else if (namespaceImport) {
        importNames.push(namespaceImport);
      }

      imports.push({
        source,
        imports: importNames,
        type: namedImports ? 'named' : defaultImport ? 'default' : 'namespace',
        line: lineNumber
      });
    }

    return imports;
  }

  private detectExportType(exportStatement: string): ExportType {
    if (exportStatement.includes('function')) return 'function';
    if (exportStatement.includes('class')) return 'class';
    if (exportStatement.includes('interface')) return 'interface';
    if (exportStatement.includes('type')) return 'type';
    if (exportStatement.includes('const')) return 'constant';
    return 'variable';
  }

  private detectDirectoryPurpose(dirName: string, files: FileReference[]): DirectoryPurpose {
    const name = dirName.toLowerCase();

    if (name.includes('test')) return 'tests';
    if (name.includes('doc')) return 'documentation';
    if (name.includes('config')) return 'configuration';
    if (name.includes('asset') || name.includes('static')) return 'assets';
    if (name.includes('build') || name.includes('dist')) return 'build-output';
    if (name.includes('node_modules')) return 'dependencies';
    if (name.includes('script')) return 'scripts';
    if (name.includes('data')) return 'data';
    if (files.some(f => f.type === 'source')) return 'source-code';

    return 'unknown';
  }

  private calculateFileImportance(file: FileNode): ImportanceLevel {
    let score = 0;

    // Entry points are critical
    if (file.role === 'entry-point') score += 40;

    // Files with many dependencies
    if (file.dependencies.length > 5) score += 20;

    // Large files might be important
    if (file.lines > 200) score += 10;

    // Complex files
    if (file.complexity.cyclomaticComplexity > 10) score += 15;

    if (score >= 40) return 'critical';
    if (score >= 25) return 'high';
    if (score >= 10) return 'medium';
    return 'low';
  }

  private calculateDirectoryImportance(dirName: string, fileCount: number, depth: number): ImportanceLevel {
    let score = 0;

    // Root level directories are more important
    score += Math.max(0, 20 - depth * 5);

    // Directories with many files
    score += Math.min(fileCount * 2, 30);

    // Important directory names
    if (['src', 'lib', 'app'].includes(dirName)) score += 25;
    if (['components', 'services', 'utils'].includes(dirName)) score += 15;

    if (score >= 40) return 'critical';
    if (score >= 25) return 'high';
    if (score >= 10) return 'medium';
    return 'low';
  }

  private calculateCoupling(files: FileNode[]): number {
    // Calculate average number of dependencies per file
    const totalDeps = files.reduce((sum, f) => sum + f.dependencies.length, 0);
    return files.length > 0 ? totalDeps / files.length : 0;
  }

  private calculateCohesion(directories: DirectoryNode[]): number {
    // Simplified cohesion calculation based on directory organization
    const avgFilesPerDir = directories.reduce((sum, d) => sum + d.fileCount, 0) / directories.length;
    return Math.min(100, avgFilesPerDir * 10);
  }

  private calculateCommentRatio(files: FileNode[]): number {
    // Mock comment ratio calculation
    return Math.random() * 30 + 10; // 10-40%
  }

  private setupWatching(projectPath: string): void {
    if (this.watchedPaths.has(projectPath)) return;

    this.watchedPaths.add(projectPath);
    console.log(`Started watching project: ${projectPath}`);

    // Mock file watching - in production, use fs.watch
    setInterval(() => {
      this.emit('fileChanged', { projectPath, file: 'mock-file.ts' });
    }, 60000); // Check every minute
  }

  /**
   * Get analysis statistics
   */
  getAnalysisStats(): any {
    return {
      cachedAnalyses: this.analysisCache.size,
      watchedProjects: this.watchedPaths.size,
      activeAnalyses: this.analysisQueue.size,
      supportedLanguages: ['typescript', 'javascript', 'python', 'java', 'csharp', 'html', 'css'],
      supportedFileTypes: ['source', 'test', 'config', 'documentation', 'asset', 'build'],
      organizationPatterns: ['mvc', 'component-based', 'feature-based', 'layered', 'microservices']
    };
  }

  /**
   * Clear analysis cache
   */
  clearCache(): void {
    this.analysisCache.clear();
    console.log('Analysis cache cleared');
  }

  /**
   * Stop watching a project
   */
  stopWatching(projectPath: string): void {
    this.watchedPaths.delete(projectPath);
    console.log(`Stopped watching project: ${projectPath}`);
  }
}

// Helper interfaces
export interface AnalysisOptions {
  forceRefresh?: boolean;
  cacheTimeout?: number;
  watchForChanges?: boolean;
  includeTests?: boolean;
  includeNodeModules?: boolean;
  maxDepth?: number;
  filePatterns?: string[];
  excludePatterns?: string[];
}

export default FileAnalyzer;