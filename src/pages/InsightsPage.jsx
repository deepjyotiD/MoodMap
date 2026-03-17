import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { Brain, TrendingUp, TrendingDown, Sparkles, AlertTriangle, Award } from 'lucide-react';
import { generateInsights, getTagCorrelations, getWeekdayAverages } from '../store/moodStore';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' } },
};

const typeConfig = {
  positive: {
    bg: 'rgba(16, 185, 129, 0.1)',
    border: 'rgba(16, 185, 129, 0.3)',
    iconBg: 'rgba(16, 185, 129, 0.15)',
    color: '#10b981',
    glow: '0 0 20px rgba(16, 185, 129, 0.15)',
  },
  warning: {
    bg: 'rgba(245, 158, 11, 0.08)',
    border: 'rgba(245, 158, 11, 0.3)',
    iconBg: 'rgba(245, 158, 11, 0.15)',
    color: '#f59e0b',
    glow: '0 0 20px rgba(245, 158, 11, 0.15)',
  },
  neutral: {
    bg: 'rgba(99, 102, 241, 0.08)',
    border: 'rgba(99, 102, 241, 0.3)',
    iconBg: 'rgba(99, 102, 241, 0.15)',
    color: '#6366f1',
    glow: '0 0 20px rgba(99, 102, 241, 0.15)',
  },
};

export default function InsightsPage({ refreshKey }) {
  const insights = useMemo(() => generateInsights(), [refreshKey]);
  const tagCorrelations = useMemo(() => getTagCorrelations(), [refreshKey]);
  const weekdayAvgs = useMemo(() => getWeekdayAverages(), [refreshKey]);

  if (insights.length === 0) {
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <div className="page-header">
          <h1>💡 Insights</h1>
          <p>Pattern intelligence from your emotional data</p>
        </div>
        <div className="card empty-state">
          <div className="empty-state-icon">🧠</div>
          <h3 className="empty-state-title">Building your insights...</h3>
          <p className="empty-state-text">
            Log at least 5 mood entries to start receiving AI-powered emotional insights and pattern detection.
          </p>
          <div className="progress-bar" style={{ width: '200px', marginTop: 'var(--space-md)' }}>
            <div className="progress-fill" style={{ width: '20%' }} />
          </div>
          <p className="text-xs text-secondary" style={{ marginTop: 'var(--space-sm)' }}>
            Keep logging to unlock insights
          </p>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="visible">
      <div className="page-header">
        <h1>💡 Insights</h1>
        <p>Pattern intelligence from your emotional data</p>
      </div>

      {/* AI Header Card */}
      <motion.div
        variants={itemVariants}
        className="card card-glow section"
        style={{
          background: 'linear-gradient(135deg, rgba(168, 85, 247, 0.1), rgba(99, 102, 241, 0.1))',
          borderColor: 'rgba(168, 85, 247, 0.2)',
        }}
      >
        <div className="flex items-center gap-lg">
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
            <h3 className="font-display font-bold" style={{ fontSize: '1.2rem' }}>
              Pattern Intelligence Engine
            </h3>
            <p className="text-secondary text-sm" style={{ marginTop: 2 }}>
              Analyzing your mood data to discover meaningful patterns and correlations.
              {insights.length} insight{insights.length !== 1 ? 's' : ''} found.
            </p>
          </div>
        </div>
      </motion.div>

      {/* Insights List */}
      <div className="flex flex-col gap-lg section">
        {insights.map((insight, i) => {
          const config = typeConfig[insight.type] || typeConfig.neutral;
          return (
            <motion.div
              key={insight.id}
              variants={itemVariants}
              className="card"
              style={{
                background: config.bg,
                borderColor: config.border,
                boxShadow: config.glow,
              }}
              whileHover={{ x: 4, transition: { duration: 0.2 } }}
            >
              <div className="flex gap-lg" style={{ alignItems: 'flex-start' }}>
                <div style={{
                  width: 48,
                  height: 48,
                  borderRadius: 'var(--radius-md)',
                  background: config.iconBg,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1.3rem',
                  flexShrink: 0,
                }}>
                  {insight.icon}
                </div>
                <div style={{ flex: 1 }}>
                  <p style={{ fontSize: '1rem', lineHeight: 1.6, fontWeight: 500 }}>
                    {insight.text}
                  </p>
                  <div className="flex items-center gap-md" style={{ marginTop: 'var(--space-sm)' }}>
                    <div className="progress-bar" style={{ width: '100px', height: 4 }}>
                      <div
                        className="progress-fill"
                        style={{
                          width: `${insight.confidence}%`,
                          background: config.color,
                        }}
                      />
                    </div>
                    <span className="text-xs text-secondary">
                      {insight.confidence}% confidence
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Correlations Summary */}
      {tagCorrelations.length > 0 && (
        <motion.div variants={itemVariants} className="card section">
          <div className="card-header">
            <div>
              <h3 className="card-title">🔗 Activity-Mood Correlations</h3>
              <p className="card-subtitle">How activities are linked to your mood</p>
            </div>
          </div>
          <div className="flex flex-col gap-md">
            {tagCorrelations.slice(0, 6).map((tc, i) => (
              <div key={tc.tag} className="flex items-center justify-between" style={{ padding: '8px 0' }}>
                <div className="flex items-center gap-md">
                  <span style={{ fontSize: '1.2rem' }}>{tc.tagInfo?.emoji || '🏷️'}</span>
                  <div>
                    <span className="font-semibold">{tc.tagInfo?.label || tc.tag}</span>
                    <span className="text-xs text-secondary" style={{ marginLeft: 8 }}>
                      ({tc.count} entries)
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-sm">
                  <div className="progress-bar" style={{ width: '80px', height: 6 }}>
                    <div
                      className="progress-fill"
                      style={{
                        width: `${(tc.avgMood / 5) * 100}%`,
                        background: tc.avgMood >= 4 ? '#10b981' : tc.avgMood >= 3 ? '#6366f1' : '#f59e0b',
                      }}
                    />
                  </div>
                  <span className="font-semibold text-sm" style={{
                    color: tc.avgMood >= 4 ? '#10b981' : tc.avgMood >= 3 ? '#6366f1' : '#f59e0b',
                    minWidth: '30px',
                  }}>
                    {tc.avgMood}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Weekday Analysis */}
      <motion.div variants={itemVariants} className="card section">
        <div className="card-header">
          <div>
            <h3 className="card-title">📅 Weekly Rhythm</h3>
            <p className="card-subtitle">Your emotional pattern across days</p>
          </div>
        </div>
        <div className="flex flex-wrap gap-md justify-center">
          {weekdayAvgs.map((day, i) => {
            const isHighest = day.avgMood === Math.max(...weekdayAvgs.filter(d => d.avgMood > 0).map(d => d.avgMood));
            const isLowest = day.avgMood === Math.min(...weekdayAvgs.filter(d => d.avgMood > 0).map(d => d.avgMood)) && day.avgMood > 0;
            return (
              <motion.div
                key={day.day}
                className="card"
                style={{
                  textAlign: 'center',
                  padding: 'var(--space-lg)',
                  minWidth: '80px',
                  borderColor: isHighest ? 'rgba(16, 185, 129, 0.3)' : isLowest ? 'rgba(245, 158, 11, 0.3)' : undefined,
                  background: isHighest ? 'rgba(16, 185, 129, 0.08)' : isLowest ? 'rgba(245, 158, 11, 0.08)' : undefined,
                }}
                whileHover={{ y: -4 }}
              >
                <div className="text-sm font-semibold" style={{ marginBottom: 4 }}>{day.day}</div>
                <div className="font-display font-bold" style={{
                  fontSize: '1.5rem',
                  color: day.avgMood >= 4 ? '#10b981' : day.avgMood >= 3 ? '#6366f1' : day.avgMood > 0 ? '#f59e0b' : 'var(--text-tertiary)',
                }}>
                  {day.avgMood > 0 ? day.avgMood : '—'}
                </div>
                <div className="text-xs text-secondary">{day.entries} logs</div>
                {isHighest && day.avgMood > 0 && <div className="badge badge-green" style={{ marginTop: 4 }}>Best</div>}
                {isLowest && <div className="badge badge-amber" style={{ marginTop: 4 }}>Lowest</div>}
              </motion.div>
            );
          })}
        </div>
      </motion.div>
    </motion.div>
  );
}
