import React, { useEffect, useState } from 'react';

interface SplashScreenProps {
  onFinish: () => void;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({ onFinish }) => {
  const [fade, setFade] = useState(false);

  useEffect(() => {
    const t1 = setTimeout(() => {
      setFade(true);
    }, 1200);

    const t2 = setTimeout(() => {
      onFinish();
    }, 1600);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [onFinish]);

  return (
    <div
      onClick={onFinish}
      className={`fixed inset-0 z-50 flex flex-col items-center justify-center bg-gradient-to-b from-[#e9d5ff] via-[#d8b4fe] to-[#c084fc] transition-opacity duration-400 cursor-pointer ${
        fade ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
    >
      {/* 3D App Icon card */}
      <div className="w-40 h-40 rounded-3xl bg-gradient-to-tr from-[#7e22ce] via-[#9333ea] to-[#ec4899] p-3 shadow-2xl flex flex-col items-center justify-center animate-in zoom-in-75 duration-500 border border-white/40">
        <div className="w-full h-full rounded-2xl bg-[#581c87]/50 flex flex-col items-center justify-center backdrop-blur-sm p-2 text-center">
          <span className="text-2xl mb-1">👑</span>
          <span className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white via-yellow-200 to-pink-200 tracking-tight drop-shadow-md uppercase">
            Bad Daddy
          </span>
        </div>
      </div>

      <div className="mt-7 text-center">
        <h1 className="text-2xl font-black text-[#581c87] tracking-tight">Bad Daddy</h1>
        <p className="text-xs text-[#7e22ce] font-semibold mt-1">Live Video Chat & Meet Friends</p>
      </div>

      {/* Loading dots */}
      <div className="mt-8 flex items-center gap-2">
        <span className="w-2.5 h-2.5 rounded-full bg-[#7e22ce] animate-bounce" style={{ animationDelay: '0ms' }} />
        <span className="w-2.5 h-2.5 rounded-full bg-[#9333ea] animate-bounce" style={{ animationDelay: '150ms' }} />
        <span className="w-2.5 h-2.5 rounded-full bg-[#ec4899] animate-bounce" style={{ animationDelay: '300ms' }} />
      </div>
    </div>
  );
};
