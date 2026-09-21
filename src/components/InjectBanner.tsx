import React from 'react';
import { AlertTriangle, Radio } from 'lucide-react';
import { BreakingInject } from '../types';

interface InjectBannerProps {
  inject: BreakingInject;
}

export const InjectBanner: React.FC<InjectBannerProps> = ({ inject }) => {
  return (
    <div className="w-full bg-[#EF4444]/10 border border-[#EF4444]/40 rounded-xl p-3.5 mb-4 shadow-sm">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-md bg-[#EF4444]/20 flex items-center justify-center text-[#EF4444]">
            <Radio className="w-3.5 h-3.5" />
          </div>
          <span className="text-[10px] font-black tracking-widest text-[#EF4444] uppercase">
            BREAKING CRISIS INJECT
          </span>
        </div>
        {inject.urgent && (
          <span className="text-[9px] font-bold font-mono px-1.5 py-0.5 bg-[#EF4444] text-[#F8FAFC] rounded uppercase">
            URGENT
          </span>
        )}
      </div>

      <div className="flex items-start gap-2">
        <AlertTriangle className="w-4 h-4 text-[#EF4444] shrink-0 mt-0.5" />
        <div>
          <div className="flex items-center gap-1.5 mb-1">
            <span className="text-[10px] font-mono px-1.5 py-0.5 bg-[#EF4444]/20 text-[#FCA5A5] rounded">
              {inject.source}
            </span>
            <h4 className="text-xs font-bold text-[#F8FAFC]">{inject.title}</h4>
          </div>
          <p className="text-xs text-[#FCA5A5] leading-relaxed">{inject.message}</p>
        </div>
      </div>
    </div>
  );
};
