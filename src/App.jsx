import { useState, useEffect, useCallback } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Plus } from 'lucide-react';
import Sidebar from './components/Sidebar';
import MoodLogger from './components/MoodLogger';
import Cursor from './components/Cursor';
import Dashboard from './pages/Dashboard';
import CalendarPage from './pages/CalendarPage';
import AnalyticsPage from './pages/AnalyticsPage';
import InsightsPage from './pages/InsightsPage';
import ProgressPage from './pages/ProgressPage';
import SettingsPage from './pages/SettingsPage';
import { generateSampleData } from './store/moodStore';

const pageTransition = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -12 },
  transition: { duration: 0.3, ease: 'easeInOut' },
};

export default function App() {
  const [activePage, setActivePage] = useState('dashboard');
  const [isLoggerOpen, setIsLoggerOpen] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const [toast, setToast] = useState(null);

  // Generate sample data on first load
  useEffect(() => {
    generateSampleData();
  }, []);

  const handleMoodSaved = useCallback(() => {
    setRefreshKey(prev => prev + 1);
    setToast('✨ Mood logged successfully!');
    setTimeout(() => setToast(null), 3000);
  }, []);

  const handleDataReset = useCallback(() => {
    setRefreshKey(prev => prev + 1);
  }, []);

  const openLogger = useCallback(() => {
    setIsLoggerOpen(true);
  }, []);

  const handleNavigate = useCallback((page) => {
    if (page === 'log') {
      openLogger();
    } else {
      setActivePage(page);
    }
  }, [openLogger]);

  const renderPage = () => {
    switch (activePage) {
      case 'dashboard':
        return <Dashboard onLogMood={openLogger} refreshKey={refreshKey} />;
      case 'calendar':
        return <CalendarPage refreshKey={refreshKey} />;
      case 'analytics':
        return <AnalyticsPage refreshKey={refreshKey} />;
      case 'insights':
        return <InsightsPage refreshKey={refreshKey} />;
      case 'progress':
        return <ProgressPage refreshKey={refreshKey} />;
      case 'settings':
        return <SettingsPage onDataReset={handleDataReset} />;
      default:
        return <Dashboard onLogMood={openLogger} refreshKey={refreshKey} />;
    }
  };

  return (
    <div className="app-layout">
      {/* Custom Cursor */}
      <Cursor />

      {/* Background Orbs */}
      <div className="bg-orb bg-orb-1" />
      <div className="bg-orb bg-orb-2" />
      <div className="bg-orb bg-orb-3" />

      {/* Sidebar */}
      <Sidebar activePage={activePage} onNavigate={handleNavigate} />

      {/* Main Content */}
      <main className="main-content">
        <AnimatePresence mode="wait">
          <motion.div
            key={activePage}
            {...pageTransition}
          >
            {renderPage()}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Floating Log Button */}
      <motion.button
        className="fab-log"
        onClick={openLogger}
        whileHover={{ scale: 1.1, rotate: 90 }}
        whileTap={{ scale: 0.9 }}
        id="fab-log-mood"
        aria-label="Log Mood"
      >
        <Plus size={28} />
      </motion.button>

      {/* Mood Logger Modal */}
      <MoodLogger
        isOpen={isLoggerOpen}
        onClose={() => setIsLoggerOpen(false)}
        onSaved={handleMoodSaved}
      />

      {/* Toast Notification */}
      <AnimatePresence>
        {toast && (
          <motion.div
            className="toast"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
          >
            {toast}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
