import { useState, type SubmitEvent } from "react";
import { useNavigate } from "react-router-dom";
import CampoFormulario from "../moleculas/CampoFormulario";
import Boton from "../atomos/Boton";
import { useAuth } from "../../contexto/useAuth";
import { obtenerUsuarios } from "../../datos/usuarios";

function FormularioLogin() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const { iniciarSesion } = useAuth();
    const navegar = useNavigate();

    const manejarEnvio = (e: SubmitEvent<HTMLFormElement>) => {
        e.preventDefault();

        const correo = email.trim().toLowerCase();
        const usuario = obtenerUsuarios().find(
            (u) => u.email.toLowerCase() === correo && u.password === password
        );

        if (!usuario) {
            setError("Correo o contraseña incorrectos.");
            return;
        }

        if (usuario.suspendido) {
            alert("Acceso denegado: Su cuenta se encuentra suspendida.");
            return;
        }

        alert(`¡Bienvenido, ${usuario.nombre}! Redirigiendo...`);
        iniciarSesion({ email: usuario.email, nombre: usuario.nombre, rol: usuario.rol });

        if (usuario.rol === "Administrador") {
            navegar("/admin");
        } else if (usuario.rol === "Recepcionista") {
            navegar("/recepcion");
        } else {
            navegar("/");
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
            <Boton texto="Ingresar" tipo="submit" bloque />
        </form>
    );
}

export default FormularioLogin;