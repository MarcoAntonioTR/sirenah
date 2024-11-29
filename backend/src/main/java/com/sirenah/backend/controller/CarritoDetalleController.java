// CarritoDetalleController.java
package com.sirenah.backend.controller;

import com.sirenah.backend.model.CarritoDetalle;
import com.sirenah.backend.service.CarritoDetalleService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/todosroles/carrito/{idCarrito}/detalle")
public class CarritoDetalleController {

    @Autowired
    private CarritoDetalleService carritoDetalleService;

    @PostMapping
    public CarritoDetalle addProductoToCarrito(@PathVariable Integer idCarrito,
                                               @RequestParam Integer idProducto,
                                               @RequestParam Integer cantidad,
                                               @RequestParam Double precioUnitario) {
        return carritoDetalleService.addProductoToCarrito(idCarrito, idProducto, cantidad, precioUnitario);
    }

    @GetMapping
    public List<CarritoDetalle> getDetallesByCarrito(@PathVariable Integer idCarrito) {
        return carritoDetalleService.getDetallesByCarrito(idCarrito);
    }

    @DeleteMapping("/{idCarritoDetalle}")
    public void removeProductoFromCarrito(@PathVariable Integer idCarrito,
                                          @PathVariable Integer idCarritoDetalle) {
        carritoDetalleService.removeProductoFromCarrito(idCarrito, idCarritoDetalle);
    }


    @PostMapping("/aumentar")
    public ResponseEntity<?> aumentarCantidadProducto(
            @PathVariable Integer idCarrito,
            @RequestParam Integer idProducto
    ) {
        try {
            CarritoDetalle detalle = carritoDetalleService.aumentarCantidadProducto(idCarrito, idProducto);
            return ResponseEntity.ok(detalle);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }

    // Endpoint para disminuir la cantidad de un producto en el carrito
    @PostMapping("/disminuir")
    public ResponseEntity<?> disminuirCantidadProducto(
            @PathVariable Integer idCarrito,
            @RequestParam Integer idProducto
    ) {
        try {
            CarritoDetalle detalle = carritoDetalleService.disminuirCantidadProducto(idCarrito, idProducto);
            return ResponseEntity.ok(detalle);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }
}
