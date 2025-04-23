import { configureStore } from "@reduxjs/toolkit";
import toastReducer from "./redux/toastSlice";

export const store = configureStore({
  reducer: {
    toast: toastReducer
  }
});