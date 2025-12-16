import { useState } from 'react';
import { BreathingCircle } from '@/components/BreathingCircle';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

type BreathingMode = 'calm' | 'box';

const CalmMode = () => {
  const [mode, setMode] = useState<BreathingMode>('calm');

  return (
    <div className="min-h-screen pb-24 md:pt-20">
      <div className="container max-w-lg px-4 py-8">
        {/* Header */}
        <header className="text-center mb-8 animate-fade-in">
          <h1 className="text-2xl font-bold text-foreground mb-1">Calm Mode</h1>
          <p className="text-muted-foreground">Find your peace with guided breathing</p>
        </header>

        {/* Mode selector */}
        <div className="flex gap-2 mb-8 p-1 bg-muted/50 rounded-xl animate-fade-in">
          <Button
            variant="ghost"
            className={cn(
              'flex-1 rounded-lg transition-all duration-300',
              mode === 'calm' && 'bg-card shadow-soft text-primary'
            )}
            onClick={() => setMode('calm')}
          >
            Calm (4-4-6)
          </Button>
          <Button
            variant="ghost"
            className={cn(
              'flex-1 rounded-lg transition-all duration-300',
              mode === 'box' && 'bg-card shadow-soft text-primary'
            )}
            onClick={() => setMode('box')}
          >
            Box (4-4-4-4)
          </Button>
        </div>

        {/* Breathing exercise */}
        <div className="animate-scale-in">
          <BreathingCircle mode={mode} />
        </div>

        {/* Benefits section */}
        <section className="mt-12 space-y-4 animate-fade-in" style={{ animationDelay: '300ms' }}>
          <h2 className="font-semibold text-foreground text-center">Benefits of Breathing</h2>
          <div className="grid gap-3">
            {[
              { title: 'Reduces Stress', desc: 'Activates your parasympathetic nervous system' },
              { title: 'Improves Focus', desc: 'Increases oxygen flow to your brain' },
              { title: 'Better Sleep', desc: 'Calms your mind before rest' },
            ].map((benefit, i) => (
              <div
                key={benefit.title}
                className="bg-card rounded-xl p-4 shadow-soft border border-border/50"
                style={{ animationDelay: `${(i + 1) * 100}ms` }}
              >
                <h3 className="font-medium text-foreground">{benefit.title}</h3>
                <p className="text-sm text-muted-foreground">{benefit.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Background decoration */}
        <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full bg-primary/5 blur-3xl animate-float" />
          <div className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full bg-secondary/5 blur-3xl animate-float" style={{ animationDelay: '2s' }} />
        </div>
      </div>
    </div>
  );
};

export default CalmMode;
