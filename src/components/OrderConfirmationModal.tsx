import React from 'react';
import { OrderRecord, CoffeeSubscription } from '../types';
import { formatDateDisplay } from '../data/coffeeData';
import { CheckCircle2, Calendar, Truck, ArrowRight, MessageSquare, Banknote, Building2, Repeat, CalendarDays, ShieldCheck } from 'lucide-react';

interface OrderConfirmationModalProps {
  order: OrderRecord | CoffeeSubscription | null;
  onClose: () => void;
  onViewOrders: () => void;
  onViewSubscription?: () => void;
}

export const OrderConfirmationModal: React.FC<OrderConfirmationModalProps> = ({
  order,
  onClose,
  onViewOrders,
  onViewSubscription
}) => {
  if (!order) return null;

  const isSubscription = (order as any).subscriptionNumber !== undefined;
  const orderNum = isSubscription ? (order as CoffeeSubscription).subscriptionNumber : (order as OrderRecord).orderNumber;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div
        className="w-full max-w-md bg-[#181615] rounded-3xl border border-stone-800 shadow-2xl p-6 space-y-5 text-stone-200 max-h-[90vh] overflow-y-auto no-scrollbar"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Заглавие с потвърждение */}
        <div className="text-center space-y-2">
          <div className="w-16 h-16 rounded-full bg-emerald-950/80 border border-emerald-500/40 text-emerald-400 flex items-center justify-center mx-auto shadow-lg shadow-emerald-950/50">
            {isSubscription ? <Repeat className="w-8 h-8 text-emerald-400 animate-spin-slow" /> : <CheckCircle2 className="w-8 h-8" />}
          </div>
          <span className="text-xs font-mono uppercase tracking-widest text-amber-400 font-bold block">
            {orderNum}
          </span>
          <h2 className="text-xl font-bold font-display text-white">
            {isSubscription ? 'Абонаментът е създаден успешно!' : 'Поръчката е приета успешно!'}
          </h2>
          <p className="text-xs text-stone-400 max-w-xs mx-auto">
            {isSubscription 
              ? 'Вашата месечна абонаментна заявка за прясно изпечено кафе е изпратена към Make.com.'
              : 'Вашата поръчка за прясно кафе е изпратена към пекарната на КОФУТИНО ЕООД.'
            }
          </p>
        </div>

        {/* Начин на плащане и доставка по Еконт */}
        <div className="p-3.5 rounded-2xl bg-stone-900/90 border border-stone-800 text-xs space-y-2.5">
          <div className="flex items-center gap-2 text-stone-300 font-semibold">
            {isSubscription || order.customer.paymentMethod === 'cod' ? (
              <Banknote className="w-4 h-4 text-emerald-400" />
            ) : (
              <Building2 className="w-4 h-4 text-amber-400" />
            )}
            <span>
              Начин на плащане:{' '}
              <strong className="text-amber-300 font-medium">
                {isSubscription || order.customer.paymentMethod === 'cod'
                  ? '1. Наложен платеж при получаване'
                  : '2. Банково плащане'}
              </strong>
            </span>
          </div>

          {isSubscription ? (
            <div className="p-2.5 rounded-xl bg-emerald-950/30 border border-emerald-500/30 space-y-1.5 text-stone-300">
              <div className="flex justify-between items-baseline font-semibold text-xs">
                <span>Дължимо днес:</span>
                <span className="text-emerald-400 font-mono text-sm">0.00 €</span>
              </div>
              <p className="text-[11px] text-stone-400 leading-normal">
                Няма таксуване днес. Дължимата сума се заплаща на куриера на Еконт само при физическа доставка всеки месец.
              </p>
            </div>
          ) : order.customer.paymentMethod === 'cod' ? (
            <p className="text-[11px] text-stone-400 pl-6">
              Заплащате стойността на кафето ({order.subtotalEur.toFixed(2)} €) и доставката на куриера на Еконт при получаване.
            </p>
          ) : (
            <div className="p-3 rounded-xl bg-amber-950/40 border border-amber-600/40 text-xs text-stone-200 space-y-2">
              <p className="text-[11px] leading-relaxed text-amber-100/90">
                Възможно е и плащане по банков път, като за целта клиента заплаща по банкова сметка на Кофутино ЕООД избраното/ите кафета и в условията за плащане посочва номера на поръчката.
              </p>
              <div className="p-2.5 rounded-lg bg-black/50 border border-stone-800/80 font-mono text-[11px] space-y-1 text-stone-300">
                <div>
                  <span className="text-stone-400 font-sans">БАНКОВА СМЕТКА: </span>
                  <strong className="text-amber-300 font-bold select-all">BG85UNCR70001525296865</strong>
                  <span className="text-stone-400 font-sans"> – Уникредит Булбанк АД.</span>
                </div>
                <div>
                  <span className="text-stone-400 font-sans">BIC: </span>
                  <strong className="text-amber-300 font-bold select-all">UNCRBGSF</strong>
                </div>
                <div className="pt-1 text-[11px] text-amber-200 font-sans">
                  Основание за плащане: <strong className="font-mono text-amber-300 font-bold">{orderNum}</strong> (Сума: {order.subtotalEur.toFixed(2)} €)
                </div>
              </div>
            </div>
          )}

          <div className="pt-2 border-t border-stone-800 flex items-start gap-2 text-[11px] text-stone-300 pl-1">
            <MessageSquare className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <span>
              <strong className="text-amber-300 font-medium">СМС от Еконт:</strong> Ще получите СМС от Еконт за пристигналата пратка. Доставката се заплаща по тарифата на Еконт.
            </span>
          </div>
        </div>

        {/* График на доставките */}
        <div className="p-3.5 rounded-2xl bg-stone-900/90 border border-stone-800 space-y-2">
          <div className="flex items-center gap-2 text-amber-300 font-semibold text-xs uppercase tracking-wider">
            {isSubscription ? <CalendarDays className="w-4 h-4 text-amber-400" /> : <Calendar className="w-4 h-4 text-amber-400" />}
            <span>{isSubscription ? 'Ежемесечен график на изпращане' : 'Дата на получаване'}</span>
          </div>

          <div className="flex items-baseline justify-between">
            <span className="text-base font-bold text-white font-mono">
              {isSubscription ? (
                <>
                  {(order as CoffeeSubscription).preferredDispatchDay === '1' && '1-во число на месеца'}
                  {(order as CoffeeSubscription).preferredDispatchDay === '10' && '10-то число на месеца'}
                  {(order as CoffeeSubscription).preferredDispatchDay === '15' && '15-то число на месеца'}
                  {(order as CoffeeSubscription).preferredDispatchDay === '20' && '20-то число на месеца'}
                  {(order as CoffeeSubscription).preferredDispatchDay === 'first_monday' && 'Всеки първи понеделник'}
                </>
              ) : (
                formatDateDisplay((order as OrderRecord).deliveryDate, 'bg')
              )}
            </span>
            <span className="text-xs text-amber-300 font-medium">
              Прясно изпечено
            </span>
          </div>

          <div className="text-[11px] text-stone-300 pt-1.5 border-t border-stone-800 flex items-center gap-1.5">
            <Truck className="w-3.5 h-3.5 text-amber-400 shrink-0" />
            <span>
              {order.customer.deliveryType === 'courier'
                ? `${order.customer.city}, ${order.customer.address}`
                : `${order.customer.city} (${order.customer.econtOffice})`}
            </span>
          </div>
        </div>

        {/* Опаковки в поръчката (250 гр или 1 кг) */}
        <div className="space-y-2">
          <h4 className="text-xs font-semibold text-stone-400 uppercase tracking-wider">
            Избрани кафета и опаковки ({order.items.length})
          </h4>
          <div className="space-y-1.5">
            {order.items.map((it, idx) => (
              <div key={idx} className="p-2.5 rounded-xl bg-stone-900 border border-stone-800 flex justify-between items-center text-xs">
                <div>
                  <span className="font-bold text-stone-200 block">{it.coffeeName}</span>
                  <span className="text-[11px] text-stone-400">
                    Опаковка: <strong className="text-amber-300 font-semibold">{it.size === '250g' ? '250 гр' : '1 кг'}</strong> · {it.grind === 'whole_bean' ? 'на зърна' : `смляно (${it.grindName})`} × {it.quantity} бр.
                  </span>
                </div>
                <span className="font-mono font-semibold text-amber-300">
                  {(it.unitPriceEur * it.quantity).toFixed(2)} €
                </span>
              </div>
            ))}
          </div>

          <div className="p-2.5 rounded-xl bg-black/40 border border-stone-800/80 flex justify-between items-center text-xs">
            <span className="text-stone-400 font-medium">{isSubscription ? 'Прогнозна сума за кафе / мес.' : 'Сума за кафето:'}</span>
            <span className="font-mono font-bold text-amber-300 text-sm">
              {order.subtotalEur.toFixed(2)} €
            </span>
          </div>
        </div>

        {/* Бутони в залепен футър */}
        <div className="sticky bottom-0 bg-[#181615] pt-3 pb-[calc(1rem+env(safe-area-inset-bottom))] border-t border-stone-800/80 z-20 space-y-2 shadow-2xl mt-4 -mx-6 -mb-6 px-6">
          {isSubscription ? (
            <button
              type="button"
              onClick={() => {
                onClose();
                if (onViewSubscription) onViewSubscription();
              }}
              className="w-full min-h-[48px] rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-semibold text-xs flex items-center justify-center gap-1.5 shadow-md active:scale-95 cursor-pointer"
            >
              <span>Управление на моята абонаментна поръчка</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              type="button"
              onClick={() => {
                onClose();
                onViewOrders();
              }}
              className="w-full min-h-[48px] rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-semibold text-xs flex items-center justify-center gap-1.5 shadow-md active:scale-95 cursor-pointer"
            >
              <span>Виж в Моите поръчки</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          )}

          <button
            type="button"
            onClick={onClose}
            className="w-full min-h-[46px] rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-300 font-semibold text-xs active:scale-95 cursor-pointer"
          >
            Продължи към кафетата
          </button>
        </div>
      </div>
    </div>
  );
};
