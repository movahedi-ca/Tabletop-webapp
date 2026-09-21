import React from 'react';
import { SimulationProvider, useSimulation } from './context/SimulationContext';
import { Screen } from './types';
import { HomeScreen } from './screens/HomeScreen';
import { ScenarioDetailScreen } from './screens/ScenarioDetailScreen';
import { SimulationScreen } from './screens/SimulationScreen';
import { AarReportScreen } from './screens/AarReportScreen';
import { DoctrineScreen } from './screens/DoctrineScreen';
import { HistoryScreen } from './screens/HistoryScreen';
import { AdvisoryScreen } from './screens/AdvisoryScreen';
import { BottomNavBar } from './components/BottomNavBar';
import { DesktopNavBar } from './components/DesktopNavBar';
import { SiteHeader, SiteFooter } from './components/SiteChrome';

const AppContent: React.FC = () => {
  const { currentScreen, navigateTo } = useSimulation();

  const showBottomBar =
    currentScreen === Screen.HOME ||
    currentScreen === Screen.DOCTRINE_LIST ||
    currentScreen === Screen.DOCTRINE_DETAIL ||
    currentScreen === Screen.HISTORY_LOGS ||
    currentScreen === Screen.ADVISORY;

  const renderScreen = () => {
    switch (currentScreen) {
      case Screen.HOME:
        return <HomeScreen />;
      case Screen.SCENARIO_DETAIL:
        return <ScenarioDetailScreen />;
      case Screen.SIMULATION:
        return <SimulationScreen />;
      case Screen.AAR_REPORT:
        return <AarReportScreen />;
      case Screen.DOCTRINE_LIST:
      case Screen.DOCTRINE_DETAIL:
        return <DoctrineScreen />;
      case Screen.HISTORY_LOGS:
        return <HistoryScreen />;
      case Screen.ADVISORY:
        return <AdvisoryScreen />;
      default:
        return <HomeScreen />;
    }
  };

  return (
    <div className="min-h-screen bg-[#020617] text-[#F8FAFC] flex flex-col justify-between selection:bg-[#2dd4bf]/30 selection:text-[#2dd4bf]">
      <SiteHeader />
      <DesktopNavBar currentScreen={currentScreen} onNavigate={navigateTo} />

      <main className="flex-1 w-full">
        {renderScreen()}
      </main>

      {showBottomBar && (
        <BottomNavBar currentScreen={currentScreen} onNavigate={navigateTo} />
      )}
      <SiteFooter />
    </div>
  );
};

export function App() {
  return (
    <SimulationProvider>
      <AppContent />
    </SimulationProvider>
  );
}

export default App;
