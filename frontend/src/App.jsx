// src/App.jsx
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import ProtectedRoute from './components/ProtectedRoute';
import Catalog from './pages/Catalog'; 
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { syncCart } from './store/cartSlice';
import WholesalerDashboard from './pages/WholesalerDashboard';
import Signup from './pages/Signup';
import RetailerDashboard from './pages/RetailerDashboard';
import WholesalerDirectory from './pages/WholesalerDirectory';

function App() {
  const dispatch = useDispatch();
  // --- CROSS-TAB SYNC LISTENER ---
  useEffect(() => {
    const handleStorageChange = (e) => {
      // Only react if the specific cart key was changed
      if (e.key === 'smartb2b_cart') {
        const newCartData = e.newValue ? JSON.parse(e.newValue) : [];
        dispatch(syncCart(newCartData));
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [dispatch]);
  // --------------------------------
  return (
    <BrowserRouter>
      <div className="min-h-screen flex flex-col bg-gray-50">
        <header className="p-4 bg-white shadow-sm">
          <h1 className="text-xl font-bold tracking-tight text-blue-800">SmartB2B</h1>
        </header>
        
        <main className="flex-grow p-4">
          <Routes>
            {/*signup routes */}
            <Route path="/signup" element={<Signup />} />

            {/* Public Routes */}
            <Route path="/" element={<Navigate to="/login" replace />} />
            <Route path="/login" element={<Login />} />

            {/* Retailer Protected Routes */}
            
            {/* NAYA ROUTE: Ye retailer ko wholesalers ki list dikhayega */}
            <Route 
              path="/retailer/wholesalers" 
              element={
                <ProtectedRoute allowedRole="RETAILER">
                  <WholesalerDirectory /> 
                </ProtectedRoute>
              } 
            />

            {/* UPDATED ROUTE: Isme '/:wholesalerId' lagana zaroori hai */}
            <Route 
              path="/retailer/catalog/:wholesalerId" 
              element={
                <ProtectedRoute allowedRole="RETAILER">
                  <Catalog /> 
                </ProtectedRoute>
              } 
            />
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;
