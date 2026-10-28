export interface Cita {
    id: string;
    servicio: string;
    tipoMascota: string;
    fecha: string;          // "YYYY-MM-DD"
    hora: string;           // "HH:MM"
    emailCliente: string;
    nombreCliente?: string; // solo las citas agendadas manualmente desde recepción
}

export interface OpcionHora {
    hora: string;
    texto: string;
    disabled: boolean;
}

const CLAVE = "citas_vet";

export const HORARIOS_FIJOS = ["10:00", "11:30", "15:00", "17:15"];

// Las citas que guarda Agenda.tsx no traen id. Aquí se les asigna uno la primera vez
// que se leen, así las vistas no dependen de la posición en el arreglo.
export function obtenerCitas(): Cita[] {
    let guardadas: Partial<Cita>[] = [];
    try {
        guardadas = JSON.parse(localStorage.getItem(CLAVE) ?? "[]");
    } catch {
        guardadas = [];
    }

    let huboCambios = false;
    const citas = guardadas.map((c) => {
        if (c.id) return c as Cita;
        huboCambios = true;
        return { ...c, id: crypto.randomUUID() } as Cita;
    });

    if (huboCambios) guardarCitas(citas);
    return citas;
}

export function guardarCitas(citas: Cita[]) {
    localStorage.setItem(CLAVE, JSON.stringify(citas));
}

// Correo del dueño de la cita (las más antiguas podían usar "email")
export function correoDeCita(c: Cita): string {
    return c.emailCliente || (c as Cita & { email?: string }).email || "";
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

// Opciones del select de horas con su estado (Disponible / Pasada / Ocupada).
// `ignorarId` sirve al modificar una cita: su propio horario no cuenta como ocupado.
export function opcionesHoras(fecha: string, citas: Cita[], ignorarId?: string): OpcionHora[] {
    if (!fecha) return [];

    const ocupadas = citas
        .filter((c) => c.fecha === fecha && c.id !== ignorarId)
        .map((c) => c.hora);

    return HORARIOS_FIJOS.map((hora) => {
        let disabled = false;
        let extra = " (Disponible)";

        if (horaYaPaso(fecha, hora)) {
            disabled = true;
            extra = " (Pasada)";
        }
        if (ocupadas.includes(hora)) {
            disabled = true;
            extra = " (Ocupada)";
        }
        return { hora, texto: `${hora} hrs.${extra}`, disabled };
    });
}

export function ordenarPorFecha(citas: Cita[]): Cita[] {
    return [...citas].sort((a, b) => `${a.fecha} ${a.hora}`.localeCompare(`${b.fecha} ${b.hora}`));
}
