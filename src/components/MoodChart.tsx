import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Cell } from 'recharts';
import { MoodEntry, MoodType } from '@/hooks/useMoodStorage';

const moodColors: Record<MoodType, string> = {
  happy: 'hsl(150, 40%, 65%)',
  okay: 'hsl(220, 60%, 65%)',
  sad: 'hsl(270, 50%, 75%)',
  stressed: 'hsl(25, 80%, 75%)',
};

const moodValues: Record<MoodType, number> = {
  happy: 4,
  okay: 3,
  sad: 2,
  stressed: 1,
};

interface MoodChartProps {
  moods: MoodEntry[];
}

export const MoodChart = ({ moods }: MoodChartProps) => {
  // Get last 7 days
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - (6 - i));
    return date;
  });

  const chartData = last7Days.map(date => {
    const dayMoods = moods.filter(m => 
      new Date(m.timestamp).toDateString() === date.toDateString()
    );
    const latestMood = dayMoods[0];
    
    return {
      day: date.toLocaleDateString('en-US', { weekday: 'short' }),
      value: latestMood ? moodValues[latestMood.mood] : 0,
      mood: latestMood?.mood || null,
    };
  });

  return (
    <div className="w-full h-48">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <XAxis 
            dataKey="day" 
            axisLine={false} 
            tickLine={false}
            tick={{ fontSize: 12, fill: 'hsl(220, 15%, 50%)' }}
          />
          <YAxis 
            domain={[0, 4]} 
            hide 
          />
          <Bar dataKey="value" radius={[8, 8, 0, 0]}>
            {chartData.map((entry, index) => (
              <Cell 
                key={`cell-${index}`} 
                fill={entry.mood ? moodColors[entry.mood] : 'hsl(220, 20%, 88%)'}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};
