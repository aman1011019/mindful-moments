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

// Celebration particles config
const celebrationParticles = Array.from({ length: 20 }, (_, i) => ({
  id: i,
  emoji: ['🎉', '✨', '💫', '🌟', '💖', '🎊'][i % 6],
  x: Math.random() * 100,
  delay: Math.random() * 0.5,
}));

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
      
      // Auto-hide celebration after animation
      const timer = setTimeout(() => {
        setShowCelebration(false);
      }, 3000);
      
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
    <div className="min-h-screen flex flex-col pb-24 md:pt-20 relative">
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
              {/* Falling particles */}
              {celebrationParticles.map((particle) => (
                <motion.div
                  key={particle.id}
                  initial={{ 
                    y: -50, 
                    x: `${particle.x}vw`,
                    opacity: 0,
                    scale: 0,
                    rotate: 0,
                  }}
                  animate={{ 
                    y: '100vh',
                    opacity: [0, 1, 1, 0],
                    scale: [0, 1.5, 1, 0.5],
                    rotate: [0, 180, 360],
                  }}
                  transition={{ 
                    duration: 2.5,
                    delay: particle.delay,
                    ease: 'easeOut',
                  }}
                  className="absolute text-2xl md:text-3xl"
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
                  className="bg-background/95 backdrop-blur-md border border-primary/30 rounded-2xl px-8 py-6 shadow-lg text-center"
                >
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.4, type: 'spring' }}
                    className="text-4xl mb-2"
                  >
                    🎉
                  </motion.div>
                  <h3 className="text-lg font-semibold text-foreground">Journey Complete!</h3>
                  <p className="text-sm text-muted-foreground mt-1">You did amazing today</p>
                </motion.div>
              </motion.div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
      {/* Header */}
      <header className="sticky top-0 md:top-16 z-40 bg-background/80 backdrop-blur-xl border-b border-border/50 px-4 py-3">
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
      <div className="flex-1 container max-w-lg px-4 py-4 overflow-y-auto">
        <div className="space-y-4">
          {messages.map(message => (
            <ChatMessage key={message.id} message={message} />
          ))}
          {isTyping && <TypingIndicator />}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Quick replies */}
      {messages.length < 3 && (
        <div className="container max-w-lg px-4 pb-2">
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

      {/* Input */}
      <div className="sticky bottom-20 md:bottom-0 bg-background/80 backdrop-blur-xl border-t border-border/50 px-4 py-3">
        <form onSubmit={handleSubmit} className="container max-w-lg">
          <div className="flex gap-2">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Share how you're feeling..."
              className="flex-1 rounded-xl border-border/50 bg-card"
              disabled={isTyping}
            />
            <Button
              type="submit"
              size="icon"
              variant="calm"
              disabled={!input.trim() || isTyping}
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
