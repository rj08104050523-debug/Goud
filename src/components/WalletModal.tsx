import React, { useState, useEffect } from 'react';
import {
  X,
  Wallet,
  ArrowUpRight,
  ArrowDownLeft,
  QrCode,
  CheckCircle2,
  AlertCircle,
  Copy,
  Check,
  ShieldCheck,
  Clock,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Transaction } from '../server/db';

interface WalletModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultTab?: 'deposit' | 'withdraw' | 'history';
}

export const WalletModal: React.FC<WalletModalProps> = ({
  isOpen,
  onClose,
  defaultTab = 'deposit',
}) => {
  const { user, token, refreshUser } = useAuth();
  const [activeTab, setActiveTab] = useState<'deposit' | 'withdraw' | 'history'>(defaultTab);

  // Deposit state
  const [depositAmount, setDepositAmount] = useState<number>(100);
  const [utrNumber, setUtrNumber] = useState('');
  const [depositSuccess, setDepositSuccess] = useState(false);
  const [isDepositing, setIsDepositing] = useState(false);

  // Withdraw state
  const [withdrawAmount, setWithdrawAmount] = useState<number>(100);
  const [upiId, setUpiId] = useState('');
  const [withdrawSuccess, setWithdrawSuccess] = useState(false);
  const [isWithdrawing, setIsWithdrawing] = useState(false);

  // History state
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loadingHistory, setLoadingHistory] = useState(false);

  const [copiedUpi, setCopiedUpi] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen && activeTab === 'history' && token) {
      fetchTransactions();
    }
  }, [isOpen, activeTab, token]);

  if (!isOpen || !user) return null;

  const fetchTransactions = async () => {
    setLoadingHistory(true);
    try {
      const res = await fetch('/api/wallet/transactions', {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setTransactions(data.transactions || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingHistory(false);
    }
  };

  const handleDeposit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setIsDepositing(true);
    try {
      const res = await fetch('/api/wallet/deposit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          amount: depositAmount,
          utrNumber: utrNumber || `UPI_UTR_${Math.floor(100000000000 + Math.random() * 900000000000)}`,
          isInstantVerified: true,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      setDepositSuccess(true);
      await refreshUser();
      setTimeout(() => {
        setDepositSuccess(false);
        setActiveTab('history');
      }, 1500);
    } catch (err: any) {
      setErrorMsg(err.message || 'Deposit failed');
    } finally {
      setIsDepositing(false);
    }
  };

  const handleWithdrawal = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setIsWithdrawing(true);
    try {
      const res = await fetch('/api/wallet/withdraw', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          amount: withdrawAmount,
          upiId: upiId.trim(),
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      setWithdrawSuccess(true);
      await refreshUser();
      setTimeout(() => {
        setWithdrawSuccess(false);
        setActiveTab('history');
      }, 1800);
    } catch (err: any) {
      setErrorMsg(err.message || 'Withdrawal failed');
    } finally {
      setIsWithdrawing(false);
    }
  };

  const copyUpiVpa = () => {
    navigator.clipboard.writeText('devesports@upi');
    setCopiedUpi(true);
    setTimeout(() => setCopiedUpi(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
      <div className="relative w-full max-w-lg bg-zinc-950 border border-zinc-800 rounded-2xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-zinc-800 bg-zinc-900/60">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
              <Wallet className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-display font-black text-lg text-white leading-none">
                DEV ESPORTS WALLET & PASSBOOK
              </h3>
              <p className="text-[11px] text-zinc-400 mt-0.5">
                Instant UPI Deposits & Real Cash Withdrawals
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

        {/* Balance Strip Card */}
        <div className="p-4 bg-gradient-to-r from-zinc-900 via-emerald-950/40 to-zinc-900 border-b border-zinc-800 grid grid-cols-2 gap-4">
          <div className="p-3 bg-black/60 border border-zinc-800 rounded-xl">
            <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block">
              TOTAL WALLET BALANCE
            </span>
            <span className="text-xl sm:text-2xl font-black font-mono-num text-emerald-400 block mt-0.5">
              ₹{user.walletBalance.toLocaleString('en-IN')}
            </span>
            <span className="text-[10px] text-zinc-500 mt-0.5 block">
              For match slot bookings
            </span>
          </div>

          <div className="p-3 bg-black/60 border border-amber-500/40 rounded-xl shadow-[0_0_15px_rgba(245,158,11,0.15)]">
            <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider block">
              WINNING BALANCE (WITHDRAWABLE)
            </span>
            <span className="text-xl sm:text-2xl font-black font-mono-num text-amber-300 block mt-0.5">
              ₹{user.winningBalance.toLocaleString('en-IN')}
            </span>
            <span className="text-[10px] text-zinc-400 mt-0.5 block">
              Direct transfer to Bank / UPI
            </span>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-zinc-800 bg-zinc-900/40 text-xs font-bold">
          <button
            onClick={() => {
              setActiveTab('deposit');
              setErrorMsg(null);
            }}
            className={`flex-1 py-2.5 text-center transition-colors border-b-2 flex items-center justify-center gap-1.5 ${
              activeTab === 'deposit'
                ? 'border-emerald-500 text-emerald-400 bg-zinc-900/80'
                : 'border-transparent text-zinc-400 hover:text-white'
            }`}
          >
            <ArrowDownLeft className="w-3.5 h-3.5" />
            <span>ADD MONEY</span>
          </button>
          <button
            onClick={() => {
              setActiveTab('withdraw');
              setErrorMsg(null);
            }}
            className={`flex-1 py-2.5 text-center transition-colors border-b-2 flex items-center justify-center gap-1.5 ${
              activeTab === 'withdraw'
                ? 'border-amber-500 text-amber-400 bg-zinc-900/80'
                : 'border-transparent text-zinc-400 hover:text-white'
            }`}
          >
            <ArrowUpRight className="w-3.5 h-3.5" />
            <span>WITHDRAW CASH</span>
          </button>
          <button
            onClick={() => {
              setActiveTab('history');
              setErrorMsg(null);
            }}
            className={`flex-1 py-2.5 text-center transition-colors border-b-2 flex items-center justify-center gap-1.5 ${
              activeTab === 'history'
                ? 'border-cyan-500 text-cyan-400 bg-zinc-900/80'
                : 'border-transparent text-zinc-400 hover:text-white'
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            <span>PASSBOOK / LEDGER</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 overflow-y-auto space-y-4">
          {errorMsg && (
            <div className="p-3 rounded-xl bg-red-950/50 border border-red-500/50 text-xs text-red-200 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* TAB 1: ADD MONEY */}
          {activeTab === 'deposit' && (
            <div className="space-y-4">
              {depositSuccess ? (
                <div className="p-6 bg-emerald-950/30 border border-emerald-500/50 rounded-2xl text-center space-y-2">
                  <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto animate-bounce" />
                  <h4 className="font-display font-black text-xl text-white">
                    DEPOSIT SUCCESSFUL!
                  </h4>
                  <p className="text-xs text-zinc-300">
                    ₹{depositAmount} has been credited to your Dev eSports wallet.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleDeposit} className="space-y-4">
                  {/* Quick Preset Buttons */}
                  <div>
                    <label className="block text-xs font-bold text-zinc-300 mb-1.5">
                      Select Deposit Amount:
                    </label>
                    <div className="grid grid-cols-4 gap-2">
                      {[50, 100, 200, 500].map((amt) => (
                        <button
                          key={amt}
                          type="button"
                          onClick={() => setDepositAmount(amt)}
                          className={`py-2 rounded-xl font-mono-num font-bold text-xs transition-all border ${
                            depositAmount === amt
                              ? 'bg-emerald-500 text-black border-emerald-400 shadow-md shadow-emerald-950/50'
                              : 'bg-zinc-900 text-zinc-300 border-zinc-800 hover:border-zinc-700'
                          }`}
                        >
                          +₹{amt}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* QR Code and UPI ID info */}
                  <div className="p-3.5 bg-zinc-900 border border-zinc-800 rounded-xl flex items-center gap-3.5">
                    <div className="w-20 h-20 bg-white p-1 rounded-lg flex items-center justify-center shrink-0">
                      {/* SVG QR Code Simulation */}
                      <QrCode className="w-full h-full text-black" />
                    </div>
                    <div className="space-y-1">
                      <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest block">
                        OFFICIAL UPI GATEWAY
                      </span>
                      <div className="flex items-center gap-1.5">
                        <span className="font-mono text-xs text-white font-bold">
                          devesports@upi
                        </span>
                        <button
                          type="button"
                          onClick={copyUpiVpa}
                          className="p-1 hover:bg-zinc-800 rounded text-zinc-400 hover:text-white"
                          title="Copy UPI ID"
                        >
                          {copiedUpi ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                        </button>
                      </div>
                      <p className="text-[10px] text-zinc-400">
                        Scan with GPay, PhonePe, Paytm or BHIM UPI app.
                      </p>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-zinc-300 mb-1">
                      UPI Reference / UTR Number (Optional for automated verify):
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. 319200481726 (12 digits from receipt)"
                      value={utrNumber}
                      onChange={(e) => setUtrNumber(e.target.value)}
                      className="w-full px-3 py-2 bg-zinc-900 border border-zinc-800 rounded-xl text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-emerald-500 font-mono-num"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isDepositing}
                    className="w-full py-2.5 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 text-black font-display font-black text-sm uppercase tracking-wider rounded-xl shadow-lg transition-transform active:scale-[0.99] disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    <ShieldCheck className="w-4 h-4" />
                    <span>{isDepositing ? 'VERIFYING...' : `PAY & ADD ₹${depositAmount}`}</span>
                  </button>
                </form>
              )}
            </div>
          )}

          {/* TAB 2: WITHDRAW CASH */}
          {activeTab === 'withdraw' && (
            <div className="space-y-4">
              {withdrawSuccess ? (
                <div className="p-6 bg-amber-950/30 border border-amber-500/50 rounded-2xl text-center space-y-2">
                  <CheckCircle2 className="w-12 h-12 text-amber-400 mx-auto animate-bounce" />
                  <h4 className="font-display font-black text-xl text-white">
                    WITHDRAWAL REQUEST SUBMITTED!
                  </h4>
                  <p className="text-xs text-zinc-300">
                    ₹{withdrawAmount} will be transferred to your UPI ({upiId}) shortly.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleWithdrawal} className="space-y-3.5">
                  <div className="p-3 bg-amber-950/30 border border-amber-500/40 rounded-xl text-xs text-amber-200">
                    ℹ️ You can withdraw up to <strong>₹{user.winningBalance}</strong> (your earned tournament prize winnings). Minimum withdrawal is ₹50.
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-zinc-300 mb-1">
                      Withdrawal Amount (₹):
                    </label>
                    <input
                      type="number"
                      min={50}
                      max={user.winningBalance || 100000}
                      required
                      value={withdrawAmount}
                      onChange={(e) => setWithdrawAmount(Number(e.target.value))}
                      className="w-full px-3 py-2 bg-zinc-900 border border-zinc-800 rounded-xl text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-amber-400 font-mono-num"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-zinc-300 mb-1">
                      Your Bank UPI ID (VPA):
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. 9876543210@paytm or yourname@okhdfcbank"
                      value={upiId}
                      onChange={(e) => setUpiId(e.target.value)}
                      className="w-full px-3 py-2 bg-zinc-900 border border-zinc-800 rounded-xl text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-amber-400 font-mono-num"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isWithdrawing || user.winningBalance < 50}
                    className="w-full py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black font-display font-black text-sm uppercase tracking-wider rounded-xl shadow-lg transition-transform active:scale-[0.99] disabled:opacity-50"
                  >
                    {isWithdrawing ? 'SUBMITTING...' : `WITHDRAW ₹${withdrawAmount} TO UPI`}
                  </button>
                </form>
              )}
            </div>
          )}

          {/* TAB 3: PASSBOOK LEDGER */}
          {activeTab === 'history' && (
            <div className="space-y-2">
              {loadingHistory ? (
                <div className="text-center py-8 text-xs text-zinc-500">
                  Loading transactions...
                </div>
              ) : transactions.length === 0 ? (
                <div className="text-center py-8 text-xs text-zinc-500">
                  No wallet transactions recorded yet.
                </div>
              ) : (
                transactions.map((tx) => (
                  <div
                    key={tx.id}
                    className="p-3 bg-zinc-900/60 border border-zinc-800/80 rounded-xl flex items-center justify-between"
                  >
                    <div className="flex items-center gap-2.5">
                      <div
                        className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs ${
                          tx.type === 'DEPOSIT' || tx.type === 'PRIZE_WON'
                            ? 'bg-emerald-500/20 text-emerald-400'
                            : 'bg-red-500/20 text-red-400'
                        }`}
                      >
                        {tx.type === 'DEPOSIT' || tx.type === 'PRIZE_WON' ? '+' : '-'}
                      </div>
                      <div>
                        <span className="text-xs font-bold text-white block leading-tight">
                          {tx.description}
                        </span>
                        <div className="flex items-center gap-2 text-[10px] text-zinc-400 font-mono-num mt-0.5">
                          <span>{tx.createdAt}</span>
                          <span>·</span>
                          <span>{tx.refNumber}</span>
                        </div>
                      </div>
                    </div>

                    <div className="text-right font-mono-num">
                      <span
                        className={`text-sm font-black block leading-none ${
                          tx.type === 'DEPOSIT' || tx.type === 'PRIZE_WON'
                            ? 'text-emerald-400'
                            : 'text-zinc-200'
                        }`}
                      >
                        {tx.type === 'DEPOSIT' || tx.type === 'PRIZE_WON' ? '+' : '-'}₹{tx.amount}
                      </span>
                      <span
                        className={`text-[9px] uppercase font-bold px-1.5 py-0.2 rounded mt-1 inline-block ${
                          tx.status === 'SUCCESS'
                            ? 'bg-emerald-950 text-emerald-400'
                            : tx.status === 'PENDING'
                            ? 'bg-amber-950 text-amber-400'
                            : 'bg-red-950 text-red-400'
                        }`}
                      >
                        {tx.status}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
