/**
* Project Detector - Intelligent project type detection and classification
*
* This class provides:
* - Automatic project type detection
* - Framework and technology identification
* - Architecture pattern recognition
* - Development approach classification
* - Project maturity assessment
* - Technology stack analysis
*/

import { EventEmitter } from 'events';

export interface ProjectDetectionResult {
  id: string;
  projectPath: string;
  analyzedAt: number;
  projectType: ProjectType;
  technologyStack: TechnologyStack;
  architecturePattern: ArchitecturePattern;
  developmentApproach: DevelopmentApproach;
  maturityAssessment: MaturityAssessment;
  recommendations: ProjectRecommendation[];
  confidence: ConfidenceScores;
}

export interface ProjectType {
  primary: ProjectCategory;
  secondary: ProjectCategory[];
  subtype: string;
  description: string;
  confidence: number;
  characteristics: ProjectCharacteristic[];
}

export interface TechnologyStack {
  frontend: TechnologyInfo[];
  backend: TechnologyInfo[];
  database: TechnologyInfo[];
  infrastructure: TechnologyInfo[];
  tools: TechnologyInfo[];
  languages: LanguageInfo[];
  frameworks: FrameworkInfo[];
}

export interface TechnologyInfo {
  name: string;
  version: string;
  purpose: TechnologyPurpose;
  confidence: number;
  usage: UsageLevel;
  maturity: MaturityLevel;
}

export interface LanguageInfo {
  name: string;
  percentage: number;
  purpose: LanguagePurpose;
  version: string;
  dialects: string[];
}

export interface FrameworkInfo {
  name: string;
  version: string;
  category: FrameworkCategory;
  popularity: PopularityLevel;
  ecosystem: EcosystemInfo;
}

export interface EcosystemInfo {
  packageCount: number;
  communitySize: number;
  documentationQuality: QualityLevel;
  learningCurve: DifficultyLevel;
}

export interface ArchitecturePattern {
  primary: ArchitectureType;
  patterns: PatternInfo[];
  principles: ArchitecturalPrinciple[];
  compliance: ComplianceLevel;
  recommendations: ArchitectureRecommendation[];
}

export interface PatternInfo {
  name: string;
  confidence: number;
  evidence: string[];
  benefits: string[];
  drawbacks: string[];
}

export interface ArchitecturalPrinciple {
  name: string;
  adherence: number;
  violations: string[];
  suggestions: string[];
}

export interface DevelopmentApproach {
  methodology: DevelopmentMethodology;
  practices: DevelopmentPractice[];
  automation: AutomationLevel;
  quality: QualityPractices;
  collaboration: CollaborationPractices;
}

export interface DevelopmentPractice {
  name: string;
  implemented: boolean;
  maturity: MaturityLevel;
  tools: string[];
  benefits: string[];
}

export interface QualityPractices {
  testing: TestingPractices;
  codeQuality: CodeQualityPractices;
  documentation: DocumentationPractices;
  monitoring: MonitoringPractices;
}

export interface TestingPractices {
  strategy: TestingStrategy;
  coverage: number;
  automation: number;
  types: TestType[];
  frameworks: string[];
}

export interface CodeQualityPractices {
  linting: boolean;
  formatting: boolean;
  staticAnalysis: boolean;
  codeReview: boolean;
  standards: CodingStandard[];
}

export interface DocumentationPractices {
  readme: QualityLevel;
  apiDocs: QualityLevel;
  architecture: QualityLevel;
  userGuides: QualityLevel;
  coverage: number;
}

export interface MonitoringPractices {
  logging: boolean;
  metrics: boolean;
  tracing: boolean;
  alerting: boolean;
  tools: string[];
}

export interface CollaborationPractices {
  versionControl: VersionControlInfo;
  ci_cd: CICDInfo;
  issueTracking: boolean;
  codeReview: CodeReviewInfo;
  documentation: boolean;
}

export interface VersionControlInfo {
  system: string;
  strategy: BranchingStrategy;
  conventions: ConventionLevel;
}

export interface CICDInfo {
  implemented: boolean;
  tools: string[];
  automation: AutomationLevel;
  deployment: DeploymentStrategy;
}

export interface CodeReviewInfo {
  required: boolean;
  automated: boolean;
  coverage: number;
  quality: QualityLevel;
}

export interface MaturityAssessment {
  overall: MaturityLevel;
  dimensions: MaturityDimension[];
  strengths: string[];
  weaknesses: string[];
  roadmap: MaturityRoadmapItem[];
}

export interface MaturityDimension {
  name: string;
  level: MaturityLevel;
  score: number;
  criteria: MaturityCriterion[];
}

export interface MaturityCriterion {
  name: string;
  met: boolean;
  importance: ImportanceLevel;
  description: string;
}

export interface MaturityRoadmapItem {
  level: MaturityLevel;
  description: string;
  requirements: string[];
  estimatedEffort: EffortLevel;
  priority: PriorityLevel;
}

export interface ProjectCharacteristic {
  name: string;
  value: string;
  confidence: number;
  evidence: string[];
}

export interface ProjectRecommendation {
  category: RecommendationCategory;
  title: string;
  description: string;
  rationale: string;
  priority: PriorityLevel;
  effort: EffortLevel;
  impact: ImpactLevel;
  implementation: ImplementationPlan;
}

export interface ImplementationPlan {
  phases: ImplementationPhase[];
  timeline: string;
  resources: ResourceRequirement[];
  risks: string[];
  success_criteria: string[];
}

export interface ImplementationPhase {
  name: string;
  duration: string;
  activities: string[];
  deliverables: string[];
  dependencies: string[];
}

export interface ResourceRequirement {
  type: ResourceType;
  quantity: string;
  skills: string[];
  duration: string;
}

export interface ArchitectureRecommendation {
  pattern: string;
  rationale: string;
  benefits: string[];
  implementation: string[];
  effort: EffortLevel;
}

export interface ConfidenceScores {
  projectType: number;
  technologyStack: number;
  architecture: number;
  maturity: number;
  overall: number;
}

export type ProjectCategory =
  | 'web-application'
  | 'mobile-application'
  | 'desktop-application'
  | 'library'
  | 'framework'
  | 'api-service'
  | 'microservice'
  | 'cli-tool'
  | 'game'
  | 'data-science'
  | 'machine-learning'
  | 'blockchain'
  | 'iot'
  | 'embedded'
  | 'plugin'
  | 'template'
  | 'documentation'
  | 'configuration'
  | 'unknown';

export type TechnologyPurpose =
  | 'framework'
  | 'library'
  | 'tool'
  | 'runtime'
  | 'database'
  | 'server'
  | 'bundler'
  | 'transpiler'
  | 'linter'
  | 'formatter'
  | 'testing'
  | 'deployment'
  | 'monitoring'
  | 'security';

export type LanguagePurpose =
  | 'frontend'
  | 'backend'
  | 'styling'
  | 'markup'
  | 'configuration'
  | 'scripting'
  | 'documentation'
  | 'data'
  | 'template';

export type FrameworkCategory =
  | 'web-framework'
  | 'mobile-framework'
  | 'desktop-framework'
  | 'testing-framework'
  | 'orm'
  | 'ui-library'
  | 'state-management'
  | 'routing'
  | 'authentication'
  | 'validation'
  | 'utilities';

export type ArchitectureType =
  | 'monolithic'
  | 'microservices'
  | 'serverless'
  | 'jamstack'
  | 'mvc'
  | 'mvp'
  | 'mvvm'
  | 'component-based'
  | 'layered'
  | 'hexagonal'
  | 'event-driven'
  | 'pipe-and-filter'
  | 'client-server'
  | 'peer-to-peer'
  | 'spa'
  | 'mpa'
  | 'pwa'
  | 'hybrid'
  | 'unknown';

export type DevelopmentMethodology =
  | 'agile'
  | 'waterfall'
  | 'scrum'
  | 'kanban'
  | 'lean'
  | 'devops'
  | 'continuous-delivery'
  | 'trunk-based'
  | 'gitflow'
  | 'feature-branch'
  | 'unknown';

export type TestingStrategy =
  | 'unit-first'
  | 'integration-focused'
  | 'end-to-end'
  | 'behavior-driven'
  | 'test-driven'
  | 'acceptance-test-driven'
  | 'manual'
  | 'exploratory'
  | 'mixed'
  | 'minimal';

export type TestType =
  | 'unit'
  | 'integration'
  | 'end-to-end'
  | 'acceptance'
  | 'performance'
  | 'security'
  | 'accessibility'
  | 'visual'
  | 'contract'
  | 'smoke';

export type CodingStandard =
  | 'eslint'
  | 'prettier'
  | 'airbnb'
  | 'standard'
  | 'google'
  | 'pep8'
  | 'psr'
  | 'sonar'
  | 'custom';

export type BranchingStrategy =
  | 'gitflow'
  | 'github-flow'
  | 'gitlab-flow'
  | 'trunk-based'
  | 'feature-branch'
  | 'environment-branch'
  | 'custom';

export type DeploymentStrategy =
  | 'blue-green'
  | 'rolling'
  | 'canary'
  | 'a-b-testing'
  | 'immutable'
  | 'recreate'
  | 'ramped'
  | 'manual';

export type RecommendationCategory =
  | 'architecture'
  | 'technology'
  | 'quality'
  | 'performance'
  | 'security'
  | 'maintainability'
  | 'scalability'
  | 'documentation'
  | 'testing'
  | 'deployment'
  | 'monitoring'
  | 'collaboration';

export type ResourceType =
  | 'developer'
  | 'architect'
  | 'devops'
  | 'qa'
  | 'designer'
  | 'product-manager'
  | 'security-expert'
  | 'data-engineer'
  | 'consultant';

export type UsageLevel = 'primary' | 'secondary' | 'utility' | 'experimental';
export type MaturityLevel = 'initial' | 'developing' | 'defined' | 'managed' | 'optimizing';
export type PopularityLevel = 'mainstream' | 'popular' | 'niche' | 'emerging' | 'declining';
export type QualityLevel = 'excellent' | 'good' | 'fair' | 'poor' | 'missing';
export type DifficultyLevel = 'beginner' | 'intermediate' | 'advanced' | 'expert';
export type ComplianceLevel = 'full' | 'partial' | 'minimal' | 'none';
export type AutomationLevel = 'full' | 'high' | 'medium' | 'low' | 'none';
export type ConventionLevel = 'strict' | 'consistent' | 'loose' | 'inconsistent';
export type ImportanceLevel = 'critical' | 'high' | 'medium' | 'low';
export type PriorityLevel = 'urgent' | 'high' | 'medium' | 'low';
export type EffortLevel = 'minimal' | 'small' | 'medium' | 'large' | 'extensive';
export type ImpactLevel = 'transformational' | 'high' | 'medium' | 'low' | 'minimal';

/**
* Project Detector Class
*/
export class ProjectDetector extends EventEmitter {
  private detectionCache: Map<string, ProjectDetectionResult> = new Map();
  private technologySignatures: Map<string, TechnologySignature> = new Map();
  private frameworkDetectors: Map<string, FrameworkDetector> = new Map();

  constructor() {
    super();
    this.initializeTechnologySignatures();
    this.initializeFrameworkDetectors();
    console.log('Project Detector initialized');
  }

  /**
   * Detect and analyze project type, technology stack, and architecture
   */
  async detectProject(projectPath: string, options: DetectionOptions = {}): Promise<ProjectDetectionResult> {
    const startTime = Date.now();

    try {
      this.emit('detectionStarted', { projectPath, options });

      // Check cache
      if (!options.forceRefresh && this.detectionCache.has(projectPath)) {
        const cached = this.detectionCache.get(projectPath)!;
        if (Date.now() - cached.analyzedAt < (options.cacheTimeout || 900000)) { // 15 min default
          this.emit('detectionCacheHit', cached);
          return cached;
        }
      }

      // Analyze project files and structure
      const fileAnalysis = await this.analyzeProjectFiles(projectPath, options);

      // Detect technology stack
      const technologyStack = await this.detectTechnologyStack(fileAnalysis);

      // Determine project type
      const projectType = await this.determineProjectType(fileAnalysis, technologyStack);

      // Analyze architecture patterns
      const architecturePattern = await this.analyzeArchitecture(fileAnalysis, technologyStack);

      // Assess development approach
      const developmentApproach = await this.assessDevelopmentApproach(fileAnalysis);

      // Evaluate maturity
      const maturityAssessment = await this.assessMaturity(
        fileAnalysis,
        technologyStack,
        architecturePattern,
        developmentApproach
      );

      // Generate recommendations
      const recommendations = await this.generateRecommendations(
        projectType,
        technologyStack,
        architecturePattern,
        maturityAssessment
      );

      // Calculate confidence scores
      const confidence = this.calculateConfidenceScores(
        projectType,
        technologyStack,
        architecturePattern,
        maturityAssessment
      );

      const result: ProjectDetectionResult = {
        id: `detection_${Date.now()}`,
        projectPath,
        analyzedAt: Date.now(),
        projectType,
        technologyStack,
        architecturePattern,
        developmentApproach,
        maturityAssessment,
        recommendations,
        confidence
      };

      // Cache result
      this.detectionCache.set(projectPath, result);

      this.emit('detectionCompleted', {
        result,
        duration: Date.now() - startTime,
        options
      });

      return result;

    } catch (error) {
      this.emit('detectionError', { projectPath, error: error.message, options });
      throw error;
    }
  }

  /**
   * Analyze project files for detection clues
   */
  private async analyzeProjectFiles(projectPath: string, options: DetectionOptions): Promise<FileAnalysisResult> {
    // Mock file analysis - in production, scan actual file system
    const mockAnalysis: FileAnalysisResult = {
      configFiles: [
        { name: 'package.json', type: 'npm', content: this.getMockPackageJson() },
        { name: 'tsconfig.json', type: 'typescript', content: '{}' },
        { name: 'webpack.config.js', type: 'webpack', content: 'module.exports = {}' },
        { name: '.eslintrc.js', type: 'eslint', content: 'module.exports = {}' },
        { name: 'jest.config.js', type: 'jest', content: 'module.exports = {}' }
      ],
      sourceFiles: [
        { path: 'src/index.tsx', language: 'typescript', framework: 'react' },
        { path: 'src/App.tsx', language: 'typescript', framework: 'react' },
        { path: 'src/components/Header.tsx', language: 'typescript', framework: 'react' },
        { path: 'src/services/api.ts', language: 'typescript', framework: null },
        { path: 'src/utils/helpers.ts', language: 'typescript', framework: null }
      ],
      directoryStructure: [
        { name: 'src', purpose: 'source-code', depth: 1 },
        { name: 'src/components', purpose: 'ui-components', depth: 2 },
        { name: 'src/services', purpose: 'business-logic', depth: 2 },
        { name: 'src/utils', purpose: 'utilities', depth: 2 },
        { name: 'public', purpose: 'static-assets', depth: 1 },
        { name: 'tests', purpose: 'testing', depth: 1 },
        { name: 'docs', purpose: 'documentation', depth: 1 }
      ],
      buildFiles: [
        { name: 'webpack.config.js', tool: 'webpack' },
        { name: 'vite.config.ts', tool: 'vite' }
      ],
      testFiles: [
        { name: 'src/App.test.tsx', framework: 'jest' },
        { name: 'tests/integration/api.test.ts', framework: 'jest' }
      ],
      documentationFiles: [
        { name: 'README.md', type: 'readme' },
        { name: 'docs/API.md', type: 'api-docs' }
      ]
    };

    return mockAnalysis;
  }

  /**
   * Detect comprehensive technology stack
   */
  private async detectTechnologyStack(fileAnalysis: FileAnalysisResult): Promise<TechnologyStack> {
    const frontend: TechnologyInfo[] = [];
    const backend: TechnologyInfo[] = [];
    const database: TechnologyInfo[] = [];
    const infrastructure: TechnologyInfo[] = [];
    const tools: TechnologyInfo[] = [];
    const languages: LanguageInfo[] = [];
    const frameworks: FrameworkInfo[] = [];

    // Analyze package.json for technologies
    const packageJson = fileAnalysis.configFiles.find(f => f.name === 'package.json');
    if (packageJson) {
      const pkg = JSON.parse(packageJson.content);

      // Detect React
      if (pkg.dependencies?.react) {
        frontend.push({
          name: 'React',
          version: pkg.dependencies.react,
          purpose: 'framework',
          confidence: 0.95,
          usage: 'primary',
          maturity: 'defined'
        });

        frameworks.push({
          name: 'React',
          version: pkg.dependencies.react,
          category: 'web-framework',
          popularity: 'mainstream',
          ecosystem: {
            packageCount: 100000,
            communitySize: 1000000,
            documentationQuality: 'excellent',
            learningCurve: 'intermediate'
          }
        });
      }

      // Detect TypeScript
      if (pkg.devDependencies?.typescript || fileAnalysis.configFiles.some(f => f.name === 'tsconfig.json')) {
        tools.push({
          name: 'TypeScript',
          version: pkg.devDependencies?.typescript || '^5.0.0',
          purpose: 'transpiler',
          confidence: 0.9,
          usage: 'primary',
          maturity: 'defined'
        });

        languages.push({
          name: 'TypeScript',
          percentage: 85,
          purpose: 'frontend',
          version: '5.0',
          dialects: ['TSX']
        });
      }

      // Detect Webpack
      if (pkg.devDependencies?.webpack || fileAnalysis.buildFiles.some(f => f.tool === 'webpack')) {
        tools.push({
          name: 'Webpack',
          version: pkg.devDependencies?.webpack || '^5.0.0',
          purpose: 'bundler',
          confidence: 0.8,
          usage: 'secondary',
          maturity: 'defined'
        });
      }

      // Detect Jest
      if (pkg.devDependencies?.jest || fileAnalysis.configFiles.some(f => f.name === 'jest.config.js')) {
        tools.push({
          name: 'Jest',
          version: pkg.devDependencies?.jest || '^29.0.0',
          purpose: 'testing',
          confidence: 0.85,
          usage: 'secondary',
          maturity: 'defined'
        });
      }
    }

    // Add JavaScript if no TypeScript
    if (!languages.some(l => l.name === 'TypeScript')) {
      languages.push({
        name: 'JavaScript',
        percentage: 75,
        purpose: 'frontend',
        version: 'ES2022',
        dialects: ['JSX']
      });
    }

    // Add CSS/HTML
    languages.push(
      {
        name: 'CSS',
        percentage: 10,
        purpose: 'styling',
        version: '3',
        dialects: ['SCSS', 'CSS Modules']
      },
      {
        name: 'HTML',
        percentage: 5,
        purpose: 'markup',
        version: '5',
        dialects: ['JSX']
      }
    );

    return {
      frontend,
      backend,
      database,
      infrastructure,
      tools,
      languages,
      frameworks
    };
  }

  /**
   * Determine primary project type and characteristics
   */
  private async determineProjectType(
    fileAnalysis: FileAnalysisResult,
    techStack: TechnologyStack
  ): Promise<ProjectType> {
    let primaryType: ProjectCategory = 'unknown';
    const characteristics: ProjectCharacteristic[] = [];
    let confidence = 0;

    // Check for React application
    if (techStack.frameworks.some(f => f.name === 'React')) {
      primaryType = 'web-application';
      confidence = 0.9;
      characteristics.push({
        name: 'UI Framework',
        value: 'React',
        confidence: 0.95,
        evidence: ['React dependency in package.json', 'JSX/TSX files present']
      });
    }

    // Check for library indicators
    if (fileAnalysis.configFiles.some(f => f.name === 'rollup.config.js') ||
      fileAnalysis.sourceFiles.some(f => f.path.includes('lib/') || f.path.includes('dist/'))) {
      primaryType = 'library';
      confidence = 0.8;
      characteristics.push({
        name: 'Build Target',
        value: 'Library Distribution',
        confidence: 0.8,
        evidence: ['Build configuration for library', 'Distribution directory']
      });
    }

    // Check for API service
    if (techStack.backend.length > 0 && techStack.frontend.length === 0) {
      primaryType = 'api-service';
      confidence = 0.85;
    }

    // Check for CLI tool
    if (fileAnalysis.sourceFiles.some(f => f.path.includes('bin/') || f.path.includes('cli/'))) {
      primaryType = 'cli-tool';
      confidence = 0.7;
    }

    // Add technology characteristics
    if (techStack.languages.some(l => l.name === 'TypeScript')) {
      characteristics.push({
        name: 'Type Safety',
        value: 'TypeScript',
        confidence: 0.9,
        evidence: ['TypeScript configuration', 'TS/TSX files']
      });
    }

    // Add testing characteristics
    if (fileAnalysis.testFiles.length > 0) {
      characteristics.push({
        name: 'Testing Strategy',
        value: 'Automated Testing',
        confidence: 0.8,
        evidence: [`${fileAnalysis.testFiles.length} test files found`]
      });
    }

    return {
      primary: primaryType,
      secondary: [],
      subtype: this.determineSubtype(primaryType, techStack),
      description: this.generateProjectDescription(primaryType, techStack),
      confidence,
      characteristics
    };
  }

  /**
   * Analyze architecture patterns and principles
   */
  private async analyzeArchitecture(
    fileAnalysis: FileAnalysisResult,
    techStack: TechnologyStack
  ): Promise<ArchitecturePattern> {
    let primaryArchitecture: ArchitectureType = 'unknown';
    const patterns: PatternInfo[] = [];
    const principles: ArchitecturalPrinciple[] = [];

    // Detect component-based architecture
    if (fileAnalysis.directoryStructure.some(d => d.name.includes('components'))) {
      primaryArchitecture = 'component-based';
      patterns.push({
        name: 'Component-Based Architecture',
        confidence: 0.9,
        evidence: ['Components directory', 'React framework'],
        benefits: ['Reusability', 'Modularity', 'Maintainability'],
        drawbacks: ['Initial complexity', 'Over-engineering risk']
      });
    }

    // Detect SPA pattern
    if (techStack.frameworks.some(f => f.name === 'React') &&
      !fileAnalysis.sourceFiles.some(f => f.path.includes('pages/') && f.path.includes('api/'))) {
      patterns.push({
        name: 'Single Page Application',
        confidence: 0.85,
        evidence: ['React framework', 'No server-side routing'],
        benefits: ['Fast navigation', 'Rich user experience'],
        drawbacks: ['SEO challenges', 'Initial load time']
      });
    }

    // Detect layered architecture
    if (fileAnalysis.directoryStructure.some(d => d.purpose === 'business-logic') &&
      fileAnalysis.directoryStructure.some(d => d.purpose === 'utilities')) {
      patterns.push({
        name: 'Layered Architecture',
        confidence: 0.7,
        evidence: ['Service layer', 'Utility layer', 'Component layer'],
        benefits: ['Separation of concerns', 'Testability'],
        drawbacks: ['Performance overhead', 'Complexity']
      });
    }

    // Analyze architectural principles
    principles.push(
      {
        name: 'Separation of Concerns',
        adherence: this.calculateSeparationOfConcerns(fileAnalysis),
        violations: [],
        suggestions: ['Separate business logic from UI', 'Extract utilities']
      },
      {
        name: 'Single Responsibility',
        adherence: this.calculateSingleResponsibility(fileAnalysis),
        violations: [],
        suggestions: ['Break down large components', 'Extract custom hooks']
      }
    );

    const recommendations: ArchitectureRecommendation[] = [];

    if (primaryArchitecture === 'component-based') {
      recommendations.push({
        pattern: 'Container/Presentational Pattern',
        rationale: 'Better separation of logic and presentation',
        benefits: ['Easier testing', 'Better reusability', 'Cleaner code'],
        implementation: ['Separate container components', 'Create pure presentational components'],
        effort: 'medium'
      });
    }

    return {
      primary: primaryArchitecture,
      patterns,
      principles,
      compliance: 'partial',
      recommendations
    };
  }

  /**
   * Assess development approach and practices
   */
  private async assessDevelopmentApproach(fileAnalysis: FileAnalysisResult): Promise<DevelopmentApproach> {
    // Detect version control
    const hasGit = fileAnalysis.configFiles.some(f => f.name === '.gitignore');

    // Detect linting
    const hasLinting = fileAnalysis.configFiles.some(f => f.name.includes('eslint'));

    // Detect testing
    const hasTesting = fileAnalysis.testFiles.length > 0;

    // Detect formatting
    const hasFormatting = fileAnalysis.configFiles.some(f => f.name.includes('prettier'));

    const practices: DevelopmentPractice[] = [
      {
        name: 'Version Control',
        implemented: hasGit,
        maturity: hasGit ? 'defined' : 'initial',
        tools: hasGit ? ['Git'] : [],
        benefits: ['Change tracking', 'Collaboration', 'History']
      },
      {
        name: 'Code Linting',
        implemented: hasLinting,
        maturity: hasLinting ? 'defined' : 'initial',
        tools: hasLinting ? ['ESLint'] : [],
        benefits: ['Code quality', 'Consistency', 'Error prevention']
      },
      {
        name: 'Automated Testing',
        implemented: hasTesting,
        maturity: hasTesting ? 'developing' : 'initial',
        tools: hasTesting ? ['Jest'] : [],
        benefits: ['Quality assurance', 'Regression prevention', 'Documentation']
      },
      {
        name: 'Code Formatting',
        implemented: hasFormatting,
        maturity: hasFormatting ? 'defined' : 'initial',
        tools: hasFormatting ? ['Prettier'] : [],
        benefits: ['Consistency', 'Readability', 'Reduced conflicts']
      }
    ];

    const testingPractices: TestingPractices = {
      strategy: hasTesting ? 'unit-first' : 'minimal',
      coverage: hasTesting ? 60 : 0, // Mock coverage
      automation: hasTesting ? 80 : 0,
      types: hasTesting ? ['unit', 'integration'] : [],
      frameworks: hasTesting ? ['Jest'] : []
    };

    const codeQualityPractices: CodeQualityPractices = {
      linting: hasLinting,
      formatting: hasFormatting,
      staticAnalysis: hasLinting,
      codeReview: false, // Can't detect from files
      standards: hasLinting ? ['eslint'] : []
    };

    const documentationPractices: DocumentationPractices = {
      readme: fileAnalysis.documentationFiles.some(f => f.name === 'README.md') ? 'good' : 'missing',
      apiDocs: fileAnalysis.documentationFiles.some(f => f.type === 'api-docs') ? 'good' : 'missing',
      architecture: 'missing', // Not detected
      userGuides: 'missing', // Not detected
      coverage: fileAnalysis.documentationFiles.length > 0 ? 40 : 0
    };

    const monitoringPractices: MonitoringPractices = {
      logging: false, // Can't easily detect
      metrics: false,
      tracing: false,
      alerting: false,
      tools: []
    };

    const versionControlInfo: VersionControlInfo = {
      system: hasGit ? 'Git' : 'None',
      strategy: 'feature-branch', // Assumption
      conventions: 'loose' // Can't detect
    };

    const cicdInfo: CICDInfo = {
      implemented: false, // Can't detect from files
      tools: [],
      automation: 'none',
      deployment: 'manual'
    };

    const codeReviewInfo: CodeReviewInfo = {
      required: false, // Can't detect
      automated: false,
      coverage: 0,
      quality: 'missing'
    };

    return {
      methodology: 'agile', // Assumption
      practices,
      automation: this.calculateAutomationLevel(practices),
      quality: {
        testing: testingPractices,
        codeQuality: codeQualityPractices,
        documentation: documentationPractices,
        monitoring: monitoringPractices
      },
      collaboration: {
        versionControl: versionControlInfo,
        ci_cd: cicdInfo,
        issueTracking: false,
        codeReview: codeReviewInfo,
        documentation: documentationPractices.coverage > 20
      }
    };
  }

  /**
   * Assess project maturity across multiple dimensions
   */
  private async assessMaturity(
    fileAnalysis: FileAnalysisResult,
    techStack: TechnologyStack,
    architecture: ArchitecturePattern,
    development: DevelopmentApproach
  ): Promise<MaturityAssessment> {
    const dimensions: MaturityDimension[] = [
      {
        name: 'Code Quality',
        level: development.quality.codeQuality.linting ? 'defined' : 'developing',
        score: this.calculateCodeQualityScore(development.quality.codeQuality),
        criteria: [
          { name: 'Linting', met: development.quality.codeQuality.linting, importance: 'high', description: 'Automated code quality checks' },
          { name: 'Formatting', met: development.quality.codeQuality.formatting, importance: 'medium', description: 'Consistent code formatting' },
          { name: 'Static Analysis', met: development.quality.codeQuality.staticAnalysis, importance: 'high', description: 'Static code analysis tools' }
        ]
      },
      {
        name: 'Testing',
        level: development.quality.testing.coverage > 50 ? 'defined' : 'developing',
        score: development.quality.testing.coverage,
        criteria: [
          { name: 'Unit Tests', met: development.quality.testing.types.includes('unit'), importance: 'critical', description: 'Unit test coverage' },
          { name: 'Integration Tests', met: development.quality.testing.types.includes('integration'), importance: 'high', description: 'Integration test coverage' },
          { name: 'Test Automation', met: development.quality.testing.automation > 70, importance: 'high', description: 'Automated test execution' }
        ]
      },
      {
        name: 'Documentation',
        level: development.quality.documentation.coverage > 30 ? 'developing' : 'initial',
        score: development.quality.documentation.coverage,
        criteria: [
          { name: 'README', met: development.quality.documentation.readme !== 'missing', importance: 'critical', description: 'Project README documentation' },
          { name: 'API Documentation', met: development.quality.documentation.apiDocs !== 'missing', importance: 'high', description: 'API documentation' },
          { name: 'Code Comments', met: false, importance: 'medium', description: 'Inline code documentation' }
        ]
      },
      {
        name: 'Architecture',
        level: architecture.compliance === 'full' ? 'defined' : 'developing',
        score: this.calculateArchitectureScore(architecture),
        criteria: [
          { name: 'Clear Patterns', met: architecture.patterns.length > 0, importance: 'high', description: 'Identifiable architecture patterns' },
          { name: 'Separation of Concerns', met: architecture.principles.some(p => p.name === 'Separation of Concerns' && p.adherence > 70), importance: 'critical', description: 'Good separation of concerns' },
          { name: 'Modularity', met: fileAnalysis.directoryStructure.length > 3, importance: 'high', description: 'Modular code organization' }
        ]
      }
    ];

    const overallScore = dimensions.reduce((sum, dim) => sum + dim.score, 0) / dimensions.length;
    const overallLevel = this.scoreToMaturityLevel(overallScore);

    const strengths = dimensions
      .filter(dim => dim.score >= 70)
      .map(dim => dim.name);

    const weaknesses = dimensions
      .filter(dim => dim.score < 50)
      .map(dim => dim.name);

    const roadmap: MaturityRoadmapItem[] = [
      {
        level: 'developing',
        description: 'Establish basic development practices',
        requirements: ['Add linting', 'Set up testing', 'Improve documentation'],
        estimatedEffort: 'medium',
        priority: 'high'
      },
      {
        level: 'defined',
        description: 'Implement comprehensive quality practices',
        requirements: ['Increase test coverage', 'Add CI/CD', 'Implement code review'],
        estimatedEffort: 'large',
        priority: 'medium'
      }
    ];

    return {
      overall: overallLevel,
      dimensions,
      strengths,
      weaknesses,
      roadmap
    };
  }

  /**
   * Generate comprehensive project recommendations
   */
  private async generateRecommendations(
    projectType: ProjectType,
    techStack: TechnologyStack,
    architecture: ArchitecturePattern,
    maturity: MaturityAssessment
  ): Promise<ProjectRecommendation[]> {
    const recommendations: ProjectRecommendation[] = [];

    // Testing recommendations
    if (maturity.dimensions.find(d => d.name === 'Testing')?.score < 50) {
      recommendations.push({
        category: 'testing',
        title: 'Improve Test Coverage and Quality',
        description: 'Implement comprehensive testing strategy to improve code quality and reliability',
        rationale: 'Low test coverage increases risk of bugs and makes refactoring difficult',
        priority: 'high',
        effort: 'medium',
        impact: 'high',
        implementation: {
          phases: [
            {
              name: 'Setup Testing Infrastructure',
              duration: '1 week',
              activities: ['Configure test runner', 'Set up test utilities', 'Create test templates'],
              deliverables: ['Test configuration', 'Testing guidelines'],
              dependencies: []
            },
            {
              name: 'Write Unit Tests',
              duration: '2-3 weeks',
              activities: ['Add unit tests for components', 'Test utility functions', 'Test business logic'],
              deliverables: ['Unit test suite', 'Coverage reports'],
              dependencies: ['Setup Testing Infrastructure']
            }
          ],
          timeline: '3-4 weeks',
          resources: [
            { type: 'developer', quantity: '1-2', skills: ['Testing', 'Jest', 'React Testing Library'], duration: '3-4 weeks' }
          ],
          risks: ['Time investment', 'Learning curve'],
          success_criteria: ['>70% test coverage', 'All critical paths tested', 'CI integration']
        }
      });
    }

    // Documentation recommendations
    if (maturity.dimensions.find(d => d.name === 'Documentation')?.score < 40) {
      recommendations.push({
        category: 'documentation',
        title: 'Enhance Project Documentation',
        description: 'Create comprehensive documentation to improve maintainability and onboarding',
        rationale: 'Poor documentation hinders team collaboration and knowledge transfer',
        priority: 'medium',
        effort: 'small',
        impact: 'medium',
        implementation: {
          phases: [
            {
              name: 'Core Documentation',
              duration: '1 week',
              activities: ['Improve README', 'Document setup process', 'Create contribution guide'],
              deliverables: ['Enhanced README', 'Setup guide', 'Contributing guidelines'],
              dependencies: []
            }
          ],
          timeline: '1-2 weeks',
          resources: [
            { type: 'developer', quantity: '1', skills: ['Technical writing', 'Project knowledge'], duration: '1 week' }
          ],
          risks: ['Time allocation', 'Keeping docs updated'],
          success_criteria: ['Complete README', 'Clear setup instructions', 'API documentation']
        }
      });
    }

    // Architecture recommendations
    if (architecture.recommendations.length > 0) {
      recommendations.push({
        category: 'architecture',
        title: 'Implement Recommended Architecture Patterns',
        description: 'Apply architectural patterns to improve code organization and maintainability',
        rationale: 'Better architecture patterns lead to more maintainable and scalable code',
        priority: 'medium',
        effort: 'large',
        impact: 'high',
        implementation: {
          phases: [
            {
              name: 'Architecture Planning',
              duration: '1 week',
              activities: ['Review current architecture', 'Plan refactoring approach', 'Create migration plan'],
              deliverables: ['Architecture analysis', 'Refactoring plan'],
              dependencies: []
            }
          ],
          timeline: '3-4 weeks',
          resources: [
            { type: 'architect', quantity: '1', skills: ['Software Architecture', 'React', 'TypeScript'], duration: '1 week' },
            { type: 'developer', quantity: '2', skills: ['React', 'TypeScript', 'Refactoring'], duration: '3 weeks' }
          ],
          risks: ['Breaking changes', 'Team coordination'],
          success_criteria: ['Improved code organization', 'Better separation of concerns', 'Reduced coupling']
        }
      });
    }

    return recommendations;
  }

  // Helper methods
  private getMockPackageJson(): string {
    return JSON.stringify({
      name: 'octopus-ai-ide',
      version: '1.0.0-alpha',
      dependencies: {
        react: '^18.2.0',
        'react-dom': '^18.2.0',
        axios: '^1.4.0'
      },
      devDependencies: {
        typescript: '^5.0.0',
        '@types/react': '^18.0.0',
        '@types/react-dom': '^18.0.0',
        webpack: '^5.88.0',
        'webpack-cli': '^5.1.0',
        jest: '^29.5.0',
        '@testing-library/react': '^13.4.0',
        eslint: '^8.44.0',
        prettier: '^2.8.0'
      },
      scripts: {
        start: 'webpack serve',
        build: 'webpack build',
        test: 'jest'
      }
    }, null, 2);
  }

  private determineSubtype(primaryType: ProjectCategory, techStack: TechnologyStack): string {
    if (primaryType === 'web-application') {
      if (techStack.frameworks.some(f => f.name === 'React')) {
        return 'React SPA';
      }
      return 'JavaScript Web App';
    }

    if (primaryType === 'library') {
      if (techStack.languages.some(l => l.name === 'TypeScript')) {
        return 'TypeScript Library';
      }
      return 'JavaScript Library';
    }

    return 'Standard';
  }

  private generateProjectDescription(primaryType: ProjectCategory, techStack: TechnologyStack): string {
    const mainTech = techStack.frameworks[0]?.name || techStack.languages[0]?.name || 'JavaScript';

    switch (primaryType) {
      case 'web-application':
        return `A modern web application built with ${mainTech}`;
      case 'library':
        return `A reusable ${mainTech} library for developers`;
      case 'api-service':
        return `A REST API service built with ${mainTech}`;
      case 'cli-tool':
        return `A command-line tool built with ${mainTech}`;
      default:
        return `A ${mainTech} project`;
    }
  }

  private calculateSeparationOfConcerns(fileAnalysis: FileAnalysisResult): number {
    // Mock calculation based on directory structure
    const hasComponents = fileAnalysis.directoryStructure.some(d => d.purpose === 'ui-components');
    const hasServices = fileAnalysis.directoryStructure.some(d => d.purpose === 'business-logic');
    const hasUtils = fileAnalysis.directoryStructure.some(d => d.purpose === 'utilities');

    let score = 0;
    if (hasComponents) score += 33;
    if (hasServices) score += 33;
    if (hasUtils) score += 34;

    return score;
  }

  private calculateSingleResponsibility(fileAnalysis: FileAnalysisResult): number {
    // Mock calculation based on file organization
    const avgFilesPerDir = fileAnalysis.directoryStructure.reduce((sum, dir) => {
      const dirFiles = fileAnalysis.sourceFiles.filter(f => f.path.startsWith(dir.name));
      return sum + dirFiles.length;
    }, 0) / fileAnalysis.directoryStructure.length;

    // Lower files per directory suggests better single responsibility
    return Math.max(0, 100 - (avgFilesPerDir - 3) * 10);
  }

  private calculateAutomationLevel(practices: DevelopmentPractice[]): AutomationLevel {
    const automatedPractices = practices.filter(p => p.implemented).length;
    const totalPractices = practices.length;
    const percentage = (automatedPractices / totalPractices) * 100;

    if (percentage >= 80) return 'full';
    if (percentage >= 60) return 'high';
    if (percentage >= 40) return 'medium';
    if (percentage >= 20) return 'low';
    return 'none';
  }

  private calculateCodeQualityScore(codeQuality: CodeQualityPractices): number {
    let score = 0;
    if (codeQuality.linting) score += 30;
    if (codeQuality.formatting) score += 20;
    if (codeQuality.staticAnalysis) score += 25;
    if (codeQuality.codeReview) score += 25;
    return score;
  }

  private calculateArchitectureScore(architecture: ArchitecturePattern): number {
    let score = 0;

    // Points for identified patterns
    score += architecture.patterns.length * 20;

    // Points for principle adherence
    const avgAdherence = architecture.principles.reduce((sum, p) => sum + p.adherence, 0) /
      Math.max(architecture.principles.length, 1);
    score += avgAdherence * 0.6;

    return Math.min(100, score);
  }

  private scoreToMaturityLevel(score: number): MaturityLevel {
    if (score >= 80) return 'optimizing';
    if (score >= 65) return 'managed';
    if (score >= 50) return 'defined';
    if (score >= 30) return 'developing';
    return 'initial';
  }

  private calculateConfidenceScores(
    projectType: ProjectType,
    techStack: TechnologyStack,
    architecture: ArchitecturePattern,
    maturity: MaturityAssessment
  ): ConfidenceScores {
    const projectTypeConfidence = projectType.confidence;
    const techStackConfidence = techStack.frameworks.length > 0 ? 0.85 : 0.6;
    const architectureConfidence = architecture.patterns.length > 0 ? 0.75 : 0.5;
    const maturityConfidence = maturity.dimensions.length > 0 ? 0.8 : 0.6;

    const overall = (projectTypeConfidence + techStackConfidence + architectureConfidence + maturityConfidence) / 4;

    return {
      projectType: projectTypeConfidence,
      technologyStack: techStackConfidence,
      architecture: architectureConfidence,
      maturity: maturityConfidence,
      overall
    };
  }

  private initializeTechnologySignatures(): void {
    // Initialize technology detection signatures
    const signatures = [
      { name: 'React', files: ['package.json'], patterns: ['"react":', 'jsx', 'tsx'] },
      { name: 'Vue', files: ['package.json'], patterns: ['"vue":', '.vue'] },
      { name: 'Angular', files: ['package.json', 'angular.json'], patterns: ['"@angular/', 'ng '] },
      { name: 'TypeScript', files: ['tsconfig.json'], patterns: ['.ts', '.tsx'] },
      { name: 'Webpack', files: ['webpack.config.js'], patterns: ['webpack'] },
      { name: 'Vite', files: ['vite.config.js', 'vite.config.ts'], patterns: ['vite'] }
    ];

    signatures.forEach(sig => {
      this.technologySignatures.set(sig.name, sig as TechnologySignature);
    });

    console.log(`Initialized ${signatures.length} technology signatures`);
  }

  private initializeFrameworkDetectors(): void {
    // Initialize framework-specific detectors
    const detectors = [
      { name: 'React', detector: this.detectReact.bind(this) },
      { name: 'Vue', detector: this.detectVue.bind(this) },
      { name: 'Angular', detector: this.detectAngular.bind(this) },
      { name: 'Express', detector: this.detectExpress.bind(this) },
      { name: 'Next.js', detector: this.detectNextJs.bind(this) }
    ];

    detectors.forEach(det => {
      this.frameworkDetectors.set(det.name, det as FrameworkDetector);
    });

    console.log(`Initialized ${detectors.length} framework detectors`);
  }

  private detectReact(fileAnalysis: FileAnalysisResult): boolean {
    return fileAnalysis.configFiles.some(f => f.content.includes('"react":')) ||
      fileAnalysis.sourceFiles.some(f => f.framework === 'react');
  }

  private detectVue(fileAnalysis: FileAnalysisResult): boolean {
    return fileAnalysis.configFiles.some(f => f.content.includes('"vue":')) ||
      fileAnalysis.sourceFiles.some(f => f.path.endsWith('.vue'));
  }

  private detectAngular(fileAnalysis: FileAnalysisResult): boolean {
    return fileAnalysis.configFiles.some(f => f.name === 'angular.json') ||
      fileAnalysis.configFiles.some(f => f.content.includes('"@angular/'));
  }

  private detectExpress(fileAnalysis: FileAnalysisResult): boolean {
    return fileAnalysis.configFiles.some(f => f.content.includes('"express":'));
  }

  private detectNextJs(fileAnalysis: FileAnalysisResult): boolean {
    return fileAnalysis.configFiles.some(f => f.content.includes('"next":')) ||
      fileAnalysis.configFiles.some(f => f.name === 'next.config.js');
  }

  /**
   * Get detection statistics
   */
  getDetectionStats(): any {
    return {
      cachedDetections: this.detectionCache.size,
      technologySignatures: this.technologySignatures.size,
      frameworkDetectors: this.frameworkDetectors.size,
      supportedProjectTypes: [
        'web-application', 'mobile-application', 'desktop-application',
        'library', 'framework', 'api-service', 'microservice',
        'cli-tool', 'game', 'data-science', 'machine-learning'
      ],
      supportedArchitectures: [
        'monolithic', 'microservices', 'serverless', 'jamstack',
        'mvc', 'component-based', 'layered', 'event-driven'
      ]
    };
  }

  /**
   * Clear detection cache
   */
  clearCache(): void {
    this.detectionCache.clear();
    console.log('Project detection cache cleared');
  }
}

// Helper interfaces
interface FileAnalysisResult {
  configFiles: ConfigFile[];
  sourceFiles: SourceFile[];
  directoryStructure: DirectoryInfo[];
  buildFiles: BuildFile[];
  testFiles: TestFile[];
  documentationFiles: DocumentationFile[];
}

interface ConfigFile {
  name: string;
  type: string;
  content: string;
}

interface SourceFile {
  path: string;
  language: string;
  framework: string | null;
}

interface DirectoryInfo {
  name: string;
  purpose: string;
  depth: number;
}

interface BuildFile {
  name: string;
  tool: string;
}

interface TestFile {
  name: string;
  framework: string;
}

interface DocumentationFile {
  name: string;
  type: string;
}

interface TechnologySignature {
  name: string;
  files: string[];
  patterns: string[];
}

interface FrameworkDetector {
  name: string;
  detector: (fileAnalysis: FileAnalysisResult) => boolean;
}

export interface DetectionOptions {
  forceRefresh?: boolean;
  cacheTimeout?: number;
  includeDevDependencies?: boolean;
  analyzeArchitecture?: boolean;
  assessMaturity?: boolean;
  generateRecommendations?: boolean;
}

export default ProjectDetector;