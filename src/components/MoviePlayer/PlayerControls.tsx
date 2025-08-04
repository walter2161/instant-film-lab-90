import React from "react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Play, Pause, SkipBack, SkipForward, Volume2 } from "lucide-react";
import { AudioControls } from "./AudioControls";
import { SoundtrackPlayer } from "./SoundtrackPlayer";
import { useWebSpeechTTS } from "@/hooks/useWebSpeechTTS";

interface PlayerControlsProps {
  isPlaying: boolean;
  progress: number;
  volume: number;
  currentSceneIndex: number;
  totalScenes: number;
  currentTime: number;
  totalDuration: number;
  currentSceneText?: string;
  soundtrackUrl?: string;
  onPlay: () => void;
  onPause: () => void;
  onPrevScene: () => void;
  onNextScene: () => void;
  onVolumeChange: (volume: number[]) => void;
  isFirstScene: boolean;
  isLastScene: boolean;
  isLoading?: boolean;
}

export const PlayerControls = ({
  isPlaying,
  progress,
  volume,
  currentSceneIndex,
  totalScenes,
  currentTime,
  totalDuration,
  currentSceneText = "",
  soundtrackUrl,
  onPlay,
  onPause,
  onPrevScene,
  onNextScene,
  onVolumeChange,
  isFirstScene,
  isLastScene,
  isLoading = false
}: PlayerControlsProps) => {
  const { speak, isPlaying: isSpeaking, stop } = useWebSpeechTTS();

  // Auto-narrar quando a cena mudar e estiver reproduzindo
  React.useEffect(() => {
    if (isPlaying && currentSceneText && currentSceneText.trim()) {
      // Esperar um pouco antes de iniciar a narração
      const timer = setTimeout(() => {
        speak(currentSceneText);
      }, 500);
      
      return () => {
        clearTimeout(timer);
        stop();
      };
    } else {
      stop();
    }
  }, [currentSceneIndex, isPlaying, currentSceneText, speak, stop]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 via-black/60 to-transparent p-6 pt-12">
      {/* Progress Bar */}
      <div className="w-full bg-white/20 h-1.5 rounded-full mb-6 overflow-hidden">
        <div 
          className="bg-primary h-full rounded-full transition-all duration-100 shadow-glow"
          style={{ width: `${progress}%` }}
        />
      </div>
      
      <div className="flex items-center justify-between text-white">
        {/* Controles Principais */}
        <div className="flex items-center gap-4">
          <Button 
            variant="ghost" 
            size="sm"
            onClick={onPrevScene}
            disabled={isFirstScene || isLoading}
            className="text-white hover:bg-white/20 disabled:opacity-50"
          >
            <SkipBack className="w-5 h-5" />
          </Button>
          
          <Button 
            variant="ghost" 
            size="lg" 
            onClick={isPlaying ? onPause : onPlay}
            disabled={isLoading}
            className="text-white hover:bg-white/30 bg-white/15 border border-white/20 px-4 py-2 rounded-full transition-all duration-200 hover:scale-105"
          >
            {isPlaying ? (
              <Pause className="w-8 h-8 fill-white" />
            ) : (
              <Play className="w-8 h-8 fill-white ml-1" />
            )}
          </Button>
          
          <Button 
            variant="ghost" 
            size="sm"
            onClick={onNextScene}
            disabled={isLastScene || isLoading}
            className="text-white hover:bg-white/20 disabled:opacity-50"
          >
            <SkipForward className="w-5 h-5" />
          </Button>
        </div>
        
        {/* Informações do Tempo */}
        <div className="text-sm text-white/80 hidden sm:block">
          {formatTime(currentTime)} / {formatTime(totalDuration)}
        </div>
        
        {/* Info da Cena e Narração */}
        <div className="flex items-center gap-4">
          <div className="text-sm text-white/80 flex items-center gap-2">
            <span>{currentSceneIndex + 1}/{totalScenes}</span>
            {isLoading && (
              <div className="w-3 h-3 border border-primary/30 border-t-primary rounded-full animate-spin" />
            )}
            {isSpeaking && (
              <div className="flex items-center gap-1">
                <span className="text-xs">🔊</span>
                <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
              </div>
            )}
          </div>
          
          {/* Volume Control */}
          <div className="flex items-center gap-2">
            <Volume2 className="w-4 h-4 text-white/60" />
            <Slider
              value={[volume]}
              onValueChange={onVolumeChange}
              max={100}
              step={1}
              className="w-20"
            />
          </div>
        </div>
      </div>
    </div>
  );
};