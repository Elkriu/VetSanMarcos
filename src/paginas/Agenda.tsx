import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import EncabezadoSeccion from "../componentes/moleculas/EncabezadoSeccion";
import { useAuth } from "../contexto/useAuth";
import {
    agendarCitaApi,
    obtenerDisponibilidadApi,
    opcionesHoras,
    hoyStr,
    horaYaPaso,
} from "../datos/citas";
import { ApiError } from "../utils/api";

function Agenda() {
    const { sesion } = useAuth();

    const [servicio, setServicio] = useState("");
    const [tipoMascota, setTipoMascota] = useState("");
    const [fecha, setFecha] = useState("");
    const [hora, setHora] = useState("");
    const [horasOcupadas, setHorasOcupadas] = useState<string[]>([]);
    const [cargandoHoras, setCargandoHoras] = useState(false);
    const [enviando, setEnviando] = useState(false);
    const [mensajeExito, setMensajeExito] = useState("");

    const hoy = hoyStr();

    useEffect(() => {
        if (!fecha) {
            setHorasOcupadas([]);
            return;
        }
        let activo = true;
        setCargandoHoras(true);

        obtenerDisponibilidadApi(fecha)
            .then((ocupadas) => {
                if (activo) setHorasOcupadas(ocupadas);
            })
            .catch(() => {
                if (activo) setHorasOcupadas([]);
            })
            .finally(() => {
                if (activo) setCargandoHoras(false);
            });

        return () => {
            activo = false;
        };
    }, [fecha]);

    const opcionesHorarios = opcionesHoras(fecha, horasOcupadas);

    const handleAgendar = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!sesion) return;

        if (fecha < hoy) {
            alert("No se pueden agendar citas en fechas pasadas.");
            return;
        }

        if (fecha === hoy && hora && horaYaPaso(fecha, hora)) {
            alert("No puedes seleccionar un horario que ya pasó el día de hoy.");
            return;
        }

        if (servicio && tipoMascota && fecha && hora) {
            setEnviando(true);
            setMensajeExito("");
            try {
                await agendarCitaApi({
                    servicio,
                    tipoMascota,
                    fecha,
                    hora,
                });

                setMensajeExito(
                    `¡Cita para "${servicio}" (${tipoMascota}) reservada con éxito el día ${fecha} a las ${hora}!`
                );

                setServicio("");
                setTipoMascota("");
                setFecha("");
                setHora("");
                setHorasOcupadas([]);
            } catch (err) {
                alert(err instanceof ApiError ? err.message : "No se pudo agendar la cita.");
            } finally {
                setEnviando(false);
            }
        }
    };

    return (
        <section className="container">
            <EncabezadoSeccion
                nivel="h1"
                insignia="Atención en Línea"
                titulo="Agenda tu"
                destacado="Hora Médica"
                descripcion="Selecciona el servicio, el tipo de mascota y tu horario preferido en Rancagua."
            />

            <div className="row justify-content-center mt-4">
                <div className="col-lg-7">
                    <article className="card border-0 shadow-sm rounded-4 p-4 p-md-5 bg-white">
                        <h2 className="fw-bold h4 text-dark mb-4">📅 Formulario de Reserva</h2>

                        {!sesion ? (
                            <div className="alert alert-warning text-center p-4 border-0 shadow-sm rounded-4 mb-0">
                                <h5 className="fw-bold mb-2 text-dark">🔒 Inicia sesión para agendar</h5>
                                <p className="small text-muted mb-3">
                                    Para solicitar una hora médica en línea en la Veterinaria San Marcos, debes estar registrado y con tu sesión activa.
                                </p>
                                <Link to="/login" className="btn btn-primary btn-sm px-4 fw-semibold py-2">
                                    Ir a Iniciar Sesión
                                </Link>
                            </div>
                        ) : (
                            <form id="form-agenda" onSubmit={handleAgendar}>
                                <div className="mb-3">
                                    <label htmlFor="servicio-cita" className="form-label fw-semibold small">
                                        Seleccione el Servicio
                                    </label>
                                    <select
                                        className="form-select"
                                        id="servicio-cita"
                                        value={servicio}
                                        onChange={(e) => setServicio(e.target.value)}
                                        required
                                    >
                                        <option value="" disabled>-- Elija una opción --</option>
                                        <option value="Consulta General">Consulta General ($20.000)</option>
                                        <option value="Vacunación">Vacunación ($15.000)</option>
                                        <option value="Cirugía Menor">Cirugía Menor</option>
                                        <option value="Desparasitación">Desparasitación ($10.000)</option>
                                        <option value="Control de Peso">Control de Peso</option>
                                    </select>
                                </div>

                                <div className="mb-3">
                                    <label htmlFor="tipo-mascota" className="form-label fw-semibold small">
                                        Tipo de Mascota
                                    </label>
                                    <select
                                        className="form-select"
                                        id="tipo-mascota"
                                        value={tipoMascota}
                                        onChange={(e) => setTipoMascota(e.target.value)}
                                        required
                                    >
                                        <option value="" disabled>-- Seleccione el animal --</option>
                                        <option value="Perro">Perro</option>
                                        <option value="Gato">Gato</option>
                                        <option value="Conejo">Conejo</option>
                                        <option value="Ave">Ave</option>
                                    </select>
                                </div>

                                <div className="mb-3">
                                    <label htmlFor="fecha-cita" className="form-label fw-semibold small">
                                        Fecha de la Cita
                                    </label>
                                    <input
                                        type="date"
                                        className="form-control"
                                        id="fecha-cita"
                                        min={hoy}
                                        value={fecha}
                                        onChange={(e) => {
                                            setFecha(e.target.value);
                                            setHora("");
                                        }}
                                        required
                                    />
                                </div>

                                <div className="mb-4">
                                    <label htmlFor="hora-cita" className="form-label fw-semibold small">
                                        Horarios Disponibles
                                    </label>
                                    <select
                                        className="form-select"
                                        id="hora-cita"
                                        value={hora}
                                        onChange={(e) => setHora(e.target.value)}
                                        disabled={!fecha || cargandoHoras}
                                        required
                                    >
                                        {!fecha ? (
                                            <option value="" disabled>-- Primero seleccione una fecha --</option>
                                        ) : cargandoHoras ? (
                                            <option value="" disabled>Cargando disponibilidad...</option>
                                        ) : (
                                            <>
                                                <option value="" disabled>-- Seleccione una hora --</option>
                                                {opcionesHorarios.map((op) => (
                                                    <option key={op.hora} value={op.hora} disabled={op.disabled}>
                                                        {op.texto}
                                                    </option>
                                                ))}
                                            </>
                                        )}
                                    </select>
                                </div>

                                <button
                                    type="submit"
                                    className="btn btn-primary w-100 py-2 fw-semibold shadow-sm"
                                    disabled={enviando}
                                >
                                    {enviando ? "Reservando..." : "Reservar Hora Ahora"}
                                </button>
                            </form>
                        )}

                        {mensajeExito && (
                            <div className="alert alert-success mt-3 mb-0" role="alert">
                                {mensajeExito}
                            </div>
                        )}
                    </article>
                </div>
            </div>
        </section>
    );
}

export default Agenda;