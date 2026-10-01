import React, { useState, useEffect } from 'react';
import { Smartphone, Monitor, Wifi, BatteryCharging, Signal } from 'lucide-react';

interface IPhoneFrameProps {
  children: React.ReactNode;
  activeRoastCount?: number;
  cartItemCount?: number;
}

export const IPhoneFrame: React.FC<IPhoneFrameProps> = ({
  children,
  activeRoastCount = 1,
  cartItemCount = 0
}) => {
  const [deviceFrameMode, setDeviceFrameMode] = useState<boolean>(true);
  const [currentTime, setCurrentTime] = useState<string>('09:41');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const hours = String(now.getHours()).padStart(2, '0');
      const minutes = String(now.getMinutes()).padStart(2, '0');
      setCurrentTime(`${hours}:${minutes}`);
    };
    updateTime();
    const interval = setInterval(updateTime, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-[#0e0d0c] text-stone-200 flex flex-col items-center justify-start lg:justify-center p-0 lg:p-6 transition-all duration-300">
      {/* Desktop Helper Bar: Allows toggling between iPhone 16 Pro mockup and Fluid Mobile Preview */}
      <aside aria-label="Управление на изгледа" className="hidden lg:flex items-center justify-between w-full max-w-5xl mb-4 px-4 py-2 bg-stone-900/80 backdrop-blur-md rounded-xl border border-stone-800/80 text-xs text-stone-400">
        <div className="flex items-center gap-2">
          <span className="inline-block w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
          <span className="font-medium text-stone-300">КОФУТИНО ЕООД мобилно приложение за iPhone</span>
          <span className="text-stone-500">·</span>
          <span>iPhone 16 Pro формат (393 × 852 pt)</span>
        </div>
        
        <div className="flex items-center gap-2">
          <button
            onClick={() => setDeviceFrameMode(true)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              deviceFrameMode
                ? 'bg-amber-600/20 text-amber-300 border border-amber-500/30'
                : 'text-stone-400 hover:text-stone-200 hover:bg-stone-800'
            }`}
            title="Преглед в рамка на iPhone"
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span>iPhone изглед</span>
          </button>
          <button
            onClick={() => setDeviceFrameMode(false)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              !deviceFrameMode
                ? 'bg-amber-600/20 text-amber-300 border border-amber-500/30'
                : 'text-stone-400 hover:text-stone-200 hover:bg-stone-800'
            }`}
            title="Разгънат цял екран"
          >
            <Monitor className="w-3.5 h-3.5" />
            <span>Разширен екран</span>
          </button>
        </div>
      </aside>

      {/* Frame Container */}
      <div
        className={`w-full transition-all duration-300 flex justify-center ${
          deviceFrameMode
            ? 'lg:max-w-[420px] lg:my-auto'
            : 'max-w-md'
        }`}
      >
        <div
          className={`w-full relative flex flex-col bg-[#141211] text-stone-100 overflow-hidden ${
            deviceFrameMode
              ? 'lg:rounded-[52px] lg:border-[11px] lg:border-[#2a2725] lg:shadow-[0_25px_70px_rgba(0,0,0,0.85),0_0_0_1px_rgba(255,255,255,0.08)] lg:h-[870px]'
              : 'min-h-screen border-x border-stone-800/40 shadow-2xl'
          }`}
        >
          {/* iOS Top Status Bar */}
          <div className="sticky top-0 z-50 bg-[#141211]/90 backdrop-blur-md px-7 pt-3 pb-2 flex items-center justify-between text-[13px] font-semibold tracking-tight text-stone-200 select-none border-b border-stone-800/30">
            {/* Clock */}
            <span>{currentTime}</span>

            {/* Dynamic Island */}
            <div className="absolute left-1/2 -translate-x-1/2 top-2.5 h-[28px] px-3.5 bg-black rounded-full flex items-center gap-2 border border-stone-800/80 shadow-inner">
              <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
              <span className="text-[11px] text-amber-200 font-medium tracking-tight">
                КОФУТИНО ЕООД
              </span>
              {cartItemCount > 0 && (
                <span className="text-[10px] bg-amber-500/30 text-amber-300 font-bold px-1.5 py-0.2 rounded-full">
                  {cartItemCount}
                </span>
              )}
            </div>

            {/* Cellular, Wifi, Battery */}
            <div className="flex items-center gap-2 text-stone-300">
              <Signal className="w-3.5 h-3.5" />
              <Wifi className="w-3.5 h-3.5" />
              <div className="flex items-center gap-1">
                <span className="text-[10px] text-stone-400 font-mono">100%</span>
                <div className="w-5 h-2.5 rounded-sm border border-stone-400 p-[1px] flex items-center">
                  <div className="w-full h-full bg-stone-200 rounded-[1px]" />
                </div>
              </div>
            </div>
          </div>

          {/* App Scrollable Content Canvas */}
          <div className="flex-1 flex flex-col overflow-y-auto no-scrollbar relative">
            {children}
          </div>

          {/* iOS Home Indicator Bar */}
          <div className="sticky bottom-0 z-50 w-full pt-1 pb-2 bg-[#141211]/90 backdrop-blur-md flex justify-center pointer-events-none">
            <div className="w-32 h-1 bg-stone-500/40 rounded-full" />
          </div>
        </div>
      </div>
    </div>
  );
};
