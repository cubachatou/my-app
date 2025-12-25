import { NextRequest, NextResponse } from 'next/server';

// Укрпошта API має інший формат, тут використовуємо mock дані
// Для production інтеграції див: https://ukrposhta.ua/api

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const query = searchParams.get('q') || '';
  
  if (query.length < 2) {
    return NextResponse.json({ cities: [] });
  }

  // Mock data for Ukrainian cities with postal codes
  const cities = getMockUkrPoshtaCities(query);
  return NextResponse.json({ cities });
}

function getMockUkrPoshtaCities(query: string) {
  const allCities = [
    { id: '01001', name: 'Київ', region: 'Київська область', postcode: '01001' },
    { id: '61000', name: 'Харків', region: 'Харківська область', postcode: '61000' },
    { id: '65000', name: 'Одеса', region: 'Одеська область', postcode: '65000' },
    { id: '49000', name: 'Дніпро', region: 'Дніпропетровська область', postcode: '49000' },
    { id: '79000', name: 'Львів', region: 'Львівська область', postcode: '79000' },
    { id: '69000', name: 'Запоріжжя', region: 'Запорізька область', postcode: '69000' },
    { id: '21000', name: 'Вінниця', region: 'Вінницька область', postcode: '21000' },
    { id: '36000', name: 'Полтава', region: 'Полтавська область', postcode: '36000' },
    { id: '14000', name: 'Чернігів', region: 'Чернігівська область', postcode: '14000' },
    { id: '18000', name: 'Черкаси', region: 'Черкаська область', postcode: '18000' },
    { id: '50000', name: 'Кривий Ріг', region: 'Дніпропетровська область', postcode: '50000' },
    { id: '54000', name: 'Миколаїв', region: 'Миколаївська область', postcode: '54000' },
    { id: '40000', name: 'Суми', region: 'Сумська область', postcode: '40000' },
    { id: '29000', name: 'Хмельницький', region: 'Хмельницька область', postcode: '29000' },
    { id: '10000', name: 'Житомир', region: 'Житомирська область', postcode: '10000' },
    { id: '33000', name: 'Рівне', region: 'Рівненська область', postcode: '33000' },
    { id: '76000', name: 'Івано-Франківськ', region: 'Івано-Франківська область', postcode: '76000' },
    { id: '46000', name: 'Тернопіль', region: 'Тернопільська область', postcode: '46000' },
    { id: '43000', name: 'Луцьк', region: 'Волинська область', postcode: '43000' },
    { id: '88000', name: 'Ужгород', region: 'Закарпатська область', postcode: '88000' },
    { id: '73000', name: 'Херсон', region: 'Херсонська область', postcode: '73000' },
    { id: '51000', name: 'Кропивницький', region: 'Кіровоградська область', postcode: '51000' },
  ];
  
  const lowerQuery = query.toLowerCase();
  return allCities.filter(city => 
    city.name.toLowerCase().includes(lowerQuery) || 
    city.region.toLowerCase().includes(lowerQuery) ||
    city.postcode.includes(query)
  );
}
