import React, { useState } from 'react';
import { Copy, Check, Smartphone, Sparkles, Star, Sliders, ChevronDown, ChevronUp, Eye } from 'lucide-react';
import { WallpaperPrompt } from '../types/wallpaper';

interface PromptCardProps {
  prompt: WallpaperPrompt;
  isFavorite: boolean;
  onToggleFavorite: (id: string) => void;
  onPreview: (prompt: WallpaperPrompt) => void;
  onGenerate: (prompt: WallpaperPrompt) => void;
  onRemix: (prompt: WallpaperPrompt) => void;
}

export const PromptCard: React.FC<PromptCardProps> = ({
  prompt,
  isFavorite,
  onToggleFavorite,
  onPreview,
  onGenerate,
  onRemix,
}) => {
  const [copied, setCopied] = useState(false);
  const [showHindiTip, setShowHindiTip] = useState(false);

  const handleCopy = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(prompt.prompt);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="group relative bg-slate-900/90 border border-slate-800 hover:border-indigo-500/50 rounded-2xl overflow-hidden shadow-lg hover:shadow-indigo-500/10 transition-all duration-300 flex flex-col">
      {/* Top Image Preview Banner */}
      <div className="relative aspect-[16/10] sm:aspect-[16/9] w-full overflow-hidden bg-slate-950">
        <img
          src={prompt.previewUrl}
          alt={prompt.title}
          loading="lazy"
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />

        {/* Floating Top Badges */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
          <span className="px-2.5 py-1 text-[11px] font-semibold tracking-wide uppercase rounded-full bg-slate-950/80 backdrop-blur-md text-indigo-300 border border-slate-700/60 shadow">
            {prompt.category}
          </span>

          <div className="flex items-center gap-1.5">
            <span className="px-2 py-0.5 text-[10px] font-mono font-medium rounded-md bg-slate-950/80 backdrop-blur-md text-slate-300 border border-slate-700/60">
              {prompt.aspectRatio}
            </span>
            <button
              onClick={() => onToggleFavorite(prompt.id)}
              className={`p-1.5 rounded-full backdrop-blur-md transition-colors ${
                isFavorite
                  ? 'bg-amber-500/90 text-white shadow-sm'
                  : 'bg-slate-950/70 text-slate-400 hover:text-amber-400'
              }`}
              title={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
            >
              <Star className="w-3.5 h-3.5 fill-current" />
            </button>
          </div>
        </div>

        {/* Hover Action Overlay on Image */}
        <div className="absolute inset-0 bg-slate-950/60 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center gap-2 p-3">
          <button
            onClick={() => onPreview(prompt)}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold shadow-lg transition-all transform hover:scale-105"
          >
            <Smartphone className="w-3.5 h-3.5" />
            Phone Mockup
          </button>
          <button
            onClick={() => onGenerate(prompt)}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800/90 hover:bg-slate-700 text-white rounded-xl text-xs font-semibold shadow-lg transition-all transform hover:scale-105 border border-slate-700"
          >
            <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
            Generate AI
          </button>
        </div>
      </div>

      {/* Content Body */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
        <div>
          <div className="mb-2">
            <h3 className="font-bold text-white text-base leading-snug group-hover:text-indigo-300 transition-colors">
              {prompt.title}
            </h3>
            {prompt.titleHi && (
              <p className="text-xs text-indigo-400/90 font-medium mt-0.5">{prompt.titleHi}</p>
            )}
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-1.5 mb-3">
            {prompt.tags.map((tag, idx) => (
              <span
                key={idx}
                className="px-2 py-0.5 text-[10px] rounded-md bg-slate-800/80 text-slate-300 border border-slate-700/50"
              >
                #{tag}
              </span>
            ))}
          </div>

          {/* Prompt Code Box */}
          <div className="relative mb-3 group/code">
            <div className="p-3 bg-slate-950/90 border border-slate-800 rounded-xl text-xs font-mono text-slate-300 leading-relaxed line-clamp-3 hover:line-clamp-none transition-all duration-200 cursor-text select-all">
              {prompt.prompt}
            </div>
          </div>

          {/* Toggleable Hindi Description / Why this works */}
          {prompt.hindiDescription && (
            <div className="mb-3">
              <button
                onClick={() => setShowHindiTip(!showHindiTip)}
                className="flex items-center gap-1 text-[11px] font-medium text-indigo-400 hover:text-indigo-300 transition-colors"
              >
                {showHindiTip ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                <span>{showHindiTip ? 'विवरण छिपाएं (Hide tip)' : 'हिंदी में जानें क्यों खास है यह (Hindi Tip)'}</span>
              </button>
              {showHindiTip && (
                <div className="mt-2 p-2.5 bg-indigo-950/30 border border-indigo-900/50 rounded-lg text-xs text-indigo-200 leading-relaxed animate-in fade-in">
                  {prompt.hindiDescription}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Card Footer Actions */}
        <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between gap-2 mt-auto">
          <button
            onClick={handleCopy}
            className={`flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl text-xs font-semibold transition-all ${
              copied
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 border border-indigo-500/30 hover:border-indigo-500/50'
            }`}
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-200" />
                <span>Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Copy Prompt</span>
              </>
            )}
          </button>

          <button
            onClick={() => onPreview(prompt)}
            className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-xl transition-colors border border-slate-700"
            title="Preview on phone lockscreen"
          >
            <Eye className="w-4 h-4" />
          </button>

          <button
            onClick={() => onRemix(prompt)}
            className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-xl transition-colors border border-slate-700"
            title="Remix in Prompt Builder"
          >
            <Sliders className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
