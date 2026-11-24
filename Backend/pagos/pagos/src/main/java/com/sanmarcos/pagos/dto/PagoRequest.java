package com.sanmarcos.pagos.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import lombok.Data;

@Data
public class PagoRequest {

    @Schema(example = "42990")
    @NotNull(message = "El monto es obligatorio.")
    @Min(value = 1, message = "El monto debe ser mayor a 0.")
    private Integer monto;

    @Schema(example = "4242")
    @NotBlank(message = "Los últimos 4 dígitos son obligatorios.")
    @Pattern(regexp = "^\\d{4}$", message = "Debe indicar exactamente 4 dígitos.")
    private String tarjeta;
}