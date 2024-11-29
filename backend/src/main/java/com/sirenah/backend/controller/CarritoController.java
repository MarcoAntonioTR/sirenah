// CarritoController.java
package com.sirenah.backend.controller;

import com.sirenah.backend.model.Carrito;
import com.sirenah.backend.service.CarritoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/todosroles/carrito")
public class CarritoController {

    @Autowired
    private CarritoService carritoService;

    @PostMapping("/crear/{idUsuario}")
    public Carrito createCarrito(@PathVariable Integer idUsuario) {
        return carritoService.createCarrito(idUsuario);
    }

    @GetMapping("/obtener/{idUsuario}")
    public Carrito getCarrito(@PathVariable Integer idUsuario) {
        return carritoService.getCarrito(idUsuario);
    }

    @PutMapping("/actualizar/")
    public Carrito updateCarrito(@PathVariable Integer idCarrito, @RequestParam Boolean activo) {
        return carritoService.updateCarrito(idCarrito, activo);
    }
}
