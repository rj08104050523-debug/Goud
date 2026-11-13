import React from 'react';
import { Flame, ShieldCheck, Zap, Headphones, MessageCircle } from 'lucide-react';

interface FooterProps {
  onSelectTab: (tab: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onSelectTab }) => {
  return (
    <footer className="bg-zinc-950 border-t border-zinc-900 mt-16 text-zinc-400 text-xs">
      {/* 3 Core Trust Pillars Strip */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 border-b border-zinc-900 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="flex items-center gap-3.5 p-4 rounded-2xl bg-zinc-900/40 border border-zinc-800/80">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
            <Zap className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-display font-black text-sm text-white uppercase tracking-wider">
              Instant UPI Withdrawals
            </h4>
            <p className="text-[11px] text-zinc-500 mt-0.5">
              Automated 15-minute cash settlements to GooglePay, PhonePe, Paytm or Bank.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3.5 p-4 rounded-2xl bg-zinc-900/40 border border-zinc-800/80">
          <div className="w-10 h-10 rounded-xl bg-purple-500/20 border border-purple-500/40 flex items-center justify-center text-purple-400">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-display font-black text-sm text-white uppercase tracking-wider">
              100% Anti-Cheat & Fair Play
            </h4>
            <p className="text-[11px] text-zinc-500 mt-0.5">
              Live spectator referees, strict emulator bans, and verified in-game character UIDs.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3.5 p-4 rounded-2xl bg-zinc-900/40 border border-zinc-800/80">
          <div className="w-10 h-10 rounded-xl bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-400">
            <Headphones className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-display font-black text-sm text-white uppercase tracking-wider">
              24/7 WhatsApp Community
            </h4>
            <p className="text-[11px] text-zinc-500 mt-0.5">
              Instant match room passwords, dispute resolutions, and slot booking assistance.
            </p>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 grid grid-cols-2 md:grid-cols-4 gap-8">
        <div>
          <div className="flex items-center gap-2 mb-3">
            <div className="w-7 h-7 rounded-lg bg-emerald-500 flex items-center justify-center text-black">
              <Flame className="w-4 h-4 fill-current" />
            </div>
            <span className="font-display font-black text-lg text-white tracking-wider">
              DEV ESPORTS
            </span>
          </div>
          <p className="text-[11px] text-zinc-500 leading-relaxed">
            India&apos;s premier competitive esports arena for Free Fire MAX and BGMI battle royale players. Turn your gameplay skills into real daily cash winnings.
          </p>
          <div className="mt-3">
            <a
              href="https://chat.whatsapp.com/DevEsportsOfficial"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 px-3 py-1.5 bg-emerald-950/60 border border-emerald-500/60 rounded-lg text-emerald-400 font-bold text-xs hover:bg-emerald-900/60 transition-colors"
            >
              <MessageCircle className="w-3.5 h-3.5" />
              <span>Join WhatsApp Group</span>
            </a>
          </div>
        </div>

        <div>
          <h4 className="font-display font-black text-xs text-white uppercase tracking-wider mb-3">
            Tournaments
          </h4>
          <ul className="space-y-2 text-xs">
            <li>
              <button onClick={() => onSelectTab('free-fire')} className="hover:text-emerald-400 transition-colors">
                Free Fire MAX Solo
              </button>
            </li>
            <li>
              <button onClick={() => onSelectTab('free-fire')} className="hover:text-emerald-400 transition-colors">
                Free Fire Clash Squad
              </button>
            </li>
            <li>
              <button onClick={() => onSelectTab('bgmi')} className="hover:text-cyan-400 transition-colors">
                BGMI Erangel Squad
              </button>
            </li>
            <li>
              <button onClick={() => onSelectTab('bgmi')} className="hover:text-cyan-400 transition-colors">
                BGMI Miramar Snipers
              </button>
            </li>
            <li>
              <button onClick={() => onSelectTab('tournaments')} className="hover:text-white transition-colors">
                All Daily Cash Matches
              </button>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="font-display font-black text-xs text-white uppercase tracking-wider mb-3">
            Support & Community
          </h4>
          <ul className="space-y-2 text-xs">
            <li>
              <button onClick={() => onSelectTab('rules')} className="hover:text-white transition-colors">
                Tournament Rules
              </button>
            </li>
            <li>
              <button onClick={() => onSelectTab('rules')} className="hover:text-white transition-colors">
                Anti-Cheat & Fair Play Pledge
              </button>
            </li>
            <li>
              <button onClick={() => onSelectTab('rules')} className="hover:text-white transition-colors">
                Frequently Asked Questions
              </button>
            </li>
            <li>
              <a href="mailto:support@devesports.com" className="hover:text-white transition-colors">
                support@devesports.com
              </a>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="font-display font-black text-xs text-white uppercase tracking-wider mb-3">
            Security & Admin
          </h4>
          <ul className="space-y-2 text-xs">
            <li>
              <button onClick={() => onSelectTab('rules')} className="hover:text-white transition-colors">
                Terms & Conditions
              </button>
            </li>
            <li>
              <button onClick={() => onSelectTab('rules')} className="hover:text-white transition-colors">
                Refund & Payout Policy
              </button>
            </li>
            <li>
              <button onClick={() => onSelectTab('rules')} className="hover:text-white transition-colors">
                Privacy Policy
              </button>
            </li>
            <li>
              <button onClick={() => onSelectTab('admin')} className="text-purple-400 hover:text-purple-300 font-bold">
                Admin Control Login →
              </button>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-zinc-900 py-6 px-4 text-center text-[11px] text-zinc-600">
        <p>© 2026 DEV ESPORTS PLATFORM. All rights reserved. Free Fire MAX and BGMI are registered trademarks of their respective owners.</p>
        <p className="mt-1 text-zinc-500">
          DEV ESPORTS – PLAY. COMPETE. CONQUER.
        </p>
      </div>
    </footer>
  );
};
