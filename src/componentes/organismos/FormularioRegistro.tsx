import { useState, type SubmitEvent } from "react";
import CampoFormulario from "../moleculas/CampoFormulario";
import Boton from "../atomos/Boton";
import { registrarClienteApi } from "../../datos/usuarios";
import { ApiError } from "../../utils/api";
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
    const [enviando, setEnviando] = useState(false);

    const estado = (campo: Campo): "valido" | "invalido" | undefined => {
        if (!validado) return undefined;
        return errores[campo] ? "invalido" : "valido";
    };

    const manejarEnvio = async (e: SubmitEvent<HTMLFormElement>) => {
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

        setEnviando(true);
        try {
            await registrarClienteApi({
                run: run.trim(),
                nombre: `${nombre.trim()} ${apellido.trim()}`,
                email: email.trim().toLowerCase(),
                password,
            });

            alert("¡Registro exitoso! Ahora puedes iniciar sesión.");

            setRun("");
            setNombre("");
            setApellido("");
            setEmail("");
            setPassword("");
            setErrores({});
            setValidado(false);
            alTerminar();
        } catch (err) {
            if (err instanceof ApiError) {
                if (err.status === 409) {
                    const msg = err.message.toLowerCase();
                    if (msg.includes("run")) {
                        setErrores((prev) => ({ ...prev, run: err.message }));
                    } else {
                        setErrores((prev) => ({ ...prev, email: err.message }));
                    }
                } else if (Object.keys(err.errores).length > 0) {
                    setErrores((prev) => ({ ...prev, ...err.errores }));
                } else {
                    alert(err.message);
                }
            } else {
                alert("Ocurrió un error inesperado al registrar la cuenta.");
            }
        } finally {
            setEnviando(false);
        }
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

            <Boton texto={enviando ? "Registrando..." : "Registrarse"} tipo="submit" bloque deshabilitado={enviando} />
        </form>
    );
}

export default FormularioRegistro;