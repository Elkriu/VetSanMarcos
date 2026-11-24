package com.sanmarcos.ventas.security;

import com.sanmarcos.ventas.client.UsuarioClient;
import io.jsonwebtoken.Claims;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;
import org.springframework.web.reactive.function.client.WebClientResponseException;

import java.io.IOException;
import java.util.List;
import java.util.Map;

@Component
@RequiredArgsConstructor
public class JwtFilter extends OncePerRequestFilter {

    private final JwtService jwtService;
    private final UsuarioClient usuarioClient;

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain chain) throws ServletException, IOException {
        String header = request.getHeader(HttpHeaders.AUTHORIZATION);

        if (header != null && header.startsWith("Bearer ")) {
            String token = header.substring(7);
            try {
                Claims claims = jwtService.leerClaims(token);
                Long id = claims.get("id", Number.class) != null ? claims.get("id", Number.class).longValue() : null;
                String email = claims.getSubject();
                String nombre = claims.get("nombre", String.class);
                String rol = claims.get("rol", String.class);

                try {
                    Map<?, ?> validado = usuarioClient.validarToken(token);
                    if (validado != null) {
                        if (validado.get("rol") != null) rol = validado.get("rol").toString();
                        if (validado.get("nombre") != null) nombre = validado.get("nombre").toString();
                        if (validado.get("id") instanceof Number n) id = n.longValue();
                    }
                } catch (WebClientResponseException ex) {
                    SecurityContextHolder.clearContext();
                    chain.doFilter(request, response);
                    return;
                }

                if (rol != null && email != null) {
                    String rolNormalizado = rol.trim().toUpperCase();
                    UsuarioAutenticado principal = new UsuarioAutenticado(id, email, nombre, rolNormalizado, token);
                    var auth = new UsernamePasswordAuthenticationToken(
                            principal,
                            null,
                            List.of(new SimpleGrantedAuthority("ROLE_" + rolNormalizado))
                    );
                    SecurityContextHolder.getContext().setAuthentication(auth);
                }
            } catch (Exception e) {
                SecurityContextHolder.clearContext();
            }
        }

        chain.doFilter(request, response);
    }
}