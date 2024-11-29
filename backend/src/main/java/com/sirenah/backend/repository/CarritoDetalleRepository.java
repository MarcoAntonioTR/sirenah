package com.sirenah.backend.repository;

import com.sirenah.backend.model.CarritoDetalle;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface CarritoDetalleRepository extends JpaRepository<CarritoDetalle, Integer> {
    List<CarritoDetalle> findByCarritoIdCarrito(Integer idCarrito);
}