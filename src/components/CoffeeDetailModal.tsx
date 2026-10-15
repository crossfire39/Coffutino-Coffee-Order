import React, { useState } from 'react';
import { CoffeeSort, CoffeeSize, GrindId } from '../types';
import { GRIND_OPTIONS } from '../data/coffeeData';
import { X, Sparkles, Check, ChevronRight, ArrowLeft } from 'lucide-react';

interface CoffeeDetailModalProps {
  coffee: CoffeeSort | null;
  onClose: () => void;
  currency: 'EUR' | 'BGN';
  onAddToCart: (coffee: CoffeeSort, size: CoffeeSize, grind: GrindId) => void;
}

export const CoffeeDetailModal: React.FC<CoffeeDetailModalProps> = ({
  coffee,
  onClose,
  currency,
  onAddToCart
}) => {
  if (!coffee) return null;

  const [size, setSize] = useState<CoffeeSize>('250g');
  const [grind, setGrind] = useState<GrindId>('whole_bean');
  const [added, setAdded] = useState(false);

  const price = size === '250g'
    ? (currency === 'EUR' ? coffee.price250g : coffee.price250gBgn)
    : (currency === 'EUR' ? coffee.price1kg : coffee.price1kgBgn);

  const selectedGrindObj = GRIND_OPTIONS.find((g) => g.id === grind) || GRIND_OPTIONS[0];

  const handleAdd = () => {
    onAddToCart(coffee, size, grind);
    setAdded(true);
    alert('Кафето беше добавено в количката!');
    setTimeout(() => {
      setAdded(false);
      onClose();
    }, 500);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/80 backdrop-blur-md transition-all animate-in fade-in duration-200">
      <div
        className="w-full max-w-lg bg-[#181615] rounded-t-[32px] sm:rounded-3xl border border-stone-800 shadow-2xl flex flex-col h-[90dvh] sm:h-auto sm:max-h-[85vh] overflow-hidden relative"
        onClick={(e) => e.stopPropagation()}
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {/* iOS Drag Handle */}
        <div className="w-full pt-3 pb-1 flex justify-center sm:hidden shrink-0">
          <div className="w-10 h-1.5 bg-stone-700 rounded-full" />
        </div>

        {/* Sticky Top Header Bar with Back and Close (Safe Area Top Padding for Dynamic Island) */}
        <div className="sticky top-0 z-30 bg-[#181615] backdrop-blur-md px-5 pt-[calc(env(safe-area-inset-top,16px)+0.75rem)] pb-3 border-b border-stone-800/80 flex items-center justify-between shrink-0 shadow-sm">
          <button
            type="button"
            onClick={onClose}
            className="flex items-center gap-1.5 text-xs font-semibold text-stone-300 hover:text-white transition-colors cursor-pointer bg-stone-800/80 hover:bg-stone-800 px-3 py-1.5 rounded-xl border border-stone-700/60 shadow-sm"
            aria-label="Назад"
          >
            <ArrowLeft className="w-4 h-4 text-amber-400" />
            <span>Назад</span>
          </button>

          <div className="flex items-center gap-2">
            <span className="text-lg">{coffee.flag}</span>
            <span className="text-xs uppercase tracking-wider font-semibold text-amber-400">
              {coffee.originBg}
            </span>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-stone-800 flex items-center justify-center text-stone-400 hover:text-white transition-colors cursor-pointer shadow-sm"
            aria-label="Затвори"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable Content with hidden scrollbar */}
        <div 
          className="flex-1 overflow-y-auto p-5 space-y-6 text-stone-200 pb-36"
          style={{
            scrollbarWidth: 'none',
            msOverflowStyle: 'none',
            WebkitOverflowScrolling: 'touch'
          }}
        >
          {/* Top Banner / Image */}
          <div className="relative h-56 w-full rounded-2xl overflow-hidden border border-stone-800 bg-[#161413] shadow-md">
            <img
              src={coffee.image}
              alt={coffee.name}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover object-center"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
            <div className="absolute bottom-3 left-4 right-4 flex items-end justify-between">
              <div>
                <h2 className="text-2xl font-bold font-display text-white">{coffee.name}</h2>
                <p className="text-xs text-amber-200/90 font-medium">
                  {coffee.subnameBg}
                </p>
              </div>
              <div className="px-3 py-1 rounded-xl bg-amber-950/80 backdrop-blur-md border border-amber-500/40 text-xs font-bold text-amber-300 flex items-center gap-1 shadow">
                <Sparkles className="w-3.5 h-3.5" />
                <span>SCA {coffee.scaScore.toFixed(1)}</span>
              </div>
            </div>
          </div>

          {/* Вкусов профил и нотки */}
          <div className="space-y-2">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-stone-400">
              Вкусов профил и нотки
            </h3>
            <div className="flex flex-wrap gap-2">
              {coffee.tastingNotesBg.map((note, index) => (
                <span
                  key={index}
                  className="px-3 py-1.5 rounded-xl bg-stone-900 border border-amber-500/30 text-xs text-amber-200/90 font-medium shadow-sm"
                >
                  {note}
                </span>
              ))}
            </div>
          </div>

          {/* Описание */}
          <div className="p-4 rounded-2xl bg-stone-900/80 border border-stone-800 text-sm text-stone-300 leading-relaxed shadow-inner">
            {coffee.descriptionBg}
          </div>

          {/* Избор на грамаж (250g / 1kg) */}
          <div className="space-y-2">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-stone-400 flex items-center gap-1.5">
              <span>Избери разфасовка</span>
            </h3>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setSize('250g')}
                className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer ${
                  size === '250g'
                    ? 'bg-amber-600/20 border-amber-500 text-white shadow-md shadow-amber-950/50'
                    : 'bg-stone-900 border-stone-800 text-stone-400 hover:border-stone-700'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-bold text-sm text-stone-100">Пакет 250г</span>
                  {size === '250g' && <Check className="w-4 h-4 text-amber-400" />}
                </div>
                <div className="text-base font-bold font-mono text-amber-300">
                  {currency === 'EUR' ? `${coffee.price250g.toFixed(2)} €` : `${coffee.price250gBgn.toFixed(2)} лв`}
                </div>
                <span className="text-[11px] text-stone-400 block mt-0.5">Стандартен пакет</span>
              </button>

              <button
                type="button"
                onClick={() => setSize('1kg')}
                className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer ${
                  size === '1kg'
                    ? 'bg-amber-600/20 border-amber-500 text-white shadow-md shadow-amber-950/50'
                    : 'bg-stone-900 border-stone-800 text-stone-400 hover:border-stone-700'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-bold text-sm text-stone-100">Пакет 1 кг</span>
                  {size === '1kg' && <Check className="w-4 h-4 text-amber-400" />}
                </div>
                <div className="text-base font-bold font-mono text-amber-300">
                  {currency === 'EUR' ? `${coffee.price1kg.toFixed(2)} €` : `${coffee.price1kgBgn.toFixed(2)} лв`}
                </div>
                <span className="text-[11px] text-amber-400 font-medium block mt-0.5">Икономична опаковка</span>
              </button>
            </div>
          </div>

          {/* Избор на смилане */}
          <div className="space-y-2">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-stone-400">
              Смилане на кафето
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {GRIND_OPTIONS.map((opt) => {
                const isSelected = grind === opt.id;
                return (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => setGrind(opt.id as GrindId)}
                    className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex items-start gap-3 ${
                      isSelected
                        ? 'bg-amber-600/20 border-amber-500 text-white shadow'
                        : 'bg-stone-900 border-stone-800 text-stone-300 hover:border-stone-700'
                    }`}
                  >
                    <span className="text-xl mt-0.5">☕</span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-xs text-stone-100">{opt.nameBg}</span>
                        {isSelected && <Check className="w-3.5 h-3.5 text-amber-400 shrink-0" />}
                      </div>
                      <p className="text-[11px] text-stone-400 mt-0.5 leading-tight">{opt.descriptionBg}</p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Детайли за кафето */}
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="p-3 rounded-xl bg-stone-900 border border-stone-800">
              <span className="text-stone-400 block text-[11px]">Надморска височина</span>
              <span className="font-semibold text-stone-200">{coffee.altitude}</span>
            </div>
            <div className="p-3 rounded-xl bg-stone-900 border border-stone-800">
              <span className="text-stone-400 block text-[11px]">Обработка</span>
              <span className="font-semibold text-stone-200">{coffee.processBg}</span>
            </div>
          </div>

          {/* Гаранция за прясно изпичане */}
          <div className="p-3 rounded-xl bg-stone-900 border border-stone-800 text-xs text-stone-400 flex items-center gap-3">
            <span className="text-xl">🔥</span>
            <div>
              <span className="font-semibold text-stone-200 block">
                Прясно изпечено при поръчка
              </span>
              <span>
                Печем в малки партиди в София за максимална свежест и аромат.
              </span>
            </div>
          </div>
        </div>

                {/* Floating Sticky Bottom Action Bar */}
        <div 
          className="absolute bottom-0 left-0 right-0 bg-zinc-900/95 backdrop-blur-md border-t border-zinc-800 p-4 flex items-center justify-between gap-4 z-40 shadow-2xl"
          style={{ paddingBottom: 'calc(1.25rem + env(safe-area-inset-bottom, 20px))' }}
        >
          <div>
            <span className="text-[11px] text-stone-400 block font-medium">
              {size === '250g' ? 'Пакет 250g' : 'Пакет 1kg'} · {selectedGrindObj.nameBg}
            </span>
            <div className="text-lg font-bold font-mono text-amber-300">
              {price.toFixed(2)} {currency === 'EUR' ? '€' : 'лв'}
            </div>
          </div>

          <button
            type="button"
            onClick={handleAdd}
            className={`min-h-[48px] px-6 rounded-xl font-semibold text-sm flex items-center gap-2 transition-all shadow-lg active:scale-95 cursor-pointer ${
              added
                ? 'bg-emerald-600 text-white'
                : 'bg-amber-600 hover:bg-amber-500 text-white shadow-amber-900/30'
            }`}
          >
            {added ? (
              <>
                <Check className="w-4 h-4" />
                <span>Добавено в количката!</span>
              </>
            ) : (
              <>
                <span>🛒 Добави в количката — {price.toFixed(2)} {currency === 'EUR' ? '€' : 'лв'} &gt;</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
