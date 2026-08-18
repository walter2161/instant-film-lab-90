export class PollinationsService {
  private static readonly BASE_URL = 'https://image.pollinations.ai/prompt';
  
  static async generateImage(prompt: string, width: number = 1280, height: number = 720): Promise<string> {
    try {
      // Prompt aprimorado para qualidade cinematográfica superior
      const enhancedPrompt = `${prompt}, cinematic masterpiece, professional color grading, ultra-detailed, 8k resolution, photorealistic, cinematic lighting, movie still`;
      
      const encodedPrompt = encodeURIComponent(enhancedPrompt);
      const seed = Math.floor(Math.random() * 1000000);
      const imageUrl = `${this.BASE_URL}/${encodedPrompt}?width=${width}&height=${height}&seed=${seed}&model=flux&enhance=true&nologo=true`;
      
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