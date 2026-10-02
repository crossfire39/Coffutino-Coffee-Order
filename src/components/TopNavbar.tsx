import React from 'react';
import { ShoppingBag } from 'lucide-react';
import { COFFUTINO_LOGO } from '../data/coffeeData';
import { PWAInstallButton } from './PWAInstallButton';

interface TopNavbarProps {
  cartCount: number;
  onOpenCart: () => void;
}

export const TopNavbar: React.FC<TopNavbarProps> = ({
  cartCount,
  onOpenCart
}) => {
  return (
    <header className="sticky top-0 z-40 bg-[#161413]/95 backdrop-blur-md px-4 py-3 border-b border-stone-800/80 flex items-center justify-between transition-colors">
      {/* Zone 1: Лого и име КОФУТИНО ЕООД */}
      <div className="flex items-center gap-2.5 min-w-0">
        <img
          src={COFFUTINO_LOGO}
          alt="КОФУТИНО ЕООД"
          referrerPolicy="no-referrer"
          className="w-7 h-7 object-contain rounded-md shrink-0"
        />
        <a
          href="#home"
          className="text-base sm:text-lg font-bold tracking-wider uppercase text-amber-100 hover:text-amber-200 transition-colors font-display truncate"
        >
          КОФУТИНО ЕООД
        </a>
      </div>

      {/* Zone 2: Бутон за инсталиране, Валута Евро и Количка */}
      <div className="flex items-center gap-2 shrink-0">
        {/* Бутон за PWA инсталация */}
        <PWAInstallButton variant="navbar" />

        {/* Индикатор за валута в евро */}
        <span
          className="px-2.5 py-1 rounded-lg text-[11px] font-semibold bg-stone-800/80 text-amber-300 border border-stone-700/60 font-mono shadow-sm"
          title="Валута: Евро (€)"
        >
          € EUR
        </span>

        {/* Бутон Количка */}
        <button
          type="button"
          onClick={onOpenCart}
          className="relative min-w-[44px] min-h-[44px] -my-1 -mr-1 flex items-center justify-center text-stone-200 hover:text-white transition-transform active:scale-90 cursor-pointer"
          aria-label="Количка с поръчка"
        >
          <div className="relative p-2 rounded-full bg-stone-800/90 border border-stone-700/70">
            <ShoppingBag className="w-4 h-4 text-amber-300" />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-amber-600 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center shadow-md animate-in fade-in zoom-in">
                {cartCount}
              </span>
            )}
          </div>
        </button>
      </div>
    </header>
  );
};
