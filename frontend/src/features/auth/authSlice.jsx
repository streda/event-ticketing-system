//  Create Redux slice for auth state (token, user, status, error) and async thunks (registerUser, loginUser).

import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';

import * as authApi from '../../services/authApi';
// import { act } from 'react';

export const loginUser = createAsyncThunk(
    'auth/loginUser', async (credentials, {rejectWithValue}) =>{
        try {
            const data = await authApi.login(credentials);
            if(data.token){
                localStorage.setItem('authToken', data.token);
            }
            return data;

        } catch(error){
            return rejectWithValue(error.message || 'Failed to login');
        }
    }
);

export const registerUser = createAsyncThunk(
    `auth/registerUser`, async (userData, {rejectWithValue}) => {
        try {
            const data = await authApi.register(userData);
            return data;
        } catch(error){
            return rejectWithValue(error.message || 'Failed to register');
        }
    }
);


const initialState = {
    user: null,
    token: localStorage.getItem('authToken') || null,
    status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
    error: null,
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
            console.log("User logged out");
        },
        resetAuthStatus: (state) => {
            state.status = 'idle';
            state.error = null;
        }
        // clearAuthError(state) {state.error = null;}
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
            state.error = action.payload;
            state.user  = null;
            state.token = null;
        }).addCase(registerUser.pending, (state) => {
            state.status = 'loading';
            state.error = null;
        }).addCase(registerUser.fulfilled, (state, action) => {
            state.status = 'idle';
            console.log("Registration successful:", action.payload.message)
        }).addCase(registerUser.rejected, (state, action) => {
            state.status = 'failed';
            state.error = action.payload;
        });
    }
});

export const {logout, resetAuthStatus} = authSlice.actions;
export default authSlice.reducer;