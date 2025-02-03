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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    setLoading(true);
    try {
      const response = await fetch('/api/chat-search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message })
      });
      
      const data = await response.json();
      if (data.error) {
        throw new Error(data.error);
      }
      
      setResults(data.products);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed right-0 top-0 h-full w-80 bg-white shadow-lg p-6 overflow-y-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold">Chat Search</h2>
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
          placeholder='Try "Find SKU 12345" or "Show electronics under $50"'
          className="w-full p-2 border rounded-md mb-2"
        />
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors disabled:bg-blue-400"
        >
          {loading ? 'Searching...' : 'Search'}
        </button>
      </form>

      <div className="space-y-4">
        {results.map((product) => (
          <div key={product['Variant SKU']} className="border rounded-lg p-4">
            <div className="flex gap-4">
              <img
                src={product['Image Src'] || '/placeholder-image.jpg'}
                alt={product.Title}
                className="w-20 h-20 object-cover rounded"
              />
              <div>
                <h3 className="font-medium">{product.Title}</h3>
                <p className="text-sm text-gray-600">
                  SKU: {product['Variant SKU']}
                </p>
                <p className="font-bold">${product['Variant Price']}</p>
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
    </div>
  );
}