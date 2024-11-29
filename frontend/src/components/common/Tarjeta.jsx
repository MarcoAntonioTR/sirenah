import PropTypes from 'prop-types';
import '../../styles/Tarjeta.css';
import { FaCartPlus, FaHeart } from 'react-icons/fa';

function Tarjeta({ producto, alAgregarCarrito, alAgregarListaDeseos, alVerDetalles }) {
    return (
        <div className="tarjeta">
            <div className="tarjeta__imagen-contenedor">
                <img
                    src={producto.imgUrl}
                    alt={producto.nombre}
                    className="tarjeta__imagen"
                />
                <div className="tarjeta__overlay" onClick={() => alVerDetalles(producto)}>
                    <p className="tarjeta__overlay-texto">Vista Previa</p>
                </div>
            </div>
            <div className="tarjeta__contenido">
                <h5 className="tarjeta__titulo">{producto.nombre}</h5>
                <p className="tarjeta__descripcion">{producto.descripcion}</p>
                <p className="tarjeta__precio">S/{producto.precio}</p>
                <p className="tarjeta__stock">Stock: {producto.stock}</p>
                <div className="tarjeta__botones">
                    <div
                        className="tarjeta__icono-contenedor"
                        onClick={() => alAgregarCarrito(producto)}
                    >
                        <FaCartPlus className="tarjeta__icono" />
                        <span className="tarjeta__tooltip">Agregar al Carrito</span>
                    </div>
                    <div
                        className="tarjeta__icono-contenedor"
                        onClick={() => alAgregarListaDeseos(producto)}
                    >
                        <FaHeart className="tarjeta__icono" />
                        <span className="tarjeta__tooltip">Lista de Deseos</span>
                    </div>
                </div>
            </div>
        </div>
    );
}

Tarjeta.propTypes = {
    producto: PropTypes.shape({
        idProducto: PropTypes.number.isRequired,
        imgUrl: PropTypes.string.isRequired,
        nombre: PropTypes.string.isRequired,
        descripcion: PropTypes.string.isRequired,
        precio: PropTypes.number.isRequired,
        stock: PropTypes.number.isRequired,
    }).isRequired,
    alAgregarCarrito: PropTypes.func.isRequired,
    alAgregarListaDeseos: PropTypes.func.isRequired,
    alVerDetalles: PropTypes.func.isRequired,
};

export default Tarjeta;
