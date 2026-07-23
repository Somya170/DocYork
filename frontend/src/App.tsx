import { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { QueryStudio } from './components/QueryStudio';
import { FleetDashboard } from './components/FleetDashboard';
import { AnalyticsCharts } from './components/AnalyticsCharts';
import { DataIngestion } from './components/DataIngestion';
import { checkBackendHealth } from './services/api';

export function App() {
  const [activeTab, setActiveTab] = useState('qa');
  const [theme, setTheme] = useState('dark');

  const checkHealth = async () => {
    await checkBackendHealth();
  };

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    if (newTheme === 'light') {
      document.documentElement.classList.add('light');
    } else {
      document.documentElement.classList.remove('light');
    }
  };

  useEffect(() => {
    checkHealth();
    const interval = setInterval(checkHealth, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-[#0a0d14] text-slate-100 flex flex-col font-sans">
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onRefreshData={checkHealth}
        theme={theme}
        toggleTheme={toggleTheme}
      />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 pb-12">
        {activeTab === 'qa' && <QueryStudio />}
        {activeTab === 'fleet' && <FleetDashboard />}
        {activeTab === 'analytics' && <AnalyticsCharts />}
        {activeTab === 'ingest' && <DataIngestion onIngestSuccess={checkHealth} />}
      </main>

      <footer className="border-t border-slate-900 bg-slate-950 py-6 px-6 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>Yash Technologies &copy; 2026</span>
          <span className="text-cyan-500 font-medium">Data QA Studio • All Rights Reserved</span>
        </div>
      </footer>
    </div>
  );
}

export default App;
