import { useState, useEffect, type SubmitEvent } from "react";
import EncabezadoSeccion from "../componentes/moleculas/EncabezadoSeccion";
import CampoFormulario from "../componentes/moleculas/CampoFormulario";
import Boton from "../componentes/atomos/Boton";
import { enviarMensajeApi } from "../datos/mensajes";
import { ApiError } from "../utils/api";
import {
    validarSoloLetras,
    validarCorreo,
    validarComentario,
    obtenerError,
} from "../utils/validaciones";

type Campo = "nombre" | "email" | "comentario";
type Errores = Partial<Record<Campo, string>>;

function Contacto() {
    const [nombre, setNombre] = useState("");
    const [email, setEmail] = useState("");
    const [comentario, setComentario] = useState("");
    const [esReadonlyEmail, setEsReadonlyEmail] = useState(false);

    const [errores, setErrores] = useState<Errores>({});
    const [validado, setValidado] = useState(false);
    const [enviando, setEnviando] = useState(false);
    const [mostrarAlerta, setMostrarAlerta] = useState(false);

    useEffect(() => {
        const sesionGuardada = localStorage.getItem("sesion_activa");
        if (sesionGuardada) {
            try {
                const user = JSON.parse(sesionGuardada);
                if (user?.nombre) setNombre(user.nombre);
                if (user?.email) {
                    setEmail(user.email);
                    setEsReadonlyEmail(true);
                }
            } catch {
                // Si el JSON estuviera corrupto, dejamos los campos editables
            }
        }
    }, []);

    const estado = (campo: Campo): "valido" | "invalido" | undefined => {
        if (!validado) return undefined;
        return errores[campo] ? "invalido" : "valido";
    };

    const claseComentario = (): string => {
        const est = estado("comentario");
        if (est === "invalido") return "form-control is-invalid";
        if (est === "valido") return "form-control is-valid";
        return "form-control";
    };

    const handleEnviar = async (e: SubmitEvent<HTMLFormElement>) => {
        e.preventDefault();

        const nuevos: Errores = {
            nombre: obtenerError(() => validarSoloLetras(nombre, "nombre")),
            email: obtenerError(() => validarCorreo(email)),
            comentario: obtenerError(() => validarComentario(comentario)),
        };

        setErrores(nuevos);
        setValidado(true);

        if (Object.values(nuevos).some(Boolean)) return;

        setEnviando(true);
        try {
            await enviarMensajeApi({
                nombre: nombre.trim(),
                email: email.trim().toLowerCase(),
                comentario: comentario.trim(),
            });

            setComentario("");
            setErrores({});
            setValidado(false);
            setMostrarAlerta(true);

            setTimeout(() => {
                setMostrarAlerta(false);
            }, 4000);
        } catch (err) {
            if (err instanceof ApiError) {
                if (Object.keys(err.errores).length > 0) {
                    setErrores((prev) => ({ ...prev, ...err.errores }));
                } else {
                    alert(err.message);
                }
            } else {
                alert("Ocurrió un error inesperado al enviar el mensaje.");
            }
        } finally {
            setEnviando(false);
        }
    };

    return (
        <section className="container">
            <EncabezadoSeccion
                nivel="h1"
                insignia="Comunícate"
                titulo="Canales de"
                destacado="Contacto"
                descripcion="Estamos aquí para resolver tus dudas y atender a tus mascotas en Rancagua."
            />

            <div className="row g-5 justify-content-center align-items-start mt-2">
                <div className="col-lg-6">
                    <article className="card border-0 shadow-sm rounded-4 p-4 h-100 bg-white">
                        <h2 className="fw-bold h4 text-dark mb-4">Información y Ubicación</h2>

                        <div className="d-flex align-items-start gap-3 mb-4">
                            <div className="fs-4">📍</div>
                            <div>
                                <h3 className="fw-bold h6 mb-1">Dirección</h3>
                                <p className="text-muted small mb-0">Av. Libertador Bernardo O'Higgins #450, Rancagua</p>
                            </div>
                        </div>

                        <div className="d-flex align-items-start gap-3 mb-4">
                            <div className="fs-4">📞</div>
                            <div>
                                <h3 className="fw-bold h6 mb-1">Teléfono / WhatsApp</h3>
                                <p className="text-muted small mb-0">+56 9 1234 5678</p>
                            </div>
                        </div>

                        <div className="d-flex align-items-start gap-3 mb-4">
                            <div className="fs-4">⏰</div>
                            <div>
                                <h3 className="fw-bold h6 mb-1">Horarios</h3>
                                <p className="text-muted small mb-0">
                                    Lun - Vie: 09:00 - 19:00 hrs.<br />
                                    Sáb: 10:00 - 14:00 hrs.
                                </p>
                            </div>
                        </div>

                        <div className="rounded-3 overflow-hidden shadow-sm mt-auto" style={{ height: "200px" }}>
                            <iframe
                                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3329.3582451259926!2d-70.74313!3d-34.17012!2m3!1f0!2f0!3f0!3m2!1f1024!2f768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMzTCsDEwJzEyLjQiUyA3MMKwNDQnMzUuMyJX!5e0!3m2!1ses!2scl!4v1650000000000!5m2!1ses!2scl"
                                width="100%"
                                height="100%"
                                style={{ border: 0 }}
                                allowFullScreen
                                loading="lazy"
                                title="Mapa Ubicación"
                            ></iframe>
                        </div>
                    </article>
                </div>

                {/* COLUMNA DERECHA: Formulario */}
                <div className="col-lg-6">
                    <article className="card border-0 shadow-sm rounded-4 p-4 p-md-5 h-100 bg-white">
                        <h2 className="fw-bold h4 text-dark mb-4">✉️ Envíanos un Mensaje</h2>

                        <form onSubmit={handleEnviar} noValidate>
                            <CampoFormulario
                                etiqueta="Nombre"
                                id="contacto-nombre"
                                valor={nombre}
                                alCambiar={(valor) => setNombre(valor.replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑ\s]/g, ""))}
                                placeholder="Tu nombre"
                                estado={estado("nombre")}
                                error={errores.nombre}
                            />

                            <CampoFormulario
                                etiqueta="Correo electrónico"
                                id="contacto-email"
                                valor={email}
                                alCambiar={setEmail}
                                placeholder="tucorreo@ejemplo.com"
                                soloLectura={esReadonlyEmail}
                                ayuda="Tu mensaje será recibido por la central de recepción."
                                estado={estado("email")}
                                error={errores.email}
                            />

                            <div className="mb-4">
                                <label htmlFor="contacto-comentario" className="form-label small fw-semibold">
                                    Comentario o mensaje
                                </label>
                                <textarea
                                    className={claseComentario()}
                                    id="contacto-comentario"
                                    rows={4}
                                    placeholder="Escribe tu consulta aquí..."
                                    value={comentario}
                                    onChange={(e) => setComentario(e.target.value)}
                                ></textarea>
                                {errores.comentario && (
                                    <div className="invalid-feedback">{errores.comentario}</div>
                                )}
                            </div>

                            <Boton texto={enviando ? "Enviando..." : "Enviar Mensaje"} tipo="submit" bloque deshabilitado={enviando} />
                        </form>

                        {mostrarAlerta && (
                            <div className="alert alert-success mt-3 mb-0" role="alert">
                                ¡Mensaje enviado con éxito! Nos pondremos en contacto pronto.
                            </div>
                        )}
                    </article>
                </div>
            </div>
        </section>
    );
}

export default Contacto;