package com.sanmarcos.citas.controller;

import com.sanmarcos.citas.dto.CitaRequest;
import com.sanmarcos.citas.dto.CitaResponse;
import com.sanmarcos.citas.dto.ReprogramarCitaRequest;
import com.sanmarcos.citas.security.UsuarioAutenticado;
import com.sanmarcos.citas.service.CitaService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/citas")
@RequiredArgsConstructor
@Tag(name = "Citas", description = "Gestión de agenda veterinaria y disponibilidad de horarios")
public class CitaController {

    private final CitaService service;

    @GetMapping("/disponibilidad")
    @Operation(summary = "Consultar horas ocupadas para una fecha (Público)")
    public List<String> disponibilidad(@RequestParam String fecha) {
        return service.horasOcupadas(fecha);
    }

    @PostMapping
    @Operation(summary = "Agendar nueva cita médica (Cliente o Recepción)")
    public ResponseEntity<CitaResponse> crear(@Valid @RequestBody CitaRequest request,
                                              @AuthenticationPrincipal UsuarioAutenticado usuario) {
        return ResponseEntity.status(HttpStatus.CREATED).body(service.crear(request, usuario));
    }

    @GetMapping
    @Operation(summary = "Listar citas (propias si es Cliente, todas si es Admin/Recepción)")
    public List<CitaResponse> listar(@AuthenticationPrincipal UsuarioAutenticado usuario) {
        return service.listar(usuario);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMINISTRADOR', 'RECEPCIONISTA')")
    @Operation(summary = "Reprogramar fecha y hora de una cita (Solo Admin/Recepción)")
    public CitaResponse reprogramar(@PathVariable Long id,
                                    @Valid @RequestBody ReprogramarCitaRequest request) {
        return service.reprogramar(id, request);
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Cancelar / eliminar una cita")
    public ResponseEntity<Void> cancelar(@PathVariable Long id,
                                         @AuthenticationPrincipal UsuarioAutenticado usuario) {
        service.cancelar(id, usuario);
        return ResponseEntity.noContent().build();
    }
}