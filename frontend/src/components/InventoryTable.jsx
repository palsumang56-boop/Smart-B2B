import { useState, useEffect } from 'react';

export default function InventoryTable() {
  const [inventory, setInventory] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // 1. 'category' field ko state mein add kiya
  const [newItem, setNewItem] = useState({ sku: '', name: '', category: '', unitPrice: '', stockQuantity: '' });

  // 2. Wholesaler ID ko alag-alag possible keys se check karke secure kiya
  const user = JSON.parse(localStorage.getItem('user')) || {};
  const wholesalerId = user._id || user.id || user.wholesalerId;

  useEffect(() => {
    if (!wholesalerId) return;
    
    const fetchLiveInventory = async () => {
      try {
        const res = await fetch(`https://smart-b2b.onrender.com/api/catalog/wholesaler/${wholesalerId}`);
        if (res.ok) {
          const data = await res.json();
          setInventory(data);
        }
      } catch (error) {
        console.error("Error fetching inventory:", error);
      }
    };

    fetchLiveInventory();
  }, [wholesalerId]);

  const handleAddStock = async (e) => {
    e.preventDefault();
    
    if (!wholesalerId) {
      alert("Wholesaler ID not found. Please log in again.");
      return;
    }

    // 3. Payload mein category bhi bhejni hai
    const productToAdd = {
      wholesalerId: wholesalerId,
      sku: newItem.sku,
      name: newItem.name,
      category: newItem.category, // <-- Added category
      unitPrice: parseFloat(newItem.unitPrice),
      stockQuantity: parseInt(newItem.stockQuantity)
    };

    try {
      const res = await fetch('https://smart-b2b.onrender.com/api/catalog', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(productToAdd)
      });

      if (res.ok) {
        const savedProduct = await res.json();
        setInventory([savedProduct, ...inventory]); 
        
        // Reset form & close modal
        setNewItem({ sku: '', name: '', category: '', unitPrice: '', stockQuantity: '' });
        setIsModalOpen(false);
      } else {
        const errData = await res.json();
        alert(`Failed to save: ${errData.error || 'Unknown error'}`);
      }
    } catch (error) {
      console.error("Error saving product:", error);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden relative">
      <div className="p-4 border-b bg-gray-50 flex justify-between items-center">
        <h3 className="font-bold text-gray-800">Current Inventory</h3>
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
              <th className="p-3 font-semibold">Category</th>
              <th className="p-3 font-semibold">Unit Price</th>
              <th className="p-3 font-semibold">Stock Level</th>
              <th className="p-3 font-semibold">Status</th>
            </tr>
          </thead>
          <tbody>
            {inventory.length === 0 ? (
              <tr>
                <td colSpan="6" className="p-4 text-center text-gray-500 italic">No products found. Add some stock!</td>
              </tr>
            ) : (
              inventory.map((item) => (
                <tr key={item._id} className="border-b hover:bg-gray-50 transition">
                  <td className="p-3 text-sm font-mono text-gray-500">{item.sku}</td>
                  <td className="p-3 text-sm font-medium text-gray-800">{item.name}</td>
                  <td className="p-3 text-sm text-gray-600">{item.category}</td>
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
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* --- ADD STOCK MODAL --- */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center p-4 z-[100]">
          <div className="bg-white p-6 rounded shadow-lg w-96">
            <h2 className="text-xl font-bold mb-4">Add New Stock</h2>
            <form onSubmit={handleAddStock} className="space-y-3">
              <input required type="text" placeholder="SKU (e.g. SKU-1004)" className="w-full border p-2 rounded" 
                value={newItem.sku} onChange={(e) => setNewItem({...newItem, sku: e.target.value})} />
              
              <input required type="text" placeholder="Product Name" className="w-full border p-2 rounded"
                value={newItem.name} onChange={(e) => setNewItem({...newItem, name: e.target.value})} />

              {/* 4. Modal mein Category input field jodi gayi hai */}
              <input required type="text" placeholder="Category (e.g. Grains)" className="w-full border p-2 rounded"
                value={newItem.category} onChange={(e) => setNewItem({...newItem, category: e.target.value})} />
              
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
