import { useState, useRef, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Send, Wind, Heart, MessageCircle, Sparkles, CheckCircle } from 'lucide-react';
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

const Chat = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const moodParam = searchParams.get('mood') as 'sad' | 'stressed' | null;
  
  const { messages, sendMessage, isTyping, conversationState } = useChat(moodParam);
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const currentProgressIndex = getProgressIndex(conversationState);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

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
    <div className="min-h-screen flex flex-col pb-24 md:pt-20">
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
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-500 ${
                        isCompleted
                          ? 'bg-primary text-primary-foreground'
                          : isCurrent
                          ? 'bg-primary/20 text-primary ring-2 ring-primary/50 ring-offset-2 ring-offset-background'
                          : 'bg-muted text-muted-foreground'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                    </div>
                    <span
                      className={`text-[10px] mt-1 transition-colors ${
                        isCompleted || isCurrent ? 'text-foreground' : 'text-muted-foreground'
                      }`}
                    >
                      {stage.label}
                    </span>
                  </div>
                  {index < progressStages.length - 1 && (
                    <div
                      className={`flex-1 h-0.5 mx-2 transition-colors duration-500 ${
                        isCompleted ? 'bg-primary' : 'bg-muted'
                      }`}
                    />
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
