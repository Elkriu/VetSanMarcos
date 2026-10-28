import { createContext } from "react";
import type { Sesion } from "../datos/usuarios";

export interface AuthContextoTipo {
    sesion: Sesion | null;
    iniciarSesion: (sesion: Sesion) => void;
    cerrarSesion: () => void;
}

export const AuthContext = createContext<AuthContextoTipo | null>(null);