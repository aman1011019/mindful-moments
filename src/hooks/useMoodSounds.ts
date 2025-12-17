import { useCallback, useRef } from 'react';
import { MoodType } from './useMoodStorage';

// Frequency patterns for each mood (creates different tonal feelings)
const moodSoundConfigs: Record<MoodType, { frequencies: number[]; duration: number; type: OscillatorType }> = {
  happy: {
    frequencies: [523.25, 659.25, 783.99], // C5, E5, G5 - bright major chord
    duration: 0.3,
    type: 'sine'
  },
  okay: {
    frequencies: [392, 493.88], // G4, B4 - calm interval
    duration: 0.4,
    type: 'sine'
  },
  sad: {
    frequencies: [293.66, 349.23], // D4, F4 - gentle minor feel
    duration: 0.5,
    type: 'sine'
  },
  stressed: {
    frequencies: [440, 392, 349.23], // A4, G4, F4 - descending calming
    duration: 0.4,
    type: 'sine'
  }
};

export const useMoodSounds = () => {
  const audioContextRef = useRef<AudioContext | null>(null);

  const getAudioContext = useCallback(() => {
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    return audioContextRef.current;
  }, []);

  const playMoodSound = useCallback((mood: MoodType) => {
    try {
      const audioContext = getAudioContext();
      const config = moodSoundConfigs[mood];
      const now = audioContext.currentTime;

      config.frequencies.forEach((freq, index) => {
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();

        oscillator.type = config.type;
        oscillator.frequency.setValueAtTime(freq, now);

        // Gentle envelope for calming effect
        const startTime = now + index * 0.1;
        const endTime = startTime + config.duration;

        gainNode.gain.setValueAtTime(0, startTime);
        gainNode.gain.linearRampToValueAtTime(0.15, startTime + 0.05);
        gainNode.gain.exponentialRampToValueAtTime(0.01, endTime);

        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);

        oscillator.start(startTime);
        oscillator.stop(endTime + 0.1);
      });
    } catch (error) {
      console.log('Audio not supported or blocked:', error);
    }
  }, [getAudioContext]);

  return { playMoodSound };
};
