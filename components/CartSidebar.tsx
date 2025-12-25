'use client';

import { useCart } from '@/lib/cart-context';
import { getProductById } from '@/lib/data';
import Link from 'next/link';

export default function CartSidebar() {
  const { state, closeCart, removeItem, updateQuantity, getCartTotal } = useCart();

  if (!state.isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-stone-950/80 backdrop-blur-sm z-50 animate-fade-in"
        onClick={closeCart}
      />
      
      {/* Sidebar */}
      <div className="fixed top-0 right-0 h-full w-full max-w-md bg-stone-900 border-l border-amber-900/20 z-50 flex flex-col animate-slide-in-right">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-amber-900/20">
          <div className="flex items-center gap-3">
            <svg className="w-6 h-6 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
            <h2 className="text-xl font-semibold text-amber-50">Кошик</h2>
          </div>
          <button
            onClick={closeCart}
            className="w-10 h-10 rounded-full bg-stone-800 hover:bg-stone-700 flex items-center justify-center text-amber-100/70 hover:text-amber-50 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto p-6">
          {state.items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <div className="w-24 h-24 rounded-full bg-amber-500/10 flex items-center justify-center mb-6">
                <svg className="w-12 h-12 text-amber-500/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-amber-100 mb-2">Кошик порожній</h3>
              <p className="text-amber-100/50 text-sm mb-6">
                Додайте товари, щоб оформити замовлення
              </p>
              <button
                onClick={closeCart}
                className="px-6 py-2 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 rounded-full text-amber-400 text-sm transition-colors"
              >
                Продовжити покупки
              </button>
            </div>
          ) : (
            <ul className="space-y-4">
              {state.items.map((item) => {
                const product = getProductById(item.productId);
                if (!product) return null;
                
                const color = product.colors.find(c => c.id === item.colorId);
                
                return (
                  <li 
                    key={`${item.productId}-${item.colorId}`}
                    className="flex gap-4 p-4 bg-stone-800/50 rounded-xl border border-amber-900/10"
                  >
                    {/* Product Image */}
                    <div 
                      className="w-20 h-20 rounded-lg flex-shrink-0 flex items-center justify-center"
                      style={{ backgroundColor: `${color?.hex || '#444'}20` }}
                    >
                      <div 
                        className="w-12 h-12 rounded-md"
                        style={{ backgroundColor: color?.hex || '#444' }}
                      />
                    </div>

                    {/* Product Info */}
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-medium text-amber-50 mb-1 truncate">
                        {product.name}
                      </h4>
                      <p className="text-xs text-amber-100/50 mb-2">
                        Колір: {color?.name || 'Не вказано'}
                      </p>
                      
                      {/* Quantity & Price */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => updateQuantity(item.productId, item.colorId, item.quantity - 1)}
                            className="w-7 h-7 rounded-full bg-stone-700 hover:bg-stone-600 flex items-center justify-center text-amber-100/70 transition-colors"
                          >
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                            </svg>
                          </button>
                          <span className="text-sm text-amber-100 w-6 text-center">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.productId, item.colorId, item.quantity + 1)}
                            className="w-7 h-7 rounded-full bg-stone-700 hover:bg-stone-600 flex items-center justify-center text-amber-100/70 transition-colors"
                          >
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                            </svg>
                          </button>
                        </div>
                        <span className="text-sm font-semibold text-amber-400">
                          {product.price * item.quantity} ₴
                        </span>
                      </div>
                    </div>

                    {/* Remove Button */}
                    <button
                      onClick={() => removeItem(item.productId, item.colorId)}
                      className="w-8 h-8 rounded-full hover:bg-red-500/20 flex items-center justify-center text-amber-100/30 hover:text-red-400 transition-colors self-start"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        {/* Footer */}
        {state.items.length > 0 && (
          <div className="p-6 border-t border-amber-900/20 bg-stone-900/50">
            {/* Total */}
            <div className="flex items-center justify-between mb-6">
              <span className="text-amber-100/70">Разом:</span>
              <span className="text-2xl font-bold text-amber-400">{getCartTotal()} ₴</span>
            </div>

            {/* Actions */}
            <div className="space-y-3">
              <Link
                href="/checkout"
                onClick={closeCart}
                className="block w-full py-3 bg-amber-500 hover:bg-amber-400 text-stone-950 font-semibold rounded-full text-center transition-colors"
              >
                Оформити замовлення
              </Link>
              <button
                onClick={closeCart}
                className="block w-full py-3 bg-stone-800 hover:bg-stone-700 text-amber-100/70 font-medium rounded-full text-center transition-colors"
              >
                Продовжити покупки
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
