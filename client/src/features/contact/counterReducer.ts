// src/features/contact/counterReducer.ts
import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

export type CounterState = { data: number };

const initialState: CounterState = { data: 42 };

const counterSlice = createSlice({
  name: 'counter',
  initialState,
  reducers: {
    increment: (state, action: PayloadAction<number>) => {
      state.data += action.payload;
    },
    decrement: (state, action: PayloadAction<number>) => {
      state.data -= action.payload;
    },
  },
});

export const { increment, decrement } = counterSlice.actions;
export default counterSlice.reducer;