import axios from "axios";

const BASE_URL = 'http://localhost:9090/adminempleado/Usuarios';
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

export const listarUsuarios = async () => {
    try {
        const response = await axios.get(`${BASE_URL}/Listar`);
        return response.data;
    } catch (error) {
        console.error("Error al listar usuarios:", error);
        throw error;
    }
};

export const agregarUsuario = async (usuario) => {
    try {
        const response = await axios.post(`${BASE_URL}/Agregar`, usuario);
        return response.data;
    } catch (error) {
        console.error("Error al agregar usuario:", error);
        throw error;
    }
};

export const actualizarUsuario = async (userData) => {
    try {
        const response = await axios.put(`${BASE_URL}/Actualizar`, userData);
        return response.data;
    } catch (error) {
        console.error("Error al actualizar usuario:", error);
        throw error;
    }
};

export const eliminarUsuario = async (userData) => {
    try {
        const response = await axios.put(`${BASE_URL}/Eliminar`, userData);
        return response.data;
    } catch (error) {
        console.error("Error al eliminar usuario:", error);
        throw error;
    }
};
