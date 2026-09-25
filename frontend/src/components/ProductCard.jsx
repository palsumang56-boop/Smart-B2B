import { useDispatch } from 'react-redux';
import { addToCart } from '../store/cartSlice';

export default function ProductCard({ product }) {
  const dispatch = useDispatch(); // Initialize dispatcher

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition">
      
      <div className="p-4">
        {/* --- PRODUCT DETAILS (Fixed Variables) --- */}
        <div className="mb-2">
          {/* Category */}
          <span className="text-xs font-semibold text-blue-600 uppercase tracking-wider">
            {product.category || 'General'}
          </span>
          
          {/* Product Name */}
          <h3 className="text-lg font-bold text-gray-900 mt-1">
            {product.name || 'Unknown Product'}
          </h3>
          
          {/* SKU */}
          <p className="text-xs text-gray-400 font-mono mt-1">
            SKU: {product.sku || 'N/A'}
          </p>
        </div>

        {/* Price & Stock info */}
        <div className="flex justify-between items-center mt-4 mb-2">
          <span className="text-xl font-bold text-gray-900">
            ${product.unitPrice ? product.unitPrice.toFixed(2) : '0.00'}
          </span>
          <span className={`text-sm font-medium ${product.stockQuantity > 0 ? 'text-green-600' : 'text-red-500'}`}>
            {product.stockQuantity > 0 ? `${product.stockQuantity} in stock` : 'Out of Stock'}
          </span>
        </div>
        
        {/* --- ADD TO CART BUTTON --- */}
        <button 
          className="w-full mt-4 bg-gray-900 text-white py-2 rounded hover:bg-gray-800 transition disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={product.stockQuantity === 0}
          onClick={() => dispatch(addToCart(product))}
        >
          {product.stockQuantity > 0 ? 'Add to Cart' : 'Out of Stock'}
        </button>
      </div>
    </div>
  );
}
