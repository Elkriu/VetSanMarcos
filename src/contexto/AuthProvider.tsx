import { useState, useEffect, useCallback, type ReactNode } from "react";
import { AuthContext } from "./AuthContext";
import { renovarSesionApi, type Sesion } from "../datos/usuarios";
import { ApiError, EVENTO_SESION_EXPIRADA } from "../utils/api";

const CLAVE_SESION = "sesion_activa";

function leerSesion(): Sesion | null {
    try {
        const guardada = JSON.parse(localStorage.getItem(CLAVE_SESION) ?? "null");
        // Si quedó una sesión vieja sin token de la etapa localStorage, la descartamos
        return guardada?.token ? guardada : null;
    } catch {
        return null;
    }
}

function AuthProvider({ children }: { children: ReactNode }) {
    const [sesion, setSesion] = useState<Sesion | null>(leerSesion);
    const [cargando, setCargando] = useState<boolean>(() => leerSesion() !== null);

    const iniciarSesion = useCallback((nueva: Sesion) => {
        localStorage.setItem(CLAVE_SESION, JSON.stringify(nueva));
        setSesion(nueva);
    }, []);

    const cerrarSesion = useCallback(() => {
        localStorage.removeItem(CLAVE_SESION);
        setSesion(null);
    }, []);

    useEffect(() => {
        window.addEventListener(EVENTO_SESION_EXPIRADA, cerrarSesion);
        return () => window.removeEventListener(EVENTO_SESION_EXPIRADA, cerrarSesion);
    }, [cerrarSesion]);

    useEffect(() => {
        const actual = leerSesion();
        if (!actual) {
            setCargando(false);
            return;
        }

        let activo = true;
        renovarSesionApi()
            .then((renovada) => {
                if (activo) iniciarSesion(renovada);
            })
            .catch((err) => {
                if (!activo) return;
                // Solo cerramos sesión si el backend rechazó el token o suspendió la cuenta
                if (err instanceof ApiError && (err.status === 401 || err.status === 403)) {
                    cerrarSesion();
                }
            })
            .finally(() => {
                if (activo) setCargando(false);
            });

        return () => {
            activo = false;
        };
    }, [iniciarSesion, cerrarSesion]);

    return (
        <AuthContext.Provider value={{ sesion, cargando, iniciarSesion, cerrarSesion }}>
            {children}
        </AuthContext.Provider>
    );
}

export default AuthProvider;