import { Button } from "@/components/ui/button";
import { MovieCard } from "@/components/MovieCard";
import { Layout } from "@/components/Layout";
import { Play, Sparkles, Film, Filter } from "lucide-react";
import { Link } from "react-router-dom";
import { Movie } from "@/types/movie";
import { FEATURED_MOVIES_COMPLETE } from "@/data/featuredContent";
import { useState, useMemo } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";


export const Home = () => {
  const [selectedGenre, setSelectedGenre] = useState<string>("all");
  
  // Get unique genres from movies
  const genres = useMemo(() => {
    const uniqueGenres = [...new Set(FEATURED_MOVIES_COMPLETE.map(movie => movie.genre))];
    return uniqueGenres.sort();
  }, []);
  
  // Filter movies based on selected genre
  const filteredMovies = useMemo(() => {
    if (selectedGenre === "all") {
      return FEATURED_MOVIES_COMPLETE;
    }
    return FEATURED_MOVIES_COMPLETE.filter(movie => movie.genre === selectedGenre);
  }, [selectedGenre]);

  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative h-[70vh] flex items-center justify-center bg-gradient-hero overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-background to-secondary/20" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-black/70" />
        <div className="relative z-10 text-center max-w-4xl mx-auto px-4">
          <div className="flex items-center justify-center gap-3 mb-6">
            <Film className="w-12 h-12 text-primary" />
            <h1 className="text-5xl md:text-7xl font-bold bg-gradient-primary bg-clip-text text-transparent">
              LEDTV
            </h1>
          </div>
          
          <p className="text-xl md:text-2xl text-foreground/90 mb-8 max-w-2xl mx-auto">
            A primeira plataforma de filmes gerados por IA. Assista filmes únicos ou crie o seu próprio filme personalizado.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button variant="cinema" size="xl" className="gap-3 shadow-intense">
              <Play className="w-6 h-6" />
              Assistir Filmes
            </Button>
            
            <Link to="/create">
              <Button variant="glass" size="xl" className="gap-3">
                <Sparkles className="w-6 h-6" />
                Criar Meu Filme
              </Button>
            </Link>
          </div>
        </div>
        
        {/* Floating elements */}
        <div className="absolute top-20 left-10 w-20 h-20 bg-primary/20 rounded-full blur-xl animate-pulse" />
        <div className="absolute bottom-32 right-16 w-16 h-16 bg-accent/30 rounded-full blur-lg animate-pulse delay-1000" />
        <div className="absolute top-1/2 right-20 w-12 h-12 bg-primary-glow/25 rounded-full blur-md animate-pulse delay-500" />
      </section>
      
      {/* Featured Movies */}
      <section className="container mx-auto px-4 py-16">
        <div className="flex items-center justify-between gap-3 mb-8">
          <div className="flex items-center gap-3">
            <Film className="w-6 h-6 text-primary" />
            <h2 className="text-3xl font-bold">Filmes Prontos para Assistir</h2>
          </div>
          
          {/* Filter */}
          <div className="flex items-center gap-3">
            <Filter className="w-5 h-5 text-muted-foreground" />
            <Select value={selectedGenre} onValueChange={setSelectedGenre}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filtrar por gênero" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os Gêneros</SelectItem>
                {genres.map((genre) => (
                  <SelectItem key={genre} value={genre}>
                    {genre}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6">
          {filteredMovies.map((movie) => (
            <MovieCard key={movie.id} movie={movie} />
          ))}
        </div>
        
        {filteredMovies.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground text-lg">Nenhum filme encontrado para este gênero.</p>
          </div>
        )}
      </section>

      
      {/* CTA Section */}
      <section className="bg-gradient-card py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Pronto para criar seu filme?</h2>
          <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
            Use nossa IA avançada para gerar filmes únicos com o gênero, estilo e duração que você escolher.
          </p>
          
          <Link to="/create">
            <Button variant="cinema" size="xl" className="gap-3 shadow-intense">
              <Sparkles className="w-6 h-6" />
              Começar Agora
            </Button>
          </Link>
        </div>
      </section>
    </Layout>
  );
};