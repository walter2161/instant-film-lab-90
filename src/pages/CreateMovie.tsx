import { useState } from "react";
import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { MovieService } from "@/services/movieService";
import { CreateMovieRequest } from "@/types/movie";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Sparkles, Film, Clock, Palette, Wand2, Monitor } from "lucide-react";

const GENRES = [
  "Terror", "Romance", "Ação", "Comédia", "Drama", "Ficção Científica",
  "Fantasia", "Mistério", "Aventura", "Documentário", "Musical", "Animação"
];

const STYLES = [
  "Realista", "Anime", "Cartoon", "Pixar", "Tim Burton", "Cyberpunk",
  "Steampunk", "Era Vitoriana", "Futurista", "Vintage", "Noir", "Minimalista"
];

const DURATIONS = [
  "15 min", "30 min", "45 min", "60 min"
];

export const CreateMovie = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<CreateMovieRequest>({
    genre: "",
    style: "",
    duration: "",
    customPrompt: "",
    aspectRatio: "9:16"
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.genre || !formData.style || !formData.duration || !formData.aspectRatio) {
      toast.error("Por favor, preencha todos os campos obrigatórios.");
      return;
    }

    setIsLoading(true);
    
    try {
      toast.info("Criando seu filme... Isso pode levar alguns minutos.");
      
      const movie = await MovieService.createMovie(formData);
      MovieService.saveMovie(movie);
      
      toast.success("Filme criado com sucesso!");
      navigate(`/player/${movie.id}`);
    } catch (error) {
      console.error("Erro ao criar filme:", error);
      toast.error("Erro ao criar filme. Tente novamente.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-3 mb-4">
              <Wand2 className="w-8 h-8 text-primary" />
              <h1 className="text-4xl font-bold bg-gradient-primary bg-clip-text text-transparent">
                Criar Filme com IA
              </h1>
            </div>
            <p className="text-muted-foreground text-lg">
              Configure as opções abaixo e nossa IA criará um filme único para você
            </p>
          </div>

          {/* Form */}
          <Card className="bg-gradient-card border-border/50 shadow-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Film className="w-5 h-5 text-primary" />
                Configurações do Filme
              </CardTitle>
              <CardDescription>
                Escolha o gênero, estilo e duração do seu filme personalizado
              </CardDescription>
            </CardHeader>
            
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Genre */}
                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-primary" />
                    Gênero *
                  </Label>
                  <Select
                    value={formData.genre}
                    onValueChange={(value) => setFormData(prev => ({ ...prev, genre: value }))}
                  >
                    <SelectTrigger className="bg-secondary border-border">
                      <SelectValue placeholder="Selecione o gênero do filme" />
                    </SelectTrigger>
                    <SelectContent>
                      {GENRES.map((genre) => (
                        <SelectItem key={genre} value={genre}>
                          {genre}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Style */}
                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <Palette className="w-4 h-4 text-primary" />
                    Estilo Visual *
                  </Label>
                  <Select
                    value={formData.style}
                    onValueChange={(value) => setFormData(prev => ({ ...prev, style: value }))}
                  >
                    <SelectTrigger className="bg-secondary border-border">
                      <SelectValue placeholder="Selecione o estilo visual" />
                    </SelectTrigger>
                    <SelectContent>
                      {STYLES.map((style) => (
                        <SelectItem key={style} value={style}>
                          {style}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Duration */}
                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-primary" />
                    Duração *
                  </Label>
                  <Select
                    value={formData.duration}
                    onValueChange={(value) => setFormData(prev => ({ ...prev, duration: value }))}
                  >
                    <SelectTrigger className="bg-secondary border-border">
                      <SelectValue placeholder="Selecione a duração do filme" />
                    </SelectTrigger>
                    <SelectContent>
                      {DURATIONS.map((duration) => (
                        <SelectItem key={duration} value={duration}>
                          {duration}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Aspect Ratio */}
                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <Monitor className="w-4 h-4 text-primary" />
                    Formato da Tela *
                  </Label>
                  <Select
                    value={formData.aspectRatio}
                    onValueChange={(value: '16:9' | '9:16') => setFormData(prev => ({ ...prev, aspectRatio: value }))}
                  >
                    <SelectTrigger className="bg-secondary border-border">
                      <SelectValue placeholder="Selecione o formato da tela" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="16:9">16:9 (Paisagem)</SelectItem>
                      <SelectItem value="9:16">9:16 (Retrato)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Custom Prompt */}
                <div className="space-y-2">
                  <Label>Prompt Personalizado (Opcional)</Label>
                  <Textarea
                    placeholder="Descreva elementos específicos que você gostaria no seu filme..."
                    value={formData.customPrompt}
                    onChange={(e) => setFormData(prev => ({ ...prev, customPrompt: e.target.value }))}
                    className="bg-secondary border-border min-h-[100px] resize-none"
                  />
                </div>

                {/* Submit Button */}
                <Button 
                  type="submit" 
                  variant="cinema" 
                  size="lg" 
                  className="w-full gap-3 shadow-intense"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Criando Filme...
                    </>
                  ) : (
                    <>
                      <Wand2 className="w-5 h-5" />
                      Criar Filme com IA
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Info Cards */}
          <div className="grid md:grid-cols-3 gap-4 mt-8">
            <Card className="bg-gradient-glass border-primary/20">
              <CardContent className="p-4 text-center">
                <Sparkles className="w-8 h-8 text-primary mx-auto mb-2" />
                <h3 className="font-semibold mb-1">IA Avançada</h3>
                <p className="text-sm text-muted-foreground">
                  Roteiros únicos gerados por IA
                </p>
              </CardContent>
            </Card>
            
            <Card className="bg-gradient-glass border-primary/20">
              <CardContent className="p-4 text-center">
                <Film className="w-8 h-8 text-primary mx-auto mb-2" />
                <h3 className="font-semibold mb-1">Filmes Únicos</h3>
                <p className="text-sm text-muted-foreground">
                  Cada filme é completamente original
                </p>
              </CardContent>
            </Card>
            
            <Card className="bg-gradient-glass border-primary/20">
              <CardContent className="p-4 text-center">
                <Clock className="w-8 h-8 text-primary mx-auto mb-2" />
                <h3 className="font-semibold mb-1">Rápida Criação</h3>
                <p className="text-sm text-muted-foreground">
                  Filmes prontos em poucos minutos
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
};