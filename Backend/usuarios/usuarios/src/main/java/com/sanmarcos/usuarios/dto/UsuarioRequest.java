package com.sanmarcos.usuarios.dto;

import com.sanmarcos.usuarios.model.Rol;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;

@Schema(description = "Datos para crear o editar un usuario desde el panel de administración")
public record UsuarioRequest(
    
        @Schema(description = "RUN sin puntos ni guion (opcional)", example = "12345678K", nullable = true)
        @Pattern(regexp = "^[0-9]{7,8}[0-9kK]$",
                message = "El RUN debe tener entre 8 y 9 caracteres en total, sin puntos ni guion (ej: 123456789 o 12345678K).")
        String run,

        @Schema(description = "Nombre completo, solo letras", example = "Camila Riquelme")
        @NotBlank(message = "El nombre es obligatorio.")
        @Pattern(regexp = "^[a-zA-ZáéíóúÁÉÍÓÚñÑ\\s]{2,100}$",
                message = "El nombre solo debe contener letras.")
        String nombre,

        @Schema(description = "Correo con dominio permitido", example = "camila@sanmarcos.cl")
        @NotBlank(message = "El correo es obligatorio.")
        @Pattern(regexp = "^[a-zA-Z0-9_.+-]+@(gmail|outlook|hotmail|yahoo|sanmarcos)\\.(com|cl)$",
                message = "Ingrese un correo válido con dominio permitido (@gmail, @outlook, @hotmail, @yahoo, @sanmarcos).")
        String email,

        @Schema(description = "Obligatoria al crear. Al editar es opcional: si no se envía, se mantiene la actual",
                example = "Abc12!", nullable = true)
        @Pattern(regexp = "^(?=.*[A-Za-z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{4,10}$",
                message = "La contraseña debe tener de 4 a 10 caracteres, e incluir letras, números y al menos un símbolo (@$!%*?&).")
        String password,

        @Schema(description = "Rol del usuario", example = "RECEPCIONISTA")
        @NotNull(message = "El rol es obligatorio.")
        Rol rol
) {
}