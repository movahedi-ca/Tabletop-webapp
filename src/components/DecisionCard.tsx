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
        return { label: 'INTACT', color: 'text-[#10B981] bg-[#10B981]/12 border-[#10B981]/30' };
      case ForensicIntegrity.PARTIALLY_COMPROMISED:
      case ForensicIntegrity.DEGRADED:
        return { label: 'DEGRADED', color: 'text-[#F59E0B] bg-[#F59E0B]/12 border-[#F59E0B]/30' };
      case ForensicIntegrity.TAINTED:
      case ForensicIntegrity.COMPROMISED:
      case ForensicIntegrity.DESTROYED:
      default:
        return { label: 'TAINTED / AT RISK', color: 'text-[#EF4444] bg-[#EF4444]/12 border-[#EF4444]/30' };
    }
  };

  const forensicsBadge = getForensicsBadge(choice.forensicsImpact ?? choice.forensicResult);

  return (
    <div
      data-testid={`decision_choice_${optionLetter}`}
      className="w-full bg-[#131D2E] rounded-xl border border-[#22334D] hover:border-[#00F0FF]/50 p-4 transition-all shadow-md"
    >
      {/* Header with Option Letter and Recommended By */}
      <div className="flex items-center justify-between mb-2.5">
        <div className="w-7 h-7 rounded-md bg-[#00F0FF]/15 border border-[#00F0FF]/40 flex items-center justify-center">
          <span className="text-sm font-black text-[#00F0FF]">{optionLetter}</span>
        </div>

        <div className="flex items-center gap-1.5 px-2 py-1 rounded-md bg-[#6366F1]/20 text-[#38BDF8]">
          <Brain className="w-3.5 h-3.5 text-[#38BDF8]" />
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
              ? 'text-[#EF4444] bg-[#EF4444]/12 border-[#EF4444]/30'
              : 'text-[#F59E0B] bg-[#F59E0B]/12 border-[#F59E0B]/30'
          }`}
        >
          <DollarSign className="w-3 h-3" />
          <span>+{formatCurrency(choice.costDeltaUsd)}</span>
        </div>

        {/* Time */}
        <div className="flex items-center gap-1 px-2 py-1 rounded-md border text-[10px] font-bold text-[#38BDF8] bg-[#38BDF8]/12 border-[#38BDF8]/30">
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
        className="w-full h-11 bg-[#00F0FF] hover:bg-[#00F0FF]/90 text-[#001F2B] font-extrabold text-xs tracking-wider rounded-lg flex items-center justify-center gap-1.5 transition-all shadow-md active:scale-[0.99]"
      >
        <span>EXECUTE ORDER</span>
        <ArrowRight className="w-4 h-4" />
      </button>
    </div>
  );
};
