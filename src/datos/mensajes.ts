import { API_CONTACTO, peticion } from "../utils/api";

export interface MensajeContacto {
    id: number;
    nombre: string;
    email: string;
    comentario: string;
    leido: boolean;
    fechaEnvio: string;
}

export interface NuevoMensajeRequest {
    nombre: string;
    email: string;
    comentario: string;
}

export function enviarMensajeApi(datos: NuevoMensajeRequest): Promise<MensajeContacto> {
    return peticion<MensajeContacto>(
        `${API_CONTACTO}/mensajes`,
        {
            method: "POST",
            body: JSON.stringify(datos),
        },
        false, // endpoint público
    );
}

export function listarMensajesApi(): Promise<MensajeContacto[]> {
    return peticion<MensajeContacto[]>(`${API_CONTACTO}/mensajes`);
}

export function alternarLeidoMensajeApi(id: number): Promise<MensajeContacto> {
    return peticion<MensajeContacto>(`${API_CONTACTO}/mensajes/${id}/leido`, {
        method: "PATCH",
    });
}

export function eliminarMensajeApi(id: number): Promise<void> {
    return peticion<void>(`${API_CONTACTO}/mensajes/${id}`, {
        method: "DELETE",
    });
}