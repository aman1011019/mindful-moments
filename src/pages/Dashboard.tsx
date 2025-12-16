import { useMoodStorage } from '@/hooks/useMoodStorage';
import { MoodChart } from '@/components/MoodChart';
import { MoodCard } from '@/components/MoodCard';
import { Smile, Meh, Frown, AlertCircle, TrendingUp } from 'lucide-react';

const Dashboard = () => {
  const { moods, getMoodStats, getWeeklyMoods } = useMoodStorage();
  const stats = getMoodStats();
  const weeklyMoods = getWeeklyMoods();

  const statCards = [
    { mood: 'happy', icon: Smile, count: stats.happy, color: 'bg-soft-green-light text-soft-green' },
    { mood: 'okay', icon: Meh, count: stats.okay, color: 'bg-calm-blue-light text-calm-blue' },
    { mood: 'sad', icon: Frown, count: stats.sad, color: 'bg-lavender-light text-lavender' },
    { mood: 'stressed', icon: AlertCircle, count: stats.stressed, color: 'bg-warm-peach-light text-warm-peach' },
  ];

  return (
    <div className="min-h-screen pb-24 md:pt-20">
      <div className="container max-w-lg px-4 py-8">
        {/* Header */}
        <header className="mb-8 animate-fade-in">
          <h1 className="text-2xl font-bold text-foreground mb-1">Your Journey</h1>
          <p className="text-muted-foreground">Track your emotional wellness over time</p>
        </header>

        {/* Weekly chart */}
        <section className="bg-card rounded-2xl p-4 shadow-soft border border-border/50 mb-6 animate-fade-in">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="w-5 h-5 text-primary" />
            <h2 className="font-semibold text-foreground">This Week</h2>
          </div>
          {weeklyMoods.length > 0 ? (
            <MoodChart moods={moods} />
          ) : (
            <div className="h-48 flex items-center justify-center text-muted-foreground">
              <p>Start checking in to see your patterns</p>
            </div>
          )}
        </section>

        {/* Stats grid */}
        <section className="grid grid-cols-2 gap-3 mb-6">
          {statCards.map(({ mood, icon: Icon, count, color }) => (
            <div
              key={mood}
              className="bg-card rounded-xl p-4 shadow-soft border border-border/50 animate-scale-in"
              style={{ animationDelay: `${statCards.indexOf({ mood, icon: Icon, count, color }) * 100}ms` }}
            >
              <div className={`w-10 h-10 rounded-lg ${color} flex items-center justify-center mb-2`}>
                <Icon className="w-5 h-5" />
              </div>
              <p className="text-2xl font-bold text-foreground">{count}</p>
              <p className="text-sm text-muted-foreground capitalize">{mood} days</p>
            </div>
          ))}
        </section>

        {/* All entries */}
        <section className="space-y-3">
          <h2 className="font-semibold text-foreground">All Check-ins</h2>
          {moods.length > 0 ? (
            <div className="space-y-3">
              {moods.map((mood, index) => (
                <div key={mood.id} style={{ animationDelay: `${index * 50}ms` }}>
                  <MoodCard entry={mood} />
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-card rounded-2xl p-8 text-center shadow-soft border border-border/50">
              <p className="text-muted-foreground">No check-ins yet. Start your wellness journey today!</p>
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default Dashboard;
