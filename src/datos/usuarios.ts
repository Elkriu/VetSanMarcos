export type Rol = "Administrador" | "Recepcionista" | "Cliente";

export interface Usuario {
    run?: string;
    email: string;
    password: string;
    rol: Rol;
    nombre: string;
    suspendido: boolean;
}

export interface Sesion {
    email: string;
    nombre: string;
    rol: Rol;
}

const CLAVE = "usuarios_sistema";

const USUARIOS_INICIALES: Usuario[] = [
    { email: "admin@sanmarcos.cl", password: "Admin1!", rol: "Administrador", nombre: "Admin", suspendido: false },
    { email: "recepcion@sanmarcos.cl", password: "Recepc1!", rol: "Recepcionista", nombre: "Camila Riquelme", suspendido: false },
    { email: "cristianv@gmail.com", password: "Cliente1!", rol: "Cliente", nombre: "Cristian Vega", suspendido: false },
];

export function obtenerUsuarios(): Usuario[] {
    const guardados = localStorage.getItem(CLAVE);
    if (guardados) return JSON.parse(guardados);

    localStorage.setItem(CLAVE, JSON.stringify(USUARIOS_INICIALES));
    return USUARIOS_INICIALES;
}

export function guardarUsuarios(usuarios: Usuario[]) {
    localStorage.setItem(CLAVE, JSON.stringify(usuarios));
}