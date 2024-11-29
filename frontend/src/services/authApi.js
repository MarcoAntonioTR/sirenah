import axios from "axios";

const BASE_URL = 'http://localhost:9090/auth';

axios.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

export const signup = async (userData) => {
    try {
        const response = await axios.post(`${BASE_URL}/signup`, userData);
        return response.data;
    } catch (error) {
        console.error("Error al registrar usuario:", error);
        throw error;
    }
};

export const signin = async (loginData) => {
    try {
        const response = await axios.post(`${BASE_URL}/signin`, loginData);
        // Guardar token en localStorage al iniciar sesión
        localStorage.setItem('token', response.data.token);
        return response.data;
    } catch (error) {
        console.error("Error al iniciar sesión:", error);
        throw error;
    }
};

export const refreshToken = async (refreshData) => {
    try {
        const response = await axios.post(`${BASE_URL}/refresh`, refreshData);
        // Actualizar token en localStorage
        localStorage.setItem('token', response.data.token);
        return response.data;
    } catch (error) {
        console.error("Error al refrescar token:", error);
        throw error;
    }
};


export const signout = () => {
    localStorage.removeItem('token');
};


