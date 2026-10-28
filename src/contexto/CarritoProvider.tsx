import { useState, type ReactNode } from "react";
import { CarritoContext, type LineaCarrito } from "./CarritoContext";
import { stockDe } from "../datos/stock";

const CLAVE = "carrito_tienda";

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
        const actual = items.find((i) => i.id === id)?.cantidad ?? 0;

        // No se puede superar el stock disponible
        if (actual >= stockDe(id)) return;

        if (actual > 0) {
            guardar(items.map((i) => (i.id === id ? { ...i, cantidad: actual + 1 } : i)));
        } else {
            guardar([...items, { id, cantidad: 1 }]);
        }
    };

    const cambiarCantidad = (id: number, cantidad: number) => {
        const maximo = Math.max(stockDe(id), 1);
        const valida = Math.min(Math.max(cantidad, 1), maximo);
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