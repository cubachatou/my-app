'use client';

import Link from 'next/link';
import { useCart } from '@/lib/cart-context';

export default function Header() {
  const { openCart, getCartCount } = useCart();
  const cartCount = getCartCount();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-stone-950/90 backdrop-blur-md border-b border-amber-900/20">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <nav className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="group flex items-center gap-3">
            <div className="relative">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center shadow-lg shadow-amber-500/20 group-hover:shadow-amber-500/40 transition-shadow">
                <svg className="w-5 h-5 text-stone-950" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                </svg>
              </div>
              <div className="absolute -inset-1 bg-amber-500/20 rounded-full blur opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-bold tracking-wider text-amber-50 font-display">
                СОПІЛКА
              </span>
              <span className="text-[10px] tracking-[0.3em] text-amber-500/70 uppercase">
                3D Print Studio
              </span>
            </div>
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center gap-8">
            <Link 
              href="/" 
              className="text-sm tracking-wide text-amber-100/70 hover:text-amber-400 transition-colors uppercase"
            >
              Каталог
            </Link>
            <Link 
              href="/about" 
              className="text-sm tracking-wide text-amber-100/70 hover:text-amber-400 transition-colors uppercase"
            >
              Про нас
            </Link>
            <Link 
              href="/contacts" 
              className="text-sm tracking-wide text-amber-100/70 hover:text-amber-400 transition-colors uppercase"
            >
              Контакти
            </Link>
          </div>

          {/* Cart Button */}
          <button
            onClick={openCart}
            className="relative group flex items-center gap-2 px-4 py-2 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 rounded-full transition-all"
          >
            <svg className="w-5 h-5 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
            <span className="text-sm text-amber-100/90 hidden sm:inline">Кошик</span>
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-amber-500 text-stone-950 text-xs font-bold rounded-full flex items-center justify-center animate-bounce-in">
                {cartCount}
              </span>
            )}
          </button>
        </nav>
      </div>
    </header>
  );
}
