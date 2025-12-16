import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MoodSelector } from '@/components/MoodSelector';
import { MoodCard } from '@/components/MoodCard';
import { useMoodStorage, MoodType } from '@/hooks/useMoodStorage';
import { Button } from '@/components/ui/button';
import { Wind, Sparkles } from 'lucide-react';
import { toast } from 'sonner';

const Index = () => {
  const navigate = useNavigate();
  const { saveMood, getTodayMood, moods } = useMoodStorage();
  const [todayMood, setTodayMood] = useState(getTodayMood());
  const [greeting, setGreeting] = useState('');

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting('Good morning');
    else if (hour < 18) setGreeting('Good afternoon');
    else setGreeting('Good evening');
  }, []);

  useEffect(() => {
    setTodayMood(getTodayMood());
  }, [moods]);

  const handleMoodSave = (mood: MoodType, reflection?: string) => {
    saveMood(mood, reflection);
    setTodayMood(getTodayMood());
    toast.success('Mood saved! Take care of yourself today 💙');
  };

  const recentMoods = moods.slice(0, 3);

  return (
    <div className="min-h-screen pb-24 md:pt-20">
      <div className="container max-w-lg px-4 py-8">
        {/* Header */}
        <header className="text-center mb-8 animate-fade-in">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent mb-2">
            MindEase
          </h1>
          <p className="text-muted-foreground">{greeting}! How are you feeling?</p>
        </header>

        {/* Main content */}
        {todayMood ? (
          <div className="space-y-6 animate-fade-in">
            <div className="text-center">
              <p className="text-lg font-medium text-foreground mb-4">
                You've already checked in today ✨
              </p>
              <MoodCard entry={todayMood} />
            </div>

            {/* Quick actions */}
            <div className="grid grid-cols-2 gap-4">
              <Button
                variant="outline"
                className="h-auto py-4 flex-col gap-2"
                onClick={() => navigate('/chat')}
              >
                <Sparkles className="w-6 h-6 text-secondary" />
                <span>Talk to AI</span>
              </Button>
              <Button
                variant="outline"
                className="h-auto py-4 flex-col gap-2"
                onClick={() => navigate('/calm')}
              >
                <Wind className="w-6 h-6 text-accent" />
                <span>Calm Mode</span>
              </Button>
            </div>

            {/* Recent moods */}
            {recentMoods.length > 1 && (
              <div className="space-y-3">
                <h3 className="font-semibold text-foreground">Recent Check-ins</h3>
                <div className="space-y-2">
                  {recentMoods.slice(1).map(mood => (
                    <MoodCard key={mood.id} entry={mood} compact />
                  ))}
                </div>
                <Button
                  variant="ghost"
                  className="w-full text-muted-foreground"
                  onClick={() => navigate('/dashboard')}
                >
                  View all history →
                </Button>
              </div>
            )}
          </div>
        ) : (
          <MoodSelector onMoodSave={handleMoodSave} />
        )}

        {/* Decorative elements */}
        <div className="fixed top-20 left-10 w-32 h-32 rounded-full bg-primary/5 blur-3xl animate-float" />
        <div className="fixed bottom-32 right-10 w-40 h-40 rounded-full bg-secondary/5 blur-3xl animate-float" style={{ animationDelay: '1s' }} />
      </div>
    </div>
  );
};

export default Index;
