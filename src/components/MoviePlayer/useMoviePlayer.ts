import { useState, useCallback, useEffect, useRef } from "react";
import { Movie } from "@/types/movie";

export const useMoviePlayer = (movie: Movie) => {
  const [currentSceneIndex, setCurrentSceneIndex] = useState(0);
  const [volume, setVolume] = useState(100);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  
  const playbackTimerRef = useRef<NodeJS.Timeout | null>(null);
  const sceneStartTimeRef = useRef<number>(0);
  
  // Duração fixa de 15 segundos por slide
  const SCENE_DURATION = 15;
  
  const currentScene = movie.scenes[currentSceneIndex];
  const isLastScene = currentSceneIndex === movie.scenes.length - 1;
  
  // Calcular duração total do filme (15 segundos por cena)
  const totalDuration = movie.scenes.length * SCENE_DURATION;
  
  // Calcular progresso da cena atual
  const sceneProgress = (currentTime / SCENE_DURATION) * 100;
  const progress = Math.min(sceneProgress, 100);

  // Navegação entre slides
  const handleNextScene = useCallback(() => {
    if (!isLastScene) {
      console.log(`Avançando para slide ${currentSceneIndex + 2}`);
      if (playbackTimerRef.current) {
        clearInterval(playbackTimerRef.current);
      }
      setCurrentSceneIndex(prev => prev + 1);
      setCurrentTime(0);
      sceneStartTimeRef.current = Date.now();
    } else {
      console.log("Apresentação finalizada");
      setIsPlaying(false);
    }
  }, [isLastScene, currentSceneIndex]);

  const handlePrevScene = useCallback(() => {
    if (currentSceneIndex > 0) {
      console.log(`Voltando para slide ${currentSceneIndex}`);
      if (playbackTimerRef.current) {
        clearInterval(playbackTimerRef.current);
      }
      setCurrentSceneIndex(prev => prev - 1);
      setCurrentTime(0);
      sceneStartTimeRef.current = Date.now();
    }
  }, [currentSceneIndex]);

  const handleSceneSelect = useCallback((index: number) => {
    console.log(`Selecionando slide ${index + 1}`);
    if (playbackTimerRef.current) {
      clearInterval(playbackTimerRef.current);
    }
    setCurrentSceneIndex(index);
    setCurrentTime(0);
    sceneStartTimeRef.current = Date.now();
  }, []);

  // Limpar timer quando componente for desmontado
  useEffect(() => {
    return () => {
      if (playbackTimerRef.current) {
        clearInterval(playbackTimerRef.current);
      }
    };
  }, []);

  // Timer para atualizar progresso durante reprodução
  useEffect(() => {
    if (isPlaying) {
      sceneStartTimeRef.current = Date.now();
      
      playbackTimerRef.current = setInterval(() => {
        const elapsed = (Date.now() - sceneStartTimeRef.current) / 1000;
        setCurrentTime(elapsed);
        
        // Auto-avançar para próxima cena após 15 segundos
        if (elapsed >= SCENE_DURATION) {
          if (!isLastScene) {
            handleNextScene();
          } else {
            setIsPlaying(false);
            setCurrentTime(SCENE_DURATION);
          }
        }
      }, 100);
      
      return () => {
        if (playbackTimerRef.current) {
          clearInterval(playbackTimerRef.current);
        }
      };
    }
  }, [isPlaying, isLastScene, handleNextScene, SCENE_DURATION]);

  const handlePlay = useCallback(() => {
    if (!isPlaying) {
      setIsPlaying(true);
      setCurrentTime(0);
      console.log(`Iniciando reprodução da cena ${currentSceneIndex + 1} - 15 segundos`);
    }
  }, [isPlaying, currentSceneIndex]);

  // Auto-iniciar reprodução quando componente for montado
  useEffect(() => {
    const autoStart = setTimeout(() => {
      setIsPlaying(true);
      console.log("Iniciando reprodução automática");
    }, 1000); // Aguarda 1 segundo para carregar

    return () => clearTimeout(autoStart);
  }, []);

  const handlePause = useCallback(() => {
    setIsPlaying(false);
    if (playbackTimerRef.current) {
      clearInterval(playbackTimerRef.current);
    }
  }, []);

  const handleVolumeChange = useCallback((newVolume: number[]) => {
    setVolume(newVolume[0]);
  }, []);

  return {
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
  };
};