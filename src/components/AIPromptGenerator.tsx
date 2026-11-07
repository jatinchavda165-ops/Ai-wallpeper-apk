import React, { useState } from 'react';
import { Sparkles, Copy, Check, Smartphone, RefreshCw, Wand2, ArrowRight } from 'lucide-react';
import { GeneratedPromptResult, WallpaperPrompt } from '../types/wallpaper';

interface AIPromptGeneratorProps {
  onPreviewCustomPrompt: (prompt: WallpaperPrompt) => void;
  onGenerateImage: (promptText: string) => void;
}

const INSPIRATION_IDEAS = [
  { en: 'Lord Shiva in deep meditation in snowy Himalayas', hi: 'कैलाश पर्वत पर भगवान शिव की ध्यान मुद्रा' },
  { en: 'Futuristic cyberpunk cat in neon rain Neo-Tokyo', hi: 'बारिश में भीगी नियो-टोक्यो की साइबरपंक कैट' },
  { en: 'Matte black stealth Lamborghini in dark minimalist studio', hi: 'अमोलेड डार्क बैकग्राउंड में मैट ब्लैक लेम्बोर्गिनी' },
  { en: 'Ethereal glowing bioluminescent jellyfish floating in cosmos', hi: 'अंतरिक्ष के तारों में तैरती चमकती जेलीफ़िश' },
  { en: 'Dreamy pastel clouds with golden sunset castle anime', hi: 'गुलाबी बादलों में तैरता जादुई महल (एनीमे)' },
  { en: 'Royal emerald green marble with veins of 24k liquid gold', hi: 'पन्ना हरा मार्बल और पिघले हुए 24K सोने की नसें' },
];

export const AIPromptGenerator: React.FC<AIPromptGeneratorProps> = ({
  onPreviewCustomPrompt,
  onGenerateImage,
}) => {
  const [userIdea, setUserIdea] = useState('');
  const [selectedStyle, setSelectedStyle] = useState('Cinematic Photorealistic 8K');
  const [targetDevice, setTargetDevice] = useState<'Mobile (9:16)' | 'Desktop (16:9)' | 'Square (1:1)'>('Mobile (9:16)');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<GeneratedPromptResult | null>(null);
  const [copiedMaster, setCopiedMaster] = useState(false);
  const [copiedVarIndex, setCopiedVarIndex] = useState<number | null>(null);

  const handleGenerate = async (ideaOverride?: string) => {
    const inputIdea = (ideaOverride || userIdea).trim();
    if (!inputIdea) {
      setError('कृपया कोई विचार या कीवर्ड दर्ज करें (Please enter a wallpaper idea).');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/generate-prompt', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userIdea: inputIdea,
          style: selectedStyle,
          targetDevice,
          language: 'Hindi & English',
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to generate prompt');
      }

      const data: GeneratedPromptResult = await response.json();
      setResult(data);
    } catch (err: unknown) {
      console.error(err);
      setError(err instanceof Error ? err.message : 'Something went wrong while generating the prompt.');
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = (text: string, isMaster: boolean, index?: number) => {
    navigator.clipboard.writeText(text);
    if (isMaster) {
      setCopiedMaster(true);
      setTimeout(() => setCopiedMaster(false), 2000);
    } else if (index !== undefined) {
      setCopiedVarIndex(index);
      setTimeout(() => setCopiedVarIndex(null), 2000);
    }
  };

  const handlePreviewMaster = () => {
    if (!result) return;
    const promptItem: WallpaperPrompt = {
      id: `ai-gen-${Date.now()}`,
      title: result.title,
      titleHi: result.titleHindi,
      category: 'AMOLED Dark',
      aspectRatio: targetDevice.includes('16:9') ? '16:9' : '9:16',
      prompt: result.masterPrompt,
      negativePrompt: result.negativePrompt,
      hindiDescription: result.hindiExplanation,
      englishDescription: result.englishExplanation,
      tags: result.styleKeywords || ['AI Generated', 'Master Prompt'],
      previewUrl:
        'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1000&auto=format&fit=crop&q=80',
    };
    onPreviewCustomPrompt(promptItem);
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl">
      {/* Title & Badge */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold mb-2">
            <Wand2 className="w-3.5 h-3.5" />
            AI Prompt Engine (Powered by Gemini 3.8 Flash)
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            AI से मनचाहा वॉलपेपर प्रॉम्प्ट बनवाएं
          </h2>
          <p className="text-sm text-slate-400 mt-1">
            Write your idea in Hindi, Hinglish, or English. Gemini will generate professional 8K wallpaper prompts with camera lens, lighting, and aspect ratio tags.
          </p>
        </div>
      </div>

      {/* Input Form */}
      <div className="space-y-4">
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2">
            आपका विचार / Wallpaper Concept (Hindi or English)
          </label>
          <div className="relative">
            <textarea
              value={userIdea}
              onChange={(e) => setUserIdea(e.target.value)}
              placeholder="e.g. भगवान शिव कैलाश पर्वत पर ध्यान में, बादलों से आ रही सुनहरी किरणें / A lone astronaut floating in cosmic nebula near black hole"
              rows={3}
              className="w-full bg-slate-950 border border-slate-800 rounded-2xl p-4 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all resize-none"
            />
          </div>
        </div>

        {/* Quick Inspiration Pills */}
        <div>
          <span className="text-xs font-medium text-slate-400 block mb-2">
            ⚡ Quick Ideas (क्लिक करके तुरंत बनाएं):
          </span>
          <div className="flex flex-wrap gap-2">
            {INSPIRATION_IDEAS.map((idea, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => {
                  setUserIdea(idea.en);
                  handleGenerate(idea.en);
                }}
                className="px-3 py-1.5 rounded-xl bg-slate-950 hover:bg-indigo-950/60 border border-slate-800 hover:border-indigo-700/60 text-xs text-slate-300 hover:text-indigo-200 transition-all text-left"
              >
                {idea.hi}
              </button>
            ))}
          </div>
        </div>

        {/* Selectors Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
          {/* Preferred Style */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
              Aesthetic Style (कला शैली)
            </label>
            <select
              value={selectedStyle}
              onChange={(e) => setSelectedStyle(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-indigo-500"
            >
              <option value="Cinematic Photorealistic 8K">Cinematic Photorealistic 8K</option>
              <option value="AMOLED Pitch Black #000000 Neon">AMOLED 100% True Black & Neon</option>
              <option value="Makoto Shinkai Anime Aesthetic">Makoto Shinkai / Ghibli Anime</option>
              <option value="Cyberpunk 2077 Rain & Neon">Cyberpunk Rain & Raytracing</option>
              <option value="Octane 3D Glassmorphism & Liquid">Octane 3D Glass & Liquid Fluid</option>
              <option value="Ancient Vedic Epic Realism">Vedic Epic & Spiritual Realism</option>
              <option value="Minimalist Pastel Vector Art">Minimalist Pastel Flat Art</option>
              <option value="Luxury Imperial Marble & Gold">Luxury Imperial Marble & Gold</option>
            </select>
          </div>

          {/* Target Screen Ratio */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
              Screen Format (स्क्रीन आकार)
            </label>
            <div className="grid grid-cols-3 gap-2">
              {(['Mobile (9:16)', 'Desktop (16:9)', 'Square (1:1)'] as const).map((ratio) => (
                <button
                  key={ratio}
                  type="button"
                  onClick={() => setTargetDevice(ratio)}
                  className={`py-2 px-2 text-xs rounded-xl font-medium transition-all text-center border ${
                    targetDevice === ratio
                      ? 'bg-indigo-600 text-white border-indigo-500 shadow-sm'
                      : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-slate-200'
                  }`}
                >
                  {ratio}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Generate Button */}
        <div className="pt-2">
          <button
            onClick={() => handleGenerate()}
            disabled={isLoading}
            className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold text-sm shadow-xl shadow-indigo-600/25 flex items-center justify-center gap-2 transition-all disabled:opacity-50"
          >
            {isLoading ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Generating Master Prompt with Gemini...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Generate Master Wallpaper Prompt (प्रॉम्प्ट बनाएं)</span>
              </>
            )}
          </button>
        </div>

        {error && (
          <div className="p-4 bg-rose-950/40 border border-rose-800/60 rounded-xl text-rose-300 text-xs">
            {error}
          </div>
        )}
      </div>

      {/* Generated Result Container */}
      {result && (
        <div className="mt-8 pt-8 border-t border-slate-800/80 animate-in fade-in slide-in-from-bottom-3 duration-300 space-y-6">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 bg-indigo-950/20 p-4 rounded-2xl border border-indigo-800/30">
            <div>
              <span className="px-2.5 py-1 text-[11px] font-semibold uppercase rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                {result.category}
              </span>
              <h3 className="text-xl font-bold text-white mt-1.5">{result.title}</h3>
              {result.titleHindi && (
                <p className="text-xs text-indigo-400 font-medium">{result.titleHindi}</p>
              )}
            </div>

            <div className="flex items-center gap-2 self-start sm:self-auto">
              <button
                onClick={handlePreviewMaster}
                className="flex items-center gap-1.5 py-2 px-3 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-semibold border border-slate-700 transition-colors"
              >
                <Smartphone className="w-3.5 h-3.5" />
                Preview in Phone
              </button>
              <button
                onClick={() => onGenerateImage(result.masterPrompt)}
                className="flex items-center gap-1.5 py-2 px-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 text-white rounded-xl text-xs font-semibold shadow transition-all"
              >
                <Sparkles className="w-3.5 h-3.5" />
                Generate AI Wallpaper
              </button>
            </div>
          </div>

          {/* Master Prompt Card */}
          <div className="bg-slate-950 p-5 rounded-2xl border border-indigo-500/40 relative group">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400" />
                <span className="text-xs font-bold uppercase tracking-wider text-indigo-300">
                  Primary Master Prompt (मुख्य प्रॉम्प्ट)
                </span>
              </div>
              <button
                onClick={() => copyToClipboard(result.masterPrompt, true)}
                className="flex items-center gap-1.5 py-1.5 px-3 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold transition-all"
              >
                {copiedMaster ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-200" />
                    <span>Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy Master Prompt</span>
                  </>
                )}
              </button>
            </div>

            <p className="text-xs sm:text-sm font-mono text-slate-200 leading-relaxed bg-slate-900/80 p-3.5 rounded-xl border border-slate-800 select-all">
              {result.masterPrompt}
            </p>

            {/* Hindi & English Explanation */}
            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-indigo-950/30 border border-indigo-900/40 text-indigo-200">
                <span className="font-semibold text-indigo-300 block mb-1">
                  🇮🇳 यह वॉलपेपर कैसा बनेगा (Hindi Details):
                </span>
                <p className="leading-relaxed">{result.hindiExplanation}</p>
              </div>
              <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 text-slate-300">
                <span className="font-semibold text-slate-200 block mb-1">
                  🇬🇧 Composition Details (English):
                </span>
                <p className="leading-relaxed">{result.englishExplanation}</p>
              </div>
            </div>

            {/* Negative Prompt */}
            {result.negativePrompt && (
              <div className="mt-3 text-xs">
                <span className="text-slate-400 font-semibold block mb-1">Negative Prompt:</span>
                <div className="font-mono text-slate-400 bg-slate-900/40 p-2 rounded-lg border border-slate-800/60">
                  {result.negativePrompt}
                </div>
              </div>
            )}
          </div>

          {/* 3 Variations */}
          {result.variations && result.variations.length > 0 && (
            <div>
              <h4 className="text-sm font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-2">
                <span>3 Additional Creative Variations (अतिरिक्त विकल्प)</span>
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {result.variations.map((v, i) => (
                  <div
                    key={i}
                    className="p-4 bg-slate-950 rounded-xl border border-slate-800 hover:border-indigo-500/40 transition-colors flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-semibold text-indigo-400">{v.name}</span>
                        <button
                          onClick={() => copyToClipboard(v.prompt, false, i)}
                          className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
                          title="Copy variation prompt"
                        >
                          {copiedVarIndex === i ? (
                            <Check className="w-3.5 h-3.5 text-emerald-400" />
                          ) : (
                            <Copy className="w-3.5 h-3.5" />
                          )}
                        </button>
                      </div>
                      <p className="text-xs font-mono text-slate-300 leading-relaxed line-clamp-4 select-all">
                        {v.prompt}
                      </p>
                    </div>

                    <div className="pt-3 mt-3 border-t border-slate-800/80 flex items-center justify-between">
                      <button
                        onClick={() => onGenerateImage(v.prompt)}
                        className="text-[11px] font-medium text-indigo-400 hover:text-indigo-300 flex items-center gap-1 transition-colors"
                      >
                        Generate Image <ArrowRight className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
