package com.sirenah.backend.repository;

import com.sirenah.backend.model.OurUsers;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
@Repository
public interface OurUserRepository extends JpaRepository<OurUsers,Integer> {

    Optional<OurUsers> findByEmail(String email);
    Optional<OurUsers> findByDni(String dni);
    List<OurUsers> findByRole(String role);
}
