package com.sirenah.backend.repository;

import com.sirenah.backend.model.Carrito;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface CarritoRepository extends JpaRepository<Carrito, Integer> {
    Carrito findByIdUsuarioAndActivo(Integer idUsuario, Boolean activo);
}
