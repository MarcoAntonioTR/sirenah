import axios from "axios";
const BASE_URL = 'http://localhost:8080/admin';
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

export const listarEmpleados = async () => {
    try {
        const response = await axios.get(`${BASE_URL}/Listar/Empleados`);
        return response.data;
    } catch (error) {
        console.error("Error al listar empleados:", error);
        throw error;
    }
};

