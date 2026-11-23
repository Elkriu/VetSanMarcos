package com.sanmarcos.usuarios.controller;

import com.sanmarcos.usuarios.dto.LoginRequest;
import com.sanmarcos.usuarios.dto.LoginResponse;
import com.sanmarcos.usuarios.dto.RegistroRequest;
import com.sanmarcos.usuarios.dto.UsuarioResponse;
import com.sanmarcos.usuarios.service.AuthService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
@Tag(name = "Autenticación", description = "Login, registro público, validación y renovación de sesión")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @Operation(summary = "Iniciar sesión", description = "Entrega un token JWT si las credenciales son correctas.")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Login correcto"),
            @ApiResponse(responseCode = "400", description = "Datos incompletos"),
            @ApiResponse(responseCode = "401", description = "Correo o contraseña incorrectos"),
            @ApiResponse(responseCode = "403", description = "Cuenta suspendida")
    })
    @PostMapping("/login")
    public LoginResponse login(@Valid @RequestBody LoginRequest request) {
        return authService.login(request);
    }

    @Operation(summary = "Registrar cliente", description = "Registro público. El usuario se crea siempre con rol CLIENTE.")
    @ApiResponses({
            @ApiResponse(responseCode = "201", description = "Usuario creado"),
            @ApiResponse(responseCode = "400", description = "Datos inválidos"),
            @ApiResponse(responseCode = "409", description = "Correo o RUN ya registrado")
    })
    @PostMapping("/registro")
    public ResponseEntity<UsuarioResponse> registrar(@Valid @RequestBody RegistroRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(authService.registrar(request));
    }

    @Operation(summary = "Validar token",
            description = "Para uso de los otros microservicios: responde 200 con los datos del usuario si el token es válido, "
                    + "el usuario existe y no está suspendido.")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Token vigente"),
            @ApiResponse(responseCode = "401", description = "Token inválido, vencido o usuario no autorizado")
    })
    @SecurityRequirement(name = "bearerAuth")
    @GetMapping("/validar")
    public UsuarioResponse validar(Authentication authentication) {
        return authService.perfil(authentication.getName());
    }

    @Operation(summary = "Renovar token",
            description = "Con un token vigente entrega uno nuevo y los datos actualizados del usuario. "
                    + "Se usa al recargar la página para extender la sesión.")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Token renovado"),
            @ApiResponse(responseCode = "401", description = "Token inválido, vencido o usuario no autorizado")
    })
    @SecurityRequirement(name = "bearerAuth")
    @PostMapping("/renovar")
    public LoginResponse renovar(Authentication authentication) {
        return authService.renovar(authentication.getName());
    }
}