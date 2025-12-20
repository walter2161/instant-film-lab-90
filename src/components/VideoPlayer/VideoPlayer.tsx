import { useState, useEffect, useRef, useCallback } from "react";
import { Movie } from "@/types/movie";
import { useVideoPlayer } from "./useVideoPlayer";
import { CinematicScene } from "./CinematicScene";
import { TransitionLayer } from "./TransitionLayer";
import { VideoControls } from "./VideoControls";
import { SceneTimeline } from "./SceneTimeline";
import { cn } from "@/lib/utils";

interface VideoPlayerProps {
  movie: Movie;
  onEdit?: () => void;
  onDownloadJson?: () => void;
  isUserCreated?: boolean;
}

export const VideoPlayer = ({ 
  movie, 
  onEdit, 
  onDownloadJson,
  isUserCreated = false 
}: VideoPlayerProps) => {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);
  const controlsTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const {
    currentSceneIndex,
    currentScene,
    nextScene,
    isPlaying,
    isLoading,
    isTransitioning,
    sceneProgress,
    totalProgress,
    currentTime,
    totalDuration,
    currentTransition,
    transitionDuration,
    play,
    pause,
    togglePlayPause,
    nextSceneManual,
    prevScene,
    seekToScene,
    isFirstScene,
    isLastScene,
    preloadedScenes,
  } = useVideoPlayer(movie);

  // Auto-hide controls
  const resetControlsTimeout = useCallback(() => {
    if (controlsTimeoutRef.current) {
      clearTimeout(controlsTimeoutRef.current);
    }
    setShowControls(true);
    
    if (isPlaying) {
      controlsTimeoutRef.current = setTimeout(() => {
        setShowControls(false);
      }, 3000);
    }
  }, [isPlaying]);

  useEffect(() => {
    resetControlsTimeout();
  }, [isPlaying, resetControlsTimeout]);

  // Fullscreen handlers
  const toggleFullscreen = useCallback(async () => {
    if (!document.fullscreenElement) {
      await containerRef.current?.requestFullscreen();
      setIsFullscreen(true);
    } else {
      await document.exitFullscreen();
      setIsFullscreen(false);
    }
  }, []);

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  // Keyboard controls
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case ' ':
          e.preventDefault();
          togglePlayPause();
          break;
        case 'ArrowRight':
          nextSceneManual();
          break;
        case 'ArrowLeft':
          prevScene();
          break;
        case 'f':
        case 'F':
          toggleFullscreen();
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [togglePlayPause, nextSceneManual, prevScene, toggleFullscreen]);

  return (
    <div 
      ref={containerRef}
      className={cn(
        "bg-black relative overflow-hidden",
        isFullscreen ? "h-screen w-screen" : "min-h-screen"
      )}
      onMouseMove={resetControlsTimeout}
      onClick={resetControlsTimeout}
    >
      {/* Player Container */}
      <div 
        className={cn(
          "relative mx-auto bg-black",
          movie.aspectRatio === '16:9' ? 'aspect-video' : 'aspect-[9/16]',
          isFullscreen ? 'h-full' : 'max-h-screen'
        )}
      >
        {/* Current Scene */}
        <CinematicScene
          scene={currentScene}
          isActive={!isTransitioning}
        />

        {/* Next Scene (preloaded for transition) */}
        {nextScene && (
          <CinematicScene
            scene={nextScene}
            isActive={isTransitioning}
            isPreloading={preloadedScenes.has(currentSceneIndex + 1)}
          />
        )}

        {/* Transition Layer */}
        <TransitionLayer
          isTransitioning={isTransitioning}
          transitionType={currentTransition}
          transitionDuration={transitionDuration}
        />

        {/* Subtitle/Text Overlay */}
        {currentScene.text && (
          <div 
            className={cn(
              "absolute bottom-24 left-4 right-4 text-center z-20 transition-opacity duration-300",
              showControls ? "opacity-100" : "opacity-80"
            )}
          >
            <div className="bg-black/80 text-white p-4 rounded-lg text-sm md:text-base backdrop-blur-sm max-w-4xl mx-auto border border-white/10 shadow-2xl">
              <p className="leading-relaxed font-medium">{currentScene.text}</p>
            </div>
          </div>
        )}

        {/* Loading Overlay */}
        {isLoading && (
          <div className="absolute inset-0 bg-black/90 flex items-center justify-center z-40">
            <div className="text-center">
              <div className="w-16 h-16 border-4 border-primary/30 border-t-primary rounded-full animate-spin mx-auto mb-6" />
              <h3 className="text-white text-xl font-semibold mb-2">{movie.title}</h3>
              <p className="text-white/60">Preparando streaming...</p>
            </div>
          </div>
        )}

        {/* Scene Counter */}
        <div 
          className={cn(
            "absolute top-4 left-4 text-white bg-black/60 px-4 py-2 rounded-full text-sm z-20 backdrop-blur-sm transition-opacity duration-300",
            showControls ? "opacity-100" : "opacity-0"
          )}
        >
          <span className="font-medium">Cena {currentSceneIndex + 1}</span>
          <span className="text-white/60"> / {movie.scenes.length}</span>
        </div>

        {/* Controls */}
        <VideoControls
          isPlaying={isPlaying}
          isLoading={isLoading}
          isTransitioning={isTransitioning}
          sceneProgress={sceneProgress}
          totalProgress={totalProgress}
          currentTime={currentTime}
          totalDuration={totalDuration}
          currentSceneIndex={currentSceneIndex}
          totalScenes={movie.scenes.length}
          currentSceneText={currentScene.text}
          isFirstScene={isFirstScene}
          isLastScene={isLastScene}
          isFullscreen={isFullscreen}
          isUserCreated={isUserCreated}
          showControls={showControls}
          onPlay={play}
          onPause={pause}
          onTogglePlayPause={togglePlayPause}
          onPrevScene={prevScene}
          onNextScene={nextSceneManual}
          onToggleFullscreen={toggleFullscreen}
          onEdit={onEdit}
          onDownloadJson={onDownloadJson}
        />
      </div>

      {/* Scene Timeline - apenas fora do fullscreen */}
      {!isFullscreen && (
        <SceneTimeline
          movie={movie}
          currentSceneIndex={currentSceneIndex}
          preloadedScenes={preloadedScenes}
          onSceneSelect={seekToScene}
        />
      )}
    </div>
  );
};
