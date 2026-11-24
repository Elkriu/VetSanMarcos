package com.sanmarcos.ventas.model;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "boleta")
@Data 
public class Boleta {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long numero;

    @Column(nullable = false, updatable = false)
    private LocalDateTime fecha;

    @Column(name = "cliente_nombre", nullable = false, length = 100)
    private String clienteNombre;

    @Column(name = "cliente_email", nullable = false, length = 120)
    private String clienteEmail;

    @Column(nullable = false)
    private Integer neto;

    @Column(nullable = false)
    private Integer iva;

    @Column(nullable = false)
    private Integer total;

    @Column(nullable = false, length = 10)
    private String tarjeta;

    @OneToMany(mappedBy = "boleta", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.EAGER)
    private List<LineaBoleta> lineas = new ArrayList<>();

    @PrePersist
    protected void alCrear() {
        if (this.fecha == null) {
            this.fecha = LocalDateTime.now();
        }
    }
}