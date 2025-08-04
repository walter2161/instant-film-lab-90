import { Movie } from "@/types/movie";

interface SceneNavigationProps {
  movie: Movie;
  currentSceneIndex: number;
  onSceneSelect: (index: number) => void;
}

export const SceneNavigation = ({
  movie,
  currentSceneIndex,
  onSceneSelect
}: SceneNavigationProps) => {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">Cenas do Filme</h2>
        <div className="text-sm text-muted-foreground">
          {movie.scenes.length} cenas • {movie.scenes.reduce((total, scene) => total + scene.duration, 0)}s total
        </div>
      </div>
      
      <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 xl:grid-cols-10 gap-3">
        {movie.scenes.map((scene, index) => (
          <div 
            key={scene.id}
            className={`group relative cursor-pointer rounded-lg overflow-hidden border-2 transition-all duration-300 hover:scale-105 ${
              index === currentSceneIndex 
                ? 'border-primary shadow-glow ring-2 ring-primary/50' 
                : 'border-border hover:border-primary/50'
            }`}
            onClick={() => onSceneSelect(index)}
          >
            <div className="relative">
              <img 
                src={scene.imageUrl} 
                alt={`Cena ${index + 1}`}
                className={`w-full ${movie.aspectRatio === '16:9' ? 'aspect-[16/9]' : 'aspect-[9/16]'} object-cover transition-all duration-300 ${
                  index === currentSceneIndex ? 'brightness-110' : 'group-hover:brightness-110'
                }`}
                onError={(e) => {
                  e.currentTarget.src = "/placeholder.svg";
                }}
              />
              
              {/* Overlay com número da cena */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              
              <div className={`absolute bottom-0 left-0 right-0 p-2 transition-all duration-300 ${
                index === currentSceneIndex 
                  ? 'bg-primary/90 text-white' 
                  : 'bg-black/80 text-white group-hover:bg-primary/90'
              }`}>
                <div className="text-xs font-medium text-center">
                  Cena {index + 1}
                </div>
                <div className="text-xs text-center opacity-80">
                  {scene.duration}s
                </div>
              </div>
              
              {/* Indicador de cena atual */}
              {index === currentSceneIndex && (
                <div className="absolute top-2 right-2 w-3 h-3 bg-primary rounded-full animate-pulse shadow-glow" />
              )}
            </div>
          </div>
        ))}
      </div>
      
      {/* Preview da cena selecionada */}
      <div className="mt-8 p-6 bg-card rounded-lg border">
        <h3 className="font-semibold mb-2">Cena {currentSceneIndex + 1}</h3>
        <p className="text-sm text-muted-foreground mb-3">{movie.scenes[currentSceneIndex].text}</p>
        <div className="flex gap-2 text-xs">
          <span className="bg-primary/10 text-primary px-2 py-1 rounded">
            {movie.scenes[currentSceneIndex].duration}s
          </span>
          <span className="bg-muted text-muted-foreground px-2 py-1 rounded">
            {movie.scenes[currentSceneIndex].prompt.substring(0, 50)}...
          </span>
        </div>
      </div>
    </div>
  );
};