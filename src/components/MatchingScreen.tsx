import React, { useEffect, useState, useMemo } from 'react';
import { X, Globe2, Sparkles, MapPin, Users, Zap } from 'lucide-react';
import { UserProfile, CountryItem } from '../types';
import { MOCK_PROFILES, getProfilesForCountry, COUNTRIES } from '../data/mockData';
import { playSound } from '../utils/soundEffects';

interface MatchingScreenProps {
  country: CountryItem;
  genderFilter: 'all' | 'female' | 'male';
  onMatchFound: (profile: UserProfile) => void;
  onCancel: () => void;
}

export const MatchingScreen: React.FC<MatchingScreenProps> = ({
  country,
  genderFilter,
  onMatchFound,
  onCancel,
}) => {
  const [flyingIndex, setFlyingIndex] = useState(0);
  const [matchStatus, setMatchStatus] = useState('Connecting to All World network...');

  // Get rich candidate pool for this country & gender
  const candidatePool = useMemo(() => {
    return getProfilesForCountry(country.code, genderFilter);
  }, [genderFilter, country]);

  // Random international flags for world atmosphere
  const flyingFlags = useMemo(() => {
    return ['🇮🇳', '🇺🇸', '🇮🇩', '🇧🇷', '🇻🇳', '🇵🇭', '🇨🇴', '🇹🇷', '🇪🇬', '🇳🇬', '🇯🇵', '🇰🇷', '🇪🇸', '🇫🇷'];
  }, []);

  useEffect(() => {
    // Play radar sonar ping
    playSound.radarPing();
    const soundInterval = setInterval(() => {
      playSound.radarPing();
    }, 500);

    // Rapid flying profile cycle (every 95ms for high speed feel)
    const flyInterval = setInterval(() => {
      setFlyingIndex((prev) => (prev + 1) % candidatePool.length);
    }, 95);

    // Timeline updates
    const t1 = setTimeout(() => {
      setMatchStatus(`Scanning ${genderFilter === 'all' ? 'girls & boys' : genderFilter === 'female' ? 'girls' : 'boys'} worldwide in ${country.name}...`);
    }, 700);

    const t2 = setTimeout(() => {
      setMatchStatus('⚡ Match locked! Synchronizing live video & audio...');
    }, 1600);

    const t3 = setTimeout(() => {
      clearInterval(soundInterval);
      clearInterval(flyInterval);
      playSound.matchSuccess();
      const chosen = candidatePool[Math.floor(Math.random() * candidatePool.length)];
      onMatchFound(chosen);
    }, 2300);

    return () => {
      clearInterval(soundInterval);
      clearInterval(flyInterval);
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, [candidatePool, country, genderFilter, onMatchFound]);

  const currentFlyingProfile = candidatePool[flyingIndex] || candidatePool[0] || MOCK_PROFILES[0];

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-between bg-gradient-to-b from-[#090314] via-[#15072d] to-[#04010a] text-white p-6 overflow-hidden select-none">
      {/* Background Animated Radar & World Latitude Rings */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-25">
        <div className="w-[640px] h-[640px] rounded-full border border-pink-500/30 animate-ping duration-1000" />
        <div className="absolute w-[480px] h-[480px] rounded-full border border-purple-500/40" />
        <div className="absolute w-[320px] h-[320px] rounded-full border border-cyan-500/50" />
        <div className="absolute w-[160px] h-[160px] rounded-full border border-pink-500" />
      </div>

      {/* Floating World Flags in Background */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {flyingFlags.map((flag: string, i: number) => (
          <div
            key={i}
            className="absolute text-2xl opacity-30 animate-pulse"
            style={{
              top: `${15 + (i * 19) % 70}%`,
              left: `${8 + (i * 23) % 84}%`,
              animationDelay: `${i * 0.25}s`,
            }}
          >
            {flag}
          </div>
        ))}
      </div>

      {/* Top Header */}
      <div className="w-full flex items-center justify-between z-10 pt-2">
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/10 text-xs">
          <Globe2 size={14} className="text-pink-400 animate-spin" style={{ animationDuration: '6s' }} />
          <span>{country.flag} {country.name}</span>
          <span className="text-white/40">·</span>
          <span className="capitalize text-pink-300 font-bold">
            {genderFilter === 'all' ? 'All (Girls & Boys)' : genderFilter === 'female' ? 'Girls Only 👧' : 'Boys Only 👦'}
          </span>
        </div>

        <button
          onClick={() => {
            playSound.pop();
            onCancel();
          }}
          className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur flex items-center justify-center text-white/80 hover:text-white transition-colors"
        >
          <X size={20} />
        </button>
      </div>

      {/* Central Flying Orbit Stage */}
      <div className="relative flex flex-col items-center justify-center my-auto z-10">
        {/* Glowing halo */}
        <div className="absolute w-72 h-72 rounded-full bg-gradient-to-r from-pink-500/30 via-purple-500/30 to-indigo-500/30 blur-3xl animate-pulse" />

        {/* Orbiting flying background avatars */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          {candidatePool.slice(0, 8).map((p, idx) => {
            const angle = (idx / 8) * 2 * Math.PI + (flyingIndex * 0.5);
            const r = 140;
            const x = Math.cos(angle) * r;
            const y = Math.sin(angle) * r;
            return (
              <div
                key={p.id}
                className="absolute w-12 h-12 rounded-full overflow-hidden border-2 border-white/40 shadow-xl transition-transform duration-150"
                style={{
                  transform: `translate(${x}px, ${y}px) scale(${idx === flyingIndex % 8 ? 1.3 : 0.85})`,
                  opacity: idx === flyingIndex % 8 ? 1 : 0.45,
                }}
              >
                <img src={p.avatar} alt={p.name} className="w-full h-full object-cover" />
              </div>
            );
          })}
        </div>

        {/* Big Central Hero Avatar Flying In */}
        <div className="relative w-44 h-44 rounded-full p-1.5 bg-gradient-to-tr from-pink-500 via-rose-500 to-amber-400 shadow-2xl shadow-pink-500/50 animate-pulse">
          <div className="w-full h-full rounded-full overflow-hidden border-4 border-slate-900 bg-slate-800">
            <img
              src={currentFlyingProfile.avatar}
              alt={currentFlyingProfile.name}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Profile Name & Country Pill */}
          <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 px-3.5 py-1 rounded-full bg-slate-900 border border-pink-500/40 text-xs font-black text-white flex items-center gap-1.5 shadow-xl whitespace-nowrap">
            <span className="text-sm">{currentFlyingProfile.flag}</span>
            <span>{currentFlyingProfile.name}</span>
            <span className="text-[10px] text-pink-400 font-bold">
              ({currentFlyingProfile.gender === 'female' ? '♀' : '♂'} {currentFlyingProfile.age})
            </span>
          </span>
        </div>

        {/* Radar Scanning Waves & Status */}
        <div className="mt-10 text-center">
          <div className="flex items-center justify-center gap-2 text-pink-400 text-xs font-bold uppercase tracking-wider mb-1">
            <Sparkles size={14} className="animate-spin text-amber-300" />
            <span>All World Video Match</span>
          </div>
          <h2 className="text-lg font-black text-white tracking-wide">
            {matchStatus}
          </h2>
          <p className="text-xs text-white/50 mt-1">
            Matching with active creators across 100+ countries 🌍
          </p>
        </div>
      </div>

      {/* Bottom Cancel Button */}
      <div className="w-full max-w-xs z-10 pb-2">
        <button
          onClick={() => {
            playSound.pop();
            onCancel();
          }}
          className="w-full py-3.5 rounded-2xl bg-white/10 hover:bg-white/15 border border-white/10 text-sm font-semibold text-white/80 hover:text-white transition-all active:scale-[0.98]"
        >
          Cancel Matching
        </button>
      </div>
    </div>
  );
};
