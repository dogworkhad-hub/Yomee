import React, { useState } from 'react';
import { 
  X, Smartphone, Check, Sparkles, ExternalLink, 
  Copy, CheckCircle2, QrCode, 
  Share2, MessageCircle, AlertCircle
} from 'lucide-react';
import { playSound } from '../utils/soundEffects';

interface InstallModalProps {
  isOpen: boolean;
  onClose: () => void;
  deferredPrompt: any;
  onInstalled: () => void;
  isModActive: boolean;
  onToggleMod: () => void;
}

export const InstallModal: React.FC<InstallModalProps> = ({
  isOpen,
  onClose,
  deferredPrompt,
  onInstalled,
  isModActive,
  onToggleMod,
}) => {
  const [copiedLink, setCopiedLink] = useState(false);
  const appUrl = 'https://ais-pre-rvobhtogubi75ocqq45ncs-541004542969.asia-southeast1.run.app';
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=240x240&data=${encodeURIComponent(appUrl)}&margin=10`;
  const whatsappUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(`Bad Daddy Video Call App Link: ${appUrl}`)}`;

  if (!isOpen) return null;

  const [showManualTip, setShowManualTip] = useState(false);

  const handleInstallPrompt = async () => {
    playSound.pop();
    if (deferredPrompt) {
      try {
        deferredPrompt.prompt();
        const choiceResult = await deferredPrompt.userChoice;
        if (choiceResult.outcome === 'accepted') {
          onInstalled();
          onClose();
        }
      } catch (err) {
        console.error('Install prompt error:', err);
      }
    } else {
      setShowManualTip(true);
    }
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(appUrl);
    setCopiedLink(true);
    playSound.pop();
    setTimeout(() => setCopiedLink(false), 3000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/90 backdrop-blur-md p-0 sm:p-4 animate-in fade-in">
      <div className="w-full sm:max-w-md max-h-[92vh] bg-gradient-to-b from-[#1b0a30] via-[#110522] to-[#080212] border-2 border-purple-500/50 rounded-t-3xl sm:rounded-3xl p-4 sm:p-5 text-white shadow-2xl overflow-y-auto flex flex-col no-scrollbar">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-white/10 sticky top-0 bg-[#1b0a30]/95 backdrop-blur-md z-10">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-purple-600 to-pink-500 flex items-center justify-center shadow-lg shadow-purple-500/30">
              <Smartphone size={20} className="text-white" />
            </div>
            <div>
              <h3 className="text-base font-black text-white">Bad Daddy Video Call App</h3>
              <p className="text-[11px] text-pink-300 font-medium">बिना टाइप किए फोन में खोलें और लगाएं</p>
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

        {/* 1. DIRECT ZIP FILE DOWNLOAD (Requested by User) */}
        <div className="my-3 p-4 rounded-2xl bg-gradient-to-r from-emerald-950/60 via-teal-950/60 to-cyan-950/60 border-2 border-emerald-400/80 shadow-2xl">
          <div className="flex items-center gap-2.5 mb-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-500 to-cyan-400 flex items-center justify-center text-slate-950 font-black shadow-lg shadow-emerald-500/30">
              📦
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h4 className="text-sm font-black text-white">Bad Daddy Application ZIP File</h4>
                <span className="text-[10px] bg-emerald-400 text-slate-950 font-black px-1.5 py-0.2 rounded-full">281 KB</span>
              </div>
              <p className="text-[11px] text-emerald-300 font-medium">Full Source Code + Production Build + APK Guide</p>
            </div>
          </div>

          <p className="text-[11px] text-white/80 my-2 leading-relaxed">
            यह ऐप का पूरा पैकेज है। इसमें <strong className="text-white">dist/</strong> (तैयार वेब ऐप), <strong className="text-white">src/</strong> (सोर्स कोड) और <strong className="text-white">README_HOW_TO_MAKE_APK.txt</strong> (APK बनाने की पूरी गाइड) शामिल है।
          </p>

          <a
            href="/yomee-app.zip"
            download="yomee-app.zip"
            onClick={() => playSound.gift()}
            className="w-full mt-2 py-3 px-4 rounded-xl bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400 text-slate-950 font-black text-xs flex items-center justify-center gap-2 shadow-xl shadow-emerald-500/40 active:scale-95 transition-all"
          >
            <Smartphone size={16} />
            <span>यहाँ से Download करें: yomee-app.zip (290 KB)</span>
          </a>
        </div>

        {/* 2. QR CODE SCANNER (No typing required!) */}
        <div className="mb-3 p-4 rounded-2xl bg-gradient-to-b from-purple-900/60 to-slate-900/80 border-2 border-purple-500/60 text-center flex flex-col items-center shadow-xl">
          <div className="flex items-center gap-2 mb-2">
            <QrCode size={18} className="text-pink-400" />
            <h4 className="text-xs font-black text-white uppercase tracking-wider">
              तरीका 1: मोबाइल कैमरे से स्कैन करें
            </h4>
          </div>

          {/* QR Code Image */}
          <div className="p-2.5 bg-white rounded-2xl shadow-2xl border-4 border-purple-400 my-1">
            <img 
              src={qrCodeUrl} 
              alt="Scan to open Bad Daddy App" 
              className="w-44 h-44 object-contain rounded-lg"
            />
          </div>

          <div className="mt-2 text-[11px] text-purple-200 font-semibold space-y-0.5">
            <div>अपने फोन का <strong className="text-white">Camera</strong> या <strong className="text-white">Google Lens</strong> खोलें</div>
            <div>और इस QR कोड को देखें — <strong>लिंक तुरंत खुल जाएगा!</strong></div>
          </div>
        </div>

        {/* 3. WHATSAPP & COPY ACTIONS */}
        <div className="mb-3 p-3.5 rounded-2xl bg-white/5 border border-white/10 space-y-2.5">
          <div className="text-xs font-black text-emerald-300 flex items-center gap-1.5">
            <Share2 size={15} />
            <span>तरीका 2: खुद को या दोस्त को WhatsApp पर भेजें:</span>
          </div>

          <div className="grid grid-cols-2 gap-2">
            {/* WhatsApp Share Button */}
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="py-2.5 px-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-black text-xs flex items-center justify-center gap-1.5 shadow-md active:scale-95 transition-transform"
            >
              <MessageCircle size={15} />
              <span>WhatsApp पर भेजें</span>
            </a>

            {/* Copy Link Button */}
            <button
              onClick={handleCopyLink}
              className="py-2.5 px-3 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 text-white font-black text-xs flex items-center justify-center gap-1.5 shadow-md active:scale-95 transition-transform"
            >
              {copiedLink ? <Check size={15} /> : <Copy size={15} />}
              <span>{copiedLink ? 'Copied!' : 'Copy Link'}</span>
            </button>
          </div>

          <div className="pt-1">
            <input
              type="text"
              readOnly
              value={appUrl}
              className="w-full px-3 py-2 rounded-xl bg-black/60 border border-white/10 text-[10px] text-pink-300 font-mono select-all truncate"
            />
          </div>
        </div>

        {/* 4. CHROME 3-DOTS TO HOME SCREEN */}
        <div className="mb-3 p-3.5 rounded-2xl bg-purple-950/40 border border-purple-500/30 text-[11px] text-white/80 space-y-1.5">
          <div className="font-bold text-amber-300 flex items-center gap-1">
            <CheckCircle2 size={14} className="text-emerald-400" />
            <span>लिंक खुलने के बाद होम स्क्रीन पर कैसे लगाएं:</span>
          </div>
          <div className="pl-1 space-y-1 text-white/90">
            <div>1. Chrome में ऊपर दायें कोने में <strong>3 डॉट्स (⋮)</strong> दबाएं।</div>
            <div>2. <strong>"Install app"</strong> या <strong>"Add to Home screen"</strong> चुनें।</div>
            <div>3. Yomee का आइकॉन आपके मोबाइल स्क्रीन पर आ जाएगा!</div>
          </div>

          {/* Quick Install Trigger */}
          <button
            onClick={handleInstallPrompt}
            className="w-full mt-2 py-3 px-4 rounded-xl bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 font-black text-xs text-slate-950 flex items-center justify-center gap-2 shadow active:scale-95 transition-all"
          >
            <Smartphone size={16} />
            <span>होम स्क्रीन पर Install करें</span>
          </button>

          {showManualTip && (
            <div className="mt-2 p-2.5 rounded-xl bg-amber-400/20 border border-amber-400/50 text-[11px] text-amber-200 animate-in fade-in flex items-start gap-2">
              <span className="text-base">👆</span>
              <div>
                <strong>सीधा तरीका:</strong> अपने Chrome ब्राउज़र के सबसे ऊपर दाईं तरफ <strong>3 बिंदु (⋮)</strong> दबाएं और <strong>"Add to Home screen" (होम स्क्रीन में जोड़ें)</strong> दबाएं!
              </div>
            </div>
          )}
        </div>

        {/* 5. MOD TOGGLE */}
        <div className="p-3 rounded-2xl bg-gradient-to-r from-amber-500/20 via-purple-500/20 to-pink-500/20 border border-amber-500/30 flex items-center justify-between mb-3">
          <div>
            <div className="flex items-center gap-1.5 text-xs font-black text-amber-300">
              <span>👑 VIP Gold MOD: 999,999 Coins</span>
            </div>
            <p className="text-[10px] text-white/60 mt-0.5">
              {isModActive ? 'Active - Unlimited Free Video Calls' : 'Click to activate unlimited coins'}
            </p>
          </div>

          <button
            onClick={() => {
              playSound.gift();
              onToggleMod();
            }}
            className={`px-3 py-1.5 rounded-full text-xs font-black transition-all ${
              isModActive
                ? 'bg-amber-400 text-slate-950 shadow-lg shadow-amber-400/30'
                : 'bg-white/10 text-white hover:bg-white/20'
            }`}
          >
            {isModActive ? 'MOD ON ✨' : 'Turn ON'}
          </button>
        </div>

        {/* Close */}
        <button
          onClick={() => {
            playSound.pop();
            onClose();
          }}
          className="w-full py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-xs font-bold text-white/80 transition-colors"
        >
          समझ गया, बंद करें (Close)
        </button>
      </div>
    </div>
  );
};
