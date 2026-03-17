// MoodStore - Local storage based state management
import { format, subDays, startOfWeek, endOfWeek, eachDayOfInterval, isToday, parseISO, differenceInDays, startOfMonth, endOfMonth, getDay } from 'date-fns';

const STORAGE_KEY = 'moodmap_data';

// Default tags
export const AVAILABLE_TAGS = [
  { id: 'work', label: 'Work', emoji: '💼' },
  { id: 'exercise', label: 'Exercise', emoji: '🏋️' },
  { id: 'friends', label: 'Friends', emoji: '👥' },
  { id: 'family', label: 'Family', emoji: '👨‍👩‍👧' },
  { id: 'sleep', label: 'Good Sleep', emoji: '😴' },
  { id: 'study', label: 'Study', emoji: '📚' },
  { id: 'nature', label: 'Nature', emoji: '🌿' },
  { id: 'music', label: 'Music', emoji: '🎵' },
  { id: 'meditation', label: 'Meditation', emoji: '🧘' },
  { id: 'travel', label: 'Travel', emoji: '✈️' },
  { id: 'food', label: 'Good Food', emoji: '🍕' },
  { id: 'creative', label: 'Creative', emoji: '🎨' },
  { id: 'gaming', label: 'Gaming', emoji: '🎮' },
  { id: 'reading', label: 'Reading', emoji: '📖' },
  { id: 'stress', label: 'Stress', emoji: '😰' },
  { id: 'sick', label: 'Sick', emoji: '🤒' },
];

export const MOODS = [
  { score: 5, emoji: '😄', label: 'Great', color: '#10b981' },
  { score: 4, emoji: '🙂', label: 'Good', color: '#6366f1' },
  { score: 3, emoji: '😐', label: 'Okay', color: '#f59e0b' },
  { score: 2, emoji: '😞', label: 'Bad', color: '#f97316' },
  { score: 1, emoji: '😡', label: 'Awful', color: '#ef4444' },
];

function loadData() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error('Failed to load mood data:', e);
  }
  return { logs: [], settings: { reminderTime: '20:00', name: '' } };
}

function saveData(data) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (e) {
    console.error('Failed to save mood data:', e);
  }
}

// Generate sample data for demo purposes
export function generateSampleData() {
  const data = loadData();
  if (data.logs.length > 0) return data;

  const sampleLogs = [];
  const tagOptions = ['work', 'exercise', 'friends', 'family', 'sleep', 'study', 'nature', 'music', 'meditation', 'food', 'stress'];
  const notes = [
    'Had a productive day at work!',
    'Great workout session today.',
    'Feeling stressed about deadlines.',
    'Spent quality time with family.',
    'Meditation helped calm my mind.',
    'Had fun with friends this evening.',
    'Not feeling well today.',
    'Beautiful weather, went for a walk.',
    'Finished a great book!',
    'Could not sleep well last night.',
    '',
    '',
  ];

  for (let i = 60; i >= 1; i--) {
    // ~70% chance of having an entry
    if (Math.random() > 0.7) continue;

    const date = subDays(new Date(), i);
    const dayOfWeek = getDay(date);
    let baseMood = 3;

    // Add patterns: weekends are happier, mid-week slightly lower
    if (dayOfWeek === 0 || dayOfWeek === 6) baseMood = 4;
    if (dayOfWeek === 2 || dayOfWeek === 3) baseMood = 3;

    // Add some randomness
    const moodScore = Math.max(1, Math.min(5, baseMood + Math.floor(Math.random() * 3) - 1));

    // Pick 1-3 random tags
    const numTags = Math.floor(Math.random() * 3) + 1;
    const shuffledTags = [...tagOptions].sort(() => Math.random() - 0.5);
    const tags = shuffledTags.slice(0, numTags);

    // If exercise tag, mood is often better
    if (tags.includes('exercise') && moodScore < 4) {
      // Boost mood on exercise days sometimes
    }

    sampleLogs.push({
      id: `sample-${i}`,
      moodScore,
      energyLevel: Math.max(1, Math.min(10, moodScore * 2 + Math.floor(Math.random() * 3) - 1)),
      tags,
      note: notes[Math.floor(Math.random() * notes.length)],
      createdAt: format(date, "yyyy-MM-dd'T'HH:mm:ss"),
    });
  }

  data.logs = sampleLogs;
  saveData(data);
  return data;
}

// CRUD Operations
export function addMoodLog(log) {
  const data = loadData();
  const newLog = {
    id: `log-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    ...log,
    createdAt: new Date().toISOString(),
  };
  data.logs.unshift(newLog);
  saveData(data);
  return newLog;
}

export function getAllLogs() {
  return loadData().logs;
}

export function getLogsByDateRange(startDate, endDate) {
  const logs = loadData().logs;
  return logs.filter(log => {
    const logDate = log.createdAt.split('T')[0];
    return logDate >= format(startDate, 'yyyy-MM-dd') && logDate <= format(endDate, 'yyyy-MM-dd');
  });
}

export function getLogForDate(date) {
  const dateStr = format(date, 'yyyy-MM-dd');
  const logs = loadData().logs;
  return logs.find(log => log.createdAt.startsWith(dateStr));
}

export function getTodayLog() {
  return getLogForDate(new Date());
}

export function deleteMoodLog(id) {
  const data = loadData();
  data.logs = data.logs.filter(log => log.id !== id);
  saveData(data);
}

// Analytics
export function calculateStreak() {
  const logs = loadData().logs;
  if (logs.length === 0) return 0;

  let streak = 0;
  let currentDate = new Date();

  // Check if today has an entry
  const todayLog = getLogForDate(currentDate);
  if (!todayLog) {
    // Check yesterday
    currentDate = subDays(currentDate, 1);
    const yesterdayLog = getLogForDate(currentDate);
    if (!yesterdayLog) return 0;
  }

  // Count consecutive days
  while (true) {
    const log = getLogForDate(currentDate);
    if (log) {
      streak++;
      currentDate = subDays(currentDate, 1);
    } else {
      break;
    }
  }

  return streak;
}

export function getWeeklyStats() {
  const start = startOfWeek(new Date(), { weekStartsOn: 1 });
  const end = endOfWeek(new Date(), { weekStartsOn: 1 });
  const logs = getLogsByDateRange(start, end);

  if (logs.length === 0) return { avgMood: 0, totalEntries: 0, mostFrequentMood: null, moodCounts: {} };

  const totalMood = logs.reduce((sum, log) => sum + log.moodScore, 0);
  const avgMood = totalMood / logs.length;

  const moodCounts = {};
  logs.forEach(log => {
    moodCounts[log.moodScore] = (moodCounts[log.moodScore] || 0) + 1;
  });

  const mostFrequentMood = Object.entries(moodCounts).sort((a, b) => b[1] - a[1])[0];

  return {
    avgMood: Math.round(avgMood * 10) / 10,
    totalEntries: logs.length,
    mostFrequentMood: mostFrequentMood ? parseInt(mostFrequentMood[0]) : null,
    moodCounts,
  };
}

export function getMonthlyStats() {
  const start = startOfMonth(new Date());
  const end = endOfMonth(new Date());
  const logs = getLogsByDateRange(start, end);

  if (logs.length === 0) return { avgMood: 0, totalEntries: 0, trend: [], distribution: {} };

  const totalMood = logs.reduce((sum, log) => sum + log.moodScore, 0);
  const avgMood = totalMood / logs.length;

  // Daily trend
  const days = eachDayOfInterval({ start, end: new Date() > end ? end : new Date() });
  const trend = days.map(day => {
    const dayStr = format(day, 'yyyy-MM-dd');
    const dayLog = logs.find(l => l.createdAt.startsWith(dayStr));
    return {
      date: format(day, 'MMM dd'),
      mood: dayLog ? dayLog.moodScore : null,
      energy: dayLog ? dayLog.energyLevel : null,
    };
  });

  // Distribution
  const distribution = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
  logs.forEach(log => {
    distribution[log.moodScore]++;
  });

  return {
    avgMood: Math.round(avgMood * 10) / 10,
    totalEntries: logs.length,
    trend,
    distribution,
  };
}

export function getWeekdayAverages() {
  const logs = loadData().logs;
  const weekdayTotals = {};
  const weekdayCounts = {};
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  logs.forEach(log => {
    const day = getDay(parseISO(log.createdAt));
    weekdayTotals[day] = (weekdayTotals[day] || 0) + log.moodScore;
    weekdayCounts[day] = (weekdayCounts[day] || 0) + 1;
  });

  return dayNames.map((name, i) => ({
    day: name,
    avgMood: weekdayCounts[i] ? Math.round((weekdayTotals[i] / weekdayCounts[i]) * 10) / 10 : 0,
    entries: weekdayCounts[i] || 0,
  }));
}

export function getTagCorrelations() {
  const logs = loadData().logs;
  const tagMoods = {};
  const tagCounts = {};

  logs.forEach(log => {
    if (log.tags) {
      log.tags.forEach(tag => {
        tagMoods[tag] = (tagMoods[tag] || 0) + log.moodScore;
        tagCounts[tag] = (tagCounts[tag] || 0) + 1;
      });
    }
  });

  return Object.entries(tagCounts)
    .filter(([, count]) => count >= 2)
    .map(([tag, count]) => ({
      tag,
      avgMood: Math.round((tagMoods[tag] / count) * 10) / 10,
      count,
      tagInfo: AVAILABLE_TAGS.find(t => t.id === tag),
    }))
    .sort((a, b) => b.avgMood - a.avgMood);
}

export function generateInsights() {
  const logs = loadData().logs;
  if (logs.length < 5) return [];

  const insights = [];
  const weekdayAvgs = getWeekdayAverages();
  const tagCorrelations = getTagCorrelations();

  // Find best and worst days
  const validDays = weekdayAvgs.filter(d => d.entries > 0);
  if (validDays.length >= 3) {
    const bestDay = validDays.reduce((a, b) => a.avgMood > b.avgMood ? a : b);
    const worstDay = validDays.reduce((a, b) => a.avgMood < b.avgMood ? a : b);

    if (bestDay.avgMood > 0) {
      insights.push({
        id: 'best-day',
        icon: '📅',
        text: `${bestDay.day}s tend to be your best days with an average mood of ${bestDay.avgMood}/5`,
        confidence: Math.min(95, bestDay.entries * 15),
        type: 'positive',
      });
    }

    if (worstDay.avgMood > 0 && worstDay.avgMood < bestDay.avgMood) {
      insights.push({
        id: 'worst-day',
        icon: '📉',
        text: `Your mood tends to dip on ${worstDay.day}s (avg ${worstDay.avgMood}/5). Consider planning uplifting activities!`,
        confidence: Math.min(90, worstDay.entries * 15),
        type: 'warning',
      });
    }
  }

  // Tag correlations
  if (tagCorrelations.length > 0) {
    const bestTag = tagCorrelations[0];
    if (bestTag.avgMood >= 3.5) {
      insights.push({
        id: 'best-tag',
        icon: '🏷️',
        text: `Activities tagged "${bestTag.tagInfo?.label || bestTag.tag}" correlate with higher mood (avg ${bestTag.avgMood}/5)`,
        confidence: Math.min(90, bestTag.count * 12),
        type: 'positive',
      });
    }

    const worstTag = tagCorrelations[tagCorrelations.length - 1];
    if (worstTag.avgMood < 3 && tagCorrelations.length > 1) {
      insights.push({
        id: 'worst-tag',
        icon: '⚠️',
        text: `Days with "${worstTag.tagInfo?.label || worstTag.tag}" tend to have lower mood scores (avg ${worstTag.avgMood}/5)`,
        confidence: Math.min(85, worstTag.count * 12),
        type: 'warning',
      });
    }
  }

  // Streak insight
  const streak = calculateStreak();
  if (streak >= 3) {
    insights.push({
      id: 'streak',
      icon: '🔥',
      text: `Amazing ${streak}-day streak! Consistent tracking leads to better self-awareness.`,
      confidence: 95,
      type: 'positive',
    });
  }

  // Recent trend
  const recentLogs = logs.slice(0, 7);
  const olderLogs = logs.slice(7, 14);
  if (recentLogs.length >= 3 && olderLogs.length >= 3) {
    const recentAvg = recentLogs.reduce((s, l) => s + l.moodScore, 0) / recentLogs.length;
    const olderAvg = olderLogs.reduce((s, l) => s + l.moodScore, 0) / olderLogs.length;
    const diff = recentAvg - olderAvg;

    if (Math.abs(diff) > 0.3) {
      insights.push({
        id: 'trend',
        icon: diff > 0 ? '📈' : '📉',
        text: diff > 0
          ? `Your mood has improved by ${Math.round(diff * 10) / 10} points compared to the previous week!`
          : `Your mood has decreased by ${Math.round(Math.abs(diff) * 10) / 10} points. Take care of yourself! 💛`,
        confidence: 80,
        type: diff > 0 ? 'positive' : 'warning',
      });
    }
  }

  // Positive mood ratio
  const positiveLogs = logs.filter(l => l.moodScore >= 4);
  const ratio = Math.round((positiveLogs.length / logs.length) * 100);
  insights.push({
    id: 'positivity',
    icon: '✨',
    text: `${ratio}% of your logged days have been positive (Good or Great). ${ratio >= 60 ? 'Keep it up! 🎉' : 'Small improvements add up! 💪'}`,
    confidence: 90,
    type: ratio >= 50 ? 'positive' : 'neutral',
  });

  return insights.sort((a, b) => b.confidence - a.confidence);
}

export function getProgressMetrics() {
  const logs = loadData().logs;
  if (logs.length === 0) return { consistency: 0, positiveRatio: 0, streak: 0, totalEntries: 0, avgMood: 0 };

  const streak = calculateStreak();
  const positiveLogs = logs.filter(l => l.moodScore >= 4);
  const totalMood = logs.reduce((s, l) => s + l.moodScore, 0);

  // Consistency: entries in last 30 days / 30
  const last30Days = getLogsByDateRange(subDays(new Date(), 30), new Date());
  const consistency = Math.round((last30Days.length / 30) * 100);

  return {
    consistency: Math.min(100, consistency),
    positiveRatio: Math.round((positiveLogs.length / logs.length) * 100),
    streak,
    totalEntries: logs.length,
    avgMood: Math.round((totalMood / logs.length) * 10) / 10,
  };
}

export function getHeatmapData(year, month) {
  const start = new Date(year, month, 1);
  const end = endOfMonth(start);
  const days = eachDayOfInterval({ start, end });
  const logs = getLogsByDateRange(start, end);

  return days.map(day => {
    const dayStr = format(day, 'yyyy-MM-dd');
    const log = logs.find(l => l.createdAt.startsWith(dayStr));
    return {
      date: day,
      dateStr: dayStr,
      dayOfMonth: day.getDate(),
      dayOfWeek: getDay(day),
      mood: log ? log.moodScore : null,
      log,
    };
  });
}

export function getLast7DaysTrend() {
  const days = [];
  for (let i = 6; i >= 0; i--) {
    const date = subDays(new Date(), i);
    const log = getLogForDate(date);
    days.push({
      date: format(date, 'EEE'),
      fullDate: format(date, 'MMM dd'),
      mood: log ? log.moodScore : null,
      energy: log ? log.energyLevel : null,
    });
  }
  return days;
}
