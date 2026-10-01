import React, { useState } from 'react';
import { CoffeeSort, CoffeeSize, GrindId } from '../types';
import { GRIND_OPTIONS } from '../data/coffeeData';
import { Plus, Check, SlidersHorizontal, Sparkles } from 'lucide-react';

interface CoffeeCardProps {
  coffee: CoffeeSort;
  currency: 'EUR' | 'BGN';
  onAddToCart: (coffee: CoffeeSort, size: CoffeeSize, grind: GrindId) => void;
  onOpenDetails: (coffee: CoffeeSort) => void;
}

export const CoffeeCard: React.FC<CoffeeCardProps> = ({
  coffee,
  currency,
  onAddToCart,
  onOpenDetails
}) => {
  const [selectedSize, setSelectedSize] = useState<CoffeeSize>('250g');
  const [selectedGrind, setSelectedGrind] = useState<GrindId>('whole_bean');
  const [isAddedRecently, setIsAddedRecently] = useState<boolean>(false);

  const currentPrice = selectedSize === '250g'
    ? (currency === 'EUR' ? coffee.price250g : coffee.price250gBgn)
    : (currency === 'EUR' ? coffee.price1kg : coffee.price1kgBgn);

  const handleAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    onAddToCart(coffee, selectedSize, selectedGrind);
    setIsAddedRecently(true);
    setTimeout(() => setIsAddedRecently(false), 1400);
  };

  return (
    <article
      onClick={() => onOpenDetails(coffee)}
      className="group relative bg-[#1c1917]/90 rounded-2xl border border-stone-800/90 overflow-hidden shadow-sm hover:border-amber-700/50 hover:shadow-lg hover:shadow-amber-950/20 transition-all cursor-pointer flex flex-col active:scale-[0.99]"
    >
      {/* Снимка на пакета кафе */}
      <div className="relative h-48 w-full bg-[#1c1917] overflow-hidden">
        <img
          src={coffee.image}
          alt={coffee.name}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500 ease-out"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#1c1917] via-transparent to-black/30" />

        {/* Произход и SCA точки */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
          <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-black/60 backdrop-blur-md text-[11px] font-medium text-stone-200 border border-white/10">
            <span>{coffee.flag}</span>
            <span>{coffee.originBg}</span>
          </span>

          <span className="flex items-center gap-1 px-2 py-1 rounded-lg bg-amber-950/80 backdrop-blur-md text-[11px] font-bold text-amber-300 border border-amber-500/30">
            <Sparkles className="w-3 h-3 text-amber-400" />
            <span>SCA {coffee.scaScore.toFixed(1)}</span>
          </span>
        </div>

        {/* Степен на изпичане */}
        <div className="absolute bottom-2.5 left-3 text-[11px] font-medium text-amber-200/90 tracking-wide">
          {coffee.roastLevelBg}
        </div>
      </div>

      {/* Тяло на картата */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          {/* Име и подзаглавие */}
          <div className="flex items-start justify-between gap-2">
            <div>
              <h3 className="text-lg font-bold text-stone-100 font-display leading-tight group-hover:text-amber-200 transition-colors">
                {coffee.name}
              </h3>
              <p className="text-xs text-stone-400 mt-0.5">
                {coffee.subnameBg}
              </p>
            </div>
          </div>

          {/* Вкусови нотки */}
          <div className="mt-2.5 flex flex-wrap gap-1">
            {coffee.tastingNotesBg.map((note, idx) => (
              <span
                key={idx}
                className="text-[11px] px-2 py-0.5 rounded-md bg-stone-800/80 text-stone-300 border border-stone-700/50"
              >
                {note}
              </span>
            ))}
          </div>

          {/* Избор на грамаж (250г / 1кг) */}
          <div
            className="mt-3.5 pt-3 border-t border-stone-800/80 flex items-center justify-between gap-2"
            onClick={(e) => e.stopPropagation()}
          >
            <span className="text-[11px] font-medium text-stone-400">
              Грамаж:
            </span>
            <div className="flex items-center bg-stone-900/90 p-0.5 rounded-lg border border-stone-800">
              <button
                type="button"
                onClick={() => setSelectedSize('250g')}
                className={`px-3 py-1 rounded-md text-xs font-semibold transition-all cursor-pointer ${
                  selectedSize === '250g'
                    ? 'bg-amber-600 text-white shadow-sm'
                    : 'text-stone-400 hover:text-stone-200'
                }`}
              >
                250г
              </button>
              <button
                type="button"
                onClick={() => setSelectedSize('1kg')}
                className={`px-3 py-1 rounded-md text-xs font-semibold transition-all cursor-pointer ${
                  selectedSize === '1kg'
                    ? 'bg-amber-600 text-white shadow-sm'
                    : 'text-stone-400 hover:text-stone-200'
                }`}
              >
                1кг
              </button>
            </div>
          </div>

          {/* Избор на смилане */}
          <div
            className="mt-2 flex items-center justify-between gap-2 text-xs"
            onClick={(e) => e.stopPropagation()}
          >
            <span className="text-[11px] font-medium text-stone-400 flex items-center gap-1">
              <SlidersHorizontal className="w-3 h-3 text-amber-500" />
              <span>Смилане:</span>
            </span>

            <select
              value={selectedGrind}
              onChange={(e) => setSelectedGrind(e.target.value as GrindId)}
              className="bg-stone-900 border border-stone-700/70 text-stone-200 text-xs rounded-lg px-2 py-1 max-w-[170px] truncate focus:outline-none focus:border-amber-500 cursor-pointer"
            >
              {GRIND_OPTIONS.map((g) => (
                <option key={g.id} value={g.id} className="bg-stone-900 text-stone-200">
                  {g.nameBg}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Цена и бутон за поръчка */}
        <div className="mt-4 pt-3 border-t border-stone-800/80 flex items-center justify-between">
          <div>
            <div className="flex items-baseline gap-1 font-mono">
              <span className="text-xl font-bold text-amber-300">
                {currentPrice.toFixed(2)}
              </span>
              <span className="text-xs font-semibold text-stone-400">
                {currency === 'EUR' ? '€' : 'лв'}
              </span>
            </div>
            <span className="text-[10px] text-stone-500 block">
              {selectedSize === '250g' ? '~15 чаши кафе' : '~65 чаши кафе'}
            </span>
          </div>

          <button
            type="button"
            onClick={handleAdd}
            className={`min-h-[44px] px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all shadow-md active:scale-95 cursor-pointer ${
              isAddedRecently
                ? 'bg-emerald-600 text-white'
                : 'bg-amber-600 hover:bg-amber-500 text-white shadow-amber-900/20'
            }`}
          >
            {isAddedRecently ? (
              <>
                <Check className="w-4 h-4 animate-bounce" />
                <span>Добавено</span>
              </>
            ) : (
              <>
                <Plus className="w-4 h-4" />
                <span>Поръчай</span>
              </>
            )}
          </button>
        </div>
      </div>
    </article>
  );
};
