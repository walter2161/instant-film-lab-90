import { Volume2, VolumeX } from "lucide-react";
import { Slider } from "@/components/ui/slider";
import { useState, useEffect } from "react";

interface AudioControlsProps {
  text: string;
  volume: number;
  onVolumeChange: (volume: number[]) => void;
  isVisible?: boolean;
  isPlaying?: boolean;
  onTogglePlay?: () => void;
}

export const AudioControls = ({ 
  text, 
  volume, 
  onVolumeChange, 
  isVisible = true,
  isPlaying: externalIsPlaying = false,
  onTogglePlay
}: AudioControlsProps) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [utterance, setUtterance] = useState<SpeechSynthesisUtterance | null>(null);

  // Pausar/retomar áudio quando o estado externo mudar
  useEffect(() => {
    if ('speechSynthesis' in window && utterance) {
      if (!externalIsPlaying && speechSynthesis.speaking) {
        speechSynthesis.pause();
        console.log("Áudio pausado");
      } else if (externalIsPlaying && speechSynthesis.paused) {
        speechSynthesis.resume();
        console.log("Áudio retomado");
      }
    }
  }, [externalIsPlaying, utterance]);

  useEffect(() => {
    // Configurar volume da síntese de voz
    if ('speechSynthesis' in window) {
      speechSynthesis.cancel(); // Cancelar qualquer fala anterior
      setUtterance(null);
    }
  }, [volume]);

  // Auto-reproduzir quando o texto mudar
  useEffect(() => {
    if (text && text.trim() && 'speechSynthesis' in window) {
      speechSynthesis.cancel(); // Cancelar fala anterior
      
      const newUtterance = new SpeechSynthesisUtterance(text);
      newUtterance.lang = 'pt-BR';
      newUtterance.rate = 0.9;
      newUtterance.pitch = 1;
      newUtterance.volume = volume / 100;
      
      newUtterance.onstart = () => setIsPlaying(true);
      newUtterance.onend = () => {
        setIsPlaying(false);
        setUtterance(null);
      };
      newUtterance.onerror = () => {
        setIsPlaying(false);
        setUtterance(null);
      };
      
      setUtterance(newUtterance);
      if (externalIsPlaying) {
        speechSynthesis.speak(newUtterance);
        console.log("Reproduzindo áudio automaticamente:", text.substring(0, 50) + "...");
      }
    }
  }, [text, volume, externalIsPlaying]);

  const handleToggleAudio = () => {
    if (onTogglePlay) {
      onTogglePlay();
    }
  };

  if (!isVisible) return null;

  return (
    <div className="flex items-center gap-2 text-white">
      {/* Status do áudio */}
      <span className="text-xs text-white/80">
        {isPlaying ? "🔊" : "🔇"}
      </span>

      {/* Status do áudio apenas */}
      <div className="flex items-center gap-2">
        <span className="text-xs text-white/80">
          {isPlaying ? "🔊" : "🔇"}
        </span>
        <span className="text-xs text-white/60">Áudio</span>
      </div>
    </div>
  );
};