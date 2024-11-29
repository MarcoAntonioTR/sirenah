import axios from "axios";

const BASE_URL = 'http://localhost:9090/adminempleado/Categorias';
const token = localStorage.getItem('token'); 


axios.interceptors.request.use((config) => {
    config.headers.Authorization = `Bearer ${token}`;
    return config;
}, (error) => {
    return Promise.reject(error);
});

export const ListarCategorias = async () => {
    try {
        const response = await axios.get(`${BASE_URL}/Listar`);
        return response.data;
    } catch (error) {
        console.error("Error al listar categorias:", error);
        throw error;
    }
};

export const agregarCategoria = async (productoData) => {
    try {
        const response = await axios.post(`${BASE_URL}/Agregar`, productoData);
        return response.data;
    } catch (error) {
        console.error("Error al agregar categoria:", error);
        throw error;
    }
};

export const actualizarCategoria = async (id, productoData) => {
    try {
        const response = await axios.put(`${BASE_URL}/Actualizar/${id}`, productoData);
        return response.data;
    } catch (error) {
        console.error("Error al actualizar categoria:", error);
        throw error;
    }
};

export const eliminarCategoria = async (id) => {
    try {
        const response = await axios.delete(`${BASE_URL}/Eliminar/${id}`);
        return response.data;
    } catch (error) {
        console.error("Error al eliminar categoria:", error);
        throw error;
    }
};

export const buscarCategoriaPorId = async (id) => {
    try {
        const response = await axios.get(`${BASE_URL}/buscar/${id}`);
        return response.data;
    } catch (error) {
        console.error("Error al buscar categoria por ID:", error);
        throw error;
    }
};
