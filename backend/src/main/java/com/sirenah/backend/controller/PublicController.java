package com.sirenah.backend.controller;

import com.sirenah.backend.model.Categoria;
import com.sirenah.backend.model.Producto;
import com.sirenah.backend.service.CategoriaService;
import com.sirenah.backend.service.ProductoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/public")
public class PublicController {

    @Autowired
    ProductoService productoService;
    @Autowired
    CategoriaService categoriaService;

    @GetMapping("/Productos/Listar")
    public ResponseEntity<List<Producto>> listarProductos() {
        try {
            List<Producto> productos = productoService.Listar();
            return new ResponseEntity<>(productos, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/Categorias/Listar")
    public ResponseEntity<List<Categoria>> listarCategorias() {
        try {
            List<Categoria> categorias = categoriaService.Listar();
            return new ResponseEntity<>(categorias, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
