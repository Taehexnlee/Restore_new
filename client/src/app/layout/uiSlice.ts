import { createSlice } from '@reduxjs/toolkit';

const LS_KEY = 'darkMode';

// 로컬스토리지에서 초기값 읽기
function getInitialDarkMode(): boolean {
  try {
    const raw = localStorage.getItem(LS_KEY);
    return raw ? JSON.parse(raw) : true; // 기본값: 다크모드 on
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
    // 필요하면 직접 세팅도 가능
    setDarkMode: (state, action: { payload: boolean }) => {
      state.darkMode = action.payload;
      localStorage.setItem(LS_KEY, JSON.stringify(state.darkMode));
    },
  },
});

export const { startLoading, stopLoading, toggleDarkMode, setDarkMode } = uiSlice.actions;
export default uiSlice.reducer;