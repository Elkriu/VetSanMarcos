package com.sanmarcos.citas.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.Data;

@Data
public class ReprogramarCitaRequest {

    @Schema(example = "2026-12-01")
    @NotBlank(message = "La nueva fecha es obligatoria.")
    @Pattern(regexp = "^\\d{4}-\\d{2}-\\d{2}$", message = "Formato de fecha inválido (YYYY-MM-DD).")
    private String fecha;

    @Schema(example = "11:30")
    @NotBlank(message = "La nueva hora es obligatoria.")
    @Pattern(regexp = "^(10:00|11:30|15:00|17:15)$", message = "Horario no válido.")
    private String hora;
}