import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  barcodeData:'' 
};

const barCodeSlice = createSlice({
  name: 'barcode',
  initialState,
  reducers: {
    setBarcode: (state, action) => {
      state.barcodeData = action.payload;
    }
  }
});

export const { setBarcode} = barCodeSlice.actions;
export default barCodeSlice.reducer;
