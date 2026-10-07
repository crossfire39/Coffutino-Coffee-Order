import React, { useState } from 'react';
import { CoffeeSubscription, CartItem, GrindId, CoffeeSort, CoffeeSize } from '../types';
import { COFFEE_SORTS, GRIND_OPTIONS } from '../data/coffeeData';
import { 
  Repeat, Calendar, ShieldCheck, Play, Pause, Trash2, Edit2, 
  Check, X, Plus, Minus, KeyRound, Mail, Phone, MapPin, Sparkles, ShoppingBag, PlusCircle, CalendarDays 
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface SubscriptionViewProps {
  subscriptions: CoffeeSubscription[];
  currency: 'EUR' | 'BGN';
  onUpdateSubscription: (sub: CoffeeSubscription) => void;
  onCancelSubscription: (subId: string) => void;
  onExploreSorts: () => void;
  onCreateSubscriptionFromCart: () => void;
}

export const SubscriptionView: React.FC<SubscriptionViewProps> = ({
  subscriptions,
  currency,
  onUpdateSubscription,
  onCancelSubscription,
  onExploreSorts,
  onCreateSubscriptionFromCart
}) => {
  // Login State to view/manage
  const [phoneOrEmail, setPhoneOrEmail] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loginError, setFormError] = useState('');

  // Editing Subscription Items State
  const [editingSub, setEditingSub] = useState<CoffeeSubscription | null>(null);
  const [editingItems, setEditingItems] = useState<CartItem[]>([]);
  const [editingDispatchDay, setEditingDispatchDay] = useState<string>('15');

  // Add item state during edit
  const [addCoffeeId, setAddCoffeeId] = useState<string>(COFFEE_SORTS[0].id);
  const [addSize, setAddSize] = useState<CoffeeSize>('250g');
  const [addGrind, setAddGrind] = useState<GrindId>('whole_bean');

  // Find subscription by phone/email locally
  const activeSubs = subscriptions.filter(sub => {
    const term = phoneOrEmail.trim().toLowerCase();
    return sub.customer.phone.toLowerCase().includes(term) || 
           sub.customer.email.toLowerCase().includes(term);
  });

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!phoneOrEmail.trim()) {
      setFormError('Моля, въведете вашия телефон или имейл.');
      return;
    }
    
    // Simulate lookup
    const found = subscriptions.some(sub => {
      const term = phoneOrEmail.trim().toLowerCase();
      return sub.customer.phone.toLowerCase().includes(term) || 
             sub.customer.email.toLowerCase().includes(term);
    });

    if (found || subscriptions.length > 0) {
      setIsLoggedIn(true);
      setFormError('');
    } else {
      setFormError('Не бе намерен активен абонамент за тези данни. Уверете се, че сте въвели точните данни от вашата поръчка.');
    }
  };

  const handlePauseToggle = (sub: CoffeeSubscription) => {
    const updatedStatus = sub.status === 'active' ? 'paused' : 'active';
    const updated: CoffeeSubscription = {
      ...sub,
      status: updatedStatus
    };
    onUpdateSubscription(updated);
    
    // Send info to webhook with specific action flag
    triggerWebhookUpdate(updated, 'pause');
  };

  const handleCancelSub = (sub: CoffeeSubscription) => {
    if (!sub) return;

    if (window.confirm('Искате ли да откажете абонамента?')) {
      const updated: CoffeeSubscription = {
        ...sub,
        status: 'canceled'
      };
      onUpdateSubscription(updated);
      triggerWebhookUpdate(updated, 'cancel');
      alert('Абонаментът беше отказан успешно! (Статус: canceled)');
    }
  };

  const startEditing = (sub: CoffeeSubscription) => {
    setEditingSub(sub);
    setEditingItems([...sub.items]);
    setEditingDispatchDay(sub.preferredDispatchDay);
  };

  const cancelEditing = () => {
    setEditingSub(null);
    setEditingItems([]);
  };

  const saveEditing = () => {
    if (!editingSub) return;
    
    const subtotalEur = editingItems.reduce((sum, item) => sum + item.unitPriceEur * item.quantity, 0);
    const subtotalBgn = editingItems.reduce((sum, item) => sum + item.unitPriceBgn * item.quantity, 0);

    const updated: CoffeeSubscription = {
      ...editingSub,
      items: editingItems,
      preferredDispatchDay: editingDispatchDay,
      estimatedSubtotalEur: subtotalEur,
      estimatedTotalEur: subtotalEur,
      subtotalEur,
      totalEur: subtotalEur
    };

    onUpdateSubscription(updated);
    setEditingSub(null);
    setEditingItems([]);

    try {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.8 }
      });
    } catch {}

    triggerWebhookUpdate(updated, 'update');
  };

  // Trigger Make.com Webhook with explicit action format
  const triggerWebhookUpdate = async (sub: CoffeeSubscription, actionType: 'pause' | 'update' | 'cancel') => {
    const payload = {
      id: sub.id,
      subscriptionNumber: sub.subscriptionNumber,
      createdAt: sub.createdAt,
      status: sub.status,
      preferredDispatchDay: sub.preferredDispatchDay,
      currency: sub.currency,
      customer: sub.customer,
      orderType: "MONTHLY_RECURRING",
      action: actionType,
      updatedAt: new Date().toISOString(),
      // Format items detail for Make.com scenario mapping
      selectedCoffees: sub.items.map(it => ({
        coffeeName: it.coffeeName,
        size: it.size === '250g' ? '250g' : '1kg',
        beansOrGround: it.grind === 'whole_bean' ? 'На зърна' : 'Смляно',
        grindType: it.grind === 'whole_bean' ? 'Несмяно (на зърна)' : it.grindName,
        quantity: it.quantity,
        price: (it.unitPriceEur * it.quantity).toFixed(2)
      }))
    };

    try {
      await fetch('https://hook.us2.make.com/md2sgy9myjtgsveraprj0xiuj20hbyhj', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });
      console.log(`Webhook triggered with action: ${actionType}`);
    } catch (err) {
      console.error('Error triggering webhook:', err);
    }
  };

  // Quantity updates during edit
  const updateItemQty = (cartItemId: string, delta: number) => {
    setEditingItems(prev => prev.map(item => {
      if (item.cartItemId === cartItemId) {
        const newQ = item.quantity + delta;
        return newQ > 0 ? { ...item, quantity: newQ } : item;
      }
      return item;
    }));
  };

  // Package weight updates during edit
  const updateItemSize = (cartItemId: string, newSize: CoffeeSize) => {
    const itemToUpdate = editingItems.find(it => it.cartItemId === cartItemId);
    if (!itemToUpdate) return;
    const match = COFFEE_SORTS.find(c => c.id === itemToUpdate.coffeeId);
    if (!match) return;

    const unitPriceEur = newSize === '250g' ? match.price250g : match.price1kg;
    const unitPriceBgn = newSize === '250g' ? match.price250gBgn : match.price1kgBgn;

    setEditingItems(prev => prev.map(item => {
      if (item.cartItemId === cartItemId) {
        return {
          ...item,
          size: newSize,
          unitPriceEur,
          unitPriceBgn
        };
      }
      return item;
    }));
  };

  const removeItem = (cartItemId: string) => {
    setEditingItems(prev => prev.filter(item => item.cartItemId !== cartItemId));
  };

  const updateItemGrind = (cartItemId: string, newGrind: GrindId) => {
    const grindObj = GRIND_OPTIONS.find(g => g.id === newGrind) || GRIND_OPTIONS[0];
    setEditingItems(prev => prev.map(item => {
      if (item.cartItemId === cartItemId) {
        return {
          ...item,
          grind: newGrind,
          grindName: grindObj.nameBg
        };
      }
      return item;
    }));
  };

  // Add coffee sort directly to subscription items
  const handleAddNewCoffeeToEditing = () => {
    const match = COFFEE_SORTS.find(c => c.id === addCoffeeId);
    if (!match) return;

    const grindObj = GRIND_OPTIONS.find(g => g.id === addGrind) || GRIND_OPTIONS[0];
    const unitPriceEur = addSize === '250g' ? match.price250g : match.price1kg;
    const unitPriceBgn = addSize === '250g' ? match.price250gBgn : match.price1kgBgn;

    // Check if item with exact same parameters already exists
    const existingIdx = editingItems.findIndex(
      it => it.coffeeId === addCoffeeId && it.size === addSize && it.grind === addGrind
    );

    if (existingIdx >= 0) {
      setEditingItems(prev => {
        const next = [...prev];
        next[existingIdx] = {
          ...next[existingIdx],
          quantity: next[existingIdx].quantity + 1
        };
        return next;
      });
      return;
    }

    const newItem: CartItem = {
      cartItemId: `${addCoffeeId}_${addSize}_${addGrind}_${Date.now()}`,
      coffeeId: addCoffeeId,
      coffeeName: match.name,
      size: addSize,
      grind: addGrind,
      grindName: grindObj.nameBg,
      quantity: 1,
      unitPriceEur,
      unitPriceBgn,
      image: match.image,
      origin: match.originBg
    };

    setEditingItems(prev => [...prev, newItem]);
  };

  return (
    <div className="p-4 space-y-6 pb-28">
      {/* HEADER BANNER */}
      <div className="p-4 rounded-2xl bg-gradient-to-r from-stone-900 via-amber-950/30 to-stone-900 border border-amber-600/30 space-y-2">
        <div className="flex items-center gap-2">
          <Repeat className="w-5 h-5 text-amber-500 animate-spin-slow" />
          <h2 className="text-lg font-bold font-display text-white">
            Месечна абонаментна заявка
          </h2>
        </div>
        <p className="text-xs text-stone-300 leading-relaxed">
          Вземете любимото си прясно изпечено кафе автоматично всеки месец без предплащане и обвързване. Плащане изключително при доставка по Еконт.
        </p>
      </div>

      {/* RENDER ACTIVE MANAGE INTERFACE OR PROMO */}
      {subscriptions.length > 0 ? (
        <div className="space-y-4">
          {!isLoggedIn ? (
            /* SIMPLE ACCESS GATEWAY */
            <div className="p-5 rounded-2xl bg-stone-900/90 border border-stone-800 space-y-4">
              <div className="flex items-center gap-2 text-stone-200">
                <KeyRound className="w-4 h-4 text-amber-500" />
                <h3 className="text-sm font-bold font-display">
                  Управление на абонамента
                </h3>
              </div>
              <p className="text-xs text-stone-400">
                Въведете мобилния си номер или имейл адрес, за да достъпите, промените или паузирате абонамента си.
              </p>

              <form onSubmit={handleLogin} className="space-y-3">
                {loginError && (
                  <p className="text-xs text-red-400 bg-red-950/40 p-2 rounded-lg border border-red-900/40">
                    {loginError}
                  </p>
                )}
                <div className="flex gap-2">
                  <input
                    type="text"
                    required
                    value={phoneOrEmail}
                    onChange={(e) => setPhoneOrEmail(e.target.value)}
                    placeholder="Телефон (+359...) или Имейл"
                    className="flex-1 bg-stone-950 border border-stone-800 rounded-xl px-3 py-2 text-xs text-stone-100 placeholder:text-stone-600 focus:outline-none focus:border-amber-500"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-semibold text-xs transition-colors cursor-pointer"
                  >
                    Вход
                  </button>
                </div>
              </form>
            </div>
          ) : (
            /* LOGGED IN CLIENT VIEW */
            <div className="space-y-4">
              <div className="flex justify-between items-center text-xs">
                <span className="text-stone-400">
                  Влезли сте като: <strong className="text-stone-200">{phoneOrEmail}</strong>
                </span>
                <button
                  type="button"
                  onClick={() => {
                    setIsLoggedIn(false);
                    setPhoneOrEmail('');
                  }}
                  className="text-amber-500 hover:text-amber-400 font-medium"
                >
                  Изход
                </button>
              </div>

              {activeSubs.length === 0 ? (
                <div className="p-4 rounded-xl bg-stone-900 border border-stone-800 text-center text-xs text-stone-400">
                  Няма намерени абонаменти с този детайл. Опитайте с друг номер или имейл.
                </div>
              ) : (
                activeSubs.map(sub => {
                  const isEditingThis = editingSub?.id === sub.id;
                  const displayTotal = currency === 'EUR' ? sub.estimatedTotalEur : (sub.estimatedTotalEur * 1.95583);

                  return (
                    <div
                      key={sub.id}
                      className="p-5 rounded-2xl bg-stone-900/90 border border-stone-800 space-y-4 relative overflow-hidden"
                    >
                      {/* TOP SUB HEADER */}
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-mono font-bold text-amber-400 bg-amber-950/80 px-2 py-0.5 rounded border border-amber-500/30">
                              {sub.subscriptionNumber}
                            </span>
                            <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${
                              sub.status === 'active' 
                                ? 'bg-emerald-950 text-emerald-400 border border-emerald-500/30' 
                                : sub.status === 'canceled' || sub.status === 'cancelled'
                                ? 'bg-red-950 text-red-400 border border-red-500/30 animate-pulse'
                                : 'bg-stone-800 text-stone-500'
                            }`}>
                              {sub.status === 'active' ? 'Активен' : sub.status === 'canceled' || sub.status === 'cancelled' ? 'Отказан (canceled)' : 'Паузиран'}
                            </span>
                          </div>
                          <span className="text-[10px] text-stone-500 block mt-1">
                            Създаден на {new Date(sub.createdAt).toLocaleDateString('bg-BG')}
                          </span>
                        </div>

                        <span className="text-xs font-mono font-bold text-amber-300">
                          {displayTotal.toFixed(2)} {currency === 'EUR' ? '€' : 'лв'} / мес.
                        </span>
                      </div>

                      {/* EDITING INTERFACE OR STANDARD INTERFACE */}
                      {isEditingThis ? (
                        /* EDITING PRODUCTS AND SETTINGS */
                        <div className="space-y-4 pt-2 border-t border-stone-800 animate-in fade-in">
                          <h4 className="text-xs font-bold text-stone-300 uppercase tracking-wider">Редакция на абонамента</h4>

                          {/* 1. ГРАФИК ЗА ИЗПРАЩАНЕ (ПРОМЯНА НА ДАТАТА) */}
                          <div className="p-3 bg-stone-950 rounded-xl border border-stone-800 space-y-1.5">
                            <label className="text-[11px] text-stone-400 block font-semibold flex items-center gap-1.5">
                              <Calendar className="w-3.5 h-3.5 text-amber-500" />
                              Промяна на датата за изпращане:
                            </label>
                            <select
                              value={editingDispatchDay}
                              onChange={(e) => setEditingDispatchDay(e.target.value)}
                              className="w-full bg-stone-900 border border-stone-800 text-stone-200 text-xs rounded-lg px-2.5 py-2 focus:outline-none focus:border-amber-500 cursor-pointer font-sans"
                            >
                              <option value="1">1-во число от всеки месец</option>
                              <option value="10">10-то число от всеки месец</option>
                              <option value="15">15-то число от всеки месец</option>
                              <option value="20">20-то число от всеки месец</option>
                              <option value="first_monday">Всеки първи понеделник</option>
                            </select>
                          </div>

                          {/* 2. Списък с продукти */}
                          <div className="space-y-2">
                            <span className="text-[10px] font-semibold text-stone-400 uppercase tracking-wider block">
                              Продукти в абонамента:
                            </span>

                            {editingItems.length === 0 ? (
                              <p className="text-xs text-stone-500 italic p-3 bg-stone-950 rounded-xl text-center border border-stone-850">
                                Списъкът е празен. Използвайте формата по-долу за добавяне на кафе.
                              </p>
                            ) : (
                              editingItems.map(item => {
                                const unitPrice = currency === 'EUR' ? item.unitPriceEur : item.unitPriceBgn;
                                return (
                                  <div key={item.cartItemId} className="p-3 bg-stone-950 rounded-xl border border-stone-800 space-y-2">
                                    <div className="flex justify-between items-start">
                                      <div>
                                        <span className="text-xs font-bold text-stone-100 block">{item.coffeeName}</span>
                                        <span className="text-[10px] text-stone-500">{item.origin}</span>
                                      </div>
                                      <button
                                        type="button"
                                        onClick={() => removeItem(item.cartItemId)}
                                        className="text-stone-500 hover:text-red-400 transition-colors p-1"
                                        title="Премахни продукта"
                                      >
                                        <Trash2 className="w-3.5 h-3.5" />
                                      </button>
                                    </div>

                                    <div className="grid grid-cols-2 gap-2 pt-2 border-t border-stone-900 text-xs">
                                      {/* Weight Selector */}
                                      <div className="flex items-center gap-1.5">
                                        <span className="text-[10px] text-stone-400">Грамаж:</span>
                                        <select
                                          value={item.size}
                                          onChange={(e) => updateItemSize(item.cartItemId, e.target.value as CoffeeSize)}
                                          className="bg-stone-900 border border-stone-800 text-stone-200 text-[11px] rounded px-1.5 py-0.5 focus:outline-none focus:border-amber-500"
                                        >
                                          <option value="250g">250 гр</option>
                                          <option value="1kg">1 кг</option>
                                        </select>
                                      </div>

                                      {/* Grind Selector */}
                                      <div className="flex items-center gap-1.5 justify-end">
                                        <span className="text-[10px] text-stone-400">Смилане:</span>
                                        <select
                                          value={item.grind}
                                          onChange={(e) => updateItemGrind(item.cartItemId, e.target.value as GrindId)}
                                          className="bg-stone-900 border border-stone-800 text-stone-200 text-[11px] rounded px-1.5 py-0.5 focus:outline-none focus:border-amber-500 max-w-[100px] truncate"
                                        >
                                          {GRIND_OPTIONS.map(g => (
                                            <option key={g.id} value={g.id}>{g.nameBg}</option>
                                          ))}
                                        </select>
                                      </div>
                                    </div>

                                    {/* Qty Selector and Row Price */}
                                    <div className="flex items-center justify-between pt-1 text-xs">
                                      <span className="text-stone-500 font-mono text-[10px]">
                                        {unitPrice.toFixed(2)} {currency === 'EUR' ? '€' : 'лв'} / бр
                                      </span>

                                      <div className="flex items-center bg-stone-900 rounded-md border border-stone-800 p-0.5">
                                        <button
                                          type="button"
                                          onClick={() => updateItemQty(item.cartItemId, -1)}
                                          className="w-5 h-5 rounded flex items-center justify-center text-stone-400 hover:text-white"
                                        >
                                          <Minus className="w-2.5 h-2.5" />
                                        </button>
                                        <span className="w-6 text-center text-xs font-mono font-bold text-stone-200">
                                          {item.quantity}
                                        </span>
                                        <button
                                          type="button"
                                          onClick={() => updateItemQty(item.cartItemId, 1)}
                                          className="w-5 h-5 rounded flex items-center justify-center text-stone-400 hover:text-white"
                                        >
                                          <Plus className="w-2.5 h-2.5" />
                                        </button>
                                      </div>
                                    </div>
                                  </div>
                                );
                              })
                            )}
                          </div>

                          {/* 3. ДОБАВЯНЕ НА НОВО КАФЕ КЪМ АБОНАМЕНТА (БЕЗЛИМИТНО) */}
                          <div className="p-3.5 bg-stone-950 rounded-xl border border-stone-800/80 space-y-3">
                            <span className="text-[11px] font-bold text-amber-400 flex items-center gap-1.5 uppercase tracking-wider">
                              <PlusCircle className="w-4 h-4" />
                              Добави ново кафе към поръчката
                            </span>

                            <div className="space-y-2">
                              <div>
                                <label className="text-[10px] text-stone-400 block mb-1">Избери сорт кафе:</label>
                                <select
                                  value={addCoffeeId}
                                  onChange={(e) => setAddCoffeeId(e.target.value)}
                                  className="w-full bg-stone-900 border border-stone-800 text-stone-100 text-xs rounded-lg px-2.5 py-2 focus:outline-none"
                                >
                                  {COFFEE_SORTS.map(c => (
                                    <option key={c.id} value={c.id}>{c.name} ({c.originBg})</option>
                                  ))}
                                </select>
                              </div>

                              <div className="grid grid-cols-2 gap-2 text-xs">
                                <div>
                                  <label className="text-[10px] text-stone-400 block mb-1">Опаковка:</label>
                                  <select
                                    value={addSize}
                                    onChange={(e) => setAddSize(e.target.value as CoffeeSize)}
                                    className="w-full bg-stone-900 border border-stone-800 text-stone-100 text-xs rounded-lg px-2.5 py-1.5 focus:outline-none"
                                  >
                                    <option value="250g">250 гр</option>
                                    <option value="1kg">1 кг</option>
                                  </select>
                                </div>

                                <div>
                                  <label className="text-[10px] text-stone-400 block mb-1">Смилане:</label>
                                  <select
                                    value={addGrind}
                                    onChange={(e) => setAddGrind(e.target.value as GrindId)}
                                    className="w-full bg-stone-900 border border-stone-800 text-stone-100 text-xs rounded-lg px-2.5 py-1.5 focus:outline-none"
                                  >
                                    {GRIND_OPTIONS.map(g => (
                                      <option key={g.id} value={g.id}>{g.nameBg}</option>
                                    ))}
                                  </select>
                                </div>
                              </div>

                              <button
                                type="button"
                                onClick={handleAddNewCoffeeToEditing}
                                className="w-full py-2.5 rounded-lg bg-stone-800 hover:bg-stone-700 text-amber-300 font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors border border-stone-700"
                              >
                                <Plus className="w-3.5 h-3.5" />
                                <span>Добави кафе към абонамента</span>
                              </button>
                            </div>
                          </div>

                          {/* 4. ЗАПАЗВАНЕ / ОТКАЗ */}
                          <div className="flex gap-2 pt-2">
                            <button
                              type="button"
                              onClick={saveEditing}
                              className="flex-1 py-3 rounded-2xl bg-amber-600 hover:bg-amber-500 text-white font-semibold text-xs flex items-center justify-center gap-1 cursor-pointer shadow-lg shadow-amber-900/30"
                            >
                              <Check className="w-4 h-4" />
                              <span>Запази промените (update)</span>
                            </button>
                            <button
                              type="button"
                              onClick={cancelEditing}
                              className="py-3 px-4 rounded-2xl bg-stone-800 hover:bg-stone-700 text-stone-300 text-xs font-semibold cursor-pointer"
                            >
                              Отказ
                            </button>
                          </div>
                        </div>
                      ) : (
                        /* DISPLAY PRODUCTS */
                        <div className="space-y-3 pt-2 border-t border-stone-800 animate-in fade-in">
                          <span className="text-[10px] font-semibold text-stone-400 uppercase tracking-wider block">
                            Продукти в абонамента:
                          </span>
                          <div className="space-y-2">
                            {sub.items.map((item, idx) => (
                              <div key={idx} className="flex justify-between items-center text-xs">
                                <div>
                                  <span className="text-stone-200 font-medium">{item.coffeeName}</span>
                                  <span className="text-stone-500 text-[10px] block">
                                    {item.size === '250g' ? '250 гр' : '1 кг'} · {item.grind === 'whole_bean' ? 'на зърна' : `смляно (${item.grindName})`} · {item.quantity} бр.
                                  </span>
                                </div>
                                <span className="font-mono text-stone-300 font-semibold">
                                  {(item.unitPriceEur * item.quantity).toFixed(2)} €
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* DELIVERY AND DISPATCH FREQUENCY */}
                      {!isEditingThis && (
                        <div className="p-3 rounded-xl bg-stone-950/60 border border-stone-800 text-xs space-y-2 text-stone-300">
                          <div className="flex items-center gap-2">
                            <CalendarDays className="w-3.5 h-3.5 text-amber-500" />
                            <span>
                              Ежемесечно изпращане: <strong className="text-amber-300">
                                {sub.preferredDispatchDay === '1' && '1-во число'}
                                {sub.preferredDispatchDay === '10' && '10-то число'}
                                {sub.preferredDispatchDay === '15' && '15-то число'}
                                {sub.preferredDispatchDay === '20' && '20-то число'}
                                {sub.preferredDispatchDay === 'first_monday' && 'Всеки първи понеделник'}
                              </strong> на месеца
                            </span>
                          </div>
                          <div className="flex items-start gap-2 pt-1.5 border-t border-stone-900">
                            <MapPin className="w-3.5 h-3.5 text-amber-500 shrink-0 mt-0.5" />
                            <span className="text-[11px] text-stone-400 leading-snug">
                              {sub.customer.fullName} · {sub.customer.phone} · {sub.customer.city},{' '}
                              {sub.customer.deliveryType === 'courier' ? sub.customer.address : sub.customer.econtOffice}
                            </span>
                          </div>
                        </div>
                      )}

                      {/* ACTION BUTTONS */}
                      {!isEditingThis && sub.status !== 'canceled' && sub.status !== 'cancelled' && (
                        <div className="grid grid-cols-3 gap-2 pt-2 border-t border-stone-800/80">
                          <button
                            type="button"
                            onClick={(e) => { e.stopPropagation(); handlePauseToggle(sub); }}
                            className="py-2.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs font-semibold flex items-center justify-center gap-1 active:scale-95 cursor-pointer"
                          >
                            {sub.status === 'active' ? (
                              <>
                                <Pause className="w-3.5 h-3.5 text-amber-400" />
                                <span>Пауза</span>
                              </>
                            ) : (
                              <>
                                <Play className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
                                <span>Пусни</span>
                              </>
                            )}
                          </button>

                          <button
                            type="button"
                            onClick={(e) => { e.stopPropagation(); startEditing(sub); }}
                            className="py-2.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs font-semibold flex items-center justify-center gap-1 active:scale-95 cursor-pointer"
                          >
                            <Edit2 className="w-3.5 h-3.5 text-blue-400" />
                            <span>Промени</span>
                          </button>

                          <button
                            type="button"
                            onClick={(e) => { e.stopPropagation(); handleCancelSub(sub); }}
                            className="py-2.5 rounded-xl bg-red-950/20 hover:bg-red-950/40 border border-red-900/30 text-red-400 text-xs font-semibold flex items-center justify-center gap-1 active:scale-95 cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            <span>Откажи</span>
                          </button>
                        </div>
                      )}
                    </div>
                  );
                })
              )}
            </div>
          )}
        </div>
      ) : (
        /* PROMO & EMPTY STATE */
        <div className="space-y-5">
          <div className="text-center py-10 space-y-4 rounded-2xl bg-stone-900/60 border border-stone-800 p-6">
            <div className="w-16 h-16 rounded-full bg-amber-950/60 border border-amber-600/30 flex items-center justify-center mx-auto shadow-inner text-amber-400">
              <Repeat className="w-8 h-8 animate-spin-slow" />
            </div>

            <div className="space-y-1">
              <h3 className="text-base font-bold text-white font-display">
                Все още нямате активен абонамент
              </h3>
              <p className="text-xs text-stone-400 max-w-xs mx-auto leading-relaxed">
                Добавете любимите си кафета в количката, преминете към заявка и изберете **„Месечна абонаментна заявка“** за автоматична доставка.
              </p>
            </div>

            <button
              type="button"
              onClick={onExploreSorts}
              className="px-5 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-xs font-semibold transition-all shadow-md active:scale-95 cursor-pointer"
            >
              Разгледай кафетата
            </button>
          </div>

          {/* ADVANTAGES OF SUBSCRIBING */}
          <div className="p-4 rounded-2xl bg-stone-900/40 border border-stone-800 space-y-3">
            <h4 className="text-xs font-semibold text-stone-300 uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>Предимства на абонамента:</span>
            </h4>

            <ul className="space-y-2.5 text-xs text-stone-400">
              <li className="flex items-start gap-2">
                <Check className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                <span><strong className="text-stone-300">Гарантирана свежест:</strong> Печем специално за вас в деня преди планираното изпращане.</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                <span><strong className="text-stone-300">Пълна свобода:</strong> Паузирайте, редактирайте грамажа или смилането с един клик. Без предплатени такси.</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                <span><strong className="text-stone-300">Сигурност:</strong> Заплащане изключително при доставка по Еконт на място (наложен платеж).</span>
              </li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};
