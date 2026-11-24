package com.sanmarcos.ventas.model;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "linea_boleta")
@Data
public class LineaBoleta {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "boleta_numero", nullable = false)
    private Boleta boleta;

    @Column(name = "producto_id", nullable = false)
    private Long productoId;

    @Column(nullable = false, length = 120)
    private String nombre;

    @Column(nullable = false)
    private Integer precio;

    @Column(nullable = false)
    private Integer cantidad;
}