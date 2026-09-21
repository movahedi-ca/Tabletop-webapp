import React, { useState, useMemo } from 'react';
import {
  History,
  Trash2,
  Play,
  Shield,
  Clock,
  DollarSign,
  AlertCircle,
  Gavel,
  Download,
  Search,
  CheckCircle2,
  ArrowRight,
  Award,
} from 'lucide-react';
import { useSimulation } from '../context/SimulationContext';
import { Screen, SimulationRecord } from '../types';
import { formatCurrency, formatDate } from '../utils/format';

export const HistoryScreen: React.FC = () => {
  const { pastDrills, deletePastDrill, clearAllPastDrills, navigateTo } = useSimulation();
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [searchFilter, setSearchFilter] = useState('');

  const totalExposure = pastDrills.reduce((acc, r) => acc + (r.finalCostUsd || 0), 0);
  const avgReadiness =
    pastDrills.length > 0
      ? Math.round(pastDrills.reduce((acc, r) => acc + (r.totalScore || 0), 0) / pastDrills.length)
      : 0;

  const bestGrade = useMemo(() => {
    if (pastDrills.length === 0) return 'N/A';
    const grades = ['A+', 'A', 'B', 'C', 'D', 'F'];
    for (const g of grades) {
      if (pastDrills.some((d) => d.letterGrade === g)) return g;
    }
    return pastDrills[0].letterGrade || 'B';
  }, [pastDrills]);

  const filteredDrills = useMemo(() => {
    const q = searchFilter.trim().toLowerCase();
    if (!q) return pastDrills;
    return pastDrills.filter(
      (d) =>
        d.scenarioTitle.toLowerCase().includes(q) ||
        (d.letterGrade && d.letterGrade.toLowerCase().includes(q))
    );
  }, [pastDrills, searchFilter]);

  const getGradeBadge = (grade: string) => {
    switch (grade) {
      case 'A+':
      case 'A':
        return 'text-[#34d399] bg-[#34d399]/15 border-[#34d399]/30';
      case 'B':
        return 'text-[#2dd4bf] bg-[#2dd4bf]/15 border-[#2dd4bf]/30';
      case 'C':
        return 'text-[#fbbf24] bg-[#fbbf24]/15 border-[#fbbf24]/30';
      case 'D':
      case 'F':
      default:
        return 'text-[#f87171] bg-[#f87171]/15 border-[#f87171]/30';
    }
  };

  const handleExportAll = () => {
    const dataStr =
      'data:text/json;charset=utf-8,' +
      encodeURIComponent(JSON.stringify(pastDrills, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `tabletop-archives-export-${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="w-full bg-[#020617] text-[#F8FAFC] pb-24 md:pb-12 px-4 md:px-8 pt-4 md:pt-6 max-w-7xl mx-auto">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 border-b border-[#1e293b] pb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2 h-2 rounded-full bg-[#14b8a6]" />
            <span className="text-[10px] font-extrabold tracking-widest text-[#2dd4bf] uppercase">
              TABLETOP DRILL ARCHIVES & AUDIT LOGS
            </span>
          </div>
          <h1 className="text-2xl md:text-3xl font-black text-[#F8FAFC]">
            Historical Incident Debriefs
          </h1>
          <p className="text-xs md:text-sm text-[#94A3B8] mt-1 max-w-xl leading-relaxed">
            Archival records of tabletop crisis containment runs, competency evaluations, and statutory disclosure performance.
          </p>
        </div>

        {pastDrills.length > 0 && (
          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={handleExportAll}
              data-testid="export_history_button"
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#0f172a] hover:bg-[#1E293B] border border-[#1e293b] text-xs font-bold text-[#5eead4] transition-all"
            >
              <Download className="w-3.5 h-3.5" />
              <span>EXPORT ARCHIVES</span>
            </button>

            <button
              type="button"
              onClick={() => setShowClearConfirm(true)}
              data-testid="clear_history_button"
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#f87171]/10 hover:bg-[#f87171]/20 border border-[#f87171]/30 text-[#f87171] text-xs font-bold transition-all"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>CLEAR LOGS</span>
            </button>
          </div>
        )}
      </div>

      {/* Summary KPI Ribbon */}
      {pastDrills.length > 0 && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
          <div className="bg-[#0f172a] border border-[#1e293b] rounded-2xl p-4 shadow-md">
            <span className="text-[10px] font-bold text-[#64748B] uppercase block mb-1">
              TOTAL DRILLS EXECUTED
            </span>
            <span className="text-xl md:text-3xl font-black font-mono text-[#2dd4bf]">
              {pastDrills.length}
            </span>
            <span className="text-[10px] text-[#94A3B8] mt-0.5 block">Logged sessions</span>
          </div>

          <div className="bg-[#0f172a] border border-[#1e293b] rounded-2xl p-4 shadow-md">
            <span className="text-[10px] font-bold text-[#64748B] uppercase block mb-1">
              MEAN READINESS SCORE
            </span>
            <span
              className={`text-xl md:text-3xl font-black font-mono ${
                avgReadiness >= 80
                  ? 'text-[#34d399]'
                  : avgReadiness >= 60
                  ? 'text-[#fbbf24]'
                  : 'text-[#f87171]'
              }`}
            >
              {avgReadiness}%
            </span>
            <span className="text-[10px] text-[#94A3B8] mt-0.5 block">Overall capability</span>
          </div>

          <div className="bg-[#0f172a] border border-[#1e293b] rounded-2xl p-4 shadow-md">
            <span className="text-[10px] font-bold text-[#64748B] uppercase block mb-1">
              BEST RECORDED GRADE
            </span>
            <span className="text-xl md:text-3xl font-black font-mono text-[#34d399]">
              {bestGrade}
            </span>
            <span className="text-[10px] text-[#94A3B8] mt-0.5 block">Peak crisis leadership</span>
          </div>

          <div className="bg-[#0f172a] border border-[#1e293b] rounded-2xl p-4 shadow-md">
            <span className="text-[10px] font-bold text-[#64748B] uppercase block mb-1">
              TOTAL EXPOSURE MITIGATED
            </span>
            <span className="text-base md:text-2xl font-bold font-mono text-[#fbbf24] truncate block">
              {formatCurrency(totalExposure)}
            </span>
            <span className="text-[10px] text-[#94A3B8] mt-0.5 block">Cumulative losses</span>
          </div>
        </div>
      )}

      {/* Empty State */}
      {pastDrills.length === 0 ? (
        <div className="bg-[#0f172a] border border-[#1e293b] rounded-2xl p-8 md:p-12 text-center shadow-lg max-w-xl mx-auto">
          <div className="w-16 h-16 rounded-2xl bg-[#2dd4bf]/10 border border-[#2dd4bf]/30 flex items-center justify-center text-[#2dd4bf] mx-auto mb-4">
            <Shield className="w-8 h-8" />
          </div>

          <h3 className="text-lg font-bold text-[#F8FAFC] mb-2">No Incident Drills Recorded Yet</h3>
          <p className="text-xs md:text-sm text-[#94A3B8] leading-relaxed mb-6 max-w-md mx-auto">
            Launch a tabletop crisis scenario from the War Room to stress-test your incident command team, evaluate statutory compliance, and archive readiness ratings.
          </p>

          <button
            type="button"
            onClick={() => navigateTo(Screen.HOME)}
            data-testid="empty_state_start_drill_button"
            className="w-full sm:w-auto px-6 py-3.5 bg-[#2dd4bf] hover:bg-[#2dd4bf]/90 text-[#042f2e] font-extrabold text-xs tracking-wider rounded-xl inline-flex items-center justify-center gap-2 transition-all shadow-md"
          >
            <Play className="w-4 h-4 fill-current" />
            <span>LAUNCH FIRST INCIDENT DRILL</span>
          </button>
        </div>
      ) : (
        /* Records List & Grid */
        <div>
          {/* Search Filter for records */}
          <div className="relative max-w-md mb-4">
            <Search className="w-4 h-4 text-[#64748B] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchFilter}
              onChange={(e) => setSearchFilter(e.target.value)}
              placeholder="Search historical records by scenario title or grade..."
              className="w-full bg-[#0f172a] border border-[#1e293b] rounded-xl pl-9 pr-3 py-2 text-xs text-[#F8FAFC] placeholder-[#64748B] focus:outline-none focus:border-[#2dd4bf]/60 transition-colors"
            />
          </div>

          {/* Records Responsive Grid (1 col on mobile, 2 cols on tablet/desktop) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredDrills.map((record) => (
              <div
                key={record.id}
                className="bg-[#0f172a] border border-[#1e293b] hover:border-[#2dd4bf]/40 rounded-2xl p-5 shadow-md transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-12 h-12 rounded-xl border flex flex-col items-center justify-center font-black font-mono text-lg shrink-0 ${getGradeBadge(
                          record.letterGrade
                        )}`}
                      >
                        <span className="text-[8px] font-sans text-[#94A3B8]">GRADE</span>
                        <span className="leading-none">{record.letterGrade}</span>
                      </div>
                      <div>
                        <h4 className="text-sm md:text-base font-bold text-[#F8FAFC] line-clamp-1">
                          {record.scenarioTitle}
                        </h4>
                        <span className="text-[11px] font-mono text-[#64748B]">
                          {formatDate(record.completedAt || record.timestamp || Date.now())}
                        </span>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => deletePastDrill(record.id)}
                      data-testid={`delete_record_button_${record.id}`}
                      className="text-[#64748B] hover:text-[#f87171] p-1.5 rounded-lg hover:bg-[#f87171]/10 transition-colors shrink-0"
                      title="Delete record"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div>
                  {/* Record Metrics */}
                  <div className="grid grid-cols-4 gap-2 pt-3 border-t border-[#1e293b] text-xs font-mono mb-2">
                    <div>
                      <span className="text-[9px] text-[#64748B] uppercase block">SCORE</span>
                      <span className="font-bold text-[#2dd4bf] text-sm">{record.totalScore}%</span>
                    </div>
                    <div>
                      <span className="text-[9px] text-[#64748B] uppercase block">COST</span>
                      <span className="font-bold text-[#fbbf24] truncate block text-xs md:text-sm">
                        {formatCurrency(record.finalCostUsd || 0)}
                      </span>
                    </div>
                    <div>
                      <span className="text-[9px] text-[#64748B] uppercase block">TIME</span>
                      <span className="font-bold text-[#5eead4] text-sm">
                        {record.totalTimeHours || 0}h
                      </span>
                    </div>
                    <div>
                      <span className="text-[9px] text-[#64748B] uppercase block">TRUST</span>
                      <span className="font-bold text-[#34d399] text-sm">
                        {record.publicTrustPercent}%
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Clear Confirmation Dialog */}
      {showClearConfirm && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-sm bg-[#0f172a] border border-[#f87171]/40 rounded-2xl p-5 shadow-2xl">
            <div className="flex items-center gap-2 text-[#f87171] mb-2">
              <AlertCircle className="w-5 h-5" />
              <h3 className="text-base font-bold text-[#F8FAFC]">Clear All Incident Archives?</h3>
            </div>
            <p className="text-xs text-[#94A3B8] leading-relaxed mb-4">
              This action will permanently purge all logged incident debriefs and performance metrics. This cannot be undone.
            </p>
            <div className="flex gap-2.5">
              <button
                type="button"
                onClick={() => setShowClearConfirm(false)}
                className="flex-1 py-2.5 rounded-xl bg-[#020617] border border-[#1e293b] text-xs font-semibold text-[#94A3B8] hover:text-[#F8FAFC]"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowClearConfirm(false);
                  clearAllPastDrills();
                }}
                className="flex-1 py-2.5 rounded-xl bg-[#f87171] text-[#F8FAFC] text-xs font-bold hover:bg-[#f87171]/90"
              >
                Clear All
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
