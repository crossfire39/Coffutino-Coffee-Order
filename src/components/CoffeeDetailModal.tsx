import React, { useState } from 'react';
import { CoffeeSort, CoffeeSize, GrindId } from '../types';
import { GRIND_OPTIONS } from '../data/coffeeData';
import { X, Sparkles, Check, ChevronRight, Mountain, ShieldCheck, Scale } from 'lucide-react';

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
    setTimeout(() => {
      setAdded(false);
      onClose();
    }, 900);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/75 backdrop-blur-md transition-all animate-in fade-in duration-200">
      <div
        className="w-full max-w-lg bg-[#181615] rounded-t-[32px] sm:rounded-3xl border border-stone-800 shadow-2xl flex flex-col max-h-[90vh] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* iOS Drag Handle */}
        <div className="w-full pt-3 pb-1 flex justify-center sm:hidden">
          <div className="w-10 h-1.5 bg-stone-700 rounded-full" />
        </div>

        {/* Modal Header */}
        <div className="px-5 py-3 border-b border-stone-800/80 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xl">{coffee.flag}</span>
            <span className="text-xs uppercase tracking-wider font-semibold text-amber-400">
              {coffee.originBg}
            </span>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-stone-800 flex items-center justify-center text-stone-400 hover:text-white transition-colors cursor-pointer"
            aria-label="Затвори"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="overflow-y-auto p-5 space-y-5 text-stone-200 no-scrollbar">
          {/* Top Banner / Image */}
          <div className="relative h-56 w-full rounded-2xl overflow-hidden border border-stone-800 bg-[#161413]">
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
              <div className="px-3 py-1 rounded-xl bg-amber-950/80 backdrop-blur-md border border-amber-500/40 text-xs font-bold text-amber-300 flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5" />
                <span>SCA {coffee.scaScore.toFixed(1)}</span>
              </div>
            </div>
          </div>

          {/* Вкусов профил и нотки */}
          <div>
            <h4 className="text-xs font-semibold text-stone-400 uppercase tracking-wider mb-2">
              Вкусов профил и нотки
            </h4>
            <div className="flex flex-wrap gap-1.5">
              {coffee.tastingNotesBg.map((note, i) => (
                <span
                  key={i}
                  className="px-2.5 py-1 rounded-lg bg-amber-950/40 text-amber-200 border border-amber-700/40 text-xs font-medium"
                >
                  {note}
                </span>
              ))}
            </div>
          </div>

          {/* Описание */}
          <p className="text-sm leading-relaxed text-stone-300 bg-stone-900/60 p-3.5 rounded-xl border border-stone-800/80">
            {coffee.descriptionBg}
          </p>

          {/* Характеристики на произхода */}
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="p-3 rounded-xl bg-stone-900/80 border border-stone-800">
              <span className="text-stone-400 block mb-1 flex items-center gap-1">
                <Mountain className="w-3.5 h-3.5 text-amber-500" />
                Надморска височина
              </span>
              <span className="font-semibold text-stone-200">{coffee.altitude}</span>
            </div>

            <div className="p-3 rounded-xl bg-stone-900/80 border border-stone-800">
              <span className="text-stone-400 block mb-1 flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-amber-500" />
                Обработка
              </span>
              <span className="font-semibold text-stone-200">
                {coffee.processBg}
              </span>
            </div>
          </div>

          {/* Сензорен баланс */}
          <div className="p-3.5 rounded-xl bg-stone-900/80 border border-stone-800 space-y-2.5 text-xs">
            <h4 className="font-semibold text-stone-300">
              Сензорен баланс
            </h4>
            
            {/* Киселинност */}
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-stone-400">Киселинност</span>
                <span className="text-stone-300 font-mono">{coffee.acidity}/5</span>
              </div>
              <div className="w-full bg-stone-800 h-2 rounded-full overflow-hidden">
                <div
                  className="bg-amber-500 h-full rounded-full transition-all duration-500"
                  style={{ width: `${(coffee.acidity / 5) * 100}%` }}
                />
              </div>
            </div>

            {/* Тяло / Плътност */}
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-stone-400">Тяло / Плътност</span>
                <span className="text-stone-300 font-mono">{coffee.body}/5</span>
              </div>
              <div className="w-full bg-stone-800 h-2 rounded-full overflow-hidden">
                <div
                  className="bg-amber-600 h-full rounded-full transition-all duration-500"
                  style={{ width: `${(coffee.body / 5) * 100}%` }}
                />
              </div>
            </div>

            {/* Сладост */}
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-stone-400">Сладост</span>
                <span className="text-stone-300 font-mono">{coffee.sweetness}/5</span>
              </div>
              <div className="w-full bg-stone-800 h-2 rounded-full overflow-hidden">
                <div
                  className="bg-amber-400 h-full rounded-full transition-all duration-500"
                  style={{ width: `${(coffee.sweetness / 5) * 100}%` }}
                />
              </div>
            </div>
          </div>

          {/* ИЗБОР НА ГРАМАЖ (250г или 1кг) */}
          <div>
            <h4 className="text-xs font-semibold text-stone-400 uppercase tracking-wider mb-2 flex items-center justify-between">
              <span>Изберете грамаж</span>
              <span className="text-[11px] text-amber-400 font-normal">
                Запечатано с ароматна клапа
              </span>
            </h4>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setSize('250g')}
                className={`p-3.5 rounded-xl border text-left transition-all relative cursor-pointer ${
                  size === '250g'
                    ? 'bg-amber-950/40 border-amber-500 text-white shadow-md'
                    : 'bg-stone-900/60 border-stone-800 text-stone-400 hover:text-stone-200'
                }`}
              >
                <div className="font-bold text-base text-stone-100 flex items-center justify-between">
                  <span>Пакет 250г</span>
                  {size === '250g' && <Check className="w-4 h-4 text-amber-400" />}
                </div>
                <div className="text-xs text-stone-400 mt-1">
                  Стандартен пакет · ~15 чаши кафе
                </div>
                <div className="text-sm font-bold text-amber-300 font-mono mt-2">
                  {(currency === 'EUR' ? coffee.price250g : coffee.price250gBgn).toFixed(2)} {currency === 'EUR' ? '€' : 'лв'}
                </div>
              </button>

              <button
                type="button"
                onClick={() => setSize('1kg')}
                className={`p-3.5 rounded-xl border text-left transition-all relative cursor-pointer ${
                  size === '1kg'
                    ? 'bg-amber-950/40 border-amber-500 text-white shadow-md'
                    : 'bg-stone-900/60 border-stone-800 text-stone-400 hover:text-stone-200'
                }`}
              >
                <div className="font-bold text-base text-stone-100 flex items-center justify-between">
                  <span>Пакет 1кг</span>
                  {size === '1kg' && <Check className="w-4 h-4 text-amber-400" />}
                </div>
                <div className="text-xs text-stone-400 mt-1">
                  Голям пакет · ~65 чаши кафе
                </div>
                <div className="text-sm font-bold text-amber-300 font-mono mt-2">
                  {(currency === 'EUR' ? coffee.price1kg : coffee.price1kgBgn).toFixed(2)} {currency === 'EUR' ? '€' : 'лв'}
                </div>
              </button>
            </div>
          </div>

          {/* ИЗБОР НА СМИЛАНЕ */}
          <div>
            <h4 className="text-xs font-semibold text-stone-400 uppercase tracking-wider mb-2">
              Как да смелим кафето?
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {GRIND_OPTIONS.map((g) => {
                const isSelected = grind === g.id;
                return (
                  <button
                    key={g.id}
                    type="button"
                    onClick={() => setGrind(g.id)}
                    className={`p-3 rounded-xl border text-left text-xs transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-amber-950/50 border-amber-500 text-amber-100'
                        : 'bg-stone-900/60 border-stone-800 text-stone-400 hover:text-stone-200'
                    }`}
                  >
                    <div className="font-semibold text-stone-200 flex items-center justify-between">
                      <span>{g.nameBg}</span>
                      {isSelected && <Check className="w-3.5 h-3.5 text-amber-400" />}
                    </div>
                    <div className="text-[11px] text-stone-400 mt-0.5">
                      {g.subBg}
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Детайли за избраното смилане */}
            <div className="mt-2.5 p-3 rounded-xl bg-amber-950/20 border border-amber-700/30 text-xs text-amber-200/90 flex items-start gap-2.5">
              <Scale className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold text-amber-300">
                  {selectedGrindObj.brewMethodBg}:
                </span>{' '}
                <span>
                  {selectedGrindObj.descriptionBg}
                </span>
                <span className="block mt-1 text-[11px] text-stone-400">
                  Препоръчителна доза: {selectedGrindObj.recommendedRatio} · {selectedGrindObj.waterTemp}
                </span>
              </div>
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

        {/* Долен фиксиран панел за покупка */}
        <div className="p-4 bg-[#141211] border-t border-stone-800 flex items-center justify-between gap-4">
          <div>
            <span className="text-[11px] text-stone-400 block">
              {size === '250g' ? '250г' : '1кг'} · {selectedGrindObj.nameBg}
            </span>
            <div className="text-xl font-bold font-mono text-amber-300">
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
                <span>Добави в количката</span>
                <ChevronRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
