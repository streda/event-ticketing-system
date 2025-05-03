// Functions using axios to call the direct Auth Service endpoints (http://localhost:3001/register, http://localhost:3001/login).

import axios from 'axios';

const AUTH_API_URL = 'http://localhost:3001/api/auth';

interface LoginData {
    email: string;
    password: string;
}

interface LoginResponse {
    token: string;
    user: {
        id: string;
        name: string;
        email: string;
    };
}

export const login = async (credentials: LoginData): Promise<LoginResponse> => {
    try {
        const response = await axios.post<LoginResponse>(`${AUTH_API_URL}/login`, credentials);
        return response.data;
    } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
            throw error.response.data;
        }
        throw new Error('Login failed');
    }
};

interface RegisterData {
    name: string;
    email: string;
    password: string;
}

interface RegisterResponse {
    message: string;
    user: {
        id: string;
        name: string;
        email: string;
    };
}

export const register = async (userData: RegisterData): Promise<RegisterResponse> => {
    try {
        const response = await axios.post<RegisterResponse>(`${AUTH_API_URL}/register`, userData);
        return response.data;
    } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
            throw error.response.data;
        }
        throw new Error('Registration failed');
    }
};