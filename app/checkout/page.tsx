'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import { useCart } from '@/lib/cart-context';
import { getProductById } from '@/lib/data';
import { OrderForm } from '@/lib/types';

interface City {
  ref: string;
  name: string;
  mainDescription?: string;
  area?: string;
  region?: string;
  warehousesCount?: number;
  postcode?: string;
}

interface Warehouse {
  ref: string;
  description: string;
  shortAddress?: string;
  number: string;
  type?: string;
}

interface UkrPoshtaOffice {
  id: string;
  name: string;
  address: string;
  postcode: string;
  type: string;
}

// Debounce hook
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

export default function CheckoutPage() {
  const { state, removeItem, updateQuantity, getCartTotal, clearCart } = useCart();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [orderNumber, setOrderNumber] = useState('');
  
  const [formData, setFormData] = useState<OrderForm>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    city: '',
    address: '',
    comment: '',
    deliveryMethod: 'nova_poshta',
    paymentMethod: 'card'
  });

  const [errors, setErrors] = useState<Partial<Record<keyof OrderForm, string>>>({});
  
  // City autocomplete state
  const [citySearch, setCitySearch] = useState('');
  const [cities, setCities] = useState<City[]>([]);
  const [showCityDropdown, setShowCityDropdown] = useState(false);
  const [selectedCityRef, setSelectedCityRef] = useState('');
  const [loadingCities, setLoadingCities] = useState(false);
  
  // Warehouse/office autocomplete state
  const [warehouseSearch, setWarehouseSearch] = useState('');
  const [warehouses, setWarehouses] = useState<Warehouse[]>([]);
  const [ukrPoshtaOffices, setUkrPoshtaOffices] = useState<UkrPoshtaOffice[]>([]);
  const [showWarehouseDropdown, setShowWarehouseDropdown] = useState(false);
  const [loadingWarehouses, setLoadingWarehouses] = useState(false);
  
  const cityInputRef = useRef<HTMLInputElement>(null);
  const warehouseInputRef = useRef<HTMLInputElement>(null);
  const cityDropdownRef = useRef<HTMLDivElement>(null);
  const warehouseDropdownRef = useRef<HTMLDivElement>(null);
  
  const debouncedCitySearch = useDebounce(citySearch, 300);
  const debouncedWarehouseSearch = useDebounce(warehouseSearch, 300);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (cityDropdownRef.current && !cityDropdownRef.current.contains(event.target as Node) &&
          cityInputRef.current && !cityInputRef.current.contains(event.target as Node)) {
        setShowCityDropdown(false);
      }
      if (warehouseDropdownRef.current && !warehouseDropdownRef.current.contains(event.target as Node) &&
          warehouseInputRef.current && !warehouseInputRef.current.contains(event.target as Node)) {
        setShowWarehouseDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Search cities based on delivery method
  const searchCities = useCallback(async (query: string) => {
    if (query.length < 2) {
      setCities([]);
      return;
    }

    setLoadingCities(true);
    try {
      const endpoint = formData.deliveryMethod === 'nova_poshta' 
        ? `/api/nova-poshta/cities?q=${encodeURIComponent(query)}`
        : `/api/ukr-poshta/cities?q=${encodeURIComponent(query)}`;
      
      const response = await fetch(endpoint);
      const data = await response.json();
      
      setCities(data.cities || []);
    } catch (error) {
      console.error('Error searching cities:', error);
      setCities([]);
    } finally {
      setLoadingCities(false);
    }
  }, [formData.deliveryMethod]);

  // Search warehouses/offices
  const searchWarehouses = useCallback(async (query: string = '') => {
    if (!selectedCityRef && !formData.city) {
      setWarehouses([]);
      setUkrPoshtaOffices([]);
      return;
    }

    setLoadingWarehouses(true);
    try {
      if (formData.deliveryMethod === 'nova_poshta') {
        const params = new URLSearchParams();
        if (selectedCityRef) params.append('cityRef', selectedCityRef);
        if (formData.city) params.append('cityName', formData.city);
        if (query) params.append('q', query);
        
        const response = await fetch(`/api/nova-poshta/warehouses?${params.toString()}`);
        const data = await response.json();
        setWarehouses(data.warehouses || []);
      } else if (formData.deliveryMethod === 'ukr_poshta') {
        const params = new URLSearchParams();
        params.append('cityName', formData.city);
        if (query) params.append('q', query);
        
        const response = await fetch(`/api/ukr-poshta/offices?${params.toString()}`);
        const data = await response.json();
        setUkrPoshtaOffices(data.offices || []);
      }
    } catch (error) {
      console.error('Error searching warehouses:', error);
      setWarehouses([]);
      setUkrPoshtaOffices([]);
    } finally {
      setLoadingWarehouses(false);
    }
  }, [selectedCityRef, formData.city, formData.deliveryMethod]);

  // Fetch cities when search changes
  useEffect(() => {
    if (debouncedCitySearch) {
      searchCities(debouncedCitySearch);
    }
  }, [debouncedCitySearch, searchCities]);

  // Fetch warehouses when city or warehouse search changes
  useEffect(() => {
    if (formData.deliveryMethod !== 'pickup' && (selectedCityRef || formData.city)) {
      searchWarehouses(debouncedWarehouseSearch);
    }
  }, [selectedCityRef, formData.city, debouncedWarehouseSearch, formData.deliveryMethod, searchWarehouses]);

  // Reset city and warehouse when delivery method changes
  useEffect(() => {
    setFormData(prev => ({ ...prev, city: '', address: '' }));
    setCitySearch('');
    setWarehouseSearch('');
    setSelectedCityRef('');
    setCities([]);
    setWarehouses([]);
    setUkrPoshtaOffices([]);
  }, [formData.deliveryMethod]);

  const handleCitySelect = (city: City) => {
    const cityName = city.mainDescription || city.name;
    setFormData(prev => ({ ...prev, city: cityName, address: '' }));
    setCitySearch(cityName);
    setSelectedCityRef(city.ref);
    setShowCityDropdown(false);
    setWarehouseSearch('');
    setWarehouses([]);
    setUkrPoshtaOffices([]);
    
    if (errors.city) {
      setErrors(prev => ({ ...prev, city: undefined }));
    }
  };

  const handleWarehouseSelect = (warehouse: Warehouse | UkrPoshtaOffice) => {
    const address = 'description' in warehouse ? warehouse.description : `${warehouse.name}, ${warehouse.address}`;
    setFormData(prev => ({ ...prev, address }));
    setWarehouseSearch(address);
    setShowWarehouseDropdown(false);
    
    if (errors.address) {
      setErrors(prev => ({ ...prev, address: undefined }));
    }
  };

  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof OrderForm, string>> = {};
    
    if (!formData.firstName.trim()) newErrors.firstName = "Введіть ім'я";
    if (!formData.lastName.trim()) newErrors.lastName = 'Введіть прізвище';
    if (!formData.email.trim()) {
      newErrors.email = 'Введіть email';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Невірний формат email';
    }
    if (!formData.phone.trim()) {
      newErrors.phone = 'Введіть номер телефону';
    } else if (!/^[\d\s+()-]{10,}$/.test(formData.phone)) {
      newErrors.phone = 'Невірний формат телефону';
    }
    if (formData.deliveryMethod !== 'pickup' && !formData.city.trim()) {
      newErrors.city = 'Оберіть місто';
    }
    if (formData.deliveryMethod !== 'pickup' && !formData.address.trim()) {
      newErrors.address = 'Оберіть відділення';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name as keyof OrderForm]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validate()) return;
    if (state.items.length === 0) return;
    
    setIsSubmitting(true);

    const orderData = {
      ...formData,
      items: state.items.map(item => {
        const product = getProductById(item.productId);
        const color = product?.colors.find(c => c.id === item.colorId);
        return {
          productId: item.productId,
          productName: product?.name || '',
          colorId: item.colorId,
          colorName: color?.name || '',
          quantity: item.quantity,
          price: product?.price || 0
        };
      }),
      total: getCartTotal(),
      createdAt: new Date().toISOString()
    };

    try {
      const orders = JSON.parse(localStorage.getItem('orders') || '[]');
      const newOrderNumber = `SP${Date.now().toString().slice(-8)}`;
      orders.push({ ...orderData, orderNumber: newOrderNumber });
      localStorage.setItem('orders', JSON.stringify(orders));
      
      setOrderNumber(newOrderNumber);
      setIsSuccess(true);
      clearCart();
    } catch (error) {
      console.error('Order submission failed:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center px-6 animate-[fade-in-up_0.6s_ease-out]">
        <div className="max-w-lg mx-auto text-center">
          <div className="w-20 h-20 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-6 animate-[bounce-in_0.5s_ease-out]">
            <svg className="w-10 h-10 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-amber-50 mb-4 font-[family-name:var(--font-display)]">
            Дякуємо за замовлення!
          </h1>
          <p className="text-amber-100/60 mb-2">
            Номер вашого замовлення:
          </p>
          <p className="text-2xl font-bold text-amber-400 mb-6">
            {orderNumber}
          </p>
          <p className="text-amber-100/50 mb-8">
            Наш менеджер зв&apos;яжеться з вами найближчим часом 
            для підтвердження замовлення та уточнення деталей оплати.
          </p>
          <Link 
            href="/"
            className="inline-flex items-center gap-2 px-8 py-4 bg-amber-500 hover:bg-amber-400 text-stone-950 font-semibold rounded-full transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-amber-500/25"
          >
            Повернутися на головну
          </Link>
        </div>
      </div>
    );
  }

  if (state.items.length === 0) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center px-6 animate-[fade-in-up_0.6s_ease-out]">
        <div className="max-w-lg mx-auto text-center">
          <div className="w-20 h-20 rounded-full bg-amber-500/10 flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10 text-amber-500/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-amber-50 mb-4">
            Кошик порожній
          </h1>
          <p className="text-amber-100/50 mb-6">
            Додайте товари до кошика, щоб оформити замовлення
          </p>
          <Link 
            href="/"
            className="inline-flex items-center gap-2 px-6 py-3 bg-amber-500/10 border border-amber-500/30 text-amber-400 rounded-full hover:bg-amber-500/20 transition-all duration-300 hover:-translate-y-1"
          >
            Перейти до каталогу
          </Link>
        </div>
      </div>
    );
  }

  const deliveryPrice = getCartTotal() >= 1500 ? 0 : 70;
  const totalWithDelivery = getCartTotal() + deliveryPrice;

  return (
    <div className="noise-overlay animate-[page-enter_0.4s_ease-out]">
      {/* Breadcrumbs */}
      <div className="max-w-7xl mx-auto px-6 py-4">
        <nav className="flex items-center gap-2 text-sm text-amber-100/50">
          <Link href="/" className="hover:text-amber-400 transition-colors">
            Головна
          </Link>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
          <span className="text-amber-400">Оформлення замовлення</span>
        </nav>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <h1 className="text-3xl font-bold text-amber-50 mb-8 font-[family-name:var(--font-display)]">
          Оформлення замовлення
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Order Form */}
          <div className="lg:col-span-2 space-y-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Contact Info */}
              <div className="bg-stone-900/50 border border-amber-900/10 rounded-2xl p-6 md:p-8 transition-all duration-300 hover:border-amber-900/20">
                <h2 className="text-lg font-semibold text-amber-50 mb-6 flex items-center gap-2">
                  <span className="w-8 h-8 rounded-full bg-amber-500 text-stone-950 flex items-center justify-center text-sm font-bold">1</span>
                  Контактні дані
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="firstName" className="block text-sm text-amber-100/70 mb-2">
                      Ім&apos;я *
                    </label>
                    <input
                      type="text"
                      id="firstName"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleChange}
                      className={`w-full px-4 py-3 bg-stone-800/50 border ${errors.firstName ? 'border-red-500' : 'border-stone-700'} rounded-xl text-amber-50 placeholder:text-amber-100/30 focus:border-amber-500 focus:outline-none transition-all duration-300`}
                      placeholder="Ваше ім'я"
                    />
                    {errors.firstName && <p className="mt-1 text-sm text-red-400">{errors.firstName}</p>}
                  </div>
                  
                  <div>
                    <label htmlFor="lastName" className="block text-sm text-amber-100/70 mb-2">
                      Прізвище *
                    </label>
                    <input
                      type="text"
                      id="lastName"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleChange}
                      className={`w-full px-4 py-3 bg-stone-800/50 border ${errors.lastName ? 'border-red-500' : 'border-stone-700'} rounded-xl text-amber-50 placeholder:text-amber-100/30 focus:border-amber-500 focus:outline-none transition-all duration-300`}
                      placeholder="Ваше прізвище"
                    />
                    {errors.lastName && <p className="mt-1 text-sm text-red-400">{errors.lastName}</p>}
                  </div>
                  
                  <div>
                    <label htmlFor="email" className="block text-sm text-amber-100/70 mb-2">
                      Email *
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className={`w-full px-4 py-3 bg-stone-800/50 border ${errors.email ? 'border-red-500' : 'border-stone-700'} rounded-xl text-amber-50 placeholder:text-amber-100/30 focus:border-amber-500 focus:outline-none transition-all duration-300`}
                      placeholder="your@email.com"
                    />
                    {errors.email && <p className="mt-1 text-sm text-red-400">{errors.email}</p>}
                  </div>
                  
                  <div>
                    <label htmlFor="phone" className="block text-sm text-amber-100/70 mb-2">
                      Телефон *
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className={`w-full px-4 py-3 bg-stone-800/50 border ${errors.phone ? 'border-red-500' : 'border-stone-700'} rounded-xl text-amber-50 placeholder:text-amber-100/30 focus:border-amber-500 focus:outline-none transition-all duration-300`}
                      placeholder="+38 (0__) ___-__-__"
                    />
                    {errors.phone && <p className="mt-1 text-sm text-red-400">{errors.phone}</p>}
                  </div>
                </div>
              </div>

              {/* Delivery */}
              <div className="bg-stone-900/50 border border-amber-900/10 rounded-2xl p-6 md:p-8 transition-all duration-300 hover:border-amber-900/20">
                <h2 className="text-lg font-semibold text-amber-50 mb-6 flex items-center gap-2">
                  <span className="w-8 h-8 rounded-full bg-amber-500 text-stone-950 flex items-center justify-center text-sm font-bold">2</span>
                  Доставка
                </h2>
                
                <div className="space-y-4 mb-6">
                  {[
                    { id: 'nova_poshta', name: 'Нова Пошта', desc: 'Доставка 1-3 дні', icon: '📦' },
                    { id: 'ukr_poshta', name: 'Укрпошта', desc: 'Доставка 3-7 днів', icon: '✉️' },
                    { id: 'pickup', name: 'Самовивіз', desc: 'м. Київ, вул. Хрещатик 1', icon: '🏪' }
                  ].map((method) => (
                    <label
                      key={method.id}
                      className={`flex items-center gap-4 p-4 rounded-xl border cursor-pointer transition-all duration-300 ${
                        formData.deliveryMethod === method.id
                          ? 'border-amber-500 bg-amber-500/10 scale-[1.02]'
                          : 'border-stone-700 hover:border-amber-500/50 hover:bg-stone-800/30'
                      }`}
                    >
                      <input
                        type="radio"
                        name="deliveryMethod"
                        value={method.id}
                        checked={formData.deliveryMethod === method.id}
                        onChange={handleChange}
                        className="sr-only"
                      />
                      <span className="text-2xl">{method.icon}</span>
                      <div className="flex-1">
                        <p className="text-amber-50 font-medium">{method.name}</p>
                        <p className="text-sm text-amber-100/50">{method.desc}</p>
                      </div>
                      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${
                        formData.deliveryMethod === method.id ? 'border-amber-500' : 'border-stone-600'
                      }`}>
                        {formData.deliveryMethod === method.id && (
                          <div className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-[bounce-in_0.3s_ease-out]" />
                        )}
                      </div>
                    </label>
                  ))}
                </div>

                {formData.deliveryMethod !== 'pickup' && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-[fade-in-up_0.3s_ease-out]">
                    {/* City Autocomplete */}
                    <div className="relative">
                      <label htmlFor="city" className="block text-sm text-amber-100/70 mb-2">
                        Місто *
                      </label>
                      <div className="relative">
                        <input
                          ref={cityInputRef}
                          type="text"
                          id="city"
                          value={citySearch}
                          onChange={(e) => {
                            setCitySearch(e.target.value);
                            setShowCityDropdown(true);
                            if (formData.city !== e.target.value) {
                              setFormData(prev => ({ ...prev, city: '', address: '' }));
                              setSelectedCityRef('');
                              setWarehouseSearch('');
                            }
                          }}
                          onFocus={() => citySearch.length >= 2 && setShowCityDropdown(true)}
                          className={`w-full px-4 py-3 bg-stone-800/50 border ${errors.city ? 'border-red-500' : 'border-stone-700'} rounded-xl text-amber-50 placeholder:text-amber-100/30 focus:border-amber-500 focus:outline-none transition-all duration-300 pr-10`}
                          placeholder="Почніть вводити назву міста..."
                          autoComplete="off"
                        />
                        {loadingCities && (
                          <div className="absolute right-3 top-1/2 -translate-y-1/2">
                            <svg className="animate-spin w-5 h-5 text-amber-500" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                            </svg>
                          </div>
                        )}
                        {formData.city && !loadingCities && (
                          <div className="absolute right-3 top-1/2 -translate-y-1/2">
                            <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                          </div>
                        )}
                      </div>
                      
                      {/* City Dropdown */}
                      {showCityDropdown && cities.length > 0 && (
                        <div 
                          ref={cityDropdownRef}
                          className="absolute z-50 w-full mt-2 bg-stone-800 border border-stone-700 rounded-xl shadow-xl max-h-60 overflow-y-auto animate-[fade-in_0.2s_ease-out]"
                        >
                          {cities.map((city) => (
                            <button
                              key={city.ref}
                              type="button"
                              onClick={() => handleCitySelect(city)}
                              className="w-full px-4 py-3 text-left hover:bg-amber-500/10 transition-colors flex items-center gap-3 border-b border-stone-700/50 last:border-b-0"
                            >
                              <svg className="w-5 h-5 text-amber-500/50 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                              </svg>
                              <div>
                                <p className="text-amber-50">{city.mainDescription || city.name}</p>
                                {city.area && (
                                  <p className="text-xs text-amber-100/40">{city.area}</p>
                                )}
                                {city.postcode && (
                                  <p className="text-xs text-amber-100/40">Індекс: {city.postcode}</p>
                                )}
                              </div>
                            </button>
                          ))}
                        </div>
                      )}
                      
                      {errors.city && <p className="mt-1 text-sm text-red-400">{errors.city}</p>}
                    </div>
                    
                    {/* Warehouse/Office Autocomplete */}
                    <div className="relative">
                      <label htmlFor="warehouse" className="block text-sm text-amber-100/70 mb-2">
                        {formData.deliveryMethod === 'nova_poshta' ? 'Відділення Нової Пошти *' : 'Відділення Укрпошти *'}
                      </label>
                      <div className="relative">
                        <input
                          ref={warehouseInputRef}
                          type="text"
                          id="warehouse"
                          value={warehouseSearch}
                          onChange={(e) => {
                            setWarehouseSearch(e.target.value);
                            setShowWarehouseDropdown(true);
                            if (formData.address !== e.target.value) {
                              setFormData(prev => ({ ...prev, address: '' }));
                            }
                          }}
                          onFocus={() => {
                            if (formData.city) {
                              setShowWarehouseDropdown(true);
                              if (!warehouses.length && !ukrPoshtaOffices.length) {
                                searchWarehouses('');
                              }
                            }
                          }}
                          disabled={!formData.city}
                          className={`w-full px-4 py-3 bg-stone-800/50 border ${errors.address ? 'border-red-500' : 'border-stone-700'} rounded-xl text-amber-50 placeholder:text-amber-100/30 focus:border-amber-500 focus:outline-none transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed pr-10`}
                          placeholder={formData.city ? 'Оберіть відділення...' : 'Спочатку оберіть місто'}
                          autoComplete="off"
                        />
                        {loadingWarehouses && (
                          <div className="absolute right-3 top-1/2 -translate-y-1/2">
                            <svg className="animate-spin w-5 h-5 text-amber-500" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                            </svg>
                          </div>
                        )}
                        {formData.address && !loadingWarehouses && (
                          <div className="absolute right-3 top-1/2 -translate-y-1/2">
                            <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                          </div>
                        )}
                      </div>
                      
                      {/* Warehouse Dropdown */}
                      {showWarehouseDropdown && formData.city && (warehouses.length > 0 || ukrPoshtaOffices.length > 0) && (
                        <div 
                          ref={warehouseDropdownRef}
                          className="absolute z-50 w-full mt-2 bg-stone-800 border border-stone-700 rounded-xl shadow-xl max-h-60 overflow-y-auto animate-[fade-in_0.2s_ease-out]"
                        >
                          {formData.deliveryMethod === 'nova_poshta' 
                            ? warehouses.map((wh) => (
                                <button
                                  key={wh.ref}
                                  type="button"
                                  onClick={() => handleWarehouseSelect(wh)}
                                  className="w-full px-4 py-3 text-left hover:bg-amber-500/10 transition-colors border-b border-stone-700/50 last:border-b-0"
                                >
                                  <p className="text-amber-50 text-sm">{wh.description}</p>
                                  {wh.type && (
                                    <span className={`inline-block mt-1 px-2 py-0.5 text-xs rounded ${
                                      wh.type === 'Поштомат' ? 'bg-blue-500/20 text-blue-400' : 'bg-amber-500/20 text-amber-400'
                                    }`}>
                                      {wh.type}
                                    </span>
                                  )}
                                </button>
                              ))
                            : ukrPoshtaOffices.map((office) => (
                                <button
                                  key={office.id}
                                  type="button"
                                  onClick={() => handleWarehouseSelect(office)}
                                  className="w-full px-4 py-3 text-left hover:bg-amber-500/10 transition-colors border-b border-stone-700/50 last:border-b-0"
                                >
                                  <p className="text-amber-50 text-sm">{office.name}</p>
                                  <p className="text-xs text-amber-100/50">{office.address}</p>
                                  <p className="text-xs text-amber-100/40">Індекс: {office.postcode}</p>
                                </button>
                              ))
                          }
                        </div>
                      )}
                      
                      {errors.address && <p className="mt-1 text-sm text-red-400">{errors.address}</p>}
                    </div>
                  </div>
                )}
                
                {formData.deliveryMethod === 'pickup' && (
                  <div className="p-4 bg-amber-500/5 border border-amber-500/20 rounded-xl animate-[fade-in-up_0.3s_ease-out]">
                    <p className="text-amber-50 font-medium mb-1">📍 Адреса самовивозу:</p>
                    <p className="text-amber-100/70">м. Київ, вул. Хрещатик 1</p>
                    <p className="text-sm text-amber-100/50 mt-2">
                      Працюємо: Пн-Пт 10:00-19:00, Сб 11:00-17:00
                    </p>
                  </div>
                )}
              </div>

              {/* Payment */}
              <div className="bg-stone-900/50 border border-amber-900/10 rounded-2xl p-6 md:p-8 transition-all duration-300 hover:border-amber-900/20">
                <h2 className="text-lg font-semibold text-amber-50 mb-6 flex items-center gap-2">
                  <span className="w-8 h-8 rounded-full bg-amber-500 text-stone-950 flex items-center justify-center text-sm font-bold">3</span>
                  Оплата
                </h2>
                
                <div className="space-y-4">
                  {[
                    { id: 'card', name: 'Оплата на картку', desc: 'Переказ на картку ПриватБанк', icon: '💳' },
                    { id: 'cash_on_delivery', name: 'Накладений платіж', desc: 'Оплата при отриманні (+ комісія пошти)', icon: '💵' }
                  ].map((method) => (
                    <label
                      key={method.id}
                      className={`flex items-center gap-4 p-4 rounded-xl border cursor-pointer transition-all duration-300 ${
                        formData.paymentMethod === method.id
                          ? 'border-amber-500 bg-amber-500/10 scale-[1.02]'
                          : 'border-stone-700 hover:border-amber-500/50 hover:bg-stone-800/30'
                      }`}
                    >
                      <input
                        type="radio"
                        name="paymentMethod"
                        value={method.id}
                        checked={formData.paymentMethod === method.id}
                        onChange={handleChange}
                        className="sr-only"
                      />
                      <span className="text-2xl">{method.icon}</span>
                      <div className="flex-1">
                        <p className="text-amber-50 font-medium">{method.name}</p>
                        <p className="text-sm text-amber-100/50">{method.desc}</p>
                      </div>
                      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${
                        formData.paymentMethod === method.id ? 'border-amber-500' : 'border-stone-600'
                      }`}>
                        {formData.paymentMethod === method.id && (
                          <div className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-[bounce-in_0.3s_ease-out]" />
                        )}
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              {/* Comment */}
              <div className="bg-stone-900/50 border border-amber-900/10 rounded-2xl p-6 md:p-8 transition-all duration-300 hover:border-amber-900/20">
                <h2 className="text-lg font-semibold text-amber-50 mb-4">
                  Коментар до замовлення
                </h2>
                <textarea
                  name="comment"
                  value={formData.comment}
                  onChange={handleChange}
                  rows={3}
                  className="w-full px-4 py-3 bg-stone-800/50 border border-stone-700 rounded-xl text-amber-50 placeholder:text-amber-100/30 focus:border-amber-500 focus:outline-none transition-all duration-300 resize-none"
                  placeholder="Додаткові побажання..."
                />
              </div>
            </form>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 bg-stone-900/50 border border-amber-900/10 rounded-2xl p-6 transition-all duration-300 hover:border-amber-900/20">
              <h2 className="text-lg font-semibold text-amber-50 mb-6">
                Ваше замовлення
              </h2>

              {/* Cart Items */}
              <ul className="space-y-4 mb-6 max-h-80 overflow-y-auto">
                {state.items.map((item) => {
                  const product = getProductById(item.productId);
                  if (!product) return null;
                  
                  const color = product.colors.find(c => c.id === item.colorId);
                  
                  return (
                    <li 
                      key={`${item.productId}-${item.colorId}`}
                      className="flex gap-3 pb-4 border-b border-amber-900/10 group"
                    >
                      <div 
                        className="w-16 h-16 rounded-lg flex-shrink-0 flex items-center justify-center transition-transform duration-300 group-hover:scale-105"
                        style={{ backgroundColor: `${color?.hex || '#444'}20` }}
                      >
                        <div 
                          className="w-10 h-10 rounded-md"
                          style={{ backgroundColor: color?.hex || '#444' }}
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-medium text-amber-50 truncate">
                          {product.name}
                        </h4>
                        <p className="text-xs text-amber-100/50">
                          {color?.name} × {item.quantity}
                        </p>
                        <div className="flex items-center justify-between mt-1">
                          <div className="flex items-center gap-1">
                            <button
                              type="button"
                              onClick={() => updateQuantity(item.productId, item.colorId, item.quantity - 1)}
                              className="w-6 h-6 rounded bg-stone-700 hover:bg-stone-600 flex items-center justify-center text-amber-100/70 text-xs transition-colors"
                            >
                              −
                            </button>
                            <span className="w-6 text-center text-sm text-amber-100">
                              {item.quantity}
                            </span>
                            <button
                              type="button"
                              onClick={() => updateQuantity(item.productId, item.colorId, item.quantity + 1)}
                              className="w-6 h-6 rounded bg-stone-700 hover:bg-stone-600 flex items-center justify-center text-amber-100/70 text-xs transition-colors"
                            >
                              +
                            </button>
                          </div>
                          <span className="text-sm font-medium text-amber-400">
                            {product.price * item.quantity} ₴
                          </span>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeItem(item.productId, item.colorId)}
                        className="w-6 h-6 rounded hover:bg-red-500/20 flex items-center justify-center text-amber-100/30 hover:text-red-400 transition-colors self-start"
                      >
                        ×
                      </button>
                    </li>
                  );
                })}
              </ul>

              {/* Totals */}
              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-sm">
                  <span className="text-amber-100/50">Товари</span>
                  <span className="text-amber-100">{getCartTotal()} ₴</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-amber-100/50">Доставка</span>
                  <span className={deliveryPrice === 0 ? 'text-green-400' : 'text-amber-100'}>
                    {deliveryPrice === 0 ? 'Безкоштовно' : `${deliveryPrice} ₴`}
                  </span>
                </div>
                {deliveryPrice > 0 && (
                  <p className="text-xs text-amber-100/40">
                    Безкоштовна доставка від 1500 ₴
                  </p>
                )}
                <div className="pt-3 border-t border-amber-900/20 flex justify-between">
                  <span className="text-amber-100 font-medium">Разом</span>
                  <span className="text-xl font-bold text-amber-400">{totalWithDelivery} ₴</span>
                </div>
              </div>

              {/* Submit Button */}
              <button
                onClick={handleSubmit}
                disabled={isSubmitting || state.items.length === 0}
                className="w-full py-4 bg-amber-500 hover:bg-amber-400 disabled:bg-stone-700 disabled:cursor-not-allowed text-stone-950 font-semibold rounded-full transition-all duration-300 flex items-center justify-center gap-2 hover:-translate-y-1 hover:shadow-lg hover:shadow-amber-500/25 active:scale-95"
              >
                {isSubmitting ? (
                  <>
                    <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Оформлення...
                  </>
                ) : (
                  'Оформити замовлення'
                )}
              </button>

              <p className="text-xs text-amber-100/40 text-center mt-4">
                Натискаючи кнопку, ви погоджуєтесь з{' '}
                <Link href="/terms" className="text-amber-400 hover:underline">
                  умовами використання
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
