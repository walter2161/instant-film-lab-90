import { Movie, CreateMovieRequest, MovieScene, MovieFrame } from "@/types/movie";
import { CharacterPersona } from "@/types/character";

const MISTRAL_API_KEY = "aynCSftAcQBOlxmtmpJqVzco8K4aaTDQ";
const MISTRAL_API_URL = "https://api.mistral.ai/v1/chat/completions";

export class MovieService {
  static async createMovie(request: CreateMovieRequest): Promise<Movie> {
    try {
      // 1. Gerar roteiro com Mistral
      const script = await this.generateScript(request);
      
      // 2. Gerar cenas com imagens e áudio
      const scenes = await this.generateScenes(script.scenes, request.aspectRatio, request.genre, request.style);
      
      // 3. Gerar thumbnail personalizada se especificada
      let thumbnailUrl = scenes[0]?.frames[0]?.imageUrl;
      if (request.thumbnailDescription) {
        const themePrefix = this.getThemePrefix(request.genre, request.style);
        const thumbnailPrompt = `${themePrefix} ${request.thumbnailDescription}, cartaz de filme, poster cinematográfico, alta qualidade`;
        const encodedThumbnailPrompt = encodeURIComponent(thumbnailPrompt);
        thumbnailUrl = `https://pollinations.ai/p/${encodedThumbnailPrompt}?width=768&height=1366&model=flux&enhance=true&nologo=true`;
      }
      
      // 4. Criar objeto do filme
      const movie: Movie = {
        id: crypto.randomUUID(),
        title: request.title || script.title,
        genre: request.genre,
        style: request.style,
        duration: request.duration,
        synopsis: script.synopsis,
        characters: script.characters,
        scenes,
        createdAt: new Date().toISOString(),
        thumbnail: thumbnailUrl,
        aspectRatio: request.aspectRatio,
        type: 'movie',
        soundtrack: this.generateSoundtrack(request.genre, request.style)
      };
      
      return movie;
    } catch (error) {
      console.error("Erro ao criar filme:", error);
      throw new Error("Falha ao criar filme. Tente novamente.");
    }
  }
  
  private static async generateScript(request: CreateMovieRequest) {
    // Calcular número de cenas - cada cena tem 12 segundos (24 frames / 2 fps)
    const durationInSeconds = this.parseDurationToSeconds(request.duration);
    const numberOfScenes = Math.max(15, Math.floor(durationInSeconds / 12)); // Mínimo 15 cenas, 12 segundos por cena
    
    const prompt = `Você é um roteirista especialista da Netflix. Crie um roteiro cinematográfico de alta qualidade para um ${request.genre} no estilo ${request.style} com duração de ${request.duration}.
    ${request.customPrompt ? `Tema específico: ${request.customPrompt}` : ''}
    
    ESTRUTURA OBRIGATÓRIA DE 3 ATOS:
    - ATO 1 (Apresentação - primeiros 25% das cenas): Estabeleça o mundo, personagens, conflito inicial e incidente incitante
    - ATO 2 (Confronto - 50% das cenas): Desenvolva conflitos, obstáculos crescentes, desenvolvimento de personagens e clímax do meio
    - ATO 3 (Resolução - últimos 25% das cenas): Clímax final, resolução de conflitos e conclusão satisfatória
    
    CRITÉRIOS DE QUALIDADE NETFLIX:
    - Narrativa envolvente com arcos dramáticos bem definidos seguindo os 3 atos
    - Diálogos naturais e cativantes entre personagens
    - Progressão clara da história com tensão crescente em cada ato
    - Personagens complexos e bem desenvolvidos ao longo dos atos
    - Cada cena deve avançar a trama de forma significativa
    - ZERO repetição de situações, diálogos ou descrições visuais
    - Variação constante de cenários, emoções e tipos de cena
    
    Retorne um JSON com:
    {
      "title": "Título cinematográfico impactante",
      "synopsis": "Sinopse envolvente em 3-4 frases que captura a essência da história",
      "characters": [
        {
          "name": "Nome único e memorável",
          "description": "Personalidade complexa com motivações claras",
          "voice": "alloy",
          "persona": {
            "name": "Nome",
            "description": "Background detalhado, objetivos, conflitos internos",
            "voice": "alloy",
            "appearance": {
              "face": "Traços faciais únicos e expressivos",
              "body": "Físico que reflete a personalidade",
              "clothing": "Vestuário que conta a história do personagem",
              "age": "Idade específica",
              "ethnicity": "Origem étnica diversificada",
              "hair": "Cabelo que define o visual",
              "eyes": "Olhos expressivos e únicos",
              "build": "Estrutura física detalhada"
            },
            "visualPrompt": "Descrição visual cinematográfica completa para manter absoluta consistência visual em todas as cenas"
          }
        }
      ],
      "scenes": [
        {
          "text": "Diálogo natural e envolvente OU narração cinematográfica que avança a história (cada cena deve ser ÚNICA e específica)",
          "visualDescription": "Composição visual cinematográfica detalhada - ângulo de câmera, iluminação, atmosfera, cenário específico, ações dos personagens (SEM repetições)",
          "duration": 12,
          "characters": ["personagens específicos na cena"]
        }
      ]
    }
    
    EXIGÊNCIAS CRÍTICAS PARA ESTRUTURA DE 3 ATOS:
    - Gere EXATAMENTE ${numberOfScenes} cenas ÚNICAS divididas em 3 atos:
      * ATO 1: ${Math.floor(numberOfScenes * 0.25)} cenas (apresentação do mundo e conflito)
      * ATO 2: ${Math.floor(numberOfScenes * 0.5)} cenas (desenvolvimento e confrontos)
      * ATO 3: ${numberOfScenes - Math.floor(numberOfScenes * 0.25) - Math.floor(numberOfScenes * 0.5)} cenas (clímax e resolução)
    - CADA cena deve ter texto e visual COMPLETAMENTE diferentes
    - CADA cena terá 24 frames com 2 fps (12 segundos por cena)
    - Progressão narrativa clara seguindo a estrutura de 3 atos
    - Inclua diálogos realistas entre personagens quando apropriado
    - Varie tipos de cena: apresentação, conflito, desenvolvimento, ação, suspense, revelação, clímax, resolução
    - Use os visualPrompts dos personagens nas descrições visuais
    - NUNCA repita textos, situações ou descrições visuais
    - Foque na qualidade cinematográfica de cada momento
    - Português brasileiro autêntico e natural
    - Cada ato deve ter ritmo e propósito narrativo distintos`;

    const response = await fetch(MISTRAL_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${MISTRAL_API_KEY}`
      },
      body: JSON.stringify({
        model: "mistral-large-latest",
        messages: [{
          role: "user",
          content: prompt
        }],
        temperature: 0.7
      })
    });

    if (!response.ok) {
      throw new Error("Falha ao gerar roteiro");
    }

    const data = await response.json();
    let content = data.choices[0].message.content;
    
    // Limpar formatação markdown e caracteres especiais
    content = content.replace(/\*\*/g, '').replace(/\*/g, '').replace(/```json/g, '').replace(/```/g, '');
    
    // Extrair JSON do response
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error("Formato de resposta inválido");
    }
    
    let jsonString = jsonMatch[0];
    // Limpar caracteres problemáticos e quebras de linha mal formadas
    jsonString = jsonString
      .replace(/[\u0000-\u001F\u007F-\u009F]/g, '')
      .replace(/,(\s*[}\]])/g, '$1') // Remove vírgulas extras antes de } ou ]
      .replace(/([}\]])(\s*)([^,}\]\s])/g, '$1,$2$3') // Adiciona vírgulas faltantes
      .trim();
    
    try {
      return JSON.parse(jsonString);
    } catch (parseError) {
      console.error("Erro ao parsear JSON:", parseError);
      console.error("JSON string:", jsonString);
      throw new Error("Formato de resposta JSON inválido");
    }
  }
  
  private static async generateScenes(scriptScenes: any[], aspectRatio: '16:9' | '9:16' = '16:9', genre?: string, style?: string): Promise<MovieScene[]> {
    const scenes: MovieScene[] = [];
    const themePrefix = this.getThemePrefix(genre || '', style || '');
    
    // Definir dimensões baseadas no aspect ratio
    const dimensions = aspectRatio === '16:9' 
      ? { width: 320, height: 240 }
      : { width: 240, height: 320 };
    
    for (let i = 0; i < scriptScenes.length; i++) {
      const scriptScene = scriptScenes[i];
      
      try {
        // Gerar 24 frames usando o agente cineasta
        const framePrompts = await this.generateCinematicFramePrompts(
          scriptScene.visualDescription || scriptScene.prompt,
          themePrefix
        );
        
        const frames: MovieFrame[] = [];
        
        // Gerar cada frame
        for (let frameIndex = 0; frameIndex < 24; frameIndex++) {
          const framePrompt = framePrompts[frameIndex] || framePrompts[framePrompts.length - 1];
          const enhancedPrompt = `${themePrefix} ${framePrompt}, cinematic composition, high quality, detailed, professional cinematography, movie frame`;
          const encodedPrompt = encodeURIComponent(enhancedPrompt);
          
          const imageUrl = `https://image.pollinations.ai/prompt/${encodedPrompt}?width=${dimensions.width}&height=${dimensions.height}&nologo=true&seed=${Math.floor(Math.random() * 1000000)}`;
          
          frames.push({
            id: crypto.randomUUID(),
            prompt: framePrompt,
            imageUrl,
            frameNumber: frameIndex + 1
          });
        }
        
        scenes.push({
          id: crypto.randomUUID(),
          prompt: scriptScene.visualDescription || scriptScene.prompt,
          frames,
          audioUrl: "", // Vazio para usar narração sintética
          duration: 12, // 24 frames / 2 fps = 12 segundos
          text: scriptScene.text,
          visualDescription: scriptScene.visualDescription || scriptScene.prompt,
          fps: 2
        });
        
      } catch (error) {
        console.error(`Erro ao gerar cena ${i + 1}:`, error);
        // Fallback: gerar frames simples sem agente cineasta
        const frames: MovieFrame[] = [];
        const fallbackPrompt = `${themePrefix} ${scriptScene.visualDescription || scriptScene.prompt}`;
        
        for (let frameIndex = 0; frameIndex < 24; frameIndex++) {
          const encodedPrompt = encodeURIComponent(fallbackPrompt);
          const imageUrl = `https://image.pollinations.ai/prompt/${encodedPrompt}?width=${dimensions.width}&height=${dimensions.height}&seed=${Math.floor(Math.random() * 10000)}&nologo=true`;
          
          frames.push({
            id: crypto.randomUUID(),
            prompt: fallbackPrompt,
            imageUrl,
            frameNumber: frameIndex + 1
          });
        }
        
        scenes.push({
          id: crypto.randomUUID(),
          prompt: scriptScene.visualDescription || scriptScene.prompt,
          frames,
          audioUrl: "",
          duration: 12,
          text: scriptScene.text,
          visualDescription: scriptScene.visualDescription || scriptScene.prompt,
          fps: 2
        });
      }
    }
    
    return scenes;
  }

  // Agente Cineasta para gerar prompts de frames com continuidade
  private static async generateCinematicFramePrompts(sceneDescription: string, themePrefix: string): Promise<string[]> {
    const systemPrompt = `
Você é um cineasta AI especialista em continuidade e direção de cena.

Sua tarefa: dado uma descrição de cena, gerar 24 descrições de frames numerados de 1 a 24 com continuidade visual.

🔹 Regras de composição:
- O cenário deve ser sempre descrito (ambiente, clima, hora do dia, cores dominantes).
- Os objetos devem ser posicionados em um **grid imaginário** de 16 colunas (A–P) por 9 linhas (1–9).  
   Exemplo de quadrantes: A1 (canto superior esquerdo), H5 (meio da tela), P9 (canto inferior direito).
- Cada frame deve mencionar em quais quadrantes os objetos principais estão ou se movem.
- Caso um objeto cubra mais de um quadrante, indicar a faixa (ex: "ocupando de G4 a I6").
- O movimento deve ser descrito como transição entre quadrantes de um frame para outro.
- A câmera também deve ser descrita: ângulo, altura, movimento (pan, tilt, dolly, zoom), e qual quadrante centraliza.
- A iluminação deve ser coerente com o ambiente e evoluir suavemente (ex: nascer do sol → manhã clara → entardecer).
- Deve haver **continuidade visual e narrativa**: os objetos e cenários não podem mudar de forma abrupta, apenas evoluir.
- Se houver personagens, eles devem manter roupas, posição relativa e coerência de ações.
- SEMPRE incluir o tema "${themePrefix}" no início de cada descrição.

Formato de saída:
- Lista numerada simples, cada linha um prompt no seguinte formato:
"Frame [n]: ${themePrefix} [descrição detalhada do cenário, iluminação, objetos com quadrantes, posição da câmera]."

Exemplo:
Frame 1: ${themePrefix} Uma estrada ao amanhecer, céu laranja suave. Um carro vermelho aparece no quadrante G6. A câmera está em H4, em leve movimento dolly-in. Luz difusa do sol nascente no horizonte.
Frame 2: ${themePrefix} O carro vermelho se move de G6 para H6. A câmera acompanha em travelling lateral entre F4 e H4. O fundo mantém a estrada e árvores estáveis, luz aumentando.
`;

    const userPrompt = `Gere 24 frames cinematográficos com continuidade para esta cena: ${sceneDescription}`;

    try {
      const response = await fetch(MISTRAL_API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${MISTRAL_API_KEY}`
        },
        body: JSON.stringify({
          model: "mistral-small-latest",
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: userPrompt }
          ],
          temperature: 0.7
        })
      });

      if (!response.ok) {
        throw new Error("Falha ao gerar prompts de frames");
      }

      const data = await response.json();
      const content = data.choices[0].message.content;

      // Extrair prompts numerados
      const framePrompts = content.split(/\n+/)
        .map((line: string) => line.replace(/^Frame \d+:\s*/, "").trim())
        .filter((line: string) => line.length > 0)
        .slice(0, 24);

      // Garantir que temos 24 frames
      while (framePrompts.length < 24) {
        framePrompts.push(framePrompts[framePrompts.length - 1] || `${themePrefix} ${sceneDescription}`);
      }

      return framePrompts;
    } catch (error) {
      console.error("Erro ao gerar prompts cinematográficos:", error);
      // Fallback: repetir a descrição da cena com variações mínimas
      const fallbackPrompts: string[] = [];
      for (let i = 0; i < 24; i++) {
        fallbackPrompts.push(`${themePrefix} ${sceneDescription}, frame ${i + 1} de 24`);
      }
      return fallbackPrompts;
    }
  }
  
  static saveMovie(movie: Movie) {
    const savedMovies = this.getSavedMovies();
    savedMovies.push(movie);
    localStorage.setItem("ledtv_movies", JSON.stringify(savedMovies));
  }
  
  static getSavedMovies(): Movie[] {
    const saved = localStorage.getItem("ledtv_movies");
    return saved ? JSON.parse(saved) : [];
  }

  static getAllMovies(): Movie[] {
    // Combina filmes salvos com filmes em destaque (incluindo os do Oscar)
    const savedMovies = this.getSavedMovies();
    const { FEATURED_MOVIES_COMPLETE } = require("@/data/featuredContent");
    
    // Remove duplicatas baseado no ID
    const allMovies = [...FEATURED_MOVIES_COMPLETE, ...savedMovies];
    const uniqueMovies = allMovies.filter((movie, index, array) => 
      array.findIndex(m => m.id === movie.id) === index
    );
    
    return uniqueMovies;
  }
  
  static deleteMovie(movieId: string) {
    const savedMovies = this.getSavedMovies();
    const filtered = savedMovies.filter(movie => movie.id !== movieId);
    localStorage.setItem("ledtv_movies", JSON.stringify(filtered));
  }

  private static generateSoundtrack(genre: string, style: string): string {
    // Gerar trilha sonora baseada no gênero e estilo
    const soundtracks = {
      'Ação': "https://www.soundjay.com/misc/sounds/action-epic-theme.mp3",
      'Drama': "https://www.soundjay.com/misc/sounds/emotional-drama-theme.mp3", 
      'Comédia': "https://www.soundjay.com/misc/sounds/upbeat-comedy-theme.mp3",
      'Terror': "https://www.soundjay.com/misc/sounds/horror-suspense-theme.mp3",
      'Romance': "https://www.soundjay.com/misc/sounds/romantic-orchestral.mp3",
      'Ficção Científica': "https://www.soundjay.com/misc/sounds/sci-fi-futuristic.mp3",
      'Fantasia': "https://www.soundjay.com/misc/sounds/magical-fantasy-theme.mp3",
      'Thriller': "https://www.soundjay.com/misc/sounds/tension-thriller-theme.mp3",
      'Aventura': "https://www.soundjay.com/misc/sounds/adventure-orchestral.mp3",
      'Mistério': "https://www.soundjay.com/misc/sounds/mysterious-ambient.mp3",
      'Musical': "https://www.soundjay.com/misc/sounds/broadway-musical-theme.mp3",
      'Documentário': "https://www.soundjay.com/misc/sounds/documentary-background.mp3"
    };
    
    return soundtracks[genre] || "https://www.soundjay.com/misc/sounds/cinematic-orchestral.mp3";
  }

  private static parseDurationToSeconds(duration: string): number {
    // Converter duração como "1 minuto", "30 segundos", "2 minutos" para segundos
    const minutes = duration.match(/(\d+)\s*minuto/i);
    const seconds = duration.match(/(\d+)\s*segundo/i);
    
    let totalSeconds = 0;
    if (minutes) totalSeconds += parseInt(minutes[1]) * 60;
    if (seconds) totalSeconds += parseInt(seconds[1]);
    
    // Se não conseguir parsear, usar 30 segundos como padrão
    return totalSeconds || 30;
  }

  private static getThemePrefix(genre: string, style: string): string {
    // Mapeamento de gêneros e estilos para temas visuais específicos
    const themeMap: { [key: string]: string } = {
      // Gêneros principais
      'Faroeste': 'faroeste',
      'Western': 'faroeste',
      'Cyberpunk': 'cyberpunk',
      'Animação': 'animação',
      'Animação 3D': 'animação 3d',
      'Desenho': 'desenho animado',
      'Romance': 'romance',
      'Terror': 'terror',
      'Horror': 'terror',
      'Aventura': 'aventura',
      'Ação': 'ação',
      'Ficção Científica': 'ficção científica',
      'Fantasia': 'fantasia',
      'Drama': 'drama',
      'Comédia': 'comédia',
      'Thriller': 'thriller',
      'Mistério': 'mistério',
      'Musical': 'musical',
      'Documentário': 'documentário',
      'Super-Herói': 'super-herói',
      'Cult': 'cult',
      
      // Estilos específicos
      'Cyberpunk Noir': 'cyberpunk noir',
      'Space Opera': 'space opera',
      'Épico Medieval': 'épico medieval',
      'Underground Experimental': 'underground experimental',
      'Teatro Musical': 'teatro musical',
      'Aventura Mitológica': 'aventura mitológica',
      'Aventura Mágica': 'aventura mágica',
      'Futurismo Infantil': 'futurismo infantil',
      'Vida Marinha': 'vida marinha',
      'Gospel Contemporâneo': 'gospel contemporâneo'
    };

    // Primeiro tenta pelo gênero, depois pelo estilo
    const theme = themeMap[genre] || themeMap[style] || genre.toLowerCase();
    
    return theme;
  }
}