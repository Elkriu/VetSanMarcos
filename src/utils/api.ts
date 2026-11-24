// Punto de entrada único a través del API Gateway (8080)
export const API_GATEWAY = "http://localhost:8080";

export const API_USUARIOS = API_GATEWAY;
export const API_CONTACTO = API_GATEWAY;
export const API_CITAS = API_GATEWAY;
export const API_INVENTARIO = API_GATEWAY;
export const API_VENTAS = API_GATEWAY;
export const API_PAGOS = API_GATEWAY;
export const API_DASHBOARD = API_GATEWAY;

const CLAVE_SESION = "sesion_activa";

export const EVENTO_SESION_EXPIRADA = "sesion-expirada";

export class ApiError extends Error {
    status: number;
    errores: Record<string, string>;

    constructor(status: number, mensaje: string, errores: Record<string, string> = {}) {
        super(mensaje);
        this.name = "ApiError";
        this.status = status;
        this.errores = errores;
    }
}

function leerToken(): string | null {
    try {
        return JSON.parse(localStorage.getItem(CLAVE_SESION) ?? "null")?.token ?? null;
    } catch {
        return null;
    }
}

export async function peticion<T>(
    url: string,
    opciones: RequestInit = {},
    requiereToken = true,
): Promise<T> {
    const token = requiereToken ? leerToken() : null;

    const headers = new Headers(opciones.headers);
    if (opciones.body) headers.set("Content-Type", "application/json");
    if (token) headers.set("Authorization", `Bearer ${token}`);

    let respuesta: Response;
    try {
        respuesta = await fetch(url, { ...opciones, headers });
    } catch {
        throw new ApiError(0, "No se pudo conectar con el servidor. Intenta nuevamente.");
    }

    if (respuesta.status === 204) return undefined as T;

    const datos = await respuesta.json().catch(() => null);

    if (!respuesta.ok) {
        if (respuesta.status === 401 && token) {
            window.dispatchEvent(new Event(EVENTO_SESION_EXPIRADA));
        }
        throw new ApiError(
            respuesta.status,
            datos?.mensaje ?? "Ocurrió un error inesperado.",
            datos?.errores ?? {},
        );
    }

    return datos as T;
}