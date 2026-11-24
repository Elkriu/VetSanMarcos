package com.sanmarcos.pagos.dto;

import lombok.Data;

@Data
public class PagoResponse {
    private Long id;
    private String fecha;
    private String clienteEmail;
    private Integer monto;
    private String tarjeta;
    private String estado;
    private String motivo;
}