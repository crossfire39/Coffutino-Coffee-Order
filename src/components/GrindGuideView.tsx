import React, { useState } from 'react';
import { GRIND_OPTIONS, GRINDS_IMAGE, COFFEE_SORTS } from '../data/coffeeData';
import { CoffeeSort, CoffeeSize, GrindId } from '../types';
import { Droplets, Thermometer } from 'lucide-react';

interface GrindGuideViewProps {
  currency: 'EUR' | 'BGN';
  onSelectCoffee: (coffee: CoffeeSort) => void;
  onAddToCart: (coffee: CoffeeSort, size: CoffeeSize, grind: GrindId) => void;
}

export const GrindGuideView: React.FC<GrindGuideViewProps> = ({
  currency,
  onSelectCoffee,
  onAddToCart
}) => {
  const [selectedGrindId, setSelectedGrindId] = useState<GrindId>('espresso');

  const selectedGrind = GRIND_OPTIONS.find((g) => g.id === selectedGrindId) || GRIND_OPTIONS[0];

  // Coffee recommendations based on brew method
  const getRecommendedCoffees = (grindId: GrindId): CoffeeSort[] => {
    switch (grindId) {
      case 'espresso':
      case 'moka':
        return COFFEE_SORTS.filter(c => c.id === 'coffutino-fusion-blend' || c.id === 'brazil-san-rafael' || c.id === 'colombia-supremo');
      case 'filter':
        return COFFEE_SORTS.filter(c => c.id === 'ethiopia-yirgacheffe-halo' || c.id === 'peru-anas-blue' || c.id === 'el-salvador-liquidambar');
      case 'french_press':
        return COFFEE_SORTS.filter(c => c.id === 'brazil-san-rafael' || c.id === 'colombia-decaf-specialty' || c.id === 'coffutino-fusion-blend');
      case 'turkish':
        return COFFEE_SORTS.filter(c => c.id === 'colombia-supremo' || c.id === 'coffutino-fusion-blend');
      default:
        return COFFEE_SORTS.slice(0, 3);
    }
  };

  const recommendedCoffees = getRecommendedCoffees(selectedGrindId);

  return (
    <div className="p-4 space-y-6 pb-24">
      {/* Банер за наръчника по смилане */}
      <div className="relative rounded-2xl overflow-hidden border border-stone-800 bg-stone-900">
        <img
          src={GRINDS_IMAGE}
          alt="Сравнение на видовете смилане"
          referrerPolicy="no-referrer"
          className="w-full h-40 object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#141211] via-[#141211]/60 to-transparent" />
        <div className="absolute bottom-3 left-4 right-4">
          <span className="text-[11px] font-bold text-amber-400 uppercase tracking-widest block mb-0.5">
            Бариста наръчник Coffutino
          </span>
          <h2 className="text-xl font-bold font-display text-white">
            Прецизно смилане за вашия уред
          </h2>
          <p className="text-xs text-stone-300 mt-1 line-clamp-2">
            Всяко кафе се мели на професионални мелачки Mahlkönig непосредствено преди херметично опаковане с еднопосочна клапа.
          </p>
        </div>
      </div>

      {/* Селектор на видовете смилане */}
      <div>
        <label className="text-xs font-semibold text-stone-400 uppercase tracking-wider block mb-2.5">
          Изберете начин на приготвяне
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {GRIND_OPTIONS.map((item) => {
            const isSelected = selectedGrindId === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setSelectedGrindId(item.id)}
                className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-amber-950/60 border-amber-500 text-amber-100 shadow-md ring-1 ring-amber-500/40'
                    : 'bg-stone-900/60 border-stone-800 text-stone-400 hover:text-stone-200'
                }`}
              >
                <div className="font-semibold text-xs text-stone-100 truncate">
                  {item.nameBg}
                </div>
                <div className="text-[10px] text-stone-400 truncate mt-0.5">
                  {item.brewMethodBg}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Детайли за избраното смилане */}
      <div className="p-4 rounded-2xl bg-stone-900/80 border border-stone-800 space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-stone-100">
              {selectedGrind.nameBg}
            </h3>
            <span className="text-xs text-amber-400 font-mono">
              {selectedGrind.particleSize}
            </span>
          </div>
          <span className="text-xs px-2.5 py-1 rounded-md bg-stone-800 text-stone-300 font-medium">
            {selectedGrind.subBg}
          </span>
        </div>

        <p className="text-xs text-stone-300 leading-relaxed bg-black/30 p-3 rounded-xl border border-stone-800/80">
          {selectedGrind.descriptionBg}
        </p>

        {/* Параметри за извличане */}
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="p-2.5 rounded-xl bg-stone-950/60 border border-stone-800/60">
            <span className="text-stone-400 block text-[11px] flex items-center gap-1 mb-0.5">
              <Droplets className="w-3.5 h-3.5 text-amber-500" />
              Пропорция кафе/вода
            </span>
            <span className="font-semibold text-stone-200 font-mono">
              {selectedGrind.recommendedRatio}
            </span>
          </div>

          <div className="p-2.5 rounded-xl bg-stone-950/60 border border-stone-800/60">
            <span className="text-stone-400 block text-[11px] flex items-center gap-1 mb-0.5">
              <Thermometer className="w-3.5 h-3.5 text-amber-500" />
              Температура на водата
            </span>
            <span className="font-semibold text-stone-200 font-mono">
              {selectedGrind.waterTemp}
            </span>
          </div>
        </div>

        <div className="pt-2 text-[11px] text-stone-400">
          <span className="font-semibold text-stone-300">Идеален за:</span> {selectedGrind.idealFor}
        </div>
      </div>

      {/* Препоръчани сортове кафе за това смилане */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-xs font-semibold text-stone-400 uppercase tracking-wider">
            Препоръчани сортове за {selectedGrind.nameBg}
          </h3>
        </div>

        <div className="space-y-2.5">
          {recommendedCoffees.map((coffee) => {
            const price250 = currency === 'EUR' ? coffee.price250g : coffee.price250gBgn;

            return (
              <div
                key={coffee.id}
                onClick={() => onSelectCoffee(coffee)}
                className="p-3.5 rounded-xl bg-stone-900/60 border border-stone-800 hover:border-amber-700/50 transition-all cursor-pointer flex items-center justify-between gap-3 group"
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{coffee.flag}</span>
                  <div>
                    <h4 className="text-sm font-bold text-stone-100 group-hover:text-amber-200 transition-colors font-display">
                      {coffee.name}
                    </h4>
                    <span className="text-[11px] text-stone-400 block">
                      {coffee.originBg} · SCA {coffee.scaScore}
                    </span>
                    <div className="flex gap-1 mt-1">
                      {coffee.tastingNotesBg.slice(0, 2).map((t, idx) => (
                        <span key={idx} className="text-[10px] bg-stone-800 text-stone-300 px-1.5 py-0.5 rounded">
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="text-right flex flex-col items-end gap-1.5">
                  <div className="text-xs font-mono font-bold text-amber-300">
                    {price250.toFixed(2)} {currency === 'EUR' ? '€' : 'лв'} <span className="text-[10px] text-stone-500 font-normal">/ 250г</span>
                  </div>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onAddToCart(coffee, '250g', selectedGrindId);
                    }}
                    className="px-2.5 py-1 rounded-lg bg-amber-600 hover:bg-amber-500 text-white text-[11px] font-semibold flex items-center gap-1 active:scale-95 cursor-pointer"
                  >
                    <span>+ 250г</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
