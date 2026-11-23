package com.sanmarcos.usuarios.dto;

import io.swagger.v3.oas.annotations.media.Schema;

@Schema(description = "Respuesta del login: token JWT y datos del usuario para armar la sesión en React")
public record LoginResponse(
        @Schema(description = "Token JWT. Se envía en el header Authorization: Bearer <token>",
                example = "eyJhbGciOiJIUzI1NiJ9...")
        String token,

        @Schema(description = "Datos del usuario autenticado")
        UsuarioResponse usuario
) {
}