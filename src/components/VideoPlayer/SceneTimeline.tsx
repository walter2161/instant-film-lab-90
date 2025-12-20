import { memo, useRef, useEffect } from "react";
import { Movie } from "@/types/movie";
import { cn } from "@/lib/utils";

interface SceneTimelineProps {
  movie: Movie;
  currentSceneIndex: number;
  preloadedScenes: Set<number>;
  onSceneSelect: (index: number) => void;
}

export const SceneTimeline = memo(({
  movie,
  currentSceneIndex,
  preloadedScenes,
  onSceneSelect,
}: SceneTimelineProps) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const activeThumbRef = useRef<HTMLButtonElement>(null);

  // Scroll para a cena atual quando mudar
  useEffect(() => {
    if (activeThumbRef.current && scrollContainerRef.current) {
      const container = scrollContainerRef.current;
      const thumb = activeThumbRef.current;
      
      const containerRect = container.getBoundingClientRect();
      const thumbRect = thumb.getBoundingClientRect();
      
      const scrollLeft = thumb.offsetLeft - (containerRect.width / 2) + (thumbRect.width / 2);
      
      container.scrollTo({
        left: scrollLeft,
        behavior: 'smooth'
      });
    }
  }, [currentSceneIndex]);

  return (
    <div className="bg-background border-t border-border">
      <div className="p-4">
        <h3 className="text-sm font-semibold text-foreground mb-3">
          Linha do Tempo
        </h3>
        
        <div 
          ref={scrollContainerRef}
          className="flex gap-2 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-muted scrollbar-track-transparent"
        >
          {movie.scenes.map((scene, index) => {
            const isActive = index === currentSceneIndex;
            const isPreloaded = preloadedScenes.has(index);
            const isPast = index < currentSceneIndex;
            
            return (
              <button
                key={scene.id}
                ref={isActive ? activeThumbRef : null}
                onClick={() => onSceneSelect(index)}
                className={cn(
                  "flex-shrink-0 group relative rounded-lg overflow-hidden transition-all duration-300",
                  "w-28 md:w-36 aspect-video",
                  "focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background",
                  isActive 
                    ? "ring-2 ring-primary scale-105 shadow-lg" 
                    : "hover:scale-102 hover:ring-1 hover:ring-primary/50"
                )}
              >
                {/* Thumbnail Image */}
                <img
                  src={scene.imageUrl}
                  alt={`Cena ${index + 1}`}
                  className={cn(
                    "w-full h-full object-cover transition-all duration-300",
                    isPast && !isActive && "opacity-60 grayscale-[30%]",
                    !isPreloaded && !isPast && !isActive && "opacity-40"
                  )}
                  loading="lazy"
                />
                
                {/* Overlay */}
                <div 
                  className={cn(
                    "absolute inset-0 transition-all duration-300",
                    isActive 
                      ? "bg-primary/20" 
                      : isPast 
                        ? "bg-black/30"
                        : "bg-black/10 group-hover:bg-black/20"
                  )}
                />
                
                {/* Scene Number */}
                <div 
                  className={cn(
                    "absolute bottom-1 left-1 px-1.5 py-0.5 rounded text-xs font-medium",
                    isActive 
                      ? "bg-primary text-primary-foreground" 
                      : "bg-black/60 text-white/80"
                  )}
                >
                  {index + 1}
                </div>
                
                {/* Progress indicator for current scene */}
                {isActive && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary/30">
                    <div 
                      className="h-full bg-primary animate-pulse"
                      style={{ width: '100%' }}
                    />
                  </div>
                )}
                
                {/* Preloading indicator */}
                {isPreloaded && !isActive && !isPast && (
                  <div className="absolute top-1 right-1">
                    <div className="w-2 h-2 bg-green-500 rounded-full shadow-sm" />
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
});

SceneTimeline.displayName = 'SceneTimeline';
