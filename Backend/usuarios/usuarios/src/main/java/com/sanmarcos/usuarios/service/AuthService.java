package com.sanmarcos.usuarios.service;

import com.sanmarcos.usuarios.dto.LoginRequest;
import com.sanmarcos.usuarios.dto.LoginResponse;
import com.sanmarcos.usuarios.dto.RegistroRequest;
import com.sanmarcos.usuarios.dto.UsuarioResponse;
import com.sanmarcos.usuarios.exception.ApiException;
import com.sanmarcos.usuarios.model.Rol;
import com.sanmarcos.usuarios.model.Usuario;
import com.sanmarcos.usuarios.repository.UsuarioRepository;
import com.sanmarcos.usuarios.security.JwtService;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AuthService {

    private final UsuarioRepository usuarioRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    public AuthService(UsuarioRepository usuarioRepository,
                       PasswordEncoder passwordEncoder,
                       JwtService jwtService) {
        this.usuarioRepository = usuarioRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
    }

    @Transactional(readOnly = true)
    public LoginResponse login(LoginRequest request) {
        Usuario usuario = usuarioRepository.findByEmailIgnoreCase(request.email().trim())
                .filter(u -> passwordEncoder.matches(request.password(), u.getPasswordHash()))
                .orElseThrow(() -> new ApiException(HttpStatus.UNAUTHORIZED, "Correo o contraseña incorrectos."));

        if (usuario.isSuspendido()) {
            throw new ApiException(HttpStatus.FORBIDDEN, "Acceso denegado: su cuenta se encuentra suspendida.");
        }

        return new LoginResponse(jwtService.generarToken(usuario), UsuarioResponse.desde(usuario));
    }

    @Transactional
    public UsuarioResponse registrar(RegistroRequest request) {
        String email = request.email().trim().toLowerCase();
        String run = request.run().trim().toUpperCase();

        if (usuarioRepository.existsByEmailIgnoreCase(email)) {
            throw new ApiException(HttpStatus.CONFLICT, "Este correo ya está registrado.");
        }
        if (usuarioRepository.existsByRun(run)) {
            throw new ApiException(HttpStatus.CONFLICT, "Este RUN ya está registrado.");
        }

        Usuario usuario = new Usuario();
        usuario.setRun(run);
        usuario.setNombre(request.nombre().trim());
        usuario.setEmail(email);
        usuario.setPasswordHash(passwordEncoder.encode(request.password()));
        usuario.setRol(Rol.CLIENTE);

        return UsuarioResponse.desde(usuarioRepository.save(usuario));
    }

    @Transactional(readOnly = true)
    public UsuarioResponse perfil(String email) {
        return usuarioRepository.findByEmailIgnoreCase(email)
                .map(UsuarioResponse::desde)
                .orElseThrow(() -> new ApiException(HttpStatus.UNAUTHORIZED, "Sesión inválida."));
    }

    @Transactional(readOnly = true)
    public LoginResponse renovar(String email) {
        Usuario usuario = usuarioRepository.findByEmailIgnoreCase(email)
                .orElseThrow(() -> new ApiException(HttpStatus.UNAUTHORIZED, "Sesión inválida."));

        return new LoginResponse(jwtService.generarToken(usuario), UsuarioResponse.desde(usuario));
    }
}