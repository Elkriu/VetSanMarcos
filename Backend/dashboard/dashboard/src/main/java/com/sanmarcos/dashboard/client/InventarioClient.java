package com.sanmarcos.dashboard.client;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.web.reactive.function.client.WebClient;

import java.util.Arrays;
import java.util.List;
import java.util.Map;

@Component
public class InventarioClient {

    private final WebClient webClient;

    public InventarioClient(@Value("${servicios.inventario.url}") String inventarioUrl) {
        this.webClient = WebClient.builder().baseUrl(inventarioUrl).build();
    }

    @SuppressWarnings("rawtypes")
    public List listarProductos() {
        try {
            Map[] res = webClient.get()
                    .uri("/productos")
                    .retrieve()
                    .bodyToMono(Map[].class)
                    .block();
            return res != null ? Arrays.asList(res) : List.of();
        } catch (Exception ex) {
            return List.of();
        }
    }
}