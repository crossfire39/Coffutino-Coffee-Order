import React from 'react';
import { getEarliestDeliveryDate, formatIsoDate, formatDateDisplay } from '../data/coffeeData';
import { Calendar, Sparkles, CheckCircle2, Truck, MessageSquare } from 'lucide-react';

interface DeliveryDatePickerProps {
  selectedDate: string;
  onSelectDate: (dateStr: string) => void;
}

export const DeliveryDatePicker: React.FC<DeliveryDatePickerProps> = ({
  selectedDate,
  onSelectDate
}) => {
  const earliestDate = getEarliestDeliveryDate();

  // Генериране на 14 предстоящи валидни работни дни за доставка (пропускаме неделя)
  const upcomingDates: Date[] = [];
  const cur = new Date(earliestDate);
  while (upcomingDates.length < 14) {
    if (cur.getDay() !== 0) { // Пропускаме неделя (куриерите не разнасят)
      upcomingDates.push(new Date(cur));
    }
    cur.setDate(cur.getDate() + 1);
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <label className="text-xs font-semibold text-stone-400 uppercase tracking-wider flex items-center gap-1.5">
          <Calendar className="w-3.5 h-3.5 text-amber-500" />
          <span>Изберете дата на получаване</span>
        </label>
        <span className="text-[11px] text-amber-400 font-medium">
          Прясно изпечено
        </span>
      </div>

      {/* Информационен банер за графика на изпичане */}
      <div className="p-3 rounded-xl bg-amber-950/30 border border-amber-800/40 text-xs text-amber-200/90 flex items-start gap-2.5">
        <Sparkles className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
        <div>
          <span className="font-semibold text-amber-300 block">
            Гаранция за свежест от пекарна КОФУТИНО ЕООД
          </span>
          <span className="text-[11px] text-stone-300">
            Печем вашето кафе по поръчка. Най-ранната възможна дата осигурява почивка на зърната за оптимална дегазация и съвършен вкус.
          </span>
        </div>
      </div>

      {/* Хоризонтален списък с възможни дати */}
      <div>
        <span className="text-[11px] text-stone-400 block mb-2 font-medium">
          Налични дати за получаване:
        </span>
        <div className="flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar">
          {upcomingDates.map((dateObj, idx) => {
            const iso = formatIsoDate(dateObj);
            const isSelected = selectedDate === iso;
            const isEarliest = idx === 0;

            const dayName = dateObj.toLocaleDateString('bg-BG', { weekday: 'short' });
            const dayNum = dateObj.getDate();
            const monthName = dateObj.toLocaleDateString('bg-BG', { month: 'short' });

            return (
              <button
                key={iso}
                type="button"
                onClick={() => onSelectDate(iso)}
                className={`flex-shrink-0 min-w-[76px] p-2.5 rounded-xl border text-center transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-amber-600 border-amber-500 text-white shadow-lg shadow-amber-900/30 ring-2 ring-amber-400/40'
                    : 'bg-stone-900/80 border-stone-800 text-stone-300 hover:border-stone-700'
                }`}
              >
                <div className={`text-[10px] uppercase font-bold tracking-tight ${isSelected ? 'text-amber-100' : 'text-stone-400'}`}>
                  {dayName}
                </div>
                <div className="text-lg font-bold font-mono my-0.5 leading-none">
                  {dayNum}
                </div>
                <div className={`text-[10px] ${isSelected ? 'text-amber-100' : 'text-stone-400'}`}>
                  {monthName}
                </div>
                {isEarliest && (
                  <span className={`block text-[9px] font-bold mt-1 px-1 rounded ${isSelected ? 'bg-amber-800 text-amber-200' : 'bg-emerald-950/80 text-emerald-400'}`}>
                    Най-бързо
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Обобщение на избраната дата и SMS известие от Еконт */}
      <div className="space-y-2">
        {selectedDate && (
          <div className="p-3 rounded-xl bg-stone-900/90 border border-stone-800 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <Truck className="w-4 h-4 text-emerald-400" />
              <span className="text-stone-300">
                Дата на получаване:{' '}
                <strong className="text-amber-300 font-semibold">{formatDateDisplay(selectedDate, 'bg')}</strong>
              </span>
            </div>
            <span className="text-emerald-400 font-medium text-[11px] flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" />
              Избрана
            </span>
          </div>
        )}

        <div className="p-3 rounded-xl bg-stone-950/80 border border-stone-800/80 flex items-start gap-2 text-[11px] text-stone-400">
          <MessageSquare className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
          <span>
            Ще получите <strong className="text-stone-200 font-medium">СМС от Еконт</strong> с номер на товарителница, че пратката ви е пристигнала на подаденото от вас място.
          </span>
        </div>
      </div>
    </div>
  );
};
