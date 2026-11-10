import React, { useState, useMemo, useRef, useEffect } from 'react';
import { Search, X, Check } from 'lucide-react';
import { COUNTRIES } from '../data/mockData';
import { CountryItem } from '../types';
import { playSound } from '../utils/soundEffects';

interface CountryModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedCountry: CountryItem;
  onSelectCountry: (c: CountryItem) => void;
}

export const CountryModal: React.FC<CountryModalProps> = ({
  isOpen,
  onClose,
  selectedCountry,
  onSelectCountry,
}) => {
  const [search, setSearch] = useState('');
  const [activeLetter, setActiveLetter] = useState('A');
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Exact quick pills from reference video
  const quickPillCodes = [
    'ALL', 'ID', 'VN', 'PK', 'IN', 'PH', 'CO', 'VE', 'BR', 'SY', 'EG', 'TR'
  ];

  const quickPills = useMemo(() => {
    return quickPillCodes.map((code) => COUNTRIES.find((c) => c.code === code)!).filter(Boolean);
  }, []);

  const filteredCountries = useMemo(() => {
    return COUNTRIES.filter((c) =>
      c.code !== 'ALL' && c.name.toLowerCase().includes(search.toLowerCase())
    );
  }, [search]);

  // Group countries alphabetically
  const grouped = useMemo(() => {
    const map: { [letter: string]: CountryItem[] } = {};
    filteredCountries.forEach((c) => {
      const letter = c.name[0].toUpperCase();
      if (!map[letter]) map[letter] = [];
      map[letter].push(c);
    });
    return map;
  }, [filteredCountries]);

  const alphabet = useMemo(() => {
    return Object.keys(grouped).sort();
  }, [grouped]);

  // Track scroll position to update the floating active letter pill on the right track
  const handleScroll = () => {
    if (!scrollContainerRef.current) return;
    const container = scrollContainerRef.current;
    const scrollTop = container.scrollTop;

    for (const letter of alphabet) {
      const el = document.getElementById(`country-group-${letter}`);
      if (el) {
        const top = el.offsetTop - container.offsetTop;
        const height = el.offsetHeight;
        if (scrollTop >= top - 60 && scrollTop < top + height) {
          setActiveLetter(letter);
          break;
        }
      }
    }
  };

  const scrollToLetter = (letter: string) => {
    const el = document.getElementById(`country-group-${letter}`);
    if (el && scrollContainerRef.current) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      setActiveLetter(letter);
      playSound.pop();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex flex-col justify-end bg-black/80 backdrop-blur-sm sm:items-center sm:justify-center p-0">
      {/* Background Dim Dismiss */}
      <div className="absolute inset-0" onClick={onClose} />

      {/* Slide-Up White Bottom Sheet matching screenshot/video */}
      <div className="relative w-full sm:max-w-md h-[92vh] sm:h-[700px] bg-white text-slate-900 rounded-t-3xl sm:rounded-3xl flex flex-col overflow-hidden shadow-2xl animate-in slide-in-from-bottom duration-300">
        {/* Top Drag Handle & Close */}
        <div className="pt-3 px-5 pb-1 flex items-center justify-between">
          <div className="w-12 h-1.5 bg-slate-200 rounded-full mx-auto absolute left-1/2 -translate-x-1/2 top-2.5" />
          <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mt-1">Select Country / Region</div>
          <button
            onClick={() => {
              playSound.pop();
              onClose();
            }}
            className="w-7 h-7 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-100"
          >
            <X size={16} />
          </button>
        </div>

        {/* Search Bar matching video */}
        <div className="px-4 pt-2 pb-2">
          <div className="relative flex items-center">
            <Search size={16} className="absolute left-3.5 text-slate-400 pointer-events-none" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search"
              className="w-full pl-10 pr-9 py-2.5 bg-slate-100/90 border border-slate-200/50 rounded-2xl text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500/20"
            />
            {search && (
              <button
                onClick={() => setSearch('')}
                className="absolute right-3 w-5 h-5 rounded-full bg-slate-300/80 flex items-center justify-center text-white text-[10px]"
              >
                ✕
              </button>
            )}
          </div>
        </div>

        {/* Quick Filter Pills Row (Exact replica of video) */}
        {!search && (
          <div className="px-4 py-2 border-b border-slate-100">
            <div className="flex flex-wrap gap-2 max-h-28 overflow-y-auto no-scrollbar">
              {/* All Pill */}
              <button
                onClick={() => {
                  playSound.pop();
                  onSelectCountry(COUNTRIES[0]);
                  onClose();
                }}
                className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all ${
                  selectedCountry.code === 'ALL'
                    ? 'border-2 border-purple-600 text-purple-700 bg-purple-50 shadow-sm'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                <span>All 🌍</span>
              </button>

              {/* Individual Country Pills */}
              {quickPills.slice(1).map((c) => {
                const isSelected = selectedCountry.code === c.code;
                return (
                  <button
                    key={c.code}
                    onClick={() => {
                      playSound.pop();
                      onSelectCountry(c);
                      onClose();
                    }}
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                      isSelected
                        ? 'border-2 border-purple-600 text-purple-700 bg-purple-50 shadow-sm'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    <span className="text-sm">{c.flag}</span>
                    <span>{c.name}</span>
                  </button>
                );
              })}

              {/* Others pill */}
              <button
                onClick={() => scrollToLetter('O')}
                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-medium bg-slate-100 text-slate-600 hover:bg-slate-200"
              >
                Others
              </button>
            </div>
          </div>
        )}

        {/* Alphabetical List Container + Right Vertical Alphabet Track */}
        <div className="relative flex-1 overflow-hidden flex">
          {/* Main List */}
          <div
            ref={scrollContainerRef}
            onScroll={handleScroll}
            className="flex-1 overflow-y-auto px-4 py-2 scroll-smooth"
          >
            {alphabet.length === 0 ? (
              <div className="text-center py-16 text-slate-400 text-sm">
                No country found matching "{search}"
              </div>
            ) : (
              alphabet.map((letter) => (
                <div key={letter} id={`country-group-${letter}`} className="mb-4">
                  {/* Letter Header */}
                  <div className="text-xs font-bold text-slate-400 py-1 sticky top-0 bg-white/95 backdrop-blur z-10">
                    {letter}
                  </div>

                  {/* Countries in this letter */}
                  <div className="space-y-1">
                    {grouped[letter].map((c) => {
                      const isSelected = selectedCountry.code === c.code;
                      return (
                        <div
                          key={c.code}
                          onClick={() => {
                            playSound.pop();
                            onSelectCountry(c);
                            onClose();
                          }}
                          className={`flex items-center justify-between py-2.5 px-2 rounded-xl cursor-pointer transition-colors ${
                            isSelected
                              ? 'bg-purple-50 text-purple-700 font-bold'
                              : 'hover:bg-slate-50 text-slate-800'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <span className="text-2xl filter drop-shadow-sm flex items-center justify-center w-7">
                              {c.flag}
                            </span>
                            <span className="text-sm font-medium">{c.name}</span>
                          </div>

                          <div className="flex items-center gap-2">
                            <span className="text-xs text-slate-400 font-mono">
                              {c.activeCount.toLocaleString()}
                            </span>
                            {isSelected && <Check size={16} className="text-purple-600 stroke-[2.5]" />}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Right Alphabet Track with the active black pill indicator (Exact match to video!) */}
          <div className="w-8 py-1 flex flex-col items-center justify-between text-[11px] font-semibold text-slate-400 select-none border-l border-slate-100 pr-1">
            {alphabet.map((letter) => {
              const isActive = activeLetter === letter;
              return (
                <button
                  key={letter}
                  onClick={() => scrollToLetter(letter)}
                  className={`w-5 h-5 flex items-center justify-center rounded-md transition-all text-[10px] ${
                    isActive
                      ? 'bg-slate-900 text-white font-bold shadow-md scale-110'
                      : 'hover:text-slate-900'
                  }`}
                >
                  {letter}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
