import { configureStore } from "@reduxjs/toolkit";
import newsReducer from "./newsSlice";

export const store = configureStore({
  reducer: {
    news: newsReducer,
  },
});

// Define RootState and AppDispatch for better TypeScript support
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
