import axios from "axios";
import { jwtDecode } from "jwt-decode";
const BASE_URL = 'http://localhost:9090/todosroles';
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
export const obtenerDatos = async () => {
    try {
        const decodedToken = jwtDecode(token);
        const email = decodedToken.sub;
        const response = await axios.get(`${BASE_URL}/datos/${email}`);
        return response.data;
    } catch (error) {
        console.error("Error al obtener datos:", error);
        throw error;
    }
};