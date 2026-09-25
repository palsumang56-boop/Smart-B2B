import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function WholesalerDirectory() {
  const [wholesalers, setWholesalers] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchWholesalers = async () => {
      try {
        const response = await fetch('https://smart-b2b.onrender.com/api/auth/wholesalers'); 
        const data = await response.json();
        setWholesalers(data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching wholesalers:", error);
        setLoading(false);
      }
    };
    fetchWholesalers();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Select a Wholesaler</h2>
      
      {wholesalers.length === 0 ? (
         <div className="text-center py-10 bg-white shadow-sm rounded-lg border">
           <p className="text-gray-500">No wholesalers available right now.</p>
         </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {wholesalers.map((ws) => (
            <div 
              key={ws._id} 
              onClick={() => navigate(`/retailer/catalog/${ws._id}`)}
              className="p-6 bg-white rounded-lg shadow-sm cursor-pointer hover:shadow-md hover:border-blue-300 border border-gray-100 transition"
            >
              <h3 className="text-lg font-bold text-blue-600">{ws.name}</h3>
              <p className="text-sm text-gray-500 mt-1">{ws.email}</p>
              <button className="mt-4 text-sm font-medium bg-gray-50 text-gray-700 px-4 py-2 rounded-md w-full border hover:bg-gray-100 transition">
                View Catalog →
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
