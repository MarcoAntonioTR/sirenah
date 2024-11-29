package com.sirenah.backend.service.impl;

import com.sirenah.backend.model.OurUsers;
import com.sirenah.backend.repository.OurUserRepository;
import com.sirenah.backend.service.OurUserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class OurUserServiceImpl implements OurUserService {

    @Autowired
    OurUserRepository ourUserRepository;


    @Override
    public List<OurUsers> ListarPorRole(String role) {
        return ourUserRepository.findByRole(role);
    }

    @Override
    public Optional<OurUsers> ListarPorEmail(String email) {
        return ourUserRepository.findByEmail(email);
    }

    @Override
    public OurUsers agregar(OurUsers ourUsers) {
        return ourUserRepository.save(ourUsers);
    }
    @Override
    public OurUsers actualizar(OurUsers ourUsers) {
        return ourUserRepository.save(ourUsers);
    }
    @Override
    public Optional<OurUsers> buscarPorId(int id) {
        return Optional.empty();
    }
    @Override
    public void eliminar(int id) {
        ourUserRepository.deleteById(id);
    }
}
