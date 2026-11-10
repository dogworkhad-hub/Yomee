import React, { useState, useEffect, useRef } from 'react';
import { 
  Mic, MicOff, Video, VideoOff, PhoneOff, SkipForward, 
  Gift, Heart, MessageSquare, Send, Sparkles, Wand2, 
  RotateCw, Shield, Volume2, VolumeX, UserPlus, Check
} from 'lucide-react';
import { UserProfile, GiftItem, ChatMessage } from '../types';
import { GiftTray } from './GiftTray';
import { playSound } from '../utils/soundEffects';

interface VideoCallScreenProps {
  partner: UserProfile;
  userTokens: number;
  onDeductTokens: (amount: number) => void;
  onOpenBonus: () => void;
  onOpenRecharge?: () => void;
  onNextMatch: () => void;
  onEndCall: () => void;
  isFollowing: boolean;
  onToggleFollow: (userId: string) => void;
}

export const VideoCallScreen: React.FC<VideoCallScreenProps> = ({
  partner,
  userTokens,
  onDeductTokens,
  onOpenBonus,
  onOpenRecharge,
  onNextMatch,
  onEndCall,
  isFollowing,
  onToggleFollow,
}) => {
  // Call status
  const [callDuration, setCallDuration] = useState(0);
  const [isMicMuted, setIsMicMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [isSpeakerMuted, setIsSpeakerMuted] = useState(false);
  const [activeFilter, setActiveFilter] = useState<'normal' | 'glow' | 'warm' | 'cyber'>('glow');
  
  // Real Local WebCam stream
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [cameraError, setCameraError] = useState(false);
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);

  // Chat & Gifts
  const [isGiftTrayOpen, setIsGiftTrayOpen] = useState(false);
  const [activeGiftAnimation, setActiveGiftAnimation] = useState<GiftItem | null>(null);
  const [floatingHearts, setFloatingHearts] = useState<{ id: number; x: number; y: number }[]>([]);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isChatExpanded, setIsChatExpanded] = useState(true);
  const [partnerSpeaking, setPartnerSpeaking] = useState(true);

  // Initialize Real Camera
  useEffect(() => {
    let stream: MediaStream | null = null;
    async function startCamera() {
      try {
        if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
          stream = await navigator.mediaDevices.getUserMedia({
            video: { facingMode: 'user', width: { ideal: 640 }, height: { ideal: 480 } },
            audio: true,
          });
          setLocalStream(stream);
          if (localVideoRef.current) {
            localVideoRef.current.srcObject = stream;
          }
        }
      } catch (err) {
        console.warn('Camera access denied or unavailable, using virtual avatar feed', err);
        setCameraError(true);
      }
    }

    startCamera();

    return () => {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  // Update video element when stream or video toggle changes
  useEffect(() => {
    if (localVideoRef.current && localStream) {
      localVideoRef.current.srcObject = localStream;
    }
  }, [localStream, isVideoOff]);

  // Duration Timer
  useEffect(() => {
    const timer = setInterval(() => {
      setCallDuration((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Initial greeting and partner dialogue simulation
  useEffect(() => {
    // Initial welcome message
    const greeting = partner.sampleResponses[0] || `Hey! Great to meet you on Bad Daddy! 😊`;
    setChatMessages([
      {
        id: 'msg_sys_1',
        sender: 'system',
        senderName: 'Bad Daddy',
        text: `Connected with ${partner.name} from ${partner.country} ${partner.flag}`,
        timestamp: 'Just now',
      },
      {
        id: 'msg_part_1',
        sender: 'partner',
        senderName: partner.name,
        text: greeting,
        timestamp: 'Just now',
      },
    ]);

    // Subsequent natural responses every ~12 seconds
    let msgIdx = 1;
    const chatInterval = setInterval(() => {
      if (msgIdx < partner.sampleResponses.length) {
        setChatMessages((prev) => [
          ...prev,
          {
            id: `msg_part_${Date.now()}`,
            sender: 'partner',
            senderName: partner.name,
            text: partner.sampleResponses[msgIdx],
            timestamp: 'Just now',
          },
        ]);
        msgIdx++;
        setPartnerSpeaking(true);
        setTimeout(() => setPartnerSpeaking(false), 3500);
      }
    }, 12000);

    return () => clearInterval(chatInterval);
  }, [partner]);

  // Mute/unmute local stream tracks
  const toggleMic = () => {
    playSound.pop();
    if (localStream) {
      localStream.getAudioTracks().forEach((track) => {
        track.enabled = isMicMuted;
      });
    }
    setIsMicMuted(!isMicMuted);
  };

  const toggleVideo = () => {
    playSound.pop();
    if (localStream) {
      localStream.getVideoTracks().forEach((track) => {
        track.enabled = isVideoOff;
      });
    }
    setIsVideoOff(!isVideoOff);
  };

  // Double tap to send heart
  const handleDoubleTap = (e: React.MouseEvent) => {
    playSound.gift();
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const newHeart = { id: Date.now(), x, y };
    setFloatingHearts((prev) => [...prev, newHeart]);
    setTimeout(() => {
      setFloatingHearts((prev) => prev.filter((h) => h.id !== newHeart.id));
    }, 1500);
  };

  // Send Gift
  const handleSendGift = (gift: GiftItem) => {
    onDeductTokens(gift.cost);
    playSound.gift();
    setActiveGiftAnimation(gift);
    setIsGiftTrayOpen(false);

    setChatMessages((prev) => [
      ...prev,
      {
        id: `gift_${Date.now()}`,
        sender: 'user',
        senderName: 'You',
        text: `Sent ${gift.icon} ${gift.name}!`,
        timestamp: 'Just now',
      },
      {
        id: `gift_thanks_${Date.now()}`,
        sender: 'partner',
        senderName: partner.name,
        text: `Omg wow thank you so much for the ${gift.name}! You are amazing! 💖✨`,
        timestamp: 'Just now',
      },
    ]);

    setTimeout(() => {
      setActiveGiftAnimation(null);
    }, 3200);
  };

  // Send Chat message
  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;

    playSound.pop();
    const newMsg: ChatMessage = {
      id: `usr_${Date.now()}`,
      sender: 'user',
      senderName: 'You',
      text: inputMessage.trim(),
      timestamp: 'Just now',
    };

    setChatMessages((prev) => [...prev, newMsg]);
    setInputMessage('');

    // Trigger partner reaction after 1.5s
    setTimeout(() => {
      const compliments = [
        'Haha totally! 😊',
        'I love your energy! 🌟',
        'You are so fun to talk to!',
        'Aww really? Tell me more! ✨',
      ];
      const reply = compliments[Math.floor(Math.random() * compliments.length)];
      setChatMessages((prev) => [
        ...prev,
        {
          id: `rep_${Date.now()}`,
          sender: 'partner',
          senderName: partner.name,
          text: reply,
          timestamp: 'Just now',
        },
      ]);
      setPartnerSpeaking(true);
      setTimeout(() => setPartnerSpeaking(false), 3000);
    }, 1400);
  };

  // Cycle filters
  const cycleFilter = () => {
    playSound.pop();
    const filters: ('normal' | 'glow' | 'warm' | 'cyber')[] = ['normal', 'glow', 'warm', 'cyber'];
    const next = filters[(filters.indexOf(activeFilter) + 1) % filters.length];
    setActiveFilter(next);
  };

  // Format mm:ss
  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  const getFilterClass = () => {
    switch (activeFilter) {
      case 'glow':
        return 'contrast-105 brightness-110 saturate-110';
      case 'warm':
        return 'sepia-[0.15] contrast-105 brightness-105';
      case 'cyber':
        return 'hue-rotate-15 contrast-125 saturate-125';
      default:
        return '';
    }
  };

  return (
    <div 
      className="fixed inset-0 z-50 bg-black text-white flex flex-col justify-between overflow-hidden select-none"
      onDoubleClick={handleDoubleTap}
    >
      {/* Remote Video Stream Fullscreen */}
      <div className="absolute inset-0 z-0 bg-slate-950 flex items-center justify-center">
        {partner.videoUrl ? (
          <video
            ref={remoteVideoRef}
            src={partner.videoUrl}
            autoPlay
            loop
            muted={isSpeakerMuted}
            playsInline
            className={`w-full h-full object-cover transition-all duration-300 ${getFilterClass()}`}
          />
        ) : (
          <img
            src={partner.avatar}
            alt={partner.name}
            className={`w-full h-full object-cover transition-all duration-300 ${getFilterClass()}`}
          />
        )}

        {/* Ambient Gradient Overlays */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-transparent to-black/80 pointer-events-none" />
      </div>

      {/* Floating Gift Effect Overlay */}
      {activeGiftAnimation && (
        <div className="absolute inset-0 z-30 pointer-events-none flex flex-col items-center justify-center animate-in zoom-in-50 fade-in duration-300">
          <div className="text-8xl drop-shadow-[0_0_35px_rgba(236,72,153,0.8)] animate-bounce">
            {activeGiftAnimation.icon}
          </div>
          <div className="mt-3 px-4 py-1.5 rounded-full bg-pink-500/80 backdrop-blur text-sm font-extrabold text-white uppercase tracking-wider shadow-xl">
            {activeGiftAnimation.name} Sent!
          </div>
        </div>
      )}

      {/* Tap Heart Animations */}
      {floatingHearts.map((heart) => (
        <div
          key={heart.id}
          className="absolute z-30 pointer-events-none text-3xl animate-in zoom-in-75 fade-out duration-1000"
          style={{
            left: heart.x - 20,
            top: heart.y - 40,
            transform: 'translateY(-60px) scale(1.4)',
            transition: 'transform 1s ease-out, opacity 1s ease-out',
          }}
        >
          💖
        </div>
      ))}

      {/* TOP BAR: Partner Info & Call Controls */}
      <div className="relative z-20 w-full pt-4 px-4 flex items-center justify-between">
        {/* Partner Info Chip */}
        <div className="flex items-center gap-2.5 p-1.5 pr-3.5 rounded-full bg-black/40 backdrop-blur-md border border-white/10 shadow-lg">
          <div className="relative">
            <img
              src={partner.avatar}
              alt={partner.name}
              className="w-10 h-10 rounded-full object-cover border-2 border-pink-500"
            />
            {partnerSpeaking && (
              <span className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-emerald-500 border-2 border-black flex items-center justify-center animate-ping" />
            )}
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-sm font-bold text-white leading-none">{partner.name}</span>
              <span className="text-xs">{partner.flag}</span>
              <span className="px-1.5 py-0.5 rounded-full bg-pink-500/80 text-[10px] font-extrabold text-white">
                Lv.{partner.level}
              </span>
            </div>
            <div className="flex items-center gap-1.5 text-[11px] text-white/70 mt-1">
              <span>{partner.gender === 'female' ? '♀' : '♂'} {partner.age}</span>
              <span>·</span>
              <span className="text-emerald-400 font-medium">Live</span>
              <span>·</span>
              <span className="font-mono text-white/90">{formatTimer(callDuration)}</span>
            </div>
          </div>

          {/* Follow Button */}
          <button
            onClick={() => {
              playSound.pop();
              onToggleFollow(partner.id);
            }}
            className={`ml-2 px-3 py-1 rounded-full text-xs font-bold transition-all shadow ${
              isFollowing
                ? 'bg-white/20 text-white'
                : 'bg-gradient-to-r from-orange-500 to-pink-500 text-white hover:opacity-95'
            }`}
          >
            {isFollowing ? (
              <span className="flex items-center gap-1">
                <Check size={12} /> Following
              </span>
            ) : (
              <span className="flex items-center gap-1">
                <UserPlus size={12} /> Follow
              </span>
            )}
          </button>
        </div>

        {/* Top Right: Tokens & Speaker */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              playSound.pop();
              if (onOpenRecharge) {
                onOpenRecharge();
              } else {
                onOpenBonus();
              }
            }}
            className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-amber-500/30 backdrop-blur-md border border-amber-500/40 text-amber-300 text-xs font-bold hover:bg-amber-500/40 transition-colors shadow"
            title="Recharge Bad Daddy Coins"
          >
            <span>🪙 {userTokens}</span>
          </button>

          <button
            onClick={() => setIsSpeakerMuted(!isSpeakerMuted)}
            className="w-9 h-9 rounded-full bg-black/40 backdrop-blur-md border border-white/10 flex items-center justify-center text-white/80 hover:text-white"
          >
            {isSpeakerMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
          </button>
        </div>
      </div>

      {/* PICTURE-IN-PICTURE (Local User WebCam Feed) */}
      <div className="absolute top-20 right-4 z-20 w-28 sm:w-36 aspect-[3/4] rounded-2xl overflow-hidden border-2 border-white/20 shadow-2xl bg-slate-900 group">
        {!isVideoOff && !cameraError ? (
          <video
            ref={localVideoRef}
            autoPlay
            playsInline
            muted
            className="w-full h-full object-cover -scale-x-100"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-tr from-slate-900 via-indigo-950 to-slate-900 text-white p-2 text-center">
            <div className="w-10 h-10 rounded-full bg-pink-500/20 border border-pink-500/40 flex items-center justify-center text-lg mb-1">
              👤
            </div>
            <span className="text-[10px] text-white/70 font-medium">You</span>
            {isVideoOff && <span className="text-[9px] text-pink-400">Cam Off</span>}
          </div>
        )}

        {/* Small mic indicator */}
        <div className="absolute bottom-1.5 left-1.5 px-1.5 py-0.5 rounded-md bg-black/60 backdrop-blur text-[9px] text-white font-mono flex items-center gap-1">
          {isMicMuted ? (
            <MicOff size={10} className="text-rose-400" />
          ) : (
            <Mic size={10} className="text-emerald-400" />
          )}
          <span>You</span>
        </div>
      </div>

      {/* MIDDLE: Floating Chat Messages */}
      <div className="relative z-20 w-full px-4 mb-2 flex flex-col justify-end max-w-sm pointer-events-auto">
        <div className="space-y-1.5 max-h-48 overflow-y-auto no-scrollbar flex flex-col justify-end">
          {chatMessages.slice(-5).map((msg) => (
            <div
              key={msg.id}
              className={`text-xs px-3 py-1.5 rounded-2xl max-w-[85%] backdrop-blur-md animate-in slide-in-from-left duration-200 ${
                msg.sender === 'system'
                  ? 'bg-white/10 text-white/80 italic text-[11px] self-center'
                  : msg.sender === 'user'
                  ? 'bg-pink-500/80 text-white self-end rounded-br-none'
                  : 'bg-black/50 text-white border border-white/10 self-start rounded-bl-none'
              }`}
            >
              {msg.sender === 'partner' && (
                <span className="font-bold text-pink-300 mr-1.5">{partner.name}:</span>
              )}
              <span>{msg.text}</span>
            </div>
          ))}
        </div>

        {/* Chat Input Bar */}
        <form onSubmit={handleSendMessage} className="mt-2 flex items-center gap-2">
          <div className="relative flex-1">
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder="Say something friendly..."
              className="w-full px-3.5 py-2 rounded-full bg-black/40 backdrop-blur-md border border-white/20 text-xs text-white placeholder-white/50 focus:outline-none focus:border-pink-500"
            />
          </div>
          <button
            type="submit"
            disabled={!inputMessage.trim()}
            className="w-8 h-8 rounded-full bg-pink-500 hover:bg-pink-600 disabled:opacity-40 flex items-center justify-center text-white transition-transform active:scale-90"
          >
            <Send size={14} />
          </button>
        </form>
      </div>

      {/* BOTTOM CONTROLS DOCK */}
      <div className="relative z-20 w-full px-4 pb-6 pt-2">
        <div className="flex items-center justify-between gap-2 max-w-md mx-auto">
          {/* Mute Mic */}
          <button
            onClick={toggleMic}
            className={`w-11 h-11 rounded-full flex items-center justify-center transition-all ${
              isMicMuted
                ? 'bg-rose-500 text-white shadow-lg shadow-rose-500/30'
                : 'bg-white/15 backdrop-blur hover:bg-white/25 text-white'
            }`}
          >
            {isMicMuted ? <MicOff size={18} /> : <Mic size={18} />}
          </button>

          {/* Video Toggle */}
          <button
            onClick={toggleVideo}
            className={`w-11 h-11 rounded-full flex items-center justify-center transition-all ${
              isVideoOff
                ? 'bg-rose-500 text-white shadow-lg shadow-rose-500/30'
                : 'bg-white/15 backdrop-blur hover:bg-white/25 text-white'
            }`}
          >
            {isVideoOff ? <VideoOff size={18} /> : <Video size={18} />}
          </button>

          {/* Beauty Filter */}
          <button
            onClick={cycleFilter}
            className="w-11 h-11 rounded-full bg-white/15 backdrop-blur hover:bg-white/25 text-white flex items-center justify-center relative"
          >
            <Wand2 size={18} className="text-pink-300" />
            <span className="absolute -top-1 -right-1 px-1 rounded-full bg-pink-500 text-[8px] font-bold uppercase">
              {activeFilter}
            </span>
          </button>

          {/* Gift Drawer */}
          <button
            onClick={() => {
              playSound.pop();
              setIsGiftTrayOpen(true);
            }}
            className="w-12 h-12 rounded-full bg-gradient-to-tr from-amber-400 via-pink-500 to-rose-500 text-white flex items-center justify-center shadow-lg shadow-pink-500/30 hover:scale-105 active:scale-95 transition-transform"
          >
            <Gift size={22} />
          </button>

          {/* NEXT / SKIP (Lightning Instant Match!) */}
          <button
            onClick={() => {
              playSound.radarPing();
              onNextMatch();
            }}
            className="flex-1 py-3 px-4 rounded-full bg-gradient-to-r from-orange-500 via-pink-500 to-purple-600 font-extrabold text-sm text-white flex items-center justify-center gap-1.5 shadow-lg shadow-pink-500/25 active:scale-95 transition-transform"
          >
            <SkipForward size={16} />
            <span>Next Match</span>
          </button>

          {/* Hangup Red Button */}
          <button
            onClick={() => {
              playSound.hangup();
              onEndCall();
            }}
            className="w-12 h-12 rounded-full bg-rose-600 hover:bg-rose-700 text-white flex items-center justify-center shadow-lg shadow-rose-600/30 active:scale-95 transition-transform"
          >
            <PhoneOff size={20} />
          </button>
        </div>
      </div>

      {/* Virtual Gift Tray Drawer */}
      <GiftTray
        isOpen={isGiftTrayOpen}
        onClose={() => setIsGiftTrayOpen(false)}
        userTokens={userTokens}
        onSendGift={handleSendGift}
        onOpenBonus={onOpenBonus}
      />
    </div>
  );
};
