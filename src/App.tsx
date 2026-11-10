/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { UserProfile, CountryItem } from './types';
import { COUNTRIES, MOCK_PROFILES } from './data/mockData';
import { BottomNav, TabType } from './components/BottomNav';
import { LiveGridTab } from './components/LiveGridTab';
import { PartyTab } from './components/PartyTab';
import { RandomMatchTab } from './components/RandomMatchTab';
import { MessagesTab } from './components/MessagesTab';
import { MyProfileTab } from './components/MyProfileTab';
import { MatchingScreen } from './components/MatchingScreen';
import { VideoCallScreen } from './components/VideoCallScreen';
import { CountryModal } from './components/CountryModal';
import { RewardsModal } from './components/RewardsModal';
import { SpecialOfferModal } from './components/SpecialOfferModal';
import { ProfileModal } from './components/ProfileModal';
import { InstallModal } from './components/InstallModal';
import { ModMenuModal } from './components/ModMenuModal';
import { PromoCodeModal } from './components/PromoCodeModal';
import { SplashScreen } from './components/SplashScreen';
import { playSound } from './utils/soundEffects';
import { Download, Smartphone, Wifi, FileDown, Zap, Tag } from 'lucide-react';

export default function App() {
  const [showSplash, setShowSplash] = useState(true);
  const [currentTab, setCurrentTab] = useState<TabType>('live');
  const [selectedCountry, setSelectedCountry] = useState<CountryItem>(() => {
    return COUNTRIES.find((c) => c.code === 'IN') || COUNTRIES[0];
  });
  
  // Wallet / Coins
  const [userTokens, setUserTokens] = useState<number>(() => {
    const saved = localStorage.getItem('pulselive_user_tokens');
    return saved ? parseInt(saved, 10) : 999999;
  });

  // MOD APK State (Active by default)
  const [isModActive, setIsModActive] = useState<boolean>(() => {
    const saved = localStorage.getItem('pulselive_mod_active');
    return saved !== null ? saved === 'true' : true;
  });
  const [isModMenuOpen, setIsModMenuOpen] = useState(false);

  // PWA Install prompt state
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isInstallModalOpen, setIsInstallModalOpen] = useState(false);

  // Modals state
  const [isCountryModalOpen, setIsCountryModalOpen] = useState(false);
  const [isRewardsModalOpen, setIsRewardsModalOpen] = useState(false);
  const [isSpecialOfferOpen, setIsSpecialOfferOpen] = useState(false);
  const [isPromoCodeModalOpen, setIsPromoCodeModalOpen] = useState(false);
  const [inspectingUser, setInspectingUser] = useState<UserProfile | null>(null);

  // Active call & matching state
  const [isMatching, setIsMatching] = useState(false);
  const [matchingGender, setMatchingGender] = useState<'all' | 'female' | 'male'>('all');
  const [activeCallPartner, setActiveCallPartner] = useState<UserProfile | null>(null);

  // Followed list
  const [followedUserIds, setFollowedUserIds] = useState<string[]>(['usr_ananya_in', 'usr_ashley_id']);

  // Listen for native PWA install prompt
  useEffect(() => {
    const handler = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };
    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  // Sync tokens to localStorage
  useEffect(() => {
    localStorage.setItem('pulselive_user_tokens', userTokens.toString());
  }, [userTokens]);

  const handleAddTokens = (amount: number) => {
    setUserTokens((prev) => prev + amount);
  };

  const handleDeductTokens = (amount: number) => {
    if (isModActive) return;
    setUserTokens((prev) => Math.max(0, prev - amount));
  };

  const handleToggleMod = () => {
    if (!isModActive) {
      setIsModActive(true);
      setUserTokens(999999);
      localStorage.setItem('pulselive_mod_active', 'true');
    } else {
      setIsModActive(false);
      setUserTokens(125);
      localStorage.setItem('pulselive_mod_active', 'false');
    }
  };

  const toggleFollowUser = (userId: string) => {
    setFollowedUserIds((prev) =>
      prev.includes(userId) ? prev.filter((id) => id !== userId) : [...prev, userId]
    );
  };

  // Start Random Match
  const handleStartMatching = (gender: 'all' | 'female' | 'male' = 'all') => {
    setMatchingGender(gender);
    setIsMatching(true);
    setInspectingUser(null);
  };

  // Match Found Callback
  const handleMatchFound = (profile: UserProfile) => {
    setIsMatching(false);
    setActiveCallPartner(profile);
  };

  // Instant Next Match during call
  const handleNextMatch = () => {
    setActiveCallPartner(null);
    setIsMatching(true);
  };

  // End Call
  const handleEndCall = () => {
    setActiveCallPartner(null);
  };

  // Start Call directly with specific creator
  const handleStartCallWith = (user: UserProfile) => {
    setInspectingUser(null);
    setActiveCallPartner(user);
  };

  // Open Chat from profile
  const handleOpenChatFromProfile = (user: UserProfile) => {
    setInspectingUser(null);
    setCurrentTab('messages');
  };

  return (
    <div className="w-full h-screen max-w-md mx-auto relative flex flex-col bg-slate-950 text-slate-900 overflow-hidden shadow-2xl font-sans select-none">
      {/* Yomee Splash Screen on App Launch */}
      {showSplash && <SplashScreen onFinish={() => setShowSplash(false)} />}

      {/* Android Top Status Bar matching video 00:01 */}
      <div className="w-full pt-1 px-3 pb-0.5 bg-white flex items-center justify-between text-[11px] font-mono text-slate-800 z-40 border-b border-slate-100">
        <div className="flex items-center gap-1 font-bold">
          <span>13:09</span>
        </div>

        {/* Quick Actions: APK MOD & Install */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => {
              playSound.gift();
              setIsModMenuOpen(true);
            }}
            className={`flex items-center gap-1 px-2.5 py-0.5 rounded-full font-sans text-[10px] font-extrabold shadow-sm active:scale-95 transition-all ${
              isModActive
                ? 'bg-gradient-to-r from-amber-400 to-yellow-300 text-slate-950 border border-amber-500 shadow-amber-400/50'
                : 'bg-slate-900 text-amber-300 border border-amber-400/40 hover:bg-slate-800'
            }`}
          >
            <Zap size={11} className={isModActive ? 'fill-slate-950' : 'fill-amber-300'} />
            <span>{isModActive ? '⚡ MOD ON (999K)' : '⚡ APK MOD'}</span>
          </button>

          <button
            onClick={() => {
              playSound.pop();
              setIsInstallModalOpen(true);
            }}
            className="flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 text-white font-sans text-[10px] font-extrabold shadow-sm active:scale-95 transition-transform"
          >
            <Smartphone size={11} />
            <span>Install</span>
          </button>
        </div>

        {/* Signal & Battery Info */}
        <div className="flex items-center gap-1 text-[10px]">
          <span className="text-[9px] text-slate-400">5G</span>
          <Wifi size={11} className="text-slate-700" />
          <span className="font-sans font-bold text-slate-900">79%</span>
        </div>
      </div>

      {/* Prominent High-Visibility App Install / MOD Active Banner */}
      {isModActive ? (
        <div 
          onClick={() => {
            playSound.gift();
            setIsModMenuOpen(true);
          }}
          className="w-full bg-gradient-to-r from-amber-500 via-orange-500 to-yellow-400 px-3.5 py-1.5 flex items-center justify-between shadow-md z-30 text-slate-950 cursor-pointer active:scale-[0.99] transition-transform"
        >
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-slate-950 text-amber-300 flex items-center justify-center font-black text-xs shadow">
              ⚡
            </div>
            <div className="text-left">
              <div className="text-xs font-black flex items-center gap-1.5 leading-tight">
                <span>APK MOD Mode Active</span>
                <span className="text-[9px] bg-slate-950 text-amber-300 font-black px-1.5 rounded-full">VIP 999K</span>
              </div>
              <div className="text-[10px] text-slate-900/90 font-medium">असीमित कॉइन्स (Free Unlimited Video Calls)</div>
            </div>
          </div>
          <span className="px-2.5 py-1 rounded-full bg-slate-950 text-amber-300 text-[10px] font-black shadow flex items-center gap-1">
            Menu ⚙️
          </span>
        </div>
      ) : (
        <div className="w-full bg-gradient-to-r from-[#7e22ce] via-[#9333ea] to-[#ec4899] px-3.5 py-2 flex items-center justify-between shadow-md z-30 text-white">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-xl bg-white/20 flex items-center justify-center">
              <Smartphone size={16} className="text-white" />
            </div>
            <div className="text-left">
              <div className="text-xs font-black flex items-center gap-1.5">
                <span>Yomee App — Home Screen पर जोड़ें</span>
                <span className="text-[9px] bg-amber-400 text-slate-950 font-black px-1.5 py-0.2 rounded-full">Official</span>
              </div>
              <div className="text-[10px] text-white/90">फोन की होम स्क्रीन पर सीधे इंस्टॉल करें</div>
            </div>
          </div>
          <button
            onClick={() => {
              playSound.gift();
              setIsInstallModalOpen(true);
            }}
            className="px-3.5 py-1.5 rounded-full bg-white text-purple-900 text-xs font-black shadow-md hover:bg-slate-100 active:scale-95 transition-transform flex items-center gap-1"
          >
            <Download size={13} />
            <span>Install</span>
          </button>
        </div>
      )}

      {/* Floating Persistent Buttons */}
      {/* 1. Left: APK MOD Floating Menu Trigger */}
      <button
        onClick={() => {
          playSound.gift();
          setIsModMenuOpen(true);
        }}
        className={`fixed bottom-20 left-3.5 z-40 flex items-center gap-1.5 px-3 py-2 rounded-full font-black text-xs shadow-2xl border-2 active:scale-90 transition-all ${
          isModActive
            ? 'bg-gradient-to-r from-amber-400 via-yellow-400 to-orange-400 text-slate-950 border-white shadow-amber-500/60 ring-2 ring-amber-400/50'
            : 'bg-gradient-to-r from-slate-950 via-purple-950 to-slate-900 text-amber-300 border-amber-400/80 shadow-purple-950/60'
        }`}
      >
        <Zap size={14} className={isModActive ? 'fill-slate-950 animate-bounce' : 'fill-amber-300'} />
        <span>{isModActive ? '⚡ MOD ON' : '⚡ APK MOD'}</span>
      </button>

      {/* 2. Right: Floating Install App Button */}
      <button
        onClick={() => {
          playSound.gift();
          setIsInstallModalOpen(true);
        }}
        className="fixed bottom-20 right-3.5 z-40 flex items-center gap-1.5 px-3.5 py-2.5 rounded-full bg-gradient-to-r from-purple-600 via-pink-600 to-amber-500 text-white font-black text-xs shadow-2xl shadow-purple-600/60 border-2 border-white/50 active:scale-90 transition-all animate-bounce"
        style={{ animationDuration: '3s' }}
      >
        <Smartphone size={15} />
        <span>Install App</span>
      </button>

      {/* Active Video Call Screen Fullscreen */}
      {activeCallPartner ? (
        <VideoCallScreen
          partner={activeCallPartner}
          userTokens={userTokens}
          onDeductTokens={handleDeductTokens}
          onOpenBonus={() => setIsRewardsModalOpen(true)}
          onNextMatch={handleNextMatch}
          onEndCall={handleEndCall}
          isFollowing={followedUserIds.includes(activeCallPartner.id)}
          onToggleFollow={toggleFollowUser}
        />
      ) : isMatching ? (
        /* Radar / Flying Profiles Matching Sequence */
        <MatchingScreen
          country={selectedCountry}
          genderFilter={matchingGender}
          onMatchFound={handleMatchFound}
          onCancel={() => setIsMatching(false)}
        />
      ) : (
        /* Normal Tabs & Navigation */
        <>
          <main className="flex-1 flex flex-col h-full overflow-hidden bg-[#f8f9fc]">
            {currentTab === 'live' && (
              <LiveGridTab
                selectedCountry={selectedCountry}
                onOpenCountryModal={() => setIsCountryModalOpen(true)}
                onSelectUser={(u) => setInspectingUser(u)}
                onStartRandomCall={() => handleStartMatching('all')}
                userTokens={userTokens}
                onOpenBonus={() => setIsRewardsModalOpen(true)}
                onOpenSpecialOffer={() => setIsSpecialOfferOpen(true)}
                isModActive={isModActive}
                onOpenModMenu={() => setIsModMenuOpen(true)}
                onAddTokens={handleAddTokens}
              />
            )}

            {currentTab === 'party' && (
              <PartyTab
                userTokens={userTokens}
                onAddTokens={handleAddTokens}
                onStartLive={() => handleStartMatching('all')}
              />
            )}

            {currentTab === 'match' && (
              <RandomMatchTab
                selectedCountry={selectedCountry}
                onOpenCountryModal={() => setIsCountryModalOpen(true)}
                onStartMatching={handleStartMatching}
                userTokens={userTokens}
                onOpenBonus={() => setIsRewardsModalOpen(true)}
                onOpenSpecialOffer={() => setIsSpecialOfferOpen(true)}
              />
            )}

            {currentTab === 'messages' && (
              <MessagesTab
                onStartCall={handleStartCallWith}
                onOpenProfile={(u) => setInspectingUser(u)}
                onStartRandomMatch={() => handleStartMatching('all')}
              />
            )}

            {currentTab === 'profile' && (
              <MyProfileTab
                userTokens={userTokens}
                onOpenBonus={() => setIsRewardsModalOpen(true)}
                onOpenSpecialOffer={() => setIsSpecialOfferOpen(true)}
                onAddTokens={handleAddTokens}
                onOpenInstall={() => setIsInstallModalOpen(true)}
                isModActive={isModActive}
                onOpenModMenu={() => setIsModMenuOpen(true)}
                onOpenPromoCode={() => setIsPromoCodeModalOpen(true)}
              />
            )}
          </main>

          {/* Bottom Fixed Navigation Bar */}
          <BottomNav currentTab={currentTab} onChangeTab={setCurrentTab} unreadCount={99} />
        </>
      )}

      {/* Global Modals */}
      <ModMenuModal
        isOpen={isModMenuOpen}
        onClose={() => setIsModMenuOpen(false)}
        isModActive={isModActive}
        onToggleMod={handleToggleMod}
        userTokens={userTokens}
        onSetTokens={(amount) => {
          setUserTokens(amount);
          localStorage.setItem('pulselive_user_tokens', amount.toString());
        }}
        onOpenInstall={() => setIsInstallModalOpen(true)}
        onOpenPromoCode={() => setIsPromoCodeModalOpen(true)}
      />

      <InstallModal
        isOpen={isInstallModalOpen}
        onClose={() => setIsInstallModalOpen(false)}
        deferredPrompt={deferredPrompt}
        onInstalled={() => setIsInstallModalOpen(false)}
        isModActive={isModActive}
        onToggleMod={handleToggleMod}
      />

      <CountryModal
        isOpen={isCountryModalOpen}
        onClose={() => setIsCountryModalOpen(false)}
        selectedCountry={selectedCountry}
        onSelectCountry={setSelectedCountry}
      />

      <RewardsModal
        isOpen={isRewardsModalOpen}
        onClose={() => setIsRewardsModalOpen(false)}
        userTokens={userTokens}
        onAddTokens={handleAddTokens}
      />

      <SpecialOfferModal
        isOpen={isSpecialOfferOpen}
        onClose={() => setIsSpecialOfferOpen(false)}
        onClaimOffer={handleAddTokens}
      />

      <PromoCodeModal
        isOpen={isPromoCodeModalOpen}
        onClose={() => setIsPromoCodeModalOpen(false)}
        onApplyCode={(code, rewardCoins, isVip) => {
          handleAddTokens(rewardCoins);
          if (isVip && !isModActive) {
            handleToggleMod();
          }
        }}
      />

      <ProfileModal
        user={inspectingUser}
        onClose={() => setInspectingUser(null)}
        onStartCall={handleStartCallWith}
        onOpenChat={handleOpenChatFromProfile}
        isFollowing={inspectingUser ? followedUserIds.includes(inspectingUser.id) : false}
        onToggleFollow={toggleFollowUser}
      />
    </div>
  );
}
