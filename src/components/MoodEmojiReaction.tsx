import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MoodType } from '@/hooks/useMoodStorage';
import { useMoodSounds } from '@/hooks/useMoodSounds';
const moodEmojis: Record<MoodType, string[]> = {
  happy: ['😊', '🌟', '✨', '💫', '🎉', '💛', '🌈', '☀️'],
  okay: ['😌', '🌿', '💙', '🌊', '☁️', '🍃', '💫', '🌸'],
  sad: ['💙', '🌧️', '💜', '🫂', '💕', '🌻', '🤗', '💗'],
  stressed: ['🧘', '🌿', '💜', '🌸', '✨', '🦋', '🌺', '💫'],
};

interface EmojiParticle {
  id: number;
  emoji: string;
  x: number;
  y: number;
  scale: number;
  rotation: number;
}

interface MoodEmojiReactionProps {
  mood: MoodType | null;
  onComplete: () => void;
}

export const MoodEmojiReaction = ({ mood, onComplete }: MoodEmojiReactionProps) => {
  const [particles, setParticles] = useState<EmojiParticle[]>([]);
  const [mainEmoji, setMainEmoji] = useState<string | null>(null);
  const { playMoodSound } = useMoodSounds();

  useEffect(() => {
    if (!mood) return;

    const emojis = moodEmojis[mood];
    setMainEmoji(emojis[0]);

    // Play mood-specific sound
    playMoodSound(mood);

    // Create burst particles
    const newParticles: EmojiParticle[] = Array.from({ length: 12 }, (_, i) => ({
      id: i,
      emoji: emojis[Math.floor(Math.random() * emojis.length)],
      x: (Math.random() - 0.5) * 200,
      y: (Math.random() - 0.5) * 200 - 50,
      scale: 0.5 + Math.random() * 0.8,
      rotation: Math.random() * 360,
    }));

    setParticles(newParticles);

    // Complete after animation
    const timer = setTimeout(() => {
      setParticles([]);
      setMainEmoji(null);
      onComplete();
    }, 1500);

    return () => clearTimeout(timer);
  }, [mood, onComplete, playMoodSound]);

  if (!mood) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none">
        {/* Background overlay */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-background/60 backdrop-blur-sm"
        />

        {/* Main emoji */}
        {mainEmoji && (
          <motion.div
            initial={{ scale: 0, rotate: -20 }}
            animate={{ 
              scale: [0, 1.4, 1.2],
              rotate: [0, 10, 0],
            }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ 
              duration: 0.5,
              times: [0, 0.6, 1],
              ease: "easeOut"
            }}
            className="text-8xl z-10"
          >
            {mainEmoji}
          </motion.div>
        )}

        {/* Particle burst */}
        {particles.map((particle) => (
          <motion.div
            key={particle.id}
            initial={{ 
              x: 0, 
              y: 0, 
              scale: 0,
              opacity: 1,
              rotate: 0,
            }}
            animate={{ 
              x: particle.x,
              y: particle.y,
              scale: particle.scale,
              opacity: 0,
              rotate: particle.rotation,
            }}
            transition={{ 
              duration: 1.2,
              ease: "easeOut",
              delay: Math.random() * 0.2,
            }}
            className="absolute text-3xl"
          >
            {particle.emoji}
          </motion.div>
        ))}

        {/* Ripple rings */}
        {[0, 1, 2].map((i) => (
          <motion.div
            key={`ring-${i}`}
            initial={{ scale: 0, opacity: 0.6 }}
            animate={{ scale: 3, opacity: 0 }}
            transition={{ 
              duration: 1,
              delay: i * 0.15,
              ease: "easeOut"
            }}
            className="absolute w-24 h-24 rounded-full border-2 border-primary/30"
          />
        ))}
      </div>
    </AnimatePresence>
  );
};
