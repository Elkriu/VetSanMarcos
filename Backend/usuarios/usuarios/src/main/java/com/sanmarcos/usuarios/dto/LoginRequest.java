package com.sanmarcos.usuarios.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;

@Schema(description = "Credenciales para iniciar sesión")
public record LoginRequest(
    
        @Schema(description = "Correo del usuario", example = "admin@sanmarcos.cl")
        @NotBlank(message = "El correo es obligatorio.")
        String email,

        @Schema(description = "Contraseña del usuario", example = "Admin1!")
        @NotBlank(message = "La contraseña es obligatoria.")
        String password
) {
}