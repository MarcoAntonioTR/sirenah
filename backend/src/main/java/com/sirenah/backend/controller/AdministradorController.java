package com.sirenah.backend.controller;

import java.util.List;
import com.sirenah.backend.model.OurUsers;
import com.sirenah.backend.repository.OurUserRepository;
import com.sirenah.backend.service.OurUserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/admin")
public class AdministradorController {

    @Autowired
    private OurUserService ourUserService;

    @GetMapping("/Listar/Administradores")
    public ResponseEntity<List<OurUsers>> listAdmins() {
        List<OurUsers> admins = ourUserService.ListarPorRole("ADMIN");
        return ResponseEntity.ok(admins);
    }
    @GetMapping("/Listar/Empleados")
    public ResponseEntity<List<OurUsers>> listEmpleados() {
        List<OurUsers> empleados = ourUserService.ListarPorRole("EMPLEADO");
        return ResponseEntity.ok(empleados);
    }


}
