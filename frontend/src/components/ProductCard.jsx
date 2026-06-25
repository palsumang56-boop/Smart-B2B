import { useDispatch } from 'react-redux';
import { addToCart } from '../store/cartSlice';

export default function ProductCard({ product }) {
  const dispatch = useDispatch(); // Initialize dispatcher

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition">
      {/* ... (Keep your existing image, title, and price code) ... */}
      
      <div className="p-4">
        {/* ... */}
        <button 
          className="w-full mt-4 bg-gray-900 text-white py-2 rounded hover:bg-gray-800 transition disabled:opacity-50"
          disabled={product.stockQuantity === 0}
          // --- NEW: Dispatch the action here ---
          onClick={() => dispatch(addToCart(product))}
        >
          {product.stockQuantity > 0 ? 'Add to Cart' : 'Out of Stock'}
        </button>
      </div>
    </div>
  );
}