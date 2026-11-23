package com.sanmarcos.contacto.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.*;
import lombok.Data;

@Data
public class MensajeRequest {

    @Schema(example = "Camila Soto")
    @NotBlank(message = "El nombre es obligatorio.")
    @Pattern(regexp = "^[a-zA-ZáéíóúÁÉÍÓÚñÑ\\s]{2,50}$", message = "El nombre solo debe contener letras (2 a 50 caracteres).")
    private String nombre;

    @Schema(example = "camila@gmail.com")
    @NotBlank(message = "El correo es obligatorio.")
    @Pattern(regexp = "^[a-zA-Z0-9_.+-]+@(gmail|outlook|hotmail|yahoo|sanmarcos)\\.(com|cl)$",
             message = "Ingrese un correo válido con dominio permitido (@gmail, @outlook, @hotmail, @yahoo, @sanmarcos).")
    private String email;

    @Schema(example = "Quisiera consultar valores de consulta general para gato.")
    @NotBlank(message = "El comentario es obligatorio.")
    @Size(min = 5, max = 500, message = "El mensaje debe tener entre 5 y 500 caracteres.")
    private String comentario;
}