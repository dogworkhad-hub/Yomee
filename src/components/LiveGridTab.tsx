import React, { useState, useMemo } from 'react';
import { Search, Crown, Globe2, Sparkles, Flame, Video, Volume2 } from 'lucide-react';
import { UserProfile, CountryItem } from '../types';
import { MOCK_PROFILES, getProfilesForCountry } from '../data/mockData';
import { playSound } from '../utils/soundEffects';

interface LiveGridTabProps {
  selectedCountry: CountryItem;
  onOpenCountryModal: () => void;
  onSelectUser: (user: UserProfile) => void;
  onStartRandomCall: () => void;
  userTokens: number;
  onOpenBonus: () => void;
  onOpenSpecialOffer: () => void;
  onOpenRecharge?: () => void;
  isModActive?: boolean;
  onOpenModMenu?: () => void;
  onAddTokens?: (amount: number) => void;
}

export const LiveGridTab: React.FC<LiveGridTabProps> = ({
  selectedCountry,
  onOpenCountryModal,
  onSelectUser,
  onStartRandomCall,
  userTokens,
  onOpenBonus,
  onOpenSpecialOffer,
  onOpenRecharge,
  isModActive = false,
  onOpenModMenu,
  onAddTokens,
}) => {
  const [activeTab, setActiveTab] = useState<'Popular' | 'New' | 'Follow'>('Popular');
  const [selectedEthnicity, setSelectedEthnicity] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [coinToast, setCoinToast] = useState<string | null>(null);

  const ethnicities = ['All', 'South Asian', 'East Asian', 'White', 'Black', 'Middle Eastern', 'Latino'];

  // Filter profiles
  const displayedProfiles = useMemo(() => {
    let pool = getProfilesForCountry(selectedCountry.code, 'female');

    if (selectedEthnicity !== 'All') {
      pool = pool.filter((p) => p.ethnicity === selectedEthnicity);
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      pool = pool.filter((p) =>
        p.name.toLowerCase().includes(q) ||
        (p.statusTitle && p.statusTitle.toLowerCase().includes(q)) ||
        p.country.toLowerCase().includes(q)
      );
    }

    return pool;
  }, [selectedCountry, selectedEthnicity, searchQuery]);

  return (
    <div className="flex-1 flex flex-col h-full bg-[#f8f9fc] text-slate-900 overflow-hidden select-none">
      {/* Top Header matching Yomee video 00:04 */}
      <div className="pt-2 px-4 pb-2 bg-white border-b border-slate-100 shadow-sm sticky top-0 z-20">
        <div className="flex items-center justify-between">
          {/* Main Top Navigation Tabs: Popular, New, Follow */}
          <div className="flex items-center gap-5">
            {(['Popular', 'New', 'Follow'] as const).map((tab) => {
              const isActive = activeTab === tab;
              return (
                <button
                  key={tab}
                  onClick={() => {
                    playSound.pop();
                    setActiveTab(tab);
                  }}
                  className={`relative py-1 font-black transition-colors ${
                    isActive ? 'text-2xl text-slate-900' : 'text-base font-bold text-slate-400 hover:text-slate-600'
                  }`}
                >
                  {tab}
                  {isActive && (
                    <span className="w-1.5 h-1.5 rounded-full bg-purple-600 absolute -bottom-0.5 left-1/2 -translate-x-1/2" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Right VIP Crown Icon + Free 60 Coins + Wallet */}
          <div className="flex items-center gap-1.5">
            {/* Instant Free 60 Coins Button */}
            {onAddTokens && (
              <button
                onClick={() => {
                  playSound.coin();
                  onAddTokens(60);
                  setCoinToast('🎉 +60 Free Coins Added! (मुफ्त 60 कॉइन जुड़ गए)');
                  setTimeout(() => setCoinToast(null), 3000);
                }}
                className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-600 text-white text-[11px] font-black shadow-md shadow-emerald-500/30 animate-pulse active:scale-95 transition-all"
                title="Claim Free 60 Coins"
              >
                <span>🎁</span>
                <span>+60 Free 🪙</span>
              </button>
            )}

            {onOpenModMenu && (
              <button
                onClick={() => {
                  playSound.gift();
                  onOpenModMenu();
                }}
                className={`flex items-center gap-1 px-2 py-1 rounded-full text-[11px] font-black transition-all active:scale-95 ${
                  isModActive
                    ? 'bg-gradient-to-r from-amber-400 to-yellow-300 text-slate-950 shadow-md shadow-amber-400/40 ring-1 ring-amber-500'
                    : 'bg-slate-900 text-amber-300 border border-amber-400/50'
                }`}
                title="APK MOD Menu"
              >
                <span>⚡</span>
                <span className="text-[10px]">{isModActive ? '999K' : 'MOD'}</span>
              </button>
            )}

            <button
              onClick={() => {
                playSound.pop();
                if (onOpenModMenu && isModActive) {
                  onOpenModMenu();
                } else {
                  onOpenSpecialOffer();
                }
              }}
              className={`w-7 h-7 rounded-full flex items-center justify-center transition-colors ${
                isModActive ? 'bg-amber-100 text-amber-600' : 'bg-purple-50 text-purple-600 hover:bg-purple-100'
              }`}
            >
              <Crown size={16} />
            </button>

            <button
              onClick={() => {
                playSound.coin();
                if (onOpenRecharge) {
                  onOpenRecharge();
                } else {
                  onOpenBonus();
                }
              }}
              className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 text-white text-xs font-black shadow-sm active:scale-95 transition-transform"
              title="Wallet Coins"
            >
              <span>🪙 {userTokens >= 100000 ? `${Math.floor(userTokens / 1000)}k` : userTokens}</span>
              <span className="text-[9px] bg-white/25 px-1 rounded-full font-bold">+</span>
            </button>
          </div>
        </div>

        {/* Free Coins Notification Toast */}
        {coinToast && (
          <div className="mt-2 py-1.5 px-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white text-xs font-black text-center shadow-lg animate-in slide-in-from-top-2 duration-300 flex items-center justify-center gap-1.5">
            <span>✨</span>
            <span>{coinToast}</span>
          </div>
        )}

        {/* Region & Ethnicity Pills Bar (Exact match to video 00:05) */}
        <div className="mt-3 flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
          {/* Country Selector Pill */}
          <button
            onClick={() => {
              playSound.pop();
              onOpenCountryModal();
            }}
            className="flex-shrink-0 flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-600 text-white text-xs font-bold shadow-sm"
          >
            <span>{selectedCountry.flag}</span>
            <span>{selectedCountry.name}</span>
            <span className="text-[10px]">∨</span>
          </button>

          {/* Ethnicity pills */}
          {ethnicities.slice(1).map((eth) => {
            const isSelected = selectedEthnicity === eth;
            return (
              <button
                key={eth}
                onClick={() => {
                  playSound.pop();
                  setSelectedEthnicity(isSelected ? 'All' : eth);
                }}
                className={`flex-shrink-0 px-3 py-1 rounded-full text-xs font-medium transition-all ${
                  isSelected
                    ? 'bg-purple-100 text-purple-800 font-bold border border-purple-300'
                    : 'text-slate-500 hover:text-slate-900 bg-slate-100'
                }`}
              >
                {eth}
              </button>
            );
          })}
        </div>
      </div>

      {/* Streamers Grid Feed */}
      <div className="flex-1 overflow-y-auto p-3 pb-24">
        {/* Neon Exclusive Events Banner (As shown in video 00:05) */}
        <div 
          onClick={onOpenSpecialOffer}
          className="mb-3.5 p-3 rounded-2xl bg-gradient-to-r from-[#3b0764] via-[#581c87] to-[#831843] text-white flex items-center justify-between shadow-lg cursor-pointer border border-pink-500/40 relative overflow-hidden group"
        >
          <div className="relative z-10 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-400 to-pink-500 flex items-center justify-center text-xl shadow-md">
              🎤
            </div>
            <div>
              <div className="text-xs font-black tracking-wide text-amber-300 uppercase">
                Hot Hostess Exclusive Events
              </div>
              <div className="text-[11px] text-white/80">Live Video Chat & Diamond Rewards</div>
            </div>
          </div>
          <span className="relative z-10 text-xs font-bold text-pink-300 group-hover:translate-x-1 transition-transform">
            Join →
          </span>
        </div>

        {/* 2-Column Cards matching video */}
        <div className="grid grid-cols-2 gap-2.5">
          {displayedProfiles.map((profile) => (
            <div
              key={profile.id}
              onClick={() => {
                playSound.pop();
                onSelectUser(profile);
              }}
              className="group relative aspect-[3/4] rounded-2xl overflow-hidden bg-slate-200 cursor-pointer shadow-md hover:scale-[1.01] transition-all"
            >
              {/* Creator Photo */}
              <img
                src={profile.avatar}
                alt={profile.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />

              {/* Gradient Scrim */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-transparent to-black/35 pointer-events-none" />

              {/* Top-Left Language Badge: हिंदी */}
              <div className="absolute top-2 left-2 px-1.5 py-0.5 rounded-md bg-black/50 backdrop-blur text-white text-[10px] font-bold">
                {profile.statusLang || 'हिंदी'}
              </div>

              {/* Top-Right Coin / Viewers Badge: 🪙 29.6K */}
              <div className="absolute top-2 right-2 flex items-center gap-1 px-2 py-0.5 rounded-full bg-black/50 backdrop-blur text-amber-300 text-[11px] font-black">
                <span>🪙</span>
                <span>{profile.coinScore || `${(profile.viewersCount / 100).toFixed(1)}K`}</span>
              </div>

              {/* Bottom Streamer Info */}
              <div className="absolute bottom-2 inset-x-2 text-white">
                <div className="text-sm font-extrabold truncate drop-shadow">
                  {profile.statusTitle || profile.name}
                </div>
                <div className="flex items-center gap-1.5 text-[11px] text-white/90 mt-0.5">
                  <span>{profile.flag}</span>
                  <span className="px-1.5 py-0.2 rounded bg-purple-600/90 text-[10px] font-black">
                    Lv.{profile.level}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
