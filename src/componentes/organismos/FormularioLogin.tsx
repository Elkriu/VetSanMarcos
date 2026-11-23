import { useState, type SubmitEvent } from "react";
import { useNavigate } from "react-router-dom";
import CampoFormulario from "../moleculas/CampoFormulario";
import Boton from "../atomos/Boton";
import { useAuth } from "../../contexto/useAuth";
import { iniciarSesionApi } from "../../datos/usuarios";
import { ApiError } from "../../utils/api";

function FormularioLogin() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [enviando, setEnviando] = useState(false);

    const { iniciarSesion } = useAuth();
    const navegar = useNavigate();

    const manejarEnvio = async (e: SubmitEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError("");

        const correo = email.trim().toLowerCase();
        if (!correo || !password) {
            setError("Ingresa tu correo y contraseña.");
            return;
        }

        setEnviando(true);
        try {
            const nuevaSesion = await iniciarSesionApi(correo, password);
            alert(`¡Bienvenido, ${nuevaSesion.nombre}! Redirigiendo...`);
            iniciarSesion(nuevaSesion);

            if (nuevaSesion.rol === "Administrador") {
                navegar("/admin");
            } else if (nuevaSesion.rol === "Recepcionista") {
                navegar("/recepcion");
            } else {
                navegar("/");
            }
        } catch (err) {
            if (err instanceof ApiError) {
                if (err.status === 403) {
                    alert(`Acceso denegado: ${err.message}`);
                } else {
                    setError(err.message);
                }
            } else {
                setError("Ocurrió un error inesperado al iniciar sesión.");
            }
        } finally {
            setEnviando(false);
        }
    };

    return (
        <form onSubmit={manejarEnvio} noValidate>
            <CampoFormulario
                etiqueta="Correo electrónico"
                id="login-email"
                tipo="email"
                valor={email}
                alCambiar={setEmail}
                placeholder="tucorreo@ejemplo.com"
                estado={error ? "invalido" : undefined}
                error={error}
            />
            <CampoFormulario
                etiqueta="Contraseña"
                id="login-password"
                tipo="password"
                valor={password}
                alCambiar={setPassword}
                placeholder="••••••••"
                estado={error ? "invalido" : undefined}
                espacio={4}
            />
            <Boton texto={enviando ? "Ingresando..." : "Ingresar"} tipo="submit" bloque deshabilitado={enviando} />
        </form>
    );
}

export default FormularioLogin;