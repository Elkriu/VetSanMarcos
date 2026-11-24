package com.sanmarcos.ventas.dto;

import lombok.Data;
import java.util.List;

@Data
public class BoletaResponse {
    private Long numero;
    private String fecha;
    private String clienteNombre;
    private String clienteEmail;
    private List<LineaBoletaResponse> lineas;
    private Integer neto;
    private Integer iva;
    private Integer total;
    private String tarjeta;
}