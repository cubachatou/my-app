import { NextRequest, NextResponse } from 'next/server';

const NOVA_POSHTA_API_URL = 'https://api.novaposhta.ua/v2.0/json/';
const API_KEY = process.env.NOVA_POSHTA_API_KEY || '';

export interface NovaPoshtaWarehouse {
  Ref: string;
  Description: string;
  ShortAddress: string;
  Number: string;
  TypeOfWarehouse: string;
  CityRef: string;
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const cityRef = searchParams.get('cityRef') || '';
  const cityName = searchParams.get('cityName') || '';
  const warehouseQuery = searchParams.get('q') || '';
  
  if (!cityRef && !cityName) {
    return NextResponse.json({ warehouses: [] });
  }

  // Always use mock data if no API key is configured
  if (!API_KEY) {
    const mockWarehouses = getMockWarehouses(cityName || cityRef, warehouseQuery);
    return NextResponse.json({ warehouses: mockWarehouses });
  }

  try {
    const response = await fetch(NOVA_POSHTA_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        apiKey: API_KEY,
        modelName: 'Address',
        calledMethod: 'getWarehouses',
        methodProperties: {
          CityRef: cityRef || undefined,
          CityName: !cityRef ? cityName : undefined,
          FindByString: warehouseQuery || undefined,
          Limit: 50,
          Page: 1,
        },
      }),
    });

    const data = await response.json();

    if (!data.success || !data.data) {
      // Fallback to mock data
      const mockWarehouses = getMockWarehouses(cityName || cityRef, warehouseQuery);
      return NextResponse.json({ warehouses: mockWarehouses });
    }

    const warehouses = data.data.map((wh: NovaPoshtaWarehouse) => ({
      ref: wh.Ref,
      description: wh.Description,
      shortAddress: wh.ShortAddress,
      number: wh.Number,
      type: wh.TypeOfWarehouse,
    }));

    return NextResponse.json({ warehouses });
  } catch (error) {
    console.error('Nova Poshta API error:', error);
    
    // Return mock data for development/demo
    const mockWarehouses = getMockWarehouses(cityName || cityRef, warehouseQuery);
    return NextResponse.json({ warehouses: mockWarehouses });
  }
}

// Mock data for development
function getMockWarehouses(city: string, query: string) {
  const cityWarehouses: Record<string, Array<{
    ref: string;
    description: string;
    shortAddress: string;
    number: string;
    type: string;
  }>> = {
    '1': generateWarehouses('Київ', 50),
    '2': generateWarehouses('Харків', 30),
    '3': generateWarehouses('Одеса', 25),
    '4': generateWarehouses('Дніпро', 20),
    '5': generateWarehouses('Львів', 20),
    'Київ': generateWarehouses('Київ', 50),
    'Харків': generateWarehouses('Харків', 30),
    'Одеса': generateWarehouses('Одеса', 25),
    'Дніпро': generateWarehouses('Дніпро', 20),
    'Львів': generateWarehouses('Львів', 20),
    'Вінниця': generateWarehouses('Вінниця', 15),
    'Полтава': generateWarehouses('Полтава', 12),
    'Запоріжжя': generateWarehouses('Запоріжжя', 18),
  };
  
  const warehouses = cityWarehouses[city] || generateWarehouses(city, 10);
  
  if (query) {
    const lowerQuery = query.toLowerCase();
    return warehouses.filter(wh => 
      wh.description.toLowerCase().includes(lowerQuery) ||
      wh.number.includes(query)
    );
  }
  
  return warehouses;
}

function generateWarehouses(city: string, count: number) {
  const streets = [
    'вул. Центральна', 'вул. Соборна', 'просп. Перемоги', 
    'вул. Шевченка', 'вул. Грушевського', 'вул. Незалежності',
    'вул. Хрещатик', 'просп. Миру', 'вул. Київська', 'вул. Львівська'
  ];
  
  return Array.from({ length: count }, (_, i) => ({
    ref: `${city}-wh-${i + 1}`,
    description: `Відділення №${i + 1}: ${city}, ${streets[i % streets.length]}, ${10 + i * 5}`,
    shortAddress: `${streets[i % streets.length]}, ${10 + i * 5}`,
    number: String(i + 1),
    type: i < count * 0.7 ? 'Відділення' : 'Поштомат',
  }));
}
