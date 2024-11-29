package com.sirenah.backend.service.impl;

import com.sirenah.backend.model.Carrito;
import com.sirenah.backend.repository.CarritoRepository;
import com.sirenah.backend.service.CarritoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class CarritoServiceImpl implements CarritoService {

    @Autowired
    private CarritoRepository carritoRepository;

    @Override
    public Carrito createCarrito(Integer idUsuario) {
        Carrito carrito = new Carrito();
        carrito.setIdUsuario(idUsuario);
        return carritoRepository.save(carrito);
    }

    @Override
    public Carrito getCarrito(Integer idUsuario) {
        Carrito carrito = carritoRepository.findByIdUsuarioAndActivo(idUsuario, true);
        if (carrito == null) {
            throw new RuntimeException("Carrito no encontrado para el usuario con ID " + idUsuario);
        }
        return carrito;
    }

    @Override
    public Carrito updateCarrito(Integer idCarrito, Boolean activo) {
        Carrito carrito = carritoRepository.findById(idCarrito).orElse(null);
        if (carrito != null) {
            carrito.setActivo(activo);
            return carritoRepository.save(carrito);
        }
        return null;
    }

}
