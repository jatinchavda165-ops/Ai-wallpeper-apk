import React, { useState, useEffect, useMemo, useId } from 'react';
import {
  Sparkles,
  Search,
  Sliders,
  BookOpen,
  Star,
  Download,
  X,
  Share2,
} from 'lucide-react';
import { CURATED_PROMPTS } from './data/curatedPrompts';
import { WallpaperPrompt, PromptCategory, AspectRatio } from './types/wallpaper';
import { Header, ActiveTab } from './components/Header';
import { PromptCard } from './components/PromptCard';
import { DevicePreviewModal } from './components/DevicePreviewModal';
import { AIPromptGenerator } from './components/AIPromptGenerator';
import { PromptRemixBuilder } from './components/PromptRemixBuilder';
import { WallpaperImageModal } from './components/WallpaperImageModal';
import { PromptFormulaGuide } from './components/PromptFormulaGuide';

const CATEGORIES: PromptCategory[] = [
  'All',
  'AMOLED Dark',
  'Spiritual & Epic',
  'Cyberpunk & Neon',
  'Anime & Ghibli',
  'Nature & Landscapes',
  'Sci-Fi & Cosmic',
  'Abstract & 3D Fluid',
  'Luxury Marble & Gold',
  'Supercars & Speed',
  'Majestic Creatures',
];

export default function App() {
  const searchInputId = useId();
  const [activeTab, setActiveTab] = useState<ActiveTab>('gallery');
  const [selectedCategory, setSelectedCategory] = useState<PromptCategory>('All');
  const [selectedRatio, setSelectedRatio] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [favorites, setFavorites] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('wallpaper_craft_favorites');
      return saved ? JSON.parse(saved) : ['amoled-01', 'spiritual-01'];
    } catch {
      return ['amoled-01', 'spiritual-01'];
    }
  });

  // Modal States
  const [devicePreviewPrompt, setDevicePreviewPrompt] = useState<WallpaperPrompt | null>(null);
  const [customPreviewImage, setCustomPreviewImage] = useState<string | null>(null);
  const [imageGenPromptText, setImageGenPromptText] = useState<string | null>(null);
  const [remixInitialPrompt, setRemixInitialPrompt] = useState<WallpaperPrompt | null>(null);

  // Sync favorites with localStorage
  useEffect(() => {
    try {
      localStorage.setItem('wallpaper_craft_favorites', JSON.stringify(favorites));
    } catch (e) {
      console.error('Failed to save favorites to localStorage', e);
    }
  }, [favorites]);

  const toggleFavorite = (id: string) => {
    setFavorites((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  // Filtered Prompts
  const displayedPrompts = useMemo(() => {
    let list = CURATED_PROMPTS;

    if (activeTab === 'favorites') {
      list = list.filter((p) => favorites.includes(p.id));
    }

    if (selectedCategory !== 'All') {
      list = list.filter((p) => p.category === selectedCategory);
    }

    if (selectedRatio !== 'All') {
      list = list.filter((p) => p.aspectRatio === selectedRatio);
    }

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      list = list.filter(
        (p) =>
          p.title.toLowerCase().includes(query) ||
          p.titleHi.toLowerCase().includes(query) ||
          p.prompt.toLowerCase().includes(query) ||
          p.tags.some((t) => t.toLowerCase().includes(query)) ||
          p.category.toLowerCase().includes(query)
      );
    }

    return list;
  }, [activeTab, selectedCategory, selectedRatio, searchQuery, favorites]);

  const handleOpenPreview = (prompt: WallpaperPrompt, customUrl?: string) => {
    setDevicePreviewPrompt(prompt);
    setCustomPreviewImage(customUrl || null);
  };

  const handleOpenGenerator = (prompt: WallpaperPrompt) => {
    setImageGenPromptText(prompt.prompt);
  };

  const handleOpenRemix = (prompt: WallpaperPrompt) => {
    setRemixInitialPrompt(prompt);
    setActiveTab('remix-builder');
  };

  // Export Favorites / All Prompts
  const handleExportPrompts = () => {
    const dataToExport = displayedPrompts.map((p) => ({
      title: p.title,
      category: p.category,
      aspectRatio: p.aspectRatio,
      prompt: p.prompt,
      hindiDescription: p.hindiDescription,
      negativePrompt: p.negativePrompt,
      tags: p.tags,
    }));

    const blob = new Blob([JSON.stringify(dataToExport, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `wallpaper-prompts-${Date.now()}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-indigo-500/30 selection:text-indigo-200">
      {/* Top Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        favoritesCount={favorites.length}
      />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 space-y-10">
        {/* Hero Section Banner (when on Gallery or Favorites) */}
        {(activeTab === 'gallery' || activeTab === 'favorites') && (
          <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-indigo-950 via-slate-900 to-purple-950 border border-slate-800 p-6 sm:p-10 shadow-2xl">
            {/* Ambient Background Glow */}
            <div className="absolute top-0 right-0 -mt-12 -mr-12 w-96 h-96 rounded-full bg-indigo-500/10 blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 left-0 -mb-12 -ml-12 w-96 h-96 rounded-full bg-purple-500/10 blur-3xl pointer-events-none" />

            <div className="relative z-10 max-w-3xl">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-500/20 border border-indigo-500/30 text-indigo-300 text-xs font-semibold mb-4">
                <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-pulse" />
                <span>AI Wallpaper Prompt Hub & Studio • 4K UHD</span>
              </div>

              <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight">
                AI Wallpaper App के लिए{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-300 to-pink-400">
                  मास्टर प्रॉम्प्ट्स
                </span>
              </h1>

              <p className="mt-3 text-sm sm:text-base text-slate-300 leading-relaxed">
                फोन और डेस्कटॉप के लिए तैयार किए गए 4K AI वॉलपेपर प्रॉम्प्ट्स का संग्रह। AMOLED ब्लैक, साइबरपंक, आध्यात्मिक, घिबली एनीमे और सुपरकार्स के प्रॉम्प्ट्स 1-क्लिक में कॉपी करें, लाइव फोन पर प्रीव्यू करें या खुद नया प्रॉम्प्ट जनरेट करें।
              </p>

              {/* Quick Action Buttons */}
              <div className="mt-6 flex flex-wrap gap-3">
                <button
                  onClick={() => setActiveTab('ai-generator')}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold text-xs sm:text-sm shadow-lg shadow-indigo-600/30 transition-all transform hover:scale-[1.02]"
                >
                  <Sparkles className="w-4 h-4 text-amber-300" />
                  <span>AI Prompt Engine (नया प्रॉम्प्ट बनाएं)</span>
                </button>

                <button
                  onClick={() => setActiveTab('remix-builder')}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800/90 hover:bg-slate-700 text-slate-200 font-semibold text-xs sm:text-sm border border-slate-700 transition-colors"
                >
                  <Sliders className="w-4 h-4 text-indigo-400" />
                  <span>Custom Remix Builder</span>
                </button>

                <button
                  onClick={() => setActiveTab('formula-guide')}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800/90 hover:bg-slate-700 text-slate-200 font-semibold text-xs sm:text-sm border border-slate-700 transition-colors"
                >
                  <BookOpen className="w-4 h-4 text-emerald-400" />
                  <span>प्रॉम्प्ट लिखने का फॉर्मूला (Guide)</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Tab 1: Gallery View */}
        {activeTab === 'gallery' && (
          <div className="space-y-6">
            {/* Search and Aspect Ratio Filter Bar */}
            <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 bg-slate-900/80 p-4 rounded-2xl border border-slate-800">
              {/* Search input */}
              <div className="relative flex-1">
                <label htmlFor={searchInputId} className="sr-only">Search Prompts</label>
                <Search className="w-4 h-4 text-slate-400 absolute top-1/2 left-3.5 -translate-y-1/2" />
                <input
                  id={searchInputId}
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="खोजें (Search by style, subject, 'Shiva', 'Cyberpunk', 'AMOLED', 'Cars')..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-9 py-2.5 text-xs sm:text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute top-1/2 right-3 -translate-y-1/2 text-slate-400 hover:text-white"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>

              {/* Aspect Ratio Filter Pills */}
              <div className="flex items-center gap-2 self-start md:self-auto">
                <span className="text-xs font-semibold text-slate-400 hidden sm:inline">Ratio:</span>
                {(['All', '9:16', '16:9', '1:1'] as const).map((ratio) => (
                  <button
                    key={ratio}
                    onClick={() => setSelectedRatio(ratio)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all border ${
                      selectedRatio === ratio
                        ? 'bg-indigo-600 text-white border-indigo-500 shadow-sm'
                        : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-slate-200'
                    }`}
                  >
                    {ratio === 'All' ? 'All Ratios' : ratio === '9:16' ? '📱 9:16' : ratio === '16:9' ? '💻 16:9' : '🔲 1:1'}
                  </button>
                ))}

                <button
                  onClick={handleExportPrompts}
                  className="p-2 bg-slate-950 hover:bg-slate-800 text-slate-300 hover:text-white rounded-lg border border-slate-800 transition-colors"
                  title="Export Prompts as JSON"
                >
                  <Download className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Category Filter Chips */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`flex-shrink-0 px-4 py-2 rounded-xl text-xs font-semibold transition-all border ${
                    selectedCategory === cat
                      ? 'bg-indigo-600 text-white border-indigo-500 shadow-md shadow-indigo-600/20'
                      : 'bg-slate-900/90 text-slate-400 border-slate-800 hover:text-slate-200 hover:border-slate-700'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Prompts Grid */}
            {displayedPrompts.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {displayedPrompts.map((prompt) => (
                  <PromptCard
                    key={prompt.id}
                    prompt={prompt}
                    isFavorite={favorites.includes(prompt.id)}
                    onToggleFavorite={toggleFavorite}
                    onPreview={handleOpenPreview}
                    onGenerate={handleOpenGenerator}
                    onRemix={handleOpenRemix}
                  />
                ))}
              </div>
            ) : (
              <div className="py-16 text-center bg-slate-900/40 rounded-3xl border border-slate-800/80 p-8">
                <Search className="w-10 h-10 text-slate-500 mx-auto mb-3" />
                <h3 className="text-lg font-bold text-white mb-1">कोई वॉलपेपर प्रॉम्प्ट नहीं मिला</h3>
                <p className="text-xs text-slate-400 max-w-sm mx-auto mb-4">
                  आपके सर्च &quot;{searchQuery}&quot; के लिए कोई परिणाम नहीं मिला। कृपया दूसरा कीवर्ड आज़माएं।
                </p>
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedCategory('All');
                    setSelectedRatio('All');
                  }}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold"
                >
                  सभी फ़िल्टर साफ़ करें (Reset Filters)
                </button>
              </div>
            )}
          </div>
        )}

        {/* Tab 2: AI Prompt Engine Generator */}
        {activeTab === 'ai-generator' && (
          <AIPromptGenerator
            onPreviewCustomPrompt={handleOpenPreview}
            onGenerateImage={(pText) => setImageGenPromptText(pText)}
          />
        )}

        {/* Tab 3: Interactive Remix Builder */}
        {activeTab === 'remix-builder' && (
          <PromptRemixBuilder
            initialPrompt={remixInitialPrompt}
            onPreviewCustomPrompt={handleOpenPreview}
            onGenerateImage={(pText) => setImageGenPromptText(pText)}
          />
        )}

        {/* Tab 4: Formula & Educational Guide */}
        {activeTab === 'formula-guide' && <PromptFormulaGuide />}

        {/* Tab 5: Favorites View */}
        {activeTab === 'favorites' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2">
                  <Star className="w-5 h-5 text-amber-400 fill-amber-400" />
                  <span>आपके पसंदीदा प्रॉम्प्ट्स (Favorite Prompts)</span>
                </h2>
                <p className="text-xs text-slate-400 mt-1">
                  Saved locally in your browser ({displayedPrompts.length} items)
                </p>
              </div>

              {displayedPrompts.length > 0 && (
                <button
                  onClick={handleExportPrompts}
                  className="flex items-center gap-1.5 px-3 py-2 bg-slate-900 hover:bg-slate-800 text-slate-200 rounded-xl text-xs font-semibold border border-slate-800 transition-colors"
                >
                  <Download className="w-4 h-4" />
                  <span>Export JSON</span>
                </button>
              )}
            </div>

            {displayedPrompts.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {displayedPrompts.map((prompt) => (
                  <PromptCard
                    key={prompt.id}
                    prompt={prompt}
                    isFavorite={favorites.includes(prompt.id)}
                    onToggleFavorite={toggleFavorite}
                    onPreview={handleOpenPreview}
                    onGenerate={handleOpenGenerator}
                    onRemix={handleOpenRemix}
                  />
                ))}
              </div>
            ) : (
              <div className="py-16 text-center bg-slate-900/40 rounded-3xl border border-slate-800/80 p-8">
                <Star className="w-10 h-10 text-slate-600 mx-auto mb-3" />
                <h3 className="text-lg font-bold text-white mb-1">अभी कोई पसंदीदा प्रॉम्प्ट नहीं है</h3>
                <p className="text-xs text-slate-400 max-w-sm mx-auto mb-4">
                  गैलरी में किसी भी प्रॉम्प्ट कार्ड पर दिए गए स्टार आइकॉन (★) पर क्लिक करके उसे यहाँ सेव करें।
                </p>
                <button
                  onClick={() => setActiveTab('gallery')}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold"
                >
                  गैलरी ब्राउज़ करें (Browse Gallery)
                </button>
              </div>
            )}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-slate-950 py-8 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-300">WallpaperCraft AI</span>
            <span>•</span>
            <span>4K Wallpaper Prompts & Generator for Midjourney, SDXL, DALL-E 3 & Gemini</span>
          </div>
          <div className="flex items-center gap-3 text-slate-400">
            <button
              onClick={() => setActiveTab('formula-guide')}
              className="hover:text-indigo-400 transition-colors"
            >
              Prompt Guide
            </button>
            <span>•</span>
            <button
              onClick={() => setActiveTab('ai-generator')}
              className="hover:text-indigo-400 transition-colors"
            >
              AI Generator
            </button>
          </div>
        </div>
      </footer>

      {/* Interactive Device Preview Modal */}
      {devicePreviewPrompt && (
        <DevicePreviewModal
          prompt={devicePreviewPrompt}
          customImageUrl={customPreviewImage}
          onClose={() => {
            setDevicePreviewPrompt(null);
            setCustomPreviewImage(null);
          }}
          onGenerateImage={(pText) => setImageGenPromptText(pText)}
        />
      )}

      {/* Real AI Wallpaper Generation Modal */}
      {imageGenPromptText && (
        <WallpaperImageModal
          promptText={imageGenPromptText}
          initialAspectRatio="9:16"
          onClose={() => setImageGenPromptText(null)}
          onPreviewInDevice={(mockPrompt, imgUrl) => {
            setImageGenPromptText(null);
            handleOpenPreview(mockPrompt, imgUrl);
          }}
        />
      )}
    </div>
  );
}
