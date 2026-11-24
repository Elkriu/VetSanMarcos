package com.sanmarcos.pagos.controller;

import com.sanmarcos.pagos.dto.PagoRequest;
import com.sanmarcos.pagos.dto.PagoResponse;
import com.sanmarcos.pagos.service.PagoService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/pagos")
@RequiredArgsConstructor
@Tag(name = "Pagos", description = "Procesamiento de cobros e historial de transacciones")
public class PagoController {

    private final PagoService service;

    @PostMapping
    @Operation(summary = "Procesar cobro con tarjeta y registrar transacción")
    public ResponseEntity<PagoResponse> procesar(@Valid @RequestBody PagoRequest request,
                                                 Authentication auth) {
        return ResponseEntity.status(HttpStatus.CREATED).body(service.procesarPago(request, auth.getName()));
    }

    @GetMapping
    @Operation(summary = "Listar transacciones (propias o todas si es Admin/Recepción)")
    public List<PagoResponse> listar(Authentication auth) {
        boolean esStaff = auth.getAuthorities().stream()
                .anyMatch(a -> a.getAuthority().equals("ROLE_ADMINISTRADOR")
                        || a.getAuthority().equals("ROLE_RECEPCIONISTA"));
        return service.listar(auth.getName(), esStaff);
    }
}