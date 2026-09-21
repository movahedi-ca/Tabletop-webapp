import React from 'react';
import { ArrowRight, DollarSign, Clock, Shield, Brain } from 'lucide-react';
import { DecisionChoice, ForensicIntegrity } from '../types';
import { formatCurrency } from '../utils/format';

interface DecisionCardProps {
  choice: DecisionChoice;
  optionIndex: number;
  onSelect: () => void;
}

export const DecisionCard: React.FC<DecisionCardProps> = ({ choice, optionIndex, onSelect }) => {
  const optionLetter = String.fromCharCode('A'.charCodeAt(0) + optionIndex);

  const getForensicsBadge = (forensics?: ForensicIntegrity) => {
    switch (forensics) {
      case ForensicIntegrity.INTACT:
        return { label: 'INTACT', color: 'text-[#34d399] bg-[#34d399]/12 border-[#34d399]/30' };
      case ForensicIntegrity.PARTIALLY_COMPROMISED:
      case ForensicIntegrity.DEGRADED:
        return { label: 'DEGRADED', color: 'text-[#fbbf24] bg-[#fbbf24]/12 border-[#fbbf24]/30' };
      case ForensicIntegrity.TAINTED:
      case ForensicIntegrity.COMPROMISED:
      case ForensicIntegrity.DESTROYED:
      default:
        return { label: 'TAINTED / AT RISK', color: 'text-[#f87171] bg-[#f87171]/12 border-[#f87171]/30' };
    }
  };

  const forensicsBadge = getForensicsBadge(choice.forensicsImpact ?? choice.forensicResult);

  return (
    <div
      data-testid={`decision_choice_${optionLetter}`}
      className="w-full bg-[#0f172a] rounded-xl border border-[#1e293b] hover:border-[#2dd4bf]/50 p-4 transition-all shadow-md"
    >
      {/* Header with Option Letter and Recommended By */}
      <div className="flex items-center justify-between mb-2.5">
        <div className="w-7 h-7 rounded-md bg-[#2dd4bf]/15 border border-[#2dd4bf]/40 flex items-center justify-center">
          <span className="text-sm font-black text-[#2dd4bf]">{optionLetter}</span>
        </div>

        <div className="flex items-center gap-1.5 px-2 py-1 rounded-md bg-[#14b8a6]/20 text-[#5eead4]">
          <Brain className="w-3.5 h-3.5 text-[#5eead4]" />
          <span className="text-[11px] font-medium">{choice.recommendedBy}</span>
        </div>
      </div>

      {/* Choice Title */}
      <h3 className="text-base font-bold text-[#F8FAFC] leading-snug mb-1.5">{choice.title}</h3>

      {/* Description */}
      <p className="text-xs text-[#94A3B8] leading-relaxed mb-3.5">{choice.description}</p>

      {/* Impact Previews */}
      <div className="flex flex-wrap items-center gap-2 mb-3.5">
        {/* Cost */}
        <div
          className={`flex items-center gap-1 px-2 py-1 rounded-md border text-[10px] font-bold ${
            choice.costDeltaUsd > 1000000
              ? 'text-[#f87171] bg-[#f87171]/12 border-[#f87171]/30'
              : 'text-[#fbbf24] bg-[#fbbf24]/12 border-[#fbbf24]/30'
          }`}
        >
          <DollarSign className="w-3 h-3" />
          <span>+{formatCurrency(choice.costDeltaUsd)}</span>
        </div>

        {/* Time */}
        <div className="flex items-center gap-1 px-2 py-1 rounded-md border text-[10px] font-bold text-[#5eead4] bg-[#5eead4]/12 border-[#5eead4]/30">
          <Clock className="w-3 h-3" />
          <span>+{choice.timeDeltaHours}h</span>
        </div>

        {/* Forensics */}
        <div className={`flex items-center gap-1 px-2 py-1 rounded-md border text-[10px] font-bold ${forensicsBadge.color}`}>
          <Shield className="w-3 h-3" />
          <span>{forensicsBadge.label}</span>
        </div>
      </div>

      {/* Execute Order Button */}
      <button
        type="button"
        onClick={onSelect}
        data-testid={`execute_order_button_${optionLetter}`}
        className="w-full h-11 bg-[#2dd4bf] hover:bg-[#2dd4bf]/90 text-[#042f2e] font-extrabold text-xs tracking-wider rounded-lg flex items-center justify-center gap-1.5 transition-all shadow-md active:scale-[0.99]"
      >
        <span>EXECUTE ORDER</span>
        <ArrowRight className="w-4 h-4" />
      </button>
    </div>
  );
};
