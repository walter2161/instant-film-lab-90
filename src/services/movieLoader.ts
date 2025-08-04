import { Movie } from "@/types/movie";

// Função para carregar filmes dinamicamente dos arquivos JSON
export const loadMovie = async (movieId: string): Promise<Movie | null> => {
  try {
    const movieData = await import(`@/data/movies/${movieId}.json`);
    return movieData.default as Movie;
  } catch (error) {
    console.error(`Erro ao carregar filme ${movieId}:`, error);
    return null;
  }
};

// Lista de IDs de filmes disponíveis
export const AVAILABLE_MOVIES = [
  'robots',
  'amazonia-perdida', 
  'aventura-ninja',
  'cacadores-ouro',
  'codigo-quantum',
  'coracao-ipanema',
  'despertar-dragoes',
  'fantasma-opera',
  'guardioes-galaxia',
  'lenda-cangaceiro',
  'misterios-sp',
  'romance-paris',
  'segredos-pantanal',
  'sherlock',
  'terror-espacial',
  'reino-sombras',
  'oceano-infinito',
  'cidade-espelhos',
  'ultimo-samurai',
  'noite-eterna',
  'cacadores-tesouro',
  'imperio-perdido',
  'guerreiros-tempo',
  'planeta-vermelho',
  'segredos-atlantida',
  'viagem-centro-terra',
  'labirinto-sonhos',
  'batalha-final',
  'herois-galaxia',
  'revolucao-digital',
  'mundo-paralelo',
  'fuga-prisao',
  'vinganca-ninja'
];

// Carregar todos os filmes disponíveis
export const loadAllMovies = async (): Promise<Movie[]> => {
  const movies: Movie[] = [];
  
  for (const movieId of AVAILABLE_MOVIES) {
    const movie = await loadMovie(movieId);
    if (movie) {
      movies.push(movie);
    }
  }
  
  return movies;
};