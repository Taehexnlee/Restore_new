import { createSlice } from '@reduxjs/toolkit';

const LS_KEY = 'darkMode';

// Read the initial value from localStorage
function getInitialDarkMode(): boolean {
  try {
    const raw = localStorage.getItem(LS_KEY);
    return raw ? JSON.parse(raw) : true; // Default to dark mode enabled
  } catch {
    return true;
  }
}

type UIState = {
  isLoading: boolean;
  darkMode: boolean;
};

const initialState: UIState = {
  isLoading: false,
  darkMode: getInitialDarkMode(),
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    startLoading: (state) => {
      state.isLoading = true;
    },
    stopLoading: (state) => {
      state.isLoading = false;
    },
    toggleDarkMode: (state) => {
      state.darkMode = !state.darkMode;
      localStorage.setItem(LS_KEY, JSON.stringify(state.darkMode));
    },
    // Allow explicitly setting the mode when needed
    setDarkMode: (state, action: { payload: boolean }) => {
      state.darkMode = action.payload;
      localStorage.setItem(LS_KEY, JSON.stringify(state.darkMode));
    },
  },
});

export const { startLoading, stopLoading, toggleDarkMode, setDarkMode } = uiSlice.actions;
export default uiSlice.reducer;
