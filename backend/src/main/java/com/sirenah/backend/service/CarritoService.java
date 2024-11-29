package com.sirenah.backend.service;

import com.sirenah.backend.model.Carrito;
import com.sirenah.backend.model.CarritoDetalle;

public interface CarritoService {
    Carrito createCarrito(Integer idUsuario);
    Carrito getCarrito(Integer idUsuario);
    Carrito updateCarrito(Integer idCarrito, Boolean activo);
}
