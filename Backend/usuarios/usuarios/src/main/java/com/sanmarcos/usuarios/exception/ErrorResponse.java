package com.sanmarcos.usuarios.exception;

import io.swagger.v3.oas.annotations.media.Schema;

import java.time.LocalDateTime;
import java.util.Map;

@Schema(description = "Respuesta de error estándar de la API")
public record ErrorResponse(
        @Schema(description = "Código HTTP", example = "409")
        int status,

        @Schema(description = "Mensaje para mostrar al usuario", example = "Este correo ya está registrado.")
        String mensaje,

        @Schema(description = "Errores por campo (solo en validaciones). La clave es el nombre del campo")
        Map<String, String> errores,

        @Schema(description = "Momento en que ocurrió el error")
        LocalDateTime fecha
) {

    public static ErrorResponse de(int status, String mensaje) {
        return new ErrorResponse(status, mensaje, Map.of(), LocalDateTime.now());
    }

    public static ErrorResponse de(int status, String mensaje, Map<String, String> errores) {
        return new ErrorResponse(status, mensaje, errores, LocalDateTime.now());
    }
}