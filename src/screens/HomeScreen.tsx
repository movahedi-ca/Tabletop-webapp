import React, { useState, useMemo } from 'react';
import {
  Shield,
  Sparkles,
  Terminal,
  BookOpen,
  ChevronRight,
  Activity,
  Search,
  AlertTriangle,
  Play,
  Clock,
  Layers,
  Award,
  ExternalLink,
  Filter,
} from 'lucide-react';
import { allScenarios } from '../data/scenariosData';
import { ScenarioCard } from '../components/ScenarioCard';
import { useSimulation } from '../context/SimulationContext';
import { Screen, IncidentScenario, IncidentSeverity } from '../types';
import { MovahediData } from '../data/movahediData';
import { formatDate } from '../utils/format';

export const HomeScreen: React.FC = () => {
  const { selectScenario, navigateTo, pastDrills } = useSimulation();
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [selectedSeverity, setSelectedSeverity] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const categories: string[] = useMemo(() => {
    const unique = Array.from(new Set(allScenarios.map((s) => s.category as string).filter(Boolean)));
    return ['ALL', ...unique];
  }, []);

  const filteredScenarios: IncidentScenario[] = useMemo(() => {
    return allScenarios.filter((scenario) => {
      const matchesCategory =
        selectedCategory === 'ALL' || scenario.category === selectedCategory;

      const matchesSeverity =
        selectedSeverity === 'ALL' ||
        (selectedSeverity === 'CRITICAL' &&
          (scenario.severity === IncidentSeverity.CRITICAL ||
            scenario.severity === IncidentSeverity.DEFCON_1_CRITICAL ||
            scenario.severity === IncidentSeverity.CATASTROPHIC)) ||
        (selectedSeverity === 'HIGH' &&
          (scenario.severity === IncidentSeverity.HIGH ||
            scenario.severity === IncidentSeverity.DEFCON_2_SEVERE)) ||
        (selectedSeverity === 'MEDIUM' &&
          (scenario.severity === IncidentSeverity.MEDIUM ||
            scenario.severity === IncidentSeverity.DEFCON_3_ELEVATED));

      const query = searchQuery.trim().toLowerCase();
      const matchesSearch =
        !query ||
        scenario.title.toLowerCase().includes(query) ||
        scenario.codename.toLowerCase().includes(query) ||
        scenario.threatActor.toLowerCase().includes(query) ||
        (scenario.overview && scenario.overview.toLowerCase().includes(query));

      return matchesCategory && matchesSeverity && matchesSearch;
    });
  }, [selectedCategory, selectedSeverity, searchQuery]);

  // Aggregate stats
  const totalCompleted = pastDrills.length;
  const avgReadiness =
    totalCompleted > 0
      ? Math.round(pastDrills.reduce((acc, r) => acc + (r.totalScore || 0), 0) / totalCompleted)
      : null;

  return (
    <div className="w-full bg-[#020617] text-[#F8FAFC] pb-24 md:pb-12 px-4 md:px-8 pt-4 md:pt-6 max-w-7xl mx-auto">
      {/* Top Tactical Banner on Mobile (Desktop has DesktopNavBar) */}
      <div className="md:hidden flex items-center justify-between mb-3 border-b border-[#1e293b] pb-3">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-[#2dd4bf] shadow-[0_0_8px_#2dd4bf]" />
          <span className="text-[10px] font-extrabold tracking-widest text-[#2dd4bf]">
            INCIDENT COMMAND SYSTEM
          </span>
        </div>
        <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded bg-[#0f172a] text-[#5eead4] border border-[#1e293b]">
          ICS-300 • v2.4.0
        </span>
      </div>

      {/* Main Header & Telemetry Ribbon */}
      <div className="mb-6 md:mb-8 flex flex-col md:flex-row md:items-end md:justify-between gap-4">
        <div>
          <div className="hidden md:flex items-center gap-2 mb-2">
            <span className="text-[11px] font-mono font-bold text-[#2dd4bf] tracking-wider uppercase bg-[#2dd4bf]/10 px-2 py-0.5 rounded border border-[#2dd4bf]/30">
              EXECUTIVE WAR ROOM CONSOLE
            </span>
            <span className="text-[11px] text-[#64748B]">|</span>
            <span className="text-[11px] text-[#94A3B8]">Tabletop Crisis Operations & Regulatory Adjudication</span>
          </div>

          <h1 className="text-2xl md:text-4xl font-black text-[#F8FAFC] tracking-tight">
            Cyber Incident War Room
          </h1>
          <p className="text-xs md:text-sm text-[#94A3B8] mt-1.5 max-w-2xl leading-relaxed">
            High-fidelity crisis simulations testing executive leadership against double-extortion ransomware,
            zero-day supply chain breaches, and statutory disclosure clocks across PIPEDA, Quebec Law 25, SEC 8-K, and GDPR.
          </p>
        </div>

        {/* Desktop Quick Metrics Ribbon */}
        <div className="grid grid-cols-3 md:grid-cols-3 gap-2.5 shrink-0">
          <div className="bg-[#0f172a] border border-[#1e293b] rounded-xl p-3 min-w-[90px] md:min-w-[110px] text-center">
            <span className="text-[9px] md:text-[10px] font-bold text-[#64748B] uppercase block">
              SCENARIOS
            </span>
            <span className="text-lg md:text-2xl font-black font-mono text-[#2dd4bf] mt-0.5 block">
              {allScenarios.length}
            </span>
            <span className="text-[9px] text-[#94A3B8] hidden md:block">Ready to drill</span>
          </div>

          <div className="bg-[#0f172a] border border-[#1e293b] rounded-xl p-3 min-w-[90px] md:min-w-[110px] text-center">
            <span className="text-[9px] md:text-[10px] font-bold text-[#64748B] uppercase block">
              COMPLETED
            </span>
            <span className="text-lg md:text-2xl font-black font-mono text-[#34d399] mt-0.5 block">
              {totalCompleted}
            </span>
            <span className="text-[9px] text-[#94A3B8] hidden md:block">Debriefs logged</span>
          </div>

          <div className="bg-[#0f172a] border border-[#1e293b] rounded-xl p-3 min-w-[90px] md:min-w-[110px] text-center">
            <span className="text-[9px] md:text-[10px] font-bold text-[#64748B] uppercase block">
              READINESS
            </span>
            <span
              className={`text-lg md:text-2xl font-black font-mono mt-0.5 block ${
                avgReadiness && avgReadiness >= 80
                  ? 'text-[#34d399]'
                  : avgReadiness && avgReadiness >= 60
                  ? 'text-[#fbbf24]'
                  : 'text-[#2dd4bf]'
              }`}
            >
              {avgReadiness !== null ? `${avgReadiness}%` : 'READY'}
            </span>
            <span className="text-[9px] text-[#94A3B8] hidden md:block">
              {avgReadiness !== null ? 'Overall index' : 'No drills yet'}
            </span>
          </div>
        </div>
      </div>

      {/* Main Grid: Left Scenarios / Right Intel & Advisory */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
        {/* Left Column: Filters + Scenarios Grid (8 of 12 cols on desktop) */}
        <div className="lg:col-span-8">
          {/* Search & Filter Bar */}
          <div className="bg-[#0f172a] border border-[#1e293b] rounded-2xl p-4 mb-5 shadow-md">
            {/* Search Input */}
            <div className="relative mb-3">
              <Search className="w-4 h-4 text-[#64748B] absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                data-testid="search_scenarios_input"
                placeholder="Search scenarios by title, threat actor (e.g. DarkHydra, Volt Typhoon), codename, or vector..."
                className="w-full bg-[#020617] border border-[#1e293b] rounded-xl pl-9 pr-3 py-2.5 text-xs text-[#F8FAFC] placeholder-[#64748B] focus:outline-none focus:border-[#2dd4bf]/60 transition-colors"
              />
            </div>

            {/* Filter Pills */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pt-1">
              {/* Category Pills */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 no-scrollbar">
                <span className="text-[10px] font-bold text-[#64748B] uppercase shrink-0 mr-1 hidden sm:inline">
                  CATEGORY:
                </span>
                {categories.map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-3 py-1 rounded-lg text-[11px] font-semibold tracking-wide whitespace-nowrap transition-all ${
                      selectedCategory === cat
                        ? 'bg-[#2dd4bf] text-[#042f2e] font-bold shadow-sm'
                        : 'bg-[#020617] text-[#94A3B8] hover:text-[#F8FAFC] border border-[#1e293b]'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              {/* Severity Pill / Filter */}
              <div className="flex items-center gap-1.5 shrink-0">
                <span className="text-[10px] font-bold text-[#64748B] uppercase mr-1">
                  SEVERITY:
                </span>
                {['ALL', 'CRITICAL', 'HIGH'].map((sev) => (
                  <button
                    key={sev}
                    type="button"
                    onClick={() => setSelectedSeverity(sev)}
                    className={`px-2.5 py-1 rounded-md text-[10px] font-mono font-bold transition-all ${
                      selectedSeverity === sev
                        ? sev === 'CRITICAL'
                          ? 'bg-[#f87171] text-white'
                          : sev === 'HIGH'
                          ? 'bg-[#FB923C] text-black'
                          : 'bg-[#2dd4bf] text-[#042f2e]'
                        : 'bg-[#020617] text-[#64748B] hover:text-[#94A3B8] border border-[#1e293b]'
                    }`}
                  >
                    {sev}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Results Count Header */}
          <div className="flex items-center justify-between mb-3 px-1">
            <span className="text-[11px] font-bold tracking-wider text-[#94A3B8] uppercase">
              TACTICAL SIMULATION DIRECTORY
            </span>
            <span className="text-[10px] font-mono text-[#64748B]">
              SHOWING {filteredScenarios.length} OF {allScenarios.length} DRILLS
            </span>
          </div>

          {/* Scenarios Grid (Responsive 1-col on mobile, 2-col on tablet/desktop) */}
          {filteredScenarios.length === 0 ? (
            <div className="bg-[#0f172a] border border-[#1e293b] rounded-2xl p-8 text-center">
              <AlertTriangle className="w-8 h-8 text-[#fbbf24] mx-auto mb-2" />
              <h3 className="text-sm font-bold text-[#F8FAFC] mb-1">No Scenarios Match Your Filter</h3>
              <p className="text-xs text-[#94A3B8] mb-4">
                Try resetting your search query or choosing "ALL" categories.
              </p>
              <button
                type="button"
                onClick={() => {
                  setSelectedCategory('ALL');
                  setSelectedSeverity('ALL');
                  setSearchQuery('');
                }}
                className="px-4 py-2 bg-[#2dd4bf] text-[#042f2e] text-xs font-bold rounded-lg"
              >
                Reset Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredScenarios.map((scenario) => (
                <ScenarioCard
                  key={scenario.id}
                  scenario={scenario}
                  onSelect={() => selectScenario(scenario)}
                />
              ))}
            </div>
          )}
        </div>

        {/* Right Column: Operations HUD, Advisory & Threat Intel (4 of 12 cols on desktop) */}
        <div className="lg:col-span-4 space-y-5">
          {/* Movahedi Strategic Advisory Banner */}
          <div
            onClick={() => navigateTo(Screen.ADVISORY)}
            className="bg-gradient-to-br from-[#0f172a] to-[#0f172a] border border-[#14b8a6]/50 rounded-2xl p-4 cursor-pointer hover:border-[#2dd4bf]/60 transition-all shadow-lg group relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#14b8a6]/10 rounded-full blur-2xl pointer-events-none" />

            <div className="flex items-start justify-between gap-3 mb-2">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#2dd4bf]/20 to-[#14b8a6]/30 border border-[#2dd4bf]/40 flex items-center justify-center text-[#2dd4bf] shadow-md shrink-0">
                  <Sparkles className="w-5 h-5 text-[#2dd4bf]" />
                </div>
                <div>
                  <span className="text-[9px] font-black text-[#2dd4bf] uppercase tracking-wider block">
                    CANADIAN PRIVACY & AI ADVISORY
                  </span>
                  <h4 className="text-sm font-bold text-[#F8FAFC] group-hover:text-[#2dd4bf] transition-colors">
                    {MovahediData.CONSULTANT_NAME}
                  </h4>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-[#64748B] group-hover:text-[#2dd4bf] group-hover:translate-x-1 transition-all mt-1 shrink-0" />
            </div>

            <p className="text-xs text-[#94A3B8] leading-relaxed mb-3">
              Independent strategic counsel for executive crisis command, PIPEDA & Quebec Law 25 compliance,
              and AI risk governance.
            </p>

            <div className="flex items-center justify-between pt-2 border-t border-[#1e293b]/80 text-[11px]">
              <span className="text-[#5eead4] font-semibold">RROSH Breach Evaluator</span>
              <span className="text-xs text-[#2dd4bf] font-bold flex items-center gap-1">
                Explore Advisory <ChevronRight className="w-3 h-3" />
              </span>
            </div>
          </div>

          {/* Statutory Breach Clocks Reference Card (Crucial for desktop War Room) */}
          <div className="bg-[#0f172a] border border-[#1e293b] rounded-2xl p-4 shadow-md">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-[#2dd4bf]" />
                <span className="text-xs font-bold text-[#F8FAFC] uppercase tracking-wide">
                  Statutory Clocks
                </span>
              </div>
              <button
                type="button"
                onClick={() => navigateTo(Screen.DOCTRINE_LIST)}
                className="text-[11px] font-bold text-[#2dd4bf] hover:underline flex items-center gap-0.5"
              >
                All Playbooks <ChevronRight className="w-3 h-3" />
              </button>
            </div>

            <div className="space-y-2.5">
              <div className="p-2.5 rounded-xl bg-[#020617] border border-[#1e293b] flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-[#F8FAFC] block">SEC Form 8-K (Item 1.05)</span>
                  <span className="text-[10px] text-[#94A3B8]">Public US registrants</span>
                </div>
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-[#f87171]/15 border border-[#f87171]/30 text-[#f87171]">
                  4 Business Days
                </span>
              </div>

              <div className="p-2.5 rounded-xl bg-[#020617] border border-[#1e293b] flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-[#F8FAFC] block">GDPR Art. 33 / UK GDPR</span>
                  <span className="text-[10px] text-[#94A3B8]">EU Supervisory Authorities</span>
                </div>
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-[#f87171]/15 border border-[#f87171]/30 text-[#f87171]">
                  72 Hours
                </span>
              </div>

              <div className="p-2.5 rounded-xl bg-[#020617] border border-[#1e293b] flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-[#F8FAFC] block">Quebec Law 25 (CAI)</span>
                  <span className="text-[10px] text-[#94A3B8]">Commission d'accès à l'information</span>
                </div>
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-[#FB923C]/15 border border-[#FB923C]/30 text-[#FB923C]">
                  Promptly (RROSH)
                </span>
              </div>

              <div className="p-2.5 rounded-xl bg-[#020617] border border-[#1e293b] flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-[#F8FAFC] block">PIPEDA (OPC Canada)</span>
                  <span className="text-[10px] text-[#94A3B8]">Federal Canadian Privacy Act</span>
                </div>
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-[#2dd4bf]/15 border border-[#2dd4bf]/30 text-[#2dd4bf]">
                  As Soon As Feasible
                </span>
              </div>
            </div>
          </div>

          {/* Recent Incident Drills (if any exist) */}
          {pastDrills.length > 0 && (
            <div className="bg-[#0f172a] border border-[#1e293b] rounded-2xl p-4 shadow-md">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Award className="w-4 h-4 text-[#34d399]" />
                  <span className="text-xs font-bold text-[#F8FAFC] uppercase tracking-wide">
                    Recent Tabletop Audits
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => navigateTo(Screen.HISTORY_LOGS)}
                  className="text-[11px] font-bold text-[#2dd4bf] hover:underline"
                >
                  View All ({pastDrills.length})
                </button>
              </div>

              <div className="space-y-2">
                {pastDrills.slice(0, 3).map((drill) => (
                  <div
                    key={drill.id}
                    onClick={() => navigateTo(Screen.HISTORY_LOGS)}
                    className="p-2.5 rounded-xl bg-[#020617] border border-[#1e293b] hover:border-[#2dd4bf]/40 cursor-pointer transition-all flex items-center justify-between"
                  >
                    <div className="min-w-0 pr-2">
                      <h5 className="text-xs font-bold text-[#F8FAFC] truncate">
                        {drill.scenarioTitle}
                      </h5>
                      <span className="text-[10px] text-[#64748B]">
                        {formatDate(drill.completedAt || drill.timestamp || Date.now())}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <span className="text-xs font-mono font-bold text-[#2dd4bf]">
                        {drill.totalScore}%
                      </span>
                      <span className="w-7 h-7 rounded-lg bg-[#34d399]/15 text-[#34d399] border border-[#34d399]/30 font-mono font-black text-xs flex items-center justify-center">
                        {drill.letterGrade}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
