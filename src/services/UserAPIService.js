/* eslint-disable */
import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api/users';


const UserApiService = {
    setToken(token) {
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    },

    removeToken() {
        delete axios.defaults.headers.common['Authorization'];
    },

    async getUserInfo() {
        try {
            const response = await axios.get(`${API_BASE_URL}/info`);
            return response.data;
        } catch (error) {
            console.error('Error fetching user info:', error);
            throw error;
        }
    },

    async login(credentials) {
        try {
            const response = await axios.post(`${API_BASE_URL}/login`, credentials);
            return response.data;
        } catch (error) {
            console.error('Login error:', error);
            throw error;
        }
    },

    async logout() {
        try {
            this.removeToken();
        } catch (error) {
            console.error('Logout error:', error);
            throw error;
        }
    },
    async register(userData) {
        try {
            const response = await axios.post(`${API_BASE_URL}/register`, userData);
            return response.data;
        } catch (error) {
            throw error;
        }
    },
    async generateApiToken() {
        try {
            const response = await axios.get(`${API_BASE_URL}/api-token`);
            return response.data;
        } catch (error) {
            throw error;
        }
    }


};

export default UserApiService;