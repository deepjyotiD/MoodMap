import { createContext, useContext, useState } from 'react';

const TimelineContext = createContext();

export function TimelineProvider({ children }) {
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedRange, setSelectedRange] = useState({ start: null, end: null });

  const selectDate = (date) => {
    setSelectedDate(date);
  };

  const selectDateRange = (start, end) => {
    setSelectedRange({ start, end });
  };

  const clearSelection = () => {
    setSelectedDate(null);
    setSelectedRange({ start: null, end: null });
  };

  return (
    <TimelineContext.Provider
      value={{
        selectedDate,
        selectedRange,
        selectDate,
        selectDateRange,
        clearSelection,
      }}
    >
      {children}
    </TimelineContext.Provider>
  );
}

export function useTimeline() {
  const context = useContext(TimelineContext);
  if (!context) {
    throw new Error('useTimeline must be used within TimelineProvider');
  }
  return context;
}
