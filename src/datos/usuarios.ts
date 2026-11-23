import { API_USUARIOS, peticion } from "../utils/api";

export type Rol = "Administrador" | "Recepcionista" | "Cliente";

export interface Usuario {
    id: number;
    run?: string | null;
    email: string;
    nombre: string;
    rol: Rol;
    suspendido: boolean;
}

export interface Sesion {
    email: string;
    nombre: string;
    rol: Rol;
    token: string;
}

export interface DatosUsuario {
    run?: string;
    nombre: string;
    email: string;
    password?: string;      
    rol: Rol;
}

export interface DatosRegistro {
    run: string;
    nombre: string;
    email: string;
    password: string;
}

type RolApi = "ADMINISTRADOR" | "RECEPCIONISTA" | "CLIENTE";

interface UsuarioApi {
    id: number;
    run: string | null;
    nombre: string;
    email: string;
    rol: RolApi;
    suspendido: boolean;
    fechaCreacion: string;
}

interface LoginApi {
    token: string;
    usuario: UsuarioApi;
}

const aRolFront = (rol: RolApi): Rol =>
    (rol.charAt(0) + rol.slice(1).toLowerCase()) as Rol;

const aRolApi = (rol: Rol): RolApi => rol.toUpperCase() as RolApi;

const aUsuario = (u: UsuarioApi): Usuario => ({
    id: u.id,
    run: u.run,
    email: u.email,
    nombre: u.nombre,
    rol: aRolFront(u.rol),
    suspendido: u.suspendido,
});

const aSesion = (r: LoginApi): Sesion => ({
    email: r.usuario.email,
    nombre: r.usuario.nombre,
    rol: aRolFront(r.usuario.rol),
    token: r.token,
});

const aCuerpo = (d: DatosUsuario) => ({ ...d, rol: aRolApi(d.rol) });

// ----- Autenticación -----
export async function iniciarSesionApi(email: string, password: string): Promise<Sesion> {
    const respuesta = await peticion<LoginApi>(
        `${API_USUARIOS}/auth/login`,
        { method: "POST", body: JSON.stringify({ email, password }) },
        false,
    );
    return aSesion(respuesta);
}

export async function registrarClienteApi(datos: DatosRegistro): Promise<Usuario> {
    const respuesta = await peticion<UsuarioApi>(
        `${API_USUARIOS}/auth/registro`,
        { method: "POST", body: JSON.stringify(datos) },
        false,
    );
    return aUsuario(respuesta);
}

export async function renovarSesionApi(): Promise<Sesion> {
    const respuesta = await peticion<LoginApi>(`${API_USUARIOS}/auth/renovar`, { method: "POST" });
    return aSesion(respuesta);
}

export async function listarUsuarios(): Promise<Usuario[]> {
    const respuesta = await peticion<UsuarioApi[]>(`${API_USUARIOS}/usuarios`);
    return respuesta.map(aUsuario);
}

export async function crearUsuario(datos: DatosUsuario): Promise<Usuario> {
    const respuesta = await peticion<UsuarioApi>(`${API_USUARIOS}/usuarios`, {
        method: "POST",
        body: JSON.stringify(aCuerpo(datos)),
    });
    return aUsuario(respuesta);
}

export async function actualizarUsuario(id: number, datos: DatosUsuario): Promise<Usuario> {
    const respuesta = await peticion<UsuarioApi>(`${API_USUARIOS}/usuarios/${id}`, {
        method: "PUT",
        body: JSON.stringify(aCuerpo(datos)),
    });
    return aUsuario(respuesta);
}

export async function alternarSuspension(id: number): Promise<Usuario> {
    const respuesta = await peticion<UsuarioApi>(`${API_USUARIOS}/usuarios/${id}/suspension`, {
        method: "PATCH",
    });
    return aUsuario(respuesta);
}

export async function eliminarUsuario(id: number): Promise<void> {
    await peticion<void>(`${API_USUARIOS}/usuarios/${id}`, { method: "DELETE" });
}