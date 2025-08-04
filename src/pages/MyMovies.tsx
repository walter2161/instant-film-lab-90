import { useState, useEffect } from "react";
import { Layout } from "@/components/Layout";
import { MovieCard } from "@/components/MovieCard";
import { Button } from "@/components/ui/button";
import { MovieService } from "@/services/movieService";
import { Movie } from "@/types/movie";
import { Link } from "react-router-dom";
import { Library, Plus, Film, Star } from "lucide-react";
import { toast } from "sonner";
import { FEATURED_MOVIES_COMPLETE } from "@/data/featuredContent";

export const MyMovies = () => {
  const [savedMovies, setSavedMovies] = useState<Movie[]>([]);

  useEffect(() => {
    loadMovies();
  }, []);

  const loadMovies = () => {
    const saved = MovieService.getSavedMovies();
    setSavedMovies(saved);
  };

  const handleDelete = (movieId: string) => {
    // Não permitir deletar filmes em destaque
    const isFeaturedMovie = FEATURED_MOVIES_COMPLETE.some(movie => movie.id === movieId);
    if (isFeaturedMovie) {
      toast.error("Não é possível excluir filmes em destaque!");
      return;
    }

    if (confirm("Tem certeza que deseja excluir este filme?")) {
      MovieService.deleteMovie(movieId);
      loadMovies();
      toast.success("Filme excluído com sucesso!");
    }
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <Library className="w-8 h-8 text-primary" />
            <div>
              <h1 className="text-3xl font-bold">Minha Biblioteca</h1>
              <p className="text-muted-foreground">
                Filmes em destaque e suas criações
              </p>
            </div>
          </div>
          
          <Link to="/create">
            <Button variant="cinema" className="gap-2">
              <Plus className="w-4 h-4" />
              Criar Novo Filme
            </Button>
          </Link>
        </div>

        {/* Featured Movies */}
        <section className="mb-12">
          <div className="flex items-center gap-3 mb-6">
            <Star className="w-6 h-6 text-primary" />
            <h2 className="text-2xl font-bold">Filmes em Destaque</h2>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {FEATURED_MOVIES_COMPLETE.map((movie) => (
              <MovieCard 
                key={movie.id} 
                movie={movie} 
                onDelete={handleDelete}
                showDelete={false}
              />
            ))}
          </div>
        </section>

        {/* User Created Movies */}
        {savedMovies.length > 0 && (
          <section>
            <div className="flex items-center gap-3 mb-6">
              <Library className="w-6 h-6 text-primary" />
              <h2 className="text-2xl font-bold">Minhas Criações</h2>
              <span className="text-sm text-muted-foreground">
                ({savedMovies.length} filme{savedMovies.length !== 1 ? 's' : ''})
              </span>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
              {savedMovies.map((movie) => (
                <MovieCard 
                  key={movie.id} 
                  movie={movie} 
                  onDelete={handleDelete}
                  showDelete={true}
                />
              ))}
            </div>
          </section>
        )}

        {/* Empty State for User Movies */}
        {savedMovies.length === 0 && (
          <section className="text-center py-16 border-t border-border/50">
            <Film className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h2 className="text-2xl font-semibold mb-2">Nenhum filme criado ainda</h2>
            <p className="text-muted-foreground mb-6 max-w-md mx-auto">
              Comece criando seu primeiro filme personalizado com nossa IA avançada.
            </p>
            
            <Link to="/create">
              <Button variant="cinema" size="lg" className="gap-2">
                <Plus className="w-5 h-5" />
                Criar Meu Primeiro Filme
              </Button>
            </Link>
          </section>
        )}
      </div>
    </Layout>
  );
};