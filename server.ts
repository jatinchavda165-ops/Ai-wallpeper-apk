import express, { Request, Response } from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const isProd = process.env.NODE_ENV === 'production';
const PORT = process.env.PORT || 3000;

// Initialize Google Gen AI client server-side
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

async function startServer() {
  const app = express();
  app.use(express.json({ limit: '10mb' }));

  // API 1: Generate or Enhance Wallpaper Prompt using gemini-3.8-flash
  app.post('/api/generate-prompt', async (req: Request, res: Response) => {
    try {
      const { userIdea, style, targetDevice, language } = req.body;

      if (!userIdea || typeof userIdea !== 'string') {
        return res.status(400).json({ error: 'Please provide a wallpaper idea or keyword.' });
      }

      const promptSystemInstruction = `You are a world-class AI Image Prompt Engineer specializing in high-resolution, viral wallpapers for smartphones (AMOLED/iPhone/Android, 9:16) and desktop monitors (16:9 4K/8K).
Your task is to take the user's idea (which may be in English, Hindi, or Hinglish) and craft a master prompt suitable for modern AI generators (Midjourney v6, Stable Diffusion XL, DALL-E 3, Imagen 3).

Return ONLY valid JSON with this exact schema:
{
  "title": "Short catchy title in English (3-5 words)",
  "titleHindi": "Short title in Hindi/Hinglish",
  "category": "One of: AMOLED Dark, Cyberpunk & Neon, Anime & Ghibli, Nature & Landscapes, Spiritual & Mythological, Sci-Fi & Cosmic, Abstract Fluid, Luxury Marble/Gold, Supercars & Speed, Minimalist 3D",
  "masterPrompt": "The primary, highly detailed prompt in English with camera lens, lighting, render engine, resolution, aspect ratio tag",
  "variations": [
    {
      "name": "Variation 1 (e.g. Ultra-Realistic 8K)",
      "prompt": "Full detailed prompt string with aspect ratio"
    },
    {
      "name": "Variation 2 (e.g. AMOLED Dark Minimalist)",
      "prompt": "Full detailed prompt string with deep blacks and vivid glowing accents"
    },
    {
      "name": "Variation 3 (e.g. Dreamy / Cinematic Glow)",
      "prompt": "Full detailed prompt string with atmospheric volumetric lighting"
    }
  ],
  "hindiExplanation": "2-3 sentences in easy conversational Hindi explaining what visual elements this prompt creates and why it looks great as a wallpaper",
  "englishExplanation": "2-3 sentences in English explaining the composition and style",
  "recommendedAspectRatio": "9:16 or 16:9",
  "negativePrompt": "blurry, low resolution, watermark, signature, ugly, text, cropped, bad anatomy, noisy, artifact",
  "styleKeywords": ["3 to 5 style tags like 'Octane Render', 'Unreal Engine 5', '8k UHD', 'Ray Tracing']
}`;

      const userMessage = `User Idea: "${userIdea}"
Selected Preferred Style: "${style || 'Cinematic Photorealistic'}"
Target Device: "${targetDevice || 'Mobile (9:16)'}"
Preferred Explanation Language: "${language || 'Hindi & English'}"

Generate the ultimate wallpaper prompt package for this concept.`;

      let parsed;
      if (process.env.GEMINI_API_KEY) {
        try {
          const response = await ai.models.generateContent({
            model: 'gemini-3.8-flash',
            contents: userMessage,
            config: {
              systemInstruction: promptSystemInstruction,
              responseMimeType: 'application/json',
            },
          });

          const responseText = response.text;
          if (responseText) {
            parsed = JSON.parse(responseText.trim());
          }
        } catch (apiErr) {
          console.warn('Gemini API call warning, falling back to smart prompt synthesis:', apiErr);
        }
      }

      if (!parsed) {
        // High quality fallback prompt generator
        const ratioTag = targetDevice?.includes('16:9') ? '--ar 16:9' : '--ar 9:16';
        parsed = {
          title: `${userIdea.slice(0, 30)} 4K Master`,
          titleHindi: `${userIdea.slice(0, 30)} 4K मास्टर वॉलपेपर`,
          category: style?.includes('AMOLED') ? 'AMOLED Dark' : 'Spiritual & Epic',
          masterPrompt: `${userIdea}, ${style || 'cinematic photorealistic 8k'}, volumetric lighting, octane render, ray tracing, ultra detailed, wallpaper framing ${ratioTag}`,
          variations: [
            {
              name: 'Cinematic 8K Ultra-Realism',
              prompt: `Cinematic wide shot of ${userIdea}, dramatic god rays, highly detailed, Unreal Engine 5 render, 8k resolution ${ratioTag}`,
            },
            {
              name: 'AMOLED 100% True Black Minimalist',
              prompt: `Minimalist ${userIdea} in pure pitch black #000000 void background, vivid neon edge lighting, sleek AMOLED wallpaper ${ratioTag}`,
            },
            {
              name: 'Dreamy Ethereal Glow',
              prompt: `Magical ethereal atmosphere with ${userIdea}, floating glowing dust particles, soft bokeh, pastel gradient tones ${ratioTag}`,
            },
          ],
          hindiExplanation: `यह प्रॉम्प्ट "${userIdea}" को हाई डेफिनिशन में कस्टमाइज करता है। इसमें वोलोमेट्रिक लाइटिंग और 8K रेजोल्यूशन टैग जोड़े गए हैं जिससे मोबाइल स्क्रीन पर पिक्चर एकदम शार्प और वाइब्रेंट दिखेगी।`,
          englishExplanation: `A tailored master wallpaper prompt crafted for "${userIdea}" with fine volumetric lighting, ray tracing, and clean mobile screen composition.`,
          recommendedAspectRatio: ratioTag.replace('--ar ', ''),
          negativePrompt: 'blurry, noisy, low resolution, watermark, text, signature, cropped, bad anatomy',
          styleKeywords: ['8k UHD', 'Octane Render', 'Unreal Engine 5', 'Ray Tracing'],
        };
      }

      return res.json(parsed);
    } catch (err: unknown) {
      console.error('Error in generate-prompt endpoint:', err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to generate prompt';
      return res.status(500).json({ error: errorMessage });
    }
  });

  // API 2: Generate Actual Wallpaper using Gemini Image Generation
  app.post('/api/generate-wallpaper', async (req: Request, res: Response) => {
    try {
      const { prompt, aspectRatio = '9:16' } = req.body;

      if (!prompt || typeof prompt !== 'string') {
        return res.status(400).json({ error: 'Valid prompt is required.' });
      }

      // Valid aspect ratios supported: "1:1", "3:4", "4:3", "9:16", "16:9"
      const validAspectRatios = ['1:1', '3:4', '4:3', '9:16', '16:9'];
      const finalAspectRatio = validAspectRatios.includes(aspectRatio) ? aspectRatio : '9:16';

      // Enhance prompt with wallpaper framing if needed
      const enrichedPrompt = `Stunning high resolution wallpaper, ultra-detailed, centered vertical composition, beautiful lighting: ${prompt}`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.1-flash-lite-image',
        contents: {
          parts: [
            {
              text: enrichedPrompt,
            },
          ],
        },
        config: {
          imageConfig: {
            aspectRatio: finalAspectRatio as '1:1' | '3:4' | '4:3' | '9:16' | '16:9',
          },
        },
      });

      let imageUrl: string | null = null;
      for (const part of response.candidates?.[0]?.content?.parts ?? []) {
        if (part.inlineData?.data) {
          const mime = part.inlineData.mimeType ?? 'image/png';
          imageUrl = `data:${mime};base64,${part.inlineData.data}`;
          break;
        }
      }

      if (!imageUrl) {
        return res.status(500).json({
          error: 'Image generation did not return an image part. Please try another prompt.',
        });
      }

      return res.json({ imageUrl, prompt, aspectRatio: finalAspectRatio });
    } catch (err: unknown) {
      console.error('Error generating wallpaper image:', err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to generate wallpaper image';
      return res.status(500).json({ error: errorMessage });
    }
  });

  // Setup Vite in Dev or Serve Static in Prod
  if (!isProd) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT} (isProd: ${isProd})`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
