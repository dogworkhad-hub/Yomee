import React, { useState, useEffect } from 'react';
import { X, Sparkles, Crown, Check, Flame } from 'lucide-react';
import { playSound } from '../utils/soundEffects';

interface SpecialOfferModalProps {
  isOpen: boolean;
  onClose: () => void;
  onClaimOffer: (tokens: number) => void;
}

export const SpecialOfferModal: React.FC<SpecialOfferModalProps> = ({
  isOpen,
  onClose,
  onClaimOffer,
}) => {
  const [secondsLeft, setSecondsLeft] = useState(3554); // ~59 mins
  const [selectedPackage, setSelectedPackage] = useState<280 | 120>(280);

  useEffect(() => {
    if (!isOpen) return;
    const interval = setInterval(() => {
      setSecondsLeft((prev) => (prev > 0 ? prev - 1 : 3600));
    }, 1000);
    return () => clearInterval(interval);
  }, [isOpen]);

  if (!isOpen) return null;

  const mm = String(Math.floor(secondsLeft / 60)).padStart(2, '0');
  const ss = String(secondsLeft % 60).padStart(2, '0');

  const handleClaim = () => {
    playSound.gift();
    onClaimOffer(selectedPackage);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/85 backdrop-blur-md p-4 animate-in fade-in">
      <div className="w-full max-w-xs relative bg-gradient-to-b from-[#25133c] to-[#110720] border border-purple-500/30 rounded-3xl p-5 text-center text-white shadow-2xl overflow-hidden">
        {/* Glowing badge */}
        <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-gradient-to-r from-purple-500 via-pink-500 to-rose-500 text-[11px] font-black uppercase tracking-wider shadow-lg shadow-pink-500/30 mb-2.5">
          <Sparkles size={12} />
          <span>UP TO 60% OFF</span>
        </div>

        <h3 className="text-2xl font-black italic tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-pink-300 via-purple-200 to-white">
          Special Offer
        </h3>

        {/* Countdown */}
        <div className="flex items-center justify-center gap-1.5 my-2.5">
          <span className="bg-purple-950/90 border border-purple-800/60 px-2.5 py-1 rounded-lg text-xs font-mono font-bold text-pink-300">
            00
          </span>
          <span className="text-pink-400 font-bold">:</span>
          <span className="bg-purple-950/90 border border-purple-800/60 px-2.5 py-1 rounded-lg text-xs font-mono font-bold text-pink-300">
            {mm}
          </span>
          <span className="text-pink-400 font-bold">:</span>
          <span className="bg-purple-950/90 border border-purple-800/60 px-2.5 py-1 rounded-lg text-xs font-mono font-bold text-pink-300">
            {ss}
          </span>
        </div>

        {/* Package Selector (Featured 280 Coins & 120 Coins) */}
        <div className="space-y-2.5 my-4">
          {/* 280 Coins Primary Choice */}
          <div
            onClick={() => {
              playSound.pop();
              setSelectedPackage(280);
            }}
            className={`relative p-3.5 rounded-2xl cursor-pointer border transition-all flex items-center justify-between ${
              selectedPackage === 280
                ? 'bg-gradient-to-r from-pink-500/25 via-purple-500/25 to-indigo-500/25 border-pink-500 shadow-lg shadow-pink-500/20'
                : 'bg-white/5 border-white/10 hover:bg-white/10'
            }`}
          >
            <span className="absolute -top-2 left-4 px-2 py-0.2 rounded-full bg-gradient-to-r from-amber-400 to-rose-500 text-slate-950 text-[9px] font-black uppercase tracking-wider flex items-center gap-1 shadow">
              <Flame size={10} className="fill-slate-950" />
              <span>SUPER DEAL · BEST VALUE</span>
            </span>

            <div className="flex items-center gap-3 text-left">
              <div className="w-14 h-14 rounded-xl bg-gradient-to-tr from-amber-400 via-pink-500 to-rose-500 flex items-center justify-center text-3xl shadow-lg shadow-pink-500/30">
                👑
              </div>
              <div>
                <div className="text-2xl font-black text-white tracking-tight flex items-center gap-1.5">
                  <span>280</span>
                  <span className="text-xs text-amber-300 font-bold">🪙</span>
                </div>
                <div className="text-[11px] text-purple-200 uppercase tracking-wider font-semibold">
                  Tokens / Coins
                </div>
              </div>
            </div>

            <div className="text-right">
              {selectedPackage === 280 && (
                <div className="w-5 h-5 rounded-full bg-pink-500 flex items-center justify-center text-white ml-auto mb-1">
                  <Check size={13} />
                </div>
              )}
              <div className="text-xs font-bold text-emerald-400">+160 Bonus</div>
            </div>
          </div>

          {/* 120 Coins Choice */}
          <div
            onClick={() => {
              playSound.pop();
              setSelectedPackage(120);
            }}
            className={`relative p-3 rounded-2xl cursor-pointer border transition-all flex items-center justify-between ${
              selectedPackage === 120
                ? 'bg-gradient-to-r from-pink-500/20 to-purple-500/20 border-pink-500 shadow-md'
                : 'bg-white/5 border-white/10 hover:bg-white/10'
            }`}
          >
            <div className="flex items-center gap-3 text-left">
              <div className="w-11 h-11 rounded-lg bg-pink-500/30 border border-pink-500/40 flex items-center justify-center text-xl">
                🪙
              </div>
              <div>
                <div className="text-lg font-black text-white">120 Tokens</div>
                <div className="text-[10px] text-purple-300">Standard Pack</div>
              </div>
            </div>

            {selectedPackage === 120 && (
              <div className="w-5 h-5 rounded-full bg-pink-500 flex items-center justify-center text-white">
                <Check size={13} />
              </div>
            )}
          </div>
        </div>

        {/* Action Button */}
        <button
          onClick={handleClaim}
          className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-600 font-extrabold text-white text-base shadow-xl shadow-pink-500/30 hover:opacity-95 active:scale-[0.98] transition-all flex flex-col items-center justify-center"
        >
          <span className="flex items-center gap-1.5">
            <span>Claim {selectedPackage} Coins 🪙</span>
          </span>
          <span className="text-[11px] font-normal text-white/80 line-through">
            Regular: {selectedPackage === 280 ? '700' : '300'} Coins
          </span>
        </button>

        <p className="mt-3 text-[10px] text-purple-300/70">
          Unlocks instant HD video calls, priority matching & VIP gifts.
        </p>
      </div>

      {/* Close button X */}
      <button
        onClick={() => {
          playSound.pop();
          onClose();
        }}
        className="mt-5 w-11 h-11 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-all border border-white/10"
      >
        <X size={20} />
      </button>
    </div>
  );
};
