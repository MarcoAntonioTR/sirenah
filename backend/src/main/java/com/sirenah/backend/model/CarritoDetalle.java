package com.sirenah.backend.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@Entity
@Table(name = "carrito_detalle")
public class CarritoDetalle {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer idCarritoDetalle;

    @ManyToOne
    @JoinColumn(name = "idCarrito", nullable = false)
    @JsonIgnore
    private Carrito carrito;

    @Column(nullable = false)
    private Integer idProducto;

    @Column(nullable = false)
    private Integer cantidad;

    @Column(nullable = false)
    private Double precioUnitario;

    @Column(nullable = false)
    private Double subtotal;


}