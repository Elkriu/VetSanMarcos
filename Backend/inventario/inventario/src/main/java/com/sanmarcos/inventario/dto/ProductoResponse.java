package com.sanmarcos.inventario.dto;

import lombok.Data;

@Data
public class ProductoResponse {
    private Long id;
    private String nombre;
    private String categoria;
    private String mascota;
    private Integer precio;
    private Integer stock;
    private String emoji;
    private String imagen;
    private String descripcion;
}