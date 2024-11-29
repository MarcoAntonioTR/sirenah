import axios from "axios";

const BASE_URL = 'http://localhost:9090/adminempleado/Productos';
const token = localStorage.getItem('token'); 


axios.interceptors.request.use((config) => {
    config.headers.Authorization = `Bearer ${token}`;
    return config;
}, (error) => {
    return Promise.reject(error);
});

export const listarProductos = async () => {
    try {
        const response = await axios.get(`${BASE_URL}/Listar`);
        return response.data;
    } catch (error) {
        console.error("Error al listar productos:", error);
        throw error;
    }
};

export const agregarProducto = async (productoData) => {
    try {
        const response = await axios.post(`${BASE_URL}/Agregar`, productoData);
        return response.data;
    } catch (error) {
        console.error("Error al agregar producto:", error);
        throw error;
    }
};

export const actualizarProducto = async (id, productoData) => {
    try {
        const response = await axios.put(`${BASE_URL}/Actualizar/${id}`, productoData);
        return response.data;
    } catch (error) {
        console.error("Error al actualizar producto:", error);
        throw error;
    }
};

export const eliminarProducto = async (id) => {
    try {
        const response = await axios.delete(`${BASE_URL}/Eliminar/${id}`);
        return response.data;
    } catch (error) {
        console.error("Error al eliminar producto:", error);
        throw error;
    }
};

export const buscarProductoPorId = async (id) => {
    try {
        const response = await axios.get(`${BASE_URL}/buscar/${id}`);
        return response.data;
    } catch (error) {
        console.error("Error al buscar producto por ID:", error);
        throw error;
    }
};
