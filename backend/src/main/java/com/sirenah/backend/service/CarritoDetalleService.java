package com.sirenah.backend.service;

import com.sirenah.backend.model.CarritoDetalle;

import java.util.List;

public interface CarritoDetalleService {
    CarritoDetalle addProductoToCarrito(Integer idCarrito, Integer idProducto, Integer cantidad, Double precioUnitario);
    List<CarritoDetalle> getDetallesByCarrito(Integer idCarrito);
    void removeProductoFromCarrito(Integer idCarrito, Integer idCarritoDetalle);

    CarritoDetalle aumentarCantidadProducto(Integer idCarrito, Integer idProducto);
    CarritoDetalle disminuirCantidadProducto(Integer idCarrito, Integer idProducto);

}