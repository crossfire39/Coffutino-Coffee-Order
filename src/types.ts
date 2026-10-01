export type CoffeeSize = '250g' | '1kg';

export type GrindId = 
  | 'whole_bean'
  | 'espresso'
  | 'moka'
  | 'filter'
  | 'french_press'
  | 'turkish';

export interface GrindOption {
  id: GrindId;
  name: string;
  nameBg: string;
  sub: string;
  subBg: string;
  brewMethod: string;
  brewMethodBg: string;
  particleSize: string;
  description: string;
  descriptionBg: string;
  idealFor: string;
  recommendedRatio: string;
  waterTemp: string;
}

export interface CoffeeSort {
  id: string;
  name: string;
  subname: string;
  subnameBg: string;
  origin: string;
  originBg: string;
  region: string;
  country: string;
  flag: string;
  roastLevel: 'Light-Medium' | 'Medium' | 'Medium-Dark';
  roastLevelBg: string;
  scaScore: number;
  altitude: string;
  variety: string;
  process: string;
  processBg: string;
  tastingNotes: string[];
  tastingNotesBg: string[];
  acidity: number; // 1-5
  body: number; // 1-5
  sweetness: number; // 1-5
  description: string;
  descriptionBg: string;
  brewRecommendation: string;
  price250g: number; // EUR
  price1kg: number; // EUR
  price250gBgn: number; // BGN
  price1kgBgn: number; // BGN
  image: string;
  badge?: string;
  isHouseBlend?: boolean;
}

export interface CartItem {
  cartItemId: string;
  coffeeId: string;
  coffeeName: string;
  size: CoffeeSize;
  grind: GrindId;
  grindName: string;
  quantity: number;
  unitPriceEur: number;
  unitPriceBgn: number;
  image: string;
  origin: string;
}

export interface DeliveryDetails {
  date: string; // YYYY-MM-DD
  timeSlot?: 'morning' | 'afternoon' | 'anytime' | string;
  deliveryType: 'courier' | 'econt_office';
  fullName: string;
  phone: string;
  email: string;
  city: string;
  address: string;
  econtOffice: string;
  specialInstructions: string;
  paymentMethod: 'cod' | 'bank_transfer' | string;
}

export interface OrderRecord {
  id: string;
  orderNumber: string;
  createdAt: string;
  deliveryDate: string;
  timeSlot?: string;
  items: CartItem[];
  subtotalEur: number;
  shippingEur: number;
  totalEur: number;
  subtotalBgn: number;
  shippingBgn: number;
  totalBgn: number;
  currency: 'EUR' | 'BGN';
  status: 'Планирано изпичане' | 'Прясно изпечено' | 'Предадено на Еконт' | 'Доставено' | string;
  customer: DeliveryDetails;
}
