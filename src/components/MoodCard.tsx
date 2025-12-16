import { Smile, Meh, Frown, AlertCircle } from 'lucide-react';
import { MoodEntry, MoodType } from '@/hooks/useMoodStorage';
import { cn } from '@/lib/utils';

const moodConfig: Record<MoodType, { icon: typeof Smile; color: string; bg: string }> = {
  happy: { icon: Smile, color: 'text-soft-green', bg: 'bg-soft-green-light' },
  okay: { icon: Meh, color: 'text-calm-blue', bg: 'bg-calm-blue-light' },
  sad: { icon: Frown, color: 'text-lavender', bg: 'bg-lavender-light' },
  stressed: { icon: AlertCircle, color: 'text-warm-peach', bg: 'bg-warm-peach-light' },
};

interface MoodCardProps {
  entry: MoodEntry;
  compact?: boolean;
}

export const MoodCard = ({ entry, compact = false }: MoodCardProps) => {
  const config = moodConfig[entry.mood];
  const Icon = config.icon;

  if (compact) {
    return (
      <div className={cn(
        'flex items-center gap-3 p-3 rounded-xl',
        config.bg
      )}>
        <Icon className={cn('w-5 h-5', config.color)} />
        <div className="flex-1 min-w-0">
          <p className={cn('font-medium capitalize text-sm', config.color)}>{entry.mood}</p>
          <p className="text-xs text-muted-foreground">{entry.date}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-card rounded-2xl p-4 shadow-soft border border-border/50 animate-fade-in">
      <div className="flex items-start gap-3">
        <div className={cn('p-2 rounded-xl', config.bg)}>
          <Icon className={cn('w-6 h-6', config.color)} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-1">
            <p className={cn('font-semibold capitalize', config.color)}>{entry.mood}</p>
            <span className="text-xs text-muted-foreground">{entry.date}</span>
          </div>
          {entry.reflection && (
            <p className="text-sm text-muted-foreground line-clamp-2">{entry.reflection}</p>
          )}
        </div>
      </div>
    </div>
  );
};
