package com.sanmarcos.ventas.client;

import com.sanmarcos.ventas.dto.ItemCompraRequest;
import com.sanmarcos.ventas.exception.ApiException;
import lombok.Data;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.web.reactive.function.client.WebClientResponseException;

import java.util.List;
import java.util.Map;

@Component
public class InventarioClient {

    private final WebClient webClient;

    public InventarioClient(@Value("${servicios.inventario.url}") String inventarioUrl) {
        this.webClient = WebClient.builder().baseUrl(inventarioUrl).build();
    }

    @Data
    public static class ProductoRemoto {
        private Long id;
        private String nombre;
        private Integer precio;
        private Integer stock;
    }

    public ProductoRemoto obtenerProducto(Long id) {
        try {
            return webClient.get()
                    .uri("/productos/{id}", id)
                    .retrieve()
                    .bodyToMono(ProductoRemoto.class)
                    .block();
        } catch (WebClientResponseException.NotFound ex) {
            throw new ApiException(HttpStatus.NOT_FOUND, "Producto con ID " + id + " no encontrado en inventario.");
        } catch (Exception ex) {
            throw new ApiException(HttpStatus.SERVICE_UNAVAILABLE, "No se pudo consultar el servicio de inventario.");
        }
    }

    public void descontarStock(List<ItemCompraRequest> items, String token) {
        try {
            webClient.post()
                    .uri("/productos/descontar")
                    .header(HttpHeaders.AUTHORIZATION, "Bearer " + token)
                    .bodyValue(items)
                    .retrieve()
                    .toBodilessEntity()
                    .block();
        } catch (WebClientResponseException ex) {
            Map<?, ?> body = ex.getResponseBodyAs(Map.class);
            String msg = (body != null && body.get("mensaje") != null)
                    ? body.get("mensaje").toString()
                    : "No se pudo descontar el stock en inventario.";
            throw new ApiException(HttpStatus.valueOf(ex.getStatusCode().value()), msg);
        } catch (Exception ex) {
            throw new ApiException(HttpStatus.SERVICE_UNAVAILABLE, "Error de comunicación con inventario.");
        }
    }
}