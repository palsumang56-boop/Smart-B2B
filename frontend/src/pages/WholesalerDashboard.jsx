import { useEffect, useState } from 'react';
import { useSocket } from '../hooks/useSocket';
import InventoryTable from '../components/InventoryTable';
import CreditLedger from '../components/CreditLedger';

export default function WholesalerDashboard() {
  const socket = useSocket();
  const [liveOrders, setLiveOrders] = useState([]);
  
  // Naya state: Kaunsa retailer click hua hai
  const [selectedRetailer, setSelectedRetailer] = useState(null);

  useEffect(() => {
    if (!socket) return;
    socket.on('new_order_received', (order) => {
      setLiveOrders((prev) => [order, ...prev]);
    });
    return () => socket.off('new_order_received');
  }, [socket]);

  // Dummy order history function (Jab Backend API banegi toh yahan fetch request aayegi)
  const getMockOrderHistory = (retailerName) => [
    { id: 'ORD-001', date: '2026-06-20', items: '50x Premium Rice 50kg', total: '$2250', status: 'Delivered' },
    { id: 'ORD-002', date: '2026-06-15', items: '20x Refined Oil 15L', total: '$570', status: 'Delivered' },
    { id: 'ORD-003', date: '2026-06-10', items: '10x Whole Wheat Flour', total: '$120', status: 'Pending Payment' }
  ];

  return (
    <div className="max-w-7xl mx-auto py-6 px-4 relative">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Distributor Control Center</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white border rounded-lg p-6 shadow-sm">
            <h3 className="font-bold text-gray-800 mb-4">Live Fulfillment Pipeline</h3>
            {liveOrders.length === 0 ? (
              <p className="text-gray-400 text-sm italic">Waiting for incoming orders...</p>
            ) : (
              <div className="space-y-3">
                {liveOrders.map((order, index) => (
                  <div key={index} className="p-3 bg-green-50 border border-green-200 rounded text-sm animate-pulse">
                    <span className="font-bold text-green-800">New Order:</span> Retailer {order.retailerId} ordered ${order.orderValue}
                  </div>
                ))}
              </div>
            )}
          </div>
          <InventoryTable />
        </div>

        <div className="lg:col-span-1">
          {/* Prop pass kiya jo ledger se click hone par retailer ka data dega */}
          <CreditLedger onRetailerClick={(retailer) => setSelectedRetailer(retailer)} />
        </div>
      </div>

      {/* --- RETAILER DETAILS MODAL --- */}
      {selectedRetailer && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl overflow-hidden">
            <div className="p-4 border-b bg-gray-50 flex justify-between items-center">
              <div>
                <h2 className="text-xl font-bold text-gray-800">{selectedRetailer.name}</h2>
                <p className="text-sm text-gray-500">{selectedRetailer.email}</p>
              </div>
              <button 
                onClick={() => setSelectedRetailer(null)}
                className="text-gray-500 hover:text-red-500 text-2xl font-bold"
              >
                &times;
              </button>
            </div>
            
            <div className="p-6">
              <div className="flex justify-between mb-6 bg-blue-50 p-4 rounded-lg border border-blue-100">
                <div>
                  <p className="text-sm text-gray-600">Total Outstanding</p>
                  <p className="text-2xl font-bold text-red-600">${selectedRetailer.outstanding}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-600">Available Credit</p>
                  <p className="text-2xl font-bold text-green-600">${selectedRetailer.creditLimit - selectedRetailer.outstanding}</p>
                </div>
              </div>

              <h3 className="font-bold text-gray-800 mb-3">Stock Dispatch History</h3>
              <div className="overflow-x-auto border rounded">
                <table className="w-full text-left text-sm">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="p-2">Order ID</th>
                      <th className="p-2">Date</th>
                      <th className="p-2">Stock Sent</th>
                      <th className="p-2">Value</th>
                      <th className="p-2">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {getMockOrderHistory(selectedRetailer.name).map((order) => (
                      <tr key={order.id} className="border-t hover:bg-gray-50">
                        <td className="p-2 font-mono text-gray-600">{order.id}</td>
                        <td className="p-2">{order.date}</td>
                        <td className="p-2">{order.items}</td>
                        <td className="p-2 font-semibold">{order.total}</td>
                        <td className="p-2">
                          <span className={`px-2 py-1 text-xs rounded-full ${order.status === 'Delivered' ? 'bg-green-100 text-green-800' : 'bg-orange-100 text-orange-800'}`}>
                            {order.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}