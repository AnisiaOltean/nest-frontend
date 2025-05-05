import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/auth/authSlice";
import { catApi } from "../features/cats/CatsAPI";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    [catApi.reducerPath]: catApi.reducer
  },
  middleware: (getDefaultMiddleware) => 
    getDefaultMiddleware().concat(catApi.middleware)
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;