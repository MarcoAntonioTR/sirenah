package com.sirenah.backend.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "Administrador")
@NoArgsConstructor
@AllArgsConstructor
@Data

public class Administrador {
    @Id
    private int idAdmin;
    @Column(name = "nombre", length = 50)
    private String nombre;
    private String apellido;
    private String email;
    private String contrasena;
    private String telefono;
    private boolean bestado;

}

