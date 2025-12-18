import { useState, useRef, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Send, Wind, Heart, MessageCircle, Sparkles, CheckCircle, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ChatMessage, TypingIndicator } from '@/components/ChatMessage';
import { useChat, ConversationStage } from '@/hooks/useChat';

const moodConfig = {
  sad: { emoji: '😔', label: 'Feeling Sad', className: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300' },
  stressed: { emoji: '😣', label: 'Feeling Stressed', className: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300' },
};

const progressStages = [
  { key: 'initial', label: 'Opening', icon: Heart },
  { key: 'listening', label: 'Sharing', icon: MessageCircle },
  { key: 'suggested_breathing', label: 'Breathing', icon: Sparkles },
  { key: 'closing', label: 'Closing', icon: CheckCircle },
] as const;

const getProgressIndex = (stage: ConversationStage): number => {
  const stageMap: Record<ConversationStage, number> = {
    initial: 0,
    listening: 1,
    suggested_breathing: 2,
    post_breathing: 2,
    closing: 3,
  };
  return stageMap[stage];
};

// Celebration particles config - burst pattern with larger center emojis
const celebrationEmojis = ['🎉', '✨', '💫', '🌟', '💖', '🎊', '💜', '⭐'];
const celebrationParticles = Array.from({ length: 24 }, (_, i) => {
  const row = Math.floor(i / 8);
  const col = i % 8;
  // Calculate distance from center (col 3.5 is center)
  const distFromCenter = Math.abs(col - 3.5);
  const sizeMultiplier = 1.8 - (distFromCenter * 0.25); // Larger in center
  return {
    id: i,
    emoji: celebrationEmojis[col],
    x: 5 + col * 12, // Better horizontal distribution
    delay: row * 0.12 + (col % 2) * 0.08,
    size: sizeMultiplier,
  };
});

// Celebration sound using Web Audio API
const playCelebrationSound = () => {
  try {
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    
    // Play a triumphant chord progression
    const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
    notes.forEach((freq, i) => {
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      oscillator.frequency.setValueAtTime(freq, audioContext.currentTime);
      oscillator.type = 'sine';
      
      gainNode.gain.setValueAtTime(0, audioContext.currentTime);
      gainNode.gain.linearRampToValueAtTime(0.15, audioContext.currentTime + 0.1 + i * 0.08);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 1.5);
      
      oscillator.start(audioContext.currentTime + i * 0.08);
      oscillator.stop(audioContext.currentTime + 1.8);
    });
    
    // Add a soft shimmer effect
    setTimeout(() => {
      const shimmer = audioContext.createOscillator();
      const shimmerGain = audioContext.createGain();
      shimmer.connect(shimmerGain);
      shimmerGain.connect(audioContext.destination);
      shimmer.frequency.setValueAtTime(1318.51, audioContext.currentTime); // E6
      shimmer.type = 'sine';
      shimmerGain.gain.setValueAtTime(0.08, audioContext.currentTime);
      shimmerGain.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.8);
      shimmer.start();
      shimmer.stop(audioContext.currentTime + 0.8);
    }, 400);
  } catch (e) {
    console.log('Audio not supported');
  }
};

const Chat = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const moodParam = searchParams.get('mood') as 'sad' | 'stressed' | null;
  
  const { messages, sendMessage, isTyping, conversationState } = useChat(moodParam);
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [showCelebration, setShowCelebration] = useState(false);
  const [hasShownCelebration, setHasShownCelebration] = useState(false);

  const currentProgressIndex = getProgressIndex(conversationState);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  // Trigger celebration when reaching closing stage
  useEffect(() => {
    if (conversationState === 'closing' && !hasShownCelebration) {
      setShowCelebration(true);
      setHasShownCelebration(true);
      playCelebrationSound();
      
      // Auto-hide celebration after animation
      const timer = setTimeout(() => {
        setShowCelebration(false);
      }, 3500);
      
      return () => clearTimeout(timer);
    }
  }, [conversationState, hasShownCelebration]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim()) {
      sendMessage(input.trim());
      setInput('');
    }
  };

  const quickReplies = moodParam === 'sad'
    ? [
        "I want to talk about it",
        "I'm feeling lonely",
        "I don't know why I'm sad",
        "Help me feel better",
      ]
    : moodParam === 'stressed'
    ? [
        "Work is overwhelming",
        "I can't stop worrying",
        "Everything feels too much",
        "Help me calm down",
      ]
    : [
        "I'm feeling stressed",
        "I need to talk",
        "Help me relax",
      ];

  return (
    <div className="h-screen flex flex-col relative overflow-hidden">
      {/* Celebration Animation */}
      <AnimatePresence>
        {showCelebration && (
          <>
            {/* Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 pointer-events-none"
            >
              {/* Falling particles with varying sizes */}
              {celebrationParticles.map((particle) => (
                <motion.div
                  key={particle.id}
                  initial={{ 
                    y: -60, 
                    x: `${particle.x}vw`,
                    opacity: 0,
                    scale: 0,
                    rotate: 0,
                  }}
                  animate={{ 
                    y: '100vh',
                    opacity: [0, 1, 1, 0],
                    scale: [0, particle.size * 1.2, particle.size, particle.size * 0.5],
                    rotate: [0, 180, 360],
                  }}
                  transition={{ 
                    duration: 2.8,
                    delay: particle.delay,
                    ease: 'easeOut',
                  }}
                  className="absolute"
                  style={{ fontSize: `${particle.size * 2}rem` }}
                >
                  {particle.emoji}
                </motion.div>
              ))}
              
              {/* Center celebration message */}
              <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0, opacity: 0 }}
                transition={{ 
                  type: 'spring',
                  stiffness: 200,
                  damping: 15,
                  delay: 0.2,
                }}
                className="absolute inset-0 flex items-center justify-center"
              >
                <motion.div
                  animate={{ 
                    scale: [1, 1.05, 1],
                  }}
                  transition={{ 
                    duration: 0.8,
                    repeat: 2,
                    repeatType: 'reverse',
                  }}
                  className="bg-background/95 backdrop-blur-md border border-primary/30 rounded-3xl px-10 py-8 shadow-2xl text-center"
                >
                  <motion.div
                    initial={{ scale: 0, rotate: -20 }}
                    animate={{ scale: [1, 1.2, 1], rotate: [0, 10, -10, 0] }}
                    transition={{ delay: 0.4, duration: 0.8, type: 'spring' }}
                    className="text-6xl md:text-7xl mb-3"
                  >
                    🎉
                  </motion.div>
                  <h3 className="text-xl font-bold text-foreground">Journey Complete!</h3>
                  <p className="text-sm text-muted-foreground mt-2">You did amazing today 💖</p>
                </motion.div>
              </motion.div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
      {/* Header */}
      <header className="shrink-0 bg-background/80 backdrop-blur-xl border-b border-border/50 px-4 py-3">
        <div className="container max-w-lg flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div>
              <h1 className="text-lg font-bold text-foreground">Chat Support</h1>
              <p className="text-xs text-muted-foreground">A safe space to share</p>
            </div>
            {moodParam && moodConfig[moodParam] && (
              <Badge variant="secondary" className={`${moodConfig[moodParam].className} gap-1 text-xs`}>
                <span>{moodConfig[moodParam].emoji}</span>
                {moodConfig[moodParam].label}
              </Badge>
            )}
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate('/calm')}
            className="gap-2"
          >
            <Wind className="w-4 h-4" />
            Calm Mode
          </Button>
        </div>
        
        {/* Progress Indicator */}
        <div className="container max-w-lg mt-3">
          <div className="flex items-center justify-between">
            {progressStages.map((stage, index) => {
              const Icon = stage.icon;
              const isCompleted = index < currentProgressIndex;
              const isCurrent = index === currentProgressIndex;
              
              return (
                <div key={stage.key} className="flex items-center flex-1">
                  <div className="flex flex-col items-center">
                    <motion.div
                      initial={false}
                      animate={{
                        scale: isCurrent ? [1, 1.1, 1] : 1,
                        backgroundColor: isCompleted
                          ? 'hsl(var(--primary))'
                          : isCurrent
                          ? 'hsl(var(--primary) / 0.2)'
                          : 'hsl(var(--muted))',
                      }}
                      transition={{
                        scale: {
                          duration: 0.6,
                          repeat: isCurrent ? Infinity : 0,
                          repeatDelay: 2,
                        },
                        backgroundColor: { duration: 0.5 },
                      }}
                      className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        isCurrent
                          ? 'ring-2 ring-primary/50 ring-offset-2 ring-offset-background'
                          : ''
                      }`}
                    >
                      <AnimatePresence mode="wait">
                        {isCompleted ? (
                          <motion.div
                            key="check"
                            initial={{ scale: 0, rotate: -180 }}
                            animate={{ scale: 1, rotate: 0 }}
                            exit={{ scale: 0 }}
                            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                          >
                            <Check className="w-4 h-4 text-primary-foreground" />
                          </motion.div>
                        ) : (
                          <motion.div
                            key="icon"
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            exit={{ scale: 0 }}
                            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                            className={isCompleted ? 'text-primary-foreground' : isCurrent ? 'text-primary' : 'text-muted-foreground'}
                          >
                            <Icon className="w-4 h-4" />
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>
                    <motion.span
                      initial={false}
                      animate={{
                        color: isCompleted || isCurrent ? 'hsl(var(--foreground))' : 'hsl(var(--muted-foreground))',
                        fontWeight: isCurrent ? 500 : 400,
                      }}
                      transition={{ duration: 0.3 }}
                      className="text-[10px] mt-1"
                    >
                      {stage.label}
                    </motion.span>
                  </div>
                  {index < progressStages.length - 1 && (
                    <div className="flex-1 h-0.5 mx-2 bg-muted overflow-hidden rounded-full">
                      <motion.div
                        initial={{ width: '0%' }}
                        animate={{ width: isCompleted ? '100%' : '0%' }}
                        transition={{ duration: 0.6, ease: 'easeOut' }}
                        className="h-full bg-primary"
                      />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </header>

      {/* Messages */}
      <div className="flex-1 min-h-0 overflow-y-auto">
        <div className="container max-w-lg px-4 py-4 space-y-4">
          {messages.map(message => (
            <ChatMessage key={message.id} message={message} />
          ))}
          {isTyping && <TypingIndicator />}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Quick replies */}
      {messages.length < 3 && (
        <div className="shrink-0 container max-w-lg px-4 pb-2">
          <div className="flex gap-2 overflow-x-auto pb-2">
            {quickReplies.map(reply => (
              <Button
                key={reply}
                variant="outline"
                size="sm"
                onClick={() => sendMessage(reply)}
                className="whitespace-nowrap text-xs"
              >
                {reply}
              </Button>
            ))}
          </div>
        </div>
      )}

      {/* Input - Modern chat app style */}
      <div className="shrink-0 px-4 pb-4 pt-2">
        <form onSubmit={handleSubmit} className="max-w-lg mx-auto">
          <div className="flex gap-3 bg-card/95 backdrop-blur-xl border border-border/50 rounded-2xl p-2 shadow-lg">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Share how you're feeling..."
              className="flex-1 border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 text-base placeholder:text-muted-foreground/60"
              disabled={isTyping}
            />
            <Button
              type="submit"
              size="icon"
              variant="calm"
              disabled={!input.trim() || isTyping}
              className="rounded-xl h-10 w-10 shrink-0"
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Chat;
