import React, { useState } from 'react';
import { X, Check, Gift, Sparkles, ChevronRight, Award } from 'lucide-react';
import { playSound } from '../utils/soundEffects';

interface RewardsModalProps {
  isOpen: boolean;
  onClose: () => void;
  userTokens: number;
  onAddTokens: (amount: number) => void;
}

export const RewardsModal: React.FC<RewardsModalProps> = ({
  isOpen,
  onClose,
  userTokens,
  onAddTokens,
}) => {
  const [claimedDay, setClaimedDay] = useState<number | null>(() => {
    return parseInt(localStorage.getItem('pulselive_claimed_day') || '0', 10);
  });
  const [completedTasks, setCompletedTasks] = useState<string[]>([]);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const currentStreak = claimedDay ? claimedDay : 0;
  const isTodayClaimed = claimedDay !== null && claimedDay >= 1;

  const handleCheckIn = () => {
    if (isTodayClaimed) {
      setToastMessage('Already checked in today! Come back tomorrow.');
      setTimeout(() => setToastMessage(null), 2500);
      return;
    }

    const nextDay = (claimedDay || 0) + 1;
    const rewardTokens = nextDay === 7 ? 15 : 5;
    setClaimedDay(nextDay);
    localStorage.setItem('pulselive_claimed_day', nextDay.toString());
    onAddTokens(rewardTokens);
    playSound.coin();
    setToastMessage(`🎉 Day ${nextDay} Checked in! Received +${rewardTokens} Coins!`);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleCompleteTask = (taskId: string, reward: number, title: string) => {
    if (completedTasks.includes(taskId)) return;
    setCompletedTasks([...completedTasks, taskId]);
    onAddTokens(reward);
    playSound.coin();
    setToastMessage(`Task "${title}" completed! +${reward} Coins!`);
    setTimeout(() => setToastMessage(null), 2500);
  };

  const days = [
    { day: 1, amount: '+5' },
    { day: 2, amount: '+5' },
    { day: 3, amount: '+5' },
    { day: 4, amount: '+5' },
    { day: 5, amount: '+8' },
    { day: 6, amount: '+8' },
    { day: 7, amount: '+15 🎁' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/75 backdrop-blur-sm p-0 sm:p-4">
      <div className="w-full sm:max-w-md max-h-[90vh] bg-white text-slate-900 rounded-t-3xl sm:rounded-3xl overflow-y-auto shadow-2xl flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <Gift className="text-pink-500" size={20} />
            <h2 className="text-base font-bold">Daily Bonus & Rewards</h2>
          </div>
          <button
            onClick={() => {
              playSound.pop();
              onClose();
            }}
            className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-100"
          >
            <X size={18} />
          </button>
        </div>

        {/* Current Balance Banner */}
        <div className="mx-5 mt-4 p-4 rounded-2xl bg-gradient-to-r from-amber-500 via-orange-500 to-pink-500 text-white flex items-center justify-between shadow-lg shadow-orange-500/20">
          <div>
            <div className="text-xs uppercase tracking-wider text-white/80 font-semibold">Your Wallet Balance</div>
            <div className="text-2xl font-black flex items-center gap-2 mt-0.5">
              <span>🪙 {userTokens}</span>
              <span className="text-xs font-normal bg-white/20 px-2 py-0.5 rounded-full">Coins</span>
            </div>
          </div>
          <div className="text-right">
            <div className="text-xs text-white/80">Streak</div>
            <div className="text-lg font-bold">🔥 {currentStreak} Days</div>
          </div>
        </div>

        {/* FREE 60 COINS SPECIAL REWARD CARD */}
        <div className="mx-5 mt-3 p-3.5 rounded-2xl bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-600 text-white shadow-xl shadow-teal-500/20 border-2 border-emerald-300/40 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center text-xl shadow-inner">
              🪙
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-black uppercase tracking-wider text-amber-200 bg-black/30 px-2 py-0.5 rounded-full">
                  SPECIAL GIFT
                </span>
              </div>
              <h4 className="text-sm font-black text-white mt-0.5">Free 60 Coins (मुफ्त 60 कॉइन)</h4>
              <p className="text-[10px] text-teal-100">तुरंत 60 फ्री कॉइन प्राप्त करें</p>
            </div>
          </div>

          <button
            onClick={() => {
              onAddTokens(60);
              playSound.coin();
              setToastMessage('🎉 बधाई! +60 फ्री कॉइन आपके खाते में सफलतापूर्वक जुड़ गए!');
              setTimeout(() => setToastMessage(null), 3500);
            }}
            className="px-3.5 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs shadow-md active:scale-95 transition-transform flex items-center gap-1"
          >
            <span>+60 CLAIM</span>
            <Sparkles size={13} className="text-slate-950" />
          </button>
        </div>

        {/* Toast Alert */}
        {toastMessage && (
          <div className="mx-5 mt-3 p-3 bg-emerald-50 text-emerald-800 rounded-xl text-xs font-medium border border-emerald-200 text-center animate-in fade-in">
            {toastMessage}
          </div>
        )}

        {/* 7-Day Grid */}
        <div className="p-5">
          <div className="flex items-center justify-between mb-3">
            <div className="text-sm font-bold text-slate-800">Sign in rewards</div>
            <div className="text-xs text-slate-400 font-mono">Reset in 00:33:42</div>
          </div>

          <div className="grid grid-cols-4 gap-2 mb-4">
            {days.slice(0, 4).map((d) => {
              const claimed = (claimedDay || 0) >= d.day;
              return (
                <div
                  key={d.day}
                  className={`relative p-3 rounded-xl flex flex-col items-center justify-center text-center transition-all ${
                    claimed
                      ? 'bg-purple-100 border border-purple-200 text-purple-800'
                      : 'bg-purple-50/70 border border-purple-100 text-purple-600'
                  }`}
                >
                  <span className="absolute top-1 left-2 text-[10px] font-bold text-slate-400">Day {d.day}</span>
                  <div className="my-1 text-xl">{claimed ? '✅' : '💜'}</div>
                  <div className="text-xs font-bold">{d.amount}</div>
                </div>
              );
            })}
          </div>

          <div className="grid grid-cols-3 gap-2 mb-4">
            {days.slice(4).map((d) => {
              const claimed = (claimedDay || 0) >= d.day;
              const isDay7 = d.day === 7;
              return (
                <div
                  key={d.day}
                  className={`relative p-3 rounded-xl flex flex-col items-center justify-center text-center transition-all ${
                    isDay7
                      ? claimed
                        ? 'bg-pink-100 border border-pink-300 text-pink-900'
                        : 'bg-gradient-to-br from-pink-500 to-purple-600 text-white shadow-md'
                      : claimed
                      ? 'bg-purple-100 border border-purple-200 text-purple-800'
                      : 'bg-purple-50/70 border border-purple-100 text-purple-600'
                  }`}
                >
                  <span className={`absolute top-1 left-2 text-[10px] font-bold ${isDay7 && !claimed ? 'text-white/80' : 'text-slate-400'}`}>
                    Day {d.day}
                  </span>
                  <div className="my-1 text-xl">{claimed ? '✅' : isDay7 ? '🎁' : '💜'}</div>
                  <div className={`text-xs font-bold ${isDay7 && !claimed ? 'text-white' : ''}`}>{d.amount}</div>
                </div>
              );
            })}
          </div>

          {/* Big Check-in Button */}
          <button
            onClick={handleCheckIn}
            disabled={isTodayClaimed}
            className={`w-full py-3.5 rounded-xl font-bold text-sm transition-all shadow-md flex items-center justify-center gap-2 ${
              isTodayClaimed
                ? 'bg-slate-100 text-slate-400 cursor-not-allowed shadow-none'
                : 'bg-gradient-to-r from-orange-500 via-pink-500 to-purple-600 text-white hover:opacity-95 active:scale-[0.99] shadow-pink-500/25'
            }`}
          >
            {isTodayClaimed ? (
              <>
                <Check size={18} />
                <span>Checked In Today</span>
              </>
            ) : (
              <>
                <Sparkles size={18} />
                <span>Check In Now</span>
              </>
            )}
          </button>
        </div>

        {/* Tasks Section */}
        <div className="px-5 pb-6">
          <div className="text-sm font-bold text-slate-800 mb-3 flex items-center gap-2">
            <Award size={16} className="text-orange-500" />
            <span>Bonus Tasks</span>
          </div>

          <div className="space-y-2.5">
            {[
              { id: 't_verify', title: 'Profile Verification', reward: 5, progress: '(0/1)' },
              { id: 't_friends', title: 'Make (2/10) Global Friends', reward: 5, progress: '(2/10)' },
              { id: 't_call', title: 'Start First Random Call', reward: 10, progress: '(0/1)' },
            ].map((task) => {
              const isDone = completedTasks.includes(task.id);
              return (
                <div
                  key={task.id}
                  className="flex items-center justify-between p-3.5 bg-slate-50 border border-slate-100 rounded-xl"
                >
                  <div>
                    <div className="text-xs font-semibold text-slate-800">{task.title}</div>
                    <div className="text-[11px] text-orange-600 font-medium flex items-center gap-1 mt-0.5">
                      <span>🪙 +{task.reward} Coins</span>
                      <span className="text-slate-400">· {task.progress}</span>
                    </div>
                  </div>
                  <button
                    onClick={() => handleCompleteTask(task.id, task.reward, task.title)}
                    disabled={isDone}
                    className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${
                      isDone
                        ? 'bg-emerald-100 text-emerald-700'
                        : 'border border-purple-400 text-purple-600 hover:bg-purple-600 hover:text-white'
                    }`}
                  >
                    {isDone ? 'Claimed' : 'Go'}
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
