import { productos } from "./productos";

export type Stock = Record<number, number>;

const CLAVE = "stock_tienda";

// A partir de esta cantidad (inclusive) se avisa "stock bajo"
export const STOCK_BAJO = 5;

const STOCK_INICIAL: Stock = {
    1: 8, 2: 15, 3: 25, 4: 20, 5: 12, 6: 30, 7: 18,
    8: 10, 9: 14, 10: 5, 11: 0, 12: 7, 13: 3, 14: 11,
};

export function obtenerStock(): Stock {
    let guardado: Stock = {};
    try {
        guardado = JSON.parse(localStorage.getItem(CLAVE) ?? "{}");
    } catch {
        guardado = {};
    }

    // Si un producto aún no tiene registro, se parte del stock inicial
    const completo: Stock = {};
    for (const p of productos) {
        completo[p.id] = guardado[p.id] ?? STOCK_INICIAL[p.id] ?? 0;
    }
    return completo;
}

function guardarStock(stock: Stock) {
    localStorage.setItem(CLAVE, JSON.stringify(stock));
}

export function stockDe(id: number): number {
    return obtenerStock()[id] ?? 0;
}

// Suma unidades a un producto y devuelve el stock actualizado
export function ingresarStock(id: number, cantidad: number): Stock {
    const stock = obtenerStock();
    const nuevo = { ...stock, [id]: (stock[id] ?? 0) + cantidad };
    guardarStock(nuevo);
    return nuevo;
}

// Resta lo vendido (nunca baja de 0)
export function descontarStock(lineas: { id: number; cantidad: number }[]): void {
    const stock = obtenerStock();
    for (const linea of lineas) {
        stock[linea.id] = Math.max((stock[linea.id] ?? 0) - linea.cantidad, 0);
    }
    guardarStock(stock);
}