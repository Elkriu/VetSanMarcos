package com.sanmarcos.usuarios.service;

import com.sanmarcos.usuarios.dto.UsuarioRequest;
import com.sanmarcos.usuarios.dto.UsuarioResponse;
import com.sanmarcos.usuarios.exception.ApiException;
import com.sanmarcos.usuarios.model.Rol;
import com.sanmarcos.usuarios.model.Usuario;
import com.sanmarcos.usuarios.repository.UsuarioRepository;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class UsuarioService {

    public static final String ADMIN_PRINCIPAL = "admin@sanmarcos.cl";

    private final UsuarioRepository usuarioRepository;
    private final PasswordEncoder passwordEncoder;

    public UsuarioService(UsuarioRepository usuarioRepository, PasswordEncoder passwordEncoder) {
        this.usuarioRepository = usuarioRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Transactional(readOnly = true)
    public List<UsuarioResponse> listar() {
        return usuarioRepository.findAll(Sort.by("id")).stream()
                .map(UsuarioResponse::desde)
                .toList();
    }

    @Transactional(readOnly = true)
    public UsuarioResponse obtener(Long id) {
        return UsuarioResponse.desde(buscar(id));
    }

    @Transactional
    public UsuarioResponse crear(UsuarioRequest request) {
        if (request.password() == null || request.password().isBlank()) {
            throw new ApiException(HttpStatus.BAD_REQUEST, "La contraseña es obligatoria.");
        }

        String email = request.email().trim().toLowerCase();
        String run = normalizarRun(request.run());

        if (usuarioRepository.existsByEmailIgnoreCase(email)) {
            throw new ApiException(HttpStatus.CONFLICT, "Ya existe un usuario registrado con este correo.");
        }
        if (run != null && usuarioRepository.existsByRun(run)) {
            throw new ApiException(HttpStatus.CONFLICT, "Ya existe un usuario registrado con este RUN.");
        }

        Usuario usuario = new Usuario();
        usuario.setRun(run);
        usuario.setNombre(request.nombre().trim());
        usuario.setEmail(email);
        usuario.setPasswordHash(passwordEncoder.encode(request.password()));
        usuario.setRol(request.rol());

        return UsuarioResponse.desde(usuarioRepository.save(usuario));
    }

    @Transactional
    public UsuarioResponse actualizar(Long id, UsuarioRequest request) {
        Usuario usuario = buscar(id);
        String email = request.email().trim().toLowerCase();
        String run = normalizarRun(request.run());

        if (esAdminPrincipal(usuario)
                && (request.rol() != Rol.ADMINISTRADOR || !email.equalsIgnoreCase(usuario.getEmail()))) {
            throw new ApiException(HttpStatus.BAD_REQUEST,
                    "No se puede cambiar el rol ni el correo del administrador principal.");
        }
        if (usuarioRepository.existsByEmailIgnoreCaseAndIdNot(email, id)) {
            throw new ApiException(HttpStatus.CONFLICT, "Ya existe un usuario registrado con este correo.");
        }
        if (run != null && usuarioRepository.existsByRunAndIdNot(run, id)) {
            throw new ApiException(HttpStatus.CONFLICT, "Ya existe un usuario registrado con este RUN.");
        }

        usuario.setRun(run);
        usuario.setNombre(request.nombre().trim());
        usuario.setEmail(email);
        usuario.setRol(request.rol());
        
        if (request.password() != null && !request.password().isBlank()) {
            usuario.setPasswordHash(passwordEncoder.encode(request.password()));
        }

        return UsuarioResponse.desde(usuarioRepository.save(usuario));
    }

    @Transactional
    public UsuarioResponse alternarSuspension(Long id) {
        Usuario usuario = buscar(id);

        if (esAdminPrincipal(usuario)) {
            throw new ApiException(HttpStatus.BAD_REQUEST, "No se puede suspender al administrador principal.");
        }

        usuario.setSuspendido(!usuario.isSuspendido());
        return UsuarioResponse.desde(usuarioRepository.save(usuario));
    }

    @Transactional
    public void eliminar(Long id) {
        Usuario usuario = buscar(id);

        if (esAdminPrincipal(usuario)) {
            throw new ApiException(HttpStatus.BAD_REQUEST, "No se puede eliminar al administrador principal.");
        }

        usuarioRepository.delete(usuario);
    }

    private Usuario buscar(Long id) {
        return usuarioRepository.findById(id)
                .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "Usuario no encontrado."));
    }

    private boolean esAdminPrincipal(Usuario usuario) {
        return ADMIN_PRINCIPAL.equalsIgnoreCase(usuario.getEmail());
    }

    private String normalizarRun(String run) {
        return (run == null || run.isBlank()) ? null : run.trim().toUpperCase();
    }
}