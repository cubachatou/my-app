import { NextRequest, NextResponse } from 'next/server';

const NOVA_POSHTA_API_URL = 'https://api.novaposhta.ua/v2.0/json/';

// Public demo API key - for production use your own key
const API_KEY = process.env.NOVA_POSHTA_API_KEY || '';

export interface NovaPoshtaCity {
  Ref: string;
  Description: string;
  DescriptionRu: string;
  Area: string;
  AreaDescription: string;
  AreaDescriptionRu: string;
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const query = searchParams.get('q') || '';
  
  if (query.length < 2) {
    return NextResponse.json({ cities: [] });
  }

  // Always use mock data if no API key is configured
  if (!API_KEY) {
    const mockCities = getMockCities(query);
    return NextResponse.json({ cities: mockCities });
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
        calledMethod: 'searchSettlements',
        methodProperties: {
          CityName: query,
          Limit: 15,
          Page: 1,
        },
      }),
    });

    const data = await response.json();

    if (!data.success || !data.data?.[0]?.Addresses) {
      // Fallback to mock data
      const mockCities = getMockCities(query);
      return NextResponse.json({ cities: mockCities });
    }

    const cities = data.data[0].Addresses.map((city: {
      DeliveryCity: string;
      Present: string;
      MainDescription: string;
      Area: string;
      Region: string;
      Warehouses: number;
    }) => ({
      ref: city.DeliveryCity,
      name: city.Present,
      mainDescription: city.MainDescription,
      area: city.Area,
      region: city.Region,
      warehousesCount: city.Warehouses,
    }));

    return NextResponse.json({ cities });
  } catch (error) {
    console.error('Nova Poshta API error:', error);
    
    // Return mock data for development/demo
    const mockCities = getMockCities(query);
    return NextResponse.json({ cities: mockCities });
  }
}

// Mock data for development when API key is not configured
function getMockCities(query: string) {
  const allCities = [
    { ref: '1', name: 'Київ', mainDescription: 'Київ', area: 'Київська', region: '', warehousesCount: 500 },
    { ref: '2', name: 'Харків', mainDescription: 'Харків', area: 'Харківська', region: '', warehousesCount: 250 },
    { ref: '3', name: 'Одеса', mainDescription: 'Одеса', area: 'Одеська', region: '', warehousesCount: 200 },
    { ref: '4', name: 'Дніпро', mainDescription: 'Дніпро', area: 'Дніпропетровська', region: '', warehousesCount: 180 },
    { ref: '5', name: 'Львів', mainDescription: 'Львів', area: 'Львівська', region: '', warehousesCount: 150 },
    { ref: '6', name: 'Запоріжжя', mainDescription: 'Запоріжжя', area: 'Запорізька', region: '', warehousesCount: 120 },
    { ref: '7', name: 'Вінниця', mainDescription: 'Вінниця', area: 'Вінницька', region: '', warehousesCount: 80 },
    { ref: '8', name: 'Полтава', mainDescription: 'Полтава', area: 'Полтавська', region: '', warehousesCount: 70 },
    { ref: '9', name: 'Чернігів', mainDescription: 'Чернігів', area: 'Чернігівська', region: '', warehousesCount: 60 },
    { ref: '10', name: 'Черкаси', mainDescription: 'Черкаси', area: 'Черкаська', region: '', warehousesCount: 55 },
    { ref: '11', name: 'Кривий Ріг', mainDescription: 'Кривий Ріг', area: 'Дніпропетровська', region: '', warehousesCount: 90 },
    { ref: '12', name: 'Миколаїв', mainDescription: 'Миколаїв', area: 'Миколаївська', region: '', warehousesCount: 75 },
    { ref: '13', name: 'Суми', mainDescription: 'Суми', area: 'Сумська', region: '', warehousesCount: 50 },
    { ref: '14', name: 'Хмельницький', mainDescription: 'Хмельницький', area: 'Хмельницька', region: '', warehousesCount: 45 },
    { ref: '15', name: 'Житомир', mainDescription: 'Житомир', area: 'Житомирська', region: '', warehousesCount: 40 },
    { ref: '16', name: 'Рівне', mainDescription: 'Рівне', area: 'Рівненська', region: '', warehousesCount: 35 },
    { ref: '17', name: 'Івано-Франківськ', mainDescription: 'Івано-Франківськ', area: 'Івано-Франківська', region: '', warehousesCount: 40 },
    { ref: '18', name: 'Тернопіль', mainDescription: 'Тернопіль', area: 'Тернопільська', region: '', warehousesCount: 35 },
    { ref: '19', name: 'Луцьк', mainDescription: 'Луцьк', area: 'Волинська', region: '', warehousesCount: 30 },
    { ref: '20', name: 'Ужгород', mainDescription: 'Ужгород', area: 'Закарпатська', region: '', warehousesCount: 25 },
  ];
  
  const lowerQuery = query.toLowerCase();
  return allCities.filter(city => 
    city.name.toLowerCase().includes(lowerQuery) || 
    city.area.toLowerCase().includes(lowerQuery)
  );
}
