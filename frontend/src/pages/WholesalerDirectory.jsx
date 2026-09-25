import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function WholesalerDirectory() {
  const [wholesalers, setWholesalers] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    // Apne backend se wholesalers ki list fetch karein
    const fetchWholesalers = async () => {
      try {
        const response = await fetch('https://smart-b2b.onrender.com/api/auth/wholesalers'); 
        const data = await response.json();
        setWholesalers(data);
      } catch (error) {
        console.error("Error fetching wholesalers:", error);
      }
    };
    fetchWholesalers();
  }, []);

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">Select a Wholesaler</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {wholesalers.map((ws) => (
          <div 
            key={ws._id} 
            onClick={() => navigate(`/retailer/catalog/${ws._id}`)}
            className="p-6 bg-white rounded-lg shadow cursor-pointer hover:shadow-md border border-gray-200 transition"
          >
            <h3 className="text-lg font-bold text-blue-600">{ws.name}</h3>
            <p className="text-sm text-gray-500">{ws.email}</p>
            <button className="mt-4 text-sm bg-gray-100 px-3 py-1 rounded">
              View Catalog →
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
