import React from 'react';
import {
  ArrowLeft,
  Play,
  Clock,
  DollarSign,
  Shield,
  Server,
  Layers,
  FileText,
  AlertTriangle,
  CheckCircle2,
  Lock,
  ChevronRight,
} from 'lucide-react';
import { useSimulation } from '../context/SimulationContext';
import { Screen, IncidentSeverity } from '../types';
import { formatCurrency } from '../utils/format';

export const ScenarioDetailScreen: React.FC = () => {
  const { selectedScenario, navigateTo, startSimulation } = useSimulation();

  if (!selectedScenario) {
    return (
      <div className="min-h-screen bg-[#020617] flex flex-col items-center justify-center p-4">
        <p className="text-sm text-[#94A3B8] mb-4">No scenario selected.</p>
        <button
          onClick={() => navigateTo(Screen.HOME)}
          className="px-4 py-2 bg-[#2dd4bf] text-[#042f2e] font-bold rounded-lg text-xs"
        >
          Return to Command Center
        </button>
      </div>
    );
  }

  const getSeverityBadge = (severity: IncidentSeverity) => {
    switch (severity) {
      case IncidentSeverity.CRITICAL:
      case IncidentSeverity.DEFCON_1_CRITICAL:
      case IncidentSeverity.CATASTROPHIC:
        return { label: 'CRITICAL • DEFCON 1', color: 'text-[#f87171] bg-[#f87171]/15 border-[#f87171]/40' };
      case IncidentSeverity.HIGH:
      case IncidentSeverity.DEFCON_2_SEVERE:
        return { label: 'HIGH • DEFCON 2', color: 'text-[#FB923C] bg-[#FB923C]/15 border-[#FB923C]/40' };
      case IncidentSeverity.MEDIUM:
      case IncidentSeverity.DEFCON_3_ELEVATED:
        return { label: 'MEDIUM • DEFCON 3', color: 'text-[#fbbf24] bg-[#fbbf24]/15 border-[#fbbf24]/40' };
      case IncidentSeverity.LOW:
      case IncidentSeverity.DEFCON_4_GUARDED:
      default:
        return { label: 'GUARDED • DEFCON 4', color: 'text-[#34d399] bg-[#34d399]/15 border-[#34d399]/40' };
    }
  };

  const severityBadge = getSeverityBadge(selectedScenario.severity);
  const impactedSystems = selectedScenario.impactedSystems || selectedScenario.initialSystemsImpacted || [];
  const regulatoryScope = selectedScenario.regulatoryScope || selectedScenario.applicableDoctrines || [];

  return (
    <div className="w-full bg-[#020617] text-[#F8FAFC] pb-28 md:pb-16 px-4 md:px-8 pt-4 md:pt-6 max-w-7xl mx-auto">
      {/* Top Breadcrumb & Action Bar */}
      <div className="flex items-center justify-between mb-5 border-b border-[#1e293b] pb-3">
        <button
          type="button"
          onClick={() => navigateTo(Screen.HOME)}
          data-testid="scenario_detail_back_button"
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#0f172a] text-[#94A3B8] hover:text-[#2dd4bf] hover:border-[#2dd4bf]/40 border border-[#1e293b] text-xs font-semibold transition-all"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>RETURN TO WAR ROOM</span>
        </button>

        <div className="flex items-center gap-2">
          <span className="text-[10px] font-mono text-[#64748B] hidden sm:inline">
            CLASSIFICATION: TOP SECRET // EXERCISE ONLY
          </span>
          <span className={`text-[10px] font-mono font-bold px-2.5 py-1 rounded-md border ${severityBadge.color}`}>
            {severityBadge.label}
          </span>
        </div>
      </div>

      {/* Scenario Title Header */}
      <div className="mb-6 md:mb-8">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-xs font-extrabold tracking-widest text-[#2dd4bf] uppercase bg-[#2dd4bf]/10 px-2.5 py-0.5 rounded border border-[#2dd4bf]/30">
            {selectedScenario.codename}
          </span>
          <span className="text-xs font-mono text-[#94A3B8] bg-[#0f172a] px-2 py-0.5 rounded border border-[#1e293b]">
            {selectedScenario.category}
          </span>
        </div>

        <h1 className="text-2xl md:text-4xl font-black text-[#F8FAFC] tracking-tight mb-2">
          {selectedScenario.title}
        </h1>
        <p className="text-xs md:text-sm text-[#94A3B8] max-w-3xl leading-relaxed">
          {selectedScenario.overview || selectedScenario.description}
        </p>
      </div>

      {/* Desktop 2-Column Split Dossier */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
        {/* Left Column: Adversary & Telemetry Dossier (5 of 12 cols on desktop) */}
        <div className="lg:col-span-5 space-y-4">
          {/* Threat Actor Profile Card */}
          <div className="bg-[#0f172a] border border-[#1e293b] rounded-2xl p-5 shadow-md">
            <div className="flex items-center justify-between mb-3 border-b border-[#1e293b] pb-2.5">
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-[#f87171]" />
                <span className="text-[11px] font-black tracking-wider text-[#f87171] uppercase">
                  THREAT ACTOR INTEL PROFILE
                </span>
              </div>
              <span className="text-[9px] font-mono text-[#f87171] bg-[#f87171]/10 px-1.5 py-0.5 rounded border border-[#f87171]/30">
                ACTIVE
              </span>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <span className="text-[#64748B] text-[10px] uppercase font-bold block mb-0.5">
                  Adversary Entity / Designation
                </span>
                <span className="text-sm font-bold text-[#F8FAFC] block">{selectedScenario.threatActor}</span>
              </div>

              <div>
                <span className="text-[#64748B] text-[10px] uppercase font-bold block mb-0.5">
                  Incident Vector
                </span>
                <span className="text-xs text-[#CBD5E1] bg-[#020617] p-2 rounded-lg border border-[#1e293b] block">
                  {selectedScenario.category} Attack Vector
                </span>
              </div>
            </div>
          </div>

          {/* Baseline Impact Metrics */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-[#0f172a] border border-[#1e293b] rounded-2xl p-4 shadow-md">
              <div className="flex items-center gap-1.5 text-[#fbbf24] mb-1">
                <DollarSign className="w-4 h-4" />
                <span className="text-[10px] font-bold text-[#64748B] uppercase">BASELINE COST</span>
              </div>
              <span className="text-base md:text-lg font-bold font-mono text-[#fbbf24] block">
                {formatCurrency(selectedScenario.baselineCostUsd ?? 150000)}
              </span>
              <span className="text-[10px] text-[#64748B] mt-0.5 block">Estimated initial impact</span>
            </div>

            <div className="bg-[#0f172a] border border-[#1e293b] rounded-2xl p-4 shadow-md">
              <div className="flex items-center gap-1.5 text-[#5eead4] mb-1">
                <Clock className="w-4 h-4" />
                <span className="text-[10px] font-bold text-[#64748B] uppercase">EST. WINDOW</span>
              </div>
              <span className="text-base md:text-lg font-bold font-mono text-[#5eead4] block">
                {selectedScenario.estimatedDurationHours ?? 4} Hours
              </span>
              <span className="text-[10px] text-[#64748B] mt-0.5 block">Containment window</span>
            </div>
          </div>

          {/* Impacted Critical Systems */}
          {impactedSystems.length > 0 && (
            <div className="bg-[#0f172a] border border-[#1e293b] rounded-2xl p-4 shadow-md">
              <div className="flex items-center gap-2 mb-3">
                <Server className="w-4 h-4 text-[#2dd4bf]" />
                <span className="text-[11px] font-black tracking-wider text-[#2dd4bf] uppercase">
                  IMPACTED CRITICAL SYSTEMS ({impactedSystems.length})
                </span>
              </div>

              <div className="flex flex-wrap gap-2">
                {impactedSystems.map((sys) => (
                  <span
                    key={sys}
                    className="text-[11px] font-mono px-2.5 py-1 bg-[#020617] border border-[#1e293b] text-[#CBD5E1] rounded-lg flex items-center gap-1.5"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-[#f87171]" />
                    <span>{sys}</span>
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Regulatory Scope */}
          {regulatoryScope.length > 0 && (
            <div className="bg-[#0f172a] border border-[#1e293b] rounded-2xl p-4 shadow-md">
              <div className="flex items-center gap-2 mb-3">
                <FileText className="w-4 h-4 text-[#fbbf24]" />
                <span className="text-[11px] font-black tracking-wider text-[#fbbf24] uppercase">
                  STATUTORY JURISDICTIONS & CLOCKS
                </span>
              </div>

              <div className="space-y-2">
                {regulatoryScope.map((scope) => (
                  <div
                    key={scope}
                    className="flex items-center justify-between text-xs bg-[#020617] p-2.5 rounded-xl border border-[#1e293b]"
                  >
                    <div className="flex items-center gap-2 text-[#CBD5E1]">
                      <span className="w-2 h-2 rounded-full bg-[#fbbf24]" />
                      <span className="font-semibold">{scope}</span>
                    </div>
                    <span className="text-[10px] font-mono text-[#fbbf24]">MANDATORY</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Phase Progression & Command Launch (7 of 12 cols on desktop) */}
        <div className="lg:col-span-7 space-y-5">
          {/* Incident Escalation Progression */}
          <div className="bg-[#0f172a] border border-[#1e293b] rounded-2xl p-5 shadow-md">
            <div className="flex items-center justify-between mb-4 border-b border-[#1e293b] pb-3">
              <div className="flex items-center gap-2">
                <Layers className="w-4 h-4 text-[#5eead4]" />
                <span className="text-[11px] font-black tracking-wider text-[#5eead4] uppercase">
                  SIMULATION PHASES & DECISION GATES
                </span>
              </div>
              <span className="text-xs font-mono text-[#2dd4bf]">
                {selectedScenario.phases.length} OPERATIONAL PHASES
              </span>
            </div>

            <div className="space-y-4">
              {selectedScenario.phases.map((phase, idx) => (
                <div
                  key={phase.phaseNumber || idx}
                  className="p-3.5 rounded-xl bg-[#020617] border border-[#1e293b] hover:border-[#2dd4bf]/30 transition-colors"
                >
                  <div className="flex items-center justify-between gap-2 mb-1.5">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-md bg-[#2dd4bf]/15 border border-[#2dd4bf]/30 text-[#2dd4bf] font-mono font-black text-xs flex items-center justify-center shrink-0">
                        P{phase.phaseNumber || idx + 1}
                      </div>
                      <h4 className="text-sm font-bold text-[#F8FAFC]">{phase.title}</h4>
                    </div>

                    {phase.timeLabel && (
                      <span className="text-[10px] font-mono text-[#64748B]">
                        {phase.timeLabel}
                      </span>
                    )}
                  </div>

                  <p className="text-xs text-[#94A3B8] leading-relaxed mb-2 pl-8">
                    {phase.briefing}
                  </p>

                  {phase.dilemma && (
                    <div className="ml-8 p-2 rounded-lg bg-[#0f172a] border border-[#5eead4]/20 flex items-start gap-2 text-xs">
                      <AlertTriangle className="w-3.5 h-3.5 text-[#5eead4] shrink-0 mt-0.5" />
                      <div>
                        <span className="text-[10px] font-bold text-[#5eead4] uppercase block">
                          Incident Commander Dilemma:
                        </span>
                        <span className="text-[11px] text-[#CBD5E1]">
                          {phase.dilemma.question}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Pre-Flight Checklist Card */}
          <div className="bg-[#0f172a] border border-[#1e293b] rounded-2xl p-4">
            <h4 className="text-xs font-bold text-[#F8FAFC] uppercase tracking-wider mb-2 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#34d399]" />
              <span>Exercise Command Rules of Engagement</span>
            </h4>
            <ul className="text-xs text-[#94A3B8] space-y-1.5 list-disc list-inside">
              <li>Decisions are permanent and directly affect financial exposure, forensic validity, and legal liability.</li>
              <li>Supervisory reporting clocks run concurrently; late disclosures incur statutory fines.</li>
              <li>A comprehensive After-Action Report (AAR) with readiness grades will be generated upon completion.</li>
            </ul>
          </div>

          {/* Primary Command Execution Button (Desktop & Mobile) */}
          <div className="pt-2">
            <button
              type="button"
              onClick={() => startSimulation(selectedScenario)}
              data-testid="start_drill_button"
              className="w-full h-14 bg-gradient-to-r from-[#2dd4bf] to-[#5eead4] hover:from-[#2dd4bf]/90 hover:to-[#5eead4]/90 text-[#042f2e] font-black text-sm tracking-widest uppercase rounded-2xl flex items-center justify-center gap-3 transition-all shadow-[0_4px_25px_rgba(45,212,191,0.35)] hover:shadow-[0_4px_30px_rgba(45,212,191,0.5)] active:scale-[0.99]"
            >
              <Play className="w-5 h-5 fill-current" />
              <span>COMMENCE CRISIS TABLETOP DRILL</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
