package com.sirenah.backend.controller;

import com.sirenah.backend.model.OurUsers;
import com.sirenah.backend.model.Producto;
import com.sirenah.backend.repository.OurUserRepository;
import com.sirenah.backend.service.OurUserService;
import com.sirenah.backend.service.ProductoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/todosroles")
public class TodosRolesController {

    @Autowired
    private OurUserService ourUserService;
    @Autowired
    private ProductoService productoService;

    @GetMapping("/datos/{email}")
    public ResponseEntity<Object> getUserByEmail(@PathVariable String email) {
        Optional<OurUsers> ourUsers = ourUserService.ListarPorEmail(email);
        return ResponseEntity.ok(ourUsers);
    }
    @GetMapping("/Productos/Buscar/{id}")
    public ResponseEntity<Producto> buscarPorId(@PathVariable int id) {
        return productoService.buscarPorId(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

}
