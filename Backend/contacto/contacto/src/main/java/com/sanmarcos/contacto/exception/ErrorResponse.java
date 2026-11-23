package com.sanmarcos.contacto.exception;

import lombok.Data;
import java.time.LocalDateTime;
import java.util.Map;

@Data
public class ErrorResponse {
    private int status;
    private String mensaje;
    private Map<String, String> errores;
    private LocalDateTime fecha;

    public ErrorResponse(int status, String mensaje, Map<String, String> errores) {
        this.status = status;
        this.mensaje = mensaje;
        this.errores = errores;
        this.fecha = LocalDateTime.now();
    }
}