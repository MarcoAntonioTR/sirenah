package com.sirenah.backend.service;

import com.sirenah.backend.model.OurUsers;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

public interface OurUserService {

    List<OurUsers> ListarPorRole(String role);
    Optional<OurUsers> ListarPorEmail(String email);
    OurUsers agregar(OurUsers ourUsers);
    OurUsers actualizar(OurUsers ourUsers);
    Optional<OurUsers> buscarPorId(int id);
    void eliminar(int id);

}
