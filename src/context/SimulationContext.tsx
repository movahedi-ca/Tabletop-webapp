import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
  Screen,
  IncidentScenario,
  LiveMetrics,
  LegalRiskLevel,
  ForensicIntegrity,
  SelectedDecision,
  DecisionChoice,
  AfterActionReport,
  DoctrinePlaybook,
  SimulationRecord,
  Competency,
  CompetencyScore,
} from '../types';

interface SimulationContextType {
  currentScreen: Screen;
  selectedScenario: IncidentScenario | null;
  currentPhaseIndex: number;
  liveMetrics: LiveMetrics;
  decisionsHistory: SelectedDecision[];
  activeDecisionFeedback: DecisionChoice | null;
  afterActionReport: AfterActionReport | null;
  selectedDoctrine: DoctrinePlaybook | null;
  pastDrills: SimulationRecord[];
  navigateTo: (screen: Screen) => void;
  selectScenario: (scenario: IncidentScenario) => void;
  startSimulation: (scenario?: IncidentScenario) => void;
  returnToHome: () => void;
  abortSimulation: () => void;
  submitDecision: (choice: DecisionChoice) => void;
  proceedFromFeedback: () => void;
  selectDoctrine: (playbook: DoctrinePlaybook) => void;
  deletePastDrill: (id: number) => void;
  clearAllPastDrills: () => void;
}

const STORAGE_KEY = 'breach_tabletop_records';

const defaultLiveMetrics: LiveMetrics = {
  financialCostUsd: 0,
  timeElapsedHours: 0,
  publicTrustPercent: 90,
  legalRisk: LegalRiskLevel.MINIMAL,
  forensicIntegrity: ForensicIntegrity.INTACT,
};

const SimulationContext = createContext<SimulationContextType | undefined>(undefined);

export const SimulationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentScreen, setCurrentScreen] = useState<Screen>(Screen.HOME);
  const [selectedScenario, setSelectedScenario] = useState<IncidentScenario | null>(null);
  const [currentPhaseIndex, setCurrentPhaseIndex] = useState<number>(0);
  const [liveMetrics, setLiveMetrics] = useState<LiveMetrics>(defaultLiveMetrics);
  const [decisionsHistory, setDecisionsHistory] = useState<SelectedDecision[]>([]);
  const [activeDecisionFeedback, setActiveDecisionFeedback] = useState<DecisionChoice | null>(null);
  const [afterActionReport, setAfterActionReport] = useState<AfterActionReport | null>(null);
  const [selectedDoctrine, setSelectedDoctrine] = useState<DoctrinePlaybook | null>(null);
  const [pastDrills, setPastDrills] = useState<SimulationRecord[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(pastDrills));
    } catch (e) {
      console.error('Failed to persist drill records:', e);
    }
  }, [pastDrills]);

  const navigateTo = useCallback((screen: Screen) => {
    setCurrentScreen(screen);
  }, []);

  const selectScenario = useCallback((scenario: IncidentScenario) => {
    setSelectedScenario(scenario);
    setCurrentScreen(Screen.SCENARIO_DETAIL);
  }, []);

  const startSimulation = useCallback((scenarioToStart?: IncidentScenario) => {
    const target = scenarioToStart || selectedScenario;
    if (!target) return;

    setSelectedScenario(target);
    setCurrentPhaseIndex(0);
    setLiveMetrics({
      financialCostUsd: target.baselineCostUsd ?? 100000,
      timeElapsedHours: 2,
      publicTrustPercent: 90,
      legalRisk: LegalRiskLevel.MINIMAL,
      forensicIntegrity: ForensicIntegrity.INTACT,
    });
    setDecisionsHistory([]);
    setActiveDecisionFeedback(null);
    setAfterActionReport(null);
    setCurrentScreen(Screen.SIMULATION);
  }, [selectedScenario]);

  const returnToHome = useCallback(() => {
    setCurrentScreen(Screen.HOME);
    setSelectedScenario(null);
    setActiveDecisionFeedback(null);
    setDecisionsHistory([]);
  }, []);

  const abortSimulation = useCallback(() => {
    returnToHome();
  }, [returnToHome]);

  const submitDecision = useCallback((choice: DecisionChoice) => {
    if (activeDecisionFeedback) return;
    if (!selectedScenario) return;

    const currentPhase = selectedScenario.phases[currentPhaseIndex];
    if (!currentPhase) return;

    setLiveMetrics((prev) => {
      const newCost = Math.max(0, prev.financialCostUsd + (choice.costDeltaUsd ?? 0));
      const newTime = Math.max(0, prev.timeElapsedHours + (choice.timeDeltaHours ?? 0));
      const newTrust = Math.min(100, Math.max(0, prev.publicTrustPercent + (choice.trustDeltaPercent ?? 0)));

      const riskLevels = [
        LegalRiskLevel.MINIMAL,
        LegalRiskLevel.LOW,
        LegalRiskLevel.MODERATE,
        LegalRiskLevel.HIGH,
        LegalRiskLevel.CRITICAL,
      ];
      const riskIndex = Math.max(0, riskLevels.indexOf(prev.legalRisk));
      const change = choice.legalRiskChange ?? 0;
      const updatedRiskIndex = Math.min(riskLevels.length - 1, Math.max(0, riskIndex + change));
      const newLegalRisk = choice.legalRiskResult || riskLevels[updatedRiskIndex];

      let newForensics: ForensicIntegrity;
      const fImpact = choice.forensicsImpact || choice.forensicResult;
      if (fImpact === ForensicIntegrity.TAINTED || prev.forensicIntegrity === ForensicIntegrity.TAINTED) {
        newForensics = ForensicIntegrity.TAINTED;
      } else if (
        fImpact === ForensicIntegrity.PARTIALLY_COMPROMISED ||
        prev.forensicIntegrity === ForensicIntegrity.PARTIALLY_COMPROMISED
      ) {
        newForensics = ForensicIntegrity.PARTIALLY_COMPROMISED;
      } else {
        newForensics = ForensicIntegrity.INTACT;
      }

      return {
        financialCostUsd: newCost,
        timeElapsedHours: newTime,
        publicTrustPercent: newTrust,
        legalRisk: newLegalRisk,
        forensicIntegrity: newForensics,
      };
    });

    const record: SelectedDecision = {
      phaseNumber: currentPhase.phaseNumber,
      phaseTitle: currentPhase.title,
      dilemmaQuestion: currentPhase.dilemma.question,
      choice,
    };

    setDecisionsHistory((prev) => [...prev, record]);
    setActiveDecisionFeedback(choice);
  }, [activeDecisionFeedback, selectedScenario, currentPhaseIndex]);

  const compileAndSaveAar = useCallback(
    (scenario: IncidentScenario, finalDecisions: SelectedDecision[], currentLiveMetrics: LiveMetrics) => {
      const allCompetencies: Competency[] = [
        Competency.DETECTION_TRIAGE,
        Competency.CONTAINMENT_SPEED,
        Competency.LEGAL_COMPLIANCE,
        Competency.CRISIS_COMMS,
        Competency.BUSINESS_RESILIENCE,
      ];

      const competencyAverages: Record<Competency, number> = {
        [Competency.DETECTION_TRIAGE]: 75,
        [Competency.CONTAINMENT_SPEED]: 75,
        [Competency.LEGAL_COMPLIANCE]: 75,
        [Competency.CRISIS_COMMS]: 75,
        [Competency.BUSINESS_RESILIENCE]: 75,
        [Competency.EXECUTIVE_COMMAND]: 75,
        [Competency.EXECUTIVE_CRISIS_LEADERSHIP]: 75,
        [Competency.REGULATORY_COMPLIANCE]: 75,
        [Competency.FORENSIC_TRIAGE]: 75,
        [Competency.FORENSIC_PRESERVATION]: 75,
        [Competency.PUBLIC_COMMUNICATIONS]: 75,
        [Competency.TECHNICAL_CONTAINMENT]: 75,
      };

      allCompetencies.forEach((comp) => {
        const scoresForComp: number[] = [];
        finalDecisions.forEach((d) => {
          const score = d.choice.competencyScores?.[comp];
          if (score !== undefined) {
            scoresForComp.push(score);
          }
        });
        if (scoresForComp.length > 0) {
          const sum = scoresForComp.reduce((a, b) => a + b, 0);
          competencyAverages[comp] = Math.round(sum / scoresForComp.length);
        } else {
          competencyAverages[comp] = 75;
        }
      });

      const competencyWeights: Partial<Record<Competency, number>> = {
        [Competency.DETECTION_TRIAGE]: 0.2,
        [Competency.CONTAINMENT_SPEED]: 0.25,
        [Competency.LEGAL_COMPLIANCE]: 0.25,
        [Competency.CRISIS_COMMS]: 0.15,
        [Competency.BUSINESS_RESILIENCE]: 0.15,
      };

      let weightedSum = 0;
      let totalWeight = 0;
      allCompetencies.forEach((comp) => {
        const weight = competencyWeights[comp] || 0.2;
        const score = competencyAverages[comp];
        weightedSum += score * weight;
        totalWeight += weight;
      });

      const baseScore = totalWeight > 0 ? Math.round(weightedSum / totalWeight) : 75;

      const forensicsDeduction =
        currentLiveMetrics.forensicIntegrity === ForensicIntegrity.INTACT
          ? 0
          : currentLiveMetrics.forensicIntegrity === ForensicIntegrity.PARTIALLY_COMPROMISED
          ? 8
          : 20;

      const legalPenalty =
        currentLiveMetrics.legalRisk === LegalRiskLevel.MINIMAL || currentLiveMetrics.legalRisk === LegalRiskLevel.LOW
          ? 0
          : currentLiveMetrics.legalRisk === LegalRiskLevel.MODERATE
          ? 5
          : currentLiveMetrics.legalRisk === LegalRiskLevel.HIGH
          ? 12
          : 25;

      const trustBonus = Math.round((currentLiveMetrics.publicTrustPercent - 50) * 0.15);
      const finalScore = Math.min(100, Math.max(15, baseScore - forensicsDeduction - legalPenalty + trustBonus));

      let letterGrade = 'C';
      if (finalScore >= 92) letterGrade = 'A+';
      else if (finalScore >= 85) letterGrade = 'A';
      else if (finalScore >= 78) letterGrade = 'B+';
      else if (finalScore >= 70) letterGrade = 'B';
      else if (finalScore >= 62) letterGrade = 'C+';
      else if (finalScore >= 50) letterGrade = 'C';
      else if (finalScore >= 40) letterGrade = 'D';
      else letterGrade = 'F';

      let summary = '';
      if (finalScore >= 85) {
        summary = `Exemplary crisis leadership executed under ${scenario.codename}. The incident response team successfully contained adversarial persistence while rigorously maintaining regulatory defensibility and evidence integrity under applicable statutory disclosure clocks.`;
      } else if (finalScore >= 70) {
        summary = `Competent operational containment achieved for ${scenario.codename}. Technical systems were stabilized, though minor compromises in evidence preservation and secondary delays in regulatory notification elevated organizational exposure.`;
      } else if (finalScore >= 50) {
        summary = `Marginal response during ${scenario.codename}. While systems were eventually recovered, critical doctrine violations—including premature host rebooting or notification delays—incurred elevated regulatory fines and substantial public trust erosion.`;
      } else {
        summary = `Catastrophic operational and legal failure during ${scenario.codename}. Tainted forensic chain-of-custody, regulatory breach reporting defaults, and uncontrolled data exposure resulted in maximum statutory liability. Immediate tabletop drill repetition mandated.`;
      }

      const lessons = [
        'Evidence Preservation: Always capture volatile host RAM before powering off or wiping infected infrastructure.',
        'Materiality Window: Formulate SEC/GDPR/PIPEDA disclosure filings with legal counsel early rather than waiting for 100% forensic certainty.',
        'Stakeholder Transparency: Proactive, verified technical briefings neutralize adversarial media cycles and preserve brand equity.',
      ];

      const competencyBreakdown: CompetencyScore[] = allCompetencies.map((comp) => ({
        competency: comp,
        score: competencyAverages[comp] ?? 75,
        rating: (competencyAverages[comp] ?? 75) >= 85 ? 'Superior' : (competencyAverages[comp] ?? 75) >= 70 ? 'Competent' : 'Deficient',
      }));

      const report: AfterActionReport = {
        scenarioId: scenario.id,
        scenarioTitle: scenario.title,
        scenarioCodename: scenario.codename,
        completedAt: Date.now(),
        completedAtTimestamp: Date.now(),
        letterGrade,
        totalScore: finalScore,
        finalCostUsd: currentLiveMetrics.financialCostUsd,
        financialCostUsd: currentLiveMetrics.financialCostUsd,
        totalTimeHours: currentLiveMetrics.timeElapsedHours,
        timeElapsedHours: currentLiveMetrics.timeElapsedHours,
        publicTrustPercent: currentLiveMetrics.publicTrustPercent,
        legalRisk: currentLiveMetrics.legalRisk,
        legalRiskResult: currentLiveMetrics.legalRisk,
        forensicIntegrity: currentLiveMetrics.forensicIntegrity,
        finalMetrics: currentLiveMetrics,
        decisionsTimeline: finalDecisions,
        competencyBreakdown,
        executiveSummary: summary,
        keyLessons: lessons,
      };

      setAfterActionReport(report);
      setCurrentScreen(Screen.AAR_REPORT);

      // Save drill record
      const record: SimulationRecord = {
        id: Date.now(),
        scenarioId: scenario.id,
        scenarioCodename: scenario.codename,
        scenarioTitle: scenario.title,
        completedAt: report.completedAt,
        timestamp: report.completedAt,
        letterGrade: report.letterGrade,
        totalScore: report.totalScore,
        financialCostUsd: report.finalCostUsd ?? 0,
        finalCostUsd: report.finalCostUsd ?? 0,
        timeElapsedHours: report.totalTimeHours ?? 0,
        totalTimeHours: report.totalTimeHours ?? 0,
        publicTrustPercent: report.publicTrustPercent ?? 0,
        legalRisk: report.legalRisk ?? LegalRiskLevel.MINIMAL,
        forensicIntegrity: report.forensicIntegrity ?? ForensicIntegrity.INTACT,
        summaryExcerpt: summary.slice(0, 150) + '...',
      };

      setPastDrills((prev) => [record, ...prev]);
    },
    []
  );

  const proceedFromFeedback = useCallback(() => {
    if (!activeDecisionFeedback) return;
    setActiveDecisionFeedback(null);
    if (!selectedScenario) return;

    const nextIndex = currentPhaseIndex + 1;
    if (nextIndex < selectedScenario.phases.length) {
      setCurrentPhaseIndex(nextIndex);
    } else {
      compileAndSaveAar(selectedScenario, decisionsHistory, liveMetrics);
    }
  }, [activeDecisionFeedback, selectedScenario, currentPhaseIndex, compileAndSaveAar, decisionsHistory, liveMetrics]);

  const selectDoctrine = useCallback((playbook: DoctrinePlaybook) => {
    setSelectedDoctrine(playbook);
    setCurrentScreen(Screen.DOCTRINE_DETAIL);
  }, []);

  const deletePastDrill = useCallback((id: number) => {
    setPastDrills((prev) => prev.filter((d) => d.id !== id));
  }, []);

  const clearAllPastDrills = useCallback(() => {
    setPastDrills([]);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (e) {
      console.error(e);
    }
  }, []);

  return (
    <SimulationContext.Provider
      value={{
        currentScreen,
        selectedScenario,
        currentPhaseIndex,
        liveMetrics,
        decisionsHistory,
        activeDecisionFeedback,
        afterActionReport,
        selectedDoctrine,
        pastDrills,
        navigateTo,
        selectScenario,
        startSimulation,
        returnToHome,
        abortSimulation,
        submitDecision,
        proceedFromFeedback,
        selectDoctrine,
        deletePastDrill,
        clearAllPastDrills,
      }}
    >
      {children}
    </SimulationContext.Provider>
  );
};

export const useSimulation = (): SimulationContextType => {
  const context = useContext(SimulationContext);
  if (!context) {
    throw new Error('useSimulation must be used within a SimulationProvider');
  }
  return context;
};
