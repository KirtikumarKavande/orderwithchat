import { Product } from '../../../types/globalTypes';

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product) => void;
}

export default function ProductCard({ product, onAddToCart }: ProductCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="p-4">
        <img
          src={product["ImageSrc"]|| '/comingsoon.png'}
          alt={product.Title}
          className="w-full h-48 object-cover rounded-md"
          onError={(e) => {
            (e.target as HTMLImageElement).src = '/comingsoon.png'
          }}
          
        />
        <h3 className="mt-4 text-lg font-semibold truncate text-black">{product.Title||"Product Name Missing"}</h3>
        {/* <p className="text-sm text-gray-600">SKU: {product['Variant SKU']}</p> */}
        <p className="mt-2 text-xl font-bold text-black">${product.VariantPrice||0}</p>
        <button
          onClick={() => onAddToCart(product)}
          className="mt-4 w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
        >
          Add to Cart
        </button>
      </div>
    </div>
  );
}