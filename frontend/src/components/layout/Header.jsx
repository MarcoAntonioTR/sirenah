import { FaShoppingCart, FaUser, FaMoon, FaSun, FaBars } from "react-icons/fa";
import { Link, NavLink, useNavigate } from "react-router-dom";
import "../../styles/Header.css";
import { useState } from "react";
import useAutenticacion from '../hooks/Autenticacion';
import { jwtDecode } from "jwt-decode";
import axios from "axios";
import { AlertaDeEliminacion, AlertaDeExito } from "../../utils/Alertas";
import { FaTrash } from 'react-icons/fa';

const Header = () => {
    const [isDarkMode, setIsDarkMode] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const [cartItems, setCartItems] = useState([]);
    const [isCartOpen, setIsCartOpen] = useState(false);

    const { isAuthenticated, userRole } = useAutenticacion();
    const navigate = useNavigate();

    const toggleMenu = () => {
        setIsOpen(!isOpen);
    };

    const toggleTheme = () => {
        setIsDarkMode(!isDarkMode);
        document.body.classList.toggle("dark-mode", !isDarkMode);
    };

    const PerfilClick = () => {
        if (isAuthenticated) {
            if (userRole === "ADMIN" || userRole === "EMPLEADO") {
                navigate("/MenuAdmin/Perfil");
            } else if (userRole === "USER") {
                navigate("/MenuCliente/Perfil");
            }
        } else {
            navigate("/Login");
        }
    };

    const vaciarCarrito = async () => {
        try {
            const userId = await obtenerUsuarioId();
            const token = localStorage.getItem("token");
            if (!token) {
                alert("Token de autenticación no disponible.");
                return;
            }
            const confirmacion = await AlertaDeEliminacion("¿Estás seguro de eliminar todos los productos?", "");

            if (!confirmacion.isConfirmed) {
                return;
            }
            // Obtener el carrito
            const idCarrito = await fetch(`http://localhost:9090/todosroles/carrito/obtener/${userId}`, {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            });

            if (!idCarrito.ok) {
                throw new Error(`Error al obtener el carrito: ${idCarrito.status}`);
            }

            const carritoData = await idCarrito.json();

            for (const item of carritoData.detalles) {
                await eliminarProductosCarrito(item.idCarritoDetalle);
            }
            AlertaDeExito("¡Éxito!", "Productos eliminados correctamente.");
            setCartItems([]);
        } catch (error) {
            console.error("Error al vaciar el carrito:", error);
            alert("Hubo un problema al vaciar el carrito.");
        }
    };
    const aumentarProducto = async (idProducto) => {
        try {
            const userId = await obtenerUsuarioId();
            const token = localStorage.getItem("token");
            if (!token) {
                alert("Token de autenticación no disponible.");
                return;
            }

            // Obtener carrito
            const idCarrito = await fetch(
                `http://localhost:9090/todosroles/carrito/obtener/${userId}`,
                {
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                }
            );

            if (!idCarrito.ok) {
                throw new Error(`Error ${response.status}: ${response.statusText}`);
            }

            const carritoData = await idCarrito.json();


            const response = await fetch(`http://localhost:9090/todosroles/carrito/${carritoData.idCarrito}/detalle/aumentar?idProducto=${idProducto}`, {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            });

            if (!response.ok) {
                throw new Error(`Error ${response.status}: ${response.statusText}`);
            }

            const updatedDetalle = await response.json();
            setCartItems((prevCartItems) =>
                prevCartItems.map((item) =>
                    item.idProducto === idProducto ? { ...item, cantidad: updatedDetalle.cantidad, subtotal: updatedDetalle.subtotal } : item
                )
            );
        } catch (error) {
            console.error("Error al aumentar la cantidad del producto:", error);
        }
    };
    const eliminarProductosCarrito = async (idCarritoDetalle) => {
        try {
            const userId = await obtenerUsuarioId();
            const token = localStorage.getItem("token");
            if (!token) {
                alert("Token de autenticación no disponible.");
                return;
            }


            // Obtener carrito
            const idCarrito = await fetch(
                `http://localhost:9090/todosroles/carrito/obtener/${userId}`,
                {
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                }
            );

            if (!idCarrito.ok) {
                throw new Error(`Error ${response.status}: ${response.statusText}`);
            }

            const carritoData = await idCarrito.json();


            const response = await fetch(
                `http://localhost:9090/todosroles/carrito/${carritoData.idCarrito}/detalle/${idCarritoDetalle}`,
                {
                    method: "DELETE",
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                }
            );

            if (!response.ok) {
                throw new Error(`Error al eliminar el producto: ${response.statusText}`);
            }
            setCartItems(prevCartItems => prevCartItems.filter(item => item.idCarritoDetalle !== idCarritoDetalle));
        } catch (error) {
            console.error("Error al eliminar el producto:", error);
        }
    };

    const eliminarProductoDelCarrito = async (idCarritoDetalle) => {
        try {
            const userId = await obtenerUsuarioId();
            const token = localStorage.getItem("token");
            if (!token) {
                alert("Token de autenticación no disponible.");
                return;
            }
            const confirmacion = await AlertaDeEliminacion("¿Estás seguro de eliminar este producto?", "");

            if (!confirmacion.isConfirmed) {
                return;
            }

            // Obtener carrito
            const idCarrito = await fetch(
                `http://localhost:9090/todosroles/carrito/obtener/${userId}`,
                {
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                }
            );

            if (!idCarrito.ok) {
                throw new Error(`Error ${response.status}: ${response.statusText}`);
            }

            const carritoData = await idCarrito.json();


            const response = await fetch(
                `http://localhost:9090/todosroles/carrito/${carritoData.idCarrito}/detalle/${idCarritoDetalle}`,
                {
                    method: "DELETE",
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                }
            );

            if (!response.ok) {
                throw new Error(`Error al eliminar el producto: ${response.statusText}`);
            }
            AlertaDeExito("¡Éxito!", "Producto Eliminado Correctamente.");
            setCartItems(prevCartItems => prevCartItems.filter(item => item.idCarritoDetalle !== idCarritoDetalle));
        } catch (error) {
            console.error("Error al eliminar el producto:", error);
        }
    };
    const disminuirProducto = async (idProducto, idCarritoDetalle) => {
        try {
            const userId = await obtenerUsuarioId();
            const token = localStorage.getItem("token");
            if (!token) {
                alert("Token de autenticación no disponible.");
                return;
            }

            // Obtener carrito
            const idCarrito = await fetch(
                `http://localhost:9090/todosroles/carrito/obtener/${userId}`,
                {
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                }
            );

            if (!idCarrito.ok) {
                throw new Error(`Error ${idCarrito.status}: ${idCarrito.statusText}`);
            }

            const carritoData = await idCarrito.json();

            // Buscar el producto en el carrito
            const producto = carritoData.detalles.find(item => item.idProducto === idProducto);

            if (!producto) {
                alert("Producto no encontrado en el carrito.");
                return;
            }

            if (producto.cantidad > 1) {

                const response = await fetch(
                    `http://localhost:9090/todosroles/carrito/${carritoData.idCarrito}/detalle/disminuir?idProducto=${idProducto}`,
                    {
                        method: "POST",
                        headers: {
                            Authorization: `Bearer ${token}`,
                            "Content-Type": "application/json",
                        },
                    }
                );

                if (!response.ok) {
                    throw new Error(`Error al disminuir producto: ${response.statusText}`);
                }

                const updatedDetalle = await response.json();
                setCartItems(prevCartItems =>
                    prevCartItems.map(item =>
                        item.idProducto === idProducto ? { ...item, cantidad: updatedDetalle.cantidad, subtotal: updatedDetalle.subtotal } : item
                    )
                );
            } else {
                await eliminarProductoDelCarrito(idCarritoDetalle);
            }

        } catch (error) {
            console.error("Error al disminuir la cantidad del producto:", error);
        }
    };

    const obtenerUsuarioId = async () => {
        try {
            const token = localStorage.getItem("token");
            if (!token) {
                console.error("Token de autenticación no disponible.");
                return;
            }
            const decodedToken = jwtDecode(token);
            const email = decodedToken.sub;

            const response = await axios.get(
                `http://localhost:9090/todosroles/datos/${email}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            return response.data.id;
        } catch (error) {
            console.error("Error al obtener el usuario:", error);
        }
    };

    const toggleCartModal = async () => {
        try {
            const userId = await obtenerUsuarioId();
            if (!userId) {
                console.error("No se pudo obtener el usuarioId.");
                return;
            }

            if (!isCartOpen) {
                const token = localStorage.getItem("token");
                if (!token) {
                    alert("Token de autenticación no disponible.");
                    return;
                }

                // Obtener carrito
                const response = await fetch(
                    `http://localhost:9090/todosroles/carrito/obtener/${userId}`,
                    {
                        method: "GET",
                        headers: {
                            Authorization: `Bearer ${token}`,
                            "Content-Type": "application/json",
                        },
                    }
                );

                if (!response.ok) {
                    throw new Error(`Error ${response.status}: ${response.statusText}`);
                }

                const carritoData = await response.json();

                
                const detallesCarrito = carritoData.detalles || [];
                const productosConDetalles = await Promise.all(
                    detallesCarrito.map(async (item) => {
                        try {
                            const productoResponse = await fetch(
                                `http://localhost:9090/todosroles/Productos/Buscar/${item.idProducto}`,
                                {
                                    method: "GET",
                                    headers: {
                                        Authorization: `Bearer ${token}`,
                                        "Content-Type": "application/json",
                                    },
                                }
                            );

                            if (!productoResponse.ok) {
                                throw new Error(`Error al obtener producto ${item.idProducto}`);
                            }

                            const productoData = await productoResponse.json();

                            return {
                                ...item,
                                nombre: productoData.nombre,
                                imageUrl: productoData.imgUrl,
                            };
                        } catch (error) {
                            console.error(`Error al obtener detalles del producto ${item.idProducto}:`, error);
                            return item;
                        }
                    })
                );
                setCartItems(productosConDetalles);
            }

            setIsCartOpen(!isCartOpen);
        } catch (error) {
            console.error("Error al obtener el carrito:", error);
        }
    };


    return (
        <header className={isDarkMode ? "dark-mode" : ""}>
            <nav className="navbar">
                <div className="navbar-container">
                    <button className="hamburger" onClick={toggleMenu}>
                        <FaBars className="icon" />
                    </button>

                    <div className={`nav-menu ${isOpen ? "open" : ""}`}>
                        <button className="nav-item" onClick={toggleTheme}>
                            {isDarkMode ? (
                                <FaSun className="icon" title="Cambiar a Tema Claro" />
                            ) : (
                                <FaMoon className="icon" title="Cambiar a Tema Oscuro" />
                            )}
                        </button>
                        <NavLink style={{ fontSize: '20px' }} to="/Home" className={({ isActive }) => (isActive ? "nav-item active" : "nav-item")}>
                            Inicio
                        </NavLink>
                        <NavLink
                            style={{ fontSize: '20px' }}
                            to="/Catalogo"
                            className={({ isActive }) => (isActive ? "nav-item active" : "nav-item")}
                        >
                            Catálogo
                        </NavLink>
                        <div className="nav-item logo-container">
                            <Link to="/Home" className="company-link">
                                <span className="company-name">SIRENAH</span>
                            </Link>
                        </div>
                        <NavLink
                            style={{ fontSize: '20px' }}
                            to="/Nosotros"
                            className={({ isActive }) => (isActive ? "nav-item active" : "nav-item")}
                        >
                            Nosotros
                        </NavLink>
                        <NavLink
                            style={{ fontSize: '20px' }}
                            to="/Contacto"
                            className={({ isActive }) => (isActive ? "nav-item active" : "nav-item")}
                        >
                            Contacto
                        </NavLink>
                        <button className="nav-item" onClick={toggleCartModal}>
                            <FaShoppingCart className="icon" title="Carrito de Compras" />
                            {cartItems.length > 0 && <span className="cart-count">{cartItems.length}</span>}
                        </button>
                        <button onClick={PerfilClick} className="nav-item" title="Cuenta">
                            <FaUser className="icon" />
                        </button>
                    </div>
                </div>
            </nav>
            {isCartOpen && (
                <div className={`cart-modal ${isCartOpen ? "open" : ""}`}>
                    <div className="cart-modal-content">
                        <button className="close-modal" onClick={() => setIsCartOpen(false)}>
                            &times;
                        </button>
                        <h2>Carrito de Compras</h2>
                        {cartItems.length > 0 ? (
                            <ul>
                                {cartItems.map((item, index) => (
                                    <li key={index}>
                                        <img src={item.imageUrl} alt={`Imagen de ${item.nombre}`} />
                                        <div className="product-details">
                                            <h4>{item.nombre}</h4>
                                            <p>Subtotal: ${item.subtotal.toFixed(2)}</p>
                                        </div>
                                        <div className="quantity-controls">
                                            <button onClick={() => disminuirProducto(item.idProducto, item.idCarritoDetalle)}>-</button>
                                            <span>{item.cantidad}</span>
                                            <button onClick={() => aumentarProducto(item.idProducto)}>+</button>

                                        </div>
                                        <button
                                            className="remove-product-btn"
                                            onClick={() => eliminarProductoDelCarrito(item.idCarritoDetalle)}
                                            title="Eliminar producto"
                                        >
                                            <FaTrash className="icon" />
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p>Tu carrito está vacío.</p>
                        )}
                        <div className="cart-summary">
                            <p>
                                Total: <span>${cartItems.reduce((acc, item) => acc + item.subtotal, 0).toFixed(2)}</span>
                            </p>
                        </div>
                        <div className="cart-actions">
                            <button onClick={() => vaciarCarrito()}
                                className="clear-cart">Vaciar Carrito</button>
                            <button >Finalizar Compra</button>
                        </div>
                    </div>
                </div>
            )}

        </header>
    );
};

export default Header;
