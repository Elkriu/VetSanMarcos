package com.sanmarcos.contacto.controller;

import com.sanmarcos.contacto.dto.MensajeRequest;
import com.sanmarcos.contacto.dto.MensajeResponse;
import com.sanmarcos.contacto.service.MensajeService;
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
@RequestMapping("/mensajes")
@RequiredArgsConstructor
@Tag(name = "Contacto", description = "CRUD de mensajes enviados desde el formulario público")
public class MensajeController {

    private final MensajeService service;

    @PostMapping
    @Operation(summary = "Enviar mensaje de contacto (Público)")
    public ResponseEntity<MensajeResponse> crear(@Valid @RequestBody MensajeRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(service.crear(request));
    }

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMINISTRADOR', 'RECEPCIONISTA')")
    @Operation(summary = "Listar todos los mensajes (Admin y Recepción)")
    public List<MensajeResponse> listar() {
        return service.listar();
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMINISTRADOR', 'RECEPCIONISTA')")
    @Operation(summary = "Obtener un mensaje por ID")
    public MensajeResponse obtenerPorId(@PathVariable Long id) {
        return service.obtenerPorId(id);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMINISTRADOR')")
    @Operation(summary = "Actualizar un mensaje (Solo Admin)")
    public MensajeResponse actualizar(@PathVariable Long id, @Valid @RequestBody MensajeRequest request) {
        return service.actualizar(id, request);
    }

    @PatchMapping("/{id}/leido")
    @PreAuthorize("hasAnyRole('ADMINISTRADOR', 'RECEPCIONISTA')")
    @Operation(summary = "Marcar mensaje como leído o no leído")
    public MensajeResponse alternarLeido(@PathVariable Long id) {
        return service.alternarLeido(id);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMINISTRADOR', 'RECEPCIONISTA')")
    @Operation(summary = "Eliminar un mensaje (Admin y Recepción)")
    public ResponseEntity<Void> eliminar(@PathVariable Long id) {
        service.eliminar(id);
        return ResponseEntity.noContent().build();
    }
}