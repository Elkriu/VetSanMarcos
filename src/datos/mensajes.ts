export interface MensajeContacto {
    nombre: string;
    email: string;
    comentario: string;
    fecha: string;
}

const CLAVE = "mensajes_contacto";

export function obtenerMensajes(): MensajeContacto[] {
    try {
        return JSON.parse(localStorage.getItem(CLAVE) ?? "[]");
    } catch {
        return [];
    }
}
