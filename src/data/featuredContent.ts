import { Movie } from "@/types/movie";
import { PollinationsService } from "@/services/pollinationsService";

// Import all movie JSON files
import ladroesMemoria from "./movies/ladroes-memoria.json";
import cacadoresTesouro from "./movies/cacadores-tesouro.json";
import cidadeEspelhos from "./movies/cidade-espelhos.json";
import imperioPerdido from "./movies/imperio-perdido.json";
import noiteEterna from "./movies/noite-eterna.json";
import oceanoInfinito from "./movies/oceano-infinito.json";
import reinoSombras from "./movies/reino-sombras.json";
import ultimoSamurai from "./movies/ultimo-samurai.json";
import guerreirosTempo from "./movies/guerreiros-tempo.json";
import planetaVermelho from "./movies/planeta-vermelho.json";
import sombrasDigitais from "./movies/sombras-digitais.json";
import vingancaCyber from "./movies/vinganca-cyber.json";
import portalDimensao from "./movies/portal-dimensao.json";
import assassinoRobos from "./movies/assassino-robos.json";
import herdeiroRragao from "./movies/herdeiro-dragao.json";
import pesadeloRealidade from "./movies/pesadelo-realidade.json";
import amorTempo from "./movies/amor-tempo.json";
import detectiveFantasma from "./movies/detective-fantasma.json";
import comediaExtraterrestre from "./movies/comedia-extraterrestre.json";
import escolaMagica from "./movies/escola-magica.json";
import amazoniaSelvagem from "./movies/amazonia-selvagem.json";
import aventurasEspaciais from "./movies/aventuras-espaciais.json";
import sangueNeon from "./movies/sangue-neon.json";
import casamentoMaluco from "./movies/casamento-maluco.json";
import noitesProibidas from "./movies/noites-proibidas.json";
import sonhosBroadway from "./movies/sonhos-broadway.json";
import segredosOceano from "./movies/segredos-oceano.json";
import robosAmigos from "./movies/robos-amigos.json";
import meiaNoiteUnderground from "./movies/meia-noite-underground.json";
import gospelEsperanca from "./movies/gospel-esperanca.json";
import mundoMagico from "./movies/mundo-magico.json";
import codigoDivino from "./movies/codigo-divino.json";
import senhorAneis from "./movies/senhor-aneis.json";
import cinquentaTons from "./movies/cinquenta-tons.json";
import sagaVampiros from "./movies/saga-vampiros.json";
import cavaleiroTrevas from "./movies/cavaleiro-trevas.json";
import homemAranha from "./movies/homem-aranha.json";
import xmenEvolucao from "./movies/x-men-evolucao.json";
import mulherMaravilha from "./movies/mulher-maravilha.json";
import mortosVivos from "./movies/mortos-vivos.json";

// Função para gerar cenas expandidas
const generateExpandedScenes = async (baseScenes: any[], movieTitle: string) => {
  const expandedScenes = [];
  
  // Garantir pelo menos 15 cenas
  for (let i = 0; i < Math.max(15, baseScenes.length); i++) {
    const baseScene = baseScenes[i % baseScenes.length];
    const sceneNumber = i + 1;
    
    const imageUrl = await PollinationsService.generateSceneImage(baseScene.visualDescription);
    
    expandedScenes.push({
      id: `${baseScene.id}-${sceneNumber}`,
      prompt: baseScene.prompt,
      imageUrl: imageUrl,
      audioUrl: "",
      duration: 15,
      text: baseScene.text,
      visualDescription: baseScene.visualDescription
    });
  }
  
  return expandedScenes;
};

// Função para transformar dados do catálogo para o formato Movie
const transformCatalogMovie = (catalogMovie: any): Movie => {
  return {
    ...catalogMovie,
    scenes: catalogMovie.scenes.map((scene: any) => ({
      ...scene,
      visualDescription: scene.prompt || scene.text || "" // Usar prompt como visualDescription
    }))
  };
};

// Filmes com arquivos JSON existentes
const RAW_FEATURED_MOVIES = [
  ladroesMemoria,
  cacadoresTesouro,
  cidadeEspelhos,
  imperioPerdido,
  noiteEterna,
  oceanoInfinito,
  reinoSombras,
  ultimoSamurai,
  guerreirosTempo,
  planetaVermelho,
  sombrasDigitais,
  vingancaCyber,
  portalDimensao,
  assassinoRobos,
  herdeiroRragao,
  pesadeloRealidade,
  amorTempo,
  detectiveFantasma,
  comediaExtraterrestre,
  escolaMagica,
  amazoniaSelvagem,
  aventurasEspaciais,
  sangueNeon,
  casamentoMaluco,
  noitesProibidas,
  sonhosBroadway,
  segredosOceano,
  robosAmigos,
  meiaNoiteUnderground,
  gospelEsperanca,
  mundoMagico,
  codigoDivino,
  senhorAneis,
  cinquentaTons,
  sagaVampiros,
  cavaleiroTrevas,
  homemAranha,
  xmenEvolucao,
  mulherMaravilha,
  mortosVivos
];

export const FEATURED_MOVIES: Movie[] = RAW_FEATURED_MOVIES.map(transformCatalogMovie);

export const FEATURED_MOVIES_COMPLETE = FEATURED_MOVIES;

export const getFeaturedMovies = async (): Promise<Movie[]> => {
  return FEATURED_MOVIES;
};