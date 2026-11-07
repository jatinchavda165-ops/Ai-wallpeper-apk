import React, { useState } from 'react';
import { BookOpen, Copy, Check, Lightbulb, ShieldAlert, Cpu } from 'lucide-react';
import { PROMPT_FORMULA_STEPS } from '../data/curatedPrompts';

export const PromptFormulaGuide: React.FC = () => {
  const [copiedFormula, setCopiedFormula] = useState(false);
  const [copiedNeg, setCopiedNeg] = useState(false);

  const goldenFormula =
    '[Subject / Main Focus] + [Art Style / Medium] + [Lighting & Atmosphere] + [Camera Lens / Viewpoint] + [Color Palette / Mood] + [Unreal Engine 5 / Octane Render 8K] + [--ar 9:16]';

  const masterNegativePrompt =
    'blurry, noisy, low resolution, jpeg artifacts, text, watermark, signature, cropped, bad anatomy, deformed, oversaturated flat colors';

  const copyText = (text: string, type: 'formula' | 'neg') => {
    navigator.clipboard.writeText(text);
    if (type === 'formula') {
      setCopiedFormula(true);
      setTimeout(() => setCopiedFormula(false), 2000);
    } else {
      setCopiedNeg(true);
      setTimeout(() => setCopiedNeg(false), 2000);
    }
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl space-y-8">
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold mb-2">
          <BookOpen className="w-3.5 h-3.5" />
          Wallpaper Prompt Engineering Masterclass
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          AI वॉलपेपर के लिए बेस्ट प्रॉम्प्ट कैसे लिखें? (Complete Formula Guide)
        </h2>
        <p className="text-sm text-slate-400 mt-1 max-w-3xl">
          अगर आप Midjourney, Stable Diffusion, DALL-E 3, या Google Gemini से मोबाइल और डेस्कटॉप के लिए वॉलपेपर बना रहे हैं, तो नीचे दिए गए 5-स्टेप फॉर्मूले से हर बार 4K अल्ट्रा-एचडी वॉलपेपर बनेगा।
        </p>
      </div>

      {/* The Master Formula Box */}
      <div className="p-5 sm:p-6 bg-slate-950 rounded-2xl border border-indigo-500/40 relative">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-300">
              The Golden Formula (गोल्डन फॉर्मूला)
            </span>
          </div>
          <button
            onClick={() => copyText(goldenFormula, 'formula')}
            className="flex items-center gap-1.5 py-1.5 px-3 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold transition-all"
          >
            {copiedFormula ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copiedFormula ? 'Copied' : 'Copy Formula'}</span>
          </button>
        </div>

        <div className="p-3.5 bg-slate-900/90 rounded-xl border border-slate-800 font-mono text-xs sm:text-sm text-indigo-200 leading-relaxed select-all">
          {goldenFormula}
        </div>
      </div>

      {/* 5-Step Breakdown */}
      <div>
        <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
          <span>फॉर्मूले के 5 महत्वपूर्ण नियम (5 Golden Steps):</span>
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {PROMPT_FORMULA_STEPS.map((s, idx) => (
            <div
              key={idx}
              className="p-5 bg-slate-950 rounded-2xl border border-slate-800 hover:border-indigo-500/30 transition-colors flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="w-7 h-7 rounded-xl bg-indigo-600/20 text-indigo-400 font-bold text-xs flex items-center justify-center border border-indigo-500/30">
                    {s.step}
                  </span>
                  <span className="text-[11px] font-mono text-slate-400 font-semibold px-2 py-0.5 rounded bg-slate-900 border border-slate-800">
                    {s.tag}
                  </span>
                </div>
                <h4 className="text-sm font-bold text-white mb-1">{s.titleHi}</h4>
                <p className="text-xs text-indigo-400 font-medium mb-2">{s.titleEn}</p>
                <p className="text-xs text-slate-300 leading-relaxed mb-2">{s.descHi}</p>
              </div>
              <p className="text-[11px] text-slate-400 italic pt-2 border-t border-slate-800/80">
                {s.descEn}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Pro Tips: Screen Design & Ratio Rules */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-2">
        {/* Mobile & AMOLED Tips */}
        <div className="p-5 bg-slate-950 rounded-2xl border border-slate-800 space-y-3">
          <div className="flex items-center gap-2 text-indigo-400">
            <Lightbulb className="w-5 h-5 text-amber-400" />
            <h4 className="font-bold text-white text-sm">फोन वॉलपेपर के लिए सीक्रेट टिप्स (Secret Tips):</h4>
          </div>
          <ul className="space-y-2.5 text-xs text-slate-300">
            <li className="flex items-start gap-2">
              <span className="text-indigo-400 font-bold">•</span>
              <span>
                <strong>--ar 9:16 आस्पेक्ट रेशियो:</strong> हर मोबाइल (iPhone, Samsung, Xiaomi) के लिए यह अनिवार्य है। अगर यह नहीं देंगे तो फोटो चौकोर बनेगी और फोन में ज़ूम होकर कट जाएगी।
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-indigo-400 font-bold">•</span>
              <span>
                <strong>AMOLED के लिए "Pitch Black #000000":</strong> OLED स्क्रीन में काला रंग पिक्सल को बंद कर देता है जिससे बैटरी बचती है और नीयन रंग खिल उठते हैं।
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-indigo-400 font-bold">•</span>
              <span>
                <strong>ऊपरी हिस्से में खाली जगह (Negative Space):</strong> ध्यान रखें कि स्क्रीन के ऊपर घड़ी और तारीख आती है, इसलिए सब्जेक्ट को बीच में या नीचे की तरफ रखें।
              </span>
            </li>
          </ul>
        </div>

        {/* High Performance Keywords Dictionary */}
        <div className="p-5 bg-slate-950 rounded-2xl border border-slate-800 space-y-3">
          <div className="flex items-center gap-2 text-indigo-400">
            <Cpu className="w-5 h-5 text-indigo-400" />
            <h4 className="font-bold text-white text-sm">जादुई कीवर्ड्स (Power Keywords for AI):</h4>
          </div>
          <div className="space-y-2 text-xs">
            <div>
              <span className="text-indigo-300 font-semibold block mb-0.5">Lighting (रोशनी):</span>
              <p className="text-slate-400 font-mono text-[11px] bg-slate-900 p-1.5 rounded border border-slate-800">
                Volumetric god rays, Bioluminescent glow, Ray-traced caustics, Cyberpunk neon rim light
              </p>
            </div>
            <div>
              <span className="text-indigo-300 font-semibold block mb-0.5">Render Engine (इंजन):</span>
              <p className="text-slate-400 font-mono text-[11px] bg-slate-900 p-1.5 rounded border border-slate-800">
                Unreal Engine 5, Octane Render 8K, Redshift, Hasselblad H6D-100c
              </p>
            </div>
            <div>
              <span className="text-indigo-300 font-semibold block mb-0.5">Atmosphere (माहौल):</span>
              <p className="text-slate-400 font-mono text-[11px] bg-slate-900 p-1.5 rounded border border-slate-800">
                Ethereal fog, Floating stardust particles, Iridescent chromatic dispersion
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Universal Negative Prompt */}
      <div className="p-5 bg-rose-950/20 border border-rose-900/40 rounded-2xl">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2 text-rose-400">
            <ShieldAlert className="w-4 h-4" />
            <span className="text-xs font-bold uppercase tracking-wider">
              Universal Negative Prompt (खराब इमेज से बचने के लिए)
            </span>
          </div>
          <button
            onClick={() => copyText(masterNegativePrompt, 'neg')}
            className="flex items-center gap-1.5 py-1 px-2.5 rounded-lg bg-rose-900/40 hover:bg-rose-900/60 text-rose-200 text-xs font-semibold border border-rose-700/50 transition-colors"
          >
            {copiedNeg ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copiedNeg ? 'Copied' : 'Copy Negative'}</span>
          </button>
        </div>
        <p className="text-xs font-mono text-rose-200/90 leading-relaxed select-all">
          {masterNegativePrompt}
        </p>
      </div>
    </div>
  );
};
