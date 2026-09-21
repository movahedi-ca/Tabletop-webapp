import React from 'react';
import {
  Shield,
  BookOpen,
  Lightbulb,
  History,
  Activity,
  AlertTriangle,
  Play,
  CheckCircle2,
  ExternalLink,
} from 'lucide-react';
import { Screen, IncidentSeverity } from '../types';
import { useSimulation } from '../context/SimulationContext';

interface DesktopNavBarProps {
  currentScreen: Screen;
  onNavigate: (screen: Screen) => void;
}

export const DesktopNavBar: React.FC<DesktopNavBarProps> = ({ currentScreen, onNavigate }) => {
  const { selectedScenario, currentPhaseIndex, pastDrills } = useSimulation();

  const isWarRoom =
    currentScreen === Screen.HOME ||
    currentScreen === Screen.SCENARIO_DETAIL ||
    currentScreen === Screen.SIMULATION ||
    currentScreen === Screen.AAR_REPORT;
  const isDoctrine = currentScreen === Screen.DOCTRINE_LIST || currentScreen === Screen.DOCTRINE_DETAIL;
  const isAdvisory = currentScreen === Screen.ADVISORY;
  const isArchives = currentScreen === Screen.HISTORY_LOGS;

  const isSimulating = currentScreen === Screen.SIMULATION && selectedScenario;

  const avgReadiness =
    pastDrills.length > 0
      ? Math.round(pastDrills.reduce((acc, r) => acc + (r.totalScore || 0), 0) / pastDrills.length)
      : null;

  return (
    <header
      data-testid="desktop_command_bar"
      className="hidden md:block sticky top-0 z-50 bg-[#020617]/95 backdrop-blur-md border-b border-[#1e293b] shadow-xl"
    >
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Brand & Tactical Call-Sign */}
        <button
          type="button"
          onClick={() => onNavigate(Screen.HOME)}
          aria-label="Breach Tabletop home"
          className="flex items-center gap-3 cursor-pointer group select-none text-left"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#2dd4bf]/20 to-[#14b8a6]/20 border border-[#2dd4bf]/40 flex items-center justify-center text-[#2dd4bf] group-hover:border-[#2dd4bf] transition-all shadow-[0_0_15px_rgba(45,212,191,0.15)]">
            <Shield className="w-5 h-5 group-hover:scale-110 transition-transform" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-black tracking-wider text-[#F8FAFC] group-hover:text-[#2dd4bf] transition-colors">
                BREACH TABLETOP
              </span>
              <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-[#2dd4bf]/15 text-[#2dd4bf] border border-[#2dd4bf]/30">
                ICS-300
              </span>
            </div>
            <div className="flex items-center gap-2 text-[11px] text-[#94A3B8]">
              <span>Crisis Command Simulator</span>
              <span>•</span>
              <span className="text-[#5eead4]">Statutory Incident Doctrine</span>
            </div>
          </div>
        </button>

        {/* Center Navigation Tabs */}
        <nav className="flex items-center gap-1 bg-[#0f172a]/80 border border-[#1e293b] p-1 rounded-xl">
          <button
            type="button"
            onClick={() => onNavigate(Screen.HOME)}
            data-testid="desktop_nav_war_room"
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
              isWarRoom && !isSimulating
                ? 'bg-[#2dd4bf] text-[#042f2e] shadow-sm'
                : 'text-[#94A3B8] hover:text-[#F8FAFC] hover:bg-[#1E293B]'
            }`}
          >
            <Shield className="w-4 h-4" />
            <span>War Room</span>
          </button>

          {selectedScenario && (
            <button
              type="button"
              onClick={() => onNavigate(Screen.SIMULATION)}
              data-testid="desktop_nav_active_sim"
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all relative ${
                isSimulating
                  ? 'bg-[#f87171] text-white shadow-[0_0_12px_rgba(248,113,113,0.4)] animate-pulse'
                  : 'text-[#f87171] hover:bg-[#f87171]/15 border border-[#f87171]/30'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-white animate-ping" />
              <span>Active Drill</span>
              <span className="text-[10px] font-mono px-1 rounded bg-black/30">
                P{currentPhaseIndex + 1}
              </span>
            </button>
          )}

          <button
            type="button"
            onClick={() => onNavigate(Screen.DOCTRINE_LIST)}
            data-testid="desktop_nav_doctrine"
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
              isDoctrine
                ? 'bg-[#2dd4bf] text-[#042f2e] shadow-sm'
                : 'text-[#94A3B8] hover:text-[#F8FAFC] hover:bg-[#1E293B]'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>Doctrine Playbooks</span>
          </button>

          <button
            type="button"
            onClick={() => onNavigate(Screen.ADVISORY)}
            data-testid="desktop_nav_advisory"
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
              isAdvisory
                ? 'bg-[#2dd4bf] text-[#042f2e] shadow-sm'
                : 'text-[#94A3B8] hover:text-[#F8FAFC] hover:bg-[#1E293B]'
            }`}
          >
            <Lightbulb className="w-4 h-4" />
            <span>Crisis Advisory</span>
          </button>

          <button
            type="button"
            onClick={() => onNavigate(Screen.HISTORY_LOGS)}
            data-testid="desktop_nav_archives"
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
              isArchives
                ? 'bg-[#2dd4bf] text-[#042f2e] shadow-sm'
                : 'text-[#94A3B8] hover:text-[#F8FAFC] hover:bg-[#1E293B]'
            }`}
          >
            <History className="w-4 h-4" />
            <span>Audit Archives</span>
            {pastDrills.length > 0 && (
              <span className="text-[10px] font-mono px-1.5 py-0.2 rounded-full bg-[#1e293b] text-[#5eead4]">
                {pastDrills.length}
              </span>
            )}
          </button>
        </nav>

        {/* Right Status Indicator & Telemetry */}
        <div className="flex items-center gap-3">
          {/* DEFCON Beacon */}
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#0f172a] border border-[#1e293b] text-xs">
            <span
              className={`w-2 h-2 rounded-full ${
                isSimulating ? 'bg-[#f87171] animate-ping' : 'bg-[#34d399]'
              }`}
            />
            <span className="text-[11px] font-mono font-bold text-[#94A3B8]">
              {isSimulating ? 'DEFCON 1 • DRILL ACTIVE' : 'DEFCON 4 • SIMULATOR READY'}
            </span>
          </div>

          {/* Org Readiness Score Badge */}
          {avgReadiness !== null && (
            <div className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#0f172a] border border-[#1e293b] text-xs">
              <span className="text-[10px] text-[#94A3B8] font-bold">ORG READINESS:</span>
              <span
                className={`font-mono font-black ${
                  avgReadiness >= 80
                    ? 'text-[#34d399]'
                    : avgReadiness >= 60
                    ? 'text-[#fbbf24]'
                    : 'text-[#f87171]'
                }`}
              >
                {avgReadiness}%
              </span>
            </div>
          )}

          {/* Launch New Drill CTA */}
          <button
            type="button"
            onClick={() => onNavigate(Screen.HOME)}
            data-testid="desktop_quick_launch_drill"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#2dd4bf]/15 hover:bg-[#2dd4bf]/25 border border-[#2dd4bf]/40 text-[#2dd4bf] text-xs font-extrabold tracking-wide transition-all shadow-sm"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>NEW DRILL</span>
          </button>
        </div>
      </div>
    </header>
  );
};
