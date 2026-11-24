package com.sanmarcos.dashboard.dto;

import lombok.Data;

@Data
public class DashboardResumenResponse {
    private int totalUsuarios;
    private int usuariosActivos;
    private int citasAgendadas;
    private int totalProductos;
    private int productosBajoStock;
    private int totalBoletas;
    private long ingresosTotales;
    private int mensajesTotales;
    private int mensajesSinLeer;
}