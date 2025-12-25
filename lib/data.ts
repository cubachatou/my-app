import { Product } from './types';

// Product images from iamsound.one (Ukrainian flute maker)
const fluteImages = {
  sopilka: {
    natural: 'https://cdn.shopify.com/s/files/1/0628/1808/4675/files/sopilka-natural-wood.jpg?v=1700000001',
    black: 'https://cdn.shopify.com/s/files/1/0628/1808/4675/files/sopilka-black.jpg?v=1700000002',
    white: 'https://cdn.shopify.com/s/files/1/0628/1808/4675/files/sopilka-white.jpg?v=1700000003',
    wood: 'https://cdn.shopify.com/s/files/1/0628/1808/4675/files/sopilka-dark-wood.jpg?v=1700000004',
  },
  pan: {
    bamboo: 'https://cdn.shopify.com/s/files/1/0628/1808/4675/files/pan-flute-bamboo.jpg?v=1700000005',
    copper: 'https://cdn.shopify.com/s/files/1/0628/1808/4675/files/pan-flute-copper.jpg?v=1700000006',
    silver: 'https://cdn.shopify.com/s/files/1/0628/1808/4675/files/pan-flute-silver.jpg?v=1700000007',
    gold: 'https://cdn.shopify.com/s/files/1/0628/1808/4675/files/pan-flute-gold.jpg?v=1700000008',
  },
  ocarinaPro: {
    ocean: 'https://cdn.shopify.com/s/files/1/0628/1808/4675/files/ocarina-blue.jpg?v=1700000009',
    earth: 'https://cdn.shopify.com/s/files/1/0628/1808/4675/files/ocarina-brown.jpg?v=1700000010',
    rose: 'https://cdn.shopify.com/s/files/1/0628/1808/4675/files/ocarina-pink.jpg?v=1700000011',
    storm: 'https://cdn.shopify.com/s/files/1/0628/1808/4675/files/ocarina-gray.jpg?v=1700000012',
  },
};

export const products: Product[] = [
  {
    id: '1',
    slug: 'sopilka-traditional',
    name: 'Сопілка Традиційна',
    description: 'Класична українська сопілка з автентичним звучанням',
    fullDescription: `Традиційна українська сопілка — це символ народної музичної культури. 
    Наша 3D-друкована версія зберігає всі акустичні властивості дерев'яного інструменту, 
    при цьому забезпечує ідеальну точність звукового ряду та довговічність.
    
    Інструмент ідеально підходить як для початківців, так і для досвідчених музикантів. 
    Легка вага та ергономічний дизайн роблять гру комфортною навіть під час тривалих сесій.`,
    price: 850,
    category: 'sopilka',
    features: [
      'Автентичне звучання',
      'Точний строй',
      'Легка вага',
      'Стійкість до вологи',
      'Ергономічний дизайн'
    ],
    specs: {
      material: 'PLA+ біопластик',
      length: '35 см',
      weight: '45 г',
      tuning: 'До мажор (C)'
    },
    colors: [
      { id: 'natural', name: 'Натуральний', hex: '#D4A574', image: fluteImages.sopilka.natural },
      { id: 'black', name: 'Чорний', hex: '#1a1a1a', image: fluteImages.sopilka.black },
      { id: 'white', name: 'Білий', hex: '#f5f5f5', image: fluteImages.sopilka.white },
      { id: 'wood', name: 'Під дерево', hex: '#8B4513', image: fluteImages.sopilka.wood },
    ],
    defaultColorId: 'natural'
  },
  {
    id: '2',
    slug: 'sopilka-alto',
    name: 'Сопілка Альт',
    description: 'Глибокий, теплий тон для соло та ансамблів',
    fullDescription: `Альтова сопілка з глибоким, багатим тембром. 
    Ідеальний вибір для тих, хто шукає інструмент з більш низьким звучанням.
    
    Розширений діапазон дозволяє виконувати як народні мелодії, 
    так і сучасні композиції. Особливо гарно звучить в ансамблевому виконанні.`,
    price: 1200,
    category: 'sopilka',
    features: [
      'Глибокий тембр',
      'Розширений діапазон',
      'Для ансамблів',
      'Професійний рівень',
      'Унікальний дизайн'
    ],
    specs: {
      material: 'PLA+ біопластик',
      length: '45 см',
      weight: '65 г',
      tuning: 'Соль мажор (G)'
    },
    colors: [
      { id: 'terracotta', name: 'Теракотовий', hex: '#E07B39' },
      { id: 'forest', name: 'Лісовий', hex: '#228B22' },
      { id: 'midnight', name: 'Опівнічний', hex: '#191970' },
      { id: 'pearl', name: 'Перламутровий', hex: '#F0EAD6' },
    ],
    defaultColorId: 'terracotta'
  },
  {
    id: '3',
    slug: 'fleita-pana',
    name: 'Флейта Пана',
    description: 'Багатоствольна флейта з чарівним звучанням',
    fullDescription: `Флейта Пана — один з найдавніших духових інструментів людства. 
    Наша версія поєднує традиційну конструкцію з сучасними технологіями 3D-друку.
    
    8 трубок забезпечують повну октаву нот. Кожна трубка налаштована 
    з точністю до 1 центу, що гарантує ідеальний строй.`,
    price: 1500,
    category: 'pan-flute',
    features: [
      '8 трубок',
      'Повна октава',
      'Точне налаштування',
      'Компактний розмір',
      'Захисний чохол у комплекті'
    ],
    specs: {
      material: 'PETG пластик',
      length: '25 см',
      weight: '120 г',
      tuning: 'До мажор (C)'
    },
    colors: [
      { id: 'bamboo', name: 'Бамбуковий', hex: '#E3C565', image: fluteImages.pan.bamboo },
      { id: 'copper', name: 'Мідний', hex: '#B87333', image: fluteImages.pan.copper },
      { id: 'silver', name: 'Срібний', hex: '#C0C0C0', image: fluteImages.pan.silver },
      { id: 'gold', name: 'Золотий', hex: '#FFD700', image: fluteImages.pan.gold },
    ],
    defaultColorId: 'bamboo'
  },
  {
    id: '4',
    slug: 'okarina-mini',
    name: 'Окаріна Міні',
    description: 'Компактна окаріна для початківців',
    fullDescription: `Міні-окаріна — ідеальний перший інструмент для знайомства з духовими. 
    Компактний розмір дозволяє завжди носити її з собою.
    
    Простота гри та приємний, м'який звук роблять цей інструмент 
    відмінним подарунком для дітей та дорослих.`,
    price: 450,
    category: 'ocarina',
    features: [
      'Компактний розмір',
      'Легка у вивченні',
      "М'який звук",
      'Підходить дітям',
      'Шнурок у комплекті'
    ],
    specs: {
      material: 'PLA біопластик',
      length: '8 см',
      weight: '25 г',
      tuning: 'До мажор (C)'
    },
    colors: [
      { id: 'sky', name: 'Небесний', hex: '#87CEEB' },
      { id: 'sunset', name: 'Захід сонця', hex: '#FF6B6B' },
      { id: 'lavender', name: 'Лавандовий', hex: '#E6E6FA' },
      { id: 'mint', name: "М'ятний", hex: '#98FF98' },
    ],
    defaultColorId: 'sky'
  },
  {
    id: '5',
    slug: 'okarina-alto',
    name: 'Окаріна Альт',
    description: '12-отворна окаріна з повним діапазоном',
    fullDescription: `Професійна 12-отворна окаріна з розширеним діапазоном понад 1.5 октави. 
    Інструмент для серйозних музикантів, які цінують багатство тембру та широкі можливості.
    
    Ергономічна форма розроблена для комфортної гри. 
    Кожен отвір точно розрахований для легкого звуковидобування.`,
    price: 980,
    category: 'ocarina',
    features: [
      '12 отворів',
      '1.5 октави',
      'Професійний рівень',
      'Ергономічна форма',
      'Інструкція з грою'
    ],
    specs: {
      material: 'PLA+ біопластик',
      length: '15 см',
      weight: '85 г',
      tuning: 'До мажор (C)'
    },
    colors: [
      { id: 'ocean', name: 'Океанічний', hex: '#006994', image: fluteImages.ocarinaPro.ocean },
      { id: 'earth', name: 'Земляний', hex: '#5C4033', image: fluteImages.ocarinaPro.earth },
      { id: 'rose', name: 'Рожевий', hex: '#FF007F', image: fluteImages.ocarinaPro.rose },
      { id: 'storm', name: 'Грозовий', hex: '#4F5D75', image: fluteImages.ocarinaPro.storm },
    ],
    defaultColorId: 'ocean'
  },
  {
    id: '6',
    slug: 'dudka-pastushya',
    name: 'Дудка Пастуша',
    description: 'Автентична пастуша дудка з народним звучанням',
    fullDescription: `Пастуша дудка — інструмент, що століттями супроводжував українських 
    чабанів у Карпатах. Простий, але неймовірно виразний.
    
    Наша версія відтворює характерний "сільський" тембр, 
    зберігаючи при цьому сучасну точність налаштування.`,
    price: 650,
    category: 'dudka',
    features: [
      'Народне звучання',
      'Проста у вивченні',
      'Карпатська традиція',
      'Виразний тембр',
      'Ручна обробка'
    ],
    specs: {
      material: 'PLA+ біопластик',
      length: '30 см',
      weight: '40 г',
      tuning: 'Ре мажор (D)'
    },
    colors: [
      { id: 'honey', name: 'Медовий', hex: '#EB9605' },
      { id: 'moss', name: 'Моховий', hex: '#8A9A5B' },
      { id: 'charcoal', name: 'Вугільний', hex: '#36454F' },
      { id: 'cream', name: 'Кремовий', hex: '#FFFDD0' },
    ],
    defaultColorId: 'honey'
  }
];

export function getProductBySlug(slug: string): Product | undefined {
  return products.find(p => p.slug === slug);
}

export function getProductById(id: string): Product | undefined {
  return products.find(p => p.id === id);
}
