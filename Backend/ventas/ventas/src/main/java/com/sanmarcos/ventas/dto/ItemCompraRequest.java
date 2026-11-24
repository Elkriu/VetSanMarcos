package com.sanmarcos.ventas.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class ItemCompraRequest {

    @Schema(example = "1")
    @NotNull(message = "El ID del producto es obligatorio.")
    private Long productoId;

    @Schema(example = "2")
    @NotNull(message = "La cantidad es obligatoria.")
    @Min(value = 1, message = "La cantidad debe ser al menos 1.")
    private Integer cantidad;
}