import React from 'react';
import { ArrowRight, CheckSquare } from 'lucide-react';
import { DecisionChoice } from '../types';

interface DecisionFeedbackDialogProps {
  choice: DecisionChoice;
  isFinalPhase: boolean;
  onProceed: () => void;
}

export const DecisionFeedbackDialog: React.FC<DecisionFeedbackDialogProps> = ({
  choice,
  isFinalPhase,
  onProceed,
}) => {
  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="w-full max-w-lg bg-[#0f172a] border border-[#2dd4bf]/50 rounded-2xl p-5 max-h-[90vh] overflow-y-auto shadow-2xl animate-in fade-in zoom-in-95 duration-200">
        {/* Header badge */}
        <div className="flex items-center gap-3 mb-3.5">
          <div className="w-9 h-9 rounded-lg bg-[#2dd4bf]/20 flex items-center justify-center text-[#2dd4bf]">
            <CheckSquare className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] font-bold text-[#2dd4bf] tracking-wider block">
              ORDER EXECUTED
            </span>
            <h2 className="text-base font-bold text-[#F8FAFC]">Tactical Doctrine Assessment</h2>
          </div>
        </div>

        {/* Chosen Order Box */}
        <div className="bg-[#020617] border border-[#1e293b] rounded-lg p-3 mb-3.5">
          <span className="text-[10px] font-bold text-[#64748B] tracking-wider block mb-0.5">
            DECISION:
          </span>
          <p className="text-sm font-semibold text-[#F8FAFC]">{choice.title}</p>
        </div>

        {/* Doctrine Analysis */}
        <div className="mb-4">
          <span className="text-[11px] font-bold text-[#5eead4] tracking-wide block mb-1.5">
            DOCTRINE & REGULATORY ANALYSIS
          </span>
          <p className="text-xs text-[#94A3B8] leading-relaxed bg-[#020617]/50 p-3 rounded-lg border border-[#1e293b]/60">
            {choice.feedbackDoctrine}
          </p>
        </div>

        {/* Evaluated Competency Scores */}
        <div className="mb-5">
          <span className="text-[10px] font-bold text-[#64748B] uppercase tracking-wide block mb-2">
            EVALUATED COMPETENCY SCORES
          </span>
          <div className="space-y-1.5 bg-[#020617] p-3 rounded-lg border border-[#1e293b]">
            {Object.entries(choice.competencyScores || {}).map(([key, score]) => {
              const compScore = score as number;
              const scoreColor =
                compScore >= 85
                  ? 'text-[#34d399]'
                  : compScore >= 60
                  ? 'text-[#fbbf24]'
                  : 'text-[#f87171]';

              const formattedLabel = key
                .split('_')
                .map((w) => w.charAt(0) + w.slice(1).toLowerCase())
                .join(' ');

              return (
                <div key={key} className="flex items-center justify-between text-xs py-0.5">
                  <span className="text-[#94A3B8]">{formattedLabel}</span>
                  <span className={`font-bold font-mono ${scoreColor}`}>{compScore} / 100</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Action Button */}
        <button
          type="button"
          onClick={onProceed}
          data-testid="proceed_next_phase_button"
          className="w-full h-12 bg-[#2dd4bf] hover:bg-[#2dd4bf]/90 text-[#042f2e] font-extrabold text-xs tracking-wider rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg active:scale-[0.99]"
        >
          <span>{isFinalPhase ? 'GENERATE AFTER-ACTION REPORT' : 'PROCEED TO NEXT INJECT'}</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
