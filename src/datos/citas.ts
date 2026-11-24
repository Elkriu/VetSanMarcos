import { API_CITAS, peticion } from "../utils/api";

export interface Cita {
    id: number;
    usuarioId?: number | null;
    nombreCliente: string;
    emailCliente: string;
    servicio: string;
    tipoMascota: string;
    fecha: string; 
    hora: string;  
}

export interface CrearCitaRequest {
    servicio: string;
    tipoMascota: string;
    fecha: string;
    hora: string;
    nombreCliente?: string;
    emailCliente?: string;
}

export interface ReprogramarCitaRequest {
    fecha: string;
    hora: string;
}

export interface OpcionHora {
    hora: string;
    texto: string;
    disabled: boolean;
}

export const HORARIOS_FIJOS = ["10:00", "11:30", "15:00", "17:15"];

export function obtenerDisponibilidadApi(fecha: string): Promise<string[]> {
    return peticion<string[]>(
        `${API_CITAS}/citas/disponibilidad?fecha=${encodeURIComponent(fecha)}`,
        {},
        false, 
    );
}

export function listarCitasApi(): Promise<Cita[]> {
    return peticion<Cita[]>(`${API_CITAS}/citas`);
}

export function agendarCitaApi(datos: CrearCitaRequest): Promise<Cita> {
    return peticion<Cita>(`${API_CITAS}/citas`, {
        method: "POST",
        body: JSON.stringify(datos),
    });
}

export function reprogramarCitaApi(id: number, datos: ReprogramarCitaRequest): Promise<Cita> {
    return peticion<Cita>(`${API_CITAS}/citas/${id}`, {
        method: "PUT",
        body: JSON.stringify(datos),
    });
}

export function cancelarCitaApi(id: number): Promise<void> {
    return peticion<void>(`${API_CITAS}/citas/${id}`, {
        method: "DELETE",
    });
}

export function hoyStr(): string {
    const ahora = new Date();
    const anio = ahora.getFullYear();
    const mes = String(ahora.getMonth() + 1).padStart(2, "0");
    const dia = String(ahora.getDate()).padStart(2, "0");
    return `${anio}-${mes}-${dia}`;
}

export function horaYaPaso(fecha: string, hora: string): boolean {
    if (fecha !== hoyStr()) return false;
    const ahora = new Date();
    const [h, m] = hora.split(":").map(Number);
    return h < ahora.getHours() || (h === ahora.getHours() && m <= ahora.getMinutes());
}

export function opcionesHoras(fecha: string, horasOcupadas: string[]): OpcionHora[] {
    if (!fecha) return [];

    return HORARIOS_FIJOS.map((hora) => {
        let disabled = false;
        let extra = " (Disponible)";

        if (horaYaPaso(fecha, hora)) {
            disabled = true;
            extra = " (Pasada)";
        }
        if (horasOcupadas.includes(hora)) {
            disabled = true;
            extra = " (Ocupada)";
        }
        return { hora, texto: `${hora} hrs.${extra}`, disabled };
    });
}

export function ordenarPorFecha(citas: Cita[]): Cita[] {
    return [...citas].sort((a, b) => `${a.fecha} ${a.hora}`.localeCompare(`${b.fecha} ${b.hora}`));
}