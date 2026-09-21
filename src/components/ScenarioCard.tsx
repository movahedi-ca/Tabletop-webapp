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
        return { label: 'CRITICAL • DEFCON 1', color: 'text-[#EF4444] bg-[#EF4444]/15 border-[#EF4444]/40' };
      case IncidentSeverity.HIGH:
      case IncidentSeverity.DEFCON_2_SEVERE:
        return { label: 'HIGH • DEFCON 2', color: 'text-[#FB923C] bg-[#FB923C]/15 border-[#FB923C]/40' };
      case IncidentSeverity.MEDIUM:
      case IncidentSeverity.DEFCON_3_ELEVATED:
        return { label: 'MEDIUM • DEFCON 3', color: 'text-[#F59E0B] bg-[#F59E0B]/15 border-[#F59E0B]/40' };
      case IncidentSeverity.LOW:
      case IncidentSeverity.DEFCON_4_GUARDED:
      default:
        return { label: 'GUARDED • DEFCON 4', color: 'text-[#10B981] bg-[#10B981]/15 border-[#10B981]/40' };
    }
  };

  const severityBadge = getSeverityBadge(scenario.severity);
  const systems = scenario.impactedSystems || scenario.initialSystemsImpacted || [];
  const regulatory = scenario.regulatoryScope || scenario.applicableDoctrines || [];

  return (
    <div
      data-testid={`scenario_card_${scenario.id}`}
      onClick={onSelect}
      className="w-full bg-[#131D2E] hover:bg-[#1A263B] border border-[#22334D] hover:border-[#00F0FF]/50 rounded-xl p-5 transition-all duration-200 cursor-pointer shadow-md flex flex-col justify-between group hover:shadow-[0_4px_20px_rgba(0,240,255,0.08)]"
    >
      <div>
        {/* Top Badges */}
        <div className="flex items-center justify-between gap-2 mb-2.5 flex-wrap">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold text-[#00F0FF] tracking-wider uppercase bg-[#00F0FF]/10 px-2 py-0.5 rounded border border-[#00F0FF]/30">
              {scenario.codename}
            </span>
            <span className="text-[9px] font-mono text-[#94A3B8] bg-[#0B101B] px-1.5 py-0.5 rounded border border-[#22334D]">
              {scenario.category}
            </span>
          </div>
          <span className={`text-[9px] font-mono font-bold px-2 py-0.5 rounded border ${severityBadge.color}`}>
            {severityBadge.label}
          </span>
        </div>

        {/* Title */}
        <h3 className="text-base font-bold text-[#F8FAFC] group-hover:text-[#00F0FF] transition-colors mb-1.5 leading-snug">
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
                className="text-[9px] font-mono text-[#64748B] bg-[#0B101B] px-1.5 py-0.5 rounded border border-[#22334D]"
              >
                {sys}
              </span>
            ))}
            {regulatory.slice(0, 2).map((reg) => (
              <span
                key={reg}
                className="text-[9px] font-mono text-[#38BDF8] bg-[#38BDF8]/10 px-1.5 py-0.5 rounded border border-[#38BDF8]/30"
              >
                {reg}
              </span>
            ))}
          </div>
        )}
      </div>

      <div>
        {/* Metadata Strip */}
        <div className="flex items-center justify-between py-2.5 border-t border-[#22334D]/80 text-[11px] text-[#64748B] mb-3">
          <div className="flex items-center gap-1">
            <Layers className="w-3.5 h-3.5 text-[#94A3B8]" />
            <span>{scenario.phases.length} Phases</span>
          </div>

          <div className="flex items-center gap-1">
            <Clock className="w-3.5 h-3.5 text-[#94A3B8]" />
            <span>{scenario.estimatedDurationHours ?? 4}h window</span>
          </div>

          <div className="flex items-center gap-1 font-mono text-[#F59E0B]">
            <DollarSign className="w-3.5 h-3.5" />
            <span>Base: {formatCurrency(scenario.baselineCostUsd ?? 100000)}</span>
          </div>
        </div>

        {/* Bottom Actor & CTA Button */}
        <div className="flex items-center justify-between pt-1">
          <div className="flex items-center gap-1.5 text-xs text-[#94A3B8] min-w-0 pr-2">
            <ShieldAlert className="w-3.5 h-3.5 text-[#00F0FF] shrink-0" />
            <span className="truncate text-[11px] text-[#CBD5E1]">{scenario.threatActor}</span>
          </div>

          <div className="flex items-center gap-1 text-xs font-bold text-[#00F0FF] group-hover:translate-x-1 transition-transform shrink-0">
            <span>INSPECT & DRILL</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </div>
        </div>
      </div>
    </div>
  );
};
