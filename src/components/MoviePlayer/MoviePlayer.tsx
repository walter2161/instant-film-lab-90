import { useState, useEffect, useRef, useCallback } from "react";
import { Movie, MovieFrame } from "@/types/movie";
import { Button } from "@/components/ui/button";
import { Play, Pause, SkipBack, SkipForward, Maximize, Minimize } from "lucide-react";
import { PlayerControls } from "./PlayerControls";
import { SceneNavigation } from "./SceneNavigation";
import { AudioControls } from "./AudioControls";
import { useMoviePlayer } from "./useMoviePlayer";
import { MovieService } from "@/services/movieService";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

interface MoviePlayerProps {
  movie: Movie;
}

export const MoviePlayer = ({ movie }: MoviePlayerProps) => {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [currentFrameIndex, setCurrentFrameIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const frameIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const { toast } = useToast();
  const navigate = useNavigate();
  
  // Verificar se o filme foi criado pelo usuário
  const isUserCreated = useCallback(() => {
    const savedMovies = MovieService.getSavedMovies();
    return savedMovies.some(savedMovie => savedMovie.id === movie.id);
  }, [movie.id]);
  
  // Função para editar o filme
  const handleEdit = useCallback(() => {
    navigate('/create', { state: { editMovie: movie } });
  }, [movie, navigate]);
  
  // Função para baixar JSON
  const handleDownloadJson = useCallback(() => {
    try {
      // Converter o filme para o formato dos dados do catálogo
      const movieJson = {
        id: movie.id,
        title: movie.title,
        genre: movie.genre,
        style: movie.style,
        imageStyle: movie.style,
        duration: movie.duration,
        synopsis: movie.synopsis,
        characters: movie.characters.map(char => ({
          name: char.name,
          description: char.description,
          voice: char.voice
        })),
          scenes: movie.scenes.map(scene => ({
            id: scene.id,
            prompt: scene.prompt,
            imageUrl: scene.frames[0]?.imageUrl || "", // Usar primeiro frame como imagem da cena
            audioUrl: scene.audioUrl,
            duration: scene.duration,
            text: scene.text,
            dialogue: scene.text || "" // Mapeando text para dialogue para compatibilidade
          })),
        createdAt: movie.createdAt,
        thumbnail: movie.thumbnail,
        aspectRatio: movie.aspectRatio,
        type: movie.type || 'movie'
      };
      
      const dataStr = JSON.stringify(movieJson, null, 2);
      const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
      
      const exportFileDefaultName = `${movie.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.json`;
      
      const linkElement = document.createElement('a');
      linkElement.setAttribute('href', dataUri);
      linkElement.setAttribute('download', exportFileDefaultName);
      linkElement.click();
      
      toast({
        title: "JSON baixado com sucesso!",
        description: `O arquivo ${exportFileDefaultName} foi baixado.`
      });
    } catch (error) {
      toast({
        title: "Erro ao baixar JSON",
        description: "Houve um problema ao gerar o arquivo JSON.",
        variant: "destructive"
      });
    }
  }, [movie, toast]);
  
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
    setCurrentFrameIndex(0);
  }, [currentSceneIndex]);

  // Controlar reprodução de frames
  useEffect(() => {
    if (isPlaying && currentScene.frames && currentScene.frames.length > 1) {
      frameIntervalRef.current = setInterval(() => {
        setCurrentFrameIndex(prev => (prev + 1) % currentScene.frames.length);
      }, 500); // 2 fps = 500ms por frame
    } else {
      if (frameIntervalRef.current) {
        clearInterval(frameIntervalRef.current);
        frameIntervalRef.current = null;
      }
    }

    return () => {
      if (frameIntervalRef.current) {
        clearInterval(frameIntervalRef.current);
        frameIntervalRef.current = null;
      }
    };
  }, [isPlaying, currentScene.frames]);

  const handleImageError = useCallback(() => {
    console.log("Erro ao carregar imagem, usando placeholder");
    setImageError(true);
  }, []);

  const getImageSrc = useCallback(() => {
    if (imageError) {
      return "/placeholder.svg";
    }
    const currentFrame = currentScene.frames?.[currentFrameIndex];
    return currentFrame?.imageUrl || currentScene.frames?.[0]?.imageUrl || "/placeholder.svg";
  }, [imageError, currentScene.frames, currentFrameIndex]);

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


        

        {/* Scene & Frame Counter */}
        <div className="absolute top-4 left-4 text-white bg-black/50 px-3 py-1 rounded-full text-sm z-10">
          Cena {currentSceneIndex + 1}/{movie.scenes.length} • Frame {currentFrameIndex + 1}/24
        </div>
        
        {/* Frame Progress Bar */}
        {currentScene.frames && currentScene.frames.length > 1 && (
          <div className="absolute top-4 right-4 text-white bg-black/50 px-3 py-1 rounded-full text-xs z-10">
            <div className="flex items-center gap-2">
              <span>2 FPS</span>
              <div className="w-16 h-1 bg-white/20 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-primary transition-all duration-100"
                  style={{ width: `${((currentFrameIndex + 1) / 24) * 100}%` }}
                />
              </div>
            </div>
          </div>
        )}
        
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
          movie={movie}
          isUserCreated={isUserCreated()}
          isFullscreen={isFullscreen}
          onPlay={handlePlay}
          onPause={handlePause}
          onPrevScene={handlePrevScene}
          onNextScene={handleNextScene}
          onVolumeChange={handleVolumeChange}
          onEdit={handleEdit}
          onDownloadJson={handleDownloadJson}
          onToggleFullscreen={toggleFullscreen}
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