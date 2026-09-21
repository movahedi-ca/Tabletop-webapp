import React from 'react';
import { Shield, BookOpen, Lightbulb, History } from 'lucide-react';
import { Screen } from '../types';

interface BottomNavBarProps {
  currentScreen: Screen;
  onNavigate: (screen: Screen) => void;
}

export const BottomNavBar: React.FC<BottomNavBarProps> = ({ currentScreen, onNavigate }) => {
  const isWarRoom =
    currentScreen === Screen.HOME ||
    currentScreen === Screen.SCENARIO_DETAIL ||
    currentScreen === Screen.SIMULATION ||
    currentScreen === Screen.AAR_REPORT;
  const isDoctrine = currentScreen === Screen.DOCTRINE_LIST || currentScreen === Screen.DOCTRINE_DETAIL;
  const isAdvisory = currentScreen === Screen.ADVISORY;
  const isArchives = currentScreen === Screen.HISTORY_LOGS;

  return (
    <nav
      data-testid="main_navigation_bar"
      className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-[#0f172a] border-t border-[#1e293b] shadow-2xl safe-area-bottom"
    >
      <div className="max-w-md mx-auto flex items-center justify-around h-16 px-3">
        {/* War Room */}
        <button
          type="button"
          onClick={() => onNavigate(Screen.HOME)}
          data-testid="nav_item_war_room"
          className={`flex flex-col items-center justify-center flex-1 py-1 transition-all rounded-lg ${
            isWarRoom ? 'text-[#2dd4bf]' : 'text-[#64748B] hover:text-[#94A3B8]'
          }`}
        >
          <div
            className={`p-1 rounded-md transition-all ${
              isWarRoom ? 'bg-[#2dd4bf]/15 text-[#2dd4bf]' : 'text-[#64748B]'
            }`}
          >
            <Shield className="w-5 h-5" />
          </div>
          <span className={`text-[11px] mt-0.5 tracking-tight ${isWarRoom ? 'font-bold text-[#2dd4bf]' : 'font-normal'}`}>
            War Room
          </span>
        </button>

        {/* Doctrine */}
        <button
          type="button"
          onClick={() => onNavigate(Screen.DOCTRINE_LIST)}
          data-testid="nav_item_doctrine"
          className={`flex flex-col items-center justify-center flex-1 py-1 transition-all rounded-lg ${
            isDoctrine ? 'text-[#2dd4bf]' : 'text-[#64748B] hover:text-[#94A3B8]'
          }`}
        >
          <div
            className={`p-1 rounded-md transition-all ${
              isDoctrine ? 'bg-[#2dd4bf]/15 text-[#2dd4bf]' : 'text-[#64748B]'
            }`}
          >
            <BookOpen className="w-5 h-5" />
          </div>
          <span className={`text-[11px] mt-0.5 tracking-tight ${isDoctrine ? 'font-bold text-[#2dd4bf]' : 'font-normal'}`}>
            Doctrine
          </span>
        </button>

        {/* Advisory */}
        <button
          type="button"
          onClick={() => onNavigate(Screen.ADVISORY)}
          data-testid="nav_item_advisory"
          className={`flex flex-col items-center justify-center flex-1 py-1 transition-all rounded-lg ${
            isAdvisory ? 'text-[#2dd4bf]' : 'text-[#64748B] hover:text-[#94A3B8]'
          }`}
        >
          <div
            className={`p-1 rounded-md transition-all ${
              isAdvisory ? 'bg-[#2dd4bf]/15 text-[#2dd4bf]' : 'text-[#64748B]'
            }`}
          >
            <Lightbulb className="w-5 h-5" />
          </div>
          <span className={`text-[11px] mt-0.5 tracking-tight ${isAdvisory ? 'font-bold text-[#2dd4bf]' : 'font-normal'}`}>
            Advisory
          </span>
        </button>

        {/* Archives */}
        <button
          type="button"
          onClick={() => onNavigate(Screen.HISTORY_LOGS)}
          data-testid="nav_item_archives"
          className={`flex flex-col items-center justify-center flex-1 py-1 transition-all rounded-lg ${
            isArchives ? 'text-[#2dd4bf]' : 'text-[#64748B] hover:text-[#94A3B8]'
          }`}
        >
          <div
            className={`p-1 rounded-md transition-all ${
              isArchives ? 'bg-[#2dd4bf]/15 text-[#2dd4bf]' : 'text-[#64748B]'
            }`}
          >
            <History className="w-5 h-5" />
          </div>
          <span className={`text-[11px] mt-0.5 tracking-tight ${isArchives ? 'font-bold text-[#2dd4bf]' : 'font-normal'}`}>
            Archives
          </span>
        </button>
      </div>
    </nav>
  );
};
