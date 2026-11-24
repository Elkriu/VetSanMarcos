package com.sanmarcos.inventario.client;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.stereotype.Component;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.web.reactive.function.client.WebClientResponseException;

import java.util.Map;

@Component
public class UsuarioClient {

    private final WebClient webClient;

    public UsuarioClient(@Value("${servicios.usuarios.url}") String usuariosUrl) {
        this.webClient = WebClient.builder().baseUrl(usuariosUrl).build();
    }

    public String validarToken(String token) {
        try {
            Map<?, ?> respuesta = webClient.get()
                    .uri("/auth/validar")
                    .header(HttpHeaders.AUTHORIZATION, "Bearer " + token)
                    .retrieve()
                    .bodyToMono(Map.class)
                    .block();

            if (respuesta != null && respuesta.get("rol") != null) {
                return respuesta.get("rol").toString();
            }
            return null;
        } catch (WebClientResponseException ex) {
            throw ex;
        } catch (Exception ignored) {
            return null;
        }
    }
}