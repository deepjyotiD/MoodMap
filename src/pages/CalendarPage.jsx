import { useState, useMemo, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { format, addMonths, subMonths } from 'date-fns';
import { getHeatmapData, MOODS } from '../store/moodStore';
import { useTimeline } from '../context/TimelineContext';
import SoundManager from '../utils/soundManager';

const DAY_LABELS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.03 },
  },
};

const cellVariants = {
  hidden: { opacity: 0, scale: 0.5 },
  visible: { opacity: 1, scale: 1 },
};

export default function CalendarPage({ refreshKey }) {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [hoveredDay, setHoveredDay] = useState(null);
  const { selectedDate, selectDate } = useTimeline();

  const heatmapData = useMemo(
    () => getHeatmapData(currentMonth.getFullYear(), currentMonth.getMonth()),
    [currentMonth, refreshKey]
  );

  const prevMonth = () => {
    SoundManager.play('click');
    setCurrentMonth(prev => subMonths(prev, 1));
  };

  const nextMonth = () => {
    SoundManager.play('click');
    setCurrentMonth(prev => addMonths(prev, 1));
  };

  const handleDayClick = (day) => {
    SoundManager.play('select');
    selectDate(day.dateStr);
  };

  // Calculate offset for first day of month
  const firstDayOffset = heatmapData.length > 0 ? heatmapData[0].dayOfWeek : 0;

  // Stats for the month
  const loggedDays = heatmapData.filter(d => d.mood !== null);
  const avgMood = loggedDays.length > 0
    ? Math.round((loggedDays.reduce((s, d) => s + d.mood, 0) / loggedDays.length) * 10) / 10
    : 0;
  const bestDay = loggedDays.length > 0
    ? loggedDays.reduce((a, b) => a.mood > b.mood ? a : b)
    : null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div className="page-header">
        <h1>📅 Mood Calendar</h1>
        <p>Visualize your emotional journey day by day</p>
      </div>

      {/* Month Navigator */}
      <div className="card section">
        <div className="card-header">
          <button className="btn btn-ghost btn-icon" onClick={prevMonth} id="calendar-prev-month">
            <ChevronLeft size={20} />
          </button>
          <h2 className="card-title" style={{ fontSize: '1.3rem' }}>
            {format(currentMonth, 'MMMM yyyy')}
          </h2>
          <button className="btn btn-ghost btn-icon" onClick={nextMonth} id="calendar-next-month">
            <ChevronRight size={20} />
          </button>
        </div>

        {/* Day Labels */}
        <div className="heatmap-grid" style={{ marginBottom: 4 }}>
          {DAY_LABELS.map(day => (
            <div key={day} className="heatmap-day-label">{day}</div>
          ))}
        </div>

        {/* Calendar Grid */}
        <motion.div
          className="heatmap-grid"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          key={format(currentMonth, 'yyyy-MM')}
        >
          {/* Empty cells for offset */}
          {Array.from({ length: firstDayOffset }).map((_, i) => (
            <div key={`empty-${i}`} />
          ))}

          {/* Day Cells */}
          {heatmapData.map((day, i) => {
            const isSelected = selectedDate === day.dateStr;
            return (
              <motion.div
                key={day.dateStr}
                className={`heatmap-cell ${day.mood ? `mood-${day.mood}` : ''} ${isSelected ? 'selected-day' : ''}`}
                variants={cellVariants}
                onClick={() => handleDayClick(day)}
                onMouseEnter={() => setHoveredDay(day)}
                onMouseLeave={() => setHoveredDay(null)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '0.7rem',
                  fontWeight: 500,
                  color: day.mood ? 'white' : 'var(--text-tertiary)',
                  position: 'relative',
                  minHeight: '44px',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  transform: isSelected ? 'scale(1.08)' : 'scale(1)',
                  boxShadow: isSelected ? '0 4px 12px rgba(124, 58, 237, 0.3)' : 'none',
                  borderRadius: 'var(--radius-sm)',
                }}
              >
                {day.dayOfMonth}
                {day.mood && (
                  <span style={{
                    position: 'absolute',
                    bottom: 2,
                    fontSize: '0.65rem',
                    lineHeight: 1,
                  }}>
                    {MOODS.find(m => m.score === day.mood)?.emoji}
                  </span>
                )}
              </motion.div>
            );
          })}
        </motion.div>

        {/* Legend */}
        <div className="flex items-center justify-center gap-lg" style={{ marginTop: 'var(--space-xl)' }}>
          <span className="text-xs text-secondary">Awful</span>
          {MOODS.slice().reverse().map(mood => (
            <div
              key={mood.score}
              style={{
                width: 20,
                height: 20,
                borderRadius: 4,
                background: mood.color,
              }}
              title={mood.label}
            />
          ))}
          <span className="text-xs text-secondary">Great</span>
        </div>
      </div>

      {/* Hovered Day Detail */}
      {hoveredDay?.log && (
        <motion.div
          className="card section"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex items-center gap-md" style={{ marginBottom: 'var(--space-sm)' }}>
            <span style={{ fontSize: '2rem' }}>
              {MOODS.find(m => m.score === hoveredDay.mood)?.emoji}
            </span>
            <div>
              <h3 className="font-semibold">
                {format(hoveredDay.date, 'EEEE, MMMM d')}
              </h3>
              <p className="text-secondary text-sm">
                Mood: {MOODS.find(m => m.score === hoveredDay.mood)?.label} •
                Energy: {hoveredDay.log.energyLevel}/10
              </p>
            </div>
          </div>
          {hoveredDay.log.note && (
            <p className="text-secondary" style={{ fontStyle: 'italic', marginTop: 'var(--space-sm)' }}>
              "{hoveredDay.log.note}"
            </p>
          )}
          {hoveredDay.log.tags?.length > 0 && (
            <div className="tag-container" style={{ marginTop: 'var(--space-sm)' }}>
              {hoveredDay.log.tags.map(tag => (
                <span key={tag} className="tag">{tag}</span>
              ))}
            </div>
          )}
        </motion.div>
      )}

      {/* Month Summary */}
      <div className="grid-3 section">
        <div className="card stat-card">
          <div className="stat-label">Days Logged</div>
          <div className="stat-value" style={{ color: 'var(--accent-purple)' }}>
            {loggedDays.length}
            <span style={{ fontSize: '1rem', color: 'var(--text-secondary)' }}>/{heatmapData.length}</span>
          </div>
        </div>
        <div className="card stat-card">
          <div className="stat-label">Average Mood</div>
          <div className="stat-value" style={{ color: 'var(--accent-indigo)' }}>
            {avgMood || '—'}
            <span style={{ fontSize: '1rem', color: 'var(--text-secondary)' }}>/5</span>
          </div>
        </div>
        <div className="card stat-card">
          <div className="stat-label">Best Day</div>
          <div className="stat-value" style={{ color: 'var(--accent-green)' }}>
            {bestDay ? format(bestDay.date, 'MMM d') : '—'}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
