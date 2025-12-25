'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { getProductBySlug, products } from '@/lib/data';
import { useCart } from '@/lib/cart-context';
import ProductCard from '@/components/ProductCard';

export default function ProductPage() {
  const params = useParams();
  const slug = params.slug as string;
  const product = getProductBySlug(slug);
  
  const { addItem, openCart } = useCart();
  
  const [selectedColorIndex, setSelectedColorIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [isAdded, setIsAdded] = useState(false);
  const [imageError, setImageError] = useState(false);

  if (!product) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center animate-[fade-in-up_0.5s_ease-out]">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-amber-50 mb-4">Товар не знайдено</h1>
          <Link href="/" className="text-amber-400 hover:text-amber-300 underline">
            Повернутися на головну
          </Link>
        </div>
      </div>
    );
  }

  const selectedColor = product.colors[selectedColorIndex];
  
  // Get related products (same category, different product)
  const relatedProducts = products
    .filter(p => p.category === product.category && p.id !== product.id)
    .slice(0, 3);

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
      addItem(product.id, selectedColor.id);
    }
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2000);
  };

  const handleBuyNow = () => {
    for (let i = 0; i < quantity; i++) {
      addItem(product.id, selectedColor.id);
    }
    openCart();
  };

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
          <Link href="/#catalog" className="hover:text-amber-400 transition-colors">
            Каталог
          </Link>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
          <span className="text-amber-400">{product.name}</span>
        </nav>
      </div>

      {/* Product Section */}
      <section className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
          {/* Product Gallery */}
          <div className="relative animate-[fade-in-up_0.6s_ease-out]">
            {/* Main Image */}
            <div 
              className="aspect-square rounded-3xl overflow-hidden bg-gradient-to-br from-stone-800 to-stone-900 border border-amber-900/10 relative group"
              style={{ 
                boxShadow: `0 0 100px ${selectedColor.hex}20`
              }}
            >
              {/* Background glow effect */}
              <div 
                className="absolute inset-0 transition-all duration-700"
                style={{ 
                  background: `radial-gradient(ellipse at center, ${selectedColor.hex}15 0%, transparent 70%)`
                }}
              />
              
              {/* Product Image */}
              {selectedColor.image && !imageError ? (
                <div className="absolute inset-0 transition-transform duration-700 ease-out group-hover:scale-105">
                  <Image
                    src={selectedColor.image}
                    alt={`${product.name} - ${selectedColor.name}`}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 50vw"
                    priority
                    onError={() => setImageError(true)}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-stone-950/50 via-transparent to-transparent" />
                </div>
              ) : (
                <div className="absolute inset-12 rounded-2xl flex items-center justify-center transition-all duration-500">
                  <div 
                    className="w-full h-full rounded-2xl flex items-center justify-center transition-all duration-500 transform hover:scale-105"
                    style={{ 
                      backgroundColor: `${selectedColor.hex}20`,
                    }}
                  >
                    <div 
                      className="w-2/3 h-2/3 rounded-xl flex items-center justify-center shadow-2xl transition-all duration-500"
                      style={{ 
                        backgroundColor: selectedColor.hex,
                        boxShadow: `0 25px 80px ${selectedColor.hex}40`
                      }}
                    >
                      <svg className="w-24 h-24 text-stone-950/30" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z"/>
                      </svg>
                    </div>
                  </div>
                </div>
              )}

              {/* Category badge */}
              <div className="absolute top-6 left-6">
                <span className="px-4 py-2 bg-stone-950/80 backdrop-blur-sm rounded-full text-xs uppercase tracking-wider text-amber-400 border border-amber-500/20">
                  {product.category === 'sopilka' && 'Сопілка'}
                  {product.category === 'ocarina' && 'Окаріна'}
                  {product.category === 'pan-flute' && 'Флейта Пана'}
                  {product.category === 'dudka' && 'Дудка'}
                </span>
              </div>
            </div>

            {/* Color Thumbnails */}
            <div className="flex justify-center gap-3 mt-6">
              {product.colors.map((color, idx) => (
                <button
                  key={color.id}
                  onClick={() => setSelectedColorIndex(idx)}
                  className={`w-16 h-16 rounded-xl border-2 transition-all duration-300 flex items-center justify-center ${
                    idx === selectedColorIndex 
                      ? 'border-amber-400 ring-2 ring-amber-400/30 scale-110' 
                      : 'border-stone-700 hover:border-amber-500/50'
                  }`}
                  style={{ backgroundColor: `${color.hex}20` }}
                >
                  <div 
                    className="w-10 h-10 rounded-lg transition-transform"
                    style={{ backgroundColor: color.hex }}
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Product Info */}
          <div className="flex flex-col">
            {/* Title & Price */}
            <div className="mb-6">
              <h1 className="text-3xl md:text-4xl font-bold text-amber-50 mb-2 font-[family-name:var(--font-display)]">
                {product.name}
              </h1>
              <p className="text-amber-100/60 text-lg mb-4">
                {product.description}
              </p>
              <div className="flex items-baseline gap-4">
                <span className="text-4xl font-bold text-amber-400">
                  {product.price} ₴
                </span>
                <span className="text-amber-100/40 text-sm">
                  В наявності
                </span>
              </div>
            </div>

            {/* Color Selection */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-medium text-amber-100/70">
                  Колір: <span className="text-amber-400">{selectedColor.name}</span>
                </span>
              </div>
              <div className="flex flex-wrap gap-3">
                {product.colors.map((color, idx) => (
                  <button
                    key={color.id}
                    onClick={() => setSelectedColorIndex(idx)}
                    className={`group flex items-center gap-3 px-4 py-2 rounded-full border transition-all duration-300 ${
                      idx === selectedColorIndex 
                        ? 'border-amber-400 bg-amber-500/10' 
                        : 'border-stone-700 hover:border-amber-500/50 bg-stone-800/50'
                    }`}
                  >
                    <div 
                      className="w-5 h-5 rounded-full border border-stone-600"
                      style={{ backgroundColor: color.hex }}
                    />
                    <span className={`text-sm ${
                      idx === selectedColorIndex ? 'text-amber-400' : 'text-amber-100/70'
                    }`}>
                      {color.name}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity */}
            <div className="mb-8">
              <span className="text-sm font-medium text-amber-100/70 mb-3 block">
                Кількість
              </span>
              <div className="flex items-center gap-4">
                <div className="flex items-center bg-stone-800/50 border border-stone-700 rounded-full">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-12 h-12 flex items-center justify-center text-amber-100/70 hover:text-amber-400 transition-colors"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                    </svg>
                  </button>
                  <span className="w-12 text-center text-lg font-medium text-amber-50">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-12 h-12 flex items-center justify-center text-amber-100/70 hover:text-amber-400 transition-colors"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                  </button>
                </div>
                <span className="text-amber-100/50 text-sm">
                  Разом: <span className="text-amber-400 font-semibold">{product.price * quantity} ₴</span>
                </span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-4 mb-8">
              <button
                onClick={handleAddToCart}
                disabled={isAdded}
                className={`flex-1 py-4 rounded-full font-semibold transition-all duration-300 flex items-center justify-center gap-2 ${
                  isAdded 
                    ? 'bg-green-500 text-white' 
                    : 'bg-amber-500/10 border border-amber-500/30 text-amber-400 hover:bg-amber-500/20'
                }`}
              >
                {isAdded ? (
                  <>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Додано!
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                    </svg>
                    Додати в кошик
                  </>
                )}
              </button>
              <button
                onClick={handleBuyNow}
                className="flex-1 py-4 bg-amber-500 hover:bg-amber-400 text-stone-950 font-semibold rounded-full transition-all duration-300"
              >
                Купити зараз
              </button>
            </div>

            {/* Features */}
            <div className="border-t border-amber-900/20 pt-8">
              <h3 className="text-sm font-semibold text-amber-400 uppercase tracking-wide mb-4">
                Особливості
              </h3>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {product.features.map((feature, idx) => (
                  <li key={idx} className="flex items-center gap-2 text-amber-100/70 text-sm">
                    <svg className="w-5 h-5 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Description & Specs */}
      <section className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Full Description */}
          <div className="lg:col-span-2">
            <div className="bg-stone-900/50 border border-amber-900/10 rounded-2xl p-8">
              <h2 className="text-xl font-semibold text-amber-50 mb-4 font-[family-name:var(--font-display)]">
                Опис
              </h2>
              <div className="text-amber-100/60 leading-relaxed whitespace-pre-line">
                {product.fullDescription}
              </div>
            </div>
          </div>

          {/* Specs */}
          <div>
            <div className="bg-stone-900/50 border border-amber-900/10 rounded-2xl p-8">
              <h2 className="text-xl font-semibold text-amber-50 mb-4 font-[family-name:var(--font-display)]">
                Характеристики
              </h2>
              <dl className="space-y-4">
                <div className="flex justify-between py-3 border-b border-amber-900/10">
                  <dt className="text-amber-100/50">Матеріал</dt>
                  <dd className="text-amber-100 font-medium">{product.specs.material}</dd>
                </div>
                <div className="flex justify-between py-3 border-b border-amber-900/10">
                  <dt className="text-amber-100/50">Довжина</dt>
                  <dd className="text-amber-100 font-medium">{product.specs.length}</dd>
                </div>
                <div className="flex justify-between py-3 border-b border-amber-900/10">
                  <dt className="text-amber-100/50">Вага</dt>
                  <dd className="text-amber-100 font-medium">{product.specs.weight}</dd>
                </div>
                <div className="flex justify-between py-3">
                  <dt className="text-amber-100/50">Строй</dt>
                  <dd className="text-amber-100 font-medium">{product.specs.tuning}</dd>
                </div>
              </dl>
            </div>

            {/* Delivery Info */}
            <div className="mt-6 bg-amber-500/5 border border-amber-500/20 rounded-2xl p-6">
              <h3 className="text-sm font-semibold text-amber-400 mb-4">Доставка та оплата</h3>
              <ul className="space-y-3 text-sm text-amber-100/60">
                <li className="flex items-start gap-2">
                  <svg className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                  </svg>
                  Нова Пошта по Україні
                </li>
                <li className="flex items-start gap-2">
                  <svg className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Оплата на картку або накладений платіж
                </li>
                <li className="flex items-start gap-2">
                  <svg className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Безкоштовна доставка від 1500₴
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <section className="max-w-7xl mx-auto px-6 py-16 border-t border-amber-900/20">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold text-amber-50 font-[family-name:var(--font-display)]">
              Схожі товари
            </h2>
            <Link 
              href="/#catalog"
              className="text-amber-400 hover:text-amber-300 text-sm flex items-center gap-1 transition-colors"
            >
              Всі товари
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {relatedProducts.map((relatedProduct, index) => (
              <ProductCard key={relatedProduct.id} product={relatedProduct} index={index} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
