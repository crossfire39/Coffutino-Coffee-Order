/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { CoffeeSort, CoffeeSize, GrindId, CartItem, OrderRecord } from './types';
import { COFFEE_SORTS, HERO_IMAGE, GRIND_OPTIONS, getEarliestDeliveryDate, formatIsoDate } from './data/coffeeData';
import { IPhoneFrame } from './components/IPhoneFrame';
import { TopNavbar } from './components/TopNavbar';
import { BottomTabBar, AppTab } from './components/BottomTabBar';
import { CoffeeCard } from './components/CoffeeCard';
import { CoffeeDetailModal } from './components/CoffeeDetailModal';
import { GrindGuideView } from './components/GrindGuideView';
import { CartView } from './components/CartView';
import { CheckoutModal } from './components/CheckoutModal';
import { OrderConfirmationModal } from './components/OrderConfirmationModal';
import { OrdersHistoryView } from './components/OrdersHistoryView';
import { Calendar, Coffee, Flame, ExternalLink } from 'lucide-react';

export default function App() {
  // Навигация и състояние (валута: евро)
  const [activeTab, setActiveTab] = useState<AppTab>('sorts');
  const currency: 'EUR' = 'EUR';

  // Филтър за каталога на сортовете
  const [catalogFilter, setCatalogFilter] = useState<'all' | 'single_origin' | 'blend' | 'decaf' | 'top_sca'>('all');

  // Избрана дата за доставка (по подразбиране най-ранната налична за прясно изпечено кафе)
  const [selectedDate, setSelectedDate] = useState<string>(() => {
    return formatIsoDate(getEarliestDeliveryDate());
  });

  // Модални прозорци
  const [selectedCoffeeForDetails, setSelectedCoffeeForDetails] = useState<CoffeeSort | null>(null);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState<boolean>(false);
  const [confirmedOrder, setConfirmedOrder] = useState<OrderRecord | null>(null);

  // Количка (синхронизирана в localStorage, цени в евро)
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('coffutino_cart');
      if (saved) {
        const parsed: CartItem[] = JSON.parse(saved);
        return parsed.map((item) => {
          const match = COFFEE_SORTS.find((c) => c.id === item.coffeeId);
          const grindName = item.grind === 'whole_bean' ? 'Цели зърна' : item.grindName;
          const unitPriceEur = match ? (item.size === '250g' ? match.price250g : match.price1kg) : item.unitPriceEur;
          const unitPriceBgn = match ? (item.size === '250g' ? match.price250gBgn : match.price1kgBgn) : item.unitPriceBgn;
          return match
            ? { ...item, image: match.image, origin: match.originBg, grindName, unitPriceEur, unitPriceBgn }
            : { ...item, grindName };
        });
      }
    } catch {
      // ignore
    }
    // Примерна начална позиция: 1 пакет Colombia Supremo 250г Цели зърна
    const sample = COFFEE_SORTS[0];
    return [
      {
        cartItemId: 'seed_1',
        coffeeId: sample.id,
        coffeeName: sample.name,
        size: '250g',
        grind: 'whole_bean',
        grindName: 'Цели зърна',
        quantity: 1,
        unitPriceEur: sample.price250g,
        unitPriceBgn: sample.price250gBgn,
        image: sample.image,
        origin: sample.originBg
      }
    ];
  });

  // История на поръчките (синхронизирана в localStorage)
  const [orders, setOrders] = useState<OrderRecord[]>(() => {
    try {
      const saved = localStorage.getItem('coffutino_orders');
      if (saved) {
        const parsed: OrderRecord[] = JSON.parse(saved);
        return parsed.map((ord) => ({
          ...ord,
          currency: 'EUR',
          items: ord.items.map((item) => {
            const match = COFFEE_SORTS.find((c) => c.id === item.coffeeId);
            const grindName = item.grind === 'whole_bean' ? 'Цели зърна' : item.grindName;
            return match ? { ...item, image: match.image, grindName } : { ...item, grindName };
          })
        }));
      }
    } catch {
      // ignore
    }
    // Примерна първоначална поръчка за показване на статуса на изпичане
    const initialDate = formatIsoDate(getEarliestDeliveryDate());
    return [
      {
        id: 'init_order_1',
        orderNumber: 'CFT-91820',
        createdAt: new Date(Date.now() - 86400000).toISOString(),
        deliveryDate: initialDate,
        items: [
          {
            cartItemId: 'init_item_1',
            coffeeId: 'coffutino-fusion-blend',
            coffeeName: 'Coffutino Fusion',
            size: '1kg',
            grind: 'espresso',
            grindName: 'Еспресо (Фино)',
            quantity: 1,
            unitPriceEur: 45.67,
            unitPriceBgn: 89.32,
            image: COFFEE_SORTS[6].image,
            origin: 'Бленд от три континента'
          }
        ],
        subtotalEur: 45.67,
        shippingEur: 0,
        totalEur: 45.67,
        subtotalBgn: 89.32,
        shippingBgn: 0,
        totalBgn: 89.32,
        currency: 'EUR',
        status: 'Прясно изпечено',
        customer: {
          date: initialDate,
          deliveryType: 'courier',
          fullName: 'Александър Иванов',
          phone: '+359 88 812 3456',
          email: 'alex@example.com',
          city: 'София',
          address: 'бул. Витоша 42, ет. 3',
          econtOffice: '',
          specialInstructions: 'Прясно смляно за 58мм ръкохватка',
          paymentMethod: 'cod'
        }
      }
    ];
  });

  // Запазване на количката в localStorage
  useEffect(() => {
    try {
      localStorage.setItem('coffutino_cart', JSON.stringify(cart));
    } catch {
      // ignore
    }
  }, [cart]);

  // Запазване на поръчките в localStorage
  useEffect(() => {
    try {
      localStorage.setItem('coffutino_orders', JSON.stringify(orders));
    } catch {
      // ignore
    }
  }, [orders]);

  // Добавяне в количката
  const handleAddToCart = (coffee: CoffeeSort, size: CoffeeSize, grind: GrindId) => {
    const grindObj = GRIND_OPTIONS.find((g) => g.id === grind) || GRIND_OPTIONS[0];
    const unitPriceEur = size === '250g' ? coffee.price250g : coffee.price1kg;
    const unitPriceBgn = size === '250g' ? coffee.price250gBgn : coffee.price1kgBgn;

    setCart((prev) => {
      const existingIdx = prev.findIndex(
        (i) => i.coffeeId === coffee.id && i.size === size && i.grind === grind
      );
      if (existingIdx >= 0) {
        const next = [...prev];
        next[existingIdx] = {
          ...next[existingIdx],
          quantity: next[existingIdx].quantity + 1
        };
        return next;
      }

      const newItem: CartItem = {
        cartItemId: `${coffee.id}_${size}_${grind}_${Date.now()}`,
        coffeeId: coffee.id,
        coffeeName: coffee.name,
        size,
        grind,
        grindName: grindObj.nameBg,
        quantity: 1,
        unitPriceEur,
        unitPriceBgn,
        image: coffee.image,
        origin: coffee.originBg
      };
      return [...prev, newItem];
    });
  };

  const handleUpdateQuantity = (cartItemId: string, delta: number) => {
    setCart((prev) => {
      return prev
        .map((item) => {
          if (item.cartItemId === cartItemId) {
            const newQ = item.quantity + delta;
            return newQ > 0 ? { ...item, quantity: newQ } : null;
          }
          return item;
        })
        .filter(Boolean) as CartItem[];
    });
  };

  const handleRemoveItem = (cartItemId: string) => {
    setCart((prev) => prev.filter((item) => item.cartItemId !== cartItemId));
  };

  const handleUpdateGrind = (cartItemId: string, newGrind: GrindId) => {
    const grindObj = GRIND_OPTIONS.find((g) => g.id === newGrind) || GRIND_OPTIONS[0];
    setCart((prev) =>
      prev.map((item) => {
        if (item.cartItemId === cartItemId) {
          return {
            ...item,
            grind: newGrind,
            grindName: grindObj.nameBg
          };
        }
        return item;
      })
    );
  };

  // Повторна поръчка
  const handleReorder = (items: CartItem[]) => {
    setCart((prev) => [...prev, ...items]);
    setActiveTab('cart');
  };

  // Успешно изпратена поръчка
  const handleOrderPlaced = (order: OrderRecord) => {
    setOrders((prev) => [order, ...prev]);
    setCart([]);
    setIsCheckoutOpen(false);
    setConfirmedOrder(order);
  };

  // Филтриране на сортовете
  const filteredCoffees = COFFEE_SORTS.filter((c) => {
    if (catalogFilter === 'single_origin') return !c.isHouseBlend && c.id !== 'colombia-decaf-specialty';
    if (catalogFilter === 'blend') return c.isHouseBlend;
    if (catalogFilter === 'decaf') return c.id === 'colombia-decaf-specialty';
    if (catalogFilter === 'top_sca') return c.scaScore >= 85.0;
    return true;
  });

  const totalCartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <IPhoneFrame activeRoastCount={orders.length} cartItemCount={totalCartCount}>
      {/* Горна навигационна лента */}
      <TopNavbar
        cartCount={totalCartCount}
        onOpenCart={() => setActiveTab('cart')}
      />

      {/* Основно съдържание на табовете */}
      <main className="flex-1">
        {activeTab === 'sorts' && (
          <div className="p-4 space-y-4 pb-24">
            {/* Начален банер на пекарната - Димо Петков */}
            <div className="relative rounded-2xl overflow-hidden border border-stone-800 bg-[#161413] shadow-xl">
              <img
                src={HERO_IMAGE}
                alt="Димо Петков - Прясно изпечено кафе КОФУТИНО ЕООД"
                referrerPolicy="no-referrer"
                className="w-full h-auto object-contain block rounded-2xl"
              />
            </div>

            {/* Бързи акценти за пекарната */}
            <div className="grid grid-cols-3 gap-2 text-center text-xs">
              <div className="p-2.5 rounded-2xl bg-stone-900/80 border border-stone-800">
                <Coffee className="w-3.5 h-3.5 text-amber-500 mx-auto mb-1" />
                <span className="font-semibold text-stone-200 block text-[11px]">7 Сорта</span>
                <span className="text-[10px] text-stone-400">250г и 1кг</span>
              </div>

              <div className="p-2.5 rounded-2xl bg-stone-900/80 border border-stone-800">
                <Flame className="w-3.5 h-3.5 text-amber-500 mx-auto mb-1" />
                <span className="font-semibold text-stone-200 block text-[11px]">
                  По избор
                </span>
                <span className="text-[10px] text-stone-400">
                  6 вида смилане
                </span>
              </div>

              <div
                onClick={() => setActiveTab('cart')}
                className="p-2.5 rounded-2xl bg-stone-900/80 border border-stone-800 hover:border-amber-600/40 cursor-pointer transition-colors"
              >
                <Calendar className="w-3.5 h-3.5 text-amber-500 mx-auto mb-1" />
                <span className="font-semibold text-stone-200 block text-[11px]">
                  Дата за доставка
                </span>
                <span className="text-[10px] text-amber-300 font-mono">
                  Еконт куриер
                </span>
              </div>
            </div>

            {/* Интерактивни филтри за сортовете кафе */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar text-xs">
              <button
                type="button"
                onClick={() => setCatalogFilter('all')}
                className={`px-3 py-1.5 rounded-xl font-medium whitespace-nowrap transition-all cursor-pointer ${
                  catalogFilter === 'all'
                    ? 'bg-amber-600 text-white shadow-sm'
                    : 'bg-stone-900 text-stone-400 hover:text-stone-200 border border-stone-800'
                }`}
              >
                Всички 7 сорта
              </button>

              <button
                type="button"
                onClick={() => setCatalogFilter('single_origin')}
                className={`px-3 py-1.5 rounded-xl font-medium whitespace-nowrap transition-all cursor-pointer ${
                  catalogFilter === 'single_origin'
                    ? 'bg-amber-600 text-white shadow-sm'
                    : 'bg-stone-900 text-stone-400 hover:text-stone-200 border border-stone-800'
                }`}
              >
                Единичен произход
              </button>

              <button
                type="button"
                onClick={() => setCatalogFilter('blend')}
                className={`px-3 py-1.5 rounded-xl font-medium whitespace-nowrap transition-all cursor-pointer ${
                  catalogFilter === 'blend'
                    ? 'bg-amber-600 text-white shadow-sm'
                    : 'bg-stone-900 text-stone-400 hover:text-stone-200 border border-stone-800'
                }`}
              >
                Авторски бленд
              </button>

              <button
                type="button"
                onClick={() => setCatalogFilter('top_sca')}
                className={`px-3 py-1.5 rounded-xl font-medium whitespace-nowrap transition-all cursor-pointer ${
                  catalogFilter === 'top_sca'
                    ? 'bg-amber-600 text-white shadow-sm'
                    : 'bg-stone-900 text-stone-400 hover:text-stone-200 border border-stone-800'
                }`}
              >
                SCA 85+ Елитни
              </button>

              <button
                type="button"
                onClick={() => setCatalogFilter('decaf')}
                className={`px-3 py-1.5 rounded-xl font-medium whitespace-nowrap transition-all cursor-pointer ${
                  catalogFilter === 'decaf'
                    ? 'bg-amber-600 text-white shadow-sm'
                    : 'bg-stone-900 text-stone-400 hover:text-stone-200 border border-stone-800'
                }`}
              >
                Безкофеиново
              </button>
            </div>

            {/* Списък с карти на 7-те сорта кафе */}
            <div className="space-y-4">
              {filteredCoffees.map((coffee) => (
                <CoffeeCard
                  key={coffee.id}
                  coffee={coffee}
                  currency={currency}
                  onAddToCart={handleAddToCart}
                  onOpenDetails={(c) => setSelectedCoffeeForDetails(c)}
                />
              ))}
            </div>

            {/* Философия на пекарната и доставка */}
            <div className="p-4 rounded-2xl bg-stone-900/60 border border-stone-800 text-xs text-stone-400 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-stone-300 font-display text-sm">
                  Пекарна КОФУТИНО ЕООД и доставки
                </span>
                <a
                  href="https://www.coffutino.eu"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 text-amber-400 hover:text-amber-300"
                >
                  <span>coffutino.eu</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
              <p className="text-[11px] leading-relaxed text-stone-400">
                Доставяме с Еконт. Имайте в предвид, че в работни дни (Пон – Пет) при направена поръчка до 11:00, готовото кафе ще бъде изпратено след 2 дни. Ако поръчката е направена след 11:00 часа, кафето ще се изпрати след 3 дни. При поръчки през почивни дни и празници, готовото кафе се изпраща на 3-ия работен ден след това.
              </p>
            </div>
          </div>
        )}

        {/* Таб 2: Наръчник за смилане */}
        {activeTab === 'grinds' && (
          <GrindGuideView
            currency={currency}
            onSelectCoffee={(c) => setSelectedCoffeeForDetails(c)}
            onAddToCart={handleAddToCart}
          />
        )}

        {/* Таб 3: Количка и избор на дата за доставка */}
        {activeTab === 'cart' && (
          <CartView
            items={cart}
            currency={currency}
            onUpdateQuantity={handleUpdateQuantity}
            onRemoveItem={handleRemoveItem}
            onUpdateGrind={handleUpdateGrind}
            selectedDate={selectedDate}
            onSelectDate={setSelectedDate}
            onProceedToCheckout={() => setIsCheckoutOpen(true)}
            onExploreSorts={() => setActiveTab('sorts')}
          />
        )}

        {/* Таб 4: Моите поръчки и статус на изпичане */}
        {activeTab === 'orders' && (
          <OrdersHistoryView
            orders={orders}
            currency={currency}
            onReorder={handleReorder}
            onExploreSorts={() => setActiveTab('sorts')}
          />
        )}
      </main>

      {/* Долна лента с табове */}
      <BottomTabBar
        activeTab={activeTab}
        onChangeTab={(t) => setActiveTab(t)}
        cartCount={totalCartCount}
      />

      {/* Модални прозорци */}
      <CoffeeDetailModal
        coffee={selectedCoffeeForDetails}
        onClose={() => setSelectedCoffeeForDetails(null)}
        currency={currency}
        onAddToCart={handleAddToCart}
      />

      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        items={cart}
        currency={currency}
        selectedDate={selectedDate}
        onOrderPlaced={handleOrderPlaced}
      />

      <OrderConfirmationModal
        order={confirmedOrder}
        onClose={() => setConfirmedOrder(null)}
        onViewOrders={() => {
          setConfirmedOrder(null);
          setActiveTab('orders');
        }}
      />
    </IPhoneFrame>
  );
}
