import { useState, type SubmitEvent } from "react";
import CampoFormulario from "../moleculas/CampoFormulario";
import Boton from "../atomos/Boton";
import Alerta from "../atomos/Alerta";

interface SesionActiva {
    nombre: string;
    email: string;
}

const CLAVE_MENSAJES = "mensajes_contacto";

function leerSesion(): SesionActiva | null {
    try {
        return JSON.parse(localStorage.getItem("sesion_activa") ?? "null");
    } catch {
        return null;
    }
}

function FormularioContacto() {
    // Si hay sesión activa, se autocompleta nombre y correo (y el correo queda bloqueado)
    const [sesion] = useState(leerSesion);

    const [nombre, setNombre] = useState(sesion?.nombre ?? "");
    const [email, setEmail] = useState(sesion?.email ?? "");
    const [comentario, setComentario] = useState("");
    const [enviado, setEnviado] = useState(false);

    const manejarEnvio = (e: SubmitEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!nombre.trim() || !email.trim() || !comentario.trim()) return;

        // Se guarda para que llegue a la bandeja de la recepción
        const mensajes = JSON.parse(localStorage.getItem(CLAVE_MENSAJES) ?? "[]");
        mensajes.push({
            nombre: nombre.trim(),
            email: email.trim(),
            comentario: comentario.trim(),
            fecha: new Date().toLocaleDateString("es-CL"),
        });
        localStorage.setItem(CLAVE_MENSAJES, JSON.stringify(mensajes));

        // Se limpia el formulario (manteniendo los datos de la sesión, si hay)
        setNombre(sesion?.nombre ?? "");
        setEmail(sesion?.email ?? "");
        setComentario("");

        setEnviado(true);
        setTimeout(() => setEnviado(false), 4000);
    };

    return (
        <article className="card border-0 shadow-sm rounded-4 p-4 p-md-5 h-100 bg-white">
            <h2 className="fw-bold h4 text-dark mb-4">✉️ Envíanos un Mensaje</h2>

            <form onSubmit={manejarEnvio}>
                <CampoFormulario
                    etiqueta="Nombre"
                    id="contacto-nombre"
                    valor={nombre}
                    alCambiar={setNombre}
                    placeholder="Tu nombre"
                    requerido
                />
                <CampoFormulario
                    etiqueta="Correo electrónico"
                    id="contacto-email"
                    tipo="email"
                    valor={email}
                    alCambiar={setEmail}
                    placeholder="tucorreo@ejemplo.com"
                    ayuda="Tu mensaje será recibido por la central de recepción."
                    soloLectura={Boolean(sesion)}
                    requerido
                />
                <CampoFormulario
                    etiqueta="Comentario o mensaje"
                    id="contacto-comentario"
                    tipo="textarea"
                    valor={comentario}
                    alCambiar={setComentario}
                    placeholder="Escribe tu consulta aquí..."
                    espacio={4}
                    requerido
                />
                <Boton texto="Enviar Mensaje" tipo="submit" bloque />
            </form>

            {enviado && <Alerta mensaje="¡Mensaje enviado con éxito! Nos pondremos en contacto pronto." />}
        </article>
    );
}

export default FormularioContacto;