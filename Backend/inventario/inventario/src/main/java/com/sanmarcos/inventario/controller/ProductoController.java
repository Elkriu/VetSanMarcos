package com.sanmarcos.inventario.controller;

import com.sanmarcos.inventario.dto.DescontarStockItem;
import com.sanmarcos.inventario.dto.ProductoRequest;
import com.sanmarcos.inventario.dto.ProductoResponse;
import com.sanmarcos.inventario.service.ProductoService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/productos")
@RequiredArgsConstructor
@Tag(name = "Inventario", description = "Catálogo de productos y control de stock")
public class ProductoController {

    private final ProductoService service;

    @GetMapping
    @Operation(summary = "Listar productos activos con su stock (Público)")
    public List<ProductoResponse> listar() {
        return service.listar();
    }

    @GetMapping("/{id}")
    @Operation(summary = "Obtener detalle de un producto (Público)")
    public ProductoResponse obtenerPorId(@PathVariable Long id) {
        return service.obtenerPorId(id);
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('ADMINISTRADOR', 'RECEPCIONISTA')")
    @Operation(summary = "Crear producto en inventario (Admin y Recepción)")
    public ResponseEntity<ProductoResponse> crear(@Valid @RequestBody ProductoRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(service.crear(request));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMINISTRADOR', 'RECEPCIONISTA')")
    @Operation(summary = "Actualizar datos y stock de un producto (Admin y Recepción)")
    public ProductoResponse actualizar(@PathVariable Long id, @Valid @RequestBody ProductoRequest request) {
        return service.actualizar(id, request);
    }

    @PatchMapping("/{id}/stock")
    @PreAuthorize("hasAnyRole('ADMINISTRADOR', 'RECEPCIONISTA')")
    @Operation(summary = "Ajustar stock de un producto (Admin y Recepción)")
    public ProductoResponse actualizarStock(@PathVariable Long id, @RequestParam Integer stock) {
        return service.actualizarStock(id, stock);
    }

    @PostMapping("/descontar")
    @Operation(summary = "Descontar stock tras una compra (Usuarios autenticados / ms_ventas)")
    public ResponseEntity<Void> descontar(@Valid @RequestBody List<DescontarStockItem> items) {
        service.descontarStock(items);
        return ResponseEntity.noContent().build();
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMINISTRADOR', 'RECEPCIONISTA')")
    @Operation(summary = "Eliminar producto del catálogo (Admin y Recepción)")
    public ResponseEntity<Void> eliminar(@PathVariable Long id) {
        service.eliminar(id);
        return ResponseEntity.noContent().build();
    }
}