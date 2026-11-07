import React, { useState, useEffect } from 'react';
import { X, Sparkles, Download, Smartphone, RefreshCw, Copy, Check, AlertCircle } from 'lucide-react';
import { WallpaperPrompt } from '../types/wallpaper';

interface WallpaperImageModalProps {
  promptText: string;
  initialAspectRatio?: '9:16' | '16:9' | '1:1';
  onClose: () => void;
  onPreviewInDevice: (prompt: WallpaperPrompt, imageUrl: string) => void;
}

export const WallpaperImageModal: React.FC<WallpaperImageModalProps> = ({
  promptText,
  initialAspectRatio = '9:16',
  onClose,
  onPreviewInDevice,
}) => {
  const [aspectRatio, setAspectRatio] = useState<'9:16' | '16:9' | '1:1'>(initialAspectRatio);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const generateImage = async (ratio: '9:16' | '16:9' | '1:1') => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/generate-wallpaper', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: promptText,
          aspectRatio: ratio,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to generate image');
      }

      const data = await response.json();
      setImageUrl(data.imageUrl);
    } catch (err: unknown) {
      console.error('Generation error:', err);
      const msg = err instanceof Error ? err.message : 'Error generating wallpaper image';
      setError(msg);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    generateImage(initialAspectRatio);
  }, []);

  const handleCopyPrompt = () => {
    navigator.clipboard.writeText(promptText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    if (!imageUrl) return;
    const link = document.createElement('a');
    link.href = imageUrl;
    link.download = `ai-wallpaper-${Date.now()}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleOpenDeviceMockup = () => {
    if (!imageUrl) return;
    const mockPrompt: WallpaperPrompt = {
      id: `gen-${Date.now()}`,
      title: 'AI Generated Wallpaper',
      titleHi: 'एआई द्वारा जनरेट किया गया वॉलपेपर',
      category: 'AMOLED Dark',
      aspectRatio,
      prompt: promptText,
      negativePrompt: '',
      hindiDescription: 'आपके चुने हुए प्रॉम्प्ट से तैयार किया गया लाइव एआई वॉलपेपर।',
      englishDescription: 'Live AI generated wallpaper created from your prompt.',
      tags: ['AI Generated', aspectRatio, 'High Quality'],
      previewUrl: imageUrl,
    };
    onClose();
    onPreviewInDevice(mockPrompt, imageUrl);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-3xl max-h-[90vh] bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 sm:p-5 border-b border-slate-800 bg-slate-900/90">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-indigo-600/20 text-indigo-400 flex items-center justify-center border border-indigo-500/30">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-white text-base">AI Wallpaper Generator</h3>
              <p className="text-xs text-slate-400">Rendering with Gemini Image Generation</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-full transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 flex flex-col items-center justify-center">
          {/* Ratio Selector Buttons */}
          <div className="flex items-center gap-2 mb-4 bg-slate-950 p-1 rounded-xl border border-slate-800">
            {(['9:16', '16:9', '1:1'] as const).map((r) => (
              <button
                key={r}
                onClick={() => {
                  setAspectRatio(r);
                  generateImage(r);
                }}
                disabled={isLoading}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  aspectRatio === r
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {r === '9:16' ? '📱 9:16 Phone' : r === '16:9' ? '💻 16:9 Desktop' : '🔲 1:1 Square'}
              </button>
            ))}
          </div>

          {/* Display Preview */}
          <div className="relative w-full flex items-center justify-center min-h-[340px] bg-slate-950/60 rounded-2xl border border-slate-800/80 p-3 overflow-hidden">
            {isLoading ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <div className="relative mb-4">
                  <div className="w-14 h-14 rounded-full border-2 border-indigo-500/30 border-t-indigo-500 animate-spin" />
                  <Sparkles className="w-6 h-6 text-indigo-400 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-pulse" />
                </div>
                <h4 className="text-sm font-semibold text-white mb-1">
                  Creating Your AI Wallpaper...
                </h4>
                <p className="text-xs text-slate-400 max-w-sm">
                  Generating high-resolution lighting, textures, and details with Gemini Image AI.
                </p>
              </div>
            ) : error ? (
              <div className="flex flex-col items-center justify-center py-8 text-center max-w-md">
                <div className="w-12 h-12 rounded-full bg-rose-500/20 text-rose-400 flex items-center justify-center mb-3">
                  <AlertCircle className="w-6 h-6" />
                </div>
                <h4 className="text-sm font-semibold text-white mb-1">Generation Notice</h4>
                <p className="text-xs text-rose-300 mb-4 bg-rose-950/40 p-3 rounded-xl border border-rose-800/50">
                  {error}
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={() => generateImage(aspectRatio)}
                    className="flex items-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    Try Again
                  </button>
                  <button
                    onClick={handleCopyPrompt}
                    className="flex items-center gap-1.5 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-medium border border-slate-700"
                  >
                    <Copy className="w-3.5 h-3.5" />
                    Copy Prompt for Midjourney/DALL-E
                  </button>
                </div>
              </div>
            ) : imageUrl ? (
              <div className="relative max-h-[460px] flex items-center justify-center overflow-hidden rounded-xl">
                <img
                  src={imageUrl}
                  alt="Generated Wallpaper"
                  className={`max-h-[460px] object-contain rounded-xl shadow-2xl ${
                    aspectRatio === '9:16' ? 'aspect-[9/16]' : aspectRatio === '16:9' ? 'aspect-[16/9]' : 'aspect-square'
                  }`}
                />
              </div>
            ) : null}
          </div>

          {/* Active Prompt Snippet */}
          <div className="w-full mt-4 p-3 bg-slate-950 rounded-xl border border-slate-800 flex items-center justify-between gap-3">
            <p className="text-xs font-mono text-slate-400 truncate select-all">{promptText}</p>
            <button
              onClick={handleCopyPrompt}
              className="flex-shrink-0 flex items-center gap-1 text-xs text-indigo-400 hover:text-indigo-300 font-medium"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied' : 'Copy'}</span>
            </button>
          </div>
        </div>

        {/* Footer Actions */}
        {imageUrl && !isLoading && (
          <div className="p-4 sm:p-5 border-t border-slate-800 bg-slate-900/90 flex flex-col sm:flex-row gap-2.5">
            <button
              onClick={handleOpenDeviceMockup}
              className="flex-1 py-2.5 px-4 rounded-xl text-xs sm:text-sm font-semibold flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white transition-all shadow-lg shadow-indigo-600/30"
            >
              <Smartphone className="w-4 h-4" />
              <span>Preview on Phone Lockscreen</span>
            </button>

            <button
              onClick={handleDownload}
              className="flex-1 py-2.5 px-4 rounded-xl text-xs sm:text-sm font-semibold flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors border border-slate-700"
            >
              <Download className="w-4 h-4" />
              <span>Download Wallpaper (PNG)</span>
            </button>

            <button
              onClick={() => generateImage(aspectRatio)}
              className="py-2.5 px-4 rounded-xl text-xs font-medium flex items-center justify-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors border border-slate-700"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Regenerate</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
