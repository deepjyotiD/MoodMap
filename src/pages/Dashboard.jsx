import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { Flame, TrendingUp, Calendar, Zap, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import {
  MOODS,
  calculateStreak,
  getWeeklyStats,
  getLast7DaysTrend,
  getProgressMetrics,
  generateInsights,
  getTodayLog,
} from '../store/moodStore';
import MoodSphere from '../components/MoodSphere';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div style={{
      background: 'rgba(255, 255, 255, 0.95)',
      backdropFilter: 'blur(8px)',
      border: '1px solid rgba(124, 58, 237, 0.15)',
      borderRadius: '8px',
      padding: '8px 14px',
      fontSize: '0.85rem',
      boxShadow: '0 4px 12px rgba(124, 58, 237, 0.08)'
    }}>
      <p style={{ color: '#6b7280', marginBottom: 4 }}>{label}</p>
      {payload.map((p, i) => (
        <p key={i} style={{ color: p.color, fontWeight: 600 }}>
          {p.name}: {p.value !== null ? p.value : '—'}
        </p>
      ))}
    </div>
  );
}

export default function Dashboard({ onLogMood, refreshKey }) {
  const streak = useMemo(() => calculateStreak(), [refreshKey]);
  const weeklyStats = useMemo(() => getWeeklyStats(), [refreshKey]);
  const last7Days = useMemo(() => getLast7DaysTrend(), [refreshKey]);
  const metrics = useMemo(() => getProgressMetrics(), [refreshKey]);
  const insights = useMemo(() => generateInsights().slice(0, 3), [refreshKey]);
  const todayLog = useMemo(() => getTodayLog(), [refreshKey]);
  const todayMood = todayLog ? MOODS.find(m => m.score === todayLog.moodScore) : null;

  const statCards = [
    {
      label: 'Current Streak',
      value: `${streak}`,
      suffix: 'days',
      icon: <Flame size={24} />,
      color: '#f59e0b',
      bg: 'rgba(245, 158, 11, 0.15)',
    },
    {
      label: 'Weekly Average',
      value: weeklyStats.avgMood || '—',
      suffix: '/5',
      icon: <TrendingUp size={24} />,
      color: '#6366f1',
      bg: 'rgba(99, 102, 241, 0.15)',
    },
    {
      label: 'Entries This Week',
      value: weeklyStats.totalEntries,
      suffix: '',
      icon: <Calendar size={24} />,
      color: '#10b981',
      bg: 'rgba(16, 185, 129, 0.15)',
    },
    {
      label: 'Positive Ratio',
      value: `${metrics.positiveRatio}`,
      suffix: '%',
      icon: <Zap size={24} />,
      color: '#a855f7',
      bg: 'rgba(168, 85, 247, 0.15)',
    },
  ];

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="visible">
      {/* Page Header */}
      <motion.div className="page-header" variants={itemVariants}>
        <h1>
          {todayMood ? `${todayMood.emoji} ` : '👋 '}
          {todayMood ? `Feeling ${todayMood.label} Today` : 'Welcome to MoodMap'}
        </h1>
        <p>
          {todayLog
            ? 'Your mood has been logged for today. Check your progress below.'
            : "Track your mood, discover patterns, and grow. Let's start with today!"}
        </p>
      </motion.div>

      {/* Mood Sphere + Quick Log */}
      <motion.div variants={itemVariants} className="section">
        <div className="card card-glow" style={{ textAlign: 'center' }}>
          <MoodSphere moodScore={todayLog?.moodScore || 0} height={250} />
          {!todayLog ? (
            <motion.button
              className="btn btn-primary btn-lg"
              style={{ marginTop: 'var(--space-lg)' }}
              onClick={onLogMood}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              id="dashboard-log-mood-btn"
            >
              ✨ Log Today's Mood
            </motion.button>
          ) : (
            <div style={{ marginTop: 'var(--space-md)' }}>
              <span className="badge badge-green">✓ Logged Today</span>
            </div>
          )}
        </div>
      </motion.div>

      {/* Stats Grid */}
      <motion.div variants={itemVariants} className="grid-4 section">
        {statCards.map((stat, i) => (
          <motion.div
            key={stat.label}
            className="card stat-card"
            variants={itemVariants}
            whileHover={{ y: -4, transition: { duration: 0.2 } }}
          >
            <div className="stat-icon" style={{ background: stat.bg, color: stat.color }}>
              {stat.icon}
            </div>
            <div className="stat-value" style={{ color: stat.color }}>
              {stat.value}
              <span style={{ fontSize: '1rem', fontWeight: 500, color: 'var(--text-secondary)' }}>
                {stat.suffix}
              </span>
            </div>
            <div className="stat-label">{stat.label}</div>
          </motion.div>
        ))}
      </motion.div>

      {/* Charts Row */}
      <motion.div variants={itemVariants} className="grid-2 section">
        {/* 7-Day Trend */}
        <div className="card">
          <div className="card-header">
            <div>
              <h3 className="card-title">7-Day Mood Trend</h3>
              <p className="card-subtitle">Your emotional journey this week</p>
            </div>
          </div>
          <div className="chart-container">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={last7Days}>
                <defs>
                  <linearGradient id="moodGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#a855f7" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#a855f7" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="date" axisLine={false} tickLine={false} />
                <YAxis domain={[0, 5]} axisLine={false} tickLine={false} ticks={[1, 2, 3, 4, 5]} />
                <Tooltip content={<CustomTooltip />} />
                <Area
                  type="monotone"
                  dataKey="mood"
                  stroke="#a855f7"
                  strokeWidth={3}
                  fill="url(#moodGrad)"
                  connectNulls
                  name="Mood"
                  dot={{ r: 5, fill: '#a855f7', strokeWidth: 2, stroke: '#1a1a3e' }}
                  activeDot={{ r: 7, fill: '#a855f7' }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Energy Trend */}
        <div className="card">
          <div className="card-header">
            <div>
              <h3 className="card-title">Energy Levels</h3>
              <p className="card-subtitle">How energized you've been</p>
            </div>
          </div>
          <div className="chart-container">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={last7Days}>
                <defs>
                  <linearGradient id="energyGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0.8} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="date" axisLine={false} tickLine={false} />
                <YAxis domain={[0, 10]} axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Bar
                  dataKey="energy"
                  fill="url(#energyGrad)"
                  radius={[4, 4, 0, 0]}
                  name="Energy"
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </motion.div>

      {/* Quick Insights */}
      {insights.length > 0 && (
        <motion.div variants={itemVariants} className="section">
          <div className="card">
            <div className="card-header">
              <div>
                <h3 className="card-title">✨ Quick Insights</h3>
                <p className="card-subtitle">AI-generated patterns from your data</p>
              </div>
            </div>
            <div className="flex flex-col gap-md">
              {insights.map((insight, i) => (
                <motion.div
                  key={insight.id}
                  className="insight-item"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                >
                  <div
                    className="insight-icon"
                    style={{
                      background: insight.type === 'positive'
                        ? 'rgba(16, 185, 129, 0.15)'
                        : insight.type === 'warning'
                          ? 'rgba(245, 158, 11, 0.15)'
                          : 'rgba(99, 102, 241, 0.15)',
                    }}
                  >
                    {insight.icon}
                  </div>
                  <div>
                    <p className="insight-text">{insight.text}</p>
                    <p className="insight-confidence">Confidence: {insight.confidence}%</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}
