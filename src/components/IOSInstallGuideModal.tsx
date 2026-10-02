import React from 'react';
import { X, PlusSquare, ArrowDown, Share } from 'lucide-react';
import { COFFUTINO_LOGO } from '../data/coffeeData';

interface IOSInstallGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const IOSInstallGuideModal: React.FC<IOSInstallGuideModalProps> = ({
  isOpen,
  onClose
}) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="w-full max-w-sm bg-[#1c1917] rounded-3xl border border-stone-800 shadow-2xl p-5 text-stone-200 space-y-4 relative animate-in slide-in-from-bottom-4 duration-250"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Бутон за затваряне */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 w-7 h-7 rounded-full bg-stone-800/80 hover:bg-stone-700 flex items-center justify-center text-stone-400 hover:text-white transition-colors cursor-pointer"
          aria-label="Затвори"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Заглавна част с логото */}
        <div className="flex items-center gap-3 pr-8">
          <div className="w-12 h-12 rounded-2xl bg-[#161413] border border-amber-600/30 p-1 flex items-center justify-center shadow-md shrink-0">
            <img
              src={COFFUTINO_LOGO}
              alt="Coffutino"
              referrerPolicy="no-referrer"
              className="w-9 h-9 object-contain rounded-xl"
            />
          </div>
          <div>
            <h3 className="text-base font-bold font-display text-white">
              Инсталиране на iPhone
            </h3>
            <span className="text-[11px] text-amber-300 font-medium">
              Добавете Coffutino на началния екран
            </span>
          </div>
        </div>

        <p className="text-xs text-stone-300 leading-relaxed">
          За бърз достъп и пълно екранно изживяване, следвайте тези 2 лесни стъпки в Safari:
        </p>

        {/* 2-те графични стъпки */}
        <div className="space-y-2.5">
          {/* Стъпка 1 */}
          <div className="p-3.5 rounded-2xl bg-stone-900/90 border border-stone-800 flex items-start gap-3">
            <div className="w-9 h-9 rounded-xl bg-blue-950/80 border border-blue-500/40 text-blue-400 flex items-center justify-center shrink-0 shadow-sm mt-0.5">
              <Share className="w-5 h-5 text-blue-400" />
            </div>
            <div className="space-y-0.5">
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-amber-950 text-amber-300 border border-amber-600/30 uppercase">
                  Стъпка 1
                </span>
                <span className="text-xs font-semibold text-stone-100">
                  Бутон „Споделяне“ (Share)
                </span>
              </div>
              <p className="text-[11px] text-stone-400 leading-snug">
                Натиснете бутона <strong className="text-stone-200">Споделяне</strong> (квадратчето със стрелка нагоре в долната лента на Safari).
              </p>
            </div>
          </div>

          {/* Стъпка 2 */}
          <div className="p-3.5 rounded-2xl bg-stone-900/90 border border-stone-800 flex items-start gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-950/80 border border-amber-500/40 text-amber-400 flex items-center justify-center shrink-0 shadow-sm mt-0.5">
              <PlusSquare className="w-5 h-5 text-amber-400" />
            </div>
            <div className="space-y-0.5">
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-amber-950 text-amber-300 border border-amber-600/30 uppercase">
                  Стъпка 2
                </span>
                <span className="text-xs font-semibold text-stone-100">
                  „Добавяне към началния екран“
                </span>
              </div>
              <p className="text-[11px] text-stone-400 leading-snug">
                Превъртете надолу в менюто и изберете <strong className="text-stone-200">„Добавяне към началния екран“</strong> (Add to Home Screen).
              </p>
            </div>
          </div>
        </div>

        {/* Подсказка със стрелка надолу към лентата на Safari */}
        <div className="pt-1 flex items-center justify-center gap-1.5 text-[11px] text-amber-400/90">
          <ArrowDown className="w-3.5 h-3.5 animate-bounce" />
          <span>Бутонът за споделяне се намира най-долу в Safari</span>
        </div>

        {/* Бутон за затваряне */}
        <button
          type="button"
          onClick={onClose}
          className="w-full py-3 rounded-2xl bg-amber-600 hover:bg-amber-500 text-white font-semibold text-xs transition-colors shadow-lg shadow-amber-900/40 active:scale-95 cursor-pointer"
        >
          Разбрах
        </button>
      </div>
    </div>
  );
};
