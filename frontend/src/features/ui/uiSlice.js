// features/ui/uiSlice.js
import { createSlice } from '@reduxjs/toolkit';

const uiSlice = createSlice({
  name: 'ui',
  initialState: { isAuthModalOpen: false },
  reducers: {
    openAuthModal: (state) => { state.isAuthModalOpen = true; },
    closeAuthModal: (state) => { state.isAuthModalOpen = false; },
  },
});

export const { openAuthModal, closeAuthModal } = uiSlice.actions;
export const selectIsAuthModalOpen = (state) => state.ui.isAuthModalOpen;
export default uiSlice.reducer;