import React, { useState } from 'react';
import { X, Gift, Sparkles, Check, Tag, KeyRound, AlertCircle, Copy, ArrowRight } from 'lucide-react';
import { playSound } from '../utils/soundEffects';

interface PromoCodeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyCode: (code: string, rewardCoins: number, isVip: boolean) => void;
}

interface PromoCodeDef {
  code: string;
  coins: number;
  label: string;
  desc: string;
  isVip?: boolean;
}

const PRESET_PROMO_CODES: PromoCodeDef[] = [
  { code: 'YOMEE50', coins: 50, label: '50 Free Coins', desc: '50 मुफ्त कॉइन (Welcome Gift)' },
  { code: 'FREE60', coins: 60, label: '60 Free Coins', desc: '60 फ्री कॉइन स्पेशल कोड' },
  { code: 'APKMOD', coins: 999999, label: 'VIP MOD Unlocked', desc: 'असीमित कॉइन्स + फ्री वीडियो कॉल', isVip: true },
  { code: 'VIPGOLD', coins: 50000, label: 'VIP Gold Lv.99', desc: 'गोल्ड वीआईपी स्टेटस + 50,000 कॉइन्स', isVip: true },
];

export const PromoCodeModal: React.FC<PromoCodeModalProps> = ({
  isOpen,
  onClose,
  onApplyCode,
}) => {
  const [inputCode, setInputCode] = useState('');
  const [statusMessage, setStatusMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  if (!isOpen) return null;

  const handleRedeem = (codeToRedeem?: string) => {
    const rawCode = (codeToRedeem || inputCode).trim().toUpperCase();
    if (!rawCode) {
      setStatusMessage({ text: 'कृपया कोई प्रोमो कोड लिखें!', type: 'error' });
      return;
    }

    const matched = PRESET_PROMO_CODES.find((c) => c.code === rawCode);

    if (matched) {
      playSound.coin();
      onApplyCode(matched.code, matched.coins, !!matched.isVip);
      setStatusMessage({
        text: `🎉 कोड "${matched.code}" सफल! +${matched.coins >= 10000 ? matched.coins.toLocaleString() : matched.coins} कॉइन्स खाते में जुड़ गए!`,
        type: 'success',
      });
      setInputCode('');
      setTimeout(() => {
        onClose();
        setStatusMessage(null);
      }, 2000);
    } else {
      // Dynamic fallback: any code user enters gives at least 100 coins!
      playSound.gift();
      onApplyCode(rawCode, 100, true);
      setStatusMessage({
        text: `🎉 स्पेशल प्रोमो कोड "${rawCode}" एक्टिवेट हो गया! +100 फ्री कॉइन्स जुड़ गए!`,
        type: 'success',
      });
      setInputCode('');
      setTimeout(() => {
        onClose();
        setStatusMessage(null);
      }, 2000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/85 backdrop-blur-md p-0 sm:p-4 animate-in fade-in">
      <div className="w-full sm:max-w-md max-h-[92vh] bg-gradient-to-b from-[#1f0d36] via-[#140824] to-[#0a0312] border-2 border-purple-500/50 rounded-t-3xl sm:rounded-3xl p-5 text-white shadow-2xl overflow-y-auto flex flex-col no-scrollbar">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-white/10">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-pink-500 via-purple-600 to-amber-400 flex items-center justify-center shadow-lg shadow-purple-500/40">
              <Tag size={20} className="text-white" />
            </div>
            <div>
              <h3 className="text-base font-black text-white flex items-center gap-1.5">
                <span>प्रोमो कोड (Promo Code)</span>
                <span className="text-[10px] bg-amber-400 text-slate-950 font-black px-1.5 py-0.2 rounded-full">
                  Redeem
                </span>
              </h3>
              <p className="text-[11px] text-pink-300">फ्री कॉइन्स और वीआईपी अनलॉक करने के लिए कोड डालें</p>
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

        {/* Input Card */}
        <div className="mt-4 p-4 rounded-2xl bg-white/5 border border-white/10 space-y-3">
          <label className="text-xs font-bold text-purple-200 flex items-center gap-1.5">
            <KeyRound size={14} className="text-pink-400" />
            <span>यहाँ अपना प्रोमो कोड टाइप करें:</span>
          </label>

          <div className="flex items-center gap-2">
            <input
              type="text"
              value={inputCode}
              onChange={(e) => {
                setInputCode(e.target.value.toUpperCase());
                setStatusMessage(null);
              }}
              placeholder="उदा. FREE60, YOMEE50, APKMOD"
              className="flex-1 px-3.5 py-2.5 rounded-xl bg-black/60 border border-purple-500/40 text-sm text-amber-300 font-mono font-bold tracking-wider placeholder:text-white/30 outline-none focus:border-pink-500 transition-colors uppercase"
            />
            <button
              onClick={() => handleRedeem()}
              className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-pink-500 via-purple-500 to-amber-400 text-slate-950 font-black text-xs shadow-lg shadow-pink-500/30 hover:brightness-110 active:scale-95 transition-all flex items-center gap-1"
            >
              <span>Apply</span>
              <ArrowRight size={14} />
            </button>
          </div>

          {statusMessage && (
            <div
              className={`p-2.5 rounded-xl text-xs font-bold text-center animate-in fade-in flex items-center justify-center gap-1.5 ${
                statusMessage.type === 'success'
                  ? 'bg-emerald-500/20 border border-emerald-500/50 text-emerald-300'
                  : 'bg-rose-500/20 border border-rose-500/50 text-rose-300'
              }`}
            >
              {statusMessage.type === 'success' ? '✨' : '⚠️'}
              <span>{statusMessage.text}</span>
            </div>
          )}
        </div>

        {/* Available Ready Promo Codes */}
        <div className="mt-4 space-y-2">
          <div className="text-[11px] font-black uppercase tracking-wider text-amber-300/90 px-1 flex items-center justify-between">
            <span>रेडी प्रोमो कोड (टच करके तुरंत लागू करें):</span>
            <span className="text-[10px] text-white/50">1-Tap Apply</span>
          </div>

          <div className="grid grid-cols-1 gap-2">
            {PRESET_PROMO_CODES.map((item) => (
              <div
                key={item.code}
                onClick={() => handleRedeem(item.code)}
                className="p-3 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-pink-500/50 cursor-pointer active:scale-95 transition-all flex items-center justify-between group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-amber-400/20 to-pink-500/20 border border-amber-400/30 flex items-center justify-center text-lg">
                    {item.isVip ? '👑' : '🪙'}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-black text-xs text-amber-300 tracking-wider bg-black/40 px-2 py-0.5 rounded border border-amber-400/30">
                        {item.code}
                      </span>
                      <span className="text-xs font-bold text-white">{item.label}</span>
                    </div>
                    <p className="text-[11px] text-white/60 mt-0.5">{item.desc}</p>
                  </div>
                </div>

                <button className="px-3 py-1.5 rounded-xl bg-pink-500/20 group-hover:bg-pink-500 border border-pink-500/40 text-pink-300 group-hover:text-white text-[11px] font-black transition-all">
                  Use
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Explain Promo Code to Make App */}
        <div className="mt-4 p-3.5 rounded-2xl bg-gradient-to-r from-blue-950/40 via-purple-950/40 to-pink-950/40 border border-purple-500/30 text-xs text-white/80 leading-relaxed space-y-1">
          <div className="font-bold text-amber-300 flex items-center gap-1.5">
            <Sparkles size={14} className="text-amber-400" />
            <span>प्रोमो कोड से ऐप कैसे बनेगी?</span>
          </div>
          <p className="text-[11px] text-white/70">
            • प्रोमो कोड डालने से आपके खाते में तुरंत कॉइन्स जुड़ जाते हैं और वीआईपी मोड चालू हो जाता है।<br />
            • स्क्रीन पर ऐप लाने के लिए किसी कोड की ज़रूरत नहीं है — बस Chrome में <strong>"Add to Home screen"</strong> दबाएं!
          </p>
        </div>

        {/* Close Button */}
        <button
          onClick={() => {
            playSound.pop();
            onClose();
          }}
          className="w-full mt-3 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-xs font-bold text-white/80 transition-colors"
        >
          बंद करें (Close)
        </button>
      </div>
    </div>
  );
};
