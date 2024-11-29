import axios from "axios";
const BASE_URL = 'http://localhost:9090/user/Clientes';
const token = localStorage.getItem('token');

axios.interceptors.request.use(
    (config) => {
        config.headers.Authorization = `Bearer ${token}`;
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export const actualizarUsuario = async (userData) => {
    try {
        const response = await axios.put(`${BASE_URL}/Actualizar`, userData);
        return response.data;
    } catch (error) {
        console.error("Error al actualizar usuario:", error);
        throw error;
    }
};
