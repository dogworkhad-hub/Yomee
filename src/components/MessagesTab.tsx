import React, { useState } from 'react';
import { ArrowLeft, Video, Send, Search, Sparkles, Heart, Gift, Ticket } from 'lucide-react';
import { DirectMessageThread, UserProfile } from '../types';
import { INITIAL_DIRECT_MESSAGES, MOCK_PROFILES } from '../data/mockData';
import { playSound } from '../utils/soundEffects';

interface MessagesTabProps {
  onStartCall: (user: UserProfile) => void;
  onOpenProfile: (user: UserProfile) => void;
  onStartRandomMatch: () => void;
}

export const MessagesTab: React.FC<MessagesTabProps> = ({
  onStartCall,
  onOpenProfile,
  onStartRandomMatch,
}) => {
  const [subTab, setSubTab] = useState<'All' | 'Pending' | 'Calls' | 'Intimacy'>('All');
  const [threads, setThreads] = useState<DirectMessageThread[]>(INITIAL_DIRECT_MESSAGES);
  const [activeThread, setActiveThread] = useState<DirectMessageThread | null>(null);
  const [messageText, setMessageText] = useState('');
  const [ticketCount, setTicketCount] = useState(2);

  // If a chat thread is open
  if (activeThread) {
    return (
      <div className="flex-1 flex flex-col h-full bg-[#0a0614] text-white select-none">
        {/* Chat Header */}
        <div className="px-4 py-3 bg-[#110822] border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                playSound.pop();
                setActiveThread(null);
              }}
              className="w-8 h-8 rounded-full flex items-center justify-center text-white/70 hover:text-white"
            >
              <ArrowLeft size={18} />
            </button>
            <div
              onClick={() => onOpenProfile(activeThread.user)}
              className="flex items-center gap-2.5 cursor-pointer"
            >
              <img
                src={activeThread.user.avatar}
                alt={activeThread.user.name}
                className="w-10 h-10 rounded-full object-cover border-2 border-purple-500"
              />
              <div>
                <div className="text-sm font-bold flex items-center gap-1.5">
                  <span>{activeThread.user.name}</span>
                  <span>{activeThread.user.flag}</span>
                </div>
                <div className="text-[11px] text-emerald-400">Online</div>
              </div>
            </div>
          </div>

          <button
            onClick={() => {
              playSound.radarPing();
              onStartCall(activeThread.user);
            }}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 text-white text-xs font-black shadow-md active:scale-95 transition-transform"
          >
            <Video size={14} />
            <span>Call</span>
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3 pb-24">
          {activeThread.messages.map((m) => {
            const isMe = m.sender === 'user';
            return (
              <div key={m.id} className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
                <div
                  className={`max-w-[78%] px-4 py-2.5 rounded-2xl text-xs leading-relaxed ${
                    isMe
                      ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-br-none'
                      : 'bg-white/10 text-white border border-white/10 rounded-bl-none'
                  }`}
                >
                  {m.text}
                </div>
                <span className="text-[10px] text-white/40 mt-1 px-1">{m.time}</span>
              </div>
            );
          })}
        </div>

        {/* Input */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (!messageText.trim()) return;
            const newMsg = { id: `m_${Date.now()}`, sender: 'user' as const, text: messageText.trim(), time: 'Just now' };
            setActiveThread({ ...activeThread, messages: [...activeThread.messages, newMsg] });
            setMessageText('');
          }}
          className="p-3 bg-[#110822] border-t border-white/10 flex items-center gap-2 fixed bottom-14 inset-x-0"
        >
          <input
            type="text"
            value={messageText}
            onChange={(e) => setMessageText(e.target.value)}
            placeholder={`Message ${activeThread.user.name}...`}
            className="flex-1 px-4 py-2 bg-white/5 border border-white/10 rounded-full text-xs text-white placeholder-white/40 focus:outline-none focus:border-purple-500"
          />
          <button
            type="submit"
            className="w-9 h-9 rounded-full bg-purple-600 flex items-center justify-center text-white"
          >
            <Send size={15} />
          </button>
        </form>
      </div>
    );
  }

  // Main Messages View with 3D Glass Heart matching video 00:23 - 00:27
  return (
    <div className="flex-1 flex flex-col h-full bg-[#f8f9fc] text-slate-900 overflow-y-auto pb-24 select-none">
      {/* Sub Tabs: All, Pending, Calls, Intimacy */}
      <div className="p-4 bg-white border-b border-slate-100 flex items-center justify-between">
        <div className="flex items-center gap-4">
          {(['All', 'Pending', 'Calls', 'Intimacy'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => {
                playSound.pop();
                setSubTab(tab);
              }}
              className={`px-3 py-1 rounded-full text-xs font-bold transition-all ${
                subTab === tab
                  ? 'bg-purple-600 text-white shadow-sm'
                  : 'text-slate-500 hover:text-slate-900 bg-slate-100'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        <span className="px-2 py-0.5 rounded-full bg-rose-500 text-white text-[10px] font-black">
          99+
        </span>
      </div>

      {/* Main Body */}
      <div className="p-4 space-y-4">
        {/* 3D Glass Heart "Random Match" Card (Exact Match to video 00:24) */}
        <div className="relative rounded-3xl overflow-hidden bg-gradient-to-b from-[#b388ff] via-[#9055ff] to-[#651fff] text-white p-5 shadow-2xl border-2 border-white/30 text-center flex flex-col items-center">
          {/* Glowing 3D Glass Heart Top Center */}
          <div className="relative -mt-2 mb-2">
            <div className="w-20 h-20 rounded-full bg-white/20 backdrop-blur-xl border-2 border-white/40 flex items-center justify-center shadow-[0_0_25px_rgba(255,255,255,0.6)] animate-pulse">
              <span className="text-4xl drop-shadow">💙</span>
            </div>
            {/* Halo wings */}
            <div className="absolute inset-0 bg-white/30 rounded-full blur-md -z-10" />
          </div>

          <h3 className="text-2xl font-black tracking-wide drop-shadow-md">Random match</h3>
          <p className="text-xs text-white/90 font-medium mt-0.5">
            Draw a lucky girl and have a party
          </p>

          {/* 3 Circular Avatar Slots (Exact matching video 00:25) */}
          <div className="flex items-center justify-center gap-3 my-5">
            {MOCK_PROFILES.slice(0, 3).map((p, idx) => (
              <div
                key={p.id}
                className="relative w-16 h-16 rounded-full overflow-hidden border-2 border-amber-300 shadow-xl"
              >
                <img src={p.avatar} alt="" className="w-full h-full object-cover" />
                <span className="absolute bottom-0 inset-x-0 bg-black/60 text-[9px] text-center font-bold text-white">
                  {p.flag}
                </span>
              </div>
            ))}
          </div>

          {/* "Random match Free" Button with 2 tickets (Exact matching video 00:24) */}
          <div className="relative w-full max-w-xs">
            <button
              onClick={() => {
                playSound.radarPing();
                onStartRandomMatch();
              }}
              className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-[#d500f9] via-[#aa00ff] to-[#651fff] font-black text-sm text-white shadow-xl shadow-purple-950/40 hover:opacity-95 active:scale-95 transition-all flex items-center justify-center gap-2 border border-white/30"
            >
              <Sparkles size={16} className="text-yellow-300 animate-spin" />
              <span>Random match Free</span>
            </button>

            {/* Ticket Counter Badge 2 */}
            <span className="absolute -top-2 right-4 px-2 py-0.5 rounded-full bg-blue-500 border border-white text-white text-[11px] font-black shadow flex items-center gap-1">
              <span>🎟️</span>
              <span>{ticketCount}</span>
            </span>
          </div>
        </div>

        {/* Event Center Card matching video 00:24 */}
        <div className="p-3.5 bg-white border border-slate-100 rounded-2xl flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-amber-400 to-orange-500 flex items-center justify-center text-white text-lg font-black shadow">
              ★
            </div>
            <div>
              <div className="text-xs font-bold text-slate-900">Event Center</div>
              <div className="text-[11px] text-slate-400">A new event is live · Active Hours 00:40</div>
            </div>
          </div>
          <span className="text-xs font-bold text-purple-600">Enter →</span>
        </div>

        {/* Recent Message Threads */}
        <div className="space-y-2">
          <div className="text-xs font-bold text-slate-400 uppercase tracking-wider px-1">
            Recent Conversations
          </div>

          {threads.map((thread) => (
            <div
              key={thread.id}
              onClick={() => {
                playSound.pop();
                setActiveThread(thread);
              }}
              className="p-3 bg-white border border-slate-100 rounded-2xl flex items-center justify-between shadow-sm cursor-pointer hover:bg-purple-50/50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="relative">
                  <img
                    src={thread.user.avatar}
                    alt=""
                    className="w-12 h-12 rounded-full object-cover border border-purple-200"
                  />
                  <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 rounded-full border-2 border-white" />
                </div>
                <div>
                  <div className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                    <span>{thread.user.name}</span>
                    <span>{thread.user.flag}</span>
                  </div>
                  <p className="text-xs text-slate-500 truncate max-w-[200px] mt-0.5">
                    {thread.lastMessage}
                  </p>
                </div>
              </div>

              <div className="text-right">
                <span className="text-[10px] text-slate-400">{thread.lastTime}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
