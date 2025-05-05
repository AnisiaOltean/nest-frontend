import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/auth/authSlice";
import { userApi } from "../features/user/UserAPI";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    [userApi.reducerPath]: userApi.reducer
  },
  middleware: (getDefaultMiddleware) => 
    getDefaultMiddleware().concat(userApi.middleware)
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;