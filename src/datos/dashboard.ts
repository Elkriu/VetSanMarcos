import { API_DASHBOARD, peticion } from "../utils/api";

export interface DashboardResumen {
    totalUsuarios: number;
    usuariosActivos: number;
    citasAgendadas: number;
    totalProductos: number;
    productosBajoStock: number;
    totalBoletas: number;
    ingresosTotales: number;
    mensajesTotales: number;
    mensajesSinLeer: number;
}

export function obtenerResumenDashboardApi(): Promise<DashboardResumen> {
    return peticion<DashboardResumen>(`${API_DASHBOARD}/dashboard/resumen`);
}