import { useState, type SubmitEvent } from "react";
import CampoFormulario from "../moleculas/CampoFormulario";
import Boton from "../atomos/Boton";
import { obtenerUsuarios, guardarUsuarios } from "../../datos/usuarios";
import {
    validarRun,
    validarSoloLetras,
    validarCorreo,
    validarPassword,
    obtenerError,
} from "../../utils/validaciones";

type Campo = "run" | "nombre" | "apellido" | "email" | "password";
type Errores = Partial<Record<Campo, string>>;

interface FormularioRegistroProps {
    alTerminar: () => void;     
}

function FormularioRegistro({ alTerminar }: FormularioRegistroProps) {
    const [run, setRun] = useState("");
    const [nombre, setNombre] = useState("");
    const [apellido, setApellido] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [errores, setErrores] = useState<Errores>({});
    const [validado, setValidado] = useState(false);   

    const estado = (campo: Campo): "valido" | "invalido" | undefined => {
        if (!validado) return undefined;
        return errores[campo] ? "invalido" : "valido";
    };

    const manejarEnvio = (e: SubmitEvent<HTMLFormElement>) => {
        e.preventDefault();

        const nuevos: Errores = {
            run: obtenerError(() => validarRun(run)),
            nombre: obtenerError(() => validarSoloLetras(nombre, "nombre")),
            apellido: obtenerError(() => validarSoloLetras(apellido, "apellido")),
            email: obtenerError(() => validarCorreo(email)),
            password: obtenerError(() => validarPassword(password)),
        };

        setErrores(nuevos);
        setValidado(true);

        if (Object.values(nuevos).some(Boolean)) return;

        const usuarios = obtenerUsuarios();
        const correo = email.trim().toLowerCase();

        if (usuarios.some((u) => u.email.toLowerCase() === correo)) {
            alert("Este correo ya está registrado.");
            return;
        }

        guardarUsuarios([
            ...usuarios,
            {
                run: run.trim(),
                email: correo,
                password,
                rol: "Cliente",
                nombre: `${nombre.trim()} ${apellido.trim()}`,
                suspendido: false,
            },
        ]);

        alert("¡Registro exitoso! Ahora puedes iniciar sesión.");

        setRun("");
        setNombre("");
        setApellido("");
        setEmail("");
        setPassword("");
        setErrores({});
        setValidado(false);
        alTerminar();
    };

    return (
        <form onSubmit={manejarEnvio} noValidate>
            <CampoFormulario
                etiqueta="RUN (sin puntos ni guion)"
                id="reg-run"
                valor={run}
                alCambiar={setRun}
                placeholder="123456789"
                estado={estado("run")}
                error={errores.run}
            />

            <div className="row">
                <div className="col-6">
                    <CampoFormulario
                        etiqueta="Nombre"
                        id="reg-nombre"
                        valor={nombre}
                        alCambiar={setNombre}
                        placeholder="Tu nombre"
                        estado={estado("nombre")}
                        error={errores.nombre}
                    />
                </div>
                <div className="col-6">
                    <CampoFormulario
                        etiqueta="Apellidos"
                        id="reg-apellido"
                        valor={apellido}
                        alCambiar={setApellido}
                        placeholder="Tus apellidos"
                        estado={estado("apellido")}
                        error={errores.apellido}
                    />
                </div>
            </div>

            <CampoFormulario
                etiqueta="Correo electrónico"
                id="reg-email"
                tipo="email"
                valor={email}
                alCambiar={setEmail}
                placeholder="tucorreo@ejemplo.com"
                estado={estado("email")}
                error={errores.email}
            />
            <CampoFormulario
                etiqueta="Contraseña (4 a 10 caracteres)"
                id="reg-password"
                tipo="password"
                valor={password}
                alCambiar={setPassword}
                placeholder="••••••••"
                estado={estado("password")}
                error={errores.password}
                espacio={4}
            />

            <Boton texto="Registrarse" tipo="submit" bloque />
        </form>
    );
}

export default FormularioRegistro;