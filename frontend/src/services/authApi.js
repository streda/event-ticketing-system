// Functions using axios to call the direct Auth Service endpoints (http://localhost:3001/register, http://localhost:3001/login).

import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000/api';

export const login = async (credentials) => {
    try {
        const response = await axios.post(`${API_BASE_URL}/auth/login`, credentials);
        return response.data;
    } catch(error){
        throw error.response?.data || new Error('Login failed');
    }
};

export const register = async (userData) => {
    try {
        const response = await axios.post(`${API_BASE_URL}/auth/register`, userData);
        return response.data;

    } catch(error){
        throw error.response?.data || new Error('Registration failed');
    }
}