import { useState, useCallback, useRef } from "react";

export const usePollinationsTTS = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  
  const speak = useCallback(async (text: string, voice: string = 'nova') => {
    try {
      setIsLoading(true);
      
      // Stop current audio if playing
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
      
      // Generate Pollinations TTS URL with new API
      const encodedText = encodeURIComponent(text);
      const ttsUrl = `https://text.pollinations.ai/${encodedText}?model=openai-audio&voice=${voice}`;
      
      // Create new audio element
      const audio = new Audio(ttsUrl);
      audioRef.current = audio;
      
      audio.onloadstart = () => setIsLoading(true);
      audio.oncanplay = () => {
        setIsLoading(false);
        audio.play().catch(console.error);
      };
      audio.onplay = () => setIsPlaying(true);
      audio.onpause = () => setIsPlaying(false);
      audio.onended = () => {
        setIsPlaying(false);
        audioRef.current = null;
      };
      audio.onerror = () => {
        setIsLoading(false);
        setIsPlaying(false);
        console.error('Erro ao carregar áudio TTS');
      };
      
      console.log(`Gerando TTS para: "${text.substring(0, 50)}..." com voz ${voice}`);
      
      return audio;
    } catch (error) {
      console.error('Erro ao gerar TTS:', error);
      setIsLoading(false);
      return null;
    }
  }, []);
  
  const play = useCallback(() => {
    if (audioRef.current && !isPlaying) {
      audioRef.current.play().catch(console.error);
    }
  }, [isPlaying]);
  
  const pause = useCallback(() => {
    if (audioRef.current && isPlaying) {
      audioRef.current.pause();
    }
  }, [isPlaying]);
  
  const stop = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      setIsPlaying(false);
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