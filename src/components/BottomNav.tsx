import React from 'react';
import { PlaySquare, Heart, MessageCircle, User, Sparkles } from 'lucide-react';
import { playSound } from '../utils/soundEffects';

export type TabType = 'live' | 'party' | 'match' | 'messages' | 'profile';

interface BottomNavProps {
  currentTab: TabType;
  onChangeTab: (tab: TabType) => void;
  unreadCount?: number;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  currentTab,
  onChangeTab,
  unreadCount = 99,
}) => {
  return (
    <div className="fixed bottom-0 inset-x-0 z-30 h-16 bg-white border-t border-slate-200/80 shadow-lg flex items-center justify-around px-2">
      {/* 1. Live Feed / Popular */}
      <button
        onClick={() => {
          playSound.pop();
          onChangeTab('live');
        }}
        className={`flex flex-col items-center justify-center relative transition-transform ${
          currentTab === 'live' ? 'text-purple-600 scale-110 font-bold' : 'text-slate-400 hover:text-slate-600'
        }`}
      >
        <PlaySquare size={22} className={currentTab === 'live' ? 'stroke-[2.5]' : ''} />
        {currentTab === 'live' && (
          <span className="w-1.5 h-1.5 rounded-full bg-purple-600 mt-0.5" />
        )}
      </button>

      {/* 2. Party & Lucky Roulette (Matching video 00:08) */}
      <button
        onClick={() => {
          playSound.pop();
          onChangeTab('party');
        }}
        className={`flex flex-col items-center justify-center relative transition-transform ${
          currentTab === 'party' ? 'text-purple-600 scale-110 font-bold' : 'text-slate-400 hover:text-slate-600'
        }`}
      >
        <div className="relative">
          <Sparkles size={22} className={currentTab === 'party' ? 'text-amber-500 fill-amber-500' : ''} />
        </div>
        {currentTab === 'party' && (
          <span className="w-1.5 h-1.5 rounded-full bg-purple-600 mt-0.5" />
        )}
      </button>

      {/* 3. Central Match / Heart (Matching video 00:24) */}
      <button
        onClick={() => {
          playSound.pop();
          onChangeTab('match');
        }}
        className={`flex flex-col items-center justify-center relative transition-transform ${
          currentTab === 'match' ? 'text-purple-600 scale-110' : 'text-slate-400 hover:text-slate-600'
        }`}
      >
        <div className={`p-2 rounded-full ${currentTab === 'match' ? 'bg-purple-100 text-purple-600' : ''}`}>
          <Heart size={24} className={currentTab === 'match' ? 'fill-purple-600' : ''} />
        </div>
      </button>

      {/* 4. Messages / Inbox with 99+ badge */}
      <button
        onClick={() => {
          playSound.pop();
          onChangeTab('messages');
        }}
        className={`flex flex-col items-center justify-center relative transition-transform ${
          currentTab === 'messages' ? 'text-purple-600 scale-110' : 'text-slate-400 hover:text-slate-600'
        }`}
      >
        <div className="relative">
          <MessageCircle size={22} className={currentTab === 'messages' ? 'stroke-[2.5]' : ''} />
          {unreadCount > 0 && (
            <span className="absolute -top-1.5 -right-2.5 px-1 py-0.2 min-w-4 text-[9px] font-black rounded-full bg-rose-500 text-white flex items-center justify-center shadow">
              {unreadCount}+
            </span>
          )}
        </div>
        {currentTab === 'messages' && (
          <span className="w-1.5 h-1.5 rounded-full bg-purple-600 mt-0.5" />
        )}
      </button>

      {/* 5. Profile */}
      <button
        onClick={() => {
          playSound.pop();
          onChangeTab('profile');
        }}
        className={`flex flex-col items-center justify-center relative transition-transform ${
          currentTab === 'profile' ? 'text-purple-600 scale-110' : 'text-slate-400 hover:text-slate-600'
        }`}
      >
        <div className="relative">
          <User size={22} className={currentTab === 'profile' ? 'stroke-[2.5]' : ''} />
        </div>
        {currentTab === 'profile' && (
          <span className="w-1.5 h-1.5 rounded-full bg-purple-600 mt-0.5" />
        )}
      </button>
    </div>
  );
};
