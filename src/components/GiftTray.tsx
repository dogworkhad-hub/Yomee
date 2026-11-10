import React from 'react';
import { X, Coins } from 'lucide-react';
import { GIFTS } from '../data/mockData';
import { GiftItem } from '../types';
import { playSound } from '../utils/soundEffects';

interface GiftTrayProps {
  isOpen: boolean;
  onClose: () => void;
  userTokens: number;
  onSendGift: (gift: GiftItem) => void;
  onOpenBonus: () => void;
}

export const GiftTray: React.FC<GiftTrayProps> = ({
  isOpen,
  onClose,
  userTokens,
  onSendGift,
  onOpenBonus,
}) => {
  if (!isOpen) return null;

  return (
    <div className="absolute inset-x-0 bottom-0 z-40 bg-slate-950/95 backdrop-blur-xl border-t border-white/10 rounded-t-3xl p-4 shadow-2xl animate-in slide-in-from-bottom duration-200">
      <div className="flex items-center justify-between pb-3 border-b border-white/10">
        <div className="flex items-center gap-2">
          <span className="text-sm font-bold text-white">Send Virtual Gift</span>
          <button
            onClick={onOpenBonus}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-500/20 border border-amber-500/30 text-amber-300 text-xs font-semibold hover:bg-amber-500/30 transition-colors"
          >
            <Coins size={13} className="text-amber-400" />
            <span>{userTokens} Coins</span>
            <span className="text-[10px] text-amber-200 ml-0.5 underline">+ Free</span>
          </button>
        </div>
        <button
          onClick={() => {
            playSound.pop();
            onClose();
          }}
          className="w-7 h-7 rounded-full flex items-center justify-center text-white/50 hover:text-white hover:bg-white/10"
        >
          <X size={16} />
        </button>
      </div>

      {/* Gifts Grid */}
      <div className="grid grid-cols-6 gap-2 pt-3 pb-1">
        {GIFTS.map((g) => {
          const canAfford = userTokens >= g.cost;
          return (
            <button
              key={g.id}
              onClick={() => {
                if (canAfford) {
                  onSendGift(g);
                } else {
                  onOpenBonus();
                }
              }}
              className="flex flex-col items-center justify-center p-2 rounded-2xl bg-white/5 hover:bg-white/15 active:scale-95 transition-all group border border-white/5 hover:border-pink-500/40"
            >
              <div className="text-2xl group-hover:scale-125 transition-transform duration-200">
                {g.icon}
              </div>
              <div className="text-[10px] font-semibold text-white/90 mt-1 truncate max-w-full">
                {g.name}
              </div>
              <div className={`text-[10px] font-bold mt-0.5 ${canAfford ? 'text-amber-400' : 'text-rose-400'}`}>
                🪙 {g.cost}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
