package com.sirenah.backend.controller;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.sirenah.backend.model.Categoria;
import com.sirenah.backend.service.CategoriaService;

@RestController
@RequestMapping("/adminempleado/Categorias")
public class CategoriaController {

    @Autowired
    private CategoriaService categoriaService;
    
    @GetMapping("/Listar")
    public ResponseEntity<List<Categoria>> Listar() {
        List<Categoria> categorias = categoriaService.Listar();
        return ResponseEntity.ok(categorias);
    }

    @PostMapping("/Agregar")
    public ResponseEntity<Categoria> registrar(@RequestBody Categoria categoria) {
        Categoria nuevaCategoria = categoriaService.agregar(categoria);
        return ResponseEntity.ok(nuevaCategoria);
    }

    @GetMapping("/Buscar/{id}")
    public ResponseEntity<Categoria> buscarPorId(@PathVariable int id) {
        return categoriaService.buscarPorId(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/Actualizar/{id}")
    public ResponseEntity<Categoria> actualizar(@PathVariable int id, @RequestBody Categoria categoriaDetalles) {
        return categoriaService.buscarPorId(id).map(categoriaExistente -> {
            categoriaExistente.setNombre(categoriaDetalles.getNombre());
            categoriaExistente.setDescripcion(categoriaDetalles.getDescripcion());
            Categoria categoriaActualizado = categoriaService.actualizar(categoriaExistente);
            return ResponseEntity.ok(categoriaActualizado);
        }).orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/Eliminar/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable int id) {
        Optional<Categoria> categoria = categoriaService.buscarPorId(id);
        if (categoria.isPresent()) {
            categoriaService.eliminar(id);
            return ResponseEntity.noContent().build(); // 204 No Content
        } else {
            return ResponseEntity.notFound().build(); // 404 Not Found
        }
    }
}
