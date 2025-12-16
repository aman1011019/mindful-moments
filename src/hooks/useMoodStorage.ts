import { useState, useEffect } from 'react';

export type MoodType = 'happy' | 'okay' | 'sad' | 'stressed';

export interface MoodEntry {
  id: string;
  mood: MoodType;
  reflection?: string;
  timestamp: string;
  date: string;
}

const STORAGE_KEY = 'mindease_moods';

export const useMoodStorage = () => {
  const [moods, setMoods] = useState<MoodEntry[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      setMoods(JSON.parse(stored));
    }
  }, []);

  const saveMood = (mood: MoodType, reflection?: string) => {
    const now = new Date();
    const entry: MoodEntry = {
      id: crypto.randomUUID(),
      mood,
      reflection,
      timestamp: now.toISOString(),
      date: now.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }),
    };

    const updated = [entry, ...moods];
    setMoods(updated);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    return entry;
  };

  const getTodayMood = (): MoodEntry | undefined => {
    const today = new Date().toDateString();
    return moods.find(m => new Date(m.timestamp).toDateString() === today);
  };

  const getWeeklyMoods = (): MoodEntry[] => {
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    return moods.filter(m => new Date(m.timestamp) >= weekAgo);
  };

  const getMoodStats = () => {
    const weekly = getWeeklyMoods();
    const stats = {
      happy: weekly.filter(m => m.mood === 'happy').length,
      okay: weekly.filter(m => m.mood === 'okay').length,
      sad: weekly.filter(m => m.mood === 'sad').length,
      stressed: weekly.filter(m => m.mood === 'stressed').length,
    };
    return stats;
  };

  return { moods, saveMood, getTodayMood, getWeeklyMoods, getMoodStats };
};
