import { useEffect, useState } from "react";
import UserSidebar from "../../components/layout/UserSidebar";
import "../../styles/stylesUser/CarritoPanel.css";
import { jwtDecode } from "jwt-decode";
import axios from "axios";
const token = localStorage.getItem("token");

axios.interceptors.request.use(
  (config) => {
    config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

function Carrito() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [usuarioId, setUsuarioId] = useState(null);
  const handleCollapseChange = (collapsed) => {
    setIsCollapsed(collapsed);
  };

  const obtenerUsuarioId = async () => {
    try {
      const decodedToken = jwtDecode(localStorage.getItem("token"));
      const email = decodedToken.sub;
      const response = await axios.get(
        `http://localhost:9090/todosroles/datos/${email}`
      );
      setUsuarioId(response.data.id);
    } catch (error) {
      console.error("Error al obtener el usuario:", error);
    }
  };

  const fetchCartItems = async (idUsuario) => {
    try {
      const response = await fetch(
        `http://localhost:9090/todosroles/carrito/obtener/${idUsuario}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      if (!response.ok) {
        throw new Error("Error al obtener el carrito");
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
            console.error(
              `Error al obtener detalles del producto ${item.idProducto}:`,
              error
            );
            return item;
          }
        })
      );
      setCartItems(productosConDetalles);
    } catch (error) {
      console.error("Error al obtener el carrito:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    obtenerUsuarioId();
  }, []);

  useEffect(() => {
    if (usuarioId) {
      fetchCartItems(usuarioId);
    }
  }, [usuarioId]);

  const calculateTotal = () => {
    return cartItems.reduce((total, item) => total + item.subtotal, 0).toFixed(2);
  };

  if (loading) {
    return <p className="loading">Cargando carrito...</p>;
  }

  return (
    <div className="user-layout">
      <UserSidebar onCollapseChange={handleCollapseChange} />
      <main className={`content ${isCollapsed ? "collapsed" : ""}`}>
        <div className="cart-content">
          <h1>Tu Carrito</h1>
          {cartItems.length > 0 ? (
            <>
              <ul className="cart-items">
                {cartItems.map((item) => (
                  <li key={item.idCarritoDetalle} className="cart-item">
                    <div className="item-info">
                      <img
                        src={item.imageUrl}
                        alt={`Producto ${item.idProducto}`}
                        className="item-image"
                      />
                      <div className="item-details">
                        <h4>{item.nombre}</h4>
                        <p>Cantidad: {item.cantidad}</p>
                        <p>Precio unitario: ${item.precioUnitario.toFixed(2)}</p>
                        <p>Subtotal: ${item.subtotal.toFixed(2)}</p>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
              <div className="cart-summary">
                <h3>Total: ${calculateTotal()}</h3>
                <div className="cart-actions">
                  <button className="btn-clear">Vaciar Carrito</button>
                  <button className="btn-checkout">Finalizar Compra</button>
                </div>
              </div>
            </>
          ) : (
            <p>Tu carrito está vacío.</p>
          )}
        </div>
      </main>
    </div>
  );
}

export default Carrito;
