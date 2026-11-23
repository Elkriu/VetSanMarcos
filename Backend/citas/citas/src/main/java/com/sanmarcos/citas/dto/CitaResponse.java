package com.sanmarcos.citas.dto;

import lombok.Data;

@Data
public class CitaResponse {
    private Long id;
    private Long usuarioId;
    private String nombreCliente;
    private String emailCliente;
    private String servicio;
    private String tipoMascota;
    private String fecha;
    private String hora;
}