import { Product } from '../../../types/globalTypes';
import { useState } from 'react';

interface ChatSidebarProps {
  onClose: () => void;
  onAddToCart: (product: Product) => void;
}

export default function ChatSidebar({ onClose, onAddToCart }: ChatSidebarProps) {
  const [message, setMessage] = useState('');
  const [results, setResults] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);

  const handleSubmit = async (e: React.FormEvent, page = 1) => {
    e.preventDefault();
    if (!message.trim()) return;

    setLoading(true);
    try {
      const response = await fetch('/api/chat-search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          message,
          page,
          limit: 32 
        }),
      });

      const data = await response.json();
      if (data.error) {
        throw new Error(data.error);
      }

      setResults(data.products);
      setCurrentPage(data.currentPage);
      setTotalPages(data.totalPages);
      setTotalItems(data.totalItems);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (newPage: number) => {
    handleSubmit(new Event('submit') as any, newPage);
  };

  return (
    <div className="fixed right-0 top-0 h-full w-80 bg-white shadow-lg p-6 overflow-y-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-black">Chat Search</h2>
        <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <form onSubmit={handleSubmit} className="mb-6">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder='Find sku under $15'
          className="w-full p-2 border rounded-md mb-2 text-black"
        />
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors disabled:bg-blue-400"
        >
          {loading ? 'Searching...' : 'Search'}
        </button>
      </form>

      {totalItems > 0 && (
        <p className="text-sm text-gray-600 mb-4">
          Found {totalItems} results
        </p>
      )}
       {totalItems === 0 && (
        <p className="text-sm text-gray-600 mb-4">
        No serach Result Found Please Try Again
        </p>
      )}

      <div className="space-y-4">
        {results.map((product) => (
          <div key={product._id} className="border rounded-lg p-4">
            <div className="flex gap-4">
              <img
                src={product.ImageSrc || '/comingsoon.png'}
                alt={product.Title}
                className="w-20 h-20 object-cover rounded"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = '/comingsoon.png'
                }}
              />
              <div>
                <h3 className="font-medium text-black">{product.Title||"product name missing"}</h3>
               
                <p className="font-bold text-black">${product.VariantPrice||0}</p>
                <button
                  onClick={() => onAddToCart(product)}
                  className="mt-2 bg-blue-600 text-white py-1 px-3 rounded-md text-sm hover:bg-blue-700 transition-colors"
                >
                  Add to Cart
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {totalPages > 1 && (
        <div className="flex justify-center gap-2 mt-6">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="px-3 py-1 border rounded disabled:opacity-50 text-black"
          >
            Previous
          </button>
          <span className="px-3 py-1 text-black">
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="px-3 py-1 border rounded disabled:opacity-50 text-black"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}