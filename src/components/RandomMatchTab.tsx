import React, { useState } from 'react';
import { Video, Globe2, Sparkles, SlidersHorizontal, Gift, ShieldCheck, Flame, Users } from 'lucide-react';
import { CountryItem } from '../types';
import { MOCK_PROFILES } from '../data/mockData';
import { playSound } from '../utils/soundEffects';

interface RandomMatchTabProps {
  selectedCountry: CountryItem;
  onOpenCountryModal: () => void;
  onStartMatching: (gender: 'all' | 'female' | 'male') => void;
  userTokens: number;
  onOpenBonus: () => void;
  onOpenSpecialOffer: () => void;
}

export const RandomMatchTab: React.FC<RandomMatchTabProps> = ({
  selectedCountry,
  onOpenCountryModal,
  onStartMatching,
  userTokens,
  onOpenBonus,
  onOpenSpecialOffer,
}) => {
  const [resolution, setResolution] = useState<'SD' | 'HD'>('HD');
  const [selectedGender, setSelectedGender] = useState<'all' | 'female' | 'male'>('all');

  return (
    <div className="flex-1 flex flex-col justify-between h-full bg-gradient-to-b from-[#130722] via-[#0b0314] to-[#040108] text-white p-5 overflow-hidden select-none">
      {/* Top Bar with Wallet & Special Offer */}
      <div className="flex items-center justify-between z-10 pt-2">
        <button
          onClick={() => {
            playSound.pop();
            onOpenSpecialOffer();
          }}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gradient-to-r from-pink-500/20 to-purple-500/20 border border-pink-500/30 text-pink-300 text-xs font-bold hover:bg-pink-500/30 transition-all shadow-lg"
        >
          <Sparkles size={14} className="text-pink-400 animate-spin" style={{ animationDuration: '4s' }} />
          <span>Special Offer 60%</span>
        </button>

        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              playSound.pop();
              onOpenBonus();
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-500/20 border border-amber-500/30 text-amber-300 text-xs font-extrabold hover:bg-amber-500/30 transition-all shadow"
          >
            <span>🪙 {userTokens}</span>
            <span className="text-[10px] text-amber-200 bg-amber-500/30 px-1.5 py-0.2 rounded-full">+ Bonus</span>
          </button>
        </div>
      </div>

      {/* Hero Title & Mystery Orbits (As shown in screenshot 4: Start Random Call...) */}
      <div className="flex flex-col items-center justify-center my-auto z-10">
        <h1 className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white via-pink-200 to-purple-200 tracking-tight text-center mb-8">
          Start Random Call...
        </h1>

        {/* Radar & Floating Mystery Circles */}
        <div className="relative flex items-center justify-center w-72 h-72">
          {/* Subtle radar ripples */}
          <div className="absolute w-72 h-72 rounded-full border border-purple-500/20 animate-ping duration-1000" />
          <div className="absolute w-56 h-56 rounded-full border border-pink-500/25 animate-pulse" />
          <div className="absolute w-40 h-40 rounded-full border border-indigo-500/30" />

          {/* Left Mystery Circle with blurred face */}
          <div className="absolute -left-2 w-28 h-28 rounded-full overflow-hidden border-2 border-pink-500/40 bg-slate-900 shadow-2xl flex items-center justify-center group cursor-pointer">
            <img
              src={MOCK_PROFILES[0].avatar}
              alt="Mystery"
              className="w-full h-full object-cover filter blur-sm scale-110 opacity-70"
            />
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
              <span className="text-3xl font-black text-white/90 drop-shadow">?</span>
            </div>
            <span className="absolute bottom-1 px-2 py-0.5 rounded-full bg-pink-500 text-[10px] font-bold">
              Girl 👧
            </span>
          </div>

          {/* Right Mystery Circle with blurred face */}
          <div className="absolute -right-2 w-28 h-28 rounded-full overflow-hidden border-2 border-indigo-500/40 bg-slate-900 shadow-2xl flex items-center justify-center group cursor-pointer">
            <img
              src={MOCK_PROFILES[6].avatar}
              alt="Mystery"
              className="w-full h-full object-cover filter blur-sm scale-110 opacity-70"
            />
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
              <span className="text-3xl font-black text-white/90 drop-shadow">?</span>
            </div>
            <span className="absolute bottom-1 px-2 py-0.5 rounded-full bg-indigo-500 text-[10px] font-bold">
              Boy 👦
            </span>
          </div>

          {/* Floating Special Offer Gift Box (Screenshot exact match!) */}
          <button
            onClick={() => {
              playSound.pop();
              onOpenSpecialOffer();
            }}
            className="absolute -bottom-4 right-2 flex flex-col items-center animate-bounce duration-700 cursor-pointer"
          >
            <div className="text-3xl drop-shadow-[0_0_15px_rgba(236,72,153,0.8)]">🎁</div>
            <span className="px-2 py-0.5 rounded-full bg-purple-900/90 border border-purple-500/50 text-[10px] font-mono font-bold text-pink-300 shadow">
              00:59:38
            </span>
          </button>
        </div>

        {/* 999+ People Want to Chat (Exact matching screenshot badge!) */}
        <div className="mt-6 flex items-center gap-2.5 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-md">
          <div className="flex items-center -space-x-2">
            {MOCK_PROFILES.slice(0, 4).map((p) => (
              <img
                key={p.id}
                src={p.avatar}
                alt={p.name}
                className="w-6 h-6 rounded-full border border-purple-900 object-cover"
              />
            ))}
          </div>
          <span className="text-xs font-semibold text-white/90">
            <strong className="text-pink-400">999+</strong> People want to chat with you
          </span>
        </div>
      </div>

      {/* Filter Row: Resolution & Region */}
      <div className="z-10 space-y-3 max-w-sm w-full mx-auto pb-16">
        {/* Gender Filter Selector */}
        <div className="flex items-center justify-center gap-2">
          {[
            { id: 'all' as const, label: 'All (Girls & Boys) 🌍' },
            { id: 'female' as const, label: 'Only Girls 👧' },
            { id: 'male' as const, label: 'Only Boys 👦' },
          ].map((g) => (
            <button
              key={g.id}
              onClick={() => {
                playSound.pop();
                setSelectedGender(g.id);
              }}
              className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all ${
                selectedGender === g.id
                  ? 'bg-gradient-to-r from-pink-500 to-purple-600 text-white shadow-md shadow-pink-500/20'
                  : 'bg-white/5 hover:bg-white/10 text-white/60'
              }`}
            >
              {g.label}
            </button>
          ))}
        </div>

        {/* Dual Pill Controls (Matching Screenshot 4: 1L SD | All) */}
        <div className="flex items-center gap-2">
          {/* Resolution toggle */}
          <button
            onClick={() => {
              playSound.pop();
              setResolution(resolution === 'HD' ? 'SD' : 'HD');
            }}
            className="flex-1 py-2.5 px-3 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-semibold text-white flex items-center justify-center gap-1.5 transition-colors"
          >
            <span className="text-pink-400">⚡</span>
            <span>{resolution} Quality</span>
          </button>

          {/* Region Selector */}
          <button
            onClick={() => {
              playSound.pop();
              onOpenCountryModal();
            }}
            className="flex-1 py-2.5 px-3 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-semibold text-white flex items-center justify-center gap-1.5 transition-colors truncate"
          >
            <Globe2 size={14} className="text-pink-400 flex-shrink-0" />
            <span className="truncate">{selectedCountry.flag} {selectedCountry.name}</span>
          </button>
        </div>

        {/* Giant "Start" Button (Exact matching screenshot design!) */}
        <div className="relative">
          <button
            onClick={() => {
              playSound.radarPing();
              onStartMatching(selectedGender);
            }}
            className="w-full py-4 px-6 rounded-full bg-white hover:bg-slate-100 text-slate-950 font-black text-base flex items-center justify-center gap-3 shadow-2xl shadow-pink-500/30 active:scale-[0.98] transition-all group"
          >
            <Video size={20} className="text-pink-600 group-hover:scale-110 transition-transform" />
            <span className="tracking-wide">Start Video Match</span>
          </button>

          {/* Little Price Ribbon Badge on the button */}
          <span className="absolute -top-2 right-6 px-2.5 py-0.5 rounded-full bg-gradient-to-r from-amber-400 to-orange-500 text-slate-950 text-[10px] font-black uppercase tracking-wider shadow">
            🪙 3 / Free
          </span>
        </div>
      </div>
    </div>
  );
};
