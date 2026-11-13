import React, { useState } from 'react';
import { X, Trophy, Shield, Users, Clock, CheckCircle } from 'lucide-react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  websiteUrl: string;
  whatsappUrl: string;
}

export const TournamentLobbyModal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  websiteUrl,
  whatsappUrl,
}) => {
  const [selectedGame, setSelectedGame] = useState<'ff' | 'pubg'>('ff');
  const [playerInGameId, setPlayerInGameId] = useState('');
  const [phone, setPhone] = useState('');
  const [registered, setRegistered] = useState(false);

  if (!isOpen) return null;

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (!playerInGameId || !phone) return;
    setRegistered(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
      <div className="relative w-full max-w-lg bg-zinc-950 border border-zinc-800 rounded-2xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="flex items-center justify-between p-4 border-b border-zinc-800 bg-zinc-900/50">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg overflow-hidden border border-amber-500">
              <img 
                src="/src/assets/images/devesports_logo_emblem_1794469072892.jpg" 
                alt="Dev eSports" 
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <h3 className="text-base font-bold text-white leading-none">
                Dev eSports Tournament Lobby
              </h3>
              <p className="text-xs text-zinc-400 mt-0.5">
                Official Free Fire & PUBG Cash Matches
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Close tournament lobby"
            className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-5 overflow-y-auto space-y-4">
          {/* Game Selector Tabs */}
          <div className="grid grid-cols-2 gap-2 p-1 bg-zinc-900 rounded-xl border border-zinc-800">
            <button
              onClick={() => setSelectedGame('ff')}
              className={`py-2 px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                selectedGame === 'ff'
                  ? 'bg-red-600 text-white shadow-md'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              <span>🔥</span>
              <span>FREE FIRE MAX</span>
            </button>
            <button
              onClick={() => setSelectedGame('pubg')}
              className={`py-2 px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                selectedGame === 'pubg'
                  ? 'bg-amber-600 text-white shadow-md'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              <span>🍗</span>
              <span>PUBG / BGMI</span>
            </button>
          </div>

          {/* Active Tournament Details Card */}
          <div className="p-4 bg-zinc-900/60 border border-zinc-800 rounded-xl space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-red-400 uppercase tracking-wider block">
                  {selectedGame === 'ff' ? 'Free Fire Solo Championship' : 'PUBG Squad Erangel War'}
                </span>
                <span className="text-lg font-black text-white font-display">
                  Prize Pool: {selectedGame === 'ff' ? '₹2,000 Cash' : '₹5,000 Cash'}
                </span>
              </div>
              <div className="text-right">
                <span className="text-[11px] text-zinc-400 block">Entry Fee</span>
                <span className="text-base font-black text-amber-400 font-mono-num">
                  {selectedGame === 'ff' ? '₹20' : '₹50'}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2 pt-2 border-t border-zinc-800 text-[11px] text-zinc-300">
              <div className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-amber-400" />
                <span>{selectedGame === 'ff' ? '04:00 PM' : '06:30 PM'}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5 text-blue-400" />
                <span>42 / 48 Slots</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Shield className="w-3.5 h-3.5 text-emerald-400" />
                <span>Anti-Cheat ON</span>
              </div>
            </div>
          </div>

          {/* Registration Form */}
          {registered ? (
            <div className="p-4 bg-emerald-950/40 border border-emerald-500/60 rounded-xl text-center space-y-2">
              <CheckCircle className="w-10 h-10 text-emerald-400 mx-auto" />
              <h4 className="text-base font-bold text-white">Slot Confirmed!</h4>
              <p className="text-xs text-zinc-300">
                Custom Room ID & Password will be shared on WhatsApp 15 minutes before match start.
              </p>
              <div className="pt-2 flex justify-center gap-2">
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-lg inline-flex items-center gap-2"
                >
                  Join WhatsApp Group
                </a>
                <button
                  onClick={() => setRegistered(false)}
                  className="px-3 py-2 bg-zinc-800 hover:bg-zinc-700 text-xs text-zinc-300 rounded-lg"
                >
                  Register Another
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleRegister} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-zinc-300 mb-1">
                  In-Game Character ID (UID) & Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 583920194 (Dev_Sniper)"
                  value={playerInGameId}
                  onChange={(e) => setPlayerInGameId(e.target.value)}
                  className="w-full px-3 py-2 bg-zinc-900 border border-zinc-700 rounded-lg text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-red-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-zinc-300 mb-1">
                  WhatsApp Mobile Number (For Room Password & UPI Prize)
                </label>
                <input
                  type="tel"
                  required
                  placeholder="e.g. 9876543210"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-3 py-2 bg-zinc-900 border border-zinc-700 rounded-lg text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-red-500 font-mono-num"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-gradient-to-r from-red-600 to-amber-600 hover:from-red-500 hover:to-amber-500 text-white font-black text-sm uppercase tracking-wider rounded-xl shadow-lg transition-transform active:scale-[0.99] flex items-center justify-center gap-2"
              >
                <Trophy className="w-4 h-4" />
                <span>Confirm Slot & Book Now</span>
              </button>
            </form>
          )}

          {/* Quick Direct Links */}
          <div className="pt-2 border-t border-zinc-800 flex items-center justify-between text-xs text-zinc-400">
            <a
              href={websiteUrl}
              target="_blank"
              rel="noreferrer"
              className="text-red-400 hover:underline"
            >
              Visit Website →
            </a>
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noreferrer"
              className="text-emerald-400 hover:underline"
            >
              Direct WhatsApp Support →
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
