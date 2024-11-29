package com.sirenah.backend.controller;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.sirenah.backend.model.Producto;
import com.sirenah.backend.service.ProductoService;


@RestController
@RequestMapping("/adminempleado/Productos")
public class ProductoController {

    @Autowired
    private ProductoService productoService;

    @GetMapping("/Listar")
    public ResponseEntity<List<Producto>> Listar() {
        List<Producto> productos = productoService.Listar();
        return ResponseEntity.ok(productos);
    }

    @PostMapping("/Agregar")
    public ResponseEntity<Producto> registrar(@RequestBody Producto producto) {
        Producto nuevoProducto = productoService.agregar(producto);
        return ResponseEntity.ok(nuevoProducto);
    }

    @GetMapping("/Buscar/{id}")
    public ResponseEntity<Producto> buscarPorId(@PathVariable int id) {
        return productoService.buscarPorId(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/Actualizar/{id}")
    public ResponseEntity<Producto> actualizar(@PathVariable int id, @RequestBody Producto productoDetalles) {
        return productoService.buscarPorId(id).map(productoExistente -> {
            productoExistente.setImgUrl(productoDetalles.getImgUrl());
            productoExistente.setNombre(productoDetalles.getNombre());
            productoExistente.setDescripcion(productoDetalles.getDescripcion());
            productoExistente.setPrecio(productoDetalles.getPrecio());
            productoExistente.setStockMinimo(productoDetalles.getStockMinimo());
            productoExistente.setStock(productoDetalles.getStock());
            productoExistente.setIdCategoria(productoDetalles.getIdCategoria());
            productoExistente.setEstado(productoDetalles.isEstado());
            Producto productoActualizado = productoService.actualizar(productoExistente);
            return ResponseEntity.ok(productoActualizado);
        }).orElse(ResponseEntity.notFound().build());
    }
    @DeleteMapping("/Eliminar/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable int id) {
        Optional<Producto> producto = productoService.buscarPorId(id);
        if (producto.isPresent()) {
            productoService.eliminar(id);
            return ResponseEntity.noContent().build(); // 204 No Content
        } else {
            return ResponseEntity.notFound().build(); // 404 Not Found
        }
    }
}
