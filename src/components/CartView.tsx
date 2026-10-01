import React from 'react';
import { CartItem, GrindId } from '../types';
import { GRIND_OPTIONS } from '../data/coffeeData';
import { DeliveryDatePicker } from './DeliveryDatePicker';
import { Trash2, Plus, Minus, ArrowRight, ShieldCheck, ShoppingBag } from 'lucide-react';

interface CartViewProps {
  items: CartItem[];
  currency: 'EUR' | 'BGN';
  onUpdateQuantity: (cartItemId: string, delta: number) => void;
  onRemoveItem: (cartItemId: string) => void;
  onUpdateGrind: (cartItemId: string, newGrind: GrindId) => void;
  selectedDate: string;
  onSelectDate: (d: string) => void;
  onProceedToCheckout: () => void;
  onExploreSorts: () => void;
}

export const CartView: React.FC<CartViewProps> = ({
  items,
  currency,
  onUpdateQuantity,
  onRemoveItem,
  onUpdateGrind,
  selectedDate,
  onSelectDate,
  onProceedToCheckout,
  onExploreSorts
}) => {
  // Calculations
  const subtotalEur = items.reduce((sum, item) => sum + item.unitPriceEur * item.quantity, 0);
  const subtotalBgn = items.reduce((sum, item) => sum + item.unitPriceBgn * item.quantity, 0);

  const currentSubtotal = currency === 'EUR' ? subtotalEur : subtotalBgn;

  if (items.length === 0) {
    return (
      <div className="p-6 text-center space-y-5 my-auto py-20 animate-in fade-in">
        <div className="w-20 h-20 rounded-full bg-stone-900 border border-stone-800 text-stone-500 flex items-center justify-center mx-auto shadow-inner">
          <ShoppingBag className="w-10 h-10 text-stone-600" />
        </div>

        <div className="space-y-1">
          <h3 className="text-lg font-bold font-display text-white">
            Вашата количка е празна
          </h3>
          <p className="text-xs text-stone-400 max-w-xs mx-auto">
            Разгледайте нашите 7 прясно изпечени сорта кафе и изберете пакет от 250г или 1кг.
          </p>
        </div>

        <button
          type="button"
          onClick={onExploreSorts}
          className="px-6 py-3 rounded-2xl bg-amber-600 hover:bg-amber-500 text-white font-semibold text-xs transition-colors shadow-lg shadow-amber-900/40 cursor-pointer"
        >
          Разгледай сортовете кафе
        </button>
      </div>
    );
  }

  return (
    <div className="p-4 space-y-4 pb-28">
      {/* Заглавна част */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold font-display text-white">
            Количка с поръчка
          </h2>
          <span className="text-xs text-stone-400">
            {items.reduce((s, i) => s + i.quantity, 0)} пакета прясно изпечено кафе
          </span>
        </div>

        <button
          type="button"
          onClick={onExploreSorts}
          className="text-xs text-amber-400 hover:text-amber-300 font-medium transition-colors cursor-pointer"
        >
          + Добави още
        </button>
      </div>

      {/* Списък с артикули */}
      <div className="space-y-3">
        {items.map((item) => {
          const unitPrice = currency === 'EUR' ? item.unitPriceEur : item.unitPriceBgn;
          const lineTotal = unitPrice * item.quantity;

          return (
            <div
              key={item.cartItemId}
              className="p-3.5 rounded-2xl bg-stone-900/90 border border-stone-800 space-y-3 relative transition-all"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-14 h-14 rounded-xl overflow-hidden bg-stone-950 border border-stone-800 shrink-0">
                    <img
                      src={item.image}
                      alt={item.coffeeName}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-stone-100 font-display">
                      {item.coffeeName}
                    </h4>
                    <span className="text-[11px] text-stone-400 block">
                      {item.origin}
                    </span>

                    {/* Грамаж */}
                    <div className="mt-1 flex items-center gap-1.5">
                      <span className="px-2 py-0.5 rounded-md bg-amber-950/70 text-amber-300 text-[10px] font-bold border border-amber-600/30">
                        {item.size === '250g' ? '250 гр' : '1 кг'}
                      </span>
                      <span className="text-[11px] text-stone-400 font-mono">
                        {unitPrice.toFixed(2)} {currency === 'EUR' ? '€' : 'лв'} / пакет
                      </span>
                    </div>
                  </div>
                </div>

                {/* Бутон за изтриване */}
                <button
                  type="button"
                  onClick={() => onRemoveItem(item.cartItemId)}
                  className="text-stone-500 hover:text-red-400 p-1 transition-colors cursor-pointer"
                  title="Премахни от количката"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              {/* Селектор за смилане на конкретния ред */}
              <div className="pt-2 border-t border-stone-800/80 flex items-center justify-between gap-2 text-xs">
                <span className="text-[11px] text-stone-400 font-medium">
                  Смилане:
                </span>

                <select
                  value={item.grind}
                  onChange={(e) => onUpdateGrind(item.cartItemId, e.target.value as GrindId)}
                  className="bg-stone-950 border border-stone-700/70 text-stone-200 text-xs rounded-lg px-2 py-1 max-w-[190px] truncate focus:outline-none focus:border-amber-500 cursor-pointer"
                >
                  {GRIND_OPTIONS.map((g) => (
                    <option key={g.id} value={g.id} className="bg-stone-900 text-stone-200">
                      {g.nameBg}
                    </option>
                  ))}
                </select>
              </div>

              {/* Бройка и сума на реда */}
              <div className="pt-2 border-t border-stone-800/80 flex items-center justify-between">
                <div className="flex items-center bg-stone-950 rounded-lg border border-stone-800 p-0.5">
                  <button
                    type="button"
                    onClick={() => onUpdateQuantity(item.cartItemId, -1)}
                    className="w-7 h-7 rounded-md flex items-center justify-center text-stone-300 hover:text-white hover:bg-stone-800 transition-colors cursor-pointer"
                    aria-label="Намали бройката"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="w-8 text-center text-xs font-mono font-bold text-stone-200">
                    {item.quantity}
                  </span>
                  <button
                    type="button"
                    onClick={() => onUpdateQuantity(item.cartItemId, 1)}
                    className="w-7 h-7 rounded-md flex items-center justify-center text-stone-300 hover:text-white hover:bg-stone-800 transition-colors cursor-pointer"
                    aria-label="Увеличи бройката"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="text-right">
                  <div className="text-base font-bold font-mono text-amber-300">
                    {lineTotal.toFixed(2)} {currency === 'EUR' ? '€' : 'лв'}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* СЕКЦИЯ ЗА ДАТА НА ПОЛУЧАВАНЕ */}
      <div className="p-4 rounded-2xl bg-stone-900/90 border border-stone-800 space-y-4">
        <DeliveryDatePicker
          selectedDate={selectedDate}
          onSelectDate={onSelectDate}
        />
      </div>

      {/* Обобщение на цените */}
      <div className="p-4 rounded-2xl bg-stone-900/90 border border-stone-800 space-y-2.5 text-xs">
        <h4 className="font-semibold text-stone-300 uppercase tracking-wider text-[11px]">
          Обобщение на поръчката
        </h4>

        <div className="flex justify-between text-stone-400">
          <span>Сума за кафе</span>
          <span className="font-mono text-stone-200 font-semibold">
            {currentSubtotal.toFixed(2)} {currency === 'EUR' ? '€' : 'лв'}
          </span>
        </div>

        <div className="flex justify-between items-center text-stone-400 pt-1">
          <span>Доставка по Еконт</span>
          <span className="text-amber-300 font-medium text-[11px] text-right">
            Заплаща се от клиента при получаване
          </span>
        </div>

        <div className="pt-2 border-t border-stone-800 flex justify-between items-baseline text-sm font-bold text-stone-100">
          <span>Общо за кафето</span>
          <span className="text-xl font-mono text-amber-300">
            {currentSubtotal.toFixed(2)} {currency === 'EUR' ? '€' : 'лв'}
          </span>
        </div>

        <div className="pt-1 text-[11px] text-stone-400 space-y-1">
          <div className="flex items-start gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-amber-500 shrink-0 mt-0.5" />
            <span>
              Клиентът заплаща доставката директно по Еконт. Избор между наложен платеж или банков превод. Без онлайн таксуване.
            </span>
          </div>
        </div>
      </div>

      {/* Главен бутон за преминаване към заявка */}
      <div>
        <button
          type="button"
          onClick={onProceedToCheckout}
          className="w-full min-h-[50px] rounded-2xl bg-amber-600 hover:bg-amber-500 text-white font-semibold text-sm flex items-center justify-center gap-2 transition-all shadow-xl shadow-amber-900/30 active:scale-[0.98] cursor-pointer"
        >
          <span>
            Продължи към заявка за поръчка
          </span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
