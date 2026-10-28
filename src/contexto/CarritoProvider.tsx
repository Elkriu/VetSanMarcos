import { useState, type ReactNode } from "react";
import { CarritoContext, type LineaCarrito } from "./CarritoContext";

const CLAVE = "carrito_tienda";
const MAXIMO_POR_PRODUCTO = 10;   // simula el stock disponible

function leerCarrito(): LineaCarrito[] {
    try {
        return JSON.parse(localStorage.getItem(CLAVE) ?? "[]");
    } catch {
        return [];
    }
}

function CarritoProvider({ children }: { children: ReactNode }) {
    const [items, setItems] = useState<LineaCarrito[]>(leerCarrito);

    const guardar = (nuevos: LineaCarrito[]) => {
        setItems(nuevos);
        localStorage.setItem(CLAVE, JSON.stringify(nuevos));
    };

    const agregar = (id: number) => {
        const existe = items.some((i) => i.id === id);

        if (existe) {
            guardar(
                items.map((i) =>
                    i.id === id ? { ...i, cantidad: Math.min(i.cantidad + 1, MAXIMO_POR_PRODUCTO) } : i
                )
            );
        } else {
            guardar([...items, { id, cantidad: 1 }]);
        }
    };

    const cambiarCantidad = (id: number, cantidad: number) => {
        const valida = Math.min(Math.max(cantidad, 1), MAXIMO_POR_PRODUCTO);
        guardar(items.map((i) => (i.id === id ? { ...i, cantidad: valida } : i)));
    };

    const quitar = (id: number) => {
        guardar(items.filter((i) => i.id !== id));
    };

    const vaciar = () => guardar([]);

    const cantidadTotal = items.reduce((suma, i) => suma + i.cantidad, 0);

    return (
        <CarritoContext.Provider value={{ items, cantidadTotal, agregar, cambiarCantidad, quitar, vaciar }}>
            {children}
        </CarritoContext.Provider>
    );
}

export default CarritoProvider;