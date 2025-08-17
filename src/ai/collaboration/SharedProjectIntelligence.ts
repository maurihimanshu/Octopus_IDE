import { EventEmitter } from 'events';

/**
* Shared Project Intelligence with Team Insights
*
* Advanced intelligence system that aggregates, analyzes, and shares project
* knowledge across teams, providing AI-powered insights, predictions, and
* recommendations for enhanced collaborative development.
*/

// Core Intelligence Interfaces
interface ProjectIntelligence {
  intelligenceId: string;
  projectId: string;
  teamIds: string[];
  knowledgeGraph: ProjectKnowledgeGraph;
  insights: ProjectInsight[];
  predictions: ProjectPrediction[];
  recommendations: ProjectRecommendation[];
  metrics: ProjectMetrics;
  healthScore: ProjectHealthScore;
  riskAssessment: ProjectRiskAssessment;
  opportunities: ProjectOpportunity[];
  collaborationPatterns: CollaborationPattern[];
  learningOutcomes: LearningOutcome[];
  benchmarks: ProjectBenchmark[];
  trends: ProjectTrend[];
  lastUpdated: Date;
  version: number;
}

interface ProjectKnowledgeGraph {
  graphId: string;
  entities: KnowledgeEntity[];
  relationships: KnowledgeRelationship[];
  contexts: KnowledgeContext[];
  patterns: KnowledgePattern[];
  dependencies: ProjectDependency[];
  architecture: ArchitectureKnowledge;
  documentation: DocumentationKnowledge;
  codebase: CodebaseKnowledge;
  teamKnowledge: TeamKnowledge[];
  externalKnowledge: ExternalKnowledge[];
  confidenceScores: ConfidenceScore[];
}

interface ProjectInsight {
  insightId: string;
  type: 'technical' | 'team' | 'process' | 'quality' | 'performance' | 'risk' | 'opportunity';
  category: InsightCategory;
  title: string;
  description: string;
  evidence: Evidence[];
  confidence: number;
  impact: InsightImpact;
  urgency: 'low' | 'medium' | 'high' | 'critical';
  actionable: boolean;
  recommendations: string[];
  affectedTeams: string[];
  relatedInsights: string[];
  source: InsightSource;
  generatedAt: Date;
  expiresAt?: Date;
}

interface ProjectPrediction {
  predictionId: string;
  type: 'timeline' | 'quality' | 'risk' | 'performance' | 'team' | 'resource';
  horizon: 'short' | 'medium' | 'long';
  prediction: string;
  probability: number;
  confidence: number;
  factors: PredictionFactor[];
  scenarios: PredictionScenario[];
  implications: string[];
  mitigations: string[];
  monitoringPoints: MonitoringPoint[];
  lastUpdated: Date;
  accuracy: number;
}

interface ProjectRecommendation {
  recommendationId: string;
  type: 'process' | 'technical' | 'team' | 'tool' | 'training' | 'architecture';
  priority: 'low' | 'medium' | 'high' | 'critical';
  title: string;
  description: string;
  rationale: string;
  benefits: string[];
  effort: EffortEstimate;
  timeline: TimelineEstimate;
  resources: ResourceRequirement[];
  risks: string[];
  alternatives: Alternative[];
  successMetrics: SuccessMetric[];
  dependencies: string[];
  stakeholders: string[];
  approvalRequired: boolean;
}

interface TeamInsight {
  insightId: string;
  teamId: string;
  category: 'productivity' | 'collaboration' | 'skills' | 'wellness' | 'communication' | 'innovation';
  insight: string;
  metrics: TeamMetrics;
  trends: TeamTrend[];
  comparisons: TeamComparison[];
  recommendations: TeamRecommendation[];
  interventions: TeamIntervention[];
  learningOpportunities: LearningOpportunity[];
  generatedAt: Date;
}

// Shared Project Intelligence Engine
export class SharedProjectIntelligence extends EventEmitter {
  private projectIntelligence: Map<string, ProjectIntelligence> = new Map();
  private knowledgeGraphs: Map<string, ProjectKnowledgeGraph> = new Map();
  private aiOrchestrator: any;
  private knowledgeExtractor: KnowledgeExtractor;
  private insightGenerator: InsightGenerator;
  private predictionEngine: PredictionEngine;
  private recommendationEngine: RecommendationEngine;
  private collaborationAnalyzer: CollaborationAnalyzer;
  private learningEngine: LearningEngine;
  private benchmarkingService: BenchmarkingService;

  constructor() {
    super();
    this.knowledgeExtractor = new KnowledgeExtractor();
    this.insightGenerator = new InsightGenerator();
    this.predictionEngine = new PredictionEngine();
    this.recommendationEngine = new RecommendationEngine();
    this.collaborationAnalyzer = new CollaborationAnalyzer();
    this.learningEngine = new LearningEngine();
    this.benchmarkingService = new BenchmarkingService();
    this.initializeIntelligenceSystem();
  }

  /**
   * Initialize project intelligence system
   */
  async initializeProjectIntelligence(request: InitializeIntelligenceRequest): Promise<ProjectIntelligence> {
    const intelligenceId = this.generateIntelligenceId();

    // Build initial knowledge graph
    const knowledgeGraph = await this.buildProjectKnowledgeGraph(request);
    this.knowledgeGraphs.set(request.projectId, knowledgeGraph);

    const intelligence: ProjectIntelligence = {
      intelligenceId,
      projectId: request.projectId,
      teamIds: request.teamIds,
      knowledgeGraph,
      insights: [],
      predictions: [],
      recommendations: [],
      metrics: await this.initializeProjectMetrics(request.projectId),
      healthScore: await this.calculateInitialHealthScore(request.projectId),
      riskAssessment: await this.performInitialRiskAssessment(request.projectId),
      opportunities: [],
      collaborationPatterns: [],
      learningOutcomes: [],
      benchmarks: [],
      trends: [],
      lastUpdated: new Date(),
      version: 1
    };

    this.projectIntelligence.set(request.projectId, intelligence);

    // Start continuous intelligence gathering
    await this.startContinuousIntelligence(request.projectId);

    // Initialize team-specific insights
    await this.initializeTeamInsights(request.projectId, request.teamIds);

    this.emit('projectIntelligenceInitialized', { projectId: request.projectId, intelligence });
    return intelligence;
  }

  /**
   * Build comprehensive project knowledge graph
   */
  async buildProjectKnowledgeGraph(request: InitializeIntelligenceRequest): Promise<ProjectKnowledgeGraph> {
    // Extract knowledge from multiple sources
    const sources = await this.identifyKnowledgeSources(request.projectId);

    const knowledgeGraph: ProjectKnowledgeGraph = {
      graphId: this.generateGraphId(),
      entities: [],
      relationships: [],
      contexts: [],
      patterns: [],
      dependencies: [],
      architecture: await this.extractArchitectureKnowledge(request.projectId),
      documentation: await this.extractDocumentationKnowledge(request.projectId),
      codebase: await this.extractCodebaseKnowledge(request.projectId),
      teamKnowledge: await this.extractTeamKnowledge(request.teamIds),
      externalKnowledge: [],
      confidenceScores: []
    };

    // AI-powered knowledge extraction and relationship building
    for (const source of sources) {
      const extractedKnowledge = await this.knowledgeExtractor.extractFromSource(source);

      // Add entities
      knowledgeGraph.entities.push(...extractedKnowledge.entities);

      // Add relationships
      knowledgeGraph.relationships.push(...extractedKnowledge.relationships);

      // Add patterns
      knowledgeGraph.patterns.push(...extractedKnowledge.patterns);
    }

    // Build intelligent relationships
    const intelligentRelationships = await this.buildIntelligentRelationships(knowledgeGraph);
    knowledgeGraph.relationships.push(...intelligentRelationships);

    // Calculate confidence scores
    knowledgeGraph.confidenceScores = await this.calculateConfidenceScores(knowledgeGraph);

    return knowledgeGraph;
  }

  /**
   * Generate project insights using AI analysis
   */
  async generateProjectInsights(projectId: string): Promise<ProjectInsight[]> {
    const intelligence = this.projectIntelligence.get(projectId);
    if (!intelligence) {
      throw new Error(`Project intelligence for ${projectId} not found`);
    }

    const insights: ProjectInsight[] = [];

    // Technical insights
    const technicalInsights = await this.generateTechnicalInsights(projectId);
    insights.push(...technicalInsights);

    // Team insights
    const teamInsights = await this.generateTeamInsights(projectId);
    insights.push(...teamInsights);

    // Process insights
    const processInsights = await this.generateProcessInsights(projectId);
    insights.push(...processInsights);

    // Quality insights
    const qualityInsights = await this.generateQualityInsights(projectId);
    insights.push(...qualityInsights);

    // Performance insights
    const performanceInsights = await this.generatePerformanceInsights(projectId);
    insights.push(...performanceInsights);

    // Risk insights
    const riskInsights = await this.generateRiskInsights(projectId);
    insights.push(...riskInsights);

    // Opportunity insights
    const opportunityInsights = await this.generateOpportunityInsights(projectId);
    insights.push(...opportunityInsights);

    // Update intelligence
    intelligence.insights = insights;
    intelligence.lastUpdated = new Date();
    intelligence.version++;

    // Prioritize and rank insights
    const prioritizedInsights = await this.prioritizeInsights(insights, intelligence);

    this.emit('projectInsightsGenerated', { projectId, insights: prioritizedInsights });
    return prioritizedInsights;
  }

  /**
   * Generate AI-powered project predictions
   */
  async generateProjectPredictions(projectId: string): Promise<ProjectPrediction[]> {
    const intelligence = this.projectIntelligence.get(projectId);
    if (!intelligence) {
      throw new Error(`Project intelligence for ${projectId} not found`);
    }

    const predictions = await this.predictionEngine.generatePredictions({
      knowledgeGraph: intelligence.knowledgeGraph,
      historicalData: await this.getHistoricalData(projectId),
      currentMetrics: intelligence.metrics,
      teamDynamics: await this.getTeamDynamics(projectId),
      externalFactors: await this.getExternalFactors(projectId),
      industryBenchmarks: await this.getIndustryBenchmarks(projectId)
    });

    // Validate and calibrate predictions
    const calibratedPredictions = await this.calibratePredictions(predictions, projectId);

    // Update intelligence
    intelligence.predictions = calibratedPredictions;
    intelligence.lastUpdated = new Date();

    this.emit('projectPredictionsGenerated', { projectId, predictions: calibratedPredictions });
    return calibratedPredictions;
  }

  /**
   * Generate intelligent project recommendations
   */
  async generateProjectRecommendations(projectId: string): Promise<ProjectRecommendation[]> {
    const intelligence = this.projectIntelligence.get(projectId);
    if (!intelligence) {
      throw new Error(`Project intelligence for ${projectId} not found`);
    }

    const recommendations = await this.recommendationEngine.generateRecommendations({
      insights: intelligence.insights,
      predictions: intelligence.predictions,
      currentState: {
        metrics: intelligence.metrics,
        healthScore: intelligence.healthScore,
        riskAssessment: intelligence.riskAssessment
      },
      constraints: await this.getProjectConstraints(projectId),
      objectives: await this.getProjectObjectives(projectId),
      teamCapabilities: await this.getTeamCapabilities(projectId)
    });

    // Validate and prioritize recommendations
    const prioritizedRecommendations = await this.prioritizeRecommendations(
      recommendations,
      intelligence
    );

    // Update intelligence
    intelligence.recommendations = prioritizedRecommendations;
    intelligence.lastUpdated = new Date();

    this.emit('projectRecommendationsGenerated', { projectId, recommendations: prioritizedRecommendations });
    return prioritizedRecommendations;
  }

  /**
   * Analyze team collaboration patterns
   */
  async analyzeCollaborationPatterns(projectId: string): Promise<CollaborationPattern[]> {
    const intelligence = this.projectIntelligence.get(projectId);
    if (!intelligence) {
      throw new Error(`Project intelligence for ${projectId} not found`);
    }

    const patterns = await this.collaborationAnalyzer.analyzePatterns({
      projectId,
      teamIds: intelligence.teamIds,
      timeWindow: '30d',
      includeAI: true,
      analysisDepth: 'comprehensive'
    });

    // AI-powered pattern enhancement
    const enhancedPatterns = await this.enhanceCollaborationPatterns(patterns, intelligence);

    // Update intelligence
    intelligence.collaborationPatterns = enhancedPatterns;
    intelligence.lastUpdated = new Date();

    this.emit('collaborationPatternsAnalyzed', { projectId, patterns: enhancedPatterns });
    return enhancedPatterns;
  }

  /**
   * Generate team-specific insights
   */
  async generateTeamSpecificInsights(projectId: string, teamId: string): Promise<TeamInsight[]> {
    const intelligence = this.projectIntelligence.get(projectId);
    if (!intelligence) {
      throw new Error(`Project intelligence for ${projectId} not found`);
    }

    const teamInsights = await this.insightGenerator.generateTeamInsights({
      teamId,
      projectContext: intelligence.knowledgeGraph,
      teamData: await this.getTeamData(teamId),
      collaborationData: await this.getTeamCollaborationData(teamId),
      performanceData: await this.getTeamPerformanceData(teamId),
      benchmarks: await this.getTeamBenchmarks(teamId)
    });

    this.emit('teamInsightsGenerated', { projectId, teamId, insights: teamInsights });
    return teamInsights;
  }

  /**
   * Perform comprehensive project health assessment
   */
  async assessProjectHealth(projectId: string): Promise<ProjectHealthScore> {
    const intelligence = this.projectIntelligence.get(projectId);
    if (!intelligence) {
      throw new Error(`Project intelligence for ${projectId} not found`);
    }

    const healthAssessment = await this.aiOrchestrator.assessProjectHealth({
      knowledgeGraph: intelligence.knowledgeGraph,
      metrics: intelligence.metrics,
      insights: intelligence.insights,
      collaborationPatterns: intelligence.collaborationPatterns,
      teamHealth: await this.getTeamHealthScores(intelligence.teamIds),
      codebaseHealth: await this.getCodebaseHealth(projectId),
      processHealth: await this.getProcessHealth(projectId)
    });

    const healthScore: ProjectHealthScore = {
      overall: healthAssessment.overallScore,
      dimensions: {
        technical: healthAssessment.technical,
        team: healthAssessment.team,
        process: healthAssessment.process,
        quality: healthAssessment.quality,
        performance: healthAssessment.performance,
        innovation: healthAssessment.innovation
      },
      trends: healthAssessment.trends,
      riskFactors: healthAssessment.riskFactors,
      strengths: healthAssessment.strengths,
      weaknesses: healthAssessment.weaknesses,
      recommendations: healthAssessment.recommendations,
      lastAssessed: new Date()
    };

    // Update intelligence
    intelligence.healthScore = healthScore;
    intelligence.lastUpdated = new Date();

    this.emit('projectHealthAssessed', { projectId, healthScore });
    return healthScore;
  }

  /**
   * Share intelligence across teams
   */
  async shareIntelligenceAcrossTeams(projectId: string): Promise<IntelligenceSharing> {
    const intelligence = this.projectIntelligence.get(projectId);
    if (!intelligence) {
      throw new Error(`Project intelligence for ${projectId} not found`);
    }

    const sharingResult: IntelligenceSharing = {
      projectId,
      sharedAt: new Date(),
      recipients: intelligence.teamIds,
      sharedContent: {
        insights: intelligence.insights,
        recommendations: intelligence.recommendations.filter(r => r.priority === 'high' || r.priority === 'critical'),
        predictions: intelligence.predictions.filter(p => p.horizon === 'short'),
        healthScore: intelligence.healthScore,
        opportunities: intelligence.opportunities
      },
      customizations: []
    };

    // Customize content for each team
    for (const teamId of intelligence.teamIds) {
      const customizedContent = await this.customizeContentForTeam(
        sharingResult.sharedContent,
        teamId,
        intelligence
      );

      sharingResult.customizations.push({
        teamId,
        content: customizedContent,
        deliveryMethod: await this.getTeamDeliveryPreference(teamId),
        priority: await this.calculateTeamPriority(teamId, customizedContent)
      });

      // Deliver to team
      await this.deliverIntelligenceToTeam(teamId, customizedContent);
    }

    this.emit('intelligenceShared', { projectId, sharing: sharingResult });
    return sharingResult;
  }

  /**
   * Generate learning outcomes and knowledge transfer
   */
  async generateLearningOutcomes(projectId: string): Promise<LearningOutcome[]> {
    const intelligence = this.projectIntelligence.get(projectId);
    if (!intelligence) {
      throw new Error(`Project intelligence for ${projectId} not found`);
    }

    const learningOutcomes = await this.learningEngine.generateOutcomes({
      projectData: intelligence,
      teamInteractions: await this.getTeamInteractions(projectId),
      problemSolutions: await this.getProblemSolutions(projectId),
      innovations: await this.getProjectInnovations(projectId),
      failures: await this.getProjectFailures(projectId),
      successes: await this.getProjectSuccesses(projectId)
    });

    // Validate and enrich learning outcomes
    const enrichedOutcomes = await this.enrichLearningOutcomes(learningOutcomes, intelligence);

    // Update intelligence
    intelligence.learningOutcomes = enrichedOutcomes;
    intelligence.lastUpdated = new Date();

    // Share with relevant teams and projects
    await this.shareLearningOutcomes(projectId, enrichedOutcomes);

    this.emit('learningOutcomesGenerated', { projectId, outcomes: enrichedOutcomes });
    return enrichedOutcomes;
  }

  /**
   * Export project intelligence for analysis or transfer
   */
  async exportProjectIntelligence(projectId: string): Promise<IntelligenceExport> {
    const intelligence = this.projectIntelligence.get(projectId);
    if (!intelligence) {
      throw new Error(`Project intelligence for ${projectId} not found`);
    }

    const exportData: IntelligenceExport = {
      exportId: this.generateExportId(),
      projectId,
      intelligence: this.sanitizeIntelligenceForExport(intelligence),
      knowledgeGraph: this.sanitizeKnowledgeGraphForExport(intelligence.knowledgeGraph),
      analytics: await this.generateAnalyticsExport(projectId),
      metadata: {
        exportedAt: new Date(),
        version: intelligence.version,
        format: 'json',
        compression: 'gzip',
        security: 'encrypted'
      },
      integrity: await this.generateIntegrityHash(intelligence)
    };

    this.emit('intelligenceExported', { projectId, exportId: exportData.exportId });
    return exportData;
  }

  // Private helper methods
  private async generateTechnicalInsights(projectId: string): Promise<ProjectInsight[]> {
    const insights: ProjectInsight[] = [];

    // Code quality insights
    const codeQualityInsights = await this.analyzeCodeQuality(projectId);
    insights.push(...codeQualityInsights);

    // Architecture insights
    const architectureInsights = await this.analyzeArchitecture(projectId);
    insights.push(...architectureInsights);

    // Performance insights
    const performanceInsights = await this.analyzePerformance(projectId);
    insights.push(...performanceInsights);

    // Security insights
    const securityInsights = await this.analyzeSecurity(projectId);
    insights.push(...securityInsights);

    return insights;
  }

  private async startContinuousIntelligence(projectId: string): Promise<void> {
    // Set up continuous intelligence gathering
    setInterval(async () => {
      try {
        await this.updateProjectIntelligence(projectId);
      } catch (error) {
        this.emit('intelligenceUpdateError', { projectId, error });
      }
    }, 60 * 60 * 1000); // Hourly updates
  }

  private async updateProjectIntelligence(projectId: string): Promise<void> {
    // Incremental intelligence updates
    await this.generateProjectInsights(projectId);
    await this.generateProjectPredictions(projectId);
    await this.generateProjectRecommendations(projectId);
    await this.analyzeCollaborationPatterns(projectId);
    await this.assessProjectHealth(projectId);
  }

  private initializeIntelligenceSystem(): void {
    // Initialize AI models for intelligence generation
    // Set up knowledge extraction pipelines
    // Configure prediction engines
    // Initialize recommendation systems
  }

  private generateIntelligenceId(): string {
    return `intel_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private generateGraphId(): string {
    return `graph_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private generateExportId(): string {
    return `export_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
}

// Supporting Classes
class KnowledgeExtractor {
  async extractFromSource(source: any): Promise<any> {
    // Extract knowledge from various sources
    return {
      entities: [],
      relationships: [],
      patterns: []
    };
  }
}

class InsightGenerator {
  async generateTeamInsights(params: any): Promise<TeamInsight[]> {
    // Generate AI-powered team insights
    return [];
  }
}

class PredictionEngine {
  async generatePredictions(params: any): Promise<ProjectPrediction[]> {
    // Generate AI-powered predictions
    return [];
  }
}

class RecommendationEngine {
  async generateRecommendations(params: any): Promise<ProjectRecommendation[]> {
    // Generate intelligent recommendations
    return [];
  }
}

class CollaborationAnalyzer {
  async analyzePatterns(params: any): Promise<CollaborationPattern[]> {
    // Analyze collaboration patterns
    return [];
  }
}

class LearningEngine {
  async generateOutcomes(params: any): Promise<LearningOutcome[]> {
    // Generate learning outcomes
    return [];
  }
}

class BenchmarkingService {
  async getBenchmarks(projectId: string): Promise<ProjectBenchmark[]> {
    // Get industry and project benchmarks
    return [];
  }
}

// Additional interfaces and types
interface InitializeIntelligenceRequest {
  projectId: string;
  teamIds: string[];
  analysisDepth: 'basic' | 'standard' | 'comprehensive' | 'deep';
  includePredictions: boolean;
  includeRecommendations: boolean;
  customConfiguration?: any;
}

interface KnowledgeEntity {
  entityId: string;
  type: string;
  name: string;
  description: string;
  attributes: any;
  confidence: number;
  source: string;
  lastUpdated: Date;
}

interface KnowledgeRelationship {
  relationshipId: string;
  sourceEntityId: string;
  targetEntityId: string;
  type: string;
  strength: number;
  confidence: number;
  metadata: any;
}

interface KnowledgeContext {
  contextId: string;
  name: string;
  description: string;
  entities: string[];
  relevance: number;
  temporal: boolean;
}

interface KnowledgePattern {
  patternId: string;
  type: string;
  description: string;
  occurrences: number;
  confidence: number;
  implications: string[];
}

interface ProjectDependency {
  dependencyId: string;
  type: 'technical' | 'team' | 'process' | 'external';
  source: string;
  target: string;
  strength: number;
  criticality: 'low' | 'medium' | 'high' | 'critical';
}

interface ArchitectureKnowledge {
  components: any[];
  patterns: string[];
  decisions: any[];
  constraints: string[];
  quality: number;
}

interface DocumentationKnowledge {
  coverage: number;
  quality: number;
  gaps: string[];
  outdated: string[];
  recommendations: string[];
}

interface CodebaseKnowledge {
  complexity: any;
  quality: any;
  patterns: string[];
  smells: string[];
  hotspots: any[];
}

interface TeamKnowledge {
  teamId: string;
  expertise: string[];
  experience: any;
  collaboration: any;
  productivity: any;
}

interface ExternalKnowledge {
  source: string;
  type: string;
  relevance: number;
  content: any;
  lastUpdated: Date;
}

interface ConfidenceScore {
  entityId: string;
  score: number;
  factors: any[];
  lastCalculated: Date;
}

interface InsightCategory {
  primary: string;
  secondary: string[];
  tags: string[];
}

interface Evidence {
  type: string;
  description: string;
  source: string;
  strength: number;
  data: any;
}

interface InsightImpact {
  scope: 'file' | 'module' | 'team' | 'project' | 'organization';
  severity: 'low' | 'medium' | 'high' | 'critical';
  timeline: 'immediate' | 'short' | 'medium' | 'long';
  effort: 'low' | 'medium' | 'high';
}

interface InsightSource {
  type: 'ai' | 'human' | 'automated' | 'hybrid';
  model?: string;
  confidence: number;
  timestamp: Date;
}

interface PredictionFactor {
  factor: string;
  weight: number;
  trend: string;
  confidence: number;
}

interface PredictionScenario {
  scenario: string;
  probability: number;
  outcome: string;
  implications: string[];
}

interface MonitoringPoint {
  metric: string;
  threshold: number;
  condition: string;
  action: string;
}

interface EffortEstimate {
  hours: number;
  complexity: 'low' | 'medium' | 'high';
  skills: string[];
  confidence: number;
}

interface TimelineEstimate {
  duration: number;
  milestones: any[];
  dependencies: string[];
  risks: string[];
}

interface ResourceRequirement {
  type: 'human' | 'technical' | 'financial';
  description: string;
  quantity: number;
  duration: number;
}

interface Alternative {
  description: string;
  pros: string[];
  cons: string[];
  effort: EffortEstimate;
  risk: string;
}

interface SuccessMetric {
  metric: string;
  target: any;
  measurement: string;
  timeline: number;
}

interface TeamMetrics {
  productivity: number;
  collaboration: number;
  satisfaction: number;
  velocity: number;
  quality: number;
}

interface TeamTrend {
  metric: string;
  direction: 'up' | 'down' | 'stable';
  rate: number;
  significance: number;
}

interface TeamComparison {
  comparedTo: string;
  metrics: any;
  insights: string[];
  position: string;
}

interface TeamRecommendation {
  type: string;
  description: string;
  priority: string;
  effort: string;
  impact: string;
}

interface TeamIntervention {
  type: string;
  trigger: string;
  action: string;
  timeline: number;
  success: any;
}

interface LearningOpportunity {
  type: string;
  description: string;
  skills: string[];
  effort: string;
  benefit: string;
}

interface ProjectMetrics {
  performance: any;
  quality: any;
  team: any;
  process: any;
  business: any;
}

interface ProjectHealthScore {
  overall: number;
  dimensions: {
    technical: number;
    team: number;
    process: number;
    quality: number;
    performance: number;
    innovation: number;
  };
  trends: any[];
  riskFactors: string[];
  strengths: string[];
  weaknesses: string[];
  recommendations: string[];
  lastAssessed: Date;
}

interface ProjectRiskAssessment {
  overallRisk: 'low' | 'medium' | 'high' | 'critical';
  risks: any[];
  mitigations: any[];
  monitoring: any[];
  lastAssessed: Date;
}

interface ProjectOpportunity {
  opportunityId: string;
  type: string;
  description: string;
  potential: string;
  effort: string;
  timeline: number;
  stakeholders: string[];
}

interface CollaborationPattern {
  patternId: string;
  type: string;
  description: string;
  frequency: number;
  effectiveness: number;
  participants: string[];
  outcomes: string[];
}

interface LearningOutcome {
  outcomeId: string;
  type: string;
  description: string;
  domain: string;
  impact: string;
  transferability: number;
  evidence: any[];
}

interface ProjectBenchmark {
  metric: string;
  value: number;
  percentile: number;
  industry: string;
  comparison: string;
}

interface ProjectTrend {
  metric: string;
  direction: string;
  rate: number;
  duration: number;
  prediction: string;
}

interface IntelligenceSharing {
  projectId: string;
  sharedAt: Date;
  recipients: string[];
  sharedContent: any;
  customizations: any[];
}

interface IntelligenceExport {
  exportId: string;
  projectId: string;
  intelligence: any;
  knowledgeGraph: any;
  analytics: any;
  metadata: any;
  integrity: string;
}

export default SharedProjectIntelligence;