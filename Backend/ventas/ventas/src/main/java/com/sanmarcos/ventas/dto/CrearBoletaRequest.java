package com.sanmarcos.ventas.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.Pattern;
import lombok.Data;
import java.util.List;

@Data
public class CrearBoletaRequest {

    @Schema(example = "4242")
    @NotBlank(message = "Los últimos dígitos de la tarjeta son obligatorios.")
    @Pattern(regexp = "^\\d{4}$", message = "Debe indicar los últimos 4 dígitos de la tarjeta.")
    private String tarjeta;

    @Valid
    @NotEmpty(message = "Debe incluir al menos un producto en la compra.")
    private List<ItemCompraRequest> items;
}