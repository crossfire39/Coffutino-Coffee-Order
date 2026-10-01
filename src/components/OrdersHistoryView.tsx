import React from 'react';
import { OrderRecord, CartItem } from '../types';
import { formatDateDisplay } from '../data/coffeeData';
import { CalendarClock, RefreshCw, Truck, ExternalLink } from 'lucide-react';

interface OrdersHistoryViewProps {
  orders: OrderRecord[];
  currency: 'EUR' | 'BGN';
  onReorder: (items: CartItem[]) => void;
  onExploreSorts: () => void;
}

export const OrdersHistoryView: React.FC<OrdersHistoryViewProps> = ({
  orders,
  onReorder,
  onExploreSorts
}) => {
  if (orders.length === 0) {
    return (
      <div className="p-6 text-center space-y-4 py-16 flex flex-col items-center justify-center">
        <div className="w-16 h-16 rounded-full bg-stone-900 border border-stone-800 flex items-center justify-center text-amber-500 shadow-inner">
          <CalendarClock className="w-8 h-8" />
        </div>
        <div>
          <h3 className="text-xl font-bold font-display text-stone-200">
            Все още нямате поръчки
          </h3>
          <p className="text-xs text-stone-400 mt-1 max-w-xs mx-auto">
            Когато поръчате кафе от Coffutino, тук ще виждате статуса на изпичане, датата на доставка и товарителницата.
          </p>
        </div>
        <button
          type="button"
          onClick={onExploreSorts}
          className="mt-2 px-5 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-semibold text-xs transition-all shadow-md active:scale-95 cursor-pointer"
        >
          Разгледай 7-те сорта
        </button>
      </div>
    );
  }

  return (
    <div className="p-4 space-y-5 pb-28">
      {/* Заглавие */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold font-display text-stone-100">
            График на изпичане и поръчки
          </h2>
          <p className="text-xs text-stone-400">
            {orders.length} {orders.length === 1 ? 'направена поръчка' : 'направени поръчки'}
          </p>
        </div>
      </div>

      {/* Списък с поръчки */}
      <div className="space-y-4">
        {orders.map((order) => {
          const totalFormatted = order.currency === 'EUR'
            ? `${order.totalEur.toFixed(2)} €`
            : `${order.totalBgn.toFixed(2)} лв`;

          return (
            <div
              key={order.id}
              className="p-4 rounded-2xl bg-stone-900/90 border border-stone-800 space-y-3.5 relative"
            >
              {/* Горен ред на поръчката */}
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold text-amber-300">
                      {order.orderNumber}
                    </span>
                    <span className="text-[10px] text-stone-400 font-mono">
                      {new Date(order.createdAt).toLocaleDateString('bg-BG')}
                    </span>
                  </div>
                  <div className="text-xs font-semibold text-stone-200 mt-1 flex items-center gap-1.5">
                    <Truck className="w-3.5 h-3.5 text-amber-400" />
                    <span>
                      Очаквана доставка:{' '}
                      <strong className="text-amber-200">{formatDateDisplay(order.deliveryDate, 'bg')}</strong>
                    </span>
                  </div>
                </div>

                {/* Етикет за статус */}
                <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-950/80 text-amber-300 border border-amber-500/40">
                  {order.status}
                </span>
              </div>

              {/* Артикули */}
              <div className="pt-2 border-t border-stone-800/80 space-y-1.5">
                {order.items.map((item, idx) => (
                  <div key={idx} className="flex justify-between items-center text-xs">
                    <div className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                      <span className="text-stone-300 font-medium">{item.coffeeName}</span>
                      <span className="text-[10px] text-stone-400">
                        ({item.size === '250g' ? '250г' : '1кг'} · {item.grindName}) × {item.quantity}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Адрес за доставка */}
              <div className="text-[11px] text-stone-400 bg-black/30 p-2.5 rounded-xl border border-stone-800/60">
                <span className="font-semibold text-stone-300 block mb-0.5">
                  Адрес за доставка / Офис на Еконт:
                </span>
                <span>
                  {order.customer.fullName} · {order.customer.phone} · {order.customer.city},{' '}
                  {order.customer.deliveryType === 'courier' ? order.customer.address : order.customer.econtOffice}
                </span>
              </div>

              {/* Долна лента със сума и бутон за повторна поръчка */}
              <div className="pt-2 border-t border-stone-800/80 flex items-center justify-between">
                <div>
                  <span className="text-[11px] text-stone-400 block">
                    Сума за кафе (+ доставка по Еконт)
                  </span>
                  <span className="text-base font-bold font-mono text-stone-100">
                    {totalFormatted}
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => onReorder(order.items)}
                  className="px-3.5 py-1.5 rounded-xl bg-amber-600/20 hover:bg-amber-600 text-amber-300 hover:text-white border border-amber-500/30 text-xs font-semibold flex items-center gap-1.5 transition-all active:scale-95 cursor-pointer"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Повтори поръчката</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Информация за пекарната */}
      <div className="p-4 rounded-2xl bg-stone-900/40 border border-stone-800/80 text-xs text-stone-400 space-y-2">
        <div className="flex items-center justify-between text-stone-300 font-semibold">
          <span>КОФУТИНО ЕООД - Пекарна за специално кафе</span>
          <a
            href="https://www.coffutino.eu"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-amber-400 hover:text-amber-300"
          >
            <span>www.coffutino.eu</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>
        <p className="text-[11px] leading-relaxed">
          Прясно изпечено кафе в София, България. Доставки в цялата страна чрез куриерска мрежа Еконт.
        </p>
      </div>
    </div>
  );
};
