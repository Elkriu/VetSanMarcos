import { createContext } from "react";

export interface LineaCarrito {
    id: number;
    cantidad: number;
}

export interface CarritoContextoTipo {
    items: LineaCarrito[];
    cantidadTotal: number;
    agregar: (id: number) => void;
    cambiarCantidad: (id: number, cantidad: number) => void;
    quitar: (id: number) => void;
    vaciar: () => void;
}

export const CarritoContext = createContext<CarritoContextoTipo | null>(null);