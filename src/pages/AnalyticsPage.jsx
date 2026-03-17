import { useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, Tooltip, ResponsiveContainer, RadarChart,
  PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, Legend,
} from 'recharts';
import {
  getMonthlyStats, getWeekdayAverages, getTagCorrelations, MOODS
} from '../store/moodStore';

const MOOD_COLORS = ['#ef4444', '#f97316', '#f59e0b', '#6366f1', '#10b981'];

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
        <p key={i} style={{ color: p.color || '#a855f7', fontWeight: 600 }}>
          {p.name}: {p.value !== null && p.value !== undefined ? p.value : '—'}
        </p>
      ))}
    </div>
  );
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

export default function AnalyticsPage({ refreshKey }) {
  const monthlyStats = useMemo(() => getMonthlyStats(), [refreshKey]);
  const weekdayAvgs = useMemo(() => getWeekdayAverages(), [refreshKey]);
  const tagCorrelations = useMemo(() => getTagCorrelations(), [refreshKey]);

  const distributionData = useMemo(() => {
    return MOODS.map(mood => ({
      name: mood.label,
      value: monthlyStats.distribution?.[mood.score] || 0,
      color: mood.color,
      emoji: mood.emoji,
    })).filter(d => d.value > 0);
  }, [monthlyStats]);

  const radarData = useMemo(() => {
    return weekdayAvgs.map(d => ({
      ...d,
      fullMark: 5,
    }));
  }, [weekdayAvgs]);

  const hasData = monthlyStats.totalEntries > 0;

  if (!hasData) {
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <div className="page-header">
          <h1>📊 Analytics</h1>
          <p>Deep dive into your mood patterns and correlations</p>
        </div>
        <div className="card empty-state">
          <div className="empty-state-icon">📊</div>
          <h3 className="empty-state-title">No data yet</h3>
          <p className="empty-state-text">Start logging your mood to see detailed analytics and pattern analysis.</p>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="visible">
      <div className="page-header">
        <h1>📊 Analytics</h1>
        <p>Deep dive into your mood patterns and correlations</p>
      </div>

      {/* Monthly Trend */}
      <motion.div variants={itemVariants} className="card section">
        <div className="card-header">
          <div>
            <h3 className="card-title">Monthly Mood Trend</h3>
            <p className="card-subtitle">Day-by-day emotional journey this month</p>
          </div>
          <div className="badge badge-purple">
            Avg: {monthlyStats.avgMood}/5
          </div>
        </div>
        <div className="chart-container" style={{ height: 280 }}>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={monthlyStats.trend}>
              <defs>
                <linearGradient id="trendGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#a855f7" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#a855f7" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="date" axisLine={false} tickLine={false} interval={2} />
              <YAxis domain={[0, 5]} axisLine={false} tickLine={false} ticks={[1, 2, 3, 4, 5]} />
              <Tooltip content={<CustomTooltip />} />
              <Area
                type="monotone"
                dataKey="mood"
                stroke="#a855f7"
                strokeWidth={2.5}
                fill="url(#trendGrad)"
                connectNulls
                name="Mood"
                dot={{ r: 3, fill: '#a855f7' }}
                activeDot={{ r: 6, fill: '#a855f7' }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </motion.div>

      <div className="grid-2 section">
        {/* Mood Distribution Pie */}
        <motion.div variants={itemVariants} className="card">
          <div className="card-header">
            <div>
              <h3 className="card-title">Mood Distribution</h3>
              <p className="card-subtitle">How your moods are spread</p>
            </div>
          </div>
          <div className="chart-container" style={{ height: 260 }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={distributionData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={3}
                  dataKey="value"
                  animationBegin={0}
                  animationDuration={800}
                >
                  {distributionData.map((entry, i) => (
                    <Cell key={i} fill={entry.color} stroke="transparent" />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex flex-wrap justify-center gap-md" style={{ marginTop: 'var(--space-md)' }}>
            {distributionData.map(d => (
              <div key={d.name} className="flex items-center gap-sm">
                <div style={{ width: 10, height: 10, borderRadius: '50%', background: d.color }} />
                <span className="text-xs text-secondary">{d.emoji} {d.name}: {d.value}</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Weekday Radar */}
        <motion.div variants={itemVariants} className="card">
          <div className="card-header">
            <div>
              <h3 className="card-title">Weekday Patterns</h3>
              <p className="card-subtitle">Average mood by day of week</p>
            </div>
          </div>
          <div className="chart-container" style={{ height: 300 }}>
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={radarData}>
                <PolarGrid stroke="rgba(124, 58, 237, 0.1)" />
                <PolarAngleAxis dataKey="day" tick={{ fill: '#6b7280', fontSize: 12 }} />
                <PolarRadiusAxis domain={[0, 5]} tick={false} axisLine={false} />
                <Radar
                  name="Avg Mood"
                  dataKey="avgMood"
                  stroke="#a855f7"
                  fill="#a855f7"
                  fillOpacity={0.2}
                  strokeWidth={2}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </div>

      {/* Tag Correlations */}
      {tagCorrelations.length > 0 && (
        <motion.div variants={itemVariants} className="card section">
          <div className="card-header">
            <div>
              <h3 className="card-title">🏷️ Tag Correlations</h3>
              <p className="card-subtitle">How activities and events affect your mood</p>
            </div>
          </div>
          <div className="chart-container" style={{ height: 260 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={tagCorrelations.slice(0, 10)} layout="vertical">
                <defs>
                  <linearGradient id="tagGrad" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="#6366f1" stopOpacity={0.8} />
                    <stop offset="100%" stopColor="#a855f7" stopOpacity={0.8} />
                  </linearGradient>
                </defs>
                <XAxis type="number" domain={[0, 5]} axisLine={false} tickLine={false} />
                <YAxis
                  type="category"
                  dataKey="tag"
                  axisLine={false}
                  tickLine={false}
                  width={80}
                  tick={{ fill: '#6b7280', fontSize: 12 }}
                  tickFormatter={(tag) => {
                    const t = tagCorrelations.find(tc => tc.tag === tag);
                    return t?.tagInfo ? `${t.tagInfo.emoji} ${t.tagInfo.label}` : tag;
                  }}
                />
                <Tooltip content={<CustomTooltip />} />
                <Bar
                  dataKey="avgMood"
                  fill="url(#tagGrad)"
                  radius={[0, 4, 4, 0]}
                  name="Avg Mood"
                  barSize={20}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      )}

      {/* Weekday Bar Chart */}
      <motion.div variants={itemVariants} className="card section">
        <div className="card-header">
          <div>
            <h3 className="card-title">📅 Mood by Day of Week</h3>
            <p className="card-subtitle">Which days are your best and worst</p>
          </div>
        </div>
        <div className="chart-container" style={{ height: 250 }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={weekdayAvgs}>
              <XAxis dataKey="day" axisLine={false} tickLine={false} />
              <YAxis domain={[0, 5]} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="avgMood" name="Avg Mood" radius={[6, 6, 0, 0]} barSize={36}>
                {weekdayAvgs.map((entry, i) => (
                  <Cell
                    key={i}
                    fill={
                      entry.avgMood >= 4 ? '#10b981' :
                      entry.avgMood >= 3 ? '#6366f1' :
                      entry.avgMood >= 2 ? '#f59e0b' :
                      entry.avgMood > 0 ? '#ef4444' : 'rgba(124, 58, 237, 0.05)'
                    }
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </motion.div>
    </motion.div>
  );
}
