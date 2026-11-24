package com.sanmarcos.dashboard.client;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.stereotype.Component;
import org.springframework.web.reactive.function.client.WebClient;

import java.util.Arrays;
import java.util.List;
import java.util.Map;

@Component
public class VentaClient {

    private final WebClient webClient;

    public VentaClient(@Value("${servicios.ventas.url}") String ventasUrl) {
        this.webClient = WebClient.builder().baseUrl(ventasUrl).build();
    }

    @SuppressWarnings("rawtypes")
    public List listarBoletas(String token) {
        try {
            Map[] res = webClient.get()
                    .uri("/boletas")
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