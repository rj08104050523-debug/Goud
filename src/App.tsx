import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { HomePage } from './pages/HomePage';
import { TournamentsPage } from './pages/TournamentsPage';
import { LeaderboardPage } from './pages/LeaderboardPage';
import { UserDashboard } from './pages/UserDashboard';
import { RulesAndSupportPage } from './pages/RulesAndSupportPage';
import { AdminDashboard } from './pages/AdminDashboard';
import { ProfilePage } from './pages/ProfilePage';
import { PromoStudioPage } from './pages/PromoStudioPage';
import { AuthModal } from './components/AuthModal';
import { WalletModal } from './components/WalletModal';
import { RoomDetailsModal } from './components/RoomDetailsModal';
import { Tournament } from './shared/tournamentRules';

function MainApp() {
  const { user, token } = useAuth();
  const [currentTab, setCurrentTab] = useState<string>('home');
  const [targetProfileUserId, setTargetProfileUserId] = useState<string | null>(null);

  // Modals state
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [walletModalOpen, setWalletModalOpen] = useState(false);
  const [roomModalOpen, setRoomModalOpen] = useState(false);
  const [selectedRoomTournament, setSelectedRoomTournament] = useState<{
    tournamentTitle: string;
    game: string;
    map: string;
    matchTime: string;
    roomId: string;
    roomPassword: string;
  } | null>(null);

  // App data state
  const [tournaments, setTournaments] = useState<Tournament[]>([]);
  const [userRegisteredIds, setUserRegisteredIds] = useState<Set<string>>(new Set());
  const [unreadCount, setUnreadCount] = useState<number>(0);

  // URL hash navigation support for #/admin, #/tournaments, #/profile, etc.
  useEffect(() => {
    const handleHash = () => {
      const hash = window.location.hash.replace(/^#\/?/, '').toLowerCase();
      if (hash === 'admin') setCurrentTab('admin');
      else if (hash === 'tournaments') setCurrentTab('tournaments');
      else if (hash === 'free-fire') setCurrentTab('free-fire');
      else if (hash === 'bgmi') setCurrentTab('bgmi');
      else if (hash === 'leaderboard') setCurrentTab('leaderboard');
      else if (hash.startsWith('profile')) {
        const parts = hash.split('/');
        if (parts[1]) setTargetProfileUserId(parts[1]);
        else setTargetProfileUserId(null);
        setCurrentTab('profile');
      }
      else if (hash === 'dashboard') setCurrentTab('dashboard');
      else if (hash === 'promo') setCurrentTab('promo');
      else if (hash === 'rules') setCurrentTab('rules');
    };
    handleHash();
    window.addEventListener('hashchange', handleHash);
    return () => window.removeEventListener('hashchange', handleHash);
  }, []);

  useEffect(() => {
    fetchTournaments();
    if (token) {
      fetchUserRegistrations();
      fetchNotifications();
    }
  }, [token]);

  const fetchTournaments = async () => {
    try {
      const res = await fetch('/api/tournaments');
      if (res.ok) {
        const data = await res.json();
        setTournaments(data.tournaments || []);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const fetchUserRegistrations = async () => {
    try {
      const res = await fetch('/api/user/tournaments', {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        const ids = new Set<string>((data.tournaments || []).map((t: any) => t.id));
        setUserRegisteredIds(ids);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const fetchNotifications = async () => {
    try {
      const res = await fetch('/api/notifications', {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        const unread = (data.notifications || []).filter((n: any) => !n.read).length;
        setUnreadCount(unread);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleTabChange = (tab: string) => {
    setCurrentTab(tab);
    window.location.hash = `#/${tab}`;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleViewRoomDetails = async (tournament: Tournament) => {
    if (!token) {
      setAuthModalOpen(true);
      return;
    }
    try {
      const res = await fetch(`/api/tournaments/${tournament.id}/room-details`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (!res.ok) {
        showToast(data.error || 'Unable to view room details');
        return;
      }
      setSelectedRoomTournament(data);
      setRoomModalOpen(true);
    } catch (err: any) {
      showToast(err.message || 'Error loading room credentials');
    }
  };

  const handleJoinTournament = (tournament: Tournament) => {
    if (!user) {
      setAuthModalOpen(true);
      return;
    }
    handleTabChange('tournaments');
  };

  const handleRegisterSuccess = () => {
    fetchTournaments();
    fetchUserRegistrations();
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col font-body selection:bg-emerald-500 selection:text-black">
      {/* Top Navbar */}
      <Navbar
        currentTab={currentTab}
        onSelectTab={handleTabChange}
        onOpenAuth={() => setAuthModalOpen(true)}
        onOpenWallet={() => setWalletModalOpen(true)}
        unreadCount={unreadCount}
      />

      {/* Main Viewport Content */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 py-6 sm:py-8">
        {currentTab === 'home' && (
          <HomePage
            tournaments={tournaments}
            userRegisteredTournamentIds={userRegisteredIds}
            onSelectTab={handleTabChange}
            onJoinTournament={handleJoinTournament}
            onViewRoomDetails={handleViewRoomDetails}
          />
        )}

        {currentTab === 'tournaments' && (
          <TournamentsPage
            tournaments={tournaments}
            userRegisteredTournamentIds={userRegisteredIds}
            initialGameFilter="ALL"
            onRegisterSuccess={handleRegisterSuccess}
            onOpenWallet={() => setWalletModalOpen(true)}
            onViewRoomDetails={handleViewRoomDetails}
          />
        )}

        {currentTab === 'free-fire' && (
          <TournamentsPage
            tournaments={tournaments}
            userRegisteredTournamentIds={userRegisteredIds}
            initialGameFilter="FREE FIRE MAX"
            onRegisterSuccess={handleRegisterSuccess}
            onOpenWallet={() => setWalletModalOpen(true)}
            onViewRoomDetails={handleViewRoomDetails}
          />
        )}

        {currentTab === 'bgmi' && (
          <TournamentsPage
            tournaments={tournaments}
            userRegisteredTournamentIds={userRegisteredIds}
            initialGameFilter="BGMI"
            onRegisterSuccess={handleRegisterSuccess}
            onOpenWallet={() => setWalletModalOpen(true)}
            onViewRoomDetails={handleViewRoomDetails}
          />
        )}

        {currentTab === 'leaderboard' && (
          <LeaderboardPage
            onSelectPlayerProfile={(playerId) => {
              setTargetProfileUserId(playerId);
              handleTabChange(`profile/${playerId}`);
            }}
          />
        )}

        {currentTab === 'profile' && (
          <ProfilePage
            targetUserId={targetProfileUserId}
            onOpenWallet={() => setWalletModalOpen(true)}
            onViewRoomDetails={handleViewRoomDetails}
            onExploreMatches={() => handleTabChange('tournaments')}
          />
        )}

        {(currentTab === 'dashboard' || currentTab === 'dashboard-notifications') && (
          <UserDashboard
            onOpenWallet={() => setWalletModalOpen(true)}
            onViewRoomDetails={handleViewRoomDetails}
            onExploreMatches={() => handleTabChange('tournaments')}
            onNavigateProfile={() => {
              setTargetProfileUserId(null);
              handleTabChange('profile');
            }}
          />
        )}

        {currentTab === 'promo' && <PromoStudioPage />}

        {currentTab === 'rules' && <RulesAndSupportPage />}

        {currentTab === 'admin' && <AdminDashboard />}
      </main>

      {/* Footer */}
      <Footer onSelectTab={handleTabChange} />

      {/* Modals */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
      />

      <WalletModal
        isOpen={walletModalOpen}
        onClose={() => setWalletModalOpen(false)}
      />

      {selectedRoomTournament && (
        <RoomDetailsModal
          isOpen={roomModalOpen}
          onClose={() => {
            setRoomModalOpen(false);
            setSelectedRoomTournament(null);
          }}
          tournamentTitle={selectedRoomTournament.tournamentTitle}
          game={selectedRoomTournament.game}
          map={selectedRoomTournament.map}
          matchTime={selectedRoomTournament.matchTime}
          roomId={selectedRoomTournament.roomId}
          roomPassword={selectedRoomTournament.roomPassword}
        />
      )}

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 px-4 py-3 bg-zinc-900 border border-emerald-500/80 rounded-2xl shadow-2xl text-xs font-bold text-emerald-300 flex items-center gap-2 animate-bounce">
          <span>⚠️</span>
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <MainApp />
    </AuthProvider>
  );
}
