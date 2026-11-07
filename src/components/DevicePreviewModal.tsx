import React, { useState, useEffect } from 'react';
import { X, Smartphone, Monitor, Download, Sparkles, Copy, Check, Battery, Wifi, Shield } from 'lucide-react';
import { WallpaperPrompt } from '../types/wallpaper';

interface DevicePreviewModalProps {
  prompt: WallpaperPrompt | null;
  customImageUrl?: string | null;
  onClose: () => void;
  onGenerateImage?: (promptText: string) => void;
}

export const DevicePreviewModal: React.FC<DevicePreviewModalProps> = ({
  prompt,
  customImageUrl,
  onClose,
  onGenerateImage,
}) => {
  const [deviceType, setDeviceType] = useState<'iphone' | 'android' | 'desktop'>('iphone');
  const [copied, setCopied] = useState(false);
  const [currentTime, setCurrentTime] = useState('');
  const [currentDate, setCurrentDate] = useState('');

  const displayImage = customImageUrl || prompt?.previewUrl || '';
  const displayTitle = prompt?.title || 'AI Generated Wallpaper';

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(
        now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })
      );
      setCurrentDate(
        now.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  if (!prompt && !customImageUrl) return null;

  const handleCopyPrompt = () => {
    if (prompt?.prompt) {
      navigator.clipboard.writeText(prompt.prompt);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleDownload = () => {
    if (!displayImage) return;
    const link = document.createElement('a');
    link.href = displayImage;
    link.download = `${(prompt?.title || 'wallpaper').toLowerCase().replace(/\s+/g, '-')}.jpg`;
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl max-h-[90vh] bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col md:flex-row">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 z-30 p-2 text-slate-400 hover:text-white bg-slate-800/80 hover:bg-slate-700/80 rounded-full transition-colors"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Left Side: Mockup Preview Display */}
        <div className="flex-1 bg-gradient-to-b from-slate-950 to-slate-900 flex flex-col items-center justify-center p-6 border-b md:border-b-0 md:border-r border-slate-800">
          {/* Device Selector Switcher */}
          <div className="flex items-center gap-1.5 p-1 bg-slate-800/80 rounded-xl mb-5 border border-slate-700/60 text-xs font-medium">
            <button
              onClick={() => setDeviceType('iphone')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
                deviceType === 'iphone'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Smartphone className="w-3.5 h-3.5" />
              iPhone 16 Pro
            </button>
            <button
              onClick={() => setDeviceType('android')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
                deviceType === 'android'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Smartphone className="w-3.5 h-3.5" />
              Android Material
            </button>
            <button
              onClick={() => setDeviceType('desktop')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
                deviceType === 'desktop'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Monitor className="w-3.5 h-3.5" />
              MacBook Monitor
            </button>
          </div>

          {/* Interactive Screen Frames */}
          {deviceType === 'iphone' && (
            <div className="relative w-[260px] h-[520px] rounded-[44px] p-2.5 bg-neutral-800 border-4 border-neutral-700 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.8)] overflow-hidden">
              {/* Dynamic Island */}
              <div className="absolute top-4 left-1/2 -translate-x-1/2 z-20 w-24 h-6 bg-black rounded-full flex items-center justify-end px-2.5">
                <div className="w-2.5 h-2.5 rounded-full bg-neutral-900 border border-neutral-700 mr-1" />
              </div>

              {/* Wallpaper Screen */}
              <div
                className="relative w-full h-full rounded-[36px] overflow-hidden bg-cover bg-center flex flex-col justify-between p-5 text-white select-none"
                style={{ backgroundImage: `url(${displayImage})` }}
              >
                {/* Background Dimmer Overlay for legibility */}
                <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/60 pointer-events-none" />

                {/* Top Status Bar & Clock */}
                <div className="relative z-10 pt-6 text-center">
                  <div className="flex items-center justify-between text-[11px] font-medium text-white/90 px-1 mb-2">
                    <span className="font-semibold">{currentTime}</span>
                    <div className="flex items-center gap-1">
                      <Wifi className="w-3 h-3" />
                      <Battery className="w-3.5 h-3.5" />
                    </div>
                  </div>

                  <p className="text-xs font-medium tracking-wide text-white/80">{currentDate}</p>
                  <h1 className="text-5xl font-extrabold tracking-tight mt-0.5 drop-shadow-md">
                    {currentTime}
                  </h1>
                </div>

                {/* Bottom Lockscreen Actions */}
                <div className="relative z-10 flex items-center justify-between pt-10">
                  <div className="w-9 h-9 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center border border-white/20 text-white/90">
                    <span className="text-xs">🔦</span>
                  </div>
                  <div className="text-[10px] text-white/70 bg-black/30 backdrop-blur-sm px-3 py-1 rounded-full border border-white/10">
                    Swipe up to unlock
                  </div>
                  <div className="w-9 h-9 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center border border-white/20 text-white/90">
                    <span className="text-xs">📷</span>
                  </div>
                </div>

                {/* Home Indicator */}
                <div className="absolute bottom-1.5 left-1/2 -translate-x-1/2 w-28 h-1 bg-white/70 rounded-full" />
              </div>
            </div>
          )}

          {deviceType === 'android' && (
            <div className="relative w-[260px] h-[520px] rounded-[36px] p-2 bg-neutral-900 border-2 border-neutral-700 shadow-2xl overflow-hidden">
              {/* Camera punch-hole */}
              <div className="absolute top-3.5 left-1/2 -translate-x-1/2 z-20 w-3.5 h-3.5 bg-black rounded-full border border-neutral-800" />

              <div
                className="relative w-full h-full rounded-[28px] overflow-hidden bg-cover bg-center flex flex-col justify-between p-5 text-white select-none"
                style={{ backgroundImage: `url(${displayImage})` }}
              >
                <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/70 pointer-events-none" />

                {/* Android Clock & Widgets */}
                <div className="relative z-10 pt-8">
                  <div className="flex items-center justify-between text-[11px] text-white/80 mb-4 px-1">
                    <span>Airtel 5G</span>
                    <div className="flex items-center gap-1.5">
                      <Wifi className="w-3 h-3" />
                      <Battery className="w-3.5 h-3.5" />
                    </div>
                  </div>

                  <h1 className="text-6xl font-light tracking-normal">{currentTime}</h1>
                  <p className="text-sm font-normal text-white/90 mt-1">{currentDate} • 26°C Sunny</p>

                  <div className="mt-4 p-2.5 rounded-2xl bg-white/15 backdrop-blur-md border border-white/20 text-xs">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                      <span className="font-medium text-white/90">WallpaperCraft AI Active</span>
                    </div>
                  </div>
                </div>

                {/* Fingerprint area */}
                <div className="relative z-10 text-center pb-4">
                  <div className="w-11 h-11 mx-auto rounded-full bg-white/15 backdrop-blur-md border border-white/20 flex items-center justify-center mb-2">
                    <Shield className="w-5 h-5 text-white/80" />
                  </div>
                  <span className="text-[10px] text-white/70">Touch to Unlock</span>
                </div>
              </div>
            </div>
          )}

          {deviceType === 'desktop' && (
            <div className="relative w-full max-w-[380px] aspect-[16/10] rounded-xl p-2 bg-neutral-800 border-2 border-neutral-700 shadow-2xl flex flex-col">
              <div
                className="relative w-full h-full rounded-lg overflow-hidden bg-cover bg-center flex flex-col justify-between p-2 select-none"
                style={{ backgroundImage: `url(${displayImage})` }}
              >
                {/* Menu bar */}
                <div className="w-full h-5 bg-black/40 backdrop-blur-md rounded px-2 flex items-center justify-between text-[9px] text-white/90">
                  <div className="flex items-center gap-2 font-medium">
                    <span></span>
                    <span>WallpaperCraft</span>
                    <span className="opacity-70">File</span>
                    <span className="opacity-70">View</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span>100%</span>
                    <span>{currentTime}</span>
                  </div>
                </div>

                {/* Dock bar */}
                <div className="mx-auto h-7 px-3 bg-white/20 backdrop-blur-lg border border-white/20 rounded-xl flex items-center gap-2 shadow-lg">
                  <div className="w-4 h-4 rounded bg-indigo-500" />
                  <div className="w-4 h-4 rounded bg-sky-400" />
                  <div className="w-4 h-4 rounded bg-emerald-400" />
                  <div className="w-4 h-4 rounded bg-amber-400" />
                  <div className="w-4 h-4 rounded bg-rose-500" />
                </div>
              </div>
            </div>
          )}

          <p className="text-xs text-slate-400 mt-4 text-center">
            {deviceType === 'desktop' ? '16:9 Desktop View' : '9:16 Full Screen Phone Lockscreen'}
          </p>
        </div>

        {/* Right Side: Prompt Details & Action Controls */}
        <div className="flex-1 p-6 flex flex-col justify-between bg-slate-900 overflow-y-auto">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                {prompt?.category || 'Custom Wallpaper'}
              </span>
              <span className="text-xs text-slate-400 font-mono">
                {prompt?.aspectRatio || '9:16'}
              </span>
            </div>

            <h2 className="text-xl font-bold text-white mb-1">{displayTitle}</h2>
            {prompt?.titleHi && (
              <p className="text-sm font-medium text-indigo-300/90 mb-4">{prompt.titleHi}</p>
            )}

            {/* Prompt Box */}
            <div className="mb-4">
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Full AI Prompt
                </label>
                <button
                  onClick={handleCopyPrompt}
                  className="flex items-center gap-1 text-xs text-indigo-400 hover:text-indigo-300 transition-colors"
                >
                  {copied ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span className="text-emerald-400">Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy Prompt</span>
                    </>
                  )}
                </button>
              </div>
              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-xs text-slate-300 font-mono leading-relaxed max-h-36 overflow-y-auto select-all">
                {prompt?.prompt || 'Custom AI Wallpaper Prompt'}
              </div>
            </div>

            {/* Hindi Explanation */}
            {prompt?.hindiDescription && (
              <div className="mb-4 p-3 bg-indigo-950/30 border border-indigo-800/40 rounded-xl text-xs text-indigo-200">
                <span className="font-semibold text-indigo-300 block mb-1">
                  💡 इस वॉलपेपर की विशेषता (Hindi):
                </span>
                <p className="leading-relaxed">{prompt.hindiDescription}</p>
              </div>
            )}

            {/* Negative Prompt */}
            {prompt?.negativePrompt && (
              <div className="mb-4 text-xs">
                <span className="text-slate-400 font-medium block mb-1">Negative Prompt:</span>
                <p className="text-slate-400 bg-slate-950/70 p-2 rounded-lg border border-slate-800/80 font-mono">
                  {prompt.negativePrompt}
                </p>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="pt-4 border-t border-slate-800 flex flex-col sm:flex-row gap-2.5">
            <button
              onClick={handleCopyPrompt}
              className="flex-1 flex items-center justify-center gap-2 py-2.5 px-4 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-sm font-semibold transition-all border border-slate-700"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              {copied ? 'Copied Prompt' : 'Copy Prompt'}
            </button>

            {onGenerateImage && prompt && (
              <button
                onClick={() => {
                  onClose();
                  onGenerateImage(prompt.prompt);
                }}
                className="flex-1 flex items-center justify-center gap-2 py-2.5 px-4 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white rounded-xl text-sm font-semibold shadow-lg shadow-indigo-600/30 transition-all"
              >
                <Sparkles className="w-4 h-4" />
                Generate with AI
              </button>
            )}

            <button
              onClick={handleDownload}
              className="flex items-center justify-center gap-1.5 py-2.5 px-3 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-sm font-medium transition-colors border border-slate-700"
              title="Download image"
            >
              <Download className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
