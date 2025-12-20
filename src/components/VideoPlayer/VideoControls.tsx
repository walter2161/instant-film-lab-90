import { memo } from "react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { 
  Play, Pause, SkipBack, SkipForward, 
  Maximize, Minimize, Edit, Download,
  Volume2, VolumeX
} from "lucide-react";
import { cn } from "@/lib/utils";

interface VideoControlsProps {
  isPlaying: boolean;
  isLoading: boolean;
  isTransitioning: boolean;
  sceneProgress: number;
  totalProgress: number;
  currentTime: number;
  totalDuration: number;
  currentSceneIndex: number;
  totalScenes: number;
  currentSceneText?: string;
  isFirstScene: boolean;
  isLastScene: boolean;
  isFullscreen: boolean;
  isUserCreated: boolean;
  showControls: boolean;
  onPlay: () => void;
  onPause: () => void;
  onTogglePlayPause: () => void;
  onPrevScene: () => void;
  onNextScene: () => void;
  onToggleFullscreen: () => void;
  onEdit?: () => void;
  onDownloadJson?: () => void;
}

const formatTime = (seconds: number) => {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
};

export const VideoControls = memo(({
  isPlaying,
  isLoading,
  isTransitioning,
  sceneProgress,
  totalProgress,
  currentTime,
  totalDuration,
  currentSceneIndex,
  totalScenes,
  isFirstScene,
  isLastScene,
  isFullscreen,
  isUserCreated,
  showControls,
  onPlay,
  onPause,
  onTogglePlayPause,
  onPrevScene,
  onNextScene,
  onToggleFullscreen,
  onEdit,
  onDownloadJson,
}: VideoControlsProps) => {
  const isDisabled = isLoading || isTransitioning;

  // Calcular tempo atual total (considerando todas as cenas)
  const currentTotalTime = (currentSceneIndex * 12) + currentTime;

  return (
    <div 
      className={cn(
        "absolute bottom-0 left-0 right-0 z-30 transition-all duration-300",
        showControls 
          ? "opacity-100 translate-y-0" 
          : "opacity-0 translate-y-4 pointer-events-none"
      )}
    >
      {/* Gradient background */}
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-transparent" />
      
      <div className="relative p-4 md:p-6 pt-12 md:pt-16">
        {/* Progress Bar */}
        <div className="w-full mb-4 md:mb-6">
          {/* Scene progress segments */}
          <div className="flex gap-1 mb-2">
            {Array.from({ length: totalScenes }).map((_, i) => (
              <div 
                key={i}
                className="flex-1 h-1 rounded-full bg-white/20 overflow-hidden"
              >
                <div 
                  className={cn(
                    "h-full rounded-full transition-all duration-100",
                    i < currentSceneIndex 
                      ? "bg-primary w-full" 
                      : i === currentSceneIndex 
                        ? "bg-primary shadow-glow"
                        : "bg-transparent"
                  )}
                  style={{
                    width: i === currentSceneIndex ? `${sceneProgress}%` : undefined,
                  }}
                />
              </div>
            ))}
          </div>
          
          {/* Total progress bar */}
          <div className="w-full bg-white/10 h-1 rounded-full overflow-hidden">
            <div 
              className="bg-primary h-full rounded-full transition-all duration-100 shadow-glow"
              style={{ width: `${totalProgress}%` }}
            />
          </div>
        </div>
        
        {/* Controls Row */}
        <div className="flex items-center justify-between text-white">
          {/* Left - Time & Fullscreen */}
          <div className="flex items-center gap-2 md:gap-4 flex-1">
            <Button
              variant="ghost"
              size="icon"
              onClick={onToggleFullscreen}
              className="text-white hover:bg-white/20 h-8 w-8 md:h-10 md:w-10"
            >
              {isFullscreen ? (
                <Minimize className="w-4 h-4 md:w-5 md:h-5" />
              ) : (
                <Maximize className="w-4 h-4 md:w-5 md:h-5" />
              )}
            </Button>
            
            <div className="text-xs md:text-sm text-white/80 font-mono">
              {formatTime(currentTotalTime)} / {formatTime(totalDuration)}
            </div>
          </div>
          
          {/* Center - Main Controls */}
          <div className="flex items-center gap-2 md:gap-4">
            <Button 
              variant="ghost" 
              size="icon"
              onClick={onPrevScene}
              disabled={isFirstScene || isDisabled}
              className="text-white hover:bg-white/20 disabled:opacity-30 h-8 w-8 md:h-10 md:w-10"
            >
              <SkipBack className="w-4 h-4 md:w-5 md:h-5" />
            </Button>
            
            <Button 
              variant="ghost" 
              size="lg" 
              onClick={onTogglePlayPause}
              disabled={isLoading}
              className={cn(
                "text-white hover:bg-white/30 bg-white/15 border border-white/20",
                "rounded-full transition-all duration-200 hover:scale-105",
                "h-12 w-12 md:h-14 md:w-14"
              )}
            >
              {isPlaying ? (
                <Pause className="w-6 h-6 md:w-8 md:h-8 fill-white" />
              ) : (
                <Play className="w-6 h-6 md:w-8 md:h-8 fill-white ml-0.5" />
              )}
            </Button>
            
            <Button 
              variant="ghost" 
              size="icon"
              onClick={onNextScene}
              disabled={isLastScene || isDisabled}
              className="text-white hover:bg-white/20 disabled:opacity-30 h-8 w-8 md:h-10 md:w-10"
            >
              <SkipForward className="w-4 h-4 md:w-5 md:h-5" />
            </Button>
          </div>
          
          {/* Right - Info & Actions */}
          <div className="flex items-center gap-2 md:gap-4 flex-1 justify-end">
            {/* Loading/Transition indicator */}
            {(isLoading || isTransitioning) && (
              <div className="w-4 h-4 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
            )}
            
            {/* User Actions */}
            {isUserCreated && (
              <div className="flex items-center gap-1">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={onEdit}
                  className="text-white hover:bg-white/20 h-8 w-8"
                  title="Editar"
                >
                  <Edit className="w-4 h-4" />
                </Button>
                
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={onDownloadJson}
                  className="text-white hover:bg-white/20 h-8 w-8"
                  title="Baixar JSON"
                >
                  <Download className="w-4 h-4" />
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
});

VideoControls.displayName = 'VideoControls';
