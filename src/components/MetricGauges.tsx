import React from 'react';
import { DollarSign, Shield, Gavel, Lock } from 'lucide-react';
import { LiveMetrics, LegalRiskLevel, ForensicIntegrity } from '../types';
import { formatCurrency } from '../utils/format';

interface LiveWarRoomMetersProps {
  metrics: LiveMetrics;
  className?: string;
}

export const LiveWarRoomMeters: React.FC<LiveWarRoomMetersProps> = ({ metrics, className = '' }) => {
  return (
    <div
      className={`w-full bg-[#0f172a] rounded-xl border border-[#1e293b] p-3.5 shadow-lg ${className}`}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-2.5">
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-[#f87171] animate-pulse" />
          <span className="text-[10px] tracking-widest font-bold text-[#2dd4bf]">
            LIVE INCIDENT TELEMETRY
          </span>
        </div>
        <span className="text-[10px] font-mono font-bold text-[#94A3B8]">
          {metrics.timeElapsedHours}h ELAPSED
        </span>
      </div>

      {/* Cost & Trust Row */}
      <div className="grid grid-cols-2 gap-2.5 mb-2">
        {/* Cost Metric Box */}
        <MetricBox
          title="EST. IMPACT COST"
          value={formatCurrency(metrics.financialCostUsd)}
          icon={<DollarSign className="w-3.5 h-3.5 text-[#fbbf24]" />}
          accentColor={metrics.financialCostUsd > 2000000 ? 'text-[#f87171]' : 'text-[#fbbf24]'}
        />

        {/* Public Trust Box */}
        <TrustMetricBox trustPercent={metrics.publicTrustPercent} />
      </div>

      {/* Legal Risk & Forensic Integrity Status Row */}
      <div className="grid grid-cols-2 gap-2">
        <StatusPill
          label="LEGAL RISK"
          value={metrics.legalRisk}
          icon={<Gavel className="w-3 h-3" />}
          riskLevel={metrics.legalRisk}
        />
        <StatusPill
          label="FORENSICS"
          value={metrics.forensicIntegrity}
          icon={<Lock className="w-3 h-3" />}
          integrityLevel={metrics.forensicIntegrity}
        />
      </div>
    </div>
  );
};

export const MetricBox: React.FC<{
  title: string;
  value: string;
  icon: React.ReactNode;
  accentColor: string;
}> = ({ title, value, icon, accentColor }) => {
  return (
    <div className="bg-[#020617] border border-[#1e293b] rounded-lg p-2.5 flex flex-col justify-between">
      <div className="flex items-center gap-1">
        {icon}
        <span className="text-[10px] font-semibold text-[#94A3B8]">{title}</span>
      </div>
      <span className={`text-[15px] font-mono font-bold mt-1 ${accentColor}`}>{value}</span>
    </div>
  );
};

export const TrustMetricBox: React.FC<{ trustPercent: number }> = ({ trustPercent }) => {
  const getTrustColor = (pct: number) => {
    if (pct >= 75) return 'text-[#34d399]';
    if (pct >= 50) return 'text-[#fbbf24]';
    return 'text-[#f87171]';
  };

  const getBarColor = (pct: number) => {
    if (pct >= 75) return 'bg-[#34d399]';
    if (pct >= 50) return 'bg-[#fbbf24]';
    return 'bg-[#f87171]';
  };

  const colorClass = getTrustColor(trustPercent);
  const barColorClass = getBarColor(trustPercent);

  return (
    <div className="bg-[#020617] border border-[#1e293b] rounded-lg p-2.5 flex flex-col justify-between">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1">
          <Shield className={`w-3.5 h-3.5 ${colorClass}`} />
          <span className="text-[10px] font-semibold text-[#94A3B8]">PUBLIC TRUST</span>
        </div>
        <span className={`text-[11px] font-mono font-bold ${colorClass}`}>{trustPercent}%</span>
      </div>
      <div className="w-full bg-[#1E293B] h-1.5 rounded-full overflow-hidden mt-2">
        <div
          className={`h-full transition-all duration-500 rounded-full ${barColorClass}`}
          style={{ width: `${Math.min(100, Math.max(0, trustPercent))}%` }}
        />
      </div>
    </div>
  );
};

export const StatusPill: React.FC<{
  label: string;
  value: string;
  icon: React.ReactNode;
  riskLevel?: LegalRiskLevel;
  integrityLevel?: ForensicIntegrity;
}> = ({ label, value, icon, riskLevel, integrityLevel }) => {
  let colorStyle = 'text-[#34d399] border-[#34d399]/30';
  let badgeColor = 'text-[#34d399]';

  if (riskLevel) {
    if (riskLevel === LegalRiskLevel.MINIMAL || riskLevel === LegalRiskLevel.LOW) {
      colorStyle = 'border-[#34d399]/30';
      badgeColor = 'text-[#34d399]';
    } else if (riskLevel === LegalRiskLevel.MODERATE) {
      colorStyle = 'border-[#fbbf24]/30';
      badgeColor = 'text-[#fbbf24]';
    } else if (riskLevel === LegalRiskLevel.HIGH) {
      colorStyle = 'border-[#FB923C]/30';
      badgeColor = 'text-[#FB923C]';
    } else {
      colorStyle = 'border-[#f87171]/30';
      badgeColor = 'text-[#f87171]';
    }
  } else if (integrityLevel) {
    if (integrityLevel === ForensicIntegrity.INTACT) {
      colorStyle = 'border-[#34d399]/30';
      badgeColor = 'text-[#34d399]';
    } else if (integrityLevel === ForensicIntegrity.PARTIALLY_COMPROMISED) {
      colorStyle = 'border-[#fbbf24]/30';
      badgeColor = 'text-[#fbbf24]';
    } else {
      colorStyle = 'border-[#f87171]/30';
      badgeColor = 'text-[#f87171]';
    }
  }

  return (
    <div className={`bg-[#020617] border rounded-lg px-2.5 py-1.5 flex items-center gap-2 ${colorStyle}`}>
      <span className={badgeColor}>{icon}</span>
      <div className="flex flex-col min-w-0">
        <span className="text-[8px] font-bold text-[#94A3B8] uppercase">{label}</span>
        <span className={`text-[10px] font-bold truncate ${badgeColor}`}>{value}</span>
      </div>
    </div>
  );
};
