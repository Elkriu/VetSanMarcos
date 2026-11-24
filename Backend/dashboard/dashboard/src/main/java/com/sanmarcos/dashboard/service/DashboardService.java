package com.sanmarcos.dashboard.service;

import com.sanmarcos.dashboard.client.*;
import com.sanmarcos.dashboard.dto.DashboardResumenResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class DashboardService {

    private final UsuarioClient usuarioClient;
    private final ContactoClient contactoClient;
    private final CitaClient citaClient;
    private final InventarioClient inventarioClient;
    private final VentaClient ventaClient;

    @SuppressWarnings("rawtypes")
    public DashboardResumenResponse obtenerResumen(String token) {
        List usuarios = usuarioClient.listarUsuarios(token);
        List citas = citaClient.listarCitas(token);
        List productos = inventarioClient.listarProductos();
        List boletas = ventaClient.listarBoletas(token);
        List mensajes = contactoClient.listarMensajes(token);

        DashboardResumenResponse res = new DashboardResumenResponse();

        res.setTotalUsuarios(usuarios.size());
        int activos = 0;
        for (Object obj : usuarios) {
            Map u = (Map) obj;
            if (!Boolean.TRUE.equals(u.get("suspendido"))) {
                activos++;
            }
        }
        res.setUsuariosActivos(activos);

        res.setCitasAgendadas(citas.size());

        res.setTotalProductos(productos.size());
        int bajoStock = 0;
        for (Object obj : productos) {
            Map p = (Map) obj;
            if (numero(p.get("stock")) <= 5) {
                bajoStock++;
            }
        }
        res.setProductosBajoStock(bajoStock);

        res.setTotalBoletas(boletas.size());
        long ingresos = 0;
        for (Object obj : boletas) {
            Map b = (Map) obj;
            ingresos += numero(b.get("total"));
        }
        res.setIngresosTotales(ingresos);

        res.setMensajesTotales(mensajes.size());
        int sinLeer = 0;
        for (Object obj : mensajes) {
            Map m = (Map) obj;
            if (!Boolean.TRUE.equals(m.get("leido"))) {
                sinLeer++;
            }
        }
        res.setMensajesSinLeer(sinLeer);

        return res;
    }

    private long numero(Object valor) {
        return (valor instanceof Number n) ? n.longValue() : 0L;
    }
}