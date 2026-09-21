import React from 'react';
import {
  ShieldCheck,
  DollarSign,
  Clock,
  Shield,
  Gavel,
  ChevronRight,
  Sparkles,
  RotateCcw,
  CheckCircle2,
  Download,
  Printer,
  FileCheck,
  AlertTriangle,
  Award,
} from 'lucide-react';
import { useSimulation } from '../context/SimulationContext';
import { Competency } from '../types';
import { formatCurrency, formatDate } from '../utils/format';
import { MovahediData } from '../data/movahediData';

export const AarReportScreen: React.FC = () => {
  const { afterActionReport, returnToHome } = useSimulation();

  if (!afterActionReport) {
    return (
      <div className="min-h-screen bg-[#0B101B] flex flex-col items-center justify-center p-4">
        <p className="text-sm text-[#94A3B8] mb-4">No After-Action Report available.</p>
        <button
          onClick={returnToHome}
          className="px-4 py-2 bg-[#00F0FF] text-[#001F2B] font-bold rounded-lg text-xs"
        >
          Return to Command Center
        </button>
      </div>
    );
  }

  const getGradeColor = (grade: string) => {
    switch (grade) {
      case 'A+':
      case 'A':
        return 'text-[#10B981] bg-[#10B981]/15 border-[#10B981]/40 shadow-[0_0_15px_rgba(16,185,129,0.3)]';
      case 'B':
        return 'text-[#00F0FF] bg-[#00F0FF]/15 border-[#00F0FF]/40 shadow-[0_0_15px_rgba(0,240,255,0.3)]';
      case 'C':
        return 'text-[#F59E0B] bg-[#F59E0B]/15 border-[#F59E0B]/40 shadow-[0_0_15px_rgba(245,158,11,0.3)]';
      case 'D':
      case 'F':
      default:
        return 'text-[#EF4444] bg-[#EF4444]/15 border-[#EF4444]/40 shadow-[0_0_15px_rgba(239,68,68,0.3)]';
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-[#10B981]';
    if (score >= 60) return 'text-[#F59E0B]';
    return 'text-[#EF4444]';
  };

  const getBarColor = (score: number) => {
    if (score >= 80) return 'bg-[#10B981]';
    if (score >= 60) return 'bg-[#F59E0B]';
    return 'bg-[#EF4444]';
  };

  const competencyLabels: Record<string, string> = {
    [Competency.DETECTION_TRIAGE]: 'Detection & Initial Triage',
    [Competency.CONTAINMENT_SPEED]: 'Containment Strategy & Speed',
    [Competency.LEGAL_COMPLIANCE]: 'Statutory Legal & Regulatory Compliance',
    [Competency.CRISIS_COMMS]: 'Public Relations & Stakeholder Comms',
    [Competency.BUSINESS_RESILIENCE]: 'Business Continuity & Operations',
    [Competency.EXECUTIVE_COMMAND]: 'Executive Crisis Command',
    [Competency.EXECUTIVE_CRISIS_LEADERSHIP]: 'Executive Crisis Leadership',
    [Competency.REGULATORY_COMPLIANCE]: 'Regulatory Disclosure & Compliance',
    [Competency.FORENSIC_TRIAGE]: 'Digital Forensics & Chain-of-Custody',
    [Competency.FORENSIC_PRESERVATION]: 'Forensic Evidence Preservation',
    [Competency.PUBLIC_COMMUNICATIONS]: 'Public Relations & Customer Trust',
    [Competency.TECHNICAL_CONTAINMENT]: 'Technical Isolation & Containment',
  };

  const overallScore = afterActionReport.overallScore ?? 0;
  const keyTakeaways = afterActionReport.keyTakeaways ?? [];

  const handleExportJson = () => {
    const dataStr =
      'data:text/json;charset=utf-8,' +
      encodeURIComponent(JSON.stringify(afterActionReport, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute(
      'download',
      `tabletop-aar-${afterActionReport.scenarioId || 'drill'}-${Date.now()}.json`
    );
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="w-full bg-[#0B101B] text-[#F8FAFC] pb-28 md:pb-16 px-4 md:px-8 pt-4 md:pt-6 max-w-7xl mx-auto">
      {/* Top Banner & Action Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 border-b border-[#22334D] pb-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#131D2E] border border-[#22334D] text-[#00F0FF] text-[10px] font-black tracking-widest uppercase mb-1.5">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>INCIDENT DEBRIEF COMPLETE // OFFICIAL AUDIT REPORT</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-black text-[#F8FAFC]">
            {afterActionReport.scenarioTitle}
          </h1>
          <p className="text-xs text-[#94A3B8] font-mono mt-0.5">
            Conducted on {formatDate(afterActionReport.completedAt ?? afterActionReport.completedAtTimestamp ?? Date.now())}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={handleExportJson}
            data-testid="export_aar_json_button"
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#131D2E] hover:bg-[#1E293B] border border-[#22334D] text-xs font-bold text-[#38BDF8] transition-all"
            title="Export JSON audit record"
          >
            <Download className="w-3.5 h-3.5" />
            <span>EXPORT JSON</span>
          </button>

          <button
            type="button"
            onClick={handlePrint}
            data-testid="print_aar_button"
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#131D2E] hover:bg-[#1E293B] border border-[#22334D] text-xs font-bold text-[#CBD5E1] transition-all"
            title="Print or save as PDF"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>PRINT</span>
          </button>

          <button
            type="button"
            onClick={returnToHome}
            data-testid="aar_return_home_top_button"
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#00F0FF] hover:bg-[#00F0FF]/90 text-[#001F2B] text-xs font-black tracking-wide transition-all shadow-md"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>RETURN TO COMMAND</span>
          </button>
        </div>
      </div>

      {/* Outcome Telemetry Ribbon (4 KPI Cards) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        <div className="bg-[#131D2E] border border-[#22334D] rounded-2xl p-4 shadow-md">
          <div className="flex items-center gap-1.5 text-[#64748B] text-[10px] font-bold uppercase mb-1">
            <DollarSign className="w-4 h-4 text-[#F59E0B]" />
            <span>FINAL COST EXPOSURE</span>
          </div>
          <span className="text-lg md:text-2xl font-black font-mono text-[#F59E0B] block">
            {formatCurrency(afterActionReport.finalCostUsd ?? afterActionReport.financialCostUsd ?? 0)}
          </span>
          <span className="text-[10px] text-[#94A3B8] mt-0.5 block">Direct losses & mitigation</span>
        </div>

        <div className="bg-[#131D2E] border border-[#22334D] rounded-2xl p-4 shadow-md">
          <div className="flex items-center gap-1.5 text-[#64748B] text-[10px] font-bold uppercase mb-1">
            <Clock className="w-4 h-4 text-[#38BDF8]" />
            <span>CONTAINMENT WINDOW</span>
          </div>
          <span className="text-lg md:text-2xl font-black font-mono text-[#38BDF8] block">
            {afterActionReport.totalTimeHours ?? afterActionReport.timeElapsedHours ?? 0} Hours
          </span>
          <span className="text-[10px] text-[#94A3B8] mt-0.5 block">Time to incident closure</span>
        </div>

        <div className="bg-[#131D2E] border border-[#22334D] rounded-2xl p-4 shadow-md">
          <div className="flex items-center gap-1.5 text-[#64748B] text-[10px] font-bold uppercase mb-1">
            <Shield className="w-4 h-4 text-[#10B981]" />
            <span>RETAINED PUBLIC TRUST</span>
          </div>
          <span className="text-lg md:text-2xl font-black font-mono text-[#10B981] block">
            {afterActionReport.publicTrustPercent ?? 90}%
          </span>
          <span className="text-[10px] text-[#94A3B8] mt-0.5 block">Stakeholder sentiment</span>
        </div>

        <div className="bg-[#131D2E] border border-[#22334D] rounded-2xl p-4 shadow-md">
          <div className="flex items-center gap-1.5 text-[#64748B] text-[10px] font-bold uppercase mb-1">
            <Gavel className="w-4 h-4 text-[#EF4444]" />
            <span>DEFENSIBLE LEGAL RISK</span>
          </div>
          <span className="text-base md:text-xl font-bold font-mono text-[#F8FAFC] block">
            {afterActionReport.legalRisk || 'MINIMAL'}
          </span>
          <span className="text-[10px] text-[#94A3B8] mt-0.5 block">Statutory liability exposure</span>
        </div>
      </div>

      {/* Main Analysis Grid: Left Executive Scorecard / Right Orders Timeline */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
        {/* Left Column: Grade, Competencies & Lessons (6 of 12 cols) */}
        <div className="lg:col-span-6 space-y-5">
          {/* Grade & Overall Score Card */}
          <div className="bg-[#131D2E] border border-[#22334D] rounded-2xl p-5 relative overflow-hidden shadow-xl">
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#00F0FF] via-[#6366F1] to-[#10B981]" />

            <div className="flex items-center justify-between gap-6">
              {/* Grade Badge */}
              <div
                data-testid="aar_grade_badge"
                className={`w-24 h-24 rounded-2xl border flex flex-col items-center justify-center font-black ${getGradeColor(
                  afterActionReport.letterGrade
                )}`}
              >
                <span className="text-[10px] tracking-wider text-[#94A3B8]">READINESS GRADE</span>
                <span className="text-4xl font-mono leading-none">{afterActionReport.letterGrade}</span>
              </div>

              {/* Readiness Index */}
              <div className="flex-1" data-testid="aar_readiness_score">
                <span className="text-[10px] font-bold text-[#64748B] tracking-wider uppercase block mb-0.5">
                  OVERALL READINESS INDEX
                </span>
                <div className="flex items-baseline gap-1">
                  <span className={`text-4xl md:text-5xl font-mono font-black ${getScoreColor(overallScore)}`}>
                    {overallScore}
                  </span>
                  <span className="text-sm text-[#64748B] font-mono">/ 100</span>
                </div>
                <p className="text-xs text-[#CBD5E1] mt-1 font-medium">
                  {overallScore >= 85
                    ? 'Superior crisis containment; legal privilege preserved with prompt statutory disclosures.'
                    : overallScore >= 70
                    ? 'Competent containment; minor opportunities for disclosure synchronization.'
                    : 'Critical deficiencies in regulatory disclosure clocks or forensic chain-of-custody.'}
                </p>
              </div>
            </div>
          </div>

          {/* Competencies Scorecard */}
          <div className="bg-[#131D2E] border border-[#22334D] rounded-2xl p-5 shadow-md">
            <div className="flex items-center justify-between mb-4 pb-2.5 border-b border-[#22334D]">
              <span className="text-xs font-black tracking-widest text-[#00F0FF] uppercase">
                INCIDENT COMMAND COMPETENCY AUDIT
              </span>
              <span className="text-[10px] text-[#64748B] font-mono">BENCHMARK: ICS-300</span>
            </div>

            <div className="space-y-3.5">
              {Object.entries(afterActionReport.competencyScores || {}).map(([compKey, score]) => {
                const comp = compKey as Competency;
                const label = competencyLabels[comp] || compKey;
                const val = typeof score === 'number' ? score : (score as any)?.score ?? 75;

                return (
                  <div key={compKey}>
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="text-[#F8FAFC] font-semibold">{label}</span>
                      <span className={`font-mono font-bold ${getScoreColor(val)}`}>{val}%</span>
                    </div>
                    <div className="w-full bg-[#0B101B] h-2 rounded-full overflow-hidden border border-[#22334D]/60">
                      <div
                        className={`h-full rounded-full transition-all duration-700 ${getBarColor(val)}`}
                        style={{ width: `${val}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Executive Summary Findings */}
          <div className="bg-[#131D2E] border border-[#22334D] rounded-2xl p-5 shadow-md">
            <span className="text-xs font-black tracking-widest text-[#38BDF8] uppercase block mb-2.5">
              EXECUTIVE FINDINGS & DOCTRINE EVALUATION
            </span>
            <p className="text-xs md:text-sm text-[#CBD5E1] leading-relaxed">
              {afterActionReport.executiveSummary}
            </p>
          </div>

          {/* Key Doctrine Lessons */}
          <div className="bg-[#131D2E] border border-[#22334D] rounded-2xl p-5 shadow-md">
            <span className="text-xs font-black tracking-widest text-[#10B981] uppercase block mb-3">
              KEY DOCTRINE LESSONS LEARNED
            </span>
            <div className="space-y-2.5">
              {keyTakeaways.map((lesson, idx) => (
                <div key={idx} className="flex items-start gap-2.5 text-xs text-[#CBD5E1]">
                  <CheckCircle2 className="w-4 h-4 text-[#10B981] shrink-0 mt-0.5" />
                  <span className="leading-relaxed">{lesson}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Movahedi Strategic Incident Advisory Card */}
          <div className="bg-gradient-to-br from-[#131D2E] to-[#1E293B] border border-[#6366F1]/50 rounded-2xl p-5 shadow-lg">
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="w-4 h-4 text-[#00F0FF]" />
              <span className="text-[10px] font-extrabold tracking-widest text-[#00F0FF] uppercase">
                POST-INCIDENT GOVERNANCE ADVISORY
              </span>
            </div>
            <h4 className="text-sm font-bold text-[#F8FAFC] mb-1">
              Harden Your Incident Response Program with {MovahediData.CONSULTANT_NAME}
            </h4>
            <p className="text-xs text-[#94A3B8] leading-relaxed mb-3">
              Independent strategic counsel for boardroom crisis preparation, PIPEDA & Quebec Law 25 breach audit defense, and technical containment frameworks.
            </p>
            <div className="flex gap-2">
              <a
                href={MovahediData.DISCOVERY_CALL_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 py-2.5 bg-[#00F0FF] hover:bg-[#00F0FF]/90 text-[#001F2B] rounded-xl text-xs font-extrabold flex items-center justify-center gap-1.5 transition-all shadow-md"
              >
                <span>Book Advisory Session</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </a>
              <a
                href={MovahediData.WEBSITE_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2.5 bg-transparent hover:bg-[#1E293B] border border-[#22334D] text-[#38BDF8] rounded-xl text-xs font-bold transition-all flex items-center justify-center"
              >
                <span>movahedi.ca</span>
              </a>
            </div>
          </div>
        </div>

        {/* Right Column: Tactical Orders Timeline & Regulatory Audit (6 of 12 cols) */}
        <div className="lg:col-span-6 space-y-5">
          {/* Tactical Orders Timeline */}
          <div className="bg-[#131D2E] border border-[#22334D] rounded-2xl p-5 shadow-md">
            <div className="flex items-center justify-between mb-4 pb-2.5 border-b border-[#22334D]">
              <span className="text-xs font-black tracking-widest text-[#00F0FF] uppercase">
                TACTICAL ORDERS CHRONICLE
              </span>
              <span className="text-[10px] font-mono text-[#64748B]">
                {(afterActionReport.decisions || afterActionReport.decisionsTimeline || []).length} PHASES
              </span>
            </div>

            <div className="space-y-4">
              {(afterActionReport.decisions || afterActionReport.decisionsTimeline || []).map((item, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-xl bg-[#0B101B] border border-[#22334D] relative"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-mono font-bold text-[#00F0FF] bg-[#00F0FF]/10 px-2 py-0.5 rounded border border-[#00F0FF]/30 uppercase">
                      PHASE {item.phaseNumber} • {item.phaseTitle}
                    </span>
                    <span className="text-[10px] text-[#64748B]">
                      {item.choice.recommendedBy}
                    </span>
                  </div>

                  <h5 className="font-bold text-[#F8FAFC] text-sm mb-1.5">{item.choice.title}</h5>

                  <p className="text-xs text-[#CBD5E1] bg-[#131D2E] p-3 rounded-lg border border-[#22334D]/80 leading-relaxed mb-2.5">
                    {item.choice.feedbackDoctrine}
                  </p>

                  <div className="flex items-center justify-between text-[11px] text-[#64748B] pt-1">
                    <div className="flex items-center gap-3 font-mono">
                      <span className="text-[#F59E0B]">+{formatCurrency(item.choice.costDeltaUsd)}</span>
                      <span>+{item.choice.timeDeltaHours}h window</span>
                    </div>
                    <span className="text-[#38BDF8] font-semibold text-[10px]">
                      {item.choice.forensicsImpact || item.choice.forensicResult || 'Preserved'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
