import type { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../../contexto/useAuth";
import type { Rol } from "../../datos/usuarios";

interface RutaProtegidaProps {
    roles?: Rol[];          // sin valor = basta con tener sesión
    children: ReactNode;
}

function RutaProtegida({ roles, children }: RutaProtegidaProps) {
    const { sesion } = useAuth();

    if (!sesion) return <Navigate to="/login" replace />;
    if (roles && !roles.includes(sesion.rol)) return <Navigate to="/" replace />;

    return <>{children}</>;
}

export default RutaProtegida;
