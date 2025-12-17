import { useState, useEffect } from 'react';

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

type MoodContext = 'sad' | 'stressed' | null;

const supportiveResponses = {
  greeting: [
    "Hello! I'm here to support you. How are you feeling today? 💙",
    "Welcome back! I'm glad you're here. What's on your mind?",
    "Hi there! This is a safe space to share. How can I help you today?",
  ],
  sadTrigger: [
    "I noticed you're feeling sad.\nI'm here with you.\nDo you want to tell me what made you feel this way?",
    "I see you're feeling down today.\nThat takes courage to acknowledge.\nWould you like to share what's on your heart?",
    "I noticed you're not feeling your best.\nI'm here to listen without judgment.\nWhat's weighing on you?",
  ],
  stressedTrigger: [
    "I noticed you're feeling stressed.\nI'm here with you.\nDo you want to tell me what made you feel this way?",
    "I can see you're feeling overwhelmed.\nThat's completely valid.\nWould you like to share what's causing this stress?",
    "I noticed you're under pressure right now.\nI'm here to support you.\nWhat's been on your mind?",
  ],
  happy: [
    "That's wonderful to hear! 🌟 What's bringing you joy today?",
    "I'm so glad you're feeling positive! Would you like to share what's making you happy?",
    "That's beautiful! Celebrating the good moments is so important. Tell me more!",
  ],
  sad: [
    "That sounds really heavy. Anyone would feel overwhelmed in that situation.",
    "Thank you for sharing that with me. Your feelings are completely valid.",
    "I hear you, and I understand. It's okay to feel this way.",
    "That must be really difficult to carry. I'm here with you.",
  ],
  stressed: [
    "That sounds like a lot to handle. It makes sense that you're feeling overwhelmed.",
    "I can understand why that would be stressful. You're dealing with a lot.",
    "That pressure sounds intense. Your feelings are completely valid.",
    "No wonder you're feeling this way. That's a heavy load to carry.",
  ],
  reflection: [
    "It sounds like you're going through something difficult. That takes strength to share.",
    "I can feel how much this is affecting you. Thank you for trusting me with this.",
    "What you're experiencing sounds challenging. Your feelings make complete sense.",
    "I hear the weight in your words. It's okay to feel everything you're feeling.",
  ],
  breathingSuggestion: [
    "I'm noticing you might be carrying a lot right now.\nWould you like to try a short breathing exercise together to feel a little calmer?",
    "Sometimes when we're feeling overwhelmed, a moment of calm breathing can help.\nWould you like to try a gentle breathing exercise with me?",
    "Your mind seems to be holding a lot.\nWould it help to take a few calming breaths together?",
  ],
  breathingAccepted: [
    "That's a wonderful choice. Let's do this together.\n\nI'd recommend trying the Calm Mode breathing exercise. It uses a 4-4-6 pattern that activates your body's relaxation response.\n\nWould you like to go to Calm Mode now? You can find it in the navigation, or I can guide you there. 🌿",
  ],
  breathingDeclined: [
    "That's completely okay. We can just keep talking, or sit in comfortable silence. Whatever you need.\n\nIs there anything else you'd like to share?",
    "No pressure at all. I'm here to listen whenever you're ready.\n\nWould you like to tell me more about what's on your mind?",
  ],
  encouragement: [
    "You're doing great by taking time for yourself. That takes courage. 💪",
    "Remember, it's okay to not be okay. What matters is that you're here, working through it.",
    "Every step you take matters. I believe in you. 🌸",
  ],
  closing: [
    "You did really well by taking this moment for yourself.\nI'm here anytime you need to talk. 💙",
    "Thank you for sharing with me today.\nRemember, you're not alone. I'm here whenever you need support.",
    "You've shown real strength today.\nTake care of yourself, and know I'm always here to listen.",
  ],
  general: [
    "Thank you for sharing that with me. How does talking about it make you feel?",
    "I appreciate you opening up. What else is on your mind?",
    "That's really insightful. Would you like to explore those feelings more?",
    "I'm here to listen. What would help you feel better right now?",
  ],
};

const detectEmotion = (message: string): string => {
  const lower = message.toLowerCase();
  
  // Detect severe distress patterns for grounding response
  if (lower.includes('can\'t take') || lower.includes('too much') || lower.includes('overwhelm') || 
      lower.includes('breaking') || lower.includes('falling apart') || lower.includes('panic')) {
    return 'severe_stress';
  }
  
  if (lower.includes('happy') || lower.includes('great') || lower.includes('amazing') || 
      lower.includes('good') || lower.includes('wonderful') || lower.includes('excited')) {
    return 'happy';
  }
  if (lower.includes('sad') || lower.includes('down') || lower.includes('depressed') || 
      lower.includes('lonely') || lower.includes('hurt') || lower.includes('crying')) {
    return 'sad';
  }
  if (lower.includes('stress') || lower.includes('anxious') || lower.includes('anxiety') ||
      lower.includes('worry') || lower.includes('nervous') || lower.includes('pressure')) {
    return 'stressed';
  }
  if (lower.includes('yes') || lower.includes('sure') || lower.includes('okay') || lower.includes('please')) {
    return 'acceptance';
  }
  if (lower.includes('no') || lower.includes('not now') || lower.includes('maybe later')) {
    return 'decline';
  }
  if (lower.includes('breath') || lower.includes('calm') || lower.includes('relax') || lower.includes('meditation')) {
    return 'breathing';
  }
  if (lower.includes('bye') || lower.includes('thank') || lower.includes('better') || lower.includes('helped')) {
    return 'closing';
  }
  if (lower.includes('hi') || lower.includes('hello') || lower.includes('hey')) {
    return 'greeting';
  }
  
  return 'general';
};

const getRandomResponse = (category: keyof typeof supportiveResponses): string => {
  const responses = supportiveResponses[category];
  return responses[Math.floor(Math.random() * responses.length)];
};

export type ConversationStage = 'initial' | 'listening' | 'suggested_breathing' | 'post_breathing' | 'closing';

export const useChat = (initialMood?: MoodContext) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [conversationState, setConversationState] = useState<ConversationStage>('initial');
  const [messageCount, setMessageCount] = useState(0);

  // Initialize with mood-triggered message
  useEffect(() => {
    if (initialMood === 'sad') {
      setMessages([{
        id: '1',
        role: 'assistant',
        content: getRandomResponse('sadTrigger'),
        timestamp: new Date(),
      }]);
    } else if (initialMood === 'stressed') {
      setMessages([{
        id: '1',
        role: 'assistant',
        content: getRandomResponse('stressedTrigger'),
        timestamp: new Date(),
      }]);
    } else {
      setMessages([{
        id: '1',
        role: 'assistant',
        content: getRandomResponse('greeting'),
        timestamp: new Date(),
      }]);
    }
  }, [initialMood]);

  const sendMessage = async (content: string) => {
    const userMessage: ChatMessage = {
      id: crypto.randomUUID(),
      role: 'user',
      content,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setIsTyping(true);
    setMessageCount(prev => prev + 1);

    // Simulate thinking time
    await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 1000));

    const emotion = detectEmotion(content);
    let response = '';

    // Handle conversation flow based on state and detected emotion
    if (conversationState === 'suggested_breathing') {
      if (emotion === 'acceptance') {
        response = getRandomResponse('breathingAccepted');
        setConversationState('post_breathing');
      } else {
        response = getRandomResponse('breathingDeclined');
        setConversationState('listening');
      }
    } else if (emotion === 'severe_stress') {
      // Grounding response for severe distress
      response = "I hear you, and I want you to know you're not alone in this moment.\n\nLet's take this one breath at a time. You're safe right here, right now.\n\nWould you like to try a gentle breathing exercise to help ground yourself?";
      setConversationState('suggested_breathing');
    } else if (emotion === 'sad' || emotion === 'stressed') {
      response = getRandomResponse(emotion);
      
      // Suggest breathing after a few exchanges or if they seem overwhelmed
      if (messageCount >= 2 && conversationState !== 'post_breathing') {
        response += '\n\n' + getRandomResponse('breathingSuggestion');
        setConversationState('suggested_breathing');
      } else {
        setConversationState('listening');
      }
    } else if (emotion === 'closing') {
      response = getRandomResponse('closing');
      setConversationState('closing');
    } else if (emotion === 'breathing') {
      response = getRandomResponse('breathingAccepted');
      setConversationState('post_breathing');
    } else if (emotion === 'greeting') {
      response = getRandomResponse('greeting');
    } else if (emotion === 'happy') {
      response = getRandomResponse('happy');
    } else {
      // General response with emotional reflection
      response = getRandomResponse('reflection');
      
      // Add encouragement occasionally
      if (Math.random() > 0.6) {
        response += '\n\n' + getRandomResponse('encouragement');
      }
    }

    const assistantMessage: ChatMessage = {
      id: crypto.randomUUID(),
      role: 'assistant',
      content: response,
      timestamp: new Date(),
    };

    setIsTyping(false);
    setMessages(prev => [...prev, assistantMessage]);
  };

  return { messages, sendMessage, isTyping, conversationState, messageCount };
};
