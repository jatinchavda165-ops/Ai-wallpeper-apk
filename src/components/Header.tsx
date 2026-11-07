import React from 'react';
import { Sparkles, Image as ImageIcon, Sliders, BookOpen, Star } from 'lucide-react';

export type ActiveTab = 'gallery' | 'ai-generator' | 'remix-builder' | 'formula-guide' | 'favorites';

interface HeaderProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  favoritesCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  favoritesCount,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-slate-950/85 backdrop-blur-xl border-b border-slate-800/80 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 gap-4">
          {/* Logo & Brand */}
          <div
            onClick={() => setActiveTab('gallery')}
            className="flex items-center gap-3 cursor-pointer group select-none"
          >
            <div className="relative w-10 h-10 rounded-2xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-pink-500 flex items-center justify-center shadow-lg shadow-indigo-500/25 group-hover:scale-105 transition-transform">
              <Sparkles className="w-5 h-5 text-white" />
              <div className="absolute -inset-0.5 rounded-2xl bg-gradient-to-r from-indigo-500 to-pink-500 opacity-30 blur group-hover:opacity-60 transition-opacity" />
            </div>

            <div>
              <div className="flex items-center gap-2">
                <span className="text-lg sm:text-xl font-extrabold tracking-tight text-white group-hover:text-indigo-300 transition-colors">
                  WallpaperCraft <span className="text-indigo-400">AI</span>
                </span>
                <span className="hidden sm:inline-flex px-2 py-0.5 text-[10px] font-bold uppercase rounded-md bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                  4K / 8K UHD
                </span>
              </div>
              <p className="text-xs text-slate-400">
                AI Wallpaper Prompts & Generation Studio
              </p>
            </div>
          </div>

          {/* Desktop Navigation Tabs */}
          <nav className="hidden md:flex items-center gap-1.5 p-1 bg-slate-900/90 rounded-2xl border border-slate-800">
            <button
              onClick={() => setActiveTab('gallery')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all ${
                activeTab === 'gallery'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <ImageIcon className="w-3.5 h-3.5" />
              <span>Curated Gallery</span>
            </button>

            <button
              onClick={() => setActiveTab('ai-generator')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all ${
                activeTab === 'ai-generator'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>AI Prompt Engine</span>
            </button>

            <button
              onClick={() => setActiveTab('remix-builder')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all ${
                activeTab === 'remix-builder'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Sliders className="w-3.5 h-3.5" />
              <span>Custom Builder</span>
            </button>

            <button
              onClick={() => setActiveTab('formula-guide')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all ${
                activeTab === 'formula-guide'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>Prompt Guide</span>
            </button>

            <button
              onClick={() => setActiveTab('favorites')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all ${
                activeTab === 'favorites'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Star className="w-3.5 h-3.5 text-amber-400" />
              <span>Favorites</span>
              {favoritesCount > 0 && (
                <span className="px-1.5 py-0.2 rounded-full bg-amber-500/20 text-amber-300 text-[10px] font-bold">
                  {favoritesCount}
                </span>
              )}
            </button>
          </nav>
        </div>

        {/* Mobile Navigation Scrollbar */}
        <div className="flex md:hidden items-center gap-1.5 pb-3 overflow-x-auto no-scrollbar">
          <button
            onClick={() => setActiveTab('gallery')}
            className={`flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold ${
              activeTab === 'gallery' ? 'bg-indigo-600 text-white' : 'bg-slate-900 text-slate-400'
            }`}
          >
            <ImageIcon className="w-3 h-3" />
            <span>गैलरी (Gallery)</span>
          </button>
          <button
            onClick={() => setActiveTab('ai-generator')}
            className={`flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold ${
              activeTab === 'ai-generator' ? 'bg-indigo-600 text-white' : 'bg-slate-900 text-slate-400'
            }`}
          >
            <Sparkles className="w-3 h-3 text-amber-300" />
            <span>AI जनरेटर</span>
          </button>
          <button
            onClick={() => setActiveTab('remix-builder')}
            className={`flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold ${
              activeTab === 'remix-builder' ? 'bg-indigo-600 text-white' : 'bg-slate-900 text-slate-400'
            }`}
          >
            <Sliders className="w-3 h-3" />
            <span>बिल्डर (Builder)</span>
          </button>
          <button
            onClick={() => setActiveTab('formula-guide')}
            className={`flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold ${
              activeTab === 'formula-guide' ? 'bg-indigo-600 text-white' : 'bg-slate-900 text-slate-400'
            }`}
          >
            <BookOpen className="w-3 h-3" />
            <span>गाइड (Guide)</span>
          </button>
          <button
            onClick={() => setActiveTab('favorites')}
            className={`flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold ${
              activeTab === 'favorites' ? 'bg-indigo-600 text-white' : 'bg-slate-900 text-slate-400'
            }`}
          >
            <Star className="w-3 h-3 text-amber-400" />
            <span>पसंदीदा ({favoritesCount})</span>
          </button>
        </div>
      </div>
    </header>
  );
};
