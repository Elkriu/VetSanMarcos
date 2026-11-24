package com.sanmarcos.inventario.model;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "producto")
@Data
public class Producto {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 120)
    private String nombre;

    @Column(nullable = false, length = 40)
    private String categoria;

    @Column(nullable = false, length = 40)
    private String mascota;

    @Column(nullable = false)
    private Integer precio;

    @Column(nullable = false)
    private Integer stock;

    @Column(nullable = false, length = 16)
    private String emoji;

    @Column(nullable = false, length = 255)
    private String imagen;

    @Column(nullable = false, length = 500)
    private String descripcion;

    @Column(nullable = false)
    private Boolean activo = true;
}