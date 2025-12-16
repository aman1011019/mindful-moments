import { ChatMessage as ChatMessageType } from '@/hooks/useChat';
import { cn } from '@/lib/utils';
import { Bot, User } from 'lucide-react';

interface ChatMessageProps {
  message: ChatMessageType;
}

export const ChatMessage = ({ message }: ChatMessageProps) => {
  const isAssistant = message.role === 'assistant';

  return (
    <div className={cn(
      'flex gap-3 animate-slide-up',
      isAssistant ? 'justify-start' : 'justify-end'
    )}>
      {isAssistant && (
        <div className="flex-shrink-0 w-8 h-8 rounded-full gradient-calm flex items-center justify-center">
          <Bot className="w-4 h-4 text-primary-foreground" />
        </div>
      )}
      
      <div className={cn(
        'max-w-[80%] rounded-2xl px-4 py-3',
        isAssistant
          ? 'bg-card border border-border/50 shadow-soft'
          : 'gradient-calm text-primary-foreground'
      )}>
        <p className="text-sm whitespace-pre-wrap">{message.content}</p>
      </div>

      {!isAssistant && (
        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-secondary flex items-center justify-center">
          <User className="w-4 h-4 text-secondary-foreground" />
        </div>
      )}
    </div>
  );
};

export const TypingIndicator = () => (
  <div className="flex gap-3 animate-fade-in">
    <div className="flex-shrink-0 w-8 h-8 rounded-full gradient-calm flex items-center justify-center">
      <Bot className="w-4 h-4 text-primary-foreground" />
    </div>
    <div className="bg-card border border-border/50 rounded-2xl px-4 py-3 shadow-soft">
      <div className="flex gap-1">
        <span className="w-2 h-2 rounded-full bg-muted-foreground/50 animate-bounce" style={{ animationDelay: '0ms' }} />
        <span className="w-2 h-2 rounded-full bg-muted-foreground/50 animate-bounce" style={{ animationDelay: '150ms' }} />
        <span className="w-2 h-2 rounded-full bg-muted-foreground/50 animate-bounce" style={{ animationDelay: '300ms' }} />
      </div>
    </div>
  </div>
);
