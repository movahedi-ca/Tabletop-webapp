import React, { useState } from 'react';
import {
  AlertCircle,
  X,
  Shield,
  Terminal,
  ArrowRight,
  HelpCircle,
  Clock,
  DollarSign,
  CheckCircle2,
  AlertTriangle,
  Radio,
  History,
  Lock,
} from 'lucide-react';
import { useSimulation } from '../context/SimulationContext';
import { LiveWarRoomMeters } from '../components/MetricGauges';
import { InjectBanner } from '../components/InjectBanner';
import { DecisionCard } from '../components/DecisionCard';
import { DecisionFeedbackDialog } from '../components/DecisionFeedbackDialog';
import { Screen, IncidentSeverity } from '../types';
import { formatCurrency } from '../utils/format';

export const SimulationScreen: React.FC = () => {
  const {
    selectedScenario,
    currentPhaseIndex,
    liveMetrics,
    decisionsHistory,
    activeDecisionFeedback,
    submitDecision,
    proceedFromFeedback,
    abortSimulation,
    navigateTo,
  } = useSimulation();

  const [showAbortConfirm, setShowAbortConfirm] = useState(false);

  if (!selectedScenario) {
    return (
      <div className="min-h-screen bg-[#020617] flex flex-col items-center justify-center p-4">
        <p className="text-sm text-[#94A3B8] mb-4">No active simulation.</p>
        <button
          onClick={() => navigateTo(Screen.HOME)}
          className="px-4 py-2 bg-[#2dd4bf] text-[#042f2e] font-bold rounded-lg text-xs"
        >
          Return to Command Center
        </button>
      </div>
    );
  }

  const currentPhase = selectedScenario.phases[currentPhaseIndex];
  const isFinalPhase = currentPhaseIndex === selectedScenario.phases.length - 1;

  const getDefconLabel = (severity: IncidentSeverity) => {
    switch (severity) {
      case IncidentSeverity.CRITICAL:
      case IncidentSeverity.DEFCON_1_CRITICAL:
      case IncidentSeverity.CATASTROPHIC:
        return 'DEFCON 1 • CRITICAL';
      case IncidentSeverity.HIGH:
      case IncidentSeverity.DEFCON_2_SEVERE:
        return 'DEFCON 2 • SEVERE';
      case IncidentSeverity.MEDIUM:
      case IncidentSeverity.DEFCON_3_ELEVATED:
        return 'DEFCON 3 • ELEVATED';
      case IncidentSeverity.LOW:
      case IncidentSeverity.DEFCON_4_GUARDED:
      default:
        return 'DEFCON 4 • GUARDED';
    }
  };

  return (
    <div className="w-full bg-[#020617] text-[#F8FAFC] pb-28 md:pb-12 px-4 md:px-8 pt-4 md:pt-6 max-w-7xl mx-auto relative">
      {/* Top Header Bar: Status & Phase Navigator */}
      <div className="bg-[#0f172a] border border-[#1e293b] rounded-2xl p-3.5 md:p-4 mb-5 shadow-lg">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          {/* Left: Abort & Codename */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setShowAbortConfirm(true)}
              data-testid="abort_drill_button"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#f87171]/10 hover:bg-[#f87171]/20 border border-[#f87171]/30 text-[#f87171] text-xs font-bold transition-all shrink-0"
            >
              <X className="w-3.5 h-3.5" />
              <span>ABORT DRILL</span>
            </button>

            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono font-bold text-[#2dd4bf] bg-[#2dd4bf]/10 px-2 py-0.5 rounded border border-[#2dd4bf]/30 uppercase">
                  {selectedScenario.codename}
                </span>
                <span className="text-[10px] font-mono text-[#f87171] bg-[#f87171]/15 px-2 py-0.5 rounded border border-[#f87171]/40 font-bold">
                  {getDefconLabel(selectedScenario.severity)}
                </span>
              </div>
              <h2 className="text-sm md:text-base font-bold text-[#F8FAFC] truncate mt-0.5">
                {selectedScenario.title}
              </h2>
            </div>
          </div>

          {/* Center/Right: Phase Progression Steps */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
            {selectedScenario.phases.map((phase, idx) => {
              const isCompleted = idx < currentPhaseIndex;
              const isCurrent = idx === currentPhaseIndex;

              return (
                <div
                  key={phase.phaseNumber || idx}
                  className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-mono font-bold border transition-all shrink-0 ${
                    isCurrent
                      ? 'bg-[#2dd4bf]/20 border-[#2dd4bf] text-[#2dd4bf] shadow-[0_0_10px_rgba(45,212,191,0.2)]'
                      : isCompleted
                      ? 'bg-[#34d399]/15 border-[#34d399]/40 text-[#34d399]'
                      : 'bg-[#020617] border-[#1e293b] text-[#94A3B8]'
                  }`}
                >
                  {isCompleted ? (
                    <CheckCircle2 className="w-3.5 h-3.5" />
                  ) : isCurrent ? (
                    <span className="w-2 h-2 rounded-full bg-[#2dd4bf] animate-ping" />
                  ) : (
                    <span className="w-2 h-2 rounded-full bg-[#94A3B8]" />
                  )}
                  <span>P{phase.phaseNumber || idx + 1}</span>
                  <span className="hidden md:inline text-[10px] font-sans font-normal opacity-80">
                    {idx === 0 ? 'Detection' : idx === 1 ? 'Containment' : 'Disclosure'}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Mobile-Only Telemetry (Shown at top on mobile) */}
      <div className="block lg:hidden mb-4">
        <LiveWarRoomMeters metrics={liveMetrics} />
      </div>

      {/* War Room Layout: Left Operational Area / Right Telemetry & Intel HUD */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
        {/* Left Operational Console (7 of 12 cols on desktop) */}
        <div className="lg:col-span-7 xl:col-span-8 space-y-4">
          {/* Tactical Situation Briefing */}
          {currentPhase && (
            <div className="bg-[#0f172a] border border-[#1e293b] rounded-2xl p-5 shadow-md">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Terminal className="w-4 h-4 text-[#2dd4bf]" />
                  <span className="text-[10px] font-extrabold tracking-widest text-[#2dd4bf] uppercase">
                    TACTICAL SITUATION BRIEFING // PHASE {currentPhase.phaseNumber ?? currentPhaseIndex + 1}
                  </span>
                </div>
                {currentPhase.timeLabel && (
                  <span className="text-[10px] font-mono text-[#5eead4] bg-[#5eead4]/10 px-2 py-0.5 rounded border border-[#5eead4]/30">
                    {currentPhase.timeLabel}
                  </span>
                )}
              </div>

              <h2 className="text-base md:text-xl font-black text-[#F8FAFC] mb-2">
                {currentPhase.title}
              </h2>
              <p className="text-xs md:text-sm text-[#CBD5E1] leading-relaxed">
                {currentPhase.briefing}
              </p>
            </div>
          )}

          {/* Breaking Crisis Inject Banner */}
          {(currentPhase?.breakingInject || currentPhase?.inject) && (
            <InjectBanner inject={(currentPhase.breakingInject || currentPhase.inject)!} />
          )}

          {/* Crisis Dilemma Question */}
          {currentPhase?.dilemma && (
            <div className="space-y-4">
              <div className="bg-gradient-to-r from-[#0f172a] to-[#0f172a] border border-[#5eead4]/40 rounded-2xl p-5 shadow-lg">
                <div className="flex items-center gap-2 mb-2">
                  <HelpCircle className="w-4 h-4 text-[#5eead4]" />
                  <span className="text-[10px] font-black tracking-widest text-[#5eead4] uppercase">
                    INCIDENT COMMANDER DIRECTIVE REQUIRED
                  </span>
                </div>

                <h3 className="text-sm md:text-lg font-bold text-[#F8FAFC] leading-snug mb-2">
                  {currentPhase.dilemma.question}
                </h3>

                {(currentPhase.dilemma.operationalContext || currentPhase.dilemma.contextNotes) && (
                  <p className="text-xs text-[#94A3B8] border-t border-[#1e293b] pt-2.5 mt-2">
                    <strong className="text-[#CBD5E1] font-semibold">Strategic Context: </strong>
                    {currentPhase.dilemma.operationalContext || currentPhase.dilemma.contextNotes}
                  </p>
                )}
              </div>

              {/* Decision Choices (2-column on tablet/desktop, 1-column on mobile) */}
              <div>
                <div className="flex items-center justify-between mb-3 px-1">
                  <span className="text-[11px] font-bold text-[#94A3B8] uppercase tracking-wider">
                    OPERATIONAL ORDER ALTERNATIVES ({currentPhase.dilemma.choices.length})
                  </span>
                  <span className="text-[10px] text-[#94A3B8]">SELECT TO EXECUTE IMMEDIATELY</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {currentPhase.dilemma.choices.map((choice, index) => (
                    <DecisionCard
                      key={choice.id}
                      choice={choice}
                      optionIndex={index}
                      onSelect={() => submitDecision(choice)}
                    />
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right Telemetry & Operational HUD (5 of 12 cols on desktop, sticky) */}
        <div className="hidden lg:block lg:col-span-5 xl:col-span-4 space-y-5 sticky top-20">
          {/* Live War Room Meters */}
          <LiveWarRoomMeters metrics={liveMetrics} />

          {/* Active Drill Threat Dossier */}
          <div className="bg-[#0f172a] border border-[#1e293b] rounded-2xl p-4 shadow-md">
            <div className="flex items-center justify-between mb-2.5 pb-2 border-b border-[#1e293b]">
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-[#f87171]" />
                <span className="text-xs font-bold text-[#F8FAFC] uppercase">
                  Adversary Intel
                </span>
              </div>
              <span className="text-[10px] font-mono text-[#f87171] font-bold">
                {selectedScenario.category}
              </span>
            </div>

            <div className="text-xs space-y-1.5 mb-3">
              <span className="text-[10px] text-[#94A3B8] uppercase font-bold block">
                Threat Actor:
              </span>
              <span className="font-semibold text-[#CBD5E1] block">
                {selectedScenario.threatActor}
              </span>
            </div>

            {selectedScenario.impactedSystems && selectedScenario.impactedSystems.length > 0 && (
              <div>
                <span className="text-[10px] text-[#94A3B8] uppercase font-bold block mb-1.5">
                  Compromised Subnets & Systems:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {selectedScenario.impactedSystems.map((sys) => (
                    <span
                      key={sys}
                      className="text-[10px] font-mono text-[#94A3B8] bg-[#020617] px-2 py-0.5 rounded border border-[#1e293b]"
                    >
                      {sys}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Tactical Decisions History Feed so far */}
          <div className="bg-[#0f172a] border border-[#1e293b] rounded-2xl p-4 shadow-md">
            <div className="flex items-center justify-between mb-3 pb-2 border-b border-[#1e293b]">
              <div className="flex items-center gap-2">
                <History className="w-4 h-4 text-[#2dd4bf]" />
                <span className="text-xs font-bold text-[#F8FAFC] uppercase">
                  Orders Executed Log
                </span>
              </div>
              <span className="text-[10px] font-mono text-[#5eead4]">
                {decisionsHistory.length} ORDERS
              </span>
            </div>

            {decisionsHistory.length === 0 ? (
              <div className="text-center py-4 text-[#94A3B8] text-xs">
                <span>Awaiting initial Phase 1 incident order...</span>
              </div>
            ) : (
              <div className="space-y-2.5 max-h-60 overflow-y-auto pr-1">
                {decisionsHistory.map((item, idx) => (
                  <div
                    key={idx}
                    className="p-2.5 rounded-xl bg-[#020617] border border-[#1e293b] text-xs"
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[10px] font-mono text-[#2dd4bf] font-bold">
                        PHASE {item.phaseNumber || idx + 1}
                      </span>
                      <span className="text-[9px] text-[#94A3B8]">
                        {item.choice.recommendedBy}
                      </span>
                    </div>
                    <p className="font-semibold text-[#F8FAFC] text-[11px] mb-1">
                      {item.choice.title}
                    </p>
                    <div className="flex items-center gap-2 text-[10px] font-mono text-[#fbbf24]">
                      <span>+{formatCurrency(item.choice.costDeltaUsd)}</span>
                      <span>•</span>
                      <span>+{item.choice.timeDeltaHours}h</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Decision Feedback Overlay Dialog */}
      {activeDecisionFeedback && (
        <DecisionFeedbackDialog
          choice={activeDecisionFeedback}
          isFinalPhase={isFinalPhase}
          onProceed={proceedFromFeedback}
        />
      )}

      {/* Abort Confirmation Dialog */}
      {showAbortConfirm && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-sm bg-[#0f172a] border border-[#f87171]/40 rounded-2xl p-5 shadow-2xl">
            <div className="flex items-center gap-2 text-[#f87171] mb-2">
              <AlertCircle className="w-5 h-5" />
              <h3 className="text-base font-bold text-[#F8FAFC]">Abort Incident Drill?</h3>
            </div>
            <p className="text-xs text-[#94A3B8] leading-relaxed mb-4">
              Aborting will discard live telemetry for this active scenario. Past drill records will remain safe in Archives.
            </p>
            <div className="flex gap-2.5">
              <button
                type="button"
                onClick={() => setShowAbortConfirm(false)}
                className="flex-1 py-2.5 rounded-xl bg-[#020617] border border-[#1e293b] text-xs font-semibold text-[#94A3B8] hover:text-[#F8FAFC] transition-colors"
              >
                Continue Drill
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowAbortConfirm(false);
                  abortSimulation();
                }}
                className="flex-1 py-2.5 rounded-xl bg-[#f87171] hover:bg-[#f87171]/90 text-[#F8FAFC] text-xs font-bold transition-colors"
              >
                Abort Drill
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
