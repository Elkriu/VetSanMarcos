package com.sanmarcos.dashboard.client;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.stereotype.Component;
import org.springframework.web.reactive.function.client.WebClient;

import java.util.Arrays;
import java.util.List;
import java.util.Map;

@Component
public class ContactoClient {

    private final WebClient webClient;

    public ContactoClient(@Value("${servicios.contacto.url}") String contactoUrl) {
        this.webClient = WebClient.builder().baseUrl(contactoUrl).build();
    }

    @SuppressWarnings("rawtypes")
    public List listarMensajes(String token) {
        try {
            Map[] res = webClient.get()
                    .uri("/mensajes")
                    .header(HttpHeaders.AUTHORIZATION, "Bearer " + token)
                    .retrieve()
                    .bodyToMono(Map[].class)
                    .block();
            return res != null ? Arrays.asList(res) : List.of();
        } catch (Exception ex) {
            return List.of();
        }
    }
}