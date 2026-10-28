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
    tarjeta: string;
}

export type NuevaBoleta = Omit<Boleta, "numero" | "fecha">;

// Inicializa las boletas desde localStorage para no perderlas al recargar la página
const inicializarBoletas = (): Boleta[] => {
    const guardadas = localStorage.getItem("boletas_veterinaria");
    return guardadas ? JSON.parse(guardadas) : [];
};

let boletasDB: Boleta[] = inicializarBoletas();

// Calcula el próximo número de boleta secuencial
const obtenerProximoNumero = (): number => {
    if (boletasDB.length === 0) return 1000;
    const maxNumero = Math.max(...boletasDB.map(b => b.numero));
    return maxNumero + 1;
};

export const buscarBoleta = (numero: number): Boleta | undefined => {
    return boletasDB.find((boleta) => boleta.numero === Math.floor(numero));
};

export const guardarBoleta = (datos: NuevaBoleta): Boleta => {
    const fechaActual = new Date().toLocaleDateString("es-CL", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit"
    });

    const nuevaBoleta: Boleta = {
        ...datos,
        numero: obtenerProximoNumero(),
        fecha: fechaActual,
    };

    boletasDB.push(nuevaBoleta);
    
    // Guarda el arreglo actualizado en localStorage simulando la persistencia de una BD
    localStorage.setItem("boletas_veterinaria", JSON.stringify(boletasDB));

    return nuevaBoleta;
};