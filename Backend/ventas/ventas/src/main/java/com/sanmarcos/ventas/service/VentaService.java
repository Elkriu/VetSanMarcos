package com.sanmarcos.ventas.service;

import com.sanmarcos.ventas.client.InventarioClient;
import com.sanmarcos.ventas.dto.*;
import com.sanmarcos.ventas.exception.ApiException;
import com.sanmarcos.ventas.model.Boleta;
import com.sanmarcos.ventas.model.LineaBoleta;
import com.sanmarcos.ventas.repository.BoletaRepository;
import com.sanmarcos.ventas.security.UsuarioAutenticado;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class VentaService {

    private static final DateTimeFormatter FORMATO_FECHA = DateTimeFormatter.ofPattern("dd-MM-yyyy, HH:mm");

    private final BoletaRepository repository;
    private final InventarioClient inventarioClient;

    @Transactional
    public BoletaResponse registrarCompra(CrearBoletaRequest req, UsuarioAutenticado user) {
        List<LineaBoleta> lineas = new ArrayList<>();
        int total = 0;

        for (ItemCompraRequest item : req.getItems()) {
            var prod = inventarioClient.obtenerProducto(item.getProductoId());
            if (prod.getStock() < item.getCantidad()) {
                throw new ApiException(
                        HttpStatus.CONFLICT,
                        "Stock insuficiente para " + prod.getNombre() + " (disponible: " + prod.getStock() + ")."
                );
            }

            LineaBoleta linea = new LineaBoleta();
            linea.setProductoId(prod.getId());
            linea.setNombre(prod.getNombre());
            linea.setPrecio(prod.getPrecio());
            linea.setCantidad(item.getCantidad());
            lineas.add(linea);

            total += prod.getPrecio() * item.getCantidad();
        }


        inventarioClient.descontarStock(req.getItems(), user.getToken());

        int neto = (int) Math.round(total / 1.19);
        int iva = total - neto;

        Boleta boleta = new Boleta();
        boleta.setClienteNombre(
                (user.getNombre() != null && !user.getNombre().isBlank()) ? user.getNombre() : user.getEmail()
        );
        boleta.setClienteEmail(user.getEmail());
        boleta.setNeto(neto);
        boleta.setIva(iva);
        boleta.setTotal(total);
        boleta.setTarjeta(req.getTarjeta());

        for (LineaBoleta linea : lineas) {
            linea.setBoleta(boleta);
        }
        boleta.setLineas(lineas);

        return aResponse(repository.save(boleta));
    }

    public List<BoletaResponse> listar(UsuarioAutenticado user) {
        boolean esStaff = "ADMINISTRADOR".equals(user.getRol()) || "RECEPCIONISTA".equals(user.getRol());
        List<Boleta> lista = esStaff
                ? repository.findAllByOrderByNumeroDesc()
                : repository.findByClienteEmailIgnoreCaseOrderByNumeroDesc(user.getEmail());

        return lista.stream().map(this::aResponse).toList();
    }

    public BoletaResponse obtenerPorNumero(Long numero, UsuarioAutenticado user) {
        Boleta boleta = repository.findById(numero)
                .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "Boleta no encontrada."));

        boolean esStaff = "ADMINISTRADOR".equals(user.getRol()) || "RECEPCIONISTA".equals(user.getRol());
        if (!esStaff && !boleta.getClienteEmail().equalsIgnoreCase(user.getEmail())) {
            throw new ApiException(HttpStatus.FORBIDDEN, "No tienes permiso para ver esta boleta.");
        }

        return aResponse(boleta);
    }

    private BoletaResponse aResponse(Boleta b) {
        BoletaResponse res = new BoletaResponse();
        res.setNumero(b.getNumero());
        res.setFecha(b.getFecha().format(FORMATO_FECHA));
        res.setClienteNombre(b.getClienteNombre());
        res.setClienteEmail(b.getClienteEmail());
        res.setNeto(b.getNeto());
        res.setIva(b.getIva());
        res.setTotal(b.getTotal());
        res.setTarjeta(b.getTarjeta());
        res.setLineas(b.getLineas().stream().map(l -> {
            LineaBoletaResponse lr = new LineaBoletaResponse();
            lr.setProductoId(l.getProductoId());
            lr.setNombre(l.getNombre());
            lr.setPrecio(l.getPrecio());
            lr.setCantidad(l.getCantidad());
            return lr;
        }).toList());
        return res;
    }
}