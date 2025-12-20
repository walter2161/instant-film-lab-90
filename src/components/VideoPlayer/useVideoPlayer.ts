import { useState, useCallback, useEffect, useRef, useMemo } from "react";
import { Movie, MovieScene, TransitionType, getRandomAnimation, getRandomTransition } from "@/types/movie";

interface UseVideoPlayerReturn {
  // Estado atual
  currentSceneIndex: number;
  currentScene: MovieScene;
  nextScene: MovieScene | null;
  isPlaying: boolean;
  isLoading: boolean;
  isTransitioning: boolean;
  
  // Progresso
  sceneProgress: number; // 0-100
  totalProgress: number; // 0-100
  currentTime: number; // segundos dentro da cena atual
  totalDuration: number; // duração total em segundos
  
  // Transição
  currentTransition: TransitionType;
  transitionDuration: number;
  
  // Controles
  play: () => void;
  pause: () => void;
  togglePlayPause: () => void;
  nextSceneManual: () => void;
  prevScene: () => void;
  seekToScene: (index: number) => void;
  
  // Estados
  isFirstScene: boolean;
  isLastScene: boolean;
  
  // Preloading
  preloadedScenes: Set<number>;
}

const SCENE_DURATION = 12; // segundos por cena
const DEFAULT_TRANSITION_DURATION = 800; // ms
const PRELOAD_AHEAD = 2; // quantas cenas precarregar à frente

export const useVideoPlayer = (movie: Movie): UseVideoPlayerReturn => {
  const [currentSceneIndex, setCurrentSceneIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [preloadedScenes, setPreloadedScenes] = useState<Set<number>>(new Set([0]));
  
  const playbackTimerRef = useRef<NodeJS.Timeout | null>(null);
  const sceneStartTimeRef = useRef<number>(0);
  const transitionTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Preparar cenas com animações randômicas se não definidas
  const preparedScenes = useMemo(() => {
    return movie.scenes.map(scene => ({
      ...scene,
      animation: scene.animation || getRandomAnimation(),
      transition: scene.transition || movie.defaultTransition || getRandomTransition(),
      transitionDuration: scene.transitionDuration || DEFAULT_TRANSITION_DURATION,
      animationIntensity: scene.animationIntensity || movie.defaultAnimationIntensity || 5,
    }));
  }, [movie]);

  const currentScene = preparedScenes[currentSceneIndex];
  const nextScene = currentSceneIndex < preparedScenes.length - 1 
    ? preparedScenes[currentSceneIndex + 1] 
    : null;
  
  const isFirstScene = currentSceneIndex === 0;
  const isLastScene = currentSceneIndex === preparedScenes.length - 1;
  
  const totalDuration = preparedScenes.length * SCENE_DURATION;
  const sceneProgress = (currentTime / SCENE_DURATION) * 100;
  const totalProgress = ((currentSceneIndex * SCENE_DURATION + currentTime) / totalDuration) * 100;
  
  const currentTransition = currentScene.transition || 'crossfade';
  const transitionDuration = currentScene.transitionDuration || DEFAULT_TRANSITION_DURATION;

  // Preload de cenas
  useEffect(() => {
    const scenesToPreload: number[] = [];
    for (let i = 1; i <= PRELOAD_AHEAD; i++) {
      const index = currentSceneIndex + i;
      if (index < preparedScenes.length && !preloadedScenes.has(index)) {
        scenesToPreload.push(index);
      }
    }
    
    if (scenesToPreload.length > 0) {
      scenesToPreload.forEach(index => {
        const img = new Image();
        img.onload = () => {
          setPreloadedScenes(prev => new Set([...prev, index]));
        };
        img.src = preparedScenes[index].imageUrl;
      });
    }
  }, [currentSceneIndex, preparedScenes, preloadedScenes]);

  // Timer de reprodução
  useEffect(() => {
    if (isPlaying && !isTransitioning) {
      sceneStartTimeRef.current = Date.now() - (currentTime * 1000);
      
      playbackTimerRef.current = setInterval(() => {
        const elapsed = (Date.now() - sceneStartTimeRef.current) / 1000;
        setCurrentTime(elapsed);
        
        // Auto-avançar para próxima cena
        if (elapsed >= SCENE_DURATION) {
          if (!isLastScene) {
            initiateTransition(currentSceneIndex + 1);
          } else {
            setIsPlaying(false);
            setCurrentTime(SCENE_DURATION);
          }
        }
      }, 50); // 20 FPS para atualização suave do progresso
      
      return () => {
        if (playbackTimerRef.current) {
          clearInterval(playbackTimerRef.current);
        }
      };
    }
  }, [isPlaying, isTransitioning, currentSceneIndex, isLastScene, currentTime]);

  // Iniciar transição para próxima cena
  const initiateTransition = useCallback((nextIndex: number) => {
    if (nextIndex < 0 || nextIndex >= preparedScenes.length) return;
    
    if (playbackTimerRef.current) {
      clearInterval(playbackTimerRef.current);
    }
    
    setIsTransitioning(true);
    
    transitionTimeoutRef.current = setTimeout(() => {
      setCurrentSceneIndex(nextIndex);
      setCurrentTime(0);
      setIsTransitioning(false);
      sceneStartTimeRef.current = Date.now();
    }, transitionDuration / 2);
  }, [preparedScenes.length, transitionDuration]);

  // Controles
  const play = useCallback(() => {
    setIsLoading(false);
    setIsPlaying(true);
    sceneStartTimeRef.current = Date.now() - (currentTime * 1000);
  }, [currentTime]);

  const pause = useCallback(() => {
    setIsPlaying(false);
    if (playbackTimerRef.current) {
      clearInterval(playbackTimerRef.current);
    }
  }, []);

  const togglePlayPause = useCallback(() => {
    if (isPlaying) {
      pause();
    } else {
      play();
    }
  }, [isPlaying, play, pause]);

  const nextSceneManual = useCallback(() => {
    if (!isLastScene && !isTransitioning) {
      initiateTransition(currentSceneIndex + 1);
    }
  }, [isLastScene, isTransitioning, currentSceneIndex, initiateTransition]);

  const prevScene = useCallback(() => {
    if (!isFirstScene && !isTransitioning) {
      initiateTransition(currentSceneIndex - 1);
    }
  }, [isFirstScene, isTransitioning, currentSceneIndex, initiateTransition]);

  const seekToScene = useCallback((index: number) => {
    if (index >= 0 && index < preparedScenes.length && !isTransitioning) {
      initiateTransition(index);
    }
  }, [preparedScenes.length, isTransitioning, initiateTransition]);

  // Cleanup
  useEffect(() => {
    return () => {
      if (playbackTimerRef.current) {
        clearInterval(playbackTimerRef.current);
      }
      if (transitionTimeoutRef.current) {
        clearTimeout(transitionTimeoutRef.current);
      }
    };
  }, []);

  // Auto-play após carregamento inicial
  useEffect(() => {
    const autoStart = setTimeout(() => {
      setIsLoading(false);
      setIsPlaying(true);
    }, 1500);

    return () => clearTimeout(autoStart);
  }, []);

  return {
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
  };
};
