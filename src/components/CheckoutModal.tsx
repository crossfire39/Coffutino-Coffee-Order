import React, { useState } from 'react';
import { CartItem, OrderRecord } from '../types';
import { formatDateDisplay } from '../data/coffeeData';
import { ROASTER_EMAIL } from '../utils/orderEmail';
import { X, Check, Truck, Banknote, Building2, MapPin, User, Calendar, AlertCircle, Info, Mail, MessageSquare } from 'lucide-react';
import confetti from 'canvas-confetti';

const WEBHOOK_URL = 'https://hook.us2.make.com/md2sgy9myjtgsveraprj0xiuj20hbyhj';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  currency: 'EUR' | 'BGN';
  selectedDate: string;
  onOrderPlaced: (order: OrderRecord) => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  onClose,
  items,
  currency,
  selectedDate,
  onOrderPlaced
}) => {
  if (!isOpen) return null;

  // Формуляри за контакт на клиента (празни по подразбиране)
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [deliveryType, setDeliveryType] = useState<'courier' | 'econt_office'>('courier');
  const [city, setCity] = useState('');
  const [address, setAddress] = useState('');
  const [econtOffice, setEcontOffice] = useState('');
  
  // ВЪЗМОЖНИ СА САМО ДВЕ: 1. Наложен платеж при получаване, 2. Банково плащане
  const [paymentMethod, setPaymentMethod] = useState<'cod' | 'bank_transfer'>('cod');
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState('');

  // Изчисления: сумата за кафето (доставката по Еконт се заплаща отделно от клиента)
  const subtotalEur = items.reduce((sum, item) => sum + item.unitPriceEur * item.quantity, 0);
  const subtotalBgn = items.reduce((sum, item) => sum + item.unitPriceBgn * item.quantity, 0);

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim() || !phone.trim()) {
      setFormError('Моля, попълнете вашите три имена и телефонен номер.');
      return;
    }
    if (deliveryType === 'courier' && (!city.trim() || !address.trim())) {
      setFormError('Моля, попълнете град и точен адрес за доставка.');
      return;
    }
    if (deliveryType === 'econt_office' && (!city.trim() || !econtOffice.trim())) {
      setFormError('Моля, посочете град и желан офис на Еконт.');
      return;
    }

    setIsSubmitting(true);
    setFormError('');

    const orderNum = `CFT-${Math.floor(10000 + Math.random() * 90000)}`;

    const orderRecord: OrderRecord = {
      id: String(Date.now()),
      orderNumber: orderNum,
      createdAt: new Date().toISOString(),
      deliveryDate: selectedDate,
      items: [...items],
      subtotalEur,
      shippingEur: 0,
      totalEur: subtotalEur,
      subtotalBgn,
      shippingBgn: 0,
      totalBgn: subtotalBgn,
      currency,
      status: 'Планирано изпичане',
      customer: {
        date: selectedDate,
        deliveryType,
        fullName,
        phone,
        email,
        city,
        address: deliveryType === 'courier' ? address : '',
        econtOffice: deliveryType === 'econt_office' ? econtOffice : '',
        specialInstructions: notes,
        paymentMethod
      }
    };

    // 1. Изпращане на данните към Make.com Webhook
    try {
      await fetch(WEBHOOK_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderRecord),
      });
      console.log('Поръчката е изпратена успешно към Make.com');
    } catch (error) {
      console.error('Грешка при изпращане към Webhook:', error);
    }

    // 2. Завършване на поръчката и показване на потвърждение
    setTimeout(() => {
      setIsSubmitting(false);

      // Празнични конфети за потвърждение
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 }
        });
      } catch {
        // Safe fallback
      }

      onOrderPlaced(orderRecord);
    }, 700);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/80 backdrop-blur-md transition-all animate-in fade-in duration-200">
      <div
        className="w-full max-w-lg bg-[#181615] rounded-t-[32px] sm:rounded-3xl border border-stone-800 shadow-2xl flex flex-col max-h-[92vh] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* iOS Drag Handle */}
        <div className="w-full pt-3 pb-1 flex justify-center sm:hidden">
          <div className="w-10 h-1.5 bg-stone-700 rounded-full" />
        </div>

        {/* Заглавна лента */}
        <div className="px-5 py-3.5 border-b border-stone-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Truck className="w-4 h-4 text-amber-500" />
            <h2 className="text-base font-bold font-display text-white">
              Заявка за поръчка на кафе
            </h2>
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

        {/* Формуляр */}
        <form onSubmit={handleSubmitOrder} className="overflow-y-auto p-5 space-y-5 text-stone-200 no-scrollbar">
          {formError && (
            <div className="p-3 rounded-xl bg-red-950/50 border border-red-800 text-xs text-red-200 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
              <span>{formError}</span>
            </div>
          )}

          {/* Важно съобщение: Няма физическо онлайн плащане + доставка по Еконт */}
          <div className="p-3.5 rounded-2xl bg-amber-950/30 border border-amber-600/30 text-xs text-amber-200/90 space-y-2">
            <div className="flex items-start gap-2.5">
              <Info className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold text-amber-300 block">
                  Поръчка без физическо онлайн плащане
                </span>
                <span className="text-[11px] text-stone-300 block mt-0.5">
                  Заявката се изпраща директно към пекарната на <strong className="text-white">КОФУТИНО ЕООД</strong> ({ROASTER_EMAIL}).
                </span>
              </div>
            </div>

            <div className="pt-2 border-t border-amber-800/40 flex items-start gap-2 text-[11px] text-stone-300">
              <MessageSquare className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <span>
                <strong className="text-amber-300 font-medium">Доставка с Еконт:</strong> Клиентът заплаща доставката по Еконт при получаване. Ще получите СМС от Еконт с номер на товарителница, че пратката е пристигнала.
              </span>
            </div>
          </div>

          {/* Банер за избрана дата на получаване */}
          <div className="p-3.5 rounded-2xl bg-stone-900/90 border border-stone-800 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2.5">
              <Calendar className="w-4 h-4 text-amber-400" />
              <div>
                <span className="text-stone-400 block text-[11px]">
                  Дата на получаване:
                </span>
                <span className="font-bold text-amber-200 text-sm">
                  {formatDateDisplay(selectedDate, 'bg')}
                </span>
              </div>
            </div>
            <span className="text-xs font-semibold px-2 py-1 rounded bg-amber-950/80 text-amber-300 border border-amber-600/30">
              Избрана
            </span>
          </div>

          {/* 1. Данни за контакт */}
          <div className="space-y-3">
            <h3 className="text-xs font-semibold text-stone-400 uppercase tracking-wider flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-amber-500" />
              <span>1. Данни за контакт на клиента</span>
            </h3>

            <div>
              <label className="text-[11px] text-stone-400 block mb-1">
                Име и фамилия *
              </label>
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="напр. Александър Иванов"
                className="w-full bg-stone-900 border border-stone-800 rounded-xl px-3.5 py-2.5 text-xs text-stone-100 placeholder:text-stone-600 focus:outline-none focus:border-amber-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-[11px] text-stone-400 block mb-1">
                  Мобилен телефон * (за СМС от Еконт)
                </label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+359 88..."
                  className="w-full bg-stone-900 border border-stone-800 rounded-xl px-3.5 py-2.5 text-xs text-stone-100 placeholder:text-stone-600 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="text-[11px] text-stone-400 block mb-1">
                  Имейл (за потвърждение)
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="alex@example.com"
                  className="w-full bg-stone-900 border border-stone-800 rounded-xl px-3.5 py-2.5 text-xs text-stone-100 placeholder:text-stone-600 focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>
          </div>

          {/* 2. Начин на доставка */}
          <div className="space-y-3">
            <h3 className="text-xs font-semibold text-stone-400 uppercase tracking-wider flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-amber-500" />
              <span>2. Доставка (Еконт)</span>
            </h3>

            {/* Избор куриер или офис */}
            <div className="grid grid-cols-2 gap-2 bg-stone-900 p-1 rounded-xl border border-stone-800">
              <button
                type="button"
                onClick={() => setDeliveryType('courier')}
                className={`py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  deliveryType === 'courier'
                    ? 'bg-amber-600 text-white shadow-sm'
                    : 'text-stone-400 hover:text-stone-200'
                }`}
              >
                Куриер до адрес
              </button>

              <button
                type="button"
                onClick={() => setDeliveryType('econt_office')}
                className={`py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  deliveryType === 'econt_office'
                    ? 'bg-amber-600 text-white shadow-sm'
                    : 'text-stone-400 hover:text-stone-200'
                }`}
              >
                Офис / Еконтомат
              </button>
            </div>

            <div>
              <label className="text-[11px] text-stone-400 block mb-1">
                Град / Населено място
              </label>
              <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="София / Пловдив / Варна..."
                className="w-full bg-stone-900 border border-stone-800 rounded-xl px-3.5 py-2.5 text-xs text-stone-100 placeholder:text-stone-600 focus:outline-none focus:border-amber-500"
              />
            </div>

            {deliveryType === 'courier' ? (
              <div>
                <label className="text-[11px] text-stone-400 block mb-1">
                  Точен адрес за доставка (улица, №, ет, ап)
                </label>
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="бул. Витоша 42, ет. 3, ап. 12"
                  className="w-full bg-stone-900 border border-stone-800 rounded-xl px-3.5 py-2.5 text-xs text-stone-100 placeholder:text-stone-600 focus:outline-none focus:border-amber-500"
                />
              </div>
            ) : (
              <div>
                <label className="text-[11px] text-stone-400 block mb-1">
                  Желан офис на Еконт / Еконтомат
                </label>
                <input
                  type="text"
                  value={econtOffice}
                  onChange={(e) => setEcontOffice(e.target.value)}
                  placeholder="напр. Еконт София - Център, офис 104"
                  className="w-full bg-stone-900 border border-stone-800 rounded-xl px-3.5 py-2.5 text-xs text-stone-100 placeholder:text-stone-600 focus:outline-none focus:border-amber-500"
                />
              </div>
            )}
          </div>

          {/* 3. НАЧИНИ НА ПЛАЩАНЕ: ВЪЗМОЖНИ СА САМО ДВЕ */}
          <div className="space-y-3">
            <h3 className="text-xs font-semibold text-stone-400 uppercase tracking-wider flex items-center gap-1.5">
              <Banknote className="w-3.5 h-3.5 text-amber-500" />
              <span>3. Начин на плащане (само 2 опции)</span>
            </h3>

            <div className="space-y-2">
              {/* Опция 1: Наложен платеж при получаване */}
              <button
                type="button"
                onClick={() => setPaymentMethod('cod')}
                className={`w-full p-3.5 rounded-xl border text-left text-xs transition-all flex items-center justify-between cursor-pointer ${
                  paymentMethod === 'cod'
                    ? 'bg-amber-950/50 border-amber-500 text-white ring-1 ring-amber-500/50'
                    : 'bg-stone-900/60 border-stone-800 text-stone-400 hover:text-stone-200'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-emerald-950/80 border border-emerald-500/30 flex items-center justify-center shrink-0">
                    <Banknote className="w-4 h-4 text-emerald-400" />
                  </div>
                  <div>
                    <span className="font-semibold text-stone-100 text-sm block">
                      1. Наложен платеж при получаване
                    </span>
                    <span className="text-[11px] text-stone-400 block mt-0.5">
                      Заплащате стойността на кафето и доставката на куриера на Еконт при преглед и получаване.
                    </span>
                  </div>
                </div>
                {paymentMethod === 'cod' && <Check className="w-5 h-5 text-amber-400 shrink-0" />}
              </button>

              {/* Опция 2: Банково плащане */}
              <button
                type="button"
                onClick={() => setPaymentMethod('bank_transfer')}
                className={`w-full p-3.5 rounded-xl border text-left text-xs transition-all flex items-center justify-between cursor-pointer ${
                  paymentMethod === 'bank_transfer'
                    ? 'bg-amber-950/50 border-amber-500 text-white ring-1 ring-amber-500/50'
                    : 'bg-stone-900/60 border-stone-800 text-stone-400 hover:text-stone-200'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-amber-950/80 border border-amber-500/30 flex items-center justify-center shrink-0">
                    <Building2 className="w-4 h-4 text-amber-400" />
                  </div>
                  <div>
                    <span className="font-semibold text-stone-100 text-sm block">
                      2. Банково плащане
                    </span>
                    <span className="text-[11px] text-stone-400 block mt-0.5">
                      Превод по банкова сметка на КОФУТИНО ЕООД.
                    </span>
                  </div>
                </div>
                {paymentMethod === 'bank_transfer' && <Check className="w-5 h-5 text-amber-400 shrink-0" />}
              </button>

              {/* Текст с банкови данни при плащане по банков път */}
              {paymentMethod === 'bank_transfer' && (
                <div className="p-3.5 rounded-xl bg-amber-950/40 border border-amber-600/40 text-xs text-stone-200 space-y-2 animate-in fade-in duration-150">
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
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Бележки към пекарната */}
          <div>
            <label className="text-[11px] text-stone-400 block mb-1">
              Специални указания за пекарната или куриера (по избор)
            </label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="напр. За кафемашина с портафилтър 51мм, код за вход..."
              className="w-full bg-stone-900 border border-stone-800 rounded-xl p-3 text-xs text-stone-100 placeholder:text-stone-600 focus:outline-none focus:border-amber-500 resize-none"
            />
          </div>

          {/* Преглед на избраните кафета и размери */}
          <div className="p-3.5 rounded-xl bg-stone-900/90 border border-stone-800 space-y-2">
            <span className="text-[11px] font-semibold text-stone-300 uppercase tracking-wider block">
              Избрани кафета в поръчката ({items.length})
            </span>
            <div className="space-y-1.5">
              {items.map((it) => (
                <div key={it.cartItemId} className="flex justify-between items-center text-xs">
                  <div className="truncate pr-2">
                    <span className="text-stone-200 font-medium">{it.coffeeName}</span>{' '}
                    <span className="text-amber-300 font-bold">({it.size === '250g' ? '250 гр' : '1 кг'})</span>
                    <span className="text-stone-400 text-[10px] block">
                      {it.grindName} × {it.quantity} бр.
                    </span>
                  </div>
                  <span className="font-mono text-stone-200 font-semibold shrink-0">
                    {(it.unitPriceEur * it.quantity).toFixed(2)} €
                  </span>
                </div>
              ))}
            </div>

            <div className="pt-2 border-t border-stone-800 flex justify-between items-center text-xs text-stone-400">
              <span>Доставка с Еконт:</span>
              <span className="text-amber-300 font-medium text-[11px]">
                Заплаща се от клиента при получаване
              </span>
            </div>

            <div className="pt-2 border-t border-stone-800 flex justify-between items-baseline text-xs">
              <span className="text-stone-300 font-medium">Общо за кафето:</span>
              <span className="text-base font-bold font-mono text-amber-300">
                {subtotalEur.toFixed(2)} €
              </span>
            </div>
          </div>

          {/* Бутон за изпращане */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full min-h-[50px] rounded-xl bg-amber-600 hover:bg-amber-500 disabled:opacity-60 text-white font-semibold text-sm flex items-center justify-center gap-2 transition-all shadow-lg active:scale-95 cursor-pointer"
            >
              {isSubmitting ? (
                <span>Генериране и изпращане на поръчката...</span>
              ) : (
                <>
                  <Mail className="w-4 h-4" />
                  <span>
                    Изпрати поръчката ({subtotalEur.toFixed(2)} €)
                  </span>
                </>
              )}
            </button>
            <span className="text-[10px] text-stone-500 text-center block mt-1.5">
              * Заявката се изпраща към {ROASTER_EMAIL}. Клиентът заплаща доставката по Еконт.
            </span>
          </div>
        </form>
      </div>
    </div>
  );
};