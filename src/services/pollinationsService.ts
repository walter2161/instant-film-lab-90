export class PollinationsService {
  private static readonly BASE_URL = 'https://image.pollinations.ai/prompt';
  
  static async generateImage(prompt: string, width: number = 1024, height: number = 576): Promise<string> {
    try {
      // Garantir que o prompt está em português e bem detalhado
      const enhancedPrompt = `${prompt}, cinematográfico, alta qualidade, iluminação profissional, composição dramática, estilo Netflix, 4K`;
      
      // Encodar o prompt para URL
      const encodedPrompt = encodeURIComponent(enhancedPrompt);
      
      // Construir URL da API Pollinations
      const imageUrl = `${this.BASE_URL}/${encodedPrompt}?width=${width}&height=${height}&seed=${Math.floor(Math.random() * 1000000)}`;
      
      // Testar se a imagem carrega
      const response = await fetch(imageUrl, { method: 'HEAD' });
      if (response.ok) {
        return imageUrl;
      } else {
        console.warn('Erro ao gerar imagem via Pollinations:', response.status);
        return "/placeholder.svg";
      }
    } catch (error) {
      console.error('Erro ao gerar imagem via Pollinations:', error);
      return "/placeholder.svg";
    }
  }

  static async generateMoviePoster(title: string, genre: string, style: string): Promise<string> {
    const posterPrompt = `Cartaz de filme para "${title}", gênero ${genre}, estilo ${style}, cartaz cinematográfico profissional, design dramático, tipografia elegante, composição vertical`;
    return this.generateImage(posterPrompt, 768, 1366); // 9:16 aspect ratio
  }

  static async generateSceneImage(sceneDescription: string): Promise<string> {
    const scenePrompt = `Cena cinematográfica: ${sceneDescription}, qualidade de produção Netflix, iluminação cinematográfica, composição profissional`;
    return this.generateImage(scenePrompt, 1920, 1080); // 16:9 aspect ratio
  }
}