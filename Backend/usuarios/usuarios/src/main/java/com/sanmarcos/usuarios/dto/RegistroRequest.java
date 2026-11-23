package com.sanmarcos.usuarios.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;

@Schema(description = "Datos para el registro público de un cliente. Siempre se crea con rol CLIENTE")
public record RegistroRequest(
    
        @Schema(description = "RUN sin puntos ni guion", example = "12345678K")
        @NotBlank(message = "El RUN es obligatorio.")
        @Pattern(regexp = "^[0-9]{7,8}[0-9kK]$",
                message = "El RUN debe tener entre 8 y 9 caracteres en total, sin puntos ni guion (ej: 123456789 o 12345678K).")
        String run,

        @Schema(description = "Nombre y apellidos, solo letras", example = "Juan Pérez Soto")
        @NotBlank(message = "El nombre es obligatorio.")
        @Pattern(regexp = "^[a-zA-ZáéíóúÁÉÍÓÚñÑ\\s]{2,100}$",
                message = "El nombre solo debe contener letras.")
        String nombre,

        @Schema(description = "Correo con dominio permitido (gmail, outlook, hotmail, yahoo o sanmarcos)", example = "juan@gmail.com")
        @NotBlank(message = "El correo es obligatorio.")
        @Pattern(regexp = "^[a-zA-Z0-9_.+-]+@(gmail|outlook|hotmail|yahoo|sanmarcos)\\.(com|cl)$",
                message = "Ingrese un correo válido con dominio permitido (@gmail, @outlook, @hotmail, @yahoo, @sanmarcos).")
        String email,

        @Schema(description = "De 4 a 10 caracteres, con letras, números y al menos un símbolo (@$!%*?&)", example = "Abc12!")
        @NotBlank(message = "La contraseña es obligatoria.")
        @Pattern(regexp = "^(?=.*[A-Za-z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{4,10}$",
                message = "La contraseña debe tener de 4 a 10 caracteres, e incluir letras, números y al menos un símbolo (@$!%*?&).")
        String password
) {
}