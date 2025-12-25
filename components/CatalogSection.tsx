'use client';

import { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';
import { Product } from '@/lib/types';
import ProductCard from '@/components/ProductCard';

interface CatalogSectionProps {
  products: Product[];
}

const categories = [
  { id: 'all', name: 'Всі' },
  { id: 'sopilka', name: 'Сопілки' },
  { id: 'ocarina', name: 'Окаріни' },
  { id: 'pan-flute', name: 'Флейти Пана' },
  { id: 'dudka', name: 'Дудки' },
];

export default function CatalogSection({ products }: CatalogSectionProps) {
  const [activeCategory, setActiveCategory] = useState('all');
  const gridRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const filtersRef = useRef<HTMLDivElement>(null);
  const hasAnimated = useRef(false);

  const filteredProducts = activeCategory === 'all'
    ? products
    : products.filter((product) => product.category === activeCategory);

  // Initial animation for header and filters
  useEffect(() => {
    if (hasAnimated.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !hasAnimated.current) {
            hasAnimated.current = true;

            // Animate header
            if (headerRef.current) {
              const elements = headerRef.current.children;
              gsap.fromTo(
                elements,
                { opacity: 0, y: 40 },
                {
                  opacity: 1,
                  y: 0,
                  duration: 0.8,
                  stagger: 0.15,
                  ease: 'power3.out',
                }
              );
            }

            // Animate filters
            if (filtersRef.current) {
              const buttons = filtersRef.current.children;
              gsap.fromTo(
                buttons,
                { opacity: 0, y: 20, scale: 0.9 },
                {
                  opacity: 1,
                  y: 0,
                  scale: 1,
                  duration: 0.5,
                  stagger: 0.08,
                  delay: 0.3,
                  ease: 'back.out(1.7)',
                }
              );
            }

            observer.disconnect();
          }
        });
      },
      { threshold: 0.1 }
    );

    if (headerRef.current) {
      observer.observe(headerRef.current);
    }

    return () => observer.disconnect();
  }, []);

  // Animate grid when filter changes
  useEffect(() => {
    if (!gridRef.current) return;

    const items = gridRef.current.children;
    
    // Quick fade out
    gsap.to(items, {
      opacity: 0,
      y: 20,
      scale: 0.95,
      duration: 0.2,
      stagger: 0.02,
      ease: 'power2.in',
      onComplete: () => {
        // Fade in with new items
        gsap.fromTo(
          items,
          { opacity: 0, y: 40, scale: 0.9 },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.5,
            stagger: 0.08,
            ease: 'power3.out',
          }
        );
      },
    });
  }, [activeCategory]);

  return (
    <section id="catalog" className="py-24 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div ref={headerRef} className="text-center mb-16">
          <span className="text-xs uppercase tracking-[0.3em] text-amber-500 mb-4 block opacity-0">
            Наша колекція
          </span>
          <h2 className="text-4xl md:text-5xl font-bold text-amber-50 mb-4 font-[family-name:var(--font-display)] opacity-0">
            Каталог інструментів
          </h2>
          <p className="text-amber-100/50 max-w-xl mx-auto opacity-0">
            Оберіть свій ідеальний інструмент з нашої колекції 
            традиційних українських духових
          </p>
        </div>

        {/* Category Filters */}
        <div ref={filtersRef} className="flex flex-wrap justify-center gap-3 mb-12">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setActiveCategory(category.id)}
              className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-300 transform hover:scale-105 active:scale-95 opacity-0 ${
                activeCategory === category.id
                  ? 'bg-amber-500 text-stone-950 shadow-lg shadow-amber-500/25'
                  : 'bg-stone-800/50 text-amber-100/70 hover:bg-amber-500/10 hover:text-amber-400 border border-amber-900/20'
              }`}
            >
              {category.name}
              {activeCategory === category.id && (
                <span className="ml-2 text-xs bg-stone-950/30 px-2 py-0.5 rounded-full">
                  {category.id === 'all' ? products.length : filteredProducts.length}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Products Grid */}
        <div
          ref={gridRef}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8"
        >
          {filteredProducts.map((product, index) => (
            <div key={product.id} className="opacity-0">
              <ProductCard product={product} index={index} />
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredProducts.length === 0 && (
          <div className="text-center py-16">
            <p className="text-amber-100/50 text-lg">
              Товарів у цій категорії поки немає
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
