package com.sanmarcos.inventario.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.*;
import lombok.Data;

@Data
public class ProductoRequest {

    @Schema(example = "Alimento Cachorro 3 kg")
    @NotBlank(message = "El nombre del producto es obligatorio.")
    private String nombre;

    @Schema(example = "Alimento")
    @NotBlank(message = "La categoría es obligatoria.")
    private String categoria;

    @Schema(example = "Perro")
    @NotBlank(message = "El tipo de mascota es obligatorio.")
    private String mascota;

    @Schema(example = "15990")
    @NotNull(message = "El precio es obligatorio.")
    @Min(value = 1, message = "El precio debe ser mayor a 0.")
    private Integer precio;

    @Schema(example = "10")
    @NotNull(message = "El stock es obligatorio.")
    @Min(value = 0, message = "El stock no puede ser negativo.")
    private Integer stock;

    @Schema(example = "🍖")
    @NotBlank(message = "El emoji es obligatorio.")
    private String emoji;

    @Schema(example = "/img/productos/alimento-perro.webp")
    @NotBlank(message = "La ruta de imagen es obligatoria.")
    private String imagen;

    @Schema(example = "Alimento balanceado para cachorros.")
    @NotBlank(message = "La descripción es obligatoria.")
    private String descripcion;
}