import { Movie } from "@/types/movie";
import { Button } from "@/components/ui/button";
import { Play, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";

interface MovieCardProps {
  movie: Movie;
  onDelete?: (movieId: string) => void;
  showDelete?: boolean;
}

export const MovieCard = ({ movie, onDelete, showDelete = false }: MovieCardProps) => {
  const handleDelete = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (onDelete) {
      onDelete(movie.id);
    }
  };

  return (
    <div className="group relative bg-gradient-card rounded-lg overflow-hidden shadow-card hover:shadow-intense transition-all duration-300 transform hover:scale-105">
      {/* Thumbnail */}
      <div className="aspect-[9/16] relative overflow-hidden">
        <img 
          src={movie.thumbnail || "/placeholder.svg"} 
          alt={movie.title}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
          onError={(e) => {
            e.currentTarget.src = "/placeholder.svg";
          }}
        />
        
        {/* Overlay */}
        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
          <Link to={`/player/${movie.id}`}>
            <Button variant="play" size="lg" className="gap-2">
              <Play className="w-6 h-6" />
              Assistir
            </Button>
          </Link>
        </div>
        
        {/* Delete button */}
        {showDelete && onDelete && (
          <button
            onClick={handleDelete}
            className="absolute top-2 right-2 bg-destructive/80 text-destructive-foreground p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:bg-destructive"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        )}
        
        {/* Duration badge */}
        <div className="absolute bottom-2 right-2 bg-black/80 text-white px-2 py-1 rounded text-xs font-medium">
          {movie.duration}
        </div>
      </div>
      
      {/* Content */}
      <div className="p-4">
        <h3 className="font-bold text-lg mb-2 text-foreground group-hover:text-primary transition-colors">
          {movie.title}
        </h3>
        
        <p className="text-muted-foreground text-sm mb-3 line-clamp-2">
          {movie.synopsis}
        </p>
        
        <div className="flex items-center gap-2 text-xs">
          <span className="bg-primary/20 text-primary px-2 py-1 rounded">
            {movie.genre}
          </span>
          <span className="bg-secondary text-secondary-foreground px-2 py-1 rounded">
            {movie.style}
          </span>
        </div>
      </div>
    </div>
  );
};