import React, { useState } from 'react';
import { Sparkles, Crown, Trophy, Volume2, Coins, ArrowRight, Video } from 'lucide-react';
import { playSound } from '../utils/soundEffects';

interface PartyTabProps {
  userTokens: number;
  onAddTokens: (amount: number) => void;
  onStartLive: () => void;
}

export const PartyTab: React.FC<PartyTabProps> = ({
  userTokens,
  onAddTokens,
  onStartLive,
}) => {
  const [selectedChip, setSelectedChip] = useState<number>(500);
  const [betPlaced, setBetPlaced] = useState<string>('Red');
  const [isSpinning, setIsSpinning] = useState<boolean>(false);
  const [rouletteAngle, setRouletteAngle] = useState<number>(0);
  const [lastWinMessage, setLastWinMessage] = useState<string | null>(null);

  const chips = [500, 1000, 5000, 10000, 100000];

  const handleSpin = () => {
    if (isSpinning) return;
    setIsSpinning(true);
    playSound.radarPing();

    const randomRotations = 1440 + Math.floor(Math.random() * 360);
    setRouletteAngle((prev) => prev + randomRotations);

    setTimeout(() => {
      setIsSpinning(false);
      const isWin = Math.random() > 0.4;
      if (isWin) {
        const reward = Math.round(selectedChip * 2);
        onAddTokens(15);
        playSound.gift();
        setLastWinMessage(`🎉 YOU WON! +${reward.toLocaleString()} Diamonds (+15 Coins)!`);
      } else {
        playSound.pop();
        setLastWinMessage(`Better luck next round! Try again!`);
      }
      setTimeout(() => setLastWinMessage(null), 3500);
    }, 2800);
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-[#120826] text-white overflow-y-auto pb-24 select-none">
      {/* Header Banner matching video 00:08 */}
      <div className="p-4 bg-gradient-to-b from-[#240b4c] to-[#120826] border-b border-purple-500/20">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xl">🇮🇳</span>
            <span className="font-extrabold text-sm text-amber-300">India Events Party</span>
          </div>

          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-purple-900/60 border border-purple-500/30 text-amber-300 text-xs font-bold">
              🪙 {userTokens}
            </span>
          </div>
        </div>

        {/* Win extra diamonds header */}
        <div className="mt-3 p-3 rounded-2xl bg-gradient-to-r from-purple-950 via-purple-900 to-pink-950 border border-purple-500/30 text-center">
          <div className="flex items-center justify-center gap-1.5 text-xs font-black text-amber-300 uppercase">
            <Sparkles size={14} />
            <span>Win up to 20% extra diamonds</span>
          </div>
          <div className="text-[11px] text-purple-300 mt-0.5">Top Hostess Charm & Wealth Roulette</div>
        </div>
      </div>

      {/* Roulette Stage Container */}
      <div className="flex-1 p-4 flex flex-col items-center justify-center">
        {/* Animated Spinning Roulette Wheel matching video */}
        <div className="relative w-64 h-64 my-4 flex items-center justify-center">
          {/* Outer Ring */}
          <div className="absolute inset-0 rounded-full border-4 border-amber-500/60 shadow-[0_0_30px_rgba(245,158,11,0.3)] bg-gradient-to-tr from-amber-700 via-yellow-600 to-amber-900 p-2">
            {/* Spinning inner disc */}
            <div
              className="w-full h-full rounded-full border-2 border-white/30 bg-[#0f3d23] relative overflow-hidden flex items-center justify-center transition-transform duration-[2800ms] ease-out"
              style={{ transform: `rotate(${rouletteAngle}deg)` }}
            >
              {/* Wheel spokes */}
              {[...Array(12)].map((_, i) => (
                <div
                  key={i}
                  className="absolute w-full h-0.5 bg-amber-400/30"
                  style={{ transform: `rotate(${i * 30}deg)` }}
                />
              ))}
              {/* Numbers / Red & Black segments */}
              <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-amber-400 to-yellow-200 border-4 border-slate-900 flex items-center justify-center text-slate-950 font-black text-sm shadow-xl">
                ★
              </div>
            </div>
          </div>

          {/* Pointer */}
          <div className="absolute -top-3 z-20 text-amber-400 text-2xl drop-shadow">
            ▼
          </div>
        </div>

        {/* Win Alert Toast */}
        {lastWinMessage && (
          <div className="mb-3 px-4 py-2 rounded-xl bg-amber-400 text-slate-950 text-xs font-extrabold shadow-lg animate-in zoom-in-90">
            {lastWinMessage}
          </div>
        )}

        {/* Betting Board matching video: Red, Black, Odd, Even */}
        <div className="w-full max-w-xs grid grid-cols-4 gap-1.5 mb-4 text-xs font-bold text-center">
          {['1-12 (x3)', '13-24 (x3)', '25-36 (x3)', 'Red (x2)', 'Black (x2)', 'Odd (x2)', 'Even (x2)'].slice(0, 4).map((option) => (
            <button
              key={option}
              onClick={() => {
                playSound.pop();
                setBetPlaced(option);
              }}
              className={`py-2 rounded-xl border transition-all ${
                betPlaced === option
                  ? 'bg-emerald-600 border-emerald-400 text-white font-black shadow'
                  : 'bg-emerald-950/70 border-emerald-800 text-emerald-300'
              }`}
            >
              {option}
            </button>
          ))}
        </div>

        {/* Chips Selector matching video: 500, 1000, 5000, 10K, 100K */}
        <div className="flex items-center gap-2 mb-5">
          {chips.map((chip) => (
            <button
              key={chip}
              onClick={() => {
                playSound.coin();
                setSelectedChip(chip);
              }}
              className={`w-11 h-11 rounded-full text-[11px] font-black border-2 transition-all flex items-center justify-center ${
                selectedChip === chip
                  ? 'bg-amber-400 border-white text-slate-950 scale-110 shadow-lg'
                  : 'bg-purple-900/60 border-purple-500/40 text-purple-200'
              }`}
            >
              {chip >= 1000 ? `${chip / 1000}K` : chip}
            </button>
          ))}
        </div>

        {/* Spin / Play Button */}
        <button
          onClick={handleSpin}
          disabled={isSpinning}
          className="w-full max-w-xs py-3.5 rounded-2xl bg-gradient-to-r from-amber-400 via-orange-500 to-pink-500 font-black text-sm text-white shadow-xl shadow-orange-500/30 hover:opacity-95 active:scale-95 transition-all disabled:opacity-50"
        >
          {isSpinning ? 'Spinning Roulette...' : `Spin & Win (Bet ${selectedChip})`}
        </button>

        {/* Start Live Party Button matching video 00:22 */}
        <button
          onClick={onStartLive}
          className="mt-3 w-full max-w-xs py-3 rounded-2xl bg-gradient-to-r from-yellow-400 to-amber-500 text-slate-950 font-black text-sm shadow-md flex items-center justify-center gap-2 active:scale-95 transition-all"
        >
          <Video size={16} />
          <span>Start Live Party</span>
        </button>
      </div>
    </div>
  );
};
