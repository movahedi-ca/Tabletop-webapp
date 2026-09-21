export enum IncidentSeverity {
  CRITICAL = 'CRITICAL',
  HIGH = 'HIGH',
  MEDIUM = 'MEDIUM',
  LOW = 'LOW',
  CATASTROPHIC = 'CATASTROPHIC',
  DEFCON_1_CRITICAL = 'DEFCON_1_CRITICAL',
  DEFCON_2_SEVERE = 'DEFCON_2_SEVERE',
  DEFCON_3_ELEVATED = 'DEFCON_3_ELEVATED',
  DEFCON_4_GUARDED = 'DEFCON_4_GUARDED',
}

export enum LegalRiskLevel {
  MINIMAL = 'MINIMAL',
  LOW = 'LOW',
  MODERATE = 'MODERATE',
  ELEVATED = 'ELEVATED',
  HIGH = 'HIGH',
  SEVERE = 'SEVERE',
  CRITICAL = 'CRITICAL',
  REGULATORY_ENFORCEMENT = 'REGULATORY_ENFORCEMENT',
}

export const LEGAL_RISK_LABELS: Record<string, string> = {
  MINIMAL: 'Low / Defensible',
  LOW: 'Low Exposure',
  MODERATE: 'Moderate Risk',
  ELEVATED: 'Elevated Exposure',
  HIGH: 'High Exposure',
  SEVERE: 'Severe Liability',
  CRITICAL: 'Critical Liability',
  REGULATORY_ENFORCEMENT: 'Regulatory Enforcement',
};

export enum ForensicIntegrity {
  INTACT = 'INTACT',
  PARTIALLY_COMPROMISED = 'PARTIALLY_COMPROMISED',
  TAINTED = 'TAINTED',
  DEGRADED = 'DEGRADED',
  COMPROMISED = 'COMPROMISED',
  DESTROYED = 'DESTROYED',
}

export const FORENSIC_INTEGRITY_LABELS: Record<string, string> = {
  INTACT: 'Intact & Admissible',
  PARTIALLY_COMPROMISED: 'Partially Compromised',
  TAINTED: 'Tainted Chain-of-Custody',
  DEGRADED: 'Degraded Artifacts',
  COMPROMISED: 'Compromised',
  DESTROYED: 'Severely Destroyed',
};

export enum ScenarioCategory {
  RANSOMWARE = 'RANSOMWARE',
  SUPPLY_CHAIN = 'SUPPLY_CHAIN',
  INSIDER_THREAT = 'INSIDER_THREAT',
  CLOUD_EXPOSURE = 'CLOUD_EXPOSURE',
  DATA_LEAK = 'DATA_LEAK',
  EXECUTIVE_THEFT = 'EXECUTIVE_THEFT',
  CLOUD_EXFILTRATION = 'CLOUD_EXFILTRATION',
  ZERO_DAY = 'ZERO_DAY',
  NATION_STATE = 'NATION_STATE',
  AI_MODEL_THEFT = 'AI_MODEL_THEFT',
}

export const SCENARIO_CATEGORY_LABELS: Record<string, string> = {
  [ScenarioCategory.RANSOMWARE]: 'Ransomware & Extortion',
  [ScenarioCategory.SUPPLY_CHAIN]: 'Supply Chain Breach',
  [ScenarioCategory.INSIDER_THREAT]: 'Malicious Insider',
  [ScenarioCategory.CLOUD_EXPOSURE]: 'Cloud Bucket Exposure',
  [ScenarioCategory.DATA_LEAK]: 'Data Exfiltration',
  [ScenarioCategory.EXECUTIVE_THEFT]: 'Executive Phishing & BEC',
  [ScenarioCategory.CLOUD_EXFILTRATION]: 'Cloud Data Exfiltration',
  [ScenarioCategory.ZERO_DAY]: 'Critical Zero-Day',
  [ScenarioCategory.NATION_STATE]: 'Nation-State APT',
  [ScenarioCategory.AI_MODEL_THEFT]: 'AI Weights Exfiltration',
};

export enum Competency {
  DETECTION_TRIAGE = 'DETECTION_TRIAGE',
  CONTAINMENT_SPEED = 'CONTAINMENT_SPEED',
  LEGAL_COMPLIANCE = 'LEGAL_COMPLIANCE',
  CRISIS_COMMS = 'CRISIS_COMMS',
  BUSINESS_RESILIENCE = 'BUSINESS_RESILIENCE',
  EXECUTIVE_COMMAND = 'EXECUTIVE_COMMAND',
  EXECUTIVE_CRISIS_LEADERSHIP = 'EXECUTIVE_CRISIS_LEADERSHIP',
  REGULATORY_COMPLIANCE = 'REGULATORY_COMPLIANCE',
  FORENSIC_TRIAGE = 'FORENSIC_TRIAGE',
  FORENSIC_PRESERVATION = 'FORENSIC_PRESERVATION',
  PUBLIC_COMMUNICATIONS = 'PUBLIC_COMMUNICATIONS',
  TECHNICAL_CONTAINMENT = 'TECHNICAL_CONTAINMENT',
}

export const COMPETENCY_LABELS: Record<string, string> = {
  [Competency.DETECTION_TRIAGE]: 'Detection & Initial Triage',
  [Competency.CONTAINMENT_SPEED]: 'Containment Strategy & Speed',
  [Competency.LEGAL_COMPLIANCE]: 'Statutory Legal & Regulatory Compliance',
  [Competency.CRISIS_COMMS]: 'Public Relations & Stakeholder Comms',
  [Competency.BUSINESS_RESILIENCE]: 'Business Continuity & Operations',
  [Competency.EXECUTIVE_COMMAND]: 'Executive Crisis Command',
  [Competency.EXECUTIVE_CRISIS_LEADERSHIP]: 'Executive Crisis Leadership',
  [Competency.REGULATORY_COMPLIANCE]: 'Regulatory Disclosure & Compliance',
  [Competency.FORENSIC_TRIAGE]: 'Digital Forensics & Chain-of-Custody',
  [Competency.FORENSIC_PRESERVATION]: 'Forensic Evidence Preservation',
  [Competency.PUBLIC_COMMUNICATIONS]: 'Public Relations & Customer Trust',
  [Competency.TECHNICAL_CONTAINMENT]: 'Technical Isolation & Containment',
};

export enum Screen {
  HOME = 'HOME',
  SCENARIO_DETAIL = 'SCENARIO_DETAIL',
  SIMULATION = 'SIMULATION',
  AAR_REPORT = 'AAR_REPORT',
  DOCTRINE_LIST = 'DOCTRINE_LIST',
  DOCTRINE_DETAIL = 'DOCTRINE_DETAIL',
  HISTORY_LOGS = 'HISTORY_LOGS',
  ADVISORY = 'ADVISORY',
}

export interface LiveMetrics {
  financialCostUsd: number;
  timeElapsedHours: number;
  publicTrustPercent: number;
  legalRisk: LegalRiskLevel;
  forensicIntegrity: ForensicIntegrity;
}

export interface DecisionMetricDelta {
  costDeltaUsd: number;
  timeDeltaHours: number;
  trustDeltaPercent: number;
  legalRiskResult?: LegalRiskLevel;
  forensicResult?: ForensicIntegrity;
}

export interface DecisionChoice {
  id: string;
  title: string;
  shortAction?: string;
  description: string;
  fullDescription?: string;
  recommendedBy?: string;
  doctrineReference?: string;
  competencyTested?: Competency;
  competencyScoreDelta?: number;
  costDeltaUsd: number;
  timeDeltaHours: number;
  trustDeltaPercent: number;
  legalRiskChange?: number;
  legalRiskResult?: LegalRiskLevel;
  forensicsImpact?: ForensicIntegrity;
  forensicResult?: ForensicIntegrity;
  feedbackDoctrine?: string;
  metricDelta?: DecisionMetricDelta;
  strategicPros?: string[];
  strategicCons?: string[];
  expertGuidance?: string;
  competencyScores?: Partial<Record<Competency, number>>;
  statementType?: 'LAW' | 'REGULATORY_GUIDANCE' | 'BEST_PRACTICE' | 'SCENARIO_ASSUMPTION';
  uncertaintyLevel?: 'CONFIRMED' | 'PROBABLE' | 'UNCERTAIN' | 'CONFLICTING' | 'UNKNOWN';
}

export interface PhaseDilemma {
  question: string;
  operationalContext?: string;
  contextNotes?: string;
  choices: DecisionChoice[];
}

export interface BreakingInject {
  title: string;
  source: string;
  message?: string;
  details?: string;
  alertType?: string;
  impactDescription?: string;
  urgent?: boolean;
}

export interface ScenarioPhase {
  phaseNumber: number;
  title: string;
  timeLabel: string;
  briefing: string;
  breakingInject?: BreakingInject;
  inject?: BreakingInject;
  dilemma: PhaseDilemma;
}

export interface IncidentScenario {
  id: string;
  codename: string;
  title: string;
  subtitle?: string;
  industry?: string;
  industrySector?: string;
  severity: IncidentSeverity;
  threatActor: string;
  category: ScenarioCategory;
  overview?: string;
  description?: string;
  attackVector?: string;
  adversaryObjective?: string;
  impactedSystems?: string[];
  initialSystemsImpacted?: string[];
  regulatoryScope?: string[];
  applicableDoctrines?: string[];
  baselineCostUsd?: number;
  estimatedDurationHours?: number;
  estimatedDurationMinutes?: number;
  phases: ScenarioPhase[];
}

export interface SelectedDecision {
  phaseNumber: number;
  phaseTitle: string;
  dilemmaQuestion?: string;
  choice: DecisionChoice;
}

export interface CompetencyScore {
  competency: Competency | string;
  score: number;
  rating?: string;
}

export interface AfterActionReport {
  scenarioId: string;
  scenarioCodename: string;
  scenarioTitle: string;
  completedAtTimestamp?: number;
  completedAt?: number;
  finalMetrics: LiveMetrics;
  decisionsTimeline?: SelectedDecision[];
  decisions?: SelectedDecision[];
  competencyBreakdown?: CompetencyScore[];
  competencyScores?: Record<string, number>;
  totalScore: number;
  overallScore?: number;
  letterGrade: string;
  executiveSummary: string;
  keyLessons: string[];
  keyTakeaways?: string[];
  financialCostUsd?: number;
  finalCostUsd?: number;
  timeElapsedHours?: number;
  totalTimeHours?: number;
  publicTrustPercent?: number;
  legalRisk?: LegalRiskLevel;
  legalRiskResult?: LegalRiskLevel;
  forensicIntegrity?: ForensicIntegrity;
}

export interface SimulationRecord {
  id: number;
  scenarioId: string;
  scenarioCodename: string;
  scenarioTitle: string;
  timestamp?: number;
  completedAt?: number;
  letterGrade: string;
  totalScore: number;
  financialCostUsd?: number;
  finalCostUsd?: number;
  timeElapsedHours?: number;
  totalTimeHours?: number;
  publicTrustPercent: number;
  legalRisk: LegalRiskLevel;
  forensicIntegrity: ForensicIntegrity;
  summaryExcerpt: string;
}

export interface DoctrinePlaybook {
  id: string;
  title: string;
  authority: string;
  regulatoryAuthority?: string;
  deadlineWindow: string;
  statutoryPenalties: string;
  overview: string;
  mandatoryRequirements: string[];
  incidentPlaybookChecklist: string[];
  commonPitfalls: string[];
  expertAdvisoryNote?: string;
}

export interface MovahediService {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  tags: string[];
  url: string;
}

export interface MovahediInsight {
  id: string;
  title: string;
  category: string;
  readTimeMinutes: number;
  keyTakeaway: string;
  url: string;
}
