import { useState, useEffect } from 'react';

// Naya prop add kiya: onRetailerClick
export default function CreditLedger({ onRetailerClick }) {
  const [ledgers, setLedgers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRetailers = async () => {
      try {
        const response = await fetch('https://smart-b2b.onrender.com/api/auth/retailers');
        const data = await response.json();
        
        const formattedData = data.map(user => ({
          retailerId: user._id,
          name: user.name, 
          email: user.email, 
          creditLimit: 5000, 
          outstanding: Math.floor(Math.random() * 2000) 
        }));
        
        setLedgers(formattedData);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching retailers:", error);
        setLoading(false);
      }
    };

    fetchRetailers();
  }, []);

  if (loading) return <div className="p-4 text-gray-500">Loading retailer data...</div>;

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4">
      <h3 className="font-bold text-gray-800 mb-4">Retailer Credit Utilization</h3>
      
      {ledgers.length === 0 ? (
        <p className="text-sm text-gray-500">No retailers registered yet.</p>
      ) : (
        <div className="space-y-2">
          {ledgers.map((ledger) => {
            const usagePercent = (ledger.outstanding / ledger.creditLimit) * 100;
            const isDanger = usagePercent > 90;

            return (
              // DIV ko clickable banaya aur hover effect add kiya
              <div 
                key={ledger.retailerId} 
                onClick={() => onRetailerClick(ledger)}
                className="border-b pb-3 pt-2 px-2 last:border-0 cursor-pointer hover:bg-blue-50 rounded transition"
              >
                <div className="flex justify-between text-sm mb-1">
                  <div>
                    <span className="font-medium text-gray-800 block">{ledger.name}</span>
                    <span className="text-xs text-gray-400">{ledger.email}</span>
                  </div>
                  <span className="font-bold text-gray-600">
                    ${ledger.outstanding} / ${ledger.creditLimit}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                  <div 
                    className={`h-2 rounded-full ${isDanger ? 'bg-red-500' : 'bg-blue-500'}`}
                    style={{ width: `${usagePercent}%` }}
                  ></div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
