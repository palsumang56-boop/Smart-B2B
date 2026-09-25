import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

export const fetchCatalog = createAsyncThunk(
  'catalog/fetchCatalog',
  async (wholesalerId, thunkAPI) => {
    try {
      const response = await fetch(`https://smart-b2b.onrender.com/api/products/wholesaler/${wholesalerId}`);
      
      if (!response.ok) {
        throw new Error('Server error');
      }
      return await response.json();
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

const catalogSlice = createSlice({
  name: 'catalog',
  initialState: {
    items: [],
    status: 'idle',
    error: null
  },
  reducers: {}, 
  extraReducers: (builder) => {
    builder
      // YAHAN FIX HUA HAI: fetchProducts ki jagah ab fetchCatalog likha hai
      .addCase(fetchCatalog.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchCatalog.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload; 
      })
      .addCase(fetchCatalog.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      });
  }
});

export default catalogSlice.reducer;
