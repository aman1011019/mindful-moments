import { NavLink, useLocation } from 'react-router-dom';
import { Home, BarChart3, MessageCircle, Wind } from 'lucide-react';
import { cn } from '@/lib/utils';

const navItems = [
  { to: '/', icon: Home, label: 'Home' },
  { to: '/dashboard', icon: BarChart3, label: 'Dashboard' },
  { to: '/chat', icon: MessageCircle, label: 'Chat' },
  { to: '/calm', icon: Wind, label: 'Calm' },
];

export const Navigation = () => {
  const location = useLocation();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-card/80 backdrop-blur-xl border-t border-border/50 px-4 py-2 md:top-0 md:bottom-auto md:border-t-0 md:border-b">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-around md:justify-between">
          <div className="hidden md:block">
            <h1 className="text-xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              MindEase
            </h1>
          </div>
          <div className="flex items-center gap-1 md:gap-2">
            {navItems.map(({ to, icon: Icon, label }) => {
              const isActive = location.pathname === to;
              return (
                <NavLink
                  key={to}
                  to={to}
                  className={cn(
                    'flex flex-col md:flex-row items-center gap-1 md:gap-2 px-4 py-2 rounded-xl transition-all duration-300',
                    isActive
                      ? 'bg-primary/15 text-primary'
                      : 'text-muted-foreground hover:text-primary hover:bg-primary/5'
                  )}
                >
                  <Icon className={cn('w-5 h-5', isActive && 'animate-scale-in')} />
                  <span className="text-xs md:text-sm font-medium">{label}</span>
                </NavLink>
              );
            })}
          </div>
        </div>
      </div>
    </nav>
  );
};
