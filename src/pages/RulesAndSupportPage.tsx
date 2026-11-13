import React, { useState } from 'react';
import { ShieldCheck, MessageCircle, HelpCircle, FileText, ChevronDown, ChevronUp, AlertTriangle } from 'lucide-react';

export const RulesAndSupportPage: React.FC = () => {
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  const faqs = [
    {
      q: 'How do I receive the Custom Room ID and Password after booking a slot?',
      a: '15 minutes before the match start time, the tournament organizer releases the Room ID and Password on the platform. Eligible registered players will see an active green "View Room ID & Password" button in their Dashboard and Tournament card. It will also be sent via notification.',
    },
    {
      q: 'When and how are winning cash prizes transferred to my account?',
      a: 'Once the match concludes and the final killfeed & placement rankings are verified by our referees, the prize pool is automatically credited to the winners\' Winning Balance in their Dev eSports wallet. You can withdraw this directly to GooglePay, PhonePe, Paytm or Bank via UPI, and it is settled within 15 minutes to 2 hours.',
    },
    {
      q: 'Are PC Emulators (Bluestacks, LDPlayer, etc.) allowed in Free Fire or BGMI tournaments?',
      a: 'NO. PC Emulators, iPads with third-party macro software, and rooted/jailbroken devices with modified APKs are strictly prohibited. All tournaments are strictly for mobile smartphone devices (Android & iOS). Any player detected using an emulator will be immediately disqualified with zero refund and their account permanently banned.',
    },
    {
      q: 'What should I do if another player is suspected of cheating or teaming?',
      a: 'Take an in-game screen recording of the suspect\'s kill cam or spectator view, note their In-Game Name and UID, and report it directly to our 24/7 WhatsApp referee support team. We review all kill feeds before distributing tournament prizes.',
    },
    {
      q: 'What is the refund policy if a tournament gets cancelled or delayed?',
      a: 'If a match cannot be hosted due to game server maintenance or technical disruption, 100% of the tournament entry fee is immediately refunded back to all registered players\' wallet balances without any deduction.',
    },
  ];

  return (
    <div className="space-y-10 max-w-5xl mx-auto">
      {/* Header */}
      <div className="p-6 sm:p-8 rounded-3xl bg-zinc-950 border border-zinc-800 text-center space-y-2">
        <span className="text-xs font-bold text-emerald-400 uppercase tracking-widest block">
          OFFICIAL DEV ESPORTS RULEBOOK & SUPPORT
        </span>
        <h1 className="font-display font-black text-3xl sm:text-5xl text-white tracking-tight uppercase">
          Fair Play & Tournament Guidelines
        </h1>
        <p className="text-xs sm:text-sm text-zinc-400 max-w-xl mx-auto">
          Everything you need to know about slot bookings, custom room etiquette, anti-cheat enforcement, and instant UPI payouts.
        </p>
      </div>

      {/* 24/7 WhatsApp Support Strip */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-emerald-950/60 to-black border-2 border-emerald-500/60 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xl">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-emerald-500 text-black flex items-center justify-center shrink-0">
            <MessageCircle className="w-7 h-7" />
          </div>
          <div>
            <h3 className="font-display font-black text-lg text-white">
              Need Instant Help or Room Password Support?
            </h3>
            <p className="text-xs text-zinc-300">
              Dev eSports organizers and match referees are live 24/7 on WhatsApp.
            </p>
          </div>
        </div>

        <a
          href="https://chat.whatsapp.com/DevEsportsOfficial"
          target="_blank"
          rel="noreferrer"
          className="px-5 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-black font-display font-black text-xs uppercase tracking-wider rounded-xl shadow-lg shrink-0"
        >
          OPEN WHATSAPP CHAT
        </a>
      </div>

      {/* Strict Anti-Cheat & Fair Play Pledge */}
      <div className="p-6 sm:p-8 rounded-3xl bg-zinc-950 border border-red-500/40 space-y-4">
        <div className="flex items-center gap-2.5 text-red-400">
          <AlertTriangle className="w-6 h-6 shrink-0" />
          <h2 className="font-display font-black text-2xl text-white uppercase tracking-wide">
            Zero Tolerance Anti-Cheat Enforcement
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-zinc-300">
          <div className="p-3.5 bg-black/60 border border-zinc-800 rounded-xl space-y-1">
            <h4 className="font-bold text-white text-sm">1. Hardware & Emulator Rules</h4>
            <p className="text-zinc-400 leading-relaxed">
              Only authentic mobile phones (Android / iOS) are permitted. Emulators, keyboard-mouse converters, and third-party aim assistance tools trigger automatic disqualification.
            </p>
          </div>

          <div className="p-3.5 bg-black/60 border border-zinc-800 rounded-xl space-y-1">
            <h4 className="font-bold text-white text-sm">2. Cross-Teaming & Slot Jumping</h4>
            <p className="text-zinc-400 leading-relaxed">
              Teaming between opposing players or sitting in slots not allotted to you in the custom room will lead to instant match kick by our spectator referee.
            </p>
          </div>

          <div className="p-3.5 bg-black/60 border border-zinc-800 rounded-xl space-y-1">
            <h4 className="font-bold text-white text-sm">3. Verification of In-Game UIDs</h4>
            <p className="text-zinc-400 leading-relaxed">
              The player name and UID entered during tournament registration must strictly match the character inside the custom room. Impersonators will not receive prizes.
            </p>
          </div>

          <div className="p-3.5 bg-black/60 border border-zinc-800 rounded-xl space-y-1">
            <h4 className="font-bold text-white text-sm">4. Result Validation & Screenshots</h4>
            <p className="text-zinc-400 leading-relaxed">
              Winners are advised to capture a screenshot of the Booyah / Chicken Dinner screen and final kill count to verify any score disputes with the administrator.
            </p>
          </div>
        </div>
      </div>

      {/* Frequently Asked Questions */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <HelpCircle className="w-5 h-5 text-purple-400" />
          <h2 className="font-display font-black text-2xl text-white tracking-wide uppercase">
            Frequently Asked Questions
          </h2>
        </div>

        <div className="space-y-2">
          {faqs.map((faq, index) => {
            const isOpen = openFaqIndex === index;
            return (
              <div
                key={index}
                className="bg-zinc-950 border border-zinc-800 rounded-2xl overflow-hidden"
              >
                <button
                  onClick={() => setOpenFaqIndex(isOpen ? null : index)}
                  className="w-full p-4 text-left flex items-center justify-between text-xs sm:text-sm font-bold text-white hover:text-emerald-400 transition-colors"
                >
                  <span>{faq.q}</span>
                  {isOpen ? <ChevronUp className="w-4 h-4 text-emerald-400 shrink-0" /> : <ChevronDown className="w-4 h-4 text-zinc-500 shrink-0" />}
                </button>
                {isOpen && (
                  <div className="p-4 pt-0 text-xs text-zinc-400 border-t border-zinc-900/60 leading-relaxed">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Policies Summary Card */}
      <div className="p-6 bg-zinc-950 border border-zinc-800 rounded-2xl space-y-4 text-xs text-zinc-400">
        <div className="flex items-center gap-2 text-white font-display font-black text-lg">
          <FileText className="w-5 h-5 text-cyan-400" />
          <span>LEGAL, PRIVACY & REFUND TERMS</span>
        </div>
        <p>
          Dev eSports operates as a skill-based competitive gaming platform in accordance with applicable Indian laws governing games of skill. All users must be 18 years or older. Deposited wallet funds are strictly used for tournament entry fee bookings, and winning prize amounts can be withdrawn directly via UPI to verified bank accounts.
        </p>
      </div>
    </div>
  );
};
