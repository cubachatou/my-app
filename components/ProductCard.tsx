'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Product } from '@/lib/types';
import { useState } from 'react';

interface ProductCardProps {
  product: Product;
  index?: number;
}

export default function ProductCard({ product, index = 0 }: ProductCardProps) {
  const [selectedColorIndex, setSelectedColorIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [imageError, setImageError] = useState(false);
  
  const currentColor = product.colors[selectedColorIndex];

  return (
    <Link 
      href={`/product/${product.slug}`}
      className="group block"
      style={{ animationDelay: `${index * 100}ms` }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <article className="relative bg-gradient-to-b from-stone-900 to-stone-950 rounded-2xl overflow-hidden border border-amber-900/10 hover:border-amber-500/30 transition-all duration-500 animate-fade-in-up hover:-translate-y-2 hover:shadow-xl hover:shadow-amber-500/10">
        {/* Image Container */}
        <div className="relative aspect-square overflow-hidden bg-gradient-to-br from-stone-800 to-stone-900">
          {/* Decorative Elements */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(217,119,6,0.1),transparent_70%)] opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          
          {/* Product Image */}
          {currentColor.image && !imageError ? (
            <div className="absolute inset-0 transition-transform duration-700 ease-out group-hover:scale-110">
              <Image
                src={currentColor.image}
                alt={`${product.name} - ${currentColor.name}`}
                fill
                className="object-cover opacity-90 group-hover:opacity-100 transition-opacity duration-500"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                onError={() => setImageError(true)}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/20 to-transparent" />
            </div>
          ) : (
            <div 
              className="absolute inset-8 rounded-2xl flex items-center justify-center transition-all duration-500 group-hover:scale-105"
              style={{ 
                backgroundColor: `${currentColor.hex}15`,
                boxShadow: isHovered ? `0 0 60px ${currentColor.hex}30` : 'none'
              }}
            >
              <div 
                className="w-3/4 h-3/4 rounded-xl flex items-center justify-center transition-transform duration-500 group-hover:rotate-3"
                style={{ backgroundColor: currentColor.hex }}
              >
                <svg className="w-16 h-16 text-stone-950/30" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z"/>
                </svg>
              </div>
            </div>
          )}

          {/* Category Badge */}
          <div className="absolute top-4 left-4">
            <span className="px-3 py-1 bg-stone-950/80 backdrop-blur-sm rounded-full text-[10px] uppercase tracking-wider text-amber-400 border border-amber-500/20">
              {product.category === 'sopilka' && 'Сопілка'}
              {product.category === 'ocarina' && 'Окаріна'}
              {product.category === 'pan-flute' && 'Флейта Пана'}
              {product.category === 'dudka' && 'Дудка'}
            </span>
          </div>

          {/* Hover Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          
          {/* Quick View Button */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-4 group-hover:translate-y-0">
            <span className="px-6 py-2 bg-amber-500 text-stone-950 rounded-full text-sm font-medium inline-flex items-center gap-2 hover:bg-amber-400 transition-colors">
              Детальніше
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Title & Price */}
          <div className="flex items-start justify-between gap-4 mb-3">
            <h3 className="text-lg font-semibold text-amber-50 group-hover:text-amber-400 transition-colors">
              {product.name}
            </h3>
            <span className="text-lg font-bold text-amber-500 whitespace-nowrap">
              {product.price} ₴
            </span>
          </div>

          {/* Description */}
          <p className="text-sm text-amber-100/50 mb-4 line-clamp-2">
            {product.description}
          </p>

          {/* Color Options */}
          <div className="flex items-center gap-2" onClick={(e) => e.preventDefault()}>
            <span className="text-xs text-amber-100/30 mr-1">Колір:</span>
            {product.colors.map((color, idx) => (
              <button
                key={color.id}
                onClick={(e) => {
                  e.preventDefault();
                  setSelectedColorIndex(idx);
                }}
                className={`w-6 h-6 rounded-full border-2 transition-all duration-300 hover:scale-110 ${
                  idx === selectedColorIndex 
                    ? 'border-amber-400 ring-2 ring-amber-400/30' 
                    : 'border-stone-700 hover:border-amber-500/50'
                }`}
                style={{ backgroundColor: color.hex }}
                title={color.name}
              />
            ))}
          </div>
        </div>

        {/* Decorative corner */}
        <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-amber-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      </article>
    </Link>
  );
}
