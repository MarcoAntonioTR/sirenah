import AdminSidebar from "../../components/layout/AdminSidebar";
import { useState, useEffect } from 'react';
import {
    listarProductos,
    agregarProducto,
    actualizarProducto,
    eliminarProducto
} from '../../services/productosApi';
import { ListarCategorias } from '../../services/categoriasApi';
import '../../styles/stylesAdm/ATablas.css';
import { useNavigate } from "react-router-dom";
import { AlertaDeEliminacion, AlertaDeError, AlertaDeExito } from '../../utils/Alertas.js'


function Productos() {
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [productos, setProductos] = useState([]);
    const [categorias, setCategorias] = useState([]);
    const [modalVisible, setModalVisible] = useState(false);
    const navigate = useNavigate();
    const [productForm, setProductForm] = useState({
        idProducto: '',
        idCategoria: '',
        nombre: '',
        estado: true,
        stock: '',
        precio: '',
        stockMinimo: '',
        descripcion: '',
        imgUrl: ''
    });

    const resetProductForm = () => setProductForm({
        idProducto: '',
        idCategoria: '',
        nombre: '',
        estado: true,
        stock: '',
        precio: '',
        stockMinimo: '',
        descripcion: '',
        imgUrl: ''
    });

    const handleCollapseChange = (collapsed) => {
        setIsCollapsed(collapsed);
    };

    const fetchProductos = async () => {
        try {
            const data = await listarProductos();
            setProductos(data);
        } catch (error) {
            console.error(error);
            AlertaDeError('Error', 'Error al listar productos');
        }
    };

    const fetchCategorias = async () => {
        try {
            const data = await ListarCategorias();
            setCategorias(data);
        } catch (error) {
            console.error(error);
            AlertaDeError('Error', 'Error al listar categorías');
        }
    };

    useEffect(() => {
        fetchProductos();
        fetchCategorias();
    }, []);

    const handleEditProduct = (producto) => {
        setProductForm(producto);
        setModalVisible(true);
    };

    const handleSaveEdit = async () => {
        if (validateForm()) {
            try {
                await actualizarProducto(productForm.idProducto, {
                    ...productForm,
                    precio: parseFloat(productForm.precio),
                    stock: parseInt(productForm.stock),
                    stockMinimo: parseInt(productForm.stockMinimo),
                });
                fetchProductos();
                closeModal();
                AlertaDeExito('Producto Actualizado', 'El producto ha sido actualizado exitosamente.');
            } catch (error) {
                console.error(error);
                AlertaDeError('Error', 'Error al editar producto');
            }
        }
    };

    const handleAddProduct = async () => {
        if (validateForm()) {
            try {
                await agregarProducto({
                    ...productForm,
                    precio: parseFloat(productForm.precio),
                    stock: parseInt(productForm.stock),
                    stockMinimo: parseInt(productForm.stockMinimo),
                });
                fetchProductos();
                closeModal();
                AlertaDeExito('Producto Añadido', 'El producto ha sido añadido exitosamente.');
            } catch (error) {
                console.error(error);
                AlertaDeError('Error', 'Error al agregar producto');
            }
        }
    };

    const handleDeleteProduct = async (id) => {
        const result = await AlertaDeEliminacion('¿Está seguro de que desea eliminar este producto?', 'Esta acción no se puede deshacer.');
        if (result.isConfirmed) {
            try {
                await eliminarProducto(id);
                fetchProductos();
                AlertaDeExito('Producto Eliminado', 'El producto ha sido eliminado exitosamente.');
            } catch (error) {
                console.error(error);
                AlertaDeError('Error', 'Error al eliminar producto');
            }
        }
    };

    const validateForm = () => {
        if (!productForm.nombre || !productForm.idCategoria || productForm.stock === '' || productForm.precio === '' || productForm.stockMinimo === '' || !productForm.descripcion || !productForm.imgUrl) {
            AlertaDeError('Error', 'Todos los campos son obligatorios.');
            return false;
        }
        return true;
    };



    const closeModal = () => {
        setModalVisible(false);
        resetProductForm();
    };


    const handleImageUpload = async (event) => {
        const file = event.target.files[0];

        if (!file) return;

        // Crear un objeto Image para verificar las dimensiones de la imagen
        const img = new Image();
        const reader = new FileReader();

        reader.onload = (e) => {
            img.src = e.target.result;

            img.onload = async () => {
                const minWidth = 600;  // Dimensión mínima de ancho
                const minHeight = 400; // Dimensión mínima de alto
                const maxWidth = 1200; // Dimensión máxima de ancho
                const maxHeight = 800; // Dimensión máxima de alto

                // Verificar si las dimensiones son demasiado pequeñas
                if (img.width < minWidth || img.height < minHeight) {
                    AlertaDeError('Error', `La imagen debe tener al menos ${minWidth}x${minHeight} píxeles.`);
                    return;
                }

                // Redimensionar si es muy grande
                let canvas = document.createElement('canvas');
                let ctx = canvas.getContext('2d');

                // Si la imagen es más grande que la dimensión máxima, redimensionamos
                if (img.width > maxWidth || img.height > maxHeight) {
                    const scale = Math.min(maxWidth / img.width, maxHeight / img.height);
                    canvas.width = img.width * scale;
                    canvas.height = img.height * scale;
                } else {
                    // Si es más pequeña que la dimensión máxima, la dejamos igual
                    canvas.width = img.width;
                    canvas.height = img.height;
                }

                ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

                canvas.toBlob(async (blob) => {
                    const formData = new FormData();
                    formData.append('file', blob, file.name);
                    formData.append('upload_preset', 'Preset_Sirenah');

                    try {
                        const response = await fetch(`https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME}/image/upload`, {
                            method: 'POST',
                            body: formData
                        });

                        const data = await response.json();
                        if (data.secure_url) {
                            setProductForm({ ...productForm, imgUrl: data.secure_url });
                            AlertaDeExito('Imagen Cargada', 'La imagen se ha subido exitosamente.');
                        } else {
                            throw new Error('No se pudo obtener la URL de la imagen');
                        }
                    } catch (error) {
                        console.error(error);
                        AlertaDeError('Error', 'Error al cargar la imagen');
                    }
                }, 'image/jpeg');
            };
        };

        reader.readAsDataURL(file);
    };






    return (
        <div className="Admin-layout">
            <AdminSidebar onCollapseChange={handleCollapseChange} />
            <main className={`content ${isCollapsed ? 'collapsed' : ''}`}>
                <div className="header-section">
                    <h1>Gestión de Productos</h1>
                    <button onClick={() => { resetProductForm(); setModalVisible(true); }} className="add-btn1">+ Añadir Producto</button>
                    <button onClick={() => navigate('/MenuAdmin/Categorias')} className="add-btn2">Ir a Categorías</button>
                </div>

                <div className="div-table">
                    {productos.length > 0 ? (
                        <table>
                            <thead>
                                <tr>
                                    <th>Imagen</th>
                                    <th>Nombre</th>
                                    <th>Categoría</th>
                                    <th>Descripcion</th>
                                    <th>Precio</th>
                                    <th>Stock</th>
                                    <th>Stock Mínimo</th>
                                    <th>Estado</th>
                                    <th>Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {productos.map((producto) => (
                                    <tr key={producto.idProducto}>
                                        <td>
                                            {producto.imgUrl ? (
                                                <img src={producto.imgUrl} alt={producto.nombre} className="product-image" />
                                            ) : (
                                                'No Disponible'
                                            )}
                                        </td>
                                        <td>{producto.nombre}</td>
                                        <td>{producto.idCategoria}</td>
                                        <td>{producto.descripcion}</td>
                                        <td>S/{producto.precio.toFixed(2)}</td>
                                        <td>{producto.stock}</td>
                                        <td>{producto.stockMinimo}</td>
                                        <td>{producto.estado ? 'Activo' : 'Inactivo'}</td>
                                        <td>
                                            <button onClick={() => handleEditProduct(producto)} className="edit-btn">Editar</button>
                                            <button onClick={() => handleDeleteProduct(producto.idProducto)} className="delete-btn">Eliminar</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    ) : (
                        <p>No hay productos disponibles</p>
                    )}
                </div>

                {modalVisible && (
                    <div className="modal-overlay">
                        <div className="modal">
                            <h2>{productForm.idProducto ? 'Editar Producto' : 'Añadir Producto'}</h2>
                            <form>
                                <label>Nombre</label>
                                <input type="text" value={productForm.nombre} onChange={(e) => setProductForm({ ...productForm, nombre: e.target.value })} />

                                <label>Categoría</label>
                                <select className="select-style " value={productForm.idCategoria} onChange={(e) => setProductForm({ ...productForm, idCategoria: e.target.value })}>
                                    <option value="">Seleccione una categoría</option>
                                    {categorias.map((categoria) => (
                                        <option key={categoria.idCategoria} value={categoria.idCategoria}>{categoria.nombre}</option>
                                    ))}
                                </select>

                                <label>Precio</label>
                                <input type="number" value={productForm.precio} onChange={(e) => setProductForm({ ...productForm, precio: e.target.value })} />
                                <label>Stock</label>
                                <input type="number" value={productForm.stock} onChange={(e) => setProductForm({ ...productForm, stock: e.target.value })} />
                                <label>Stock Mínimo</label>
                                <input type="number" value={productForm.stockMinimo} onChange={(e) => setProductForm({ ...productForm, stockMinimo: e.target.value })} />
                                <label>Descripción</label>
                                <textarea value={productForm.descripcion} onChange={(e) => setProductForm({ ...productForm, descripcion: e.target.value })} />
                                <label>URL de la Imagen</label>
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageUpload}
                                />

                                <div className="modal-actions">
                                    <button type="button" onClick={productForm.idProducto ? handleSaveEdit : handleAddProduct} className="save-btn">
                                        {productForm.idProducto ? 'Guardar' : 'Añadir'}
                                    </button>
                                    <button type="button" onClick={closeModal} className="cancel-btn">Cancelar</button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
}

export default Productos;
