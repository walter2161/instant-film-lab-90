export interface MovieFrame {
  id: string;
  prompt: string;
  imageUrl: string;
  frameNumber: number; // 1 a 24
}

export interface MovieScene {
  id: string;
  prompt: string;
  frames: MovieFrame[]; // 24 frames por cena
  audioUrl: string;
  duration: number; // em segundos (sempre 12 segundos - 24 frames / 2 fps)
  text: string; // Narração/falas visíveis para o usuário
  visualDescription: string; // Descrição detalhada da cena apenas para a IA
  fps: number; // sempre 2 fps
}

export interface MovieCharacter {
  name: string;
  description: string;
  voice: string;
}

export interface Movie {
  id: string;
  title: string;
  genre: string;
  style: string;
  duration: string;
  synopsis: string;
  characters: MovieCharacter[];
  scenes: MovieScene[];
  createdAt: string;
  thumbnail?: string;
  aspectRatio: '16:9' | '9:16';
  type: 'movie' | 'series';
  episodeNumber?: number;
  seasonNumber?: number;
  totalEpisodes?: number;
  soundtrack?: string; // URL da trilha sonora
}

export interface Series {
  id: string;
  title: string;
  genre: string;
  style: string;
  synopsis: string;
  episodes: Movie[];
  createdAt: string;
  thumbnail?: string;
  aspectRatio: '16:9' | '9:16';
  totalSeasons: number;
}

export interface CreateMovieRequest {
  genre: string;
  style: string;
  duration: string;
  customPrompt?: string;
  aspectRatio: '16:9' | '9:16';
  title?: string;
  thumbnailDescription?: string;
  keywords?: string;
}

export interface CreateSeriesRequest {
  genre: string;
  style: string;
  episodeDuration: string;
  numberOfEpisodes: number;
  numberOfSeasons: number;
  customPrompt?: string;
  aspectRatio: '16:9' | '9:16';
}