package com.sanmarcos.citas.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.Data;

@Data
public class CitaRequest {

    @Schema(example = "Consulta General")
    @NotBlank(message = "El servicio es obligatorio.")
    private String servicio;

    @Schema(example = "Perro")
    @NotBlank(message = "El tipo de mascota es obligatorio.")
    private String tipoMascota;

    @Schema(example = "2026-11-30")
    @NotBlank(message = "La fecha es obligatoria.")
    @Pattern(regexp = "^\\d{4}-\\d{2}-\\d{2}$", message = "Formato de fecha inválido (YYYY-MM-DD).")
    private String fecha;

    @Schema(example = "10:00")
    @NotBlank(message = "La hora es obligatoria.")
    @Pattern(regexp = "^(10:00|11:30|15:00|17:15)$", message = "Horario no válido.")
    private String hora;

    @Schema(example = "María Pérez", description = "Opcional si agenda un cliente logueado; obligatorio para agendamiento manual en recepción")
    private String nombreCliente;

    @Schema(example = "Agendamiento Manual (Recepción)")
    private String emailCliente;
}