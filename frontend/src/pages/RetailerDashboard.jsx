// src/pages/RetailerDashboard.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function RetailerDashboard() {
  const navigate = useNavigate();

  // 1. Retailer ka apna stock (Dummy Data)
  const [myStock] = useState([
    { id: '1', name: 'Premium Rice 50kg', qty: 2, status: 'Critical' },
    { id: '2', name: 'Refined Oil 15L', qty: 15, status: 'Healthy' },
    { id: '3', name: 'Whole Wheat Flour 10kg', qty: 5, status: 'Low' },
  ]);

  // 2. Wholesalers ki list aur Credit details (Dummy Data)
  const [wholesalers] = useState([
    { id: 'WHOLE-001', name: 'SuperMart Distributors', outstanding: 1200, limit: 5000 },
    { id: 'WHOLE-002', name: 'Global Provisions', outstanding: 4800, limit: 5000 },
    { id: 'WHOLE-003', name: 'Local Traders Co.', outstanding: 0, limit: 2000 },
  ]);

  return (
    <div className="max-w-7xl mx-auto py-6 px-4 space-y-8">
      
      {/* SECTION 1: Retailer's Own Stock */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-4">My Shop Inventory</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {myStock.map(item => (
            <div key={item.id} className="border p-4 rounded-lg flex justify-between items-center">
              <div>
                <p className="font-semibold text-gray-800">{item.name}</p>
                <p className="text-sm text-gray-500">In Stock: <span className="font-bold text-black">{item.qty} units</span></p>
              </div>
              <span className={`text-xs px-2 py-1 rounded-full ${
                item.status === 'Critical' ? 'bg-red-100 text-red-800' : 
                item.status === 'Low' ? 'bg-orange-100 text-orange-800' : 'bg-green-100 text-green-800'
              }`}>
                {item.status}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* SECTION 2: Wholesaler List & Credit */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Order from Wholesalers</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {wholesalers.map(wholesaler => {
            const usagePercent = (wholesaler.outstanding / wholesaler.limit) * 100;
            const isDanger = usagePercent > 90;

            return (
              <div key={wholesaler.id} className="border rounded-lg p-5 hover:shadow-md transition">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="font-bold text-lg text-gray-800">{wholesaler.name}</h3>
                    <p className="text-sm text-gray-500">Credit Used: ${wholesaler.outstanding} / ${wholesaler.limit}</p>
                  </div>
                  <button 
                    // Yahan hum wholesaler ki ID URL mein pass kar rahe hain
                    onClick={() => navigate(`/catalog/${wholesaler.id}`)}
                    className="bg-blue-600 text-white px-4 py-2 rounded text-sm hover:bg-blue-700"
                  >
                    View Catalog & Order
                  </button>
                </div>
                
                {/* Credit Progress Bar */}
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full ${isDanger ? 'bg-red-500' : 'bg-green-500'}`}
                    style={{ width: `${usagePercent}%` }}
                  ></div>
                </div>
                {isDanger && <p className="text-xs text-red-500 mt-2">Nearing credit limit. Settle dues soon.</p>}
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
}