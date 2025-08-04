import { useState, useCallback, useRef } from "react";

export const useGoogleTTS = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  
  const speak = useCallback(async (text: string, lang: string = 'pt-BR') => {
    try {
      setIsLoading(true);
      
      // Stop current audio if playing
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
      
      // Generate Google Translate TTS URL
      const encodedText = encodeURIComponent(text);
      const ttsUrl = `https://translate.google.com/translate_tts?ie=UTF-8&tl=${lang}&client=tw-ob&q=${encodedText}`;
      
      // Create new audio element
      const audio = new Audio(ttsUrl);
      audioRef.current = audio;
      
      audio.onloadstart = () => setIsLoading(true);
      audio.oncanplay = () => setIsLoading(false);
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