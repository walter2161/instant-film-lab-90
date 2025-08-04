export interface CharacterPersona {
  name: string;
  description: string;
  voice: string;
  appearance: {
    face: string;
    body: string;
    clothing: string;
    age: string;
    ethnicity: string;
    hair: string;
    eyes: string;
    build: string;
  };
  visualPrompt: string; // Prompt completo para usar em todas as cenas
}

export interface Character {
  name: string;
  description: string;
  voice: string;
  persona?: CharacterPersona;
}