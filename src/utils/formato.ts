export const formatoPeso = (valor: number): string => `$${valor.toLocaleString("es-CL")}`;


export const desglosarIva = (total: number) => {
    const neto = Math.round(total / 1.19);
    return { neto, iva: total - neto };
};

export const soloDigitos = (texto: string): string => texto.replace(/\D/g, "");

// "4111111111111111" → "4111 1111 1111 1111"
export const formatearTarjeta = (texto: string): string =>
    soloDigitos(texto).slice(0, 16).replace(/(.{4})(?=.)/g, "$1 ");

// "1230" → "12/30"
export const formatearVencimiento = (texto: string): string => {
    const digitos = soloDigitos(texto).slice(0, 4);
    return digitos.length > 2 ? `${digitos.slice(0, 2)}/${digitos.slice(2)}` : digitos;
};