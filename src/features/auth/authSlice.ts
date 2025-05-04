import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { JWT, User } from "../../app/types";
import authService from "./AuthAPI";
import { RootState } from "../../app/store";

const storedUser: string | null = localStorage.getItem('user');
const user: string | null = !!storedUser ? JSON.parse(storedUser) : null;

const storedJwt: string | null = localStorage.getItem('jwt');
const jwt: JWT | null = !!storedJwt ? JSON.parse(storedJwt) : null;


interface AsyncState {
    isLoading: boolean;
    isSuccess: boolean;
    isError: boolean;
}

interface AuthState extends AsyncState {
    user?: string | null;
    jwt?: JWT;
    isAuthenticated?: boolean;
}

const  initialState: AuthState = {
    user: user,
    jwt: jwt,
    isLoading: false,
    isSuccess: false,
    isError: false,
    isAuthenticated: false,
}

export const register = createAsyncThunk('auth/register', 
    async (user: User, thunkAPI) => {
        try {
            return await authService.registerAPI(user);
        } catch (error) {
            return thunkAPI.rejectWithValue('Unable to register!');
        }
    }
)

export const login = createAsyncThunk('auth/login', 
    async (user: User, thunkAPI) => {
        try {
            return await authService.loginAPI(user);
        } catch (error) {
            return thunkAPI.rejectWithValue('Unable to login!');
        }
    }
)

export const logout = createAsyncThunk('auth/logout', 
    async () => {
        await authService.logoutAPI();
    }
)

export const verifyJwt = createAsyncThunk(
    'auth/verify-jwt',
    async (jwt: string, thunkAPI) => {
      try {
        return await authService.verifyJwtAPI(jwt);
      } catch (error) {
        return thunkAPI.rejectWithValue('Unable to verify');
      }
    }
);

export const authSlice = createSlice({
    name: 'auth', 
    initialState,
    reducers: {
        reset: (state) => {
            state.isLoading = false;
            state.isSuccess = false;
            state.isError = false;
        }
    },
    extraReducers: (builder) => {
        builder
        .addCase(register.pending, (state) => {
            state.isLoading = true;
        })
        .addCase(register.fulfilled, (state, action) => {
            state.isLoading = false;
            state.isSuccess = true;
            console.log(action.payload);
            state.user = action.payload?.email;
        })
        .addCase(register.rejected, (state) => {
            state.isLoading = false;
            state.isSuccess = false;
            state.user = null;
        })
        .addCase(login.pending, (state) => {
            state.isLoading = true;
        })
        .addCase(login.fulfilled, (state, action) => {
            state.isLoading = false;
            state.isSuccess = true;
            state.jwt = action.payload.access_token;
            state.isAuthenticated = true;
            state.user = action.payload.user;
        })
        .addCase(login.rejected, (state) => {
            state.isLoading = false;
            state.isAuthenticated = false;
            state.isSuccess = false;
            state.user = null;
        })
        .addCase(verifyJwt.pending, (state) => {
            state.isLoading = true;
        })
        .addCase(verifyJwt.fulfilled, (state, action) => {
            state.isLoading = false;
            state.isSuccess = true;
            state.isAuthenticated = action.payload;
        })
        .addCase(verifyJwt.rejected, (state) => {
            state.isLoading = false;
            state.isError = true;
            state.isAuthenticated = false;
        })
        .addCase(logout.fulfilled, (state) => {
            state.user = null;
            state.jwt = null;
            state.isAuthenticated = false;
          })
    },
});

export const { reset } = authSlice.actions; 
export const selectedUser = (state: RootState) => {
    return state.auth;
}

export default authSlice.reducer;