import { useState } from 'react';

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

const supportiveResponses = {
  greeting: [
    "Hello! I'm here to support you. How are you feeling today? 💙",
    "Welcome back! I'm glad you're here. What's on your mind?",
    "Hi there! This is a safe space to share. How can I help you today?",
  ],
  happy: [
    "That's wonderful to hear! 🌟 What's bringing you joy today?",
    "I'm so glad you're feeling positive! Would you like to share what's making you happy?",
    "That's beautiful! Celebrating the good moments is so important. Tell me more!",
  ],
  sad: [
    "I'm sorry you're feeling this way. It's okay to feel sad sometimes. Would you like to talk about it? 💙",
    "Thank you for sharing that with me. Your feelings are valid. What's weighing on your heart?",
    "I hear you, and I'm here for you. Sometimes just expressing our feelings helps. What's been happening?",
  ],
  stressed: [
    "Stress can be overwhelming. You're not alone in this. Would you like to try a breathing exercise together? 🌿",
    "I understand that feeling. Taking a moment to pause can help. What's been causing you stress?",
    "It's okay to feel overwhelmed. Let's take this one step at a time. Would you like to talk about it or try some calming techniques?",
  ],
  encouragement: [
    "You're doing great by taking time for yourself. That takes courage. 💪",
    "Remember, it's okay to not be okay. What matters is that you're here, working through it.",
    "Every step you take matters. I believe in you. 🌸",
  ],
  breathing: [
    "That sounds like it might help! Deep breathing can really calm the nervous system. Would you like to go to the Calm Mode section?",
    "Breathing exercises are wonderful for finding peace. The Calm Mode has guided exercises that might help you.",
    "Great idea! Taking a few mindful breaths can make a real difference. Check out the Calm Mode when you're ready. 🌊",
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
  
  if (lower.includes('happy') || lower.includes('great') || lower.includes('amazing') || lower.includes('good') || lower.includes('wonderful') || lower.includes('excited')) {
    return 'happy';
  }
  if (lower.includes('sad') || lower.includes('down') || lower.includes('depressed') || lower.includes('lonely') || lower.includes('hurt') || lower.includes('crying')) {
    return 'sad';
  }
  if (lower.includes('stress') || lower.includes('anxious') || lower.includes('overwhelm') || lower.includes('worry') || lower.includes('nervous') || lower.includes('panic')) {
    return 'stressed';
  }
  if (lower.includes('breath') || lower.includes('calm') || lower.includes('relax') || lower.includes('meditation')) {
    return 'breathing';
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

export const useChat = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      role: 'assistant',
      content: "Hello! I'm here to support you on your wellness journey. This is a safe space to share how you're feeling. How are you doing today? 💙",
      timestamp: new Date(),
    },
  ]);
  const [isTyping, setIsTyping] = useState(false);

  const sendMessage = async (content: string) => {
    const userMessage: ChatMessage = {
      id: crypto.randomUUID(),
      role: 'user',
      content,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setIsTyping(true);

    // Simulate thinking time
    await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 1000));

    const emotion = detectEmotion(content);
    let response = getRandomResponse(emotion as keyof typeof supportiveResponses);

    // Add encouragement occasionally
    if (Math.random() > 0.7 && emotion !== 'greeting') {
      response += '\n\n' + getRandomResponse('encouragement');
    }

    // Suggest breathing for stress/sadness
    if ((emotion === 'stressed' || emotion === 'sad') && Math.random() > 0.5) {
      response += '\n\n' + "Would you like to try a calming breathing exercise? It can help settle your mind. 🌿";
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

  return { messages, sendMessage, isTyping };
};
