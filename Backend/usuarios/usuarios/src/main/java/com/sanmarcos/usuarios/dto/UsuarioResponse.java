package com.sanmarcos.usuarios.dto;

import com.sanmarcos.usuarios.model.Rol;
import com.sanmarcos.usuarios.model.Usuario;
import io.swagger.v3.oas.annotations.media.Schema;

import java.time.LocalDateTime;

@Schema(description = "Datos públicos de un usuario. Nunca incluye la contraseña ni su hash")
public record UsuarioResponse(
        @Schema(description = "Identificador único", example = "1")
        Long id,

        @Schema(description = "RUN sin puntos ni guion (puede ser nulo)", example = "12345678K", nullable = true)
        String run,

        @Schema(description = "Nombre completo", example = "Cristian Vega")
        String nombre,

        @Schema(description = "Correo electrónico", example = "cristianv@gmail.com")
        String email,

        @Schema(description = "Rol del usuario", example = "CLIENTE")
        Rol rol,

        @Schema(description = "Indica si la cuenta está suspendida", example = "false")
        boolean suspendido,

        @Schema(description = "Fecha y hora de creación de la cuenta")
        LocalDateTime fechaCreacion
) {

    public static UsuarioResponse desde(Usuario u) {
        return new UsuarioResponse(
                u.getId(),
                u.getRun(),
                u.getNombre(),
                u.getEmail(),
                u.getRol(),
                u.isSuspendido(),
                u.getFechaCreacion()
        );
    }
}