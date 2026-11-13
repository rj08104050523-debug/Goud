import React, { useState } from 'react';
import { X, Key, Shield, Copy, Check, AlertTriangle, Clock } from 'lucide-react';

interface RoomDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  tournamentTitle: string;
  game: string;
  map: string;
  matchTime: string;
  roomId: string;
  roomPassword: string;
}

export const RoomDetailsModal: React.FC<RoomDetailsModalProps> = ({
  isOpen,
  onClose,
  tournamentTitle,
  game,
  map,
  matchTime,
  roomId,
  roomPassword,
}) => {
  const [copiedId, setCopiedId] = useState(false);
  const [copiedPass, setCopiedPass] = useState(false);

  if (!isOpen) return null;

  const handleCopyId = () => {
    navigator.clipboard.writeText(roomId);
    setCopiedId(true);
    setTimeout(() => setCopiedId(false), 2000);
  };

  const handleCopyPass = () => {
    navigator.clipboard.writeText(roomPassword);
    setCopiedPass(true);
    setTimeout(() => setCopiedPass(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
      <div className="relative w-full max-w-md bg-zinc-950 border border-emerald-500/60 rounded-2xl overflow-hidden shadow-[0_0_50px_rgba(16,185,129,0.3)] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-zinc-800 bg-gradient-to-r from-emerald-950/60 to-zinc-900">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/20 border border-emerald-500 flex items-center justify-center text-emerald-400">
              <Key className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-display font-black text-lg text-white leading-none">
                CUSTOM ROOM CREDENTIALS
              </h3>
              <p className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider mt-0.5">
                CONFIDENTIAL · REGISTERED PLAYERS ONLY
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 space-y-4">
          <div className="p-3 bg-zinc-900/60 border border-zinc-800 rounded-xl space-y-1">
            <h4 className="text-xs font-bold text-white truncate">{tournamentTitle}</h4>
            <div className="flex items-center gap-2 text-[11px] text-zinc-400">
              <span className="text-amber-400 font-bold">{game}</span>
              <span>·</span>
              <span>Map: {map}</span>
              <span>·</span>
              <span className="flex items-center gap-1 text-emerald-400 font-mono-num font-bold">
                <Clock className="w-3 h-3" />
                {matchTime}
              </span>
            </div>
          </div>

          {/* Credentials Display Cards */}
          <div className="space-y-3">
            {/* Room ID */}
            <div className="p-3 bg-black border-2 border-emerald-500/80 rounded-xl flex items-center justify-between shadow-[0_0_20px_rgba(16,185,129,0.2)]">
              <div>
                <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block">
                  CUSTOM ROOM ID
                </span>
                <span className="font-mono text-xl sm:text-2xl font-black text-white tracking-widest block select-all">
                  {roomId}
                </span>
              </div>
              <button
                onClick={handleCopyId}
                className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-black font-bold text-xs rounded-lg flex items-center gap-1.5 transition-colors"
              >
                {copiedId ? (
                  <>
                    <Check className="w-3.5 h-3.5" />
                    <span>COPIED</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>COPY ID</span>
                  </>
                )}
              </button>
            </div>

            {/* Room Password */}
            <div className="p-3 bg-black border-2 border-amber-500/80 rounded-xl flex items-center justify-between shadow-[0_0_20px_rgba(245,158,11,0.2)]">
              <div>
                <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block">
                  ROOM PASSWORD
                </span>
                <span className="font-mono text-xl sm:text-2xl font-black text-amber-300 tracking-widest block select-all">
                  {roomPassword}
                </span>
              </div>
              <button
                onClick={handleCopyPass}
                className="px-3 py-1.5 bg-amber-500 hover:bg-amber-400 text-black font-bold text-xs rounded-lg flex items-center gap-1.5 transition-colors"
              >
                {copiedPass ? (
                  <>
                    <Check className="w-3.5 h-3.5" />
                    <span>COPIED</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>COPY PASS</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Strict Match Instructions */}
          <div className="p-3.5 bg-zinc-900 border border-zinc-800 rounded-xl space-y-1.5 text-xs text-zinc-300">
            <div className="flex items-center gap-1.5 text-amber-400 font-bold mb-1">
              <AlertTriangle className="w-4 h-4 shrink-0" />
              <span>Mandatory Match Rules</span>
            </div>
            <p>1. Open {game} app ➜ Select Custom Room ➜ Paste ID & Password.</p>
            <p>2. Sit strictly in your allotted slot number to avoid disqualification.</p>
            <p>3. Do not share room credentials with non-registered players under penalty of permanent ban.</p>
            <p>4. Take a screenshot of your final match score screen for automated prize distribution.</p>
          </div>

          <button
            onClick={onClose}
            className="w-full py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-bold rounded-xl transition-colors"
          >
            I Understand & Close
          </button>
        </div>
      </div>
    </div>
  );
};
