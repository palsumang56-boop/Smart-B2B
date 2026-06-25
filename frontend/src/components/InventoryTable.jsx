import { useState } from 'react';

export default function InventoryTable() {
  // Inventory state ko update karne ke liye setInventory add kiya
  const [inventory, setInventory] = useState([
    { _id: '1', sku: 'SKU-1001', name: 'Premium Rice 50kg', stockQuantity: 450, unitPrice: 45.00 },
    { _id: '2', sku: 'SKU-1002', name: 'Refined Oil 15L', stockQuantity: 12, unitPrice: 28.50 },
    { _id: '3', sku: 'SKU-1003', name: 'Whole Wheat Flour 10kg', stockQuantity: 0, unitPrice: 12.00 },
  ]);

  // Modal kholne/band karne aur form data ke liye naye states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newItem, setNewItem] = useState({ sku: '', name: '', unitPrice: '', stockQuantity: '' });

  // Form submit handle karne ka function
  const handleAddStock = (e) => {
    e.preventDefault();
    
    // Naya object banayein
    const productToAdd = {
      _id: Math.random().toString(), // Abhi ke liye dummy ID
      sku: newItem.sku,
      name: newItem.name,
      unitPrice: parseFloat(newItem.unitPrice),
      stockQuantity: parseInt(newItem.stockQuantity)
    };

    // Table mein naya item add karein
    setInventory([productToAdd, ...inventory]);
    
    // Form reset aur Modal band karein
    setNewItem({ sku: '', name: '', unitPrice: '', stockQuantity: '' });
    setIsModalOpen(false);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden relative">
      <div className="p-4 border-b bg-gray-50 flex justify-between items-center">
        <h3 className="font-bold text-gray-800">Current Inventory</h3>
        {/* Button par onClick lagaya */}
        <button 
          onClick={() => setIsModalOpen(true)}
          className="text-sm bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 transition"
        >
          + Add Stock
        </button>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 text-gray-600 text-sm border-b">
              <th className="p-3 font-semibold">SKU</th>
              <th className="p-3 font-semibold">Product Name</th>
              <th className="p-3 font-semibold">Unit Price</th>
              <th className="p-3 font-semibold">Stock Level</th>
              <th className="p-3 font-semibold">Status</th>
            </tr>
          </thead>
          <tbody>
            {inventory.map((item) => (
              <tr key={item._id} className="border-b hover:bg-gray-50 transition">
                <td className="p-3 text-sm font-mono text-gray-500">{item.sku}</td>
                <td className="p-3 text-sm font-medium text-gray-800">{item.name}</td>
                <td className="p-3 text-sm text-gray-600">${item.unitPrice.toFixed(2)}</td>
                <td className="p-3 text-sm font-bold text-gray-700">{item.stockQuantity}</td>
                <td className="p-3">
                  {item.stockQuantity > 50 ? (
                    <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">Healthy</span>
                  ) : item.stockQuantity > 0 ? (
                    <span className="bg-orange-100 text-orange-800 text-xs px-2 py-1 rounded-full">Low Stock</span>
                  ) : (
                    <span className="bg-red-100 text-red-800 text-xs px-2 py-1 rounded-full">Out of Stock</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* --- ADD STOCK MODAL --- */}
      {isModalOpen && (
        <div className="absolute top-0 left-0 w-full h-full bg-black bg-opacity-50 flex justify-center items-center p-4">
          <div className="bg-white p-6 rounded shadow-lg w-96">
            <h2 className="text-xl font-bold mb-4">Add New Stock</h2>
            <form onSubmit={handleAddStock} className="space-y-3">
              <input required type="text" placeholder="SKU (e.g. SKU-1004)" className="w-full border p-2 rounded" 
                value={newItem.sku} onChange={(e) => setNewItem({...newItem, sku: e.target.value})} />
              
              <input required type="text" placeholder="Product Name" className="w-full border p-2 rounded"
                value={newItem.name} onChange={(e) => setNewItem({...newItem, name: e.target.value})} />
              
              <input required type="number" step="0.01" placeholder="Unit Price ($)" className="w-full border p-2 rounded"
                value={newItem.unitPrice} onChange={(e) => setNewItem({...newItem, unitPrice: e.target.value})} />
              
              <input required type="number" placeholder="Stock Quantity" className="w-full border p-2 rounded"
                value={newItem.stockQuantity} onChange={(e) => setNewItem({...newItem, stockQuantity: e.target.value})} />
              
              <div className="flex gap-2 mt-4">
                <button type="button" onClick={() => setIsModalOpen(false)} className="w-1/2 bg-gray-300 p-2 rounded">Cancel</button>
                <button type="submit" className="w-1/2 bg-blue-600 text-white p-2 rounded hover:bg-blue-700">Save Item</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}