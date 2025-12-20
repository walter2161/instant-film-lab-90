import { useState, useEffect, useCallback } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { VideoPlayer } from "@/components/VideoPlayer";
import { MovieService } from "@/services/movieService";
import { Movie } from "@/types/movie";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { ArrowLeft, Film, Info } from "lucide-react";
import { FEATURED_MOVIES_COMPLETE } from "@/data/featuredContent";
import { useToast } from "@/hooks/use-toast";

export const Player = () => {
  const { movieId } = useParams<{ movieId: string }>();
  const [movie, setMovie] = useState<Movie | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();

  // Verificar se o filme foi criado pelo usuário
  const isUserCreated = useCallback(() => {
    const savedMovies = MovieService.getSavedMovies();
    return savedMovies.some(savedMovie => savedMovie.id === movie?.id);
  }, [movie?.id]);

  const handleEdit = useCallback(() => {
    if (movie) navigate('/create', { state: { editMovie: movie } });
  }, [movie, navigate]);

  const handleDownloadJson = useCallback(() => {
    if (!movie) return;
    const dataStr = JSON.stringify(movie, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', `${movie.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.json`);
    linkElement.click();
    toast({ title: "JSON baixado com sucesso!" });
  }, [movie, toast]);

  useEffect(() => {
    if (movieId) {
      const savedMovies = MovieService.getSavedMovies();
      let foundMovie = savedMovies.find(m => m.id === movieId);
      if (!foundMovie) {
        foundMovie = FEATURED_MOVIES_COMPLETE.find(m => m.id === movieId);
      }
      setMovie(foundMovie || null);
      setLoading(false);
    }
  }, [movieId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-primary/30 border-t-primary rounded-full animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Carregando filme...</p>
        </div>
      </div>
    );
  }

  if (!movie) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="flex items-center justify-center mb-4">
            <Film className="w-16 h-16 text-muted-foreground" />
          </div>
          <h1 className="text-2xl font-bold mb-2">Filme não encontrado</h1>
          <p className="text-muted-foreground mb-6">
            O filme que você está procurando não existe ou foi removido.
          </p>
          <Link to="/">
            <Button variant="cinema" className="gap-2">
              <ArrowLeft className="w-4 h-4" />
              Voltar ao Início
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-background">
      {/* Back Button */}
      <div className="fixed top-4 left-4 z-50">
        <Link to="/my-movies">
          <Button variant="glass" size="sm" className="gap-2">
            <ArrowLeft className="w-4 h-4" />
            Voltar
          </Button>
        </Link>
      </div>

      {/* Content Info Popup */}
      <div className="fixed top-4 right-4 z-50">
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="glass" size="sm" className="gap-2">
              <Info className="w-4 h-4" />
              Info
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="text-xl font-bold">
                {movie.title}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold mb-2">Sinopse</h4>
                <p className="text-sm text-muted-foreground">
                  {movie.synopsis}
                </p>
              </div>
              
              <div className="flex gap-2 flex-wrap">
                <span className="bg-primary/20 text-primary px-3 py-1 rounded-full text-sm">
                  {movie.genre}
                </span>
                <span className="bg-secondary/20 text-secondary-foreground px-3 py-1 rounded-full text-sm">
                  {movie.style}
                </span>
              </div>
              
              <div>
                <h4 className="font-semibold mb-2">Informações Técnicas</h4>
                <div className="text-sm text-muted-foreground space-y-1">
                  <p><strong>Cenas:</strong> {movie.scenes.length}</p>
                  <p><strong>Duração:</strong> {movie.duration}</p>
                  <p><strong>Aspect Ratio:</strong> {movie.aspectRatio}</p>
                  <p><strong>Criado em:</strong> {new Date(movie.createdAt).toLocaleDateString('pt-BR')}</p>
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Player */}
      <VideoPlayer 
        movie={movie} 
        onEdit={handleEdit}
        onDownloadJson={handleDownloadJson}
        isUserCreated={isUserCreated()}
      />
    </div>
  );
};