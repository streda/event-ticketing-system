//  Create Redux slice for auth state (token, user, status, error) and async thunks (registerUser, loginUser).

import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';

import * as authApi from '../../services/authApi';
// import { act } from 'react';

interface LoginData {
    email: string;
    password: string;
}

export const loginUser = createAsyncThunk(
    'auth/loginUser', async (credentials: LoginData, {rejectWithValue}) =>{
        try {
            const data = await authApi.login(credentials);
            if(data.token){
                localStorage.setItem('authToken', data.token);
            }
            return data;

        } catch(error){
            const errorMessage = error instanceof Error ? error.message : 'Failed to login';
            return rejectWithValue(errorMessage);
        }
    }
);

interface RegisterData {
  name: string;
  email: string;
  password: string;
}

export const registerUser = createAsyncThunk(
    `auth/registerUser`, async (userData: RegisterData, {rejectWithValue}) => {
        try {
            const data = await authApi.register(userData);
            return data;
        } catch(error){
            const errorMessage = error instanceof Error ? error.message : 'Failed to register';
            return rejectWithValue(errorMessage);
        }
    }
);


interface User {
    id: string;
    name: string;
    email: string;
}

const initialState = {
    user: null as User | null,
    token: localStorage.getItem('authToken') || null,
    status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
    error: null as string | null,
}

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        logout: (state) => {
            localStorage.removeItem('authToken');
            state.user = null;
            state.token = null;
            state.status = 'idle';
            state.error = null;
            console.log("User logged out via Redux action.");
        },
        resetAuthStatus: (state) => {
            state.status = 'idle';
            state.error = null;
        }
        // clearAuthError(state) {state.error = null;} // Clears only the error message
    },
    extraReducers: (builder) => {
        builder.addCase(loginUser.pending, (state) => {
            state.status = 'loading';
            state.error = null;
        }).addCase(loginUser.fulfilled, (state, action) => {
            state.status = 'succeeded';
            state.user = action.payload.user;
            state.token = action.payload.token;
        }).addCase(loginUser.rejected, (state, action) => {
            state.status = 'failed';
            state.error = action.payload as string | null;
            state.user  = null;
            state.token = null;
        }).addCase(registerUser.pending, (state) => {
            state.status = 'loading';
            state.error = null;
        }).addCase(registerUser.fulfilled, (state, action) => {
            state.status = 'succeeded';
            state.error = null; 
            console.log("Registration successful:", action.payload.message)
        }).addCase(registerUser.rejected, (state, action) => {
            state.status = 'failed';
            state.error = action.payload as string | null;
        });
    }
});

export const {logout, resetAuthStatus} = authSlice.actions;
export default authSlice.reducer;



// Manual Redux Version

/* 
// Manual Redux version (without createAsyncThunk or createSlice)

import * as authApi from '../../services/authApi';

// Action Types
export const LOGIN_PENDING = 'auth/loginUser/pending';
export const LOGIN_SUCCESS = 'auth/loginUser/fulfilled';
export const LOGIN_FAILED = 'auth/loginUser/rejected';

export const REGISTER_PENDING = 'auth/registerUser/pending';
export const REGISTER_SUCCESS = 'auth/registerUser/fulfilled';
export const REGISTER_FAILED = 'auth/registerUser/rejected';

export const LOGOUT = 'auth/logout';
export const RESET_AUTH_STATUS = 'auth/resetStatus';

// Action Creators
export const loginPending = () => ({ type: LOGIN_PENDING });
export const loginSuccess = (data) => ({ type: LOGIN_SUCCESS, payload: data });
export const loginFailed = (error) => ({ type: LOGIN_FAILED, payload: error });

export const registerPending = () => ({ type: REGISTER_PENDING });
export const registerSuccess = (data) => ({ type: REGISTER_SUCCESS, payload: data });
export const registerFailed = (error) => ({ type: REGISTER_FAILED, payload: error });

export const logout = () => ({ type: LOGOUT });
export const resetAuthStatus = () => ({ type: RESET_AUTH_STATUS });

// Async Thunks (manual)
export const loginUser = (credentials) => async (dispatch) => {
  dispatch(loginPending());
  try {
    const data = await authApi.login(credentials);
    if (data.token) {
      localStorage.setItem('authToken', data.token);
    }
    dispatch(loginSuccess(data));
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Failed to login';
    dispatch(loginFailed(errorMessage));
  }
};

export const registerUser = (userData) => async (dispatch) => {
  dispatch(registerPending());
  try {
    const data = await authApi.register(userData);
    dispatch(registerSuccess(data));
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Failed to register';
    dispatch(registerFailed(errorMessage));
  }
};

// Initial State
const initialState = {
  user: null,
  token: localStorage.getItem('authToken') || null,
  status: 'idle',
  error: null,
};

// Reducer
const authReducer = (state = initialState, action) => {
  switch (action.type) {
    case LOGIN_PENDING:
    case REGISTER_PENDING:
      return { ...state, status: 'loading', error: null };

    case LOGIN_SUCCESS:
      return {
        ...state,
        status: 'succeeded',
        user: action.payload.user,
        token: action.payload.token,
      };

    case LOGIN_FAILED:
      return {
        ...state,
        status: 'failed',
        error: action.payload,
        user: null,
        token: null,
      };

    case REGISTER_SUCCESS:
      console.log('Registration successful:', action.payload.message);
      return { ...state, status: 'idle' };

    case REGISTER_FAILED:
      return { ...state, status: 'failed', error: action.payload };

    case LOGOUT:
      localStorage.removeItem('authToken');
      return {
        ...state,
        user: null,
        token: null,
        status: 'idle',
        error: null,
      };

    case RESET_AUTH_STATUS:
      return { ...state, status: 'idle', error: null };

    default:
      return state;
  }
};

export default authReducer;

*/