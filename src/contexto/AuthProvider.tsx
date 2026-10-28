import { useState, type ReactNode } from "react";
import { AuthContext } from "./AuthContext";
import type { Sesion } from "../datos/usuarios";

const CLAVE_SESION = "sesion_activa";

function leerSesion(): Sesion | null {
    try {
        return JSON.parse(localStorage.getItem(CLAVE_SESION) ?? "null");
    } catch {
        return null;
    }
}

function AuthProvider({ children }: { children: ReactNode }) {
    const [sesion, setSesion] = useState<Sesion | null>(leerSesion);

    const iniciarSesion = (nueva: Sesion) => {
        localStorage.setItem(CLAVE_SESION, JSON.stringify(nueva));
        setSesion(nueva);
    };

    const cerrarSesion = () => {
        localStorage.removeItem(CLAVE_SESION);
        setSesion(null);
    };

    return (
        <AuthContext.Provider value={{ sesion, iniciarSesion, cerrarSesion }}>
            {children}
        </AuthContext.Provider>
    );
}

export default AuthProvider;