import Tarjeta from "./Tarjeta";
import "../../styles/Catalogo.css";
import { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import axios from "axios";
import { AlertaDeError, AlertaDeExito } from "../../utils/Alertas";

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

function ProductList() {
  const [isDarkMode] = useState(false);
  const [productos, setProductos] = useState([]);
  const [productosFiltrados, setProductosFiltrados] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [filtro, setFiltro] = useState({
    nombre: "",
    categoria: "",
    marca: "",
    precioMin: 0,
    precioMax: 5000,
    stock: false,
    descuento: false,
    ordenar: "nombreAsc",
  });
  const [usuarioId, setUsuarioId] = useState(null);

  const obtenerUsuarioId = async () => {
    try {
      const decodedToken = jwtDecode(token);
      const email = decodedToken.sub;
      const response = await axios.get(
        `http://localhost:9090/todosroles/datos/${email}`
      );
      setUsuarioId(response.data.id);
    } catch (error) {
      console.error("Error al obtener el usuario:", error);
    }
  };

  useEffect(() => {
    obtenerUsuarioId();
    const obtenerProductos = async () => {
      try {
        const respuesta = await fetch(
          "http://localhost:9090/public/Productos/Listar"
        );
        const datos = await respuesta.json();
        setProductos(datos);
        setProductosFiltrados(datos);
      } catch (error) {
        console.error("Error al obtener los productos:", error);
      }
    };

    // Llamada para obtener las categorías
    const obtenerCategorias = async () => {
      try {
        const respuesta = await fetch(
          "http://localhost:9090/public/Categorias/Listar"
        );
        const datos = await respuesta.json();
        setCategorias(datos);
      } catch (error) {
        console.error("Error al obtener las categorías:", error);
      }
    };

    obtenerProductos();
    obtenerCategorias();
  }, []);

  const manejarAgregarCarrito = async (producto) => {
    try {
      /*
      if (!usuarioId) {
        alert("Usuario no identificado.");
        return;
      }
      */
      const token = localStorage.getItem("token");

      if (!token) {
        AlertaDeError("¡Error!","Debe iniciar session.")
        return;
      }

      // 3. Obtener el carrito del usuario
      let carrito;

      try {
        const carritoResponse = await fetch(
          `http://localhost:9090/todosroles/carrito/obtener/${usuarioId}`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );
        if (403 == carritoResponse.status) {
          const carritoCreadoResponse = await fetch(
            `http://localhost:9090/todosroles/carrito/crear/${usuarioId}`,
            {
              method: "POST",
              headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
              },
            }
          );
          carrito = await carritoCreadoResponse.json();
        } else {
          carrito = await carritoResponse.json();
        }
      // eslint-disable-next-line no-unused-vars
      } catch (error) {
        return;
      }
      

      // 4. Agregar producto al carrito
      try {
        const agregarProductoResponse = await fetch(
          `http://localhost:9090/todosroles/carrito/${carrito.idCarrito}/detalle?idProducto=${producto.idProducto}&cantidad=${1}&precioUnitario=${producto.precio}`,
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (!agregarProductoResponse.ok) {
          throw new Error("Error al agregar el producto al carrito.");
        }

        
        AlertaDeExito("¡Exito!","Producto agregado al carrito con éxito.");
      } catch (error) {
        console.error("Error al agregar producto al carrito:", error);
        alert("Hubo un error al agregar el producto al carrito.");
      }


    } catch (error) {
      console.error("Error al manejar el carrito:", error);
      alert("Hubo un error al agregar el producto al carrito.");
    }
  };

  const manejarAplicarFiltros = () => {
    let productosFiltrados = productos.filter((producto) => {
      const nombreCoincide = producto.nombre
        .toLowerCase()
        .includes(filtro.nombre.toLowerCase());
      const categoriaCoincide = filtro.categoria
        ? producto.idCategoria === filtro.categoria
        : true;
      const precioCoincide =
        producto.precio >= filtro.precioMin &&
        producto.precio <= filtro.precioMax;
      const stockCoincide = filtro.stock ? producto.stock > 0 : true;

      return (
        nombreCoincide && categoriaCoincide && precioCoincide && stockCoincide
      );
    });

    // Aplicar ordenamiento
    if (filtro.ordenar === "nombreAsc") {
      productosFiltrados.sort((a, b) => a.nombre.localeCompare(b.nombre));
    } else if (filtro.ordenar === "nombreDesc") {
      productosFiltrados.sort((a, b) => b.nombre.localeCompare(a.nombre));
    } else if (filtro.ordenar === "precioAsc") {
      productosFiltrados.sort((a, b) => a.precio - b.precio);
    } else if (filtro.ordenar === "precioDesc") {
      productosFiltrados.sort((a, b) => b.precio - a.precio);
    }

    setProductosFiltrados(productosFiltrados);
  };

  const manejarLimpiarFiltros = () => {
    setFiltro({
      nombre: "",
      categoria: "",
      marca: "",
      precioMin: 0,
      precioMax: 5000,
      stock: false,
      descuento: false,
      ordenar: "nombreAsc",
    });
    setProductosFiltrados(productos);
  };

  return (
    <main className={`catalogo ${isDarkMode ? "dark-mode" : ""}`}>
      <div className="filtros-catalogo">
        <div className="filtro-item">
          <label htmlFor="nombre">Buscar por nombre:</label>
          <input
            type="text"
            id="nombre"
            value={filtro.nombre}
            onChange={(e) => setFiltro({ ...filtro, nombre: e.target.value })}
            className="form-control"
            placeholder="Ej. Camiseta"
          />
        </div>

        <div className="filtro-item">
          <label htmlFor="categoria">Filtrar por categoría:</label>
          <select
            id="categoria"
            value={filtro.categoria}
            onChange={(e) =>
              setFiltro({ ...filtro, categoria: parseInt(e.target.value) })
            }
            className="form-control"
          >
            <option value="">Seleccionar categoría</option>
            {categorias.map((categoria) => (
              <option key={categoria.idCategoria} value={categoria.idCategoria}>
                {categoria.nombre}
              </option>
            ))}
          </select>
        </div>

        <div className="filtro-item">
          <label>
            <input
              type="checkbox"
              checked={filtro.stock}
              onChange={(e) =>
                setFiltro({ ...filtro, stock: e.target.checked })
              }
            />
            Solo productos en stock
          </label>
        </div>

        <div className="filtro-item">
          <label htmlFor="ordenar">Ordenar por:</label>
          <select
            id="ordenar"
            value={filtro.ordenar}
            onChange={(e) => setFiltro({ ...filtro, ordenar: e.target.value })}
            className="form-control"
          >
            <option value="nombreAsc">Nombre (A-Z)</option>
            <option value="nombreDesc">Nombre (Z-A)</option>
            <option value="precioAsc">Precio (menor a mayor)</option>
            <option value="precioDesc">Precio (mayor a menor)</option>
          </select>
        </div>

        <button className="aplicar-filtros" onClick={manejarAplicarFiltros}>
          Aplicar Filtros
        </button>
        <button className="limpiar-filtros" onClick={manejarLimpiarFiltros}>
          Limpiar Filtros
        </button>
      </div>

      <div className="tarjetas-catalogo">
        {productosFiltrados.map((producto) => (
          <Tarjeta
            key={producto.idProducto}
            producto={producto}
            alAgregarCarrito={() => manejarAgregarCarrito(producto)}
            alAgregarListaDeseos={(producto) =>
              console.log("Producto agregado a la lista de deseos:", producto)
            }
            alVerDetalles={(producto) =>
              alert(
                `Detalles del producto:\nNombre: ${producto.nombre}\nDescripción: ${producto.descripcion}\nPrecio: S/${producto.precio}`
              )
            }
          />
        ))}
      </div>
    </main>
  );
}

export default ProductList;
