export type AspectRatio = '9:16' | '16:9' | '1:1';

export type PromptCategory =
  | 'All'
  | 'AMOLED Dark'
  | 'Cyberpunk & Neon'
  | 'Anime & Ghibli'
  | 'Spiritual & Epic'
  | 'Nature & Landscapes'
  | 'Sci-Fi & Cosmic'
  | 'Abstract & 3D Fluid'
  | 'Luxury Marble & Gold'
  | 'Supercars & Speed'
  | 'Majestic Creatures';

export interface WallpaperPrompt {
  id: string;
  title: string;
  titleHi: string;
  category: Exclude<PromptCategory, 'All'>;
  aspectRatio: AspectRatio;
  prompt: string;
  negativePrompt: string;
  hindiDescription: string;
  englishDescription: string;
  tags: string[];
  previewUrl: string; // High quality aesthetic preview
  cameraDetails?: string;
  lightingDetails?: string;
}

export interface GeneratedPromptResult {
  title: string;
  titleHindi: string;
  category: string;
  masterPrompt: string;
  variations: {
    name: string;
    prompt: string;
  }[];
  hindiExplanation: string;
  englishExplanation: string;
  recommendedAspectRatio: string;
  negativePrompt: string;
  styleKeywords: string[];
}
