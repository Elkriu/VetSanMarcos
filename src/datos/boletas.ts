import { API_VENTAS, peticion } from "../utils/api";

export interface LineaBoleta {
    productoId?: number;
    nombre: string;
    precio: number;
    cantidad: number;
}

export interface Boleta {
    numero: number;
    fecha: string;
    clienteNombre: string;
    clienteEmail: string;
    lineas: LineaBoleta[];
    neto: number;
    iva: number;
    total: number;
    tarjeta: string;
}

export interface ItemCompra {
    productoId: number;
    cantidad: number;
}

export interface CrearBoletaPayload {
    tarjeta: string;
    items: ItemCompra[];
}

export function registrarBoletaApi(datos: CrearBoletaPayload): Promise<Boleta> {
    return peticion<Boleta>(`${API_VENTAS}/boletas`, {
        method: "POST",
        body: JSON.stringify(datos),
    });
}

export function listarBoletasApi(): Promise<Boleta[]> {
    return peticion<Boleta[]>(`${API_VENTAS}/boletas`);
}

export function buscarBoletaApi(numero: number): Promise<Boleta> {
    return peticion<Boleta>(`${API_VENTAS}/boletas/${Math.floor(numero)}`);
}