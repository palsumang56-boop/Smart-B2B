// src/store/cartSlice.js
import { createSlice } from '@reduxjs/toolkit';

// Helper function to load initial state securely
const loadCartFromStorage = () => {
  try {
    const saved = localStorage.getItem('smartb2b_cart');
    return saved ? JSON.parse(saved) : [];
  } catch (error) {
    return [];
  }
};

const cartSlice = createSlice({
  name: 'cart',
  initialState: {
    items: loadCartFromStorage(),
    // We mock a $5000 limit for the UI here. In production, this is fetched from the backend.
    creditLimit: 5000, 
  },
  reducers: {
    addToCart: (state, action) => {
      const product = action.payload;
      const existingItem = state.items.find(item => item._id === product._id);
      
      if (existingItem) {
        // Prevent adding more than what's in stock
        if (existingItem.qty < product.stockQuantity) {
          existingItem.qty += 1;
        }
      } else {
        state.items.push({ ...product, qty: 1 });
      }
      
      // Save to localStorage immediately
      localStorage.setItem('smartb2b_cart', JSON.stringify(state.items));
    },
    removeFromCart: (state, action) => {
      state.items = state.items.filter(item => item._id !== action.payload);
      localStorage.setItem('smartb2b_cart', JSON.stringify(state.items));
    },
    // This reducer is specifically for our Cross-Tab Sync feature
    syncCart: (state, action) => {
      state.items = action.payload;
    }
  }
});

export const { addToCart, removeFromCart, syncCart } = cartSlice.actions;

// Helper selector to dynamically calculate the total cart value
export const selectCartTotal = (state) => {
  return state.cart.items.reduce((total, item) => total + (item.unitPrice * item.qty), 0);
};

export default cartSlice.reducer;