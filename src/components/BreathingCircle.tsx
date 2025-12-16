import { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

type BreathingMode = 'calm' | 'box';
type Phase = 'inhale' | 'hold1' | 'exhale' | 'hold2' | 'idle';

const modes = {
  calm: { name: 'Calm Breathing', pattern: [4, 0, 6, 0], phases: ['inhale', 'exhale'] as Phase[] },
  box: { name: 'Box Breathing', pattern: [4, 4, 4, 4], phases: ['inhale', 'hold1', 'exhale', 'hold2'] as Phase[] },
};

const phaseLabels: Record<Phase, string> = {
  inhale: 'Breathe In',
  hold1: 'Hold',
  exhale: 'Breathe Out',
  hold2: 'Hold',
  idle: 'Ready',
};

interface BreathingCircleProps {
  mode: BreathingMode;
}

export const BreathingCircle = ({ mode }: BreathingCircleProps) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [phase, setPhase] = useState<Phase>('idle');
  const [count, setCount] = useState(0);
  const [cycleCount, setCycleCount] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const phaseIndexRef = useRef(0);

  const config = modes[mode];
  const pattern = config.pattern;

  useEffect(() => {
    if (isPlaying) {
      intervalRef.current = setInterval(() => {
        setCount(prev => {
          const currentPhaseDuration = pattern[phaseIndexRef.current];
          
          if (currentPhaseDuration === 0) {
            // Skip phases with 0 duration
            phaseIndexRef.current = (phaseIndexRef.current + 1) % pattern.length;
            const nextPhase = ['inhale', 'hold1', 'exhale', 'hold2'][phaseIndexRef.current] as Phase;
            setPhase(nextPhase);
            return pattern[phaseIndexRef.current];
          }
          
          if (prev <= 1) {
            phaseIndexRef.current = (phaseIndexRef.current + 1) % pattern.length;
            const nextPhase = ['inhale', 'hold1', 'exhale', 'hold2'][phaseIndexRef.current] as Phase;
            setPhase(nextPhase);
            
            if (phaseIndexRef.current === 0) {
              setCycleCount(c => c + 1);
            }
            
            // Skip if next phase has 0 duration
            if (pattern[phaseIndexRef.current] === 0) {
              phaseIndexRef.current = (phaseIndexRef.current + 1) % pattern.length;
              const skipPhase = ['inhale', 'hold1', 'exhale', 'hold2'][phaseIndexRef.current] as Phase;
              setPhase(skipPhase);
            }
            
            return pattern[phaseIndexRef.current];
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isPlaying, pattern]);

  const handleStart = () => {
    phaseIndexRef.current = 0;
    setPhase('inhale');
    setCount(pattern[0]);
    setIsPlaying(true);
  };

  const handlePause = () => {
    setIsPlaying(false);
  };

  const handleReset = () => {
    setIsPlaying(false);
    setPhase('idle');
    setCount(0);
    setCycleCount(0);
    phaseIndexRef.current = 0;
  };

  const getCircleAnimation = () => {
    if (!isPlaying) return '';
    switch (phase) {
      case 'inhale':
        return 'animate-breathe-in';
      case 'exhale':
        return 'animate-breathe-out';
      case 'hold1':
      case 'hold2':
        return 'animate-breathe-hold';
      default:
        return '';
    }
  };

  return (
    <div className="flex flex-col items-center gap-8">
      {/* Breathing circle */}
      <div className="relative w-64 h-64 flex items-center justify-center">
        {/* Outer glow */}
        <div className={cn(
          'absolute inset-0 rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 blur-xl',
          isPlaying && 'animate-pulse-gentle'
        )} />
        
        {/* Main circle */}
        <div className={cn(
          'relative w-48 h-48 rounded-full gradient-calm flex items-center justify-center shadow-glow transition-all duration-1000',
          getCircleAnimation()
        )}>
          {/* Inner content */}
          <div className="text-center text-primary-foreground">
            <p className="text-4xl font-bold mb-1">
              {isPlaying ? count : '∞'}
            </p>
            <p className="text-sm font-medium opacity-90">
              {phaseLabels[phase]}
            </p>
          </div>
        </div>
        
        {/* Decorative rings */}
        <div className={cn(
          'absolute inset-4 rounded-full border-2 border-primary/20 transition-all duration-1000',
          isPlaying && phase === 'inhale' && 'scale-110 opacity-50'
        )} />
        <div className={cn(
          'absolute inset-8 rounded-full border border-secondary/20 transition-all duration-1000',
          isPlaying && phase === 'inhale' && 'scale-105 opacity-30'
        )} />
      </div>

      {/* Cycle counter */}
      {cycleCount > 0 && (
        <p className="text-muted-foreground text-sm animate-fade-in">
          Cycles completed: {cycleCount}
        </p>
      )}

      {/* Controls */}
      <div className="flex items-center gap-4">
        {!isPlaying ? (
          <Button
            variant="calm"
            size="lg"
            onClick={handleStart}
            className="gap-2"
          >
            <Play className="w-5 h-5" />
            {phase === 'idle' ? 'Start' : 'Resume'}
          </Button>
        ) : (
          <Button
            variant="outline"
            size="lg"
            onClick={handlePause}
            className="gap-2"
          >
            <Pause className="w-5 h-5" />
            Pause
          </Button>
        )}
        
        {(isPlaying || phase !== 'idle') && (
          <Button
            variant="ghost"
            size="icon"
            onClick={handleReset}
            className="text-muted-foreground"
          >
            <RotateCcw className="w-5 h-5" />
          </Button>
        )}
      </div>

      {/* Instructions */}
      <div className="text-center text-sm text-muted-foreground max-w-xs">
        {mode === 'calm' ? (
          <p>Breathe in for 4 seconds, out for 6 seconds. This activates your relaxation response.</p>
        ) : (
          <p>Equal breaths in, hold, out, hold. Box breathing helps reduce stress and improve focus.</p>
        )}
      </div>
    </div>
  );
};
