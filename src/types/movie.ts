// Tipos de animação cinematográfica para efeito Ken Burns
export type AnimationType = 
  | 'zoom-in' 
  | 'zoom-out' 
  | 'pan-left' 
  | 'pan-right' 
  | 'pan-up' 
  | 'pan-down'
  | 'ken-burns-tl'  // top-left to bottom-right
  | 'ken-burns-tr'  // top-right to bottom-left
  | 'ken-burns-bl'  // bottom-left to top-right
  | 'ken-burns-br'  // bottom-right to top-left
  | 'slow-zoom'
  | 'drift';

// Tipos de transição entre cenas
export type TransitionType = 
  | 'crossfade' 
  | 'fade-black' 
  | 'fade-white'
  | 'slide-left'
  | 'slide-right'
  | 'zoom-transition'
  | 'dissolve';

export interface MovieScene {
  id: string;
  prompt: string;
  imageUrl: string;
  audioUrl: string;
  duration: number; // em segundos
  text: string; // Narração/falas visíveis para o usuário
  visualDescription: string; // Descrição detalhada da cena apenas para a IA
  // Novos campos para animação cinematográfica
  animation?: AnimationType;
  animationIntensity?: number; // 1-10, onde 10 é o mais intenso
  transition?: TransitionType;
  transitionDuration?: number; // em ms
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
  // Novos campos para configuração global de vídeo
  defaultTransition?: TransitionType;
  defaultAnimationIntensity?: number;
  fps?: number; // Frames per second para animações (default: 30)
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

// Utilitário para obter uma animação aleatória
export const getRandomAnimation = (): AnimationType => {
  const animations: AnimationType[] = [
    'zoom-in', 'zoom-out', 'pan-left', 'pan-right', 
    'ken-burns-tl', 'ken-burns-tr', 'ken-burns-bl', 'ken-burns-br',
    'slow-zoom', 'drift'
  ];
  return animations[Math.floor(Math.random() * animations.length)];
};

// Utilitário para obter uma transição aleatória
export const getRandomTransition = (): TransitionType => {
  const transitions: TransitionType[] = [
    'crossfade', 'fade-black', 'dissolve', 'zoom-transition'
  ];
  return transitions[Math.floor(Math.random() * transitions.length)];
};
