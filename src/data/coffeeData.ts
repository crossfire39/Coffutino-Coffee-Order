import { CoffeeSort, GrindOption } from '../types';

import HERO_IMAGE from '../assets/images/dimo_petkov_hero.png';
import COFFUTINO_LOGO from '../assets/images/coffutino_logo.png';
import BAG_COLOMBIA_SUPREMO from '../assets/images/COLOMBIA-SUPREMO.webp';
import BAG_ETHIOPIA_YIRGACHEFFE from '../assets/images/ETHIOPIA-YIRGACHEFFE.webp';
import BAG_BRAZIL_SAN_RAFAEL from '../assets/images/BRAZIL-SAN-RAFAEL.webp';
import BAG_PERU_ANAS_BLUE from '../assets/images/PERU-ANAS-BLUE.webp';
import BAG_EL_SALVADOR from '../assets/images/EL-SALVADOR.webp';
import BAG_COLOMBIA_DECAF from '../assets/images/COLOMBIA-LOW-CAFFAEINE.webp';
import BAG_FUSION_BLEND from '../assets/images/FUSION-BLEND.webp';
import GRINDS_IMAGE from '../assets/images/coffutino_grinds_1790670656172.jpg';

export {
  HERO_IMAGE,
  COFFUTINO_LOGO,
  BAG_COLOMBIA_SUPREMO,
  BAG_ETHIOPIA_YIRGACHEFFE,
  BAG_BRAZIL_SAN_RAFAEL,
  BAG_PERU_ANAS_BLUE,
  BAG_EL_SALVADOR,
  BAG_COLOMBIA_DECAF,
  BAG_FUSION_BLEND,
  GRINDS_IMAGE
};

export const GRIND_OPTIONS: GrindOption[] = [
  {
    id: 'whole_bean',
    name: 'Whole Beans',
    nameBg: 'Цели зърна',
    sub: 'Best for aroma & freshness',
    subBg: 'Запазва максимален аромат',
    brewMethod: 'Home Grinder',
    brewMethodBg: 'Домашна кафемелачка',
    particleSize: 'Цели зърна / Несмляно',
    description: 'We pack freshly roasted whole beans with a one-way degassing aroma valve to ensure peak flavor in your own grinder.',
    descriptionBg: 'Прясно изпечени цели зърна с еднопосочна дегазираща клапа за оптимален вкус при смилане непосредствено преди приготвяне.',
    idealFor: 'Any machine with built-in or separate burr grinder',
    recommendedRatio: '1:15 to 1:16',
    waterTemp: '92°C - 94°C'
  },
  {
    id: 'espresso',
    name: 'Espresso (Fine)',
    nameBg: 'Еспресо (Фино)',
    sub: 'For portafilter & lever machines',
    subBg: 'За ръкохватка и еспресо машини',
    brewMethod: 'Espresso Machine',
    brewMethodBg: 'Еспресо машина',
    particleSize: '200–300 µm (Fine sand)',
    description: 'Precision fine calibration for high-pressure extraction (9 bar) yielding rich, thick golden crema in 25–28 seconds.',
    descriptionBg: 'Фино калибрирано смилане за екстракция под 9 бара налягане, осигуряващо плътен каймак за 25-28 секунди.',
    idealFor: 'La Marzocco, Gaggia, Breville, Sage, E61 groupheads',
    recommendedRatio: '1:2 (18g in -> 36g out)',
    waterTemp: '93°C'
  },
  {
    id: 'moka',
    name: 'Moka Pot / Stovetop',
    nameBg: 'Мока кафеварка (Средно-фино)',
    sub: 'For Bialetti & stovetop makers',
    subBg: 'За кубинска кафеварка Bialetti',
    brewMethod: 'Moka Pot',
    brewMethodBg: 'Кафеварка на котлон',
    particleSize: '400–600 µm (Table salt)',
    description: 'Slightly coarser than espresso to prevent over-extraction, bitterness and clogging in steam-pressure stovetop brewers.',
    descriptionBg: 'Малко по-едро от еспресо, за да се избегне горчивина и прегаряне при парното налягане на кафеварката.',
    idealFor: 'Bialetti Moka Express, Brikka, Venus',
    recommendedRatio: 'Fill basket flush, don’t tamp hard',
    waterTemp: 'Preheated boiling water'
  },
  {
    id: 'filter',
    name: 'Filter / Pour-Over / V60',
    nameBg: 'Филтър / V60 / Аеропреса',
    sub: 'For Chemex, V60, Kalita, Drip',
    subBg: 'За V60, Chemex, Aeropress, капкова',
    brewMethod: 'Pour-Over & Aeropress',
    brewMethodBg: 'Филтърно приготвяне',
    particleSize: '700–900 µm (Medium sea salt)',
    description: 'Medium grind that highlights nuanced floral notes, delicate acidity and terroir complexity in specialty single origins.',
    descriptionBg: 'Средно смилане, разкриващо флоралните нотки, чистата плодова киселинност и специфичния тероар на кафето.',
    idealFor: 'Hario V60, Chemex, Moccamaster, Aeropress',
    recommendedRatio: '15g coffee / 250ml water (1:16.6)',
    waterTemp: '92°C - 95°C'
  },
  {
    id: 'french_press',
    name: 'French Press / Cold Brew',
    nameBg: 'Френска преса / Cold Brew',
    sub: 'Coarse grind for steeping',
    subBg: 'Едро смилане за накисване',
    brewMethod: 'Immersion & Cold Brew',
    brewMethodBg: 'Потапяне и студено извличане',
    particleSize: '1000–1400 µm (Coarse sea salt)',
    description: 'Even coarse grounds that filter cleanly through metal mesh screens without muddy sediment or sediment grittiness.',
    descriptionBg: 'Едро смилане за пълно потапяне, преминаващо чисто през металния филтър без утайка.',
    idealFor: 'Bodum French Press, Cold Brew jug, Cupping bowl',
    recommendedRatio: '60g coffee / 1L water (Cold Brew: 1:8)',
    waterTemp: '94°C (or room temp for Cold Brew)'
  },
  {
    id: 'turkish',
    name: 'Turkish / Cezve (Extra Fine)',
    nameBg: 'Турско кафе / Джезве',
    sub: 'Ultra-fine flour consistency',
    subBg: 'Много фино като пудра/брашно',
    brewMethod: 'Cezve / Ibrik',
    brewMethodBg: 'Джезве на пясък или котлон',
    particleSize: '< 100 µm (Powder/Flour)',
    description: 'Micro-pulverized for traditional boiling method, producing a velvety suspension and traditional dense foam.',
    descriptionBg: 'Стрито на фина пудра за автентично бавно варене в медно джезве с гъста пяна.',
    idealFor: 'Traditional copper Cezve / Sand brewing',
    recommendedRatio: '7g per 70ml cold water',
    waterTemp: 'Slow heat to foam'
  }
];

export const COFFEE_SORTS: CoffeeSort[] = [
  {
    id: 'colombia-supremo',
    name: 'Colombia Supremo',
    subname: '100% Arabica · Single Origin',
    subnameBg: '100% Арабика · Единичен произход',
    origin: 'Huila & Tolima',
    originBg: 'Уила и Толима',
    region: 'Andes Cordillera',
    country: 'Colombia',
    flag: '🇨🇴',
    roastLevel: 'Medium',
    roastLevelBg: 'Средно изпичане',
    scaScore: 84.5,
    altitude: '1,650 – 1,850 m',
    variety: 'Castillo, Caturra',
    process: 'Fully Washed',
    processBg: 'Мокро обработване (Washed)',
    tastingNotes: ['Chocolate', 'Fruity Notes', 'Caramel', 'Apple', 'Red Cranberries'],
    tastingNotesBg: ['Шоколадов вкус', 'Плодови нотки', 'Карамел', 'Ябълка', 'Червени боровинки'],
    acidity: 3,
    body: 4,
    sweetness: 4,
    description: 'Colombia Supremo represents the highest screening grade of Colombian beans. Celebrated for velvety milk chocolate sweetness, smooth cane caramel, and a crisp, juicy citrus finish.',
    descriptionBg: 'Colombia Supremo е най-високият клас зърна от Колумбия с едър и равномерен калибър. Отличава се с балансиран шоколадово-карамелен профил, умерена киселинност и копринено тяло.',
    brewRecommendation: 'Versatile star: remarkable as sweet espresso and daily morning Moka or drip.',
    price250g: 18.44,
    price1kg: 38.56,
    price250gBgn: 36.07,
    price1kgBgn: 75.42,
    image: BAG_COLOMBIA_SUPREMO,
    badge: 'Popular Single Origin'
  },
  {
    id: 'ethiopia-yirgacheffe-halo',
    name: 'Ethiopia Yirgacheffe Halo',
    subname: '100% Arabica · Specialty Grade',
    subnameBg: '100% Арабика · Специално кафе',
    origin: 'Halo Beriti, Yirgacheffe',
    originBg: 'Хало Берити, Иргачеф',
    region: 'Gedeo Zone',
    country: 'Ethiopia',
    flag: '🇪🇹',
    roastLevel: 'Light-Medium',
    roastLevelBg: 'Светло-средно изпичане',
    scaScore: 87.0,
    altitude: '2,050 – 2,200 m',
    variety: 'Heirloom Ethiopian Varieties',
    process: 'Washed, Sun-dried on African Beds',
    processBg: 'Мокро, сушено на африкански легла',
    tastingNotes: ['Floral Notes', 'Toasted Coconut', 'Chocolate', 'Mandarin', 'Citrus Fruits'],
    tastingNotesBg: ['Флорални нотки', 'Препечен кокос', 'Шоколад', 'Мандарина', 'Цитрусови плодове'],
    acidity: 5,
    body: 3,
    sweetness: 4,
    description: 'Grown at over 2,000 meters in the legendary birthplace of coffee. Explodes with delicate floral jasmine bouquet, elegant Earl Grey bergamot notes, and sweet stone fruit complexity.',
    descriptionBg: 'Отгледано на над 2000 метра надморска височина в люлката на кафето. Изключително елегантно с аромат на жасмин, бергамот, сочна праскова и деликатно тяло тип черен чай.',
    brewRecommendation: 'Unmatched on V60 pour-over, Chemex, and modern floral espresso.',
    price250g: 20.36,
    price1kg: 43.46,
    price250gBgn: 39.82,
    price1kgBgn: 85.00,
    image: BAG_ETHIOPIA_YIRGACHEFFE,
    badge: 'SCA 87.0 Top Lot'
  },
  {
    id: 'brazil-san-rafael',
    name: 'Brazil San Rafael',
    subname: '100% Arabica · Estate Single Origin',
    subnameBg: '100% Арабика · Единичен произход',
    origin: 'Cerrado Mineiro',
    originBg: 'Серадо Минейро',
    region: 'Minas Gerais',
    country: 'Brazil',
    flag: '🇧🇷',
    roastLevel: 'Medium',
    roastLevelBg: 'Средно изпичане',
    scaScore: 83.5,
    altitude: '1,150 – 1,250 m',
    variety: 'Mundo Novo, Yellow Catuai',
    process: 'Pulped Natural',
    processBg: 'Пулпирано натурално',
    tastingNotes: ['Cacao', 'Roasted Hazelnuts', 'Dried Fruits', 'Red Apple', 'Cinnamon Spice'],
    tastingNotesBg: ['Какао', 'Печени лешници', 'Сушени плодове', 'Червена ябълка', 'Подправка от канела'],
    acidity: 2,
    body: 5,
    sweetness: 4,
    description: 'Classic comforting specialty profile from high-plateau Cerrado. Gentle low acidity, heavy creamy mouthfeel, intense toasted hazelnut aroma, and buttery toffee finish.',
    descriptionBg: 'Класически бразилски профил от планинския регион Серадо. Характеризира се с плътно кадифено тяло, ниска деликатна киселинност и богат вкус на печени лешници и карамел.',
    brewRecommendation: 'Outstanding for classic espresso, Moka pot, and creamy cappuccinos.',
    price250g: 18.45,
    price1kg: 42.52,
    price250gBgn: 36.08,
    price1kgBgn: 83.16,
    image: BAG_BRAZIL_SAN_RAFAEL,
    badge: 'Creamy Classic'
  },
  {
    id: 'peru-anas-blue',
    name: 'Peru Añas Blue',
    subname: '100% Arabica · Organic Altitude',
    subnameBg: '100% Арабика · Био високопланинско',
    origin: 'Cajamarca & Jaén',
    originBg: 'Кахамарка и Хаен',
    region: 'Northern Peruvian Andes',
    country: 'Peru',
    flag: '🇵🇪',
    roastLevel: 'Medium',
    roastLevelBg: 'Средно изпичане',
    scaScore: 85.0,
    altitude: '1,750 – 1,950 m',
    variety: 'Typica, Caturra, Bourbon',
    process: 'Organic Fully Washed',
    processBg: 'Био мокро обработване',
    tastingNotes: ['Dark Chocolate', 'Yellow Peach', 'Plum', 'Citrus Aroma', 'Sweet Finish'],
    tastingNotesBg: ['Тъмен шоколад', 'Жълта праскова', 'Слива', 'Цитрусов аромат', 'Сладък послевкус'],
    acidity: 4,
    body: 3,
    sweetness: 5,
    description: 'High-altitude Andean organic cultivation yields a wonderfully crisp cup. Vibrant green apple freshness balanced by golden honey sweetness and toasted almond warmth.',
    descriptionBg: 'Отгледано органично във високите части на перуанските Анди. Откроява се със свежест на зелена ябълка, естествена медена сладост и деликатни какаови нотки.',
    brewRecommendation: 'Exquisite both in Aeropress/filter and as a sweet, lively espresso shot.',
    price250g: 19.22,
    price1kg: 44.12,
    price250gBgn: 37.59,
    price1kgBgn: 86.29,
    image: BAG_PERU_ANAS_BLUE,
    badge: 'High Altitude Organic'
  },
  {
    id: 'el-salvador-liquidambar',
    name: 'El Salvador Liquidambar',
    subname: '100% Arabica · Specialty Micro-Lot',
    subnameBg: '100% Арабика · Микро-партида',
    origin: 'Liquidambar Estate, Apaneca',
    originBg: 'Имение Ликидамбар, Апанека',
    region: 'Apaneca-Ilamatepec Mountain Range',
    country: 'El Salvador',
    flag: '🇸🇻',
    roastLevel: 'Medium',
    roastLevelBg: 'Средно изпичане',
    scaScore: 85.5,
    altitude: '1,500 – 1,600 m',
    variety: 'Bourbon & Pacas',
    process: 'Washed, Shade-grown under Liquidambar trees',
    processBg: 'Мокро, отгледано под сянка',
    tastingNotes: ['Dark Chocolate', 'Hazelnut', 'Apple', 'Chamomile', 'Floral & Citrus'],
    tastingNotesBg: ['Тъмен шоколад', 'Лешник', 'Ябълка', 'Лайка', 'Цитрусов и флорален аромат'],
    acidity: 3,
    body: 4,
    sweetness: 5,
    description: 'An elite micro-lot with official 85.50 SCA score. Grown under endemic Liquidambar shade trees. Delivers intoxicating orange blossom aromatics, roasted macadamia nut, and sweet cane sugar.',
    descriptionBg: 'Елитен микро-лот с оценка 85.50 точки по SCA. Отглежда се под сянката на дървета Liquidambar. Впечатлява с аромат на портокалов цвят, печена макадамия и кадифен шоколад.',
    brewRecommendation: 'Gourmet experience on all brewing methods, especially V60 and pure espresso.',
    price250g: 19.38,
    price1kg: 43.46,
    price250gBgn: 37.90,
    price1kgBgn: 85.00,
    image: BAG_EL_SALVADOR,
    badge: 'НОВ СОРТ · SCA 85.5'
  },
  {
    id: 'colombia-decaf-specialty',
    name: 'Colombia Decaf Specialty',
    subname: '100% Arabica · Chemical-Free Decaf',
    subnameBg: '100% Арабика · Безкофеиново специално',
    origin: 'Antioquia',
    originBg: 'Антиокия',
    region: 'Central Cordillera',
    country: 'Colombia',
    flag: '🇨🇴',
    roastLevel: 'Medium',
    roastLevelBg: 'Средно изпичане',
    scaScore: 84.0,
    altitude: '1,600 – 1,750 m',
    variety: 'Castillo & Colombia',
    process: 'Natural Sugarcane (EA) Decaffeination',
    processBg: 'Естествен захарен процес (без химия)',
    tastingNotes: ['Dark Chocolate', 'Passion Fruit', 'Brown Sugar', 'Tangerine', 'Warm Spices'],
    tastingNotesBg: ['Черен шоколад', 'Маракуя', 'Кафява захар', 'Мандарина', 'Подправки'],
    acidity: 2,
    body: 4,
    sweetness: 4,
    description: 'Full specialty coffee experience without caffeine. Naturally decaffeinated using sugarcane ethyl acetate that preserves single-origin terroir, deep cacao body, and sweet dried fruit notes.',
    descriptionBg: 'Пълноценно удоволствие от специално кафе без кофеин. Декофеинизирано по естествен път с екстракт от захарна тръстика, запазващ богатите нотки на какао и сушени плодове.',
    brewRecommendation: 'Perfect evening cup, late-night espresso, or comforting milk latte.',
    price250g: 20.87,
    price1kg: 48.68,
    price250gBgn: 40.82,
    price1kgBgn: 95.21,
    image: BAG_COLOMBIA_DECAF,
    badge: 'Natural Decaf 99.9%'
  },
  {
    id: 'coffutino-fusion-blend',
    name: 'Coffutino Fusion',
    subname: '100% Arabica · Signature Roaster Blend',
    subnameBg: '100% Арабика · Авторски бленд на пекарната',
    origin: 'Three Continents Master Blend',
    originBg: 'Бленд от три континента',
    region: 'Brazil, Colombia & Ethiopia',
    country: 'House Blend',
    flag: '✨',
    roastLevel: 'Medium-Dark',
    roastLevelBg: 'Средно-тъмно изпичане',
    scaScore: 85.0,
    altitude: '1,200 – 2,100 m',
    variety: 'Master Curated 100% Arabica',
    process: 'Tri-Continental Mixed Process',
    processBg: 'Комбиниран селектиран процес',
    tastingNotes: ['Fruits & Nuts', 'Caramel', 'Hazelnut', 'Dark Chocolate Aftertaste'],
    tastingNotesBg: ['Плодове и ядки', 'Карамел', 'Лешник', 'Послевкус: тъмен шоколад'],
    acidity: 3,
    body: 5,
    sweetness: 5,
    description: 'Our house masterpiece: uniting the chocolate-nut body of Brazil San Rafael, the caramel balance of Colombia Supremo, and a touch of Ethiopian citrus-floral brightness for dense, memorable espresso.',
    descriptionBg: 'Флагманският авторски бленд на Coffutino: съчетава шоколадовото тяло на Бразилия, баланса на Колумбия и деликатната цитрусова искра на Етиопия за перфектно еспресо.',
    brewRecommendation: 'The ultimate all-rounder: sensational for straight espresso and velvety flat whites.',
    price250g: 18.43,
    price1kg: 45.67,
    price250gBgn: 36.05,
    price1kgBgn: 89.32,
    image: BAG_FUSION_BLEND,
    badge: 'Coffutino Signature',
    isHouseBlend: true
  }
];

// Delivery logic based on coffutino.eu roasting schedule
// "Orders placed before 11:00 on weekdays are roasted and shipped after 2 days; orders after 11:00 or weekends shipped after 3 business days."
export function getEarliestDeliveryDate(): Date {
  const now = new Date();
  const date = new Date(now);
  const hour = now.getHours();

  // Add roasting rest & dispatch buffer (minimum 2 days, or 3 if late/weekend)
  let addDays = hour >= 11 ? 3 : 2;

  // Add days skipping Sunday (Econt couriers deliver Mon-Sat)
  let added = 0;
  while (added < addDays) {
    date.setDate(date.getDate() + 1);
    const dayOfWeek = date.getDay();
    // 0 is Sunday
    if (dayOfWeek !== 0) {
      added++;
    }
  }

  return date;
}

export function formatIsoDate(d: Date): string {
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
}

export function formatDateDisplay(dateStr: string, locale: 'en' | 'bg' = 'bg'): string {
  if (!dateStr) return '';
  const [y, m, d] = dateStr.split('-').map(Number);
  const date = new Date(y, m - 1, d);
  
  return date.toLocaleDateString(locale === 'en' ? 'en-US' : 'bg-BG', {
    weekday: 'short',
    month: 'short',
    day: 'numeric'
  });
}
