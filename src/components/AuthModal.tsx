import React, { useState } from 'react';
import { X, Shield, User, Lock, Mail, Phone, Gamepad2, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultTab?: 'login' | 'register';
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  defaultTab = 'login',
}) => {
  const { login, register, quickSwitch } = useAuth();
  const [tab, setTab] = useState<'login' | 'register'>(defaultTab);

  // Form states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [mobile, setMobile] = useState('');
  const [inGameName, setInGameName] = useState('');
  const [ffUid, setFfUid] = useState('');
  const [bgmiId, setBgmiId] = useState('');
  const [preferredGame, setPreferredGame] = useState<'FREE FIRE MAX' | 'BGMI' | 'BOTH'>('BOTH');
  const [preferredRole, setPreferredRole] = useState<'Rusher' | 'Sniper' | 'IGL' | 'Assault' | 'Support'>('Rusher');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);
    const res = await login(email, password);
    setIsSubmitting(false);
    if (res.success) {
      onClose();
    } else {
      setError(res.error || 'Login failed');
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validate that at least IGN is provided and if FF is chosen, prompt or warn if needed
    if (!inGameName.trim()) {
      setError('Please provide your In-Game Name (IGN) to register your gaming passport.');
      return;
    }

    setIsSubmitting(true);
    const res = await register(
      {
        name,
        email,
        mobile,
        inGameName: inGameName.trim(),
        ffUid: ffUid.trim(),
        bgmiId: bgmiId.trim(),
        preferredGame,
        preferredRole,
      },
      password
    );
    setIsSubmitting(false);
    if (res.success) {
      onClose();
    } else {
      setError(res.error || 'Registration failed');
    }
  };

  const handleQuickGamer = async () => {
    await quickSwitch('gamer');
    onClose();
  };

  const handleQuickAdmin = async () => {
    await quickSwitch('admin');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
      <div className="relative w-full max-w-md bg-zinc-950 border border-zinc-800 rounded-2xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-zinc-800 bg-zinc-900/60">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 font-display font-black text-sm">
              DEV
            </div>
            <div>
              <h3 className="font-display font-black text-lg text-white leading-none">
                {tab === 'login' ? 'SIGN IN TO DEV ESPORTS' : 'CREATE PLAYER ACCOUNT'}
              </h3>
              <p className="text-[11px] text-zinc-400 mt-0.5">
                Play · Compete · Earn Cash Prizes
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

        {/* Tab switch */}
        <div className="flex border-b border-zinc-800 bg-zinc-900/40 text-xs font-bold">
          <button
            onClick={() => {
              setTab('login');
              setError(null);
            }}
            className={`flex-1 py-3 text-center transition-colors border-b-2 ${
              tab === 'login'
                ? 'border-emerald-500 text-emerald-400 bg-zinc-900/80'
                : 'border-transparent text-zinc-400 hover:text-white'
            }`}
          >
            SIGN IN
          </button>
          <button
            onClick={() => {
              setTab('register');
              setError(null);
            }}
            className={`flex-1 py-3 text-center transition-colors border-b-2 ${
              tab === 'register'
                ? 'border-emerald-500 text-emerald-400 bg-zinc-900/80'
                : 'border-transparent text-zinc-400 hover:text-white'
            }`}
          >
            NEW PLAYER REGISTRATION
          </button>
        </div>

        {/* Quick Demo Fill Bar */}
        <div className="p-3 bg-zinc-900/80 border-b border-zinc-800/80 flex items-center justify-between gap-2 text-xs">
          <span className="text-[11px] font-bold text-zinc-400">⚡ Quick Demo Login:</span>
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={handleQuickGamer}
              className="px-2.5 py-1 bg-emerald-950/60 hover:bg-emerald-900/60 border border-emerald-500/50 text-emerald-300 font-bold text-[11px] rounded-lg transition-colors"
            >
              Demo Gamer
            </button>
            <button
              type="button"
              onClick={handleQuickAdmin}
              className="px-2.5 py-1 bg-purple-950/60 hover:bg-purple-900/60 border border-purple-500/50 text-purple-300 font-bold text-[11px] rounded-lg transition-colors flex items-center gap-1"
            >
              <Shield className="w-3 h-3 text-purple-400" />
              <span>Admin</span>
            </button>
          </div>
        </div>

        {/* Form Body */}
        <div className="p-5 overflow-y-auto space-y-4">
          {error && (
            <div className="p-3 rounded-xl bg-red-950/50 border border-red-500/50 text-xs text-red-200 flex items-center gap-2 animate-in fade-in">
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {tab === 'login' ? (
            <form onSubmit={handleLogin} className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-zinc-300 mb-1">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-zinc-500 absolute left-3 top-2.5" />
                  <input
                    type="email"
                    required
                    placeholder="e.g. gamer@devesports.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 bg-zinc-900 border border-zinc-800 rounded-xl text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-zinc-300 mb-1">
                  Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-zinc-500 absolute left-3 top-2.5" />
                  <input
                    type="password"
                    required
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 bg-zinc-900 border border-zinc-800 rounded-xl text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-2.5 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 text-black font-display font-black text-sm tracking-wider uppercase rounded-xl shadow-lg transition-transform active:scale-[0.99] disabled:opacity-50"
              >
                {isSubmitting ? 'SIGNING IN...' : 'SIGN IN NOW'}
              </button>
            </form>
          ) : (
            <form onSubmit={handleRegister} className="space-y-3">
              <div>
                <label className="block text-[11px] font-bold text-zinc-300 mb-1">
                  Full Name
                </label>
                <div className="relative">
                  <User className="w-3.5 h-3.5 text-zinc-500 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    required
                    placeholder="e.g. Rahul Sharma"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full pl-9 pr-3 py-1.5 bg-zinc-900 border border-zinc-800 rounded-xl text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[11px] font-bold text-zinc-300 mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="you@gmail.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-3 py-1.5 bg-zinc-900 border border-zinc-800 rounded-xl text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-zinc-300 mb-1">
                    Mobile Number
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="9876543210"
                    value={mobile}
                    onChange={(e) => setMobile(e.target.value)}
                    className="w-full px-3 py-1.5 bg-zinc-900 border border-zinc-800 rounded-xl text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-emerald-500 font-mono-num"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-zinc-300 mb-1">
                  In-Game Player Name / Gaming Tag (IGN) *
                </label>
                <div className="relative">
                  <Gamepad2 className="w-3.5 h-3.5 text-emerald-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    required
                    placeholder="e.g. DEV_Destroyer99 or GOD_Clutch"
                    value={inGameName}
                    onChange={(e) => setInGameName(e.target.value)}
                    className="w-full pl-9 pr-3 py-1.5 bg-zinc-900 border border-zinc-800 rounded-xl text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              {/* Game Platform Selection */}
              <div>
                <label className="block text-[11px] font-bold text-zinc-300 mb-1">
                  Primary Tournament Platform
                </label>
                <div className="grid grid-cols-3 gap-1.5 p-1 bg-zinc-900/80 border border-zinc-800 rounded-xl text-[11px] font-bold">
                  <button
                    type="button"
                    onClick={() => setPreferredGame('FREE FIRE MAX')}
                    className={`py-1 rounded-lg transition-colors ${
                      preferredGame === 'FREE FIRE MAX'
                        ? 'bg-amber-500 text-black shadow-sm'
                        : 'text-zinc-400 hover:text-white'
                    }`}
                  >
                    Free Fire MAX
                  </button>
                  <button
                    type="button"
                    onClick={() => setPreferredGame('BGMI')}
                    className={`py-1 rounded-lg transition-colors ${
                      preferredGame === 'BGMI'
                        ? 'bg-cyan-500 text-black shadow-sm'
                        : 'text-zinc-400 hover:text-white'
                    }`}
                  >
                    BGMI
                  </button>
                  <button
                    type="button"
                    onClick={() => setPreferredGame('BOTH')}
                    className={`py-1 rounded-lg transition-colors ${
                      preferredGame === 'BOTH'
                        ? 'bg-emerald-500 text-black shadow-sm'
                        : 'text-zinc-400 hover:text-white'
                    }`}
                  >
                    Both Games
                  </button>
                </div>
              </div>

              {/* Gaming IDs */}
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-[11px] font-bold text-amber-400">
                      Free Fire UID
                    </label>
                    <span className="text-[9px] text-zinc-500">8-10 digits</span>
                  </div>
                  <input
                    type="text"
                    placeholder="e.g. 789234510"
                    value={ffUid}
                    onChange={(e) => setFfUid(e.target.value)}
                    className="w-full px-3 py-1.5 bg-zinc-900 border border-amber-500/40 focus:border-amber-400 rounded-xl text-xs text-white placeholder-zinc-500 focus:outline-none font-mono-num"
                  />
                </div>
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-[11px] font-bold text-cyan-400">
                      BGMI Character ID
                    </label>
                    <span className="text-[9px] text-zinc-500">10 digits</span>
                  </div>
                  <input
                    type="text"
                    placeholder="e.g. 5192837465"
                    value={bgmiId}
                    onChange={(e) => setBgmiId(e.target.value)}
                    className="w-full px-3 py-1.5 bg-zinc-900 border border-cyan-500/40 focus:border-cyan-400 rounded-xl text-xs text-white placeholder-zinc-500 focus:outline-none font-mono-num"
                  />
                </div>
              </div>

              {/* Combat Role */}
              <div>
                <label className="block text-[11px] font-bold text-zinc-300 mb-1">
                  Preferred Combat Role
                </label>
                <div className="grid grid-cols-5 gap-1 text-[10px] font-bold">
                  {(['Rusher', 'Sniper', 'IGL', 'Assault', 'Support'] as const).map((role) => (
                    <button
                      key={role}
                      type="button"
                      onClick={() => setPreferredRole(role)}
                      className={`py-1 rounded-lg border text-center transition-colors ${
                        preferredRole === role
                          ? 'bg-zinc-800 text-emerald-400 border-emerald-500/50'
                          : 'bg-zinc-900/50 text-zinc-400 border-zinc-800 hover:text-white'
                      }`}
                    >
                      {role}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-zinc-300 mb-1">
                  Create Password
                </label>
                <input
                  type="password"
                  required
                  placeholder="Min 6 characters"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-3 py-1.5 bg-zinc-900 border border-zinc-800 rounded-xl text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="p-2.5 rounded-lg bg-emerald-950/30 border border-emerald-500/30 text-[11px] text-emerald-300">
                🎁 <strong>₹50 Welcome Bonus</strong> will be automatically credited to your wallet upon registration!
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-2.5 bg-gradient-to-r from-emerald-500 via-purple-600 to-cyan-500 hover:brightness-110 text-white font-display font-black text-sm tracking-wider uppercase rounded-xl shadow-lg transition-transform active:scale-[0.99] disabled:opacity-50"
              >
                {isSubmitting ? 'CREATING ACCOUNT...' : 'REGISTER & GET ₹50 BONUS'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
