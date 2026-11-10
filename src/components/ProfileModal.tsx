import React, { useState } from 'react';
import { ArrowLeft, MoreVertical, MessageCircle, Video, Heart, ShieldCheck, MapPin } from 'lucide-react';
import { UserProfile } from '../types';
import { playSound } from '../utils/soundEffects';

interface ProfileModalProps {
  user: UserProfile | null;
  onClose: () => void;
  onStartCall: (user: UserProfile) => void;
  onOpenChat: (user: UserProfile) => void;
  isFollowing: boolean;
  onToggleFollow: (userId: string) => void;
}

export const ProfileModal: React.FC<ProfileModalProps> = ({
  user,
  onClose,
  onStartCall,
  onOpenChat,
  isFollowing,
  onToggleFollow,
}) => {
  const [activeTab, setActiveTab] = useState<'posts' | 'about'>('posts');

  if (!user) return null;

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-slate-900/90 backdrop-blur-md sm:items-center sm:justify-center p-0 sm:p-4">
      <div className="w-full sm:max-w-md h-full sm:h-[720px] bg-white text-slate-900 rounded-none sm:rounded-3xl flex flex-col overflow-hidden shadow-2xl animate-in slide-in-from-bottom duration-200">
        {/* Top Header with warm gradient background */}
        <div className="relative h-44 bg-gradient-to-r from-amber-200 via-orange-200 to-rose-200 flex flex-col justify-between p-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => {
                playSound.pop();
                onClose();
              }}
              className="w-9 h-9 rounded-full bg-white/80 backdrop-blur flex items-center justify-center text-slate-800 shadow-sm hover:bg-white"
            >
              <ArrowLeft size={18} />
            </button>
            <div className="flex items-center gap-2">
              <span className="bg-white/80 backdrop-blur px-2.5 py-1 rounded-full text-xs font-semibold text-emerald-700 flex items-center gap-1 shadow-sm">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                <span>Online</span>
              </span>
              <button 
                onClick={() => playSound.pop()}
                className="w-9 h-9 rounded-full bg-white/80 backdrop-blur flex items-center justify-center text-slate-800 shadow-sm hover:bg-white"
              >
                <MoreVertical size={18} />
              </button>
            </div>
          </div>
        </div>

        {/* Profile Card Header Info */}
        <div className="relative px-5 pt-0 pb-3 border-b border-slate-100">
          <div className="flex items-end justify-between -mt-14 mb-3">
            <div className="relative">
              <img
                src={user.avatar}
                alt={user.name}
                className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-xl ring-2 ring-pink-500/30"
              />
              <span className="absolute bottom-1 right-1 w-6 h-6 rounded-full bg-pink-500 text-white text-[11px] font-bold flex items-center justify-center border-2 border-white shadow">
                {user.level}
              </span>
            </div>

            <button
              onClick={() => {
                playSound.pop();
                onToggleFollow(user.id);
              }}
              className={`px-5 py-2 rounded-full text-xs font-bold transition-all shadow-sm ${
                isFollowing
                  ? 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  : 'bg-gradient-to-r from-orange-500 to-pink-500 text-white hover:opacity-95'
              }`}
            >
              {isFollowing ? 'Following' : '+ Follow'}
            </button>
          </div>

          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-slate-900">{user.name}</h1>
            <span className="text-orange-500 text-sm">🔥</span>
            <span className="text-pink-500 text-sm">🎁</span>
          </div>

          <div className="flex items-center gap-2.5 text-xs text-slate-500 mt-1">
            <span className="font-mono text-slate-400">ID: {user.id.replace('usr_', '')}</span>
            <span>·</span>
            <span className="inline-flex items-center gap-1 font-semibold text-pink-600">
              {user.gender === 'female' ? '♀' : '♂'} {user.age}
            </span>
            <span>·</span>
            <span className="inline-flex items-center gap-1">
              <span>{user.flag}</span>
              <span className="font-medium text-slate-700">{user.country}</span>
            </span>
          </div>

          <p className="mt-2.5 text-xs text-slate-600 leading-relaxed">
            {user.bio}
          </p>

          {/* Followers / Fans stats bar */}
          <div className="grid grid-cols-3 gap-2 mt-4 pt-3 border-t border-slate-100 text-center">
            <div>
              <div className="text-base font-bold text-slate-900">{user.following.toLocaleString()}</div>
              <div className="text-[11px] text-slate-400 uppercase tracking-wide">Following</div>
            </div>
            <div>
              <div className="text-base font-bold text-slate-900">{user.followers.toLocaleString()}</div>
              <div className="text-[11px] text-slate-400 uppercase tracking-wide">Fans</div>
            </div>
            <div>
              <div className="text-base font-bold text-slate-900">{user.friends.toLocaleString()}</div>
              <div className="text-[11px] text-slate-400 uppercase tracking-wide">Friends</div>
            </div>
          </div>
        </div>

        {/* Tabs: Post / About */}
        <div className="flex items-center px-5 border-b border-slate-100">
          <button
            onClick={() => setActiveTab('posts')}
            className={`py-3 text-xs font-bold mr-6 relative transition-colors ${
              activeTab === 'posts' ? 'text-slate-900' : 'text-slate-400 hover:text-slate-600'
            }`}
          >
            Moments & Photos
            {activeTab === 'posts' && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-orange-500 rounded-full" />
            )}
          </button>
          <button
            onClick={() => setActiveTab('about')}
            className={`py-3 text-xs font-bold relative transition-colors ${
              activeTab === 'about' ? 'text-slate-900' : 'text-slate-400 hover:text-slate-600'
            }`}
          >
            Interests & Bio
            {activeTab === 'about' && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-orange-500 rounded-full" />
            )}
          </button>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-5">
          {activeTab === 'posts' ? (
            <div className="grid grid-cols-2 gap-3">
              <div className="relative rounded-2xl overflow-hidden aspect-[4/5] bg-slate-100 group shadow-sm">
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent flex items-end p-2.5">
                  <span className="text-[11px] text-white font-medium flex items-center gap-1">
                    <Heart size={12} className="text-pink-500 fill-pink-500" />
                    <span>3.4k</span>
                  </span>
                </div>
              </div>
              {user.photos?.map((photo, i) => (
                <div key={i} className="relative rounded-2xl overflow-hidden aspect-[4/5] bg-slate-100 group shadow-sm">
                  <img
                    src={photo}
                    alt="Moment"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent flex items-end p-2.5">
                    <span className="text-[11px] text-white font-medium flex items-center gap-1">
                      <Heart size={12} className="text-pink-500 fill-pink-500" />
                      <span>1.8k</span>
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              <div>
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Interests</h4>
                <div className="flex flex-wrap gap-2">
                  {user.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-3 py-1 bg-slate-100 text-slate-700 text-xs font-semibold rounded-lg"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Verification</h4>
                <div className="flex items-center gap-2 p-3 bg-emerald-50 text-emerald-800 rounded-xl text-xs">
                  <ShieldCheck size={18} className="text-emerald-600 flex-shrink-0" />
                  <span>Real face verified creator with verified badge status.</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Sticky Action Footer (As seen in the screenshot) */}
        <div className="p-4 border-t border-slate-100 bg-white grid grid-cols-2 gap-3">
          <button
            onClick={() => {
              playSound.pop();
              onOpenChat(user);
            }}
            className="w-full py-3.5 px-4 rounded-2xl bg-orange-50 hover:bg-orange-100 text-orange-600 font-bold text-sm flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
          >
            <MessageCircle size={18} />
            <span>Message</span>
          </button>

          <button
            onClick={() => {
              playSound.radarPing();
              onStartCall(user);
            }}
            className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-orange-500 via-pink-500 to-rose-500 hover:opacity-95 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-pink-500/25 transition-all active:scale-[0.98]"
          >
            <Video size={18} />
            <span>Call (Free)</span>
          </button>
        </div>
      </div>
    </div>
  );
};
