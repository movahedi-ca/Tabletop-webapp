import React from 'react';
import { ArrowRight, Clock, Layers, DollarSign, ShieldAlert, AlertTriangle } from 'lucide-react';
import { IncidentScenario, IncidentSeverity } from '../types';
import { formatCurrency } from '../utils/format';

interface ScenarioCardProps {
  scenario: IncidentScenario;
  onSelect: () => void;
}

export const ScenarioCard: React.FC<ScenarioCardProps> = ({ scenario, onSelect }) => {
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

  const severityBadge = getSeverityBadge(scenario.severity);
  const systems = scenario.impactedSystems || scenario.initialSystemsImpacted || [];
  const regulatory = scenario.regulatoryScope || scenario.applicableDoctrines || [];

  return (
    <button
      type="button"
      data-testid={`scenario_card_${scenario.id}`}
      onClick={onSelect}
      aria-label={`Open scenario: ${scenario.title}`}
      className="w-full bg-[#0f172a] hover:bg-[#0f172a] border border-[#1e293b] hover:border-[#2dd4bf]/50 rounded-xl p-5 transition-all duration-200 cursor-pointer shadow-md flex flex-col justify-between group hover:shadow-[0_4px_20px_rgba(45,212,191,0.08)] text-left"
    >
      <div>
        {/* Top Badges */}
        <div className="flex items-center justify-between gap-2 mb-2.5 flex-wrap">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold text-[#2dd4bf] tracking-wider uppercase bg-[#2dd4bf]/10 px-2 py-0.5 rounded border border-[#2dd4bf]/30">
              {scenario.codename}
            </span>
            <span className="text-[9px] font-mono text-[#94A3B8] bg-[#020617] px-1.5 py-0.5 rounded border border-[#1e293b]">
              {scenario.category}
            </span>
          </div>
          <span className={`text-[9px] font-mono font-bold px-2 py-0.5 rounded border ${severityBadge.color}`}>
            {severityBadge.label}
          </span>
        </div>

        {/* Title */}
        <h3 className="text-base font-bold text-[#F8FAFC] group-hover:text-[#2dd4bf] transition-colors mb-1.5 leading-snug">
          {scenario.title}
        </h3>

        {/* Overview */}
        <p className="text-xs text-[#94A3B8] leading-relaxed line-clamp-2 mb-3">
          {scenario.overview || scenario.description}
        </p>

        {/* Impacted Systems & Regulatory Chips (Desktop & Mobile) */}
        {(systems.length > 0 || regulatory.length > 0) && (
          <div className="flex flex-wrap gap-1 mb-3.5">
            {systems.slice(0, 2).map((sys) => (
              <span
                key={sys}
                className="text-[9px] font-mono text-[#94A3B8] bg-[#020617] px-1.5 py-0.5 rounded border border-[#1e293b]"
              >
                {sys}
              </span>
            ))}
            {regulatory.slice(0, 2).map((reg) => (
              <span
                key={reg}
                className="text-[9px] font-mono text-[#5eead4] bg-[#5eead4]/10 px-1.5 py-0.5 rounded border border-[#5eead4]/30"
              >
                {reg}
              </span>
            ))}
          </div>
        )}
      </div>

      <div>
        {/* Metadata Strip */}
        <div className="flex items-center justify-between py-2.5 border-t border-[#1e293b]/80 text-[11px] text-[#94A3B8] mb-3">
          <div className="flex items-center gap-1">
            <Layers className="w-3.5 h-3.5 text-[#94A3B8]" />
            <span>{scenario.phases.length} Phases</span>
          </div>

          <div className="flex items-center gap-1">
            <Clock className="w-3.5 h-3.5 text-[#94A3B8]" />
            <span>{scenario.estimatedDurationHours ?? 4}h window</span>
          </div>

          <div className="flex items-center gap-1 font-mono text-[#fbbf24]">
            <DollarSign className="w-3.5 h-3.5" />
            <span>Base: {formatCurrency(scenario.baselineCostUsd ?? 100000)}</span>
          </div>
        </div>

        {/* Bottom Actor & CTA Button */}
        <div className="flex items-center justify-between pt-1">
          <div className="flex items-center gap-1.5 text-xs text-[#94A3B8] min-w-0 pr-2">
            <ShieldAlert className="w-3.5 h-3.5 text-[#2dd4bf] shrink-0" />
            <span className="truncate text-[11px] text-[#CBD5E1]">{scenario.threatActor}</span>
          </div>

          <div className="flex items-center gap-1 text-xs font-bold text-[#2dd4bf] group-hover:translate-x-1 transition-transform shrink-0">
            <span>INSPECT & DRILL</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </div>
        </div>
      </div>
    </button>
  );
};
