import { useEffect, useRef, useState } from "react";
import { Volume2, VolumeX, Music } from "lucide-react";
import { Slider } from "@/components/ui/slider";

interface SoundtrackPlayerProps {
  soundtrackUrl?: string;
  volume: number;
  isPlaying: boolean;
  onVolumeChange: (volume: number[]) => void;
}

export const SoundtrackPlayer = ({ 
  soundtrackUrl, 
  volume, 
  isPlaying,
  onVolumeChange 
}: SoundtrackPlayerProps) => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume / 100;
    }
  }, [volume]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !soundtrackUrl) return;

    const handleLoadedData = () => {
      setIsLoaded(true);
      setHasError(false);
    };

    const handleError = () => {
      setHasError(true);
      setIsLoaded(false);
      console.log("Erro ao carregar trilha sonora");
    };

    audio.addEventListener('loadeddata', handleLoadedData);
    audio.addEventListener('error', handleError);

    return () => {
      audio.removeEventListener('loadeddata', handleLoadedData);
      audio.removeEventListener('error', handleError);
    };
  }, [soundtrackUrl]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !isLoaded) return;

    if (isPlaying) {
      audio.play().catch(() => {
        console.log("Erro ao reproduzir trilha sonora");
      });
    } else {
      audio.pause();
    }
  }, [isPlaying, isLoaded]);

  if (!soundtrackUrl || hasError) {
    return null;
  }

  return (
    <div className="flex items-center gap-2 text-white/80">
      <Music className="w-4 h-4" />
      <span className="text-xs">Trilha</span>
      
      <audio
        ref={audioRef}
        src={soundtrackUrl}
        loop
        preload="metadata"
      />
      
      <div className="flex items-center gap-1">
        {volume === 0 ? (
          <VolumeX className="w-3 h-3" />
        ) : (
          <Volume2 className="w-3 h-3" />
        )}
        <Slider
          value={[volume]}
          onValueChange={onVolumeChange}
          max={100}
          step={5}
          className="w-12"
        />
      </div>
    </div>
  );
};