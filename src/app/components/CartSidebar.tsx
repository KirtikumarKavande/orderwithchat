import React from 'react';
import { Product } from '../../../types/globalTypes';

interface CartItem {
  product: Product;
  quantity: number;
}

interface CartSidebarProps {
  cart: Map<string, CartItem>;
  onClose: () => void;
  onUpdateQuantity: (id: string, change: number) => void;
  onRemoveItem: (id: string) => void;
}

export default function CartSidebar({ cart, onClose, onUpdateQuantity, onRemoveItem }: CartSidebarProps) {
  const getCartTotal = () => {
    let total = 0;
    cart.forEach(({ product, quantity }) => {
      total += product.VariantPrice * quantity;
    });
    return total.toFixed(2);
  };

  return (
    <>
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 z-40"
        onClick={onClose}
      />
      
      <div className="fixed right-0 top-0 h-full w-80 bg-white shadow-lg p-6 overflow-y-auto z-50">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-green-500">Shopping Cart ({cart.size})</h2>
          <button 
            onClick={onClose} 
            className="text-gray-500 hover:text-gray-700"
            aria-label="Close cart"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {cart.size === 0 ? (
          <p className="text-gray-500">Your cart is empty</p>
        ) : (
          <>
            <div className="space-y-4">
              {Array.from(cart.entries()).map(([id, { product, quantity }]) => (
                <div key={id} className="p-4 border rounded-lg">
                  <div className="flex gap-4">
                    <img
                      src={product.ImageSrc}
                      alt={product.Title}
                      className="w-20 h-20 object-cover rounded"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = '/comingsoon.png'
                      }}
                    />
                    <div className="flex-1">
                      <div className="flex justify-between">
                        <h3 className="font-medium text-blue-800">{product.Title}</h3>
                        <button
                          onClick={() => onRemoveItem(id)}
                          className="text-red-500 hover:text-red-700"
                          aria-label="Remove item"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                      <p className="text-sm text-gray-600">
                        ${product.VariantPrice ? product.VariantPrice.toFixed(2) : 0} × {quantity} = ${(product.VariantPrice * quantity).toFixed(2)}
                      </p>
                      <div className="flex items-center gap-2 mt-2">
                        <button
                          onClick={() => onUpdateQuantity(id, -1)}
                          className="px-2 py-1 border border-red-600 rounded hover:bg-gray-100 text-red-500"
                        >
                          -
                        </button>
                        <span className="w-8 text-center text-black">{quantity}</span>
                        <button
                          onClick={() => onUpdateQuantity(id, 1)}
                          className="px-2 py-1 border text-green-500 rounded hover:bg-gray-100 border-green-800"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mt-6 pt-6 border-t text-black">
              <div className="flex justify-between mb-4">
                <span className="font-bold">Total:</span>
                <span className="font-bold">${getCartTotal()}</span>
              </div>
              <button 
                className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
              >
                Checkout
              </button>
            </div>
          </>
        )}
      </div>
    </>
  );
}