// src/pages/Catalog.jsx
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom'; // <-- 1. URL se ID nikalne ke liye
import { fetchCatalog } from '../store/catalogSlice'; // <-- 2. Naya function import kiya
import ProductCard from '../components/ProductCard';
import CheckoutSummary from '../components/CheckoutSummary';

export default function Catalog() {
  const dispatch = useDispatch();
  const { wholesalerId } = useParams(); // <-- URL se WHOLE-001 type ki ID extract hogi
  
  // Naye slice ke hisaab se state extract ki
  const { items, status, error } = useSelector((state) => state.catalog);

  // Component load hote hi specific wholesaler ka data fetch karein
  useEffect(() => {
    if (wholesalerId) {
      dispatch(fetchCatalog(wholesalerId));
    }
  }, [dispatch, wholesalerId]);

  return (
    <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Digital Catalog</h1>
        <span className="text-sm text-gray-500">Showing {items?.length || 0} items</span>
      </div>

      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6 text-red-700">
          <p>Error loading catalog: {error}</p>
        </div>
      )}

      {/* Main Layout: Grid on the Left, Cart on the Right */}
      <div className="flex flex-col lg:flex-row gap-8">
        
        {/* Left Side: Product Grid (Takes up 75% width on large screens) */}
        <div className="lg:w-3/4">
          
          {status === 'loading' ? (
             <div className="py-8 flex justify-center">
               <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
             </div>
          ) : items.length === 0 ? (
            <div className="text-center py-10 bg-gray-50 border rounded-lg">
              <p className="text-gray-500">This wholesaler hasn't added any products yet.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {items.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          )}
        </div>

        {/* Right Side: Smart Cart Sidebar (Takes up 25% width on large screens) */}
        <div className="lg:w-1/4">
          <CheckoutSummary />
        </div>

      </div>
    </div>
  );
}