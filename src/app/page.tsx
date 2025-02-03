'use client';

import { useState, useEffect, useCallback } from 'react';
import ProductCard from './components/ProductCard';
import CartSidebar from './components/CartSidebar';
import ChatSidebar from './components/ChatSidebar';
import Pagination from './components/Pagination';
import { useDebounce } from '../hooks/useDebounce';
import { Product } from '../../types/globalTypes';

export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [search, setSearch] = useState('');
  const [totalItems, setTotalItems] = useState(0);

  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);

  const [cart, setCart] = useState<Map<string, { product: Product; quantity: number }>>(
    new Map()
  );

  const fetchProducts = async (page: number, searchTerm: string) => {
    try {
      setLoading(true);
      const response = await fetch(
        `/api/products?page=${page}&limit=12&search=${encodeURIComponent(searchTerm)}`
      );
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch products');
      }
      
      setProducts(data.products);
      setTotalPages(data.totalPages);
      setCurrentPage(data.currentPage);
      setTotalItems(data.totalItems);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const debouncedFetch = useDebounce((searchTerm: string) => {
    setCurrentPage(1);
    fetchProducts(1, searchTerm);
  }, 500);

  useEffect(() => {
    debouncedFetch(search);
  }, [search]);

  useEffect(() => {
    if (currentPage !== 1) {
      fetchProducts(currentPage, search);
    }
  }, [currentPage]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };

  const handleAddToCart = (product: Product) => {
    setCart(prevCart => {
      const newCart = new Map(prevCart);
      const existing = newCart.get(product._id);
      newCart.set(product._id, {
        product,
        quantity: (existing?.quantity || 0) + 1
      });
      return newCart;
    });
  };

  const handleUpdateCartQuantity = (id: string, change: number) => {
    setCart(prevCart => {
      const newCart = new Map(prevCart);
      const item = newCart.get(id);
      
      if (item) {
        const newQuantity = item.quantity + change;
        if (newQuantity <= 0) {
          newCart.delete(id);
        } else {
          newCart.set(id, {
            ...item,
            quantity: newQuantity
          });
        }
      }
      return newCart;
    });
  };

  const handleRemoveItem = (id: string) => {
    setCart(prevCart => {
      const newCart = new Map(prevCart);
      newCart.delete(id);
      return newCart;
    });
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row items-center justify-between mb-8 gap-4">
        <div className="flex-1 w-full md:w-auto max-w-md">
          <div className="relative">
            <input
              type="text"
              placeholder="Search products..."
              value={search}
              onChange={handleSearchChange}
              className="w-full p-2 pl-10 border rounded-md"
            />
            <svg
              className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
        </div>
        
        <div className="text-sm text-gray-600">
          {totalItems > 0 && !loading && (
            <span>
              Showing {(currentPage - 1) * 12 + 1} -{" "}
              {Math.min(currentPage * 12, totalItems)} of {totalItems} products
            </span>
          )}
        </div>

        <div className="flex gap-2 ml-4">
          <button
            onClick={() => setIsCartOpen(true)}
            className="relative p-2 text-gray-600 hover:text-gray-800"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
            {cart.size > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-5 h-5 text-xs flex items-center justify-center">
                {cart.size}
              </span>
            )}
          </button>
          <button
            onClick={() => setIsChatOpen(true)}
            className="p-2 text-gray-600 hover:text-gray-800"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
          </button>
        </div>
      </div>

      <div className="relative">
        {!loading && products.length === 0 && (
          <div className="text-center py-10">
            <p className="text-gray-600">No products found{search ? ` for "${search}"` : ''}.</p>
          </div>
        )}

        <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6`}>
          {loading ? (
            <div className="col-span-full text-center py-20">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-t-blue-500 border-gray-200"></div>
              <p className="mt-2 text-gray-600">Loading products...</p>
            </div>
          ) : (
            products.map((product) => (
              <ProductCard
                key={product._id}
                product={product}
                onAddToCart={handleAddToCart}
              />
            ))
          )}
        </div>

        {(totalPages > 1 || search) && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
            loading={loading}
          />
        )}

        {isCartOpen && (
          <CartSidebar
            cart={cart}
            onClose={() => setIsCartOpen(false)}
            onUpdateQuantity={handleUpdateCartQuantity}
            onRemoveItem={handleRemoveItem}
          />
        )}

        {isChatOpen && (
          <ChatSidebar
            onClose={() => setIsChatOpen(false)}
            onAddToCart={handleAddToCart}
          />
        )}
      </div>
    </div>
  );
}