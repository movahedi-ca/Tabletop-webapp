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
      className="hidden md:block sticky top-0 z-50 bg-[#0B101B]/95 backdrop-blur-md border-b border-[#22334D] shadow-xl"
    >
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Brand & Tactical Call-Sign */}
        <div
          onClick={() => onNavigate(Screen.HOME)}
          className="flex items-center gap-3 cursor-pointer group select-none"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#00F0FF]/20 to-[#6366F1]/20 border border-[#00F0FF]/40 flex items-center justify-center text-[#00F0FF] group-hover:border-[#00F0FF] transition-all shadow-[0_0_15px_rgba(0,240,255,0.15)]">
            <Shield className="w-5 h-5 group-hover:scale-110 transition-transform" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-black tracking-wider text-[#F8FAFC] group-hover:text-[#00F0FF] transition-colors">
                BREACH TABLETOP
              </span>
              <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-[#00F0FF]/15 text-[#00F0FF] border border-[#00F0FF]/30">
                ICS-300
              </span>
            </div>
            <div className="flex items-center gap-2 text-[11px] text-[#64748B]">
              <span>Crisis Command Simulator</span>
              <span>•</span>
              <span className="text-[#38BDF8]">Statutory Incident Doctrine</span>
            </div>
          </div>
        </div>

        {/* Center Navigation Tabs */}
        <nav className="flex items-center gap-1 bg-[#131D2E]/80 border border-[#22334D] p-1 rounded-xl">
          <button
            type="button"
            onClick={() => onNavigate(Screen.HOME)}
            data-testid="desktop_nav_war_room"
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
              isWarRoom && !isSimulating
                ? 'bg-[#00F0FF] text-[#001F2B] shadow-sm'
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
                  ? 'bg-[#EF4444] text-white shadow-[0_0_12px_rgba(239,68,68,0.4)] animate-pulse'
                  : 'text-[#EF4444] hover:bg-[#EF4444]/15 border border-[#EF4444]/30'
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
                ? 'bg-[#00F0FF] text-[#001F2B] shadow-sm'
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
                ? 'bg-[#00F0FF] text-[#001F2B] shadow-sm'
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
                ? 'bg-[#00F0FF] text-[#001F2B] shadow-sm'
                : 'text-[#94A3B8] hover:text-[#F8FAFC] hover:bg-[#1E293B]'
            }`}
          >
            <History className="w-4 h-4" />
            <span>Audit Archives</span>
            {pastDrills.length > 0 && (
              <span className="text-[10px] font-mono px-1.5 py-0.2 rounded-full bg-[#22334D] text-[#38BDF8]">
                {pastDrills.length}
              </span>
            )}
          </button>
        </nav>

        {/* Right Status Indicator & Telemetry */}
        <div className="flex items-center gap-3">
          {/* DEFCON Beacon */}
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#131D2E] border border-[#22334D] text-xs">
            <span
              className={`w-2 h-2 rounded-full ${
                isSimulating ? 'bg-[#EF4444] animate-ping' : 'bg-[#10B981]'
              }`}
            />
            <span className="text-[11px] font-mono font-bold text-[#94A3B8]">
              {isSimulating ? 'DEFCON 1 • DRILL ACTIVE' : 'DEFCON 4 • SIMULATOR READY'}
            </span>
          </div>

          {/* Org Readiness Score Badge */}
          {avgReadiness !== null && (
            <div className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#131D2E] border border-[#22334D] text-xs">
              <span className="text-[10px] text-[#64748B] font-bold">ORG READINESS:</span>
              <span
                className={`font-mono font-black ${
                  avgReadiness >= 80
                    ? 'text-[#10B981]'
                    : avgReadiness >= 60
                    ? 'text-[#F59E0B]'
                    : 'text-[#EF4444]'
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
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#00F0FF]/15 hover:bg-[#00F0FF]/25 border border-[#00F0FF]/40 text-[#00F0FF] text-xs font-extrabold tracking-wide transition-all shadow-sm"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>NEW DRILL</span>
          </button>
        </div>
      </div>
    </header>
  );
};
