package com.sirenah.backend.repository;

import com.sirenah.backend.model.CarritoDetalle;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
@Repository
public interface CarritoDetalleRepository extends JpaRepository<CarritoDetalle, Integer> {
    List<CarritoDetalle> findByCarritoIdCarrito(Integer idCarrito);
}