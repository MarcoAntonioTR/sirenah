package com.sirenah.backend.service.impl;

import com.sirenah.backend.model.Carrito;
import com.sirenah.backend.model.CarritoDetalle;
import com.sirenah.backend.repository.CarritoDetalleRepository;
import com.sirenah.backend.repository.CarritoRepository;
import com.sirenah.backend.service.CarritoDetalleService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class CarritoDetalleServiceImpl implements CarritoDetalleService {

    @Autowired
    private CarritoDetalleRepository carritoDetalleRepository;
    @Autowired
    private CarritoRepository carritoRepository;

    @Override
    public CarritoDetalle addProductoToCarrito(Integer idCarrito, Integer idProducto, Integer cantidad, Double precioUnitario) {
        // Buscar el carrito
        Carrito carrito = carritoRepository.findById(idCarrito)
                .orElseThrow(() -> new RuntimeException("Carrito no encontrado"));

        // Buscar si el producto ya existe en los detalles del carrito
        Optional<CarritoDetalle> detalleExistente = carrito.getDetalles().stream()
                .filter(detalle -> detalle.getIdProducto().equals(idProducto))
                .findFirst();

        if (detalleExistente.isPresent()) {
            // Si ya existe, actualizamos la cantidad y el subtotal
            CarritoDetalle detalle = detalleExistente.get();
            detalle.setCantidad(detalle.getCantidad() + cantidad);
            detalle.setSubtotal(detalle.getCantidad() * detalle.getPrecioUnitario());
            return carritoDetalleRepository.save(detalle);
        } else {
            // Si no existe, creamos un nuevo detalle
            CarritoDetalle nuevoDetalle = new CarritoDetalle();
            nuevoDetalle.setCarrito(carrito);
            nuevoDetalle.setIdProducto(idProducto);
            nuevoDetalle.setCantidad(cantidad);
            nuevoDetalle.setPrecioUnitario(precioUnitario);
            nuevoDetalle.setSubtotal(cantidad * precioUnitario);
            return carritoDetalleRepository.save(nuevoDetalle);
        }
    }



    @Override
    public List<CarritoDetalle> getDetallesByCarrito(Integer idCarrito) {
        return carritoDetalleRepository.findByCarritoIdCarrito(idCarrito);
    }

    @Override
    public void removeProductoFromCarrito(Integer idCarrito, Integer idCarritoDetalle) {
        carritoDetalleRepository.deleteById(idCarritoDetalle);
    }
    @Override
    public CarritoDetalle aumentarCantidadProducto(Integer idCarrito, Integer idProducto) {
        // Buscar el carrito
        Carrito carrito = carritoRepository.findById(idCarrito)
                .orElseThrow(() -> new RuntimeException("Carrito no encontrado"));

        // Buscar si el producto ya existe en los detalles del carrito
        CarritoDetalle detalle = carrito.getDetalles().stream()
                .filter(d -> d.getIdProducto().equals(idProducto))
                .findFirst()
                .orElseThrow(() -> new RuntimeException("Producto no encontrado en el carrito"));

        // Aumentar la cantidad
        detalle.setCantidad(detalle.getCantidad() + 1);
        detalle.setSubtotal(detalle.getCantidad() * detalle.getPrecioUnitario());

        // Guardar y devolver el detalle actualizado
        return carritoDetalleRepository.save(detalle);
    }

    @Override
    public CarritoDetalle disminuirCantidadProducto(Integer idCarrito, Integer idProducto) {
        // Buscar el carrito
        Carrito carrito = carritoRepository.findById(idCarrito)
                .orElseThrow(() -> new RuntimeException("Carrito no encontrado"));

        // Buscar si el producto ya existe en los detalles del carrito
        CarritoDetalle detalle = carrito.getDetalles().stream()
                .filter(d -> d.getIdProducto().equals(idProducto))
                .findFirst()
                .orElseThrow(() -> new RuntimeException("Producto no encontrado en el carrito"));

        // Disminuir la cantidad
        int nuevaCantidad = detalle.getCantidad() - 1;

        if (nuevaCantidad <= 0) {
            // Si la cantidad llega a 0 o menos, eliminar el detalle del carrito
            carritoDetalleRepository.delete(detalle);
            return null; // Producto eliminado
        } else {
            detalle.setCantidad(nuevaCantidad);
            detalle.setSubtotal(detalle.getCantidad() * detalle.getPrecioUnitario());
            return carritoDetalleRepository.save(detalle); // Detalle actualizado
        }
    }


}
