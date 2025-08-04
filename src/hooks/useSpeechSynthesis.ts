import { useEffect, useRef } from "react";

export const useSpeechSynthesis = () => {
  const synthRef = useRef<SpeechSynthesis | null>(null);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  
  useEffect(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      synthRef.current = window.speechSynthesis;
      console.log("Speech synthesis inicializado");
    } else {
      console.warn("Speech synthesis não suportado neste navegador");
    }
  }, []);

  const speak = (text: string, options?: {
    lang?: string;
    rate?: number;
    pitch?: number;
    volume?: number;
    voice?: SpeechSynthesisVoice;
  }) => {
    return new Promise<void>((resolve, reject) => {
      if (!synthRef.current) {
        console.warn('Speech synthesis não disponível');
        resolve();
        return;
      }

      // Cancel any ongoing speech
      try {
        synthRef.current.cancel();
      } catch (error) {
        console.warn("Erro ao cancelar speech anterior:", error);
      }

      const utterance = new SpeechSynthesisUtterance(text);
      
      // Set options with safer defaults
      utterance.lang = options?.lang || 'pt-BR';
      utterance.rate = Math.max(0.1, Math.min(10, options?.rate || 1.0));
      utterance.pitch = Math.max(0, Math.min(2, options?.pitch || 1.0));
      utterance.volume = Math.max(0, Math.min(1, options?.volume || 0.8));
      
      if (options?.voice) {
        utterance.voice = options.voice;
      }

      utterance.onstart = () => {
        console.log("Narração iniciada:", text.substring(0, 50) + "...");
      };

      utterance.onend = () => {
        console.log("Narração finalizada");
        resolve();
      };
      
      utterance.onerror = (event) => {
        console.error('Erro na narração:', event);
        resolve(); // Resolve anyway to continue
      };

      utteranceRef.current = utterance;
      
      try {
        synthRef.current.speak(utterance);
      } catch (error) {
        console.error("Erro ao iniciar narração:", error);
        resolve();
      }
    });
  };

  const stop = () => {
    if (synthRef.current) {
      try {
        synthRef.current.cancel();
        console.log("Narração parada");
      } catch (error) {
        console.warn("Erro ao parar narração:", error);
      }
    }
  };

  const pause = () => {
    if (synthRef.current) {
      try {
        synthRef.current.pause();
      } catch (error) {
        console.warn("Erro ao pausar narração:", error);
      }
    }
  };

  const resume = () => {
    if (synthRef.current) {
      try {
        synthRef.current.resume();
      } catch (error) {
        console.warn("Erro ao retomar narração:", error);
      }
    }
  };

  const getVoices = (): SpeechSynthesisVoice[] => {
    if (!synthRef.current) return [];
    try {
      return synthRef.current.getVoices();
    } catch (error) {
      console.warn("Erro ao obter vozes:", error);
      return [];
    }
  };

  const isSupported = (): boolean => {
    return !!synthRef.current;
  };

  const isSpeaking = (): boolean => {
    try {
      return synthRef.current?.speaking || false;
    } catch (error) {
      return false;
    }
  };

  return {
    speak,
    stop,
    pause,
    resume,
    getVoices,
    isSupported,
    isSpeaking
  };
};