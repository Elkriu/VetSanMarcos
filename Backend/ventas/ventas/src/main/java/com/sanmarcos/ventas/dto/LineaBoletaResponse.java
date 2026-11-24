package com.sanmarcos.ventas.dto;

import lombok.Data;

@Data
public class LineaBoletaResponse {
    private Long productoId;
    private String nombre;
    private Integer precio;
    private Integer cantidad;
}