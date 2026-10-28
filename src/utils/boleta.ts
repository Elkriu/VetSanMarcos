export interface LineaBoleta {
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
    tarjeta: string;      // últimos 4 dígitos
}

const CLAVE = "boletas_tienda";
const PRIMER_NUMERO = 1001;

export function obtenerBoletas(): Boleta[] {
    try {
        return JSON.parse(localStorage.getItem(CLAVE) ?? "[]");
    } catch {
        return [];
    }
}

// Asigna el número correlativo y la fecha, y guarda la boleta
export function guardarBoleta(datos: Omit<Boleta, "numero" | "fecha">): Boleta {
    const boletas = obtenerBoletas();
    const ultimo = boletas.length > 0 ? boletas[boletas.length - 1].numero : PRIMER_NUMERO - 1;

    const nueva: Boleta = {
        ...datos,
        numero: ultimo + 1,
        fecha: new Date().toLocaleString("es-CL"),
    };

    localStorage.setItem(CLAVE, JSON.stringify([...boletas, nueva]));
    return nueva;
}

export function buscarBoleta(numero: number): Boleta | undefined {
    return obtenerBoletas().find((b) => b.numero === numero);
}