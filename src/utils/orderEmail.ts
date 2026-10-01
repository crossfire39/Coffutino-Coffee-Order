import { OrderRecord } from '../types';
import { formatDateDisplay } from '../data/coffeeData';

export const ROASTER_EMAIL = 'shop@coffutino.eu';

/**
 * Генерира структуриран текст на поръчката (за копиране от клиента при нужда).
 */
export function generateOrderEmailBody(order: OrderRecord): string {
  const paymentLabel = order.customer.paymentMethod === 'cod'
    ? '1. Наложен платеж при получаване'
    : '2. Банково плащане';

  const itemsList = order.items
    .map((item, index) => {
      const packageLabel = item.size === '250g' ? '250 гр' : '1 кг';
      const lineTotal = (item.unitPriceEur * item.quantity).toFixed(2);
      return `${index + 1}. ${item.coffeeName}\n   - Опаковка: ${packageLabel}\n   - Смилане: ${item.grindName}\n   - Количество: ${item.quantity} бр.\n   - Цена: ${item.unitPriceEur.toFixed(2)} € / пакет\n   - Сума: ${lineTotal} €`;
    })
    .join('\n\n');

  const deliveryTypeLabel = order.customer.deliveryType === 'courier'
    ? 'Куриер до личен адрес'
    : 'Офис на Еконт / Еконтомат';

  const destination = order.customer.deliveryType === 'courier'
    ? order.customer.address
    : order.customer.econtOffice;

  return `НОВА ПОРЪЧКА ЗА КАФЕ - КОФУТИНО ЕООД
=====================================================
Номер на поръчка: ${order.orderNumber}
Дата на заявка: ${new Date(order.createdAt).toLocaleDateString('bg-BG')}
Желана дата за доставка: ${formatDateDisplay(order.deliveryDate, 'bg')}
Известие за доставка: Клиентът ще получи SMS от Еконт за пратката.

ИЗБРАНИ КАФЕТА И ОПАКОВКИ:
-----------------------------------------------------
${itemsList}

ФИНАНСОВО ОБОБЩЕНИЕ:
-----------------------------------------------------
Сума за кафе: ${order.subtotalEur.toFixed(2)} €
Доставка (Еконт): Заплаща се от клиента по тарифата на Еконт при получаване
ОБЩО ЗА КАФЕТО: ${order.subtotalEur.toFixed(2)} €

НАЧИН НА ПЛАЩАНЕ:
-----------------------------------------------------
${paymentLabel}
(Важно: Клиентът заплаща доставката директно по Еконт. Няма физическо онлайн плащане.)

ДАННИ ЗА КЛИЕНТА И ДОСТАВКА:
-----------------------------------------------------
Име: ${order.customer.fullName}
Телефон: ${order.customer.phone}
Имейл: ${order.customer.email || 'Не е посочен'}
Тип доставка: ${deliveryTypeLabel}
Населено място: ${order.customer.city}
Адрес / Офис на Еконт: ${destination}
${order.customer.specialInstructions ? `Специални указания: ${order.customer.specialInstructions}\n` : ''}=====================================================
Изпратено през Coffutino - КОФУТИНО ЕООД (${ROASTER_EMAIL})`;
}

/**
 * Не отваря локален имейл клиент (връща празен линк, тъй като поръчките се изпращат през Make.com).
 */
export function generateMailtoUrl(order: OrderRecord): string {
  return '#';
}