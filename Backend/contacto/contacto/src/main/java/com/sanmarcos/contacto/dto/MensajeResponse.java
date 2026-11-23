package com.sanmarcos.contacto.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;
import java.time.LocalDateTime;

@Data
public class MensajeResponse {
    @Schema(example = "1")
    private Long id;
    @Schema(example = "Camila Soto")
    private String nombre;
    @Schema(example = "camila@gmail.com")
    private String email;
    @Schema(example = "Quisiera consultar valores de consulta general para gato.")
    private String comentario;
    @Schema(example = "false")
    private Boolean leido;
    private LocalDateTime fechaEnvio;
}