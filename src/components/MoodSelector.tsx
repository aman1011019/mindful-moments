import { useState } from 'react';
import { Smile, Meh, Frown, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { MoodEmojiReaction } from '@/components/MoodEmojiReaction';
import { MoodType } from '@/hooks/useMoodStorage';
import { cn } from '@/lib/utils';

const moods = [
  { type: 'happy' as MoodType, icon: Smile, label: 'Happy', color: 'bg-soft-green-light text-soft-green hover:border-soft-green' },
  { type: 'okay' as MoodType, icon: Meh, label: 'Okay', color: 'bg-calm-blue-light text-calm-blue hover:border-calm-blue' },
  { type: 'sad' as MoodType, icon: Frown, label: 'Sad', color: 'bg-lavender-light text-lavender hover:border-lavender' },
  { type: 'stressed' as MoodType, icon: AlertCircle, label: 'Stressed', color: 'bg-warm-peach-light text-warm-peach hover:border-warm-peach' },
];

interface MoodSelectorProps {
  onMoodSave: (mood: MoodType, reflection?: string) => void;
}

export const MoodSelector = ({ onMoodSave }: MoodSelectorProps) => {
  const [selectedMood, setSelectedMood] = useState<MoodType | null>(null);
  const [animatingMood, setAnimatingMood] = useState<MoodType | null>(null);
  const [reflection, setReflection] = useState('');
  const [step, setStep] = useState<'select' | 'animate' | 'reflect'>('select');

  const handleMoodSelect = (mood: MoodType) => {
    setSelectedMood(mood);
    setAnimatingMood(mood);
    setStep('animate');
  };

  const handleAnimationComplete = () => {
    setAnimatingMood(null);
    setStep('reflect');
  };

  const handleSave = () => {
    if (selectedMood) {
      onMoodSave(selectedMood, reflection || undefined);
      setSelectedMood(null);
      setReflection('');
      setStep('select');
    }
  };

  const handleSkip = () => {
    if (selectedMood) {
      onMoodSave(selectedMood);
      setSelectedMood(null);
      setReflection('');
      setStep('select');
    }
  };

  return (
    <>
      {/* Emoji reaction overlay */}
      <MoodEmojiReaction mood={animatingMood} onComplete={handleAnimationComplete} />

      <div className="w-full max-w-md mx-auto animate-fade-in">
        {step === 'select' || step === 'animate' ? (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-foreground mb-2">How are you feeling?</h2>
              <p className="text-muted-foreground">Take a moment to check in with yourself</p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {moods.map(({ type, icon: Icon, label, color }) => (
                <Button
                  key={type}
                  variant="mood"
                  size="mood"
                  onClick={() => handleMoodSelect(type)}
                  disabled={step === 'animate'}
                  className={cn(color, 'group', step === 'animate' && 'opacity-50')}
                >
                  <Icon className="w-10 h-10 transition-transform duration-300 group-hover:scale-110" />
                  <span className="font-semibold">{label}</span>
                </Button>
              ))}
            </div>
          </div>
        ) : (
          <div className="space-y-6 animate-slide-up">
            <div className="text-center">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary mb-4">
                {moods.find(m => m.type === selectedMood)?.icon && (
                  <>
                    {(() => {
                      const Icon = moods.find(m => m.type === selectedMood)!.icon;
                      return <Icon className="w-5 h-5" />;
                    })()}
                  </>
                )}
                <span className="font-medium capitalize">{selectedMood}</span>
              </div>
              <h2 className="text-xl font-bold text-foreground mb-2">
                Would you like to share what made you feel this way today?
              </h2>
              <p className="text-muted-foreground text-sm">
                Writing can help process your feelings
              </p>
            </div>
            <Textarea
              value={reflection}
              onChange={(e) => setReflection(e.target.value)}
              placeholder="I feel this way because..."
              className="min-h-[120px] resize-none rounded-2xl border-border/50 focus:border-primary/50 bg-card/50"
            />
            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={handleSkip}
                className="flex-1"
              >
                Skip
              </Button>
              <Button
                variant="calm"
                onClick={handleSave}
                className="flex-1"
              >
                Save
              </Button>
            </div>
            <Button
              variant="ghost"
              onClick={() => {
                setSelectedMood(null);
                setStep('select');
              }}
              className="w-full text-muted-foreground"
            >
              ← Choose different mood
            </Button>
          </div>
        )}
      </div>
    </>
  );
};
