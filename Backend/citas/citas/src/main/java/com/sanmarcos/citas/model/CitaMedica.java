package com.sanmarcos.citas.model;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "cita_medica")
@Data
public class CitaMedica {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "usuario_id")
    private Long usuarioId;

    @Column(name = "nombre_cliente", nullable = false, length = 100)
    private String nombreCliente;

    @Column(name = "email_cliente", nullable = false, length = 120)
    private String emailCliente;

    @Column(nullable = false, length = 80)
    private String servicio;

    @Column(name = "tipo_mascota", nullable = false, length = 50)
    private String tipoMascota;

    @Column(nullable = false)
    private LocalDate fecha;

    @Column(nullable = false, length = 10)
    private String hora;

    @Column(name = "creada_en", nullable = false, updatable = false)
    private LocalDateTime creadaEn;

    @PrePersist
    protected void alCrear() {
        if (this.creadaEn == null) {
            this.creadaEn = LocalDateTime.now();
        }
    }
}