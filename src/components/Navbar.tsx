import React, { useState } from 'react';
import {
  Wallet,
  Bell,
  Shield,
  User,
  LogOut,
  Flame,
  Menu,
  X,
  ExternalLink,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface NavbarProps {
  currentTab: string;
  onSelectTab: (tab: string) => void;
  onOpenAuth: () => void;
  onOpenWallet: () => void;
  unreadCount?: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  onSelectTab,
  onOpenAuth,
  onOpenWallet,
  unreadCount = 0,
}) => {
  const { user, logout, quickSwitch, isAdmin } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);

  const navLinks = [
    { id: 'home', label: 'Home' },
    { id: 'tournaments', label: 'Tournaments' },
    { id: 'free-fire', label: 'Free Fire' },
    { id: 'bgmi', label: 'BGMI' },
    { id: 'leaderboard', label: 'Leaderboard' },
    { id: 'profile', label: 'Profile' },
    { id: 'promo', label: 'Promo' },
    { id: 'rules', label: 'Rules' },
  ];

  return (
    <header className="sticky top-0 z-40 bg-zinc-950/90 backdrop-blur-md border-b border-zinc-800/80">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 h-16 flex items-center justify-between gap-2 sm:gap-4">
        {/* Zone 1: Single text element wordmark with logo */}
        <div className="flex items-center gap-2 whitespace-nowrap shrink-0">
          <button
            onClick={() => onSelectTab('home')}
            className="flex items-center gap-2 text-left group"
          >
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-gradient-to-tr from-emerald-500 via-purple-600 to-cyan-500 p-0.5 shadow-[0_0_20px_rgba(16,185,129,0.4)] group-hover:shadow-[0_0_25px_rgba(139,92,246,0.6)] transition-all">
              <div className="w-full h-full bg-black rounded-[10px] flex items-center justify-center font-display font-black text-white text-base">
                <Flame className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-400 group-hover:text-cyan-400 transition-colors fill-current" />
              </div>
            </div>
            <div>
              <span className="font-display font-black text-lg sm:text-xl tracking-wider text-white flex items-center gap-1 leading-none">
                DEV <span className="text-emerald-400">ESPORTS</span>
              </span>
              <span className="hidden sm:block text-[9px] font-bold tracking-widest text-zinc-400 uppercase leading-none mt-1">
                PLAY · COMPETE · CONQUER
              </span>
            </div>
          </button>
        </div>

        {/* Zone 2: Nav links, single-line */}
        <nav className="hidden lg:flex items-center gap-3.5 xl:gap-5 text-xs font-bold text-zinc-400 whitespace-nowrap shrink-0">
          {navLinks.map((link) => (
            <button
              key={link.id}
              onClick={() => onSelectTab(link.id)}
              className={`hover:text-white transition-colors relative py-1 ${
                currentTab === link.id ? 'text-emerald-400' : ''
              }`}
            >
              {link.label}
              {currentTab === link.id && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-emerald-500 to-purple-500 rounded-full" />
              )}
            </button>
          ))}
        </nav>

        {/* Zone 3: Wallet, Notifications, Admin Portal Switch & User Action */}
        <div className="flex items-center gap-1.5 sm:gap-2.5 whitespace-nowrap shrink-0">
          {/* Fast Role Quick-Switcher for instant seamless testing */}
          <div className="hidden sm:flex items-center bg-zinc-900 border border-zinc-800 rounded-lg p-0.5 text-[11px] font-bold">
            <button
              onClick={() => quickSwitch('gamer')}
              title="Test as Gamer (Aryan Sharma)"
              className={`px-2 py-1 rounded transition-colors ${
                user?.role === 'user'
                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              Gamer
            </button>
            <button
              onClick={() => {
                quickSwitch('admin');
                onSelectTab('admin');
              }}
              title="Test as Chief Admin"
              className={`px-2 py-1 rounded transition-colors flex items-center gap-1 ${
                isAdmin
                  ? 'bg-purple-500/20 text-purple-400 border border-purple-500/40'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              <Shield className="w-3 h-3 text-purple-400" />
              <span>Admin</span>
            </button>
          </div>

          {/* User Wallet Balance Pill */}
          {user && (
            <button
              onClick={onOpenWallet}
              className="px-2 sm:px-2.5 py-1.5 bg-gradient-to-r from-zinc-900 to-emerald-950/40 hover:to-emerald-900/40 border border-emerald-500/50 rounded-xl flex items-center gap-1.5 shadow-sm transition-all"
            >
              <Wallet className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-400 shrink-0" />
              <div className="text-left font-mono-num leading-tight">
                <span className="hidden sm:block text-[9px] text-zinc-400 font-bold leading-none">WALLET</span>
                <span className="text-xs font-black text-emerald-400">
                  ₹{user.walletBalance.toLocaleString('en-IN')}
                </span>
              </div>
            </button>
          )}

          {/* Notifications Button */}
          <button
            onClick={() => onSelectTab('dashboard-notifications')}
            className="relative p-1.5 sm:p-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-300 hover:text-white transition-colors"
            title="Notifications"
          >
            <Bell className="w-4 h-4" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-red-600 text-[10px] font-black text-white flex items-center justify-center font-mono-num animate-pulse">
                {unreadCount}
              </span>
            )}
          </button>

          {/* User Profile or Login Button */}
          {user ? (
            <div className="relative">
              <button
                onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                className="flex items-center gap-1.5 p-1 sm:p-1.5 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 rounded-xl transition-colors"
              >
                <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-purple-600 to-cyan-500 flex items-center justify-center text-white font-bold text-xs">
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <span className="hidden xl:inline text-xs font-bold text-zinc-200 max-w-[96px] truncate">
                  {user.inGameName}
                </span>
              </button>

              {/* Profile Dropdown */}
              {profileDropdownOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-zinc-950 border border-zinc-800 rounded-xl shadow-2xl p-2 z-50 animate-in fade-in space-y-1">
                  <div className="p-2 border-b border-zinc-800/80">
                    <p className="text-xs font-bold text-white truncate">{user.name}</p>
                    <p className="text-[11px] font-mono-num text-emerald-400">{user.email}</p>
                    <span className="inline-block mt-1 px-1.5 py-0.5 bg-zinc-900 text-[10px] text-zinc-400 rounded">
                      IGN: {user.inGameName}
                    </span>
                  </div>

                  <button
                    onClick={() => {
                      onSelectTab('profile');
                      setProfileDropdownOpen(false);
                    }}
                    className="w-full text-left px-3 py-2 text-xs font-bold text-emerald-400 hover:text-emerald-300 hover:bg-zinc-900 rounded-lg flex items-center gap-2"
                  >
                    <User className="w-3.5 h-3.5" />
                    <span>My Gamer Profile & IDs</span>
                  </button>

                  <button
                    onClick={() => {
                      onSelectTab('dashboard');
                      setProfileDropdownOpen(false);
                    }}
                    className="w-full text-left px-3 py-2 text-xs font-bold text-zinc-300 hover:text-white hover:bg-zinc-900 rounded-lg flex items-center gap-2"
                  >
                    <Flame className="w-3.5 h-3.5 text-cyan-400" />
                    <span>My Dashboard & Matches</span>
                  </button>

                  <button
                    onClick={() => {
                      onOpenWallet();
                      setProfileDropdownOpen(false);
                    }}
                    className="w-full text-left px-3 py-2 text-xs font-bold text-zinc-300 hover:text-white hover:bg-zinc-900 rounded-lg flex items-center gap-2"
                  >
                    <Wallet className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Wallet & Withdrawals</span>
                  </button>

                  {isAdmin && (
                    <button
                      onClick={() => {
                        onSelectTab('admin');
                        setProfileDropdownOpen(false);
                      }}
                      className="w-full text-left px-3 py-2 text-xs font-bold text-purple-400 hover:bg-purple-950/40 rounded-lg flex items-center gap-2"
                    >
                      <Shield className="w-3.5 h-3.5" />
                      <span>Admin Control Panel</span>
                    </button>
                  )}

                  <button
                    onClick={() => {
                      logout();
                      setProfileDropdownOpen(false);
                    }}
                    className="w-full text-left px-3 py-2 text-xs font-bold text-red-400 hover:bg-red-950/40 rounded-lg flex items-center gap-2 border-t border-zinc-800/80 mt-1"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Sign Out</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button
              onClick={onOpenAuth}
              className="px-4 py-2 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 text-black font-display font-black text-xs uppercase tracking-wider rounded-xl shadow-lg shadow-emerald-950/40 transition-all active:scale-95 flex items-center gap-1.5"
            >
              <User className="w-3.5 h-3.5" />
              <span>Sign In / Register</span>
            </button>
          )}

          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-zinc-950 border-b border-zinc-800 p-4 space-y-2 animate-in slide-in-from-top-2">
          {navLinks.map((link) => (
            <button
              key={link.id}
              onClick={() => {
                onSelectTab(link.id);
                setMobileMenuOpen(false);
              }}
              className={`w-full text-left px-3 py-2 text-xs font-bold rounded-lg transition-colors ${
                currentTab === link.id
                  ? 'bg-emerald-500/20 text-emerald-400'
                  : 'text-zinc-300 hover:bg-zinc-900'
              }`}
            >
              {link.label}
            </button>
          ))}

          <div className="pt-2 border-t border-zinc-800 flex items-center justify-between text-xs">
            <button
              onClick={() => {
                onSelectTab('admin');
                setMobileMenuOpen(false);
              }}
              className="text-purple-400 font-bold flex items-center gap-1.5"
            >
              <Shield className="w-3.5 h-3.5" />
              <span>Admin Portal</span>
            </button>
            <a
              href="https://chat.whatsapp.com/DevEsportsOfficial"
              target="_blank"
              rel="noreferrer"
              className="text-emerald-400 font-bold flex items-center gap-1"
            >
              <span>WhatsApp Support</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      )}
    </header>
  );
};
