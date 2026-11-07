import React, { useState, useId } from 'react';
import { Sliders, Copy, Check, Sparkles, Smartphone, RotateCcw } from 'lucide-react';
import { WallpaperPrompt } from '../types/wallpaper';

interface PromptRemixBuilderProps {
  initialPrompt?: WallpaperPrompt | null;
  onPreviewCustomPrompt: (prompt: WallpaperPrompt) => void;
  onGenerateImage: (promptText: string) => void;
}

const SUBJECT_OPTIONS = [
  'Lord Shiva meditating in snow on Mount Kailash with crescent moon and Trishul',
  'Cyberpunk samurai standing with glowing cyan and pink katana in rain',
  'Matte stealth black futuristic hypercar in neon Tokyo tunnel',
  'Ethereal white tiger with piercing crystal-blue eyes in winter bamboo forest',
  'Giant glowing bioluminescent whale soaring through starry cosmic nebulae',
  'Makoto Shinkai aesthetic vibrant twilight clouds with shooting stars',
  'Deep emerald green polished marble slab with fractured liquid 24k gold veins',
  'Translucent frosted glass geometric prisms with chromatic dispersion caustics',
  'Solitary astronaut tethered in deep space beside glowing golden black hole',
  'Ancient carved stone temple at sunset with floating clay diyas on sacred pond',
];

const STYLE_OPTIONS = [
  { label: 'AMOLED True Black (#000000)', tag: 'AMOLED 100% true pitch black background, minimalist high-contrast silhouette' },
  { label: 'Cinematic Photorealistic 8K', tag: 'Cinematic lighting, photorealistic 8k resolution, award-winning photography' },
  { label: 'Makoto Shinkai Anime', tag: 'Makoto Shinkai anime aesthetic, vibrant pastels, breathtaking cloudscape' },
  { label: 'Cyberpunk 2077 Neon', tag: 'Cyberpunk Neo-Tokyo aesthetic, neon cyan and magenta reflections, ray tracing' },
  { label: 'Octane 3D Glass & Fluid', tag: 'Octane Render 8K, pearlescent chromatic dispersion, 3D fluid caustics' },
  { label: 'Studio Ghibli Nostalgic', tag: 'Studio Ghibli aesthetic, hand-drawn anime nostalgia, serene peaceful watercolor' },
  { label: 'Luxury Marble & 24K Gold', tag: 'Luxury high-end texture, polished reflective finish, 24k gold leaf accents' },
];

const LIGHTING_OPTIONS = [
  { label: 'Volumetric God Rays', tag: 'dramatic golden god rays slicing through mist, volumetric atmospheric lighting' },
  { label: 'Cyberpunk Neon Rim Light', tag: 'dual-tone cyan and hot pink neon edge lighting, reflective wet surface bounce' },
  { label: 'Warm Golden Hour Twilight', tag: 'warm sunset golden hour glow, soft gentle ambient illumination' },
  { label: 'Ethereal Bioluminescence', tag: 'glowing bioluminescent aura, soft floating particle dust bokeh' },
  { label: 'Dramatic Studio High-Key', tag: 'studio rim lighting, deep contrast shadows, specular highlights' },
];

const CAMERA_OPTIONS = [
  { label: 'Low-Angle Heroic (Heroic View)', tag: 'cinematic low-angle perspective, dynamic heroic composition' },
  { label: 'Macro 85mm Shallow Depth', tag: 'macro 85mm f/1.4 shallow depth of field, creamy bokeh' },
  { label: 'Centered Perfect Symmetry', tag: 'centered symmetrical composition, clean negative space for app icons' },
  { label: 'Ultra-Wide Cinematic Panoramic', tag: 'ultra-wide cinematic angle, expansive scale, deep depth of field' },
  { label: 'Drone Top-Down Aerial', tag: 'drone aerial top-down view, crisp geographic patterns' },
];

const ENGINE_OPTIONS = [
  'Unreal Engine 5, Octane Render, 8k resolution, ray tracing',
  'Shot on Hasselblad H6D-100c, 8k UHD, National Geographic quality',
  'Masterpiece, trending on ArtStation, ultra-detailed 8K',
  'Apple minimal aesthetic, smooth gradients, clean high-definition',
];

export const PromptRemixBuilder: React.FC<PromptRemixBuilderProps> = ({
  initialPrompt,
  onPreviewCustomPrompt,
  onGenerateImage,
}) => {
  const customSubjectId = useId();
  const [subject, setSubject] = useState(
    initialPrompt?.title || SUBJECT_OPTIONS[0]
  );
  const [customSubject, setCustomSubject] = useState('');
  const [selectedStyle, setSelectedStyle] = useState(STYLE_OPTIONS[0].tag);
  const [selectedLighting, setSelectedLighting] = useState(LIGHTING_OPTIONS[0].tag);
  const [selectedCamera, setSelectedCamera] = useState(CAMERA_OPTIONS[2].tag);
  const [selectedEngine, setSelectedEngine] = useState(ENGINE_OPTIONS[0]);
  const [aspectRatio, setAspectRatio] = useState<'9:16' | '16:9' | '1:1'>('9:16');
  const [copied, setCopied] = useState(false);

  // Computed Full Prompt
  const activeSubject = customSubject.trim() || subject;
  const assembledPrompt = `${activeSubject}, ${selectedStyle}, ${selectedLighting}, ${selectedCamera}, ${selectedEngine}, clean wallpaper framing --ar ${aspectRatio}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(assembledPrompt);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleReset = () => {
    setSubject(SUBJECT_OPTIONS[0]);
    setCustomSubject('');
    setSelectedStyle(STYLE_OPTIONS[0].tag);
    setSelectedLighting(LIGHTING_OPTIONS[0].tag);
    setSelectedCamera(CAMERA_OPTIONS[2].tag);
    setSelectedEngine(ENGINE_OPTIONS[0]);
    setAspectRatio('9:16');
  };

  const handlePreview = () => {
    const customItem: WallpaperPrompt = {
      id: `builder-${Date.now()}`,
      title: activeSubject.slice(0, 45) + (activeSubject.length > 45 ? '...' : ''),
      titleHi: 'कस्टम प्रॉम्प्ट बिल्डर वॉलपेपर',
      category: 'AMOLED Dark',
      aspectRatio,
      prompt: assembledPrompt,
      negativePrompt: 'blurry, noisy, text, watermark, cropped, bad anatomy, low resolution',
      hindiDescription: 'आपके द्वारा कस्टम बिल्डर में चुने गए कंपोनेंट्स से तैयार किया गया मास्टर प्रॉम्प्ट।',
      englishDescription: 'Assembled using the interactive WallpaperCraft prompt builder with tuned lighting, camera, and ratio tags.',
      tags: ['Custom Built', 'Remix Studio', aspectRatio],
      previewUrl:
        'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=1000&auto=format&fit=crop&q=80',
    };
    onPreviewCustomPrompt(customItem);
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold mb-2">
            <Sliders className="w-3.5 h-3.5" />
            Interactive Prompt Builder
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            कस्टम वॉलपेपर प्रॉम्प्ट बिल्डर
          </h2>
          <p className="text-sm text-slate-400 mt-1">
            Choose your Subject, Style, Lighting, Camera Angle, and Aspect Ratio. Build professional prompts in seconds.
          </p>
        </div>

        <button
          onClick={handleReset}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-slate-400 hover:text-slate-200 bg-slate-800 hover:bg-slate-700 rounded-xl transition-colors border border-slate-700"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          Reset Defaults
        </button>
      </div>

      <div className="space-y-5">
        {/* Step 1: Subject Selection & Custom input */}
        <div>
          <label htmlFor={customSubjectId} className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2">
            1. Select Subject or Type Your Own (मुख्य विषय)
          </label>
          <div className="space-y-2">
            <input
              id={customSubjectId}
              type="text"
              value={customSubject}
              onChange={(e) => setCustomSubject(e.target.value)}
              placeholder="Or type custom subject (e.g. Glowing Golden Lord Rama, Cyberpunk flying car in neon fog)..."
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500"
            />

            <select
              value={subject}
              onChange={(e) => {
                setSubject(e.target.value);
                setCustomSubject('');
              }}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-slate-300 focus:outline-none focus:border-indigo-500"
            >
              {SUBJECT_OPTIONS.map((sub, i) => (
                <option key={i} value={sub}>
                  Preset: {sub.slice(0, 75)}...
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Step 2: Aesthetic Style */}
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2">
            2. Art Style & Medium (कला शैली)
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
            {STYLE_OPTIONS.map((s, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setSelectedStyle(s.tag)}
                className={`p-2.5 rounded-xl text-xs font-medium text-left border transition-all ${
                  selectedStyle === s.tag
                    ? 'bg-indigo-600 text-white border-indigo-500 shadow-sm'
                    : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-slate-200 hover:border-slate-700'
                }`}
              >
                {s.label}
              </button>
            ))}
          </div>
        </div>

        {/* Step 3: Lighting & Mood */}
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2">
            3. Lighting & Atmosphere (रोशनी और वातावरण)
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2">
            {LIGHTING_OPTIONS.map((l, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setSelectedLighting(l.tag)}
                className={`p-2.5 rounded-xl text-xs font-medium text-left border transition-all ${
                  selectedLighting === l.tag
                    ? 'bg-indigo-600 text-white border-indigo-500 shadow-sm'
                    : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-slate-200 hover:border-slate-700'
                }`}
              >
                {l.label}
              </button>
            ))}
          </div>
        </div>

        {/* Step 4: Camera & Composition */}
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2">
            4. Camera & Framing (कैमरा एंगल और कंपोज़िशन)
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2">
            {CAMERA_OPTIONS.map((c, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setSelectedCamera(c.tag)}
                className={`p-2.5 rounded-xl text-xs font-medium text-left border transition-all ${
                  selectedCamera === c.tag
                    ? 'bg-indigo-600 text-white border-indigo-500 shadow-sm'
                    : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-slate-200 hover:border-slate-700'
                }`}
              >
                {c.label}
              </button>
            ))}
          </div>
        </div>

        {/* Step 5: Screen Aspect Ratio & Quality Engine */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2">
              5. Aspect Ratio (आस्पेक्ट रेशियो)
            </label>
            <div className="grid grid-cols-3 gap-2">
              {(['9:16', '16:9', '1:1'] as const).map((r) => (
                <button
                  key={r}
                  type="button"
                  onClick={() => setAspectRatio(r)}
                  className={`py-2 px-3 rounded-xl text-xs font-semibold border transition-all text-center ${
                    aspectRatio === r
                      ? 'bg-indigo-600 text-white border-indigo-500 shadow-sm'
                      : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-slate-200'
                  }`}
                >
                  {r === '9:16' ? '9:16 Phone' : r === '16:9' ? '16:9 PC' : '1:1 Square'}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2">
              6. Quality & Engine (क्वालिटी टैग्स)
            </label>
            <select
              value={selectedEngine}
              onChange={(e) => setSelectedEngine(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-slate-300 focus:outline-none focus:border-indigo-500"
            >
              {ENGINE_OPTIONS.map((eng, i) => (
                <option key={i} value={eng}>
                  {eng}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Live Assembled Output */}
      <div className="mt-8 pt-6 border-t border-slate-800/80">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-indigo-500 animate-pulse" />
            <span className="text-xs font-bold uppercase tracking-wider text-slate-300">
              Live Assembled Master Prompt (तैयार प्रॉम्प्ट)
            </span>
          </div>
          <span className="text-xs font-mono text-indigo-400">--ar {aspectRatio}</span>
        </div>

        <div className="p-4 bg-slate-950 rounded-2xl border border-indigo-500/40 text-xs sm:text-sm font-mono text-slate-200 leading-relaxed select-all shadow-inner">
          {assembledPrompt}
        </div>

        {/* Action Buttons */}
        <div className="mt-4 flex flex-col sm:flex-row gap-3">
          <button
            onClick={handleCopy}
            className={`flex-1 py-3 px-4 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all ${
              copied
                ? 'bg-emerald-600 text-white'
                : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/25'
            }`}
          >
            {copied ? (
              <>
                <Check className="w-4 h-4 text-emerald-200" />
                <span>Copied to Clipboard!</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" />
                <span>Copy Assembled Prompt</span>
              </>
            )}
          </button>

          <button
            onClick={handlePreview}
            className="flex-1 py-3 px-4 rounded-xl text-xs sm:text-sm font-semibold flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors border border-slate-700"
          >
            <Smartphone className="w-4 h-4" />
            <span>Preview in Phone Mockup</span>
          </button>

          <button
            onClick={() => onGenerateImage(assembledPrompt)}
            className="flex-1 py-3 px-4 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white shadow-lg transition-all"
          >
            <Sparkles className="w-4 h-4" />
            <span>Generate AI Image</span>
          </button>
        </div>
      </div>
    </div>
  );
};
