import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { Flame, Target, Smile, Activity, Award, TrendingUp } from 'lucide-react';
import { getProgressMetrics, calculateStreak, getAllLogs, MOODS } from '../store/moodStore';
import { format, subDays } from 'date-fns';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
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

function CircularProgress({ value, max = 100, size = 120, strokeWidth = 8, color = '#a855f7', label, sublabel }) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (value / max) * circumference;

  return (
    <div style={{ textAlign: 'center' }}>
      <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="rgba(124, 58, 237, 0.1)"
          strokeWidth={strokeWidth}
        />
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1.2, ease: 'easeOut' }}
          style={{ filter: `drop-shadow(0 0 6px ${color}40)` }}
        />
      </svg>
      <div style={{ marginTop: '-' + (size / 2 + 14) + 'px', position: 'relative', height: size / 2 + 14, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        <span className="font-display font-bold" style={{ fontSize: size / 4, color, lineHeight: 1 }}>
          {Math.round(value)}
        </span>
        <span className="text-xs text-secondary">{sublabel || `/${max}`}</span>
      </div>
      {label && (
        <p className="text-sm font-semibold" style={{ marginTop: 'var(--space-sm)' }}>{label}</p>
      )}
    </div>
  );
}

export default function ProgressPage({ refreshKey }) {
  const metrics = useMemo(() => getProgressMetrics(), [refreshKey]);
  const streak = useMemo(() => calculateStreak(), [refreshKey]);
  const allLogs = useMemo(() => getAllLogs(), [refreshKey]);

  // Build rolling average data
  const rollingAvgData = useMemo(() => {
    const data = [];
    for (let i = 29; i >= 0; i--) {
      const date = subDays(new Date(), i);
      const dateStr = format(date, 'yyyy-MM-dd');

      // Get logs within a 7-day rolling window
      const windowLogs = allLogs.filter(log => {
        const logDate = log.createdAt.split('T')[0];
        const windowStart = format(subDays(date, 6), 'yyyy-MM-dd');
        return logDate >= windowStart && logDate <= dateStr;
      });

      const avg = windowLogs.length > 0
        ? Math.round((windowLogs.reduce((s, l) => s + l.moodScore, 0) / windowLogs.length) * 10) / 10
        : null;

      data.push({
        date: format(date, 'MMM dd'),
        avg,
      });
    }
    return data;
  }, [allLogs]);

  // Emotional stability index (lower variance = more stable)
  const stabilityIndex = useMemo(() => {
    if (allLogs.length < 5) return 0;
    const recent = allLogs.slice(0, 14);
    const avg = recent.reduce((s, l) => s + l.moodScore, 0) / recent.length;
    const variance = recent.reduce((s, l) => s + Math.pow(l.moodScore - avg, 2), 0) / recent.length;
    const stability = Math.max(0, Math.round((1 - variance / 4) * 100));
    return stability;
  }, [allLogs]);

  // Achievements
  const achievements = useMemo(() => {
    const list = [];

    if (streak >= 1) list.push({ icon: '🔥', label: 'First Streak', unlocked: true });
    if (streak >= 7) list.push({ icon: '⚡', label: '7-Day Streak', unlocked: true });
    else list.push({ icon: '⚡', label: '7-Day Streak', unlocked: false });

    if (streak >= 30) list.push({ icon: '🏆', label: '30-Day Champion', unlocked: true });
    else list.push({ icon: '🏆', label: '30-Day Champion', unlocked: false });

    if (allLogs.length >= 10) list.push({ icon: '📝', label: '10 Entries', unlocked: true });
    else list.push({ icon: '📝', label: '10 Entries', unlocked: false });

    if (allLogs.length >= 50) list.push({ icon: '💫', label: '50 Entries', unlocked: true });
    else list.push({ icon: '💫', label: '50 Entries', unlocked: false });

    if (metrics.positiveRatio >= 70) list.push({ icon: '☀️', label: 'Optimist', unlocked: true });
    else list.push({ icon: '☀️', label: 'Optimist', unlocked: false });

    return list;
  }, [streak, allLogs, metrics]);

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="visible">
      <div className="page-header">
        <h1>📈 Progress</h1>
        <p>Track your emotional growth and celebrate achievements</p>
      </div>

      {/* Streak Hero */}
      <motion.div
        variants={itemVariants}
        className="card card-glow section"
        style={{
          textAlign: 'center',
          background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.08), rgba(236, 72, 153, 0.08))',
          borderColor: 'rgba(245, 158, 11, 0.2)',
        }}
      >
        <div className="streak-container" style={{ justifyContent: 'center', marginBottom: 'var(--space-md)' }}>
          <span className="streak-fire">🔥</span>
          <div>
            <div className="streak-number">{streak}</div>
            <div className="streak-label">Day Streak</div>
          </div>
        </div>
        <p className="text-secondary">
          {streak === 0
            ? "Start logging your mood daily to build a streak!"
            : streak < 7
              ? "Keep going! Aim for a full week!"
              : streak < 30
                ? "Awesome consistency! Can you reach 30 days?"
                : "🏆 Incredible dedication! You're a mood tracking champion!"}
        </p>
      </motion.div>

      {/* Progress Circles */}
      <motion.div variants={itemVariants} className="grid-3 section">
        <div className="card" style={{ display: 'flex', justifyContent: 'center', padding: 'var(--space-2xl)' }}>
          <CircularProgress
            value={metrics.consistency}
            color="#a855f7"
            label="Consistency"
            sublabel="%"
          />
        </div>
        <div className="card" style={{ display: 'flex', justifyContent: 'center', padding: 'var(--space-2xl)' }}>
          <CircularProgress
            value={metrics.positiveRatio}
            color="#10b981"
            label="Positive Ratio"
            sublabel="%"
          />
        </div>
        <div className="card" style={{ display: 'flex', justifyContent: 'center', padding: 'var(--space-2xl)' }}>
          <CircularProgress
            value={stabilityIndex}
            color="#06b6d4"
            label="Stability Index"
            sublabel="%"
          />
        </div>
      </motion.div>

      {/* Growth Trend */}
      <motion.div variants={itemVariants} className="card section">
        <div className="card-header">
          <div>
            <h3 className="card-title">🌱 Growth Trend</h3>
            <p className="card-subtitle">7-day rolling average over the past month</p>
          </div>
        </div>
        <div className="chart-container" style={{ height: 250 }}>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={rollingAvgData}>
              <defs>
                <linearGradient id="growthGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="date" axisLine={false} tickLine={false} interval={4} />
              <YAxis domain={[1, 5]} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Area
                type="monotone"
                dataKey="avg"
                stroke="#10b981"
                strokeWidth={2.5}
                fill="url(#growthGrad)"
                connectNulls
                name="Rolling Avg"
                dot={false}
                activeDot={{ r: 5, fill: '#10b981' }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </motion.div>

      {/* Achievements */}
      <motion.div variants={itemVariants} className="card section">
        <div className="card-header">
          <div>
            <h3 className="card-title">🏅 Achievements</h3>
            <p className="card-subtitle">Unlock badges as you build your habit</p>
          </div>
          <span className="badge badge-purple">
            {achievements.filter(a => a.unlocked).length}/{achievements.length} unlocked
          </span>
        </div>
        <div className="flex flex-wrap gap-lg justify-center">
          {achievements.map((ach, i) => (
            <motion.div
              key={ach.label}
              className="card"
              style={{
                textAlign: 'center',
                padding: 'var(--space-lg)',
                minWidth: '110px',
                opacity: ach.unlocked ? 1 : 0.4,
                borderColor: ach.unlocked ? 'rgba(168, 85, 247, 0.3)' : undefined,
                background: ach.unlocked ? 'rgba(168, 85, 247, 0.05)' : undefined,
              }}
              whileHover={ach.unlocked ? { scale: 1.05, y: -4 } : {}}
            >
              <div style={{ fontSize: '2rem', marginBottom: 4 }}>{ach.icon}</div>
              <div className="text-xs font-semibold">{ach.label}</div>
              {ach.unlocked && <div className="badge badge-green" style={{ marginTop: 6 }}>✓</div>}
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Key Metrics */}
      <motion.div variants={itemVariants} className="grid-2 section">
        <div className="card stat-card">
          <div className="stat-icon" style={{ background: 'rgba(168, 85, 247, 0.15)', color: '#a855f7' }}>
            <Activity size={24} />
          </div>
          <div className="stat-value" style={{ color: '#a855f7' }}>{metrics.totalEntries}</div>
          <div className="stat-label">Total Entries</div>
        </div>
        <div className="card stat-card">
          <div className="stat-icon" style={{ background: 'rgba(99, 102, 241, 0.15)', color: '#6366f1' }}>
            <TrendingUp size={24} />
          </div>
          <div className="stat-value" style={{ color: '#6366f1' }}>
            {metrics.avgMood}
            <span style={{ fontSize: '1rem', color: 'var(--text-secondary)' }}>/5</span>
          </div>
          <div className="stat-label">Average Mood</div>
        </div>
      </motion.div>
    </motion.div>
  );
}
