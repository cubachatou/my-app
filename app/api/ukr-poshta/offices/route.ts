import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const cityId = searchParams.get('cityId') || '';
  const cityName = searchParams.get('cityName') || '';
  const query = searchParams.get('q') || '';
  
  if (!cityId && !cityName) {
    return NextResponse.json({ offices: [] });
  }

  const offices = getMockUkrPoshtaOffices(cityName || cityId, query);
  return NextResponse.json({ offices });
}

function getMockUkrPoshtaOffices(city: string, query: string) {
  const cityOffices: Record<string, Array<{
    id: string;
    name: string;
    address: string;
    postcode: string;
    type: string;
  }>> = {
    'Київ': generateOffices('Київ', '01', 25),
    'Харків': generateOffices('Харків', '61', 15),
    'Одеса': generateOffices('Одеса', '65', 12),
    'Дніпро': generateOffices('Дніпро', '49', 10),
    'Львів': generateOffices('Львів', '79', 12),
    'Вінниця': generateOffices('Вінниця', '21', 8),
    'Запоріжжя': generateOffices('Запоріжжя', '69', 10),
  };
  
  let offices = cityOffices[city];
  
  if (!offices) {
    // Generate generic offices for unknown city
    offices = generateOffices(city, '00', 5);
  }
  
  if (query) {
    const lowerQuery = query.toLowerCase();
    return offices.filter(office => 
      office.name.toLowerCase().includes(lowerQuery) ||
      office.address.toLowerCase().includes(lowerQuery) ||
      office.postcode.includes(query)
    );
  }
  
  return offices;
}

function generateOffices(city: string, postcodePrefix: string, count: number) {
  const streets = [
    'вул. Центральна', 'вул. Соборна', 'просп. Перемоги', 
    'вул. Шевченка', 'вул. Грушевського', 'вул. Поштова',
    'вул. Головна', 'просп. Миру', 'вул. Київська', 'вул. Львівська'
  ];
  
  return Array.from({ length: count }, (_, i) => {
    const postcode = `${postcodePrefix}${String(i + 1).padStart(3, '0')}`;
    return {
      id: `ukrposhta-${city}-${i + 1}`,
      name: `Поштове відділення №${i + 1}`,
      address: `${city}, ${streets[i % streets.length]}, ${10 + i * 3}`,
      postcode,
      type: i < count * 0.8 ? 'Відділення' : 'Поштомат',
    };
  });
}
