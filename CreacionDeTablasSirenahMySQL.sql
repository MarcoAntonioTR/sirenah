-- Estructura de tabla para la tabla `Ourusers`
CREATE TABLE ourusers (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(50) DEFAULT "ADMIN",
    nombre VARCHAR(100) NOT NULL,
    apellido VARCHAR(100) NOT NULL,
    dni VARCHAR(20) NOT NULL UNIQUE,
    telefono VARCHAR(20) NOT NULL,
    estado BOOLEAN NOT NULL DEFAULT TRUE,
    fecha_nacimiento DATE 
);


-- Estructura de tabla para la tabla `direccion`
CREATE TABLE direccion (
  idDireccion INT AUTO_INCREMENT PRIMARY KEY,
  descripcion VARCHAR(100) NOT NULL,
  departamento VARCHAR(50) NOT NULL,
  provincia VARCHAR(50) NOT NULL,
  distrito VARCHAR(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Estructura tabla `ciente_direccion`
CREATE TABLE cliente_direccion (
  idClienteDireccion INT AUTO_INCREMENT PRIMARY KEY,
  idCliente INT NOT NULL,
  idDireccion INT NOT NULL,
  FOREIGN KEY (idCliente) REFERENCES ourusers(id),
  FOREIGN KEY (idDireccion) REFERENCES direccion(idDireccion)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Estructura de tabla para la tabla `categoria`
CREATE TABLE categoria (
  idCategoria INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL,
  descripcion VARCHAR(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Estructura de tabla para la tabla `proveedores`
CREATE TABLE proveedores (
  idProveedor INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL,
  ruc VARCHAR(15) NOT NULL,
  email VARCHAR(100) NOT NULL,
  telefono VARCHAR(15) NOT NULL,
  direccion VARCHAR(255) NOT NULL,
  estado BIT DEFAULT 1 NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Estructura de tabla para la tabla `producto`
CREATE TABLE producto (
  idProducto INT AUTO_INCREMENT PRIMARY KEY,
  imgUrl VARCHAR(255) NULL,
  nombre VARCHAR(100) NOT NULL,
  descripcion VARCHAR(225) NOT NULL,
  precio DECIMAL(10, 2) NOT NULL, 
  stockMinimo INT NOT NULL,
  stock INT NOT NULL,
  cantidad int NOT NULL DEFAULT 1,
  idCategoria INT NOT NULL,
  estado BIT DEFAULT 1 NOT NULL,
  FOREIGN KEY (idCategoria) REFERENCES categoria(idCategoria)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Estructura de tabla para la tabla `carrito`
CREATE TABLE carrito (
    idCarrito INT AUTO_INCREMENT PRIMARY KEY,
    idUsuario INT NOT NULL,
    activo BOOLEAN DEFAULT TRUE,
    FOREIGN KEY (idUsuario) REFERENCES ourusers(id)
);


CREATE TABLE carrito_detalle (
    idCarritoDetalle INT AUTO_INCREMENT PRIMARY KEY,
    idCarrito INT NOT NULL,
    idProducto INT NOT NULL,
    cantidad INT NOT NULL,
    precioUnitario DECIMAL(10, 2) NOT NULL,
    subtotal DECIMAL(10, 2) NOT NULL, 
    FOREIGN KEY (idCarrito) REFERENCES carrito(idCarrito),
    FOREIGN KEY (idProducto) REFERENCES producto(idProducto)
);


-- Estructura de tabla para la tabla `metodo_pago`
CREATE TABLE metodo_pago (
  idPago INT AUTO_INCREMENT PRIMARY KEY,
  tipo VARCHAR(50) NOT NULL,
  idCarrito INT NULL,
  detallesPago VARCHAR(255) NULL,
  FOREIGN KEY (idCarrito) REFERENCES carrito(idCarrito)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Estructura de tabla para la tabla `pedido`
CREATE TABLE pedido (
  idPedido INT AUTO_INCREMENT PRIMARY KEY,
  idCliente INT NOT NULL,
  fechaPedido DATETIME NOT NULL,
  estado VARCHAR(50) NOT NULL,
  total DECIMAL(10,2) NOT NULL,
  FOREIGN KEY (idCliente) REFERENCES ourusers(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Estructura de tabla para la tabla `detalle_pedido`
CREATE TABLE detalle_pedido (
  idDetallePedido INT AUTO_INCREMENT PRIMARY KEY,
  idPedido INT NOT NULL,
  idProducto INT NOT NULL,
  cantidad INT NOT NULL,
  precioUnitario DECIMAL(10,2) NOT NULL,
  FOREIGN KEY (idPedido) REFERENCES pedido(idPedido),
  FOREIGN KEY (idProducto) REFERENCES producto(idProducto)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Estructura de tabla para la tabla `orden`
CREATE TABLE orden (
  idOrden INT AUTO_INCREMENT PRIMARY KEY,
  idProveedor INT NOT NULL,
  fechaOrden DATETIME NOT NULL,
  estado VARCHAR(50) NOT NULL, -- Ejemplo: "En Proceso", "Recibido"
  total DECIMAL(10,2) NOT NULL,
  FOREIGN KEY (idProveedor) REFERENCES proveedores(idProveedor)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Estructura de tabla para la tabla `detalle_orden`
CREATE TABLE detalle_orden (
  idDetalleOrden INT AUTO_INCREMENT PRIMARY KEY,
  idOrden INT NOT NULL,
  idProducto INT NOT NULL,
  cantidad INT NOT NULL,
  precioUnitario DECIMAL(10,2) NOT NULL,
  FOREIGN KEY (idOrden) REFERENCES orden(idOrden),
  FOREIGN KEY (idProducto) REFERENCES producto(idProducto)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

