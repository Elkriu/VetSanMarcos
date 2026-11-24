package com.sanmarcos.ventas.controller;

import com.sanmarcos.ventas.dto.BoletaResponse;
import com.sanmarcos.ventas.dto.CrearBoletaRequest;
import com.sanmarcos.ventas.security.UsuarioAutenticado;
import com.sanmarcos.ventas.service.VentaService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/boletas")
@RequiredArgsConstructor
@Tag(name = "Ventas y Boletas", description = "Procesamiento de compras y consulta de boletas electrónicas")
public class VentaController {

    private final VentaService service;

    @PostMapping
    @Operation(summary = "Procesar pago, descontar inventario y emitir boleta electrónica")
    public ResponseEntity<BoletaResponse> crear(@Valid @RequestBody CrearBoletaRequest request,
                                                @AuthenticationPrincipal UsuarioAutenticado usuario) {
        return ResponseEntity.status(HttpStatus.CREATED).body(service.registrarCompra(request, usuario));
    }

    @GetMapping
    @Operation(summary = "Listar boletas (propias si es Cliente, todas si es Admin/Recepción)")
    public List<BoletaResponse> listar(@AuthenticationPrincipal UsuarioAutenticado usuario) {
        return service.listar(usuario);
    }

    @GetMapping("/{numero}")
    @Operation(summary = "Obtener detalle de una boleta por su número")
    public BoletaResponse obtenerPorNumero(@PathVariable Long numero,
                                           @AuthenticationPrincipal UsuarioAutenticado usuario) {
        return service.obtenerPorNumero(numero, usuario);
    }
}