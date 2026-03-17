import { useState } from 'react';
import { motion } from 'framer-motion';
import { Trash2, Download, Upload, Bell, Moon, Info } from 'lucide-react';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

export default function SettingsPage({ onDataReset }) {
  const [showConfirm, setShowConfirm] = useState(false);
  const [exported, setExported] = useState(false);

  const handleExport = () => {
    const data = localStorage.getItem('moodmap_data');
    if (!data) return;

    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `moodmap-export-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    setExported(true);
    setTimeout(() => setExported(false), 3000);
  };

  const handleImport = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = (e) => {
      const file = e.target.files[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = (ev) => {
        try {
          const data = JSON.parse(ev.target.result);
          if (data.logs) {
            localStorage.setItem('moodmap_data', JSON.stringify(data));
            onDataReset?.();
            alert('Data imported successfully!');
          }
        } catch (err) {
          alert('Invalid file format');
        }
      };
      reader.readAsText(file);
    };
    input.click();
  };

  const handleClearData = () => {
    localStorage.removeItem('moodmap_data');
    setShowConfirm(false);
    onDataReset?.();
  };

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="visible">
      <div className="page-header">
        <h1>⚙️ Settings</h1>
        <p>Manage your MoodMap preferences and data</p>
      </div>

      {/* About */}
      <motion.div variants={itemVariants} className="card section">
        <div className="flex items-center gap-lg" style={{ marginBottom: 'var(--space-lg)' }}>
          <div style={{
            width: 56,
            height: 56,
            borderRadius: 'var(--radius-md)',
            background: 'var(--gradient-primary)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '1.5rem',
            boxShadow: 'var(--shadow-glow-purple)',
          }}>
            🧠
          </div>
          <div>
            <h3 className="font-display font-bold" style={{ fontSize: '1.2rem' }}>MoodMap</h3>
            <p className="text-secondary text-sm">Version 1.0.0 • Mood Journal + Pattern Intelligence</p>
          </div>
        </div>
        <p className="text-secondary" style={{ lineHeight: 1.7 }}>
          MoodMap helps you track your emotions, discover patterns, and grow emotionally.
          All data is stored locally in your browser — your privacy is our priority.
        </p>
      </motion.div>

      {/* Data Management */}
      <motion.div variants={itemVariants} className="card section">
        <div className="card-header">
          <h3 className="card-title">📦 Data Management</h3>
        </div>
        <div className="flex flex-col gap-md">
          <button className="btn btn-secondary" onClick={handleExport} id="export-data-btn" style={{ justifyContent: 'flex-start' }}>
            <Download size={18} />
            {exported ? '✓ Exported!' : 'Export Data (JSON)'}
          </button>

          <button className="btn btn-secondary" onClick={handleImport} id="import-data-btn" style={{ justifyContent: 'flex-start' }}>
            <Upload size={18} />
            Import Data
          </button>

          {!showConfirm ? (
            <button
              className="btn btn-secondary"
              onClick={() => setShowConfirm(true)}
              id="clear-data-btn"
              style={{
                justifyContent: 'flex-start',
                borderColor: 'rgba(239, 68, 68, 0.3)',
                color: '#ef4444',
              }}
            >
              <Trash2 size={18} />
              Clear All Data
            </button>
          ) : (
            <div className="card" style={{
              background: 'rgba(239, 68, 68, 0.08)',
              borderColor: 'rgba(239, 68, 68, 0.3)',
              padding: 'var(--space-lg)',
            }}>
              <p className="font-semibold" style={{ color: '#ef4444', marginBottom: 'var(--space-sm)' }}>
                ⚠️ Are you sure?
              </p>
              <p className="text-sm text-secondary" style={{ marginBottom: 'var(--space-md)' }}>
                This will permanently delete all mood logs, insights, and progress data. This cannot be undone.
              </p>
              <div className="flex gap-md">
                <button className="btn btn-secondary btn-sm" onClick={() => setShowConfirm(false)}>
                  Cancel
                </button>
                <button
                  className="btn btn-sm"
                  onClick={handleClearData}
                  id="confirm-clear-data"
                  style={{ background: '#ef4444', color: 'white' }}
                >
                  <Trash2 size={14} />
                  Yes, Clear Everything
                </button>
              </div>
            </div>
          )}
        </div>
      </motion.div>

      {/* Privacy */}
      <motion.div variants={itemVariants} className="card section">
        <div className="card-header">
          <h3 className="card-title">🔒 Privacy</h3>
        </div>
        <div className="flex flex-col gap-md">
          <div className="insight-item">
            <div className="insight-icon" style={{ background: 'rgba(16, 185, 129, 0.15)' }}>✅</div>
            <div>
              <p className="font-semibold">100% Local Storage</p>
              <p className="text-sm text-secondary">All your data stays on your device. Nothing is sent to any server.</p>
            </div>
          </div>
          <div className="insight-item">
            <div className="insight-icon" style={{ background: 'rgba(99, 102, 241, 0.15)' }}>🔐</div>
            <div>
              <p className="font-semibold">No Account Required</p>
              <p className="text-sm text-secondary">No sign-up, no passwords. Your mood data is completely private.</p>
            </div>
          </div>
          <div className="insight-item">
            <div className="insight-icon" style={{ background: 'rgba(168, 85, 247, 0.15)' }}>📊</div>
            <div>
              <p className="font-semibold">On-Device Intelligence</p>
              <p className="text-sm text-secondary">Pattern analysis happens entirely in your browser. No AI cloud processing.</p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Credits */}
      <motion.div variants={itemVariants} className="card section" style={{ textAlign: 'center' }}>
        <p className="text-secondary text-sm">
          Made with 💜 by MoodMap Team
        </p>
        <p className="text-xs text-secondary" style={{ marginTop: 4 }}>
          "Don't just track how you feel — understand why you feel that way."
        </p>
      </motion.div>
    </motion.div>
  );
}
