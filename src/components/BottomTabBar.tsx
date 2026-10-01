import React from 'react';
import { Coffee, Layers, ShoppingBag, CalendarClock } from 'lucide-react';

export type AppTab = 'sorts' | 'grinds' | 'cart' | 'orders';

interface BottomTabBarProps {
  activeTab: AppTab;
  onChangeTab: (tab: AppTab) => void;
  cartCount: number;
}

export const BottomTabBar: React.FC<BottomTabBarProps> = ({
  activeTab,
  onChangeTab,
  cartCount
}) => {
  const tabs = [
    {
      id: 'sorts' as AppTab,
      label: '7 Сорта',
      icon: Coffee
    },
    {
      id: 'grinds' as AppTab,
      label: 'Смилане',
      icon: Layers
    },
    {
      id: 'cart' as AppTab,
      label: 'Количка',
      icon: ShoppingBag,
      badge: cartCount > 0 ? cartCount : undefined
    },
    {
      id: 'orders' as AppTab,
      label: 'Поръчки',
      icon: CalendarClock
    }
  ];

  return (
    <nav className="sticky bottom-0 z-40 bg-[#161413]/95 backdrop-blur-xl border-t border-stone-800/80 px-2 py-1 flex items-center justify-around select-none">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = activeTab === tab.id;

        return (
          <button
            key={tab.id}
            type="button"
            onClick={() => onChangeTab(tab.id)}
            className={`flex-1 flex flex-col items-center justify-center min-h-[48px] py-1 transition-all relative cursor-pointer ${
              isActive
                ? 'text-amber-400 font-semibold'
                : 'text-stone-400 hover:text-stone-200'
            }`}
          >
            <div className="relative">
              <Icon
                className={`w-5 h-5 transition-transform duration-200 ${
                  isActive ? 'scale-110 stroke-[2.3]' : 'stroke-[1.7]'
                }`}
              />
              {tab.badge !== undefined && (
                <span className="absolute -top-1.5 -right-2.5 bg-amber-500 text-stone-950 font-bold text-[10px] w-4 h-4 rounded-full flex items-center justify-center shadow-md animate-pulse">
                  {tab.badge}
                </span>
              )}
            </div>
            <span className="text-[11px] tracking-tight mt-1 leading-none">
              {tab.label}
            </span>
            {isActive && (
              <span className="absolute bottom-0.5 w-6 h-0.5 bg-amber-400 rounded-full" />
            )}
          </button>
        );
      })}
    </nav>
  );
};
