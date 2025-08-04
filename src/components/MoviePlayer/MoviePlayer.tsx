import { useState, useEffect, useRef, useCallback } from "react";
import { Movie } from "@/types/movie";
import { Button } from "@/components/ui/button";
import { Play, Pause, SkipBack, SkipForward, Maximize, Minimize } from "lucide-react";
import { PlayerControls } from "./PlayerControls";
import { SceneNavigation } from "./SceneNavigation";
import { AudioControls } from "./AudioControls";
import { useMoviePlayer } from "./useMoviePlayer";

interface MoviePlayerProps {
  movie: Movie;
}

export const MoviePlayer = ({ movie }: MoviePlayerProps) => {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [imageError, setImageError] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  
  const {
    currentSceneIndex,
    isPlaying,
    progress,
    volume,
    isLoading,
    currentScene,
    isLastScene,
    handlePlay,
    handlePause,
    handleNextScene,
    handlePrevScene,
    handleSceneSelect,
    handleVolumeChange,
    totalDuration,
    currentTime
  } = useMoviePlayer(movie);

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

  // Reset error state quando muda de cena
  useEffect(() => {
    setImageError(false);
  }, [currentSceneIndex]);

  const handleImageError = useCallback(() => {
    console.log("Erro ao carregar imagem, usando placeholder");
    setImageError(true);
  }, []);

  const getImageSrc = useCallback(() => {
    if (imageError) {
      return "/placeholder.svg";
    }
    return currentScene.imageUrl;
  }, [imageError, currentScene.imageUrl]);

  console.log("MoviePlayer render:", {
    currentSlide: currentSceneIndex + 1,
    isLoading,
    isPlaying,
    slideText: currentScene.text?.substring(0, 50) + "..."
  });

  return (
    <div 
      ref={containerRef}
      className={`bg-background ${isFullscreen ? 'h-screen' : 'min-h-screen'}`}
    >
      {/* Main Player */}
      <div className={`relative ${movie.aspectRatio === '16:9' ? 'aspect-[16/9]' : 'aspect-[9/16]'} ${isFullscreen ? 'h-full' : 'max-h-screen'} mx-auto bg-black group`}>

        
        {/* Scene Image */}
        <img 
          ref={imageRef}
          src={getImageSrc()} 
          alt={`Slide ${currentSceneIndex + 1}`}
          className="w-full h-full object-contain"
          onError={handleImageError}
          onLoad={() => console.log(`Imagem do slide ${currentSceneIndex + 1} carregada`)}
        />
        
        {/* Scene Text Overlay */}
        {currentScene.text && (
          <div className="absolute bottom-20 left-4 right-4 text-center z-10">
            <div className="bg-black/80 text-white p-4 rounded-lg text-sm backdrop-blur-sm max-w-4xl mx-auto border border-white/10">
              <p className="leading-relaxed">{currentScene.text}</p>
            </div>
          </div>
        )}


        
        {/* Fullscreen Toggle */}
        <Button
          variant="ghost"
          size="sm"
          onClick={toggleFullscreen}
          className="absolute top-4 right-4 text-white hover:bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10"
        >
          {isFullscreen ? <Minimize className="w-4 h-4" /> : <Maximize className="w-4 h-4" />}
        </Button>

        {/* Slide Counter */}
        <div className="absolute top-4 left-4 text-white bg-black/50 px-3 py-1 rounded-full text-sm z-10">
          Slide {currentSceneIndex + 1} de {movie.scenes.length}
        </div>
        
        {/* Bottom Controls */}
        <PlayerControls
          isPlaying={isPlaying}
          progress={progress}
          volume={volume}
          currentSceneIndex={currentSceneIndex}
          totalScenes={movie.scenes.length}
          currentTime={currentTime}
          totalDuration={totalDuration}
          currentSceneText={currentScene.text}
          soundtrackUrl={movie.soundtrack}
          onPlay={handlePlay}
          onPause={handlePause}
          onPrevScene={handlePrevScene}
          onNextScene={handleNextScene}
          onVolumeChange={handleVolumeChange}
          isFirstScene={currentSceneIndex === 0}
          isLastScene={isLastScene}
          isLoading={isLoading}
        />
      </div>
      
      {/* Scene Navigation - só mostra se não estiver em fullscreen */}
      {!isFullscreen && (
        <SceneNavigation
          movie={movie}
          currentSceneIndex={currentSceneIndex}
          onSceneSelect={handleSceneSelect}
        />
      )}
    </div>
  );
};