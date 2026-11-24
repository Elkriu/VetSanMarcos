package com.sanmarcos.pagos.model;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Entity
@Table(name = "transaccion")
@Data
public class Transaccion {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, updatable = false)
    private LocalDateTime fecha;

    @Column(name = "cliente_email", nullable = false, length = 120)
    private String clienteEmail;

    @Column(nullable = false)
    private Integer monto;

    @Column(nullable = false, length = 4)
    private String tarjeta;

    @Column(nullable = false, length = 20)
    private String estado; // APROBADO | RECHAZADO

    @Column(nullable = false, length = 200)
    private String motivo;

    @PrePersist
    protected void alCrear() {
        if (this.fecha == null) {
            this.fecha = LocalDateTime.now();
        }
    }
}