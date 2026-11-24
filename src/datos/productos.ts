import { API_INVENTARIO, peticion } from "../utils/api";

export type Categoria = "Alimento" | "Juguetes" | "Higiene" | "Accesorios" | "Salud";
export type Mascota = "Perro" | "Gato" | "Ave" | "Conejo";

export interface Producto {
    id: number;
    nombre: string;
    categoria: Categoria;
    mascota: Mascota;
    precio: number;
    stock: number;
    emoji: string;
    imagen: string;
    descripcion: string;
}

export interface ProductoRequest {
    nombre: string;
    categoria: Categoria;
    mascota: Mascota;
    precio: number;
    stock: number;
    emoji: string;
    imagen: string;
    descripcion: string;
}

export interface DescontarStockItem {
    productoId: number;
    cantidad: number;
}

export const categorias: Categoria[] = ["Alimento", "Juguetes", "Higiene", "Accesorios", "Salud"];
export const mascotas: Mascota[] = ["Perro", "Gato", "Ave", "Conejo"];

export function listarProductosApi(): Promise<Producto[]> {
    return peticion<Producto[]>(`${API_INVENTARIO}/productos`, {}, false);
}

export function obtenerProductoApi(id: number): Promise<Producto> {
    return peticion<Producto>(`${API_INVENTARIO}/productos/${id}`, {}, false);
}

export function crearProductoApi(datos: ProductoRequest): Promise<Producto> {
    return peticion<Producto>(`${API_INVENTARIO}/productos`, {
        method: "POST",
        body: JSON.stringify(datos),
    });
}

export function actualizarProductoApi(id: number, datos: ProductoRequest): Promise<Producto> {
    return peticion<Producto>(`${API_INVENTARIO}/productos/${id}`, {
        method: "PUT",
        body: JSON.stringify(datos),
    });
}

export function actualizarStockApi(id: number, stock: number): Promise<Producto> {
    return peticion<Producto>(`${API_INVENTARIO}/productos/${id}/stock?stock=${stock}`, {
        method: "PATCH",
    });
}

export function descontarStockApi(items: DescontarStockItem[]): Promise<void> {
    return peticion<void>(`${API_INVENTARIO}/productos/descontar`, {
        method: "POST",
        body: JSON.stringify(items),
    });
}

export function eliminarProductoApi(id: number): Promise<void> {
    return peticion<void>(`${API_INVENTARIO}/productos/${id}`, {
        method: "DELETE",
    });
}