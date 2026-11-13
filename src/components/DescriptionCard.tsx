import React, { useState } from 'react';
import { Copy, Check, ExternalLink, Globe, MessageCircle } from 'lucide-react';
import { generateVideoDescription } from '../utils/promoLogic';

interface DescriptionCardProps {
  websiteUrl: string;
  whatsappUrl: string;
  onUpdateWebsite: (url: string) => void;
  onUpdateWhatsapp: (url: string) => void;
}

export const DescriptionCard: React.FC<DescriptionCardProps> = ({
  websiteUrl,
  whatsappUrl,
  onUpdateWebsite,
  onUpdateWhatsapp,
}) => {
  const [copied, setCopied] = useState(false);
  const fullDescription = generateVideoDescription(websiteUrl, whatsappUrl);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(fullDescription);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // fallback
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="w-full bg-zinc-950 border border-zinc-800 rounded-2xl p-5 shadow-2xl space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-zinc-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xl">🔥</span>
            <h2 className="font-display font-black text-xl text-white tracking-wide">
              VIDEO DESCRIPTION (YOUTUBE / REELS / SHORTS)
            </h2>
          </div>
          <p className="text-xs text-zinc-400 mt-0.5">
            Add this description under your video on YouTube, Instagram, and WhatsApp Status.
          </p>
        </div>

        <button
          onClick={handleCopy}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
            copied
              ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-900/30'
              : 'bg-red-600 hover:bg-red-500 text-white shadow-lg shadow-red-900/30'
          }`}
        >
          {copied ? (
            <>
              <Check className="w-4 h-4" />
              <span>COPIED TO CLIPBOARD!</span>
            </>
          ) : (
            <>
              <Copy className="w-4 h-4" />
              <span>COPY DESCRIPTION</span>
            </>
          )}
        </button>
      </div>

      {/* Link Customizer Inputs */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 p-3 bg-zinc-900/60 rounded-xl border border-zinc-800/80">
        <div>
          <label className="flex items-center gap-1.5 text-xs font-bold text-zinc-300 mb-1.5">
            <Globe className="w-3.5 h-3.5 text-red-400" />
            <span>Website Link (apni website ki link):</span>
          </label>
          <input
            type="url"
            value={websiteUrl}
            onChange={(e) => onUpdateWebsite(e.target.value)}
            placeholder="https://devesports.in"
            className="w-full px-3 py-1.5 bg-black border border-zinc-700 rounded-lg text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-red-500 font-mono-num"
          />
        </div>

        <div>
          <label className="flex items-center gap-1.5 text-xs font-bold text-zinc-300 mb-1.5">
            <MessageCircle className="w-3.5 h-3.5 text-emerald-400" />
            <span>WhatsApp Group Link (apni WhatsApp link):</span>
          </label>
          <input
            type="url"
            value={whatsappUrl}
            onChange={(e) => onUpdateWhatsapp(e.target.value)}
            placeholder="https://chat.whatsapp.com/DevEsportsOfficial"
            className="w-full px-3 py-1.5 bg-black border border-zinc-700 rounded-lg text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-emerald-500 font-mono-num"
          />
        </div>
      </div>

      {/* Formatted Output Box */}
      <div className="relative group">
        <pre className="w-full p-4 bg-zinc-900 border border-zinc-800 rounded-xl font-mono text-xs sm:text-sm text-zinc-200 whitespace-pre-wrap leading-relaxed select-all">
          {fullDescription}
        </pre>
      </div>

      {/* Quick Action Links */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-2 text-xs text-zinc-400">
        <div className="flex items-center gap-4">
          <a
            href={websiteUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 text-red-400 hover:text-red-300 transition-colors"
          >
            <span>Test Website Link</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 text-emerald-400 hover:text-emerald-300 transition-colors"
          >
            <span>Test WhatsApp Link</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>

        <span className="text-[11px] text-zinc-500">
          Formatted for YouTube Shorts, Instagram Reels & Telegram
        </span>
      </div>
    </div>
  );
};
