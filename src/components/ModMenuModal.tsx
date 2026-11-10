import React, { useState } from 'react';
import { 
  X, Zap, Crown, Coins, ShieldCheck, Sparkles, Video, 
  Check, Lock, Unlock, Download, Smartphone, Flame, RefreshCw, Star, Tag
} from 'lucide-react';
import { playSound } from '../utils/soundEffects';

interface ModMenuModalProps {
  isOpen: boolean;
  onClose: () => void;
  isModActive: boolean;
  onToggleMod: () => void;
  userTokens: number;
  onSetTokens: (amount: number) => void;
  onOpenInstall: () => void;
  onOpenPromoCode?: () => void;
}

export const ModMenuModal: React.FC<ModMenuModalProps> = ({
  isOpen,
  onClose,
  isModActive,
  onToggleMod,
  userTokens,
  onSetTokens,
  onOpenInstall,
  onOpenPromoCode,
}) => {
  const [unlimitedCoins, setUnlimitedCoins] = useState(true);
  const [vipGoldUnlocked, setVipGoldUnlocked] = useState(true);
  const [freeVideoCalls, setFreeVideoCalls] = useState(true);
  const [femaleFilterBypass, setFemaleFilterBypass] = useState(true);
  const [hdBeautyFilter, setHdBeautyFilter] = useState(true);
  const [antiBanGuard, setAntiBanGuard] = useState(true);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-3 sm:p-4 animate-in fade-in">
      <div className="w-full max-w-md max-h-[90vh] bg-gradient-to-b from-[#1b092c] via-[#10041d] to-[#07010f] border-2 border-amber-500/70 rounded-3xl p-5 text-white shadow-2xl overflow-y-auto flex flex-col no-scrollbar relative">
        
        {/* Glow effect */}
        <div className="absolute -top-12 -left-12 w-40 h-40 bg-amber-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-12 -right-12 w-40 h-40 bg-purple-500/20 rounded-full blur-3xl pointer-events-none" />

        {/* Modal Header */}
        <div className="flex items-center justify-between pb-3 border-b border-amber-500/30 sticky top-0 bg-[#1b092c]/95 backdrop-blur-md z-10">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-400 via-orange-500 to-pink-500 flex items-center justify-center shadow-lg shadow-amber-500/40 text-slate-950 font-black">
              <Zap size={22} className="fill-slate-950" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-black text-amber-300">Bad Daddy APK MOD Menu</h3>
                <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-amber-400 text-slate-950 uppercase tracking-wider">
                  v4.8 VIP
                </span>
              </div>
              <p className="text-[11px] text-amber-200/80 font-medium">मोड फीचर्स: अनलिमिटेड कॉइन्स & फ्री कॉलिंग</p>
            </div>
          </div>

          <button
            onClick={() => {
              playSound.pop();
              onClose();
            }}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white/70 hover:text-white transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Master MOD Status Switch */}
        <div className={`mt-4 p-4 rounded-2xl border-2 transition-all ${
          isModActive 
            ? 'bg-gradient-to-r from-amber-500/25 via-purple-600/25 to-pink-500/25 border-amber-400 shadow-xl shadow-amber-500/20' 
            : 'bg-white/5 border-white/15'
        }`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black text-xl shadow-lg ${
                isModActive ? 'bg-gradient-to-tr from-amber-400 to-yellow-300 text-slate-950' : 'bg-white/10 text-white/50'
              }`}>
                👑
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-black text-white">
                    {isModActive ? 'APK MOD ACTIVE (चालू है)' : 'APK MOD OFF (बंद है)'}
                  </span>
                  {isModActive && (
                    <span className="inline-block w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                  )}
                </div>
                <p className="text-xs text-amber-200/90 mt-0.5">
                  {isModActive ? '999,999 Coins + Unlimited Calls Unlocked' : 'Tap button to enable all MOD features'}
                </p>
              </div>
            </div>

            <button
              onClick={() => {
                playSound.gift();
                onToggleMod();
              }}
              className={`px-4 py-2.5 rounded-2xl font-black text-xs transition-all active:scale-95 shadow-lg ${
                isModActive
                  ? 'bg-gradient-to-r from-amber-400 to-yellow-300 text-slate-950 hover:brightness-105 shadow-amber-400/40'
                  : 'bg-gradient-to-r from-purple-600 to-pink-600 text-white'
              }`}
            >
              {isModActive ? 'TURN OFF' : 'TURN ON ✨'}
            </button>
          </div>

          {/* Quick Balance Display */}
          <div className="mt-3 pt-3 border-t border-white/10 flex items-center justify-between text-xs">
            <span className="text-white/70">Current Balance:</span>
            <span className="font-black text-amber-300 flex items-center gap-1 text-sm">
              <Coins size={14} className="text-amber-400" />
              {userTokens.toLocaleString()} Coins
            </span>
          </div>
        </div>

        {/* MOD Feature Toggles List */}
        <div className="mt-4 space-y-2">
          <div className="text-[11px] font-black uppercase tracking-wider text-amber-400/80 px-1">
            MOD Features (सारे फीचर्स अनलॉक):
          </div>

          {/* 1. Unlimited Coins */}
          <div className="p-3 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold">
                🪙
              </div>
              <div>
                <div className="text-xs font-black text-white">Unlimited Coins (999,999)</div>
                <div className="text-[10px] text-white/60">सिक्के कभी खत्म नहीं होंगे (Auto Refill)</div>
              </div>
            </div>
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => {
                  playSound.coin();
                  onSetTokens(userTokens + 60);
                }}
                className="px-2.5 py-1 rounded-xl bg-emerald-400/20 border border-emerald-400/50 text-emerald-300 text-[11px] font-black hover:bg-emerald-400/30 active:scale-95 transition-transform"
              >
                +60 Free
              </button>
              <button
                onClick={() => {
                  playSound.coin();
                  onSetTokens(999999);
                }}
                className="px-2.5 py-1 rounded-xl bg-amber-400/20 border border-amber-400/50 text-amber-300 text-[11px] font-black hover:bg-amber-400/30 active:scale-95 transition-transform"
              >
                +999K
              </button>
            </div>
          </div>

          {/* 2. Free Video Calls */}
          <div className="p-3 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-pink-500/20 text-pink-400 flex items-center justify-center font-bold">
                <Video size={16} />
              </div>
              <div>
                <div className="text-xs font-black text-white">100% Free Video Calls</div>
                <div className="text-[10px] text-white/60">कॉल के दौरान कोई कॉइन नहीं कटेगा</div>
              </div>
            </div>
            <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40">
              ACTIVE
            </span>
          </div>

          {/* 3. VIP Gold Rank */}
          <div className="p-3 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center font-bold">
                <Crown size={16} />
              </div>
              <div>
                <div className="text-xs font-black text-white">VIP Gold Crown & Lv.99 God Rank</div>
                <div className="text-[10px] text-white/60">गोल्डन प्रोफाइल और वीआईपी बैज</div>
              </div>
            </div>
            <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40">
              VIP GOLD
            </span>
          </div>

          {/* 4. Unlock All Profiles */}
          <div className="p-3 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-teal-500/20 text-teal-400 flex items-center justify-center font-bold">
                <Unlock size={16} />
              </div>
              <div>
                <div className="text-xs font-black text-white">All Girls & Rooms Unlocked</div>
                <div className="text-[10px] text-white/60">किसी भी क्रिएटर से सीधे 1-on-1 बात करें</div>
              </div>
            </div>
            <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-teal-500/20 text-teal-300 border border-teal-500/40">
              UNLOCKED
            </span>
          </div>

          {/* 5. Anti-Ban & High Speed */}
          <div className="p-3 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center font-bold">
                <ShieldCheck size={16} />
              </div>
              <div>
                <div className="text-xs font-black text-white">Anti-Ban Protection & 4K HD Camera</div>
                <div className="text-[10px] text-white/60">100% सेफ और हाई क्वालिटी वीडियो</div>
              </div>
            </div>
            <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/40">
              PROTECTED
            </span>
          </div>
        </div>

        {/* Promo Code Shortcut Card */}
        {onOpenPromoCode && (
          <div
            onClick={() => {
              playSound.gift();
              onClose();
              onOpenPromoCode();
            }}
            className="mt-3 p-3 rounded-2xl bg-gradient-to-r from-purple-500/20 via-pink-500/20 to-amber-500/20 border border-purple-400/40 flex items-center justify-between cursor-pointer active:scale-95 transition-all hover:bg-white/10"
          >
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-purple-500 to-pink-500 flex items-center justify-center text-white">
                <Tag size={16} />
              </div>
              <div>
                <div className="text-xs font-black text-white flex items-center gap-1.5">
                  <span>प्रोमो कोड डालें (Redeem Promo Code)</span>
                  <span className="text-[9px] bg-amber-400 text-slate-950 font-black px-1.5 rounded-full">FREE</span>
                </div>
                <div className="text-[10px] text-purple-200">FREE60, YOMEE50 या अपना कोड रिडीम करें</div>
              </div>
            </div>
            <button className="px-2.5 py-1 rounded-xl bg-pink-500 text-white font-black text-[11px]">
              Open →
            </button>
          </div>
        )}

        {/* Quick APK & ZIP Download Options */}
        <div className="mt-3 p-3.5 rounded-2xl bg-gradient-to-r from-emerald-950/60 to-cyan-950/60 border border-emerald-500/40">
          <div className="text-xs font-black text-white flex items-center gap-1.5 mb-1">
            <Download size={14} className="text-emerald-400" />
            <span>APK और होम स्क्रीन ऑप्शन (Home Screen & ZIP):</span>
          </div>
          <p className="text-[11px] text-emerald-200/80 mb-2.5 leading-relaxed">
            इस ऐप को फोन की होम स्क्रीन पर सीधे इंस्टॉल करें या पूरी ZIP फाइल डाउनलोड करें:
          </p>

          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => {
                playSound.pop();
                onClose();
                onOpenInstall();
              }}
              className="py-2.5 px-3 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-black text-xs flex items-center justify-center gap-1.5 active:scale-95 transition-all shadow"
            >
              <Smartphone size={14} />
              <span>Install to Phone</span>
            </button>

            <a
              href="/yomee-app.zip"
              download="yomee-app.zip"
              onClick={() => playSound.gift()}
              className="py-2.5 px-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs flex items-center justify-center gap-1.5 active:scale-95 transition-all shadow"
            >
              <Download size={14} />
              <span>yomee-app.zip</span>
            </a>
          </div>
        </div>

        {/* Close Button */}
        <button
          onClick={() => {
            playSound.pop();
            onClose();
          }}
          className="mt-4 w-full py-3 rounded-2xl bg-gradient-to-r from-amber-400 via-orange-400 to-pink-500 text-slate-950 font-black text-xs shadow-lg active:scale-95 transition-transform"
        >
          {isModActive ? '✅ MOD चालू है - मजे करें (Save & Play)' : 'बंद करें (Close)'}
        </button>
      </div>
    </div>
  );
};
