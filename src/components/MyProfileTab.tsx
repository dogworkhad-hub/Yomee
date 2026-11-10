import React, { useState, useEffect, useRef } from 'react';
import { 
  Coins, Sparkles, Video, Mic, ShieldCheck, Gift, 
  Settings, Award, Globe2, Heart, Edit3, Camera, Download, Smartphone, Tag
} from 'lucide-react';
import { playSound } from '../utils/soundEffects';

interface MyProfileTabProps {
  userTokens: number;
  onOpenBonus: () => void;
  onOpenSpecialOffer: () => void;
  onOpenRecharge?: () => void;
  onAddTokens: (amount: number) => void;
  onOpenInstall: () => void;
  isModActive?: boolean;
  onOpenModMenu?: () => void;
  onOpenPromoCode?: () => void;
}

export const MyProfileTab: React.FC<MyProfileTabProps> = ({
  userTokens,
  onOpenBonus,
  onOpenSpecialOffer,
  onOpenRecharge,
  onAddTokens,
  onOpenInstall,
  isModActive = false,
  onOpenModMenu,
  onOpenPromoCode,
}) => {
  const [userName, setUserName] = useState('Alex Traveler');
  const [isEditing, setIsEditing] = useState(false);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [freeCoinsToast, setFreeCoinsToast] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);

  const toggleCameraPreview = async () => {
    playSound.pop();
    if (isCameraActive) {
      if (stream) {
        stream.getTracks().forEach((t) => t.stop());
      }
      setStream(null);
      setIsCameraActive(false);
    } else {
      try {
        if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
          const media = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
          setStream(media);
          setIsCameraActive(true);
          if (videoRef.current) {
            videoRef.current.srcObject = media;
          }
        }
      } catch (err) {
        console.warn('Camera test unavailable', err);
      }
    }
  };

  useEffect(() => {
    if (isCameraActive && videoRef.current && stream) {
      videoRef.current.srcObject = stream;
    }
    return () => {
      if (stream) {
        stream.getTracks().forEach((t) => t.stop());
      }
    };
  }, [isCameraActive, stream]);

  return (
    <div className="flex-1 flex flex-col h-full bg-[#0a0614] text-white overflow-y-auto pb-24">
      {/* Header Profile Hero Card */}
      <div className="relative p-6 bg-gradient-to-b from-[#210c3b] to-[#120722] border-b border-white/10">
        <div className="flex items-center gap-4">
          <div className="relative">
            <div className={`w-20 h-20 rounded-full p-1 shadow-xl ${
              isModActive 
                ? 'bg-gradient-to-tr from-amber-400 via-yellow-300 to-amber-500 animate-pulse' 
                : 'bg-gradient-to-tr from-orange-500 to-pink-500'
            }`}>
              <img
                src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=400&q=80"
                alt="My Profile"
                className="w-full h-full object-cover rounded-full"
              />
            </div>
            <span className={`absolute bottom-0 right-0 w-7 h-7 rounded-full text-white text-[10px] font-black flex items-center justify-center border-2 border-slate-900 shadow ${
              isModActive ? 'bg-amber-400 text-slate-950 font-black' : 'bg-pink-500'
            }`}>
              {isModActive ? '👑' : 'Lv.3'}
            </span>
          </div>

          <div className="flex-1">
            <div className="flex items-center gap-2">
              {isEditing ? (
                <input
                  type="text"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  onBlur={() => setIsEditing(false)}
                  className="px-2 py-0.5 rounded bg-white/10 text-white text-base font-bold outline-none border border-pink-500"
                  autoFocus
                />
              ) : (
                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                  <span>{userName}</span>
                  {isModActive && (
                    <span className="text-[10px] bg-gradient-to-r from-amber-400 to-yellow-300 text-slate-950 px-2 py-0.5 rounded-full font-black">
                      VIP MOD
                    </span>
                  )}
                  <button onClick={() => setIsEditing(true)} className="text-white/40 hover:text-white">
                    <Edit3 size={14} />
                  </button>
                </h2>
              )}
            </div>

            <div className="flex items-center gap-2 text-xs text-white/60 mt-1">
              <span>ID: 8492041</span>
              <span>·</span>
              <span className={`font-semibold ${isModActive ? 'text-amber-400' : 'text-pink-400'}`}>
                {isModActive ? 'VIP Gold (Lv.99 GOD)' : 'VIP Bronze'}
              </span>
            </div>

            <div className="flex items-center gap-4 text-xs font-semibold text-white/80 mt-2">
              <span><strong>14</strong> Following</span>
              <span><strong>89</strong> Fans</span>
              <span><strong>42</strong> Calls</span>
            </div>
          </div>
        </div>

        {/* Tokens & Recharge Banner */}
        <div className={`mt-5 p-4 rounded-2xl border flex items-center justify-between shadow-lg ${
          isModActive
            ? 'bg-gradient-to-r from-amber-500/25 via-yellow-500/20 to-orange-500/25 border-amber-400/60'
            : 'bg-gradient-to-r from-amber-500/20 via-orange-500/20 to-pink-500/20 border-orange-500/30'
        }`}>
          <div>
            <div className="text-[11px] text-amber-300 font-bold uppercase tracking-wider flex items-center gap-1.5">
              <span>Coin Balance</span>
              {isModActive && (
                <span className="text-[9px] bg-amber-400 text-slate-950 px-1.5 py-0.2 rounded font-black">UNLIMITED</span>
              )}
            </div>
            <div className="text-2xl font-black text-white flex items-center gap-2 mt-0.5">
              <span>🪙 {userTokens.toLocaleString()}</span>
              <span className="text-xs font-normal text-amber-200">Coins</span>
            </div>
          </div>

          <div className="flex items-center gap-1.5 flex-wrap justify-end">
            {/* Free 60 Coins Button */}
            <button
              onClick={() => {
                playSound.coin();
                onAddTokens(60);
                setFreeCoinsToast('🎉 +60 Free Coins Claimed! (60 मुफ्त कॉइन जुड़ गए)');
                setTimeout(() => setFreeCoinsToast(null), 3500);
              }}
              className="px-2.5 py-2 rounded-xl bg-gradient-to-r from-emerald-400 via-teal-400 to-emerald-500 text-slate-950 text-xs font-black shadow-lg shadow-emerald-500/30 hover:brightness-110 active:scale-95 transition-all flex items-center gap-1 animate-pulse"
              title="Claim 60 Free Coins"
            >
              <span>🎁 +60 Free</span>
            </button>

            {onOpenModMenu && (
              <button
                onClick={() => {
                  playSound.gift();
                  onOpenModMenu();
                }}
                className="px-3 py-2 rounded-xl bg-gradient-to-r from-amber-400 to-yellow-400 text-slate-950 text-xs font-black shadow-md hover:brightness-105 active:scale-95 transition-all flex items-center gap-1"
              >
                <span>⚡ MOD</span>
              </button>
            )}
            <button
              onClick={() => {
                playSound.pop();
                if (onOpenRecharge) {
                  onOpenRecharge();
                } else {
                  onOpenSpecialOffer();
                }
              }}
              className="px-3 py-2 rounded-xl bg-gradient-to-r from-orange-500 via-pink-500 to-purple-600 text-white text-xs font-black shadow-md shadow-pink-500/30 hover:opacity-95 active:scale-95 transition-all flex items-center gap-1"
            >
              <Coins size={14} />
              <span>Recharge</span>
            </button>
          </div>
        </div>

        {/* Free 60 Coins Alert Toast */}
        {freeCoinsToast && (
          <div className="mt-3 py-2 px-4 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white text-xs font-black text-center shadow-lg animate-in slide-in-from-top-2 duration-300 flex items-center justify-center gap-2 border border-emerald-400">
            <span>🪙</span>
            <span>{freeCoinsToast}</span>
          </div>
        )}
      </div>

      {/* Menu Options & Tools */}
      <div className="p-4 space-y-4">
        {/* Hardware Cam / Mic Test Station */}
        <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2 text-sm font-bold">
              <Camera size={16} className="text-pink-400" />
              <span>Camera & Microphone Test</span>
            </div>
            <button
              onClick={toggleCameraPreview}
              className={`px-3 py-1 rounded-full text-xs font-bold transition-all ${
                isCameraActive
                  ? 'bg-rose-500 text-white'
                  : 'bg-white/10 hover:bg-white/20 text-white'
              }`}
            >
              {isCameraActive ? 'Turn Off' : 'Test Camera'}
            </button>
          </div>
          <p className="text-xs text-white/50 mb-3">
            Check your webcam lighting and audio levels before starting video calls.
          </p>

          {isCameraActive && (
            <div className="relative aspect-video rounded-xl overflow-hidden bg-black border border-white/20 mb-2">
              <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover -scale-x-100" />
              <div className="absolute bottom-2 left-2 px-2 py-0.5 rounded bg-black/60 text-[10px] text-emerald-400 font-mono">
                ● Live Camera Signal OK
              </div>
            </div>
          )}
        </div>

        {/* Feature Cards */}
        <div className="space-y-3">
          {/* Direct Install APK Card */}
          <div
            onClick={() => {
              playSound.gift();
              onOpenInstall();
            }}
            className="flex items-center justify-between p-4 bg-gradient-to-r from-orange-500/20 via-pink-500/20 to-purple-500/20 border-2 border-pink-500/50 rounded-2xl cursor-pointer transition-all hover:scale-[1.01] shadow-lg shadow-pink-500/20"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-pink-500 via-rose-500 to-amber-500 flex items-center justify-center text-white shadow-md">
                <Smartphone size={20} />
              </div>
              <div>
                <div className="text-sm font-black text-white flex items-center gap-1.5">
                  <span>होम स्क्रीन पर इंस्टॉल करें (APK)</span>
                  <span className="text-[9px] bg-pink-500 text-white px-1.5 py-0.2 rounded-full font-bold">1-Click</span>
                </div>
                <div className="text-xs text-pink-300">Add to Phone Home Screen</div>
              </div>
            </div>
            <button className="px-3.5 py-1.5 rounded-full bg-gradient-to-r from-orange-500 to-pink-500 text-white text-xs font-black shadow-md hover:opacity-95">
              Install 📥
            </button>
          </div>

          {/* Promo Code Card */}
          <div
            onClick={() => {
              playSound.gift();
              if (onOpenPromoCode) onOpenPromoCode();
            }}
            className="flex items-center justify-between p-4 bg-gradient-to-r from-purple-600/25 via-pink-600/25 to-amber-500/25 border-2 border-purple-400/50 rounded-2xl cursor-pointer transition-all hover:scale-[1.01] shadow-lg shadow-purple-500/20"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-purple-600 via-pink-500 to-amber-400 flex items-center justify-center text-white shadow-md">
                <Tag size={20} />
              </div>
              <div>
                <div className="text-sm font-black text-white flex items-center gap-1.5">
                  <span>प्रोमो कोड डालें (Promo Code)</span>
                  <span className="text-[9px] bg-amber-400 text-slate-950 px-1.5 py-0.2 rounded-full font-black">
                    FREE COINS
                  </span>
                </div>
                <div className="text-xs text-purple-200">Redeem Codes for Coins & VIP</div>
              </div>
            </div>
            <button className="px-3.5 py-1.5 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs font-black shadow-md hover:opacity-95">
              Redeem 🎁
            </button>
          </div>

          <div
            onClick={() => {
              playSound.pop();
              onOpenBonus();
            }}
            className="flex items-center justify-between p-3.5 bg-white/5 hover:bg-white/10 border border-white/5 rounded-2xl cursor-pointer transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-pink-500/20 border border-pink-500/30 flex items-center justify-center text-pink-400">
                <Gift size={18} />
              </div>
              <div>
                <div className="text-xs font-bold text-white">Daily Rewards & Sign-In Bonus</div>
                <div className="text-[11px] text-white/50">Claim daily free tokens & complete tasks</div>
              </div>
            </div>
            <span className="text-xs text-pink-400 font-bold">Claim →</span>
          </div>

          <div
            onClick={() => {
              playSound.pop();
              onOpenSpecialOffer();
            }}
            className="flex items-center justify-between p-3.5 bg-white/5 hover:bg-white/10 border border-white/5 rounded-2xl cursor-pointer transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400">
                <Sparkles size={18} />
              </div>
              <div>
                <div className="text-xs font-bold text-white">Special 60% Offer (280 Coins 🪙)</div>
                <div className="text-[11px] text-white/50">280 Tokens with VIP crown frame & bonus</div>
              </div>
            </div>
            <span className="text-xs text-amber-400 font-bold">Offer →</span>
          </div>

          <div className="flex items-center justify-between p-3.5 bg-white/5 border border-white/5 rounded-2xl">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                <ShieldCheck size={18} />
              </div>
              <div>
                <div className="text-xs font-bold text-white">Safety & Community Standards</div>
                <div className="text-[11px] text-white/50">100% verified real creators & strict moderation</div>
              </div>
            </div>
            <span className="text-[10px] text-emerald-400 font-bold bg-emerald-500/20 px-2 py-0.5 rounded-full">
              Protected
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
