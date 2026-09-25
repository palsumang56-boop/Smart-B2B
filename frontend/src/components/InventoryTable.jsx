
import React, { useState, useEffect } from 'react';

const InventoryTable = () => {
  const [inventory, setInventory] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newProduct, setNewProduct] = useState({
    name: '',
    category: '',
    unitPrice: '',
    stockQuantity: ''
  });

  // 1. Token se ID nikalne ka logic (Directly from localStorage)
  let wholesalerId = null;
  const token = localStorage.getItem("token");

  if (token) {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
      }).join(''));

      const decodedToken = JSON.parse(jsonPayload);
      // 'id', '_id', ya 'wholesalerId' jo bhi backend bhej raha ho
      wholesalerId = decodedToken.id || decodedToken._id || decodedToken.wholesalerId;
    } catch (error) {
      console.error("Token decode failed:", error);
    }
  }

  // 2. Fetch Inventory on Component Mount
  useEffect(() => {
    if (!wholesalerId) {
      console.warn("Wholesaler ID missing! Please login again.");
      return;
    }

    const fetchInventory = async () => {
      try {
        const response = await fetch(`/api/catalog/wholesaler/${wholesalerId}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        const data = await response.json();
        if (response.ok) {
          setInventory(data);
        } else {
          console.error("Failed to fetch inventory");
        }
      } catch (error) {
        console.error("Error fetching inventory:", error);
      }
    };

    fetchInventory();
  }, [wholesalerId, token]);

  // 3. Handle Add Stock Submit
  const handleAddStock = async (e) => {
    e.preventDefault();

    if (!wholesalerId) {
      alert("Session expired. Please login again.");
      return;
    }

    try {
      const response = await fetch('/api/catalog', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` // Backend JWT verify karega
        },
        body: JSON.stringify({
          ...newProduct,
          wholesalerId: wholesalerId // Ya fir ideal case mein backend isko token se khud nikal lega
        })
      });

      const savedProduct = await response.json();

      if (response.ok) {
        // UI ko turant update karna (Optimistic UI update)
        setInventory([savedProduct, ...inventory]);
        setIsModalOpen(false);
        setNewProduct({ name: '', category: '', unitPrice: '', stockQuantity: '' });
      } else {
        alert(savedProduct.message || "Failed to add stock");
      }
    } catch (error) {
      console.error("Error adding stock:", error);
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Inventory Dashboard</h2>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded shadow hover:bg-blue-700 transition"
        >
          + Add Stock
        </button>
      </div>

      {/* Warning message agar ID na mile */}
      {!wholesalerId && (
        <div className="bg-red-100 text-red-700 p-4 rounded mb-4">
          Wholesaler ID not found in storage. Please logout and login again.
        </div>
      )}

      {/* Inventory Table */}
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-100 text-gray-700 border-b">
              <th className="p-4">Product Name</th>
              <th className="p-4">Category</th>
              <th className="p-4">Unit Price</th>
              <th className="p-4">Stock Quantity</th>
            </tr>
          </thead>
          <tbody>
            {inventory.length > 0 ? (
              inventory.map((item, index) => (
                <tr key={item._id || index} className="border-b hover:bg-gray-50">
                  <td className="p-4 font-medium text-gray-900">{item.name}</td>
                  <td className="p-4 text-gray-600">{item.category}</td>
                  <td className="p-4 text-gray-600">${item.unitPrice}</td>
                  <td className="p-4">
                    <span className={`px-2 py-1 rounded text-sm font-semibold ${item.stockQuantity > 10 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                      {item.stockQuantity}
                    </span>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="p-6 text-center text-gray-500">
                  No products found. Click "Add Stock" to add items.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Add Stock Modal - Fixed CSS applied here */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg p-8 w-full max-w-md shadow-xl">
            <h3 className="text-xl font-bold mb-4 text-gray-800">Add New Product</h3>
            <form onSubmit={handleAddStock}>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">Product Name</label>
                <input 
                  type="text" 
                  required
                  className="w-full border rounded px-3 py-2 text-gray-700 focus:outline-none focus:border-blue-500"
                  value={newProduct.name}
                  onChange={(e) => setNewProduct({...newProduct, name: e.target.value})}
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">Category</label>
                <input 
                  type="text" 
                  required
                  className="w-full border rounded px-3 py-2 text-gray-700 focus:outline-none focus:border-blue-500"
                  value={newProduct.category}
                  onChange={(e) => setNewProduct({...newProduct, category: e.target.value})}
                />
              </div>
              <div className="mb-4 flex gap-4">
                <div className="w-1/2">
                  <label className="block text-gray-700 text-sm font-bold mb-2">Unit Price</label>
                  <input 
                    type="number" 
                    required min="0"
                    className="w-full border rounded px-3 py-2 text-gray-700 focus:outline-none focus:border-blue-500"
                    value={newProduct.unitPrice}
                    onChange={(e) => setNewProduct({...newProduct, unitPrice: e.target.value})}
                  />
                </div>
                <div className="w-1/2">
                  <label className="block text-gray-700 text-sm font-bold mb-2">Quantity</label>
                  <input 
                    type="number" 
                    required min="1"
                    className="w-full border rounded px-3 py-2 text-gray-700 focus:outline-none focus:border-blue-500"
                    value={newProduct.stockQuantity}
                    onChange={(e) => setNewProduct({...newProduct, stockQuantity: e.target.value})}
                  />
                </div>
              </div>
              <div className="flex justify-end gap-3 mt-6">
                <button 
                  type="button" 
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800 font-medium"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 font-medium"
                >
                  Save Product
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default InventoryTable;
