import { useState, useEffect, useRef, memo } from 'react';
import { MovieScene, AnimationType } from '@/types/movie';
import { cn } from '@/lib/utils';

interface CinematicSceneProps {
  scene: MovieScene;
  isActive: boolean;
  isPreloading?: boolean;
  onLoad?: () => void;
  onError?: () => void;
  className?: string;
}

// Keyframes CSS para animações Ken Burns
const animationStyles: Record<AnimationType, string> = {
  'zoom-in': 'animate-cinema-zoom-in',
  'zoom-out': 'animate-cinema-zoom-out',
  'pan-left': 'animate-cinema-pan-left',
  'pan-right': 'animate-cinema-pan-right',
  'pan-up': 'animate-cinema-pan-up',
  'pan-down': 'animate-cinema-pan-down',
  'ken-burns-tl': 'animate-ken-burns-tl',
  'ken-burns-tr': 'animate-ken-burns-tr',
  'ken-burns-bl': 'animate-ken-burns-bl',
  'ken-burns-br': 'animate-ken-burns-br',
  'slow-zoom': 'animate-cinema-slow-zoom',
  'drift': 'animate-cinema-drift',
};

export const CinematicScene = memo(({ 
  scene, 
  isActive, 
  isPreloading = false,
  onLoad,
  onError,
  className 
}: CinematicSceneProps) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  // Resetar estado quando a cena muda
  useEffect(() => {
    setIsLoaded(false);
    setHasError(false);
  }, [scene.id]);

  const handleLoad = () => {
    setIsLoaded(true);
    onLoad?.();
  };

  const handleError = () => {
    setHasError(true);
    onError?.();
  };

  // Obter a animação da cena ou usar uma padrão
  const animation = scene.animation || 'slow-zoom';
  const animationClass = animationStyles[animation];

  // Ajustar duração da animação baseado na intensidade (1-10)
  const intensity = scene.animationIntensity || 5;
  const animationDuration = Math.max(8, 20 - intensity); // 8s a 20s

  return (
    <div 
      className={cn(
        "absolute inset-0 overflow-hidden",
        isActive ? "z-10" : isPreloading ? "z-0 opacity-0" : "hidden",
        className
      )}
    >
      {/* Background blur para preencher áreas vazias */}
      {isLoaded && !hasError && (
        <div 
          className="absolute inset-0 scale-110 blur-2xl opacity-50"
          style={{
            backgroundImage: `url(${scene.imageUrl})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
      )}

      {/* Imagem principal com animação cinematográfica */}
      <div className="absolute inset-0 flex items-center justify-center">
        <img
          ref={imgRef}
          src={hasError ? '/placeholder.svg' : scene.imageUrl}
          alt={scene.visualDescription || `Scene ${scene.id}`}
          className={cn(
            "w-full h-full object-cover transition-opacity duration-500",
            isLoaded ? "opacity-100" : "opacity-0",
            isActive && isLoaded && animationClass
          )}
          style={{
            animationDuration: `${animationDuration}s`,
            animationTimingFunction: 'cubic-bezier(0.4, 0, 0.2, 1)',
            animationFillMode: 'forwards',
          }}
          onLoad={handleLoad}
          onError={handleError}
          loading={isActive || isPreloading ? 'eager' : 'lazy'}
        />
      </div>

      {/* Loading skeleton */}
      {!isLoaded && !hasError && (
        <div className="absolute inset-0 bg-gradient-to-br from-background/80 to-background flex items-center justify-center">
          <div className="flex flex-col items-center gap-4">
            <div className="w-12 h-12 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
            <p className="text-sm text-muted-foreground animate-pulse">
              Carregando cena...
            </p>
          </div>
        </div>
      )}

      {/* Vignette overlay para efeito cinematográfico */}
      <div className="absolute inset-0 pointer-events-none bg-radial-vignette opacity-40" />
    </div>
  );
});

CinematicScene.displayName = 'CinematicScene';
