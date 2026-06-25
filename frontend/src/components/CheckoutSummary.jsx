// src/components/CheckoutSummary.jsx
import { useSelector, useDispatch } from 'react-redux';
import { removeFromCart, selectCartTotal } from '../store/cartSlice';

export default function CheckoutSummary() {
  const dispatch = useDispatch();
  const { items, creditLimit } = useSelector((state) => state.cart);
  const cartTotal = useSelector(selectCartTotal);
  
  // Real-time mathematical enforcement
  const isOverLimit = cartTotal > creditLimit;
  const remainingCredit = creditLimit - cartTotal;

  if (items.length === 0) {
    return (
      <div className="p-6 bg-white rounded-lg shadow-sm border border-gray-100 text-center">
        <h3 className="text-lg font-bold text-gray-800">Your Cart</h3>
        <p className="text-gray-500 mt-2">Your cart is currently empty.</p>
      </div>
    );
  }

  const handleCheckout = async () => {
    // In a full implementation, this calls your Node.js POST /api/orders/checkout endpoint
    console.log('Proceeding to checkout with payload:', { items, total: cartTotal });
    alert('Checkout initiated! Check the console.');
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 sticky top-6">
      <h3 className="text-xl font-bold text-gray-800 mb-4">Checkout Summary</h3>
      
      {/* Item List */}
      <div className="space-y-4 mb-6 max-h-[40vh] overflow-y-auto pr-2">
        {items.map((item) => (
          <div key={item._id} className="flex justify-between items-center border-b pb-2">
            <div>
              <p className="font-medium text-gray-800 text-sm truncate w-32">{item.name}</p>
              <p className="text-xs text-gray-500">Qty: {item.qty} x ${item.unitPrice}</p>
            </div>
            <div className="flex items-center gap-3">
              <span className="font-semibold text-gray-800">
                ${(item.unitPrice * item.qty).toFixed(2)}
              </span>
              <button 
                onClick={() => dispatch(removeFromCart(item._id))}
                className="text-red-500 hover:text-red-700 text-xs font-bold"
              >
                ✕
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Credit Statement Calculations */}
      <div className="space-y-2 border-t pt-4">
        <div className="flex justify-between text-sm text-gray-600">
          <span>Order Total:</span>
          <span className="font-bold text-gray-800">${cartTotal.toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-sm text-gray-600">
          <span>Credit Limit:</span>
          <span>${creditLimit.toFixed(2)}</span>
        </div>
        <div className={`flex justify-between text-sm font-bold ${isOverLimit ? 'text-red-600' : 'text-green-600'}`}>
          <span>Remaining Credit:</span>
          <span>${remainingCredit.toFixed(2)}</span>
        </div>
      </div>

      {/* Warning Message */}
      {isOverLimit && (
        <div className="mt-4 p-2 bg-red-50 border border-red-200 text-red-700 text-xs rounded">
          ⚠️ Order exceeds your available credit limit. Please remove items to proceed.
        </div>
      )}

      {/* Checkout Button */}
      <button 
        onClick={handleCheckout}
        disabled={isOverLimit}
        className={`w-full mt-6 py-3 rounded font-bold text-white transition ${
          isOverLimit 
            ? 'bg-gray-400 cursor-not-allowed' 
            : 'bg-blue-600 hover:bg-blue-700 shadow-md'
        }`}
      >
        Place Order
      </button>
    </div>
  );
}