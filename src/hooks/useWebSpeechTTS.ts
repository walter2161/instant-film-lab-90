import { useState, useCallback, useRef } from "react";

export const useWebSpeechTTS = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const speechRef = useRef<SpeechSynthesisUtterance | null>(null);
  
  const speak = useCallback(async (text: string) => {
    try {
      setIsLoading(true);
      
      // Stop current speech if playing
      if (speechRef.current) {
        speechSynthesis.cancel();
        speechRef.current = null;
      }
      
      // Create new speech utterance
      const utterance = new SpeechSynthesisUtterance(text);
      speechRef.current = utterance;
      
      // Configure for Portuguese
      utterance.lang = 'pt-BR';
      utterance.rate = 0.8;
      utterance.pitch = 1;
      utterance.volume = 1;
      
      utterance.onstart = () => {
        setIsLoading(false);
        setIsPlaying(true);
      };
      
      utterance.onend = () => {
        setIsPlaying(false);
        speechRef.current = null;
      };
      
      utterance.onerror = () => {
        setIsLoading(false);
        setIsPlaying(false);
        console.error('Erro ao reproduzir fala');
      };
      
      // Speak the text
      speechSynthesis.speak(utterance);
      
      return utterance;
    } catch (error) {
      console.error('Erro ao gerar fala:', error);
      setIsLoading(false);
      return null;
    }
  }, []);
  
  const play = useCallback(() => {
    if (speechRef.current && !isPlaying) {
      speechSynthesis.resume();
    }
  }, [isPlaying]);
  
  const pause = useCallback(() => {
    if (speechRef.current && isPlaying) {
      speechSynthesis.pause();
    }
  }, [isPlaying]);
  
  const stop = useCallback(() => {
    if (speechRef.current) {
      speechSynthesis.cancel();
      setIsPlaying(false);
      speechRef.current = null;
    }
  }, []);
  
  const toggle = useCallback(() => {
    if (isPlaying) {
      pause();
    } else {
      play();
    }
  }, [isPlaying, play, pause]);
  
  return {
    speak,
    play,
    pause,
    stop,
    toggle,
    isPlaying,
    isLoading
  };
};