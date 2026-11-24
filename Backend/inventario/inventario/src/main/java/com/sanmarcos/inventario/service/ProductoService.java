package com.sanmarcos.inventario.service;

import com.sanmarcos.inventario.dto.DescontarStockItem;
import com.sanmarcos.inventario.dto.ProductoRequest;
import com.sanmarcos.inventario.dto.ProductoResponse;
import com.sanmarcos.inventario.exception.ApiException;
import com.sanmarcos.inventario.model.Producto;
import com.sanmarcos.inventario.repository.ProductoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ProductoService {

    private final ProductoRepository repository;

    public List<ProductoResponse> listar() {
        return repository.findByActivoTrueOrderByIdAsc().stream()
                .map(this::aResponse)
                .toList();
    }

    public ProductoResponse obtenerPorId(Long id) {
        return aResponse(buscarActivo(id));
    }

    public ProductoResponse crear(ProductoRequest req) {
        Producto nuevo = new Producto();
        aplicarDatos(nuevo, req);
        nuevo.setActivo(true);
        return aResponse(repository.save(nuevo));
    }

    public ProductoResponse actualizar(Long id, ProductoRequest req) {
        Producto producto = buscarActivo(id);
        aplicarDatos(producto, req);
        return aResponse(repository.save(producto));
    }

    public ProductoResponse actualizarStock(Long id, Integer nuevoStock) {
        if (nuevoStock == null || nuevoStock < 0) {
            throw new ApiException(HttpStatus.BAD_REQUEST, "El stock no puede ser negativo.");
        }
        Producto producto = buscarActivo(id);
        producto.setStock(nuevoStock);
        return aResponse(repository.save(producto));
    }

    @Transactional
    public void descontarStock(List<DescontarStockItem> items) {
        if (items == null || items.isEmpty()) {
            throw new ApiException(HttpStatus.BAD_REQUEST, "Debe indicar al menos un producto.");
        }
        for (DescontarStockItem item : items) {
            Producto producto = buscarActivo(item.getProductoId());
            if (producto.getStock() < item.getCantidad()) {
                throw new ApiException(
                        HttpStatus.CONFLICT,
                        "Stock insuficiente para " + producto.getNombre() + " (disponible: " + producto.getStock() + ")."
                );
            }
            producto.setStock(producto.getStock() - item.getCantidad());
            repository.save(producto);
        }
    }

    public void eliminar(Long id) {
        Producto producto = buscarActivo(id);
        producto.setActivo(false);
        repository.save(producto);
    }

    private Producto buscarActivo(Long id) {
        return repository.findByIdAndActivoTrue(id)
                .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "Producto no encontrado."));
    }

    private void aplicarDatos(Producto p, ProductoRequest req) {
        p.setNombre(req.getNombre().trim());
        p.setCategoria(req.getCategoria().trim());
        p.setMascota(req.getMascota().trim());
        p.setPrecio(req.getPrecio());
        p.setStock(req.getStock());
        p.setEmoji(req.getEmoji().trim());
        p.setImagen(req.getImagen().trim());
        p.setDescripcion(req.getDescripcion().trim());
    }

    private ProductoResponse aResponse(Producto p) {
        ProductoResponse res = new ProductoResponse();
        res.setId(p.getId());
        res.setNombre(p.getNombre());
        res.setCategoria(p.getCategoria());
        res.setMascota(p.getMascota());
        res.setPrecio(p.getPrecio());
        res.setStock(p.getStock());
        res.setEmoji(p.getEmoji());
        res.setImagen(p.getImagen());
        res.setDescripcion(p.getDescripcion());
        return res;
    }
}