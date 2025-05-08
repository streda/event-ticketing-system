// // Functions using axios to call the direct Auth Service endpoints (http://localhost:3001/register, http://localhost:3001/login).

// frontend/src/services/authApi.ts

import axios, { AxiosError } from 'axios'; 

const API_BASE_URL =  import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000'; 

interface LoginData {
    email: string;
    password: string;
}

interface LoginResponse {
    token: string;
    user: {
        id: number;
        name: string;
        email: string;
      
    };
    message?: string; 
}

interface RegisterData {
    name: string;
    email: string;
    password: string;
}

interface RegisterResponse {
    message: string;
    user: {
        id: number; 
        email: string;
        created_at: string; 
       
    };
}

interface ApiErrorData {
    message?: string;
    error?: string;
}


export const login = async (credentials: LoginData): Promise<LoginResponse> => {
    try {
       
        const response = await axios.post<LoginResponse>(`${API_BASE_URL}/api/auth/login`, credentials);
        return response.data;
    } catch (error) {
        const axiosError = error as AxiosError<ApiErrorData>; 
        
        throw new Error(axiosError.response?.data?.message || axiosError.message || 'Login failed');
    }
};


export const register = async (userData: RegisterData): Promise<RegisterResponse> => {
    try {

        const response = await axios.post<RegisterResponse>(`${API_BASE_URL}/api/auth/register`, userData);
        return response.data;
    } catch (error) {
        const axiosError = error as AxiosError<ApiErrorData>;
        throw new Error(axiosError.response?.data?.message || axiosError.message || 'Registration failed');
    }
};
