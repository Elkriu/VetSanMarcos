
package com.sanmarcos.dashboard.controller;

import com.sanmarcos.dashboard.dto.DashboardResumenResponse;
import com.sanmarcos.dashboard.service.DashboardService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/dashboard")
@RequiredArgsConstructor
@Tag(name = "Dashboard", description = "Métricas consolidadas de la clínica veterinaria")
public class DashboardController {

    private final DashboardService service;

    @GetMapping("/resumen")
    @PreAuthorize("hasAnyRole('ADMINISTRADOR', 'RECEPCIONISTA')")
    @Operation(summary = "Obtener resumen ejecutivo consolidando usuarios, citas, inventario, ventas y contacto")
    public DashboardResumenResponse resumen(Authentication auth) {
        String token = auth.getCredentials() != null ? auth.getCredentials().toString() : "";
        return service.obtenerResumen(token);
    }
}