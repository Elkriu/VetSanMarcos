import { useState, useEffect, type SubmitEvent } from "react";
import LayoutPanel from "../componentes/organismos/LayoutPanel";
import EncabezadoPanel from "../componentes/moleculas/EncabezadoPanel";
import TarjetaPanel from "../componentes/moleculas/TarjetaPanel";
import SeccionInventario from "../componentes/organismos/SeccionInventario";
import Boton from "../componentes/atomos/Boton";
import Modal from "../componentes/organismos/Modal";
import { listarUsuarios, type Usuario } from "../datos/usuarios";
import {
    listarMensajesApi,
    alternarLeidoMensajeApi,
    eliminarMensajeApi,
    type MensajeContacto,
} from "../datos/mensajes";
import { servicios } from "../datos/servicios";
import { mascotas } from "../datos/productos";
import { ApiError } from "../utils/api";
import {
    listarCitasApi,
    agendarCitaApi,
    reprogramarCitaApi,
    cancelarCitaApi,
    obtenerDisponibilidadApi,
    hoyStr,
    horaYaPaso,
    opcionesHoras,
    ordenarPorFecha,
    type Cita,
} from "../datos/citas";

interface SelectorHoraProps {
    idFecha: string;
    idHora: string;
    fecha: string;
    hora: string;
    horasOcupadas: string[];
    cargandoHoras?: boolean;
    clase: string;
    alCambiarFecha: (fecha: string) => void;
    alCambiarHora: (hora: string) => void;
}

function SelectorFechaHora({
    idFecha,
    idHora,
    fecha,
    hora,
    horasOcupadas,
    cargandoHoras,
    clase,
    alCambiarFecha,
    alCambiarHora,
}: SelectorHoraProps) {
    return (
        <>
            <div className={clase}>
                <label htmlFor={idFecha} className="form-label small fw-semibold">Fecha</label>
                <input
                    id={idFecha}
                    type="date"
                    className="form-control"
                    min={hoyStr()}
                    value={fecha}
                    onChange={(e) => alCambiarFecha(e.target.value)}
                    required
                />
            </div>
            <div className={clase}>
                <label htmlFor={idHora} className="form-label small fw-semibold">Hora</label>
                <select
                    id={idHora}
                    className="form-select"
                    value={hora}
                    onChange={(e) => alCambiarHora(e.target.value)}
                    disabled={!fecha || cargandoHoras}
                    required
                >
                    <option value="" disabled>
                        {!fecha
                            ? "-- Primero seleccione una fecha --"
                            : cargandoHoras
                            ? "Cargando horas..."
                            : "-- Seleccione una hora --"}
                    </option>
                    {!cargandoHoras &&
                        opcionesHoras(fecha, horasOcupadas).map((op) => (
                            <option key={op.hora} value={op.hora} disabled={op.disabled}>
                                {op.texto}
                            </option>
                        ))}
                </select>
            </div>
        </>
    );
}

function formatearFechaMensaje(iso: string): string {
    try {
        return new Date(iso).toLocaleString("es-CL", {
            dateStyle: "short",
            timeStyle: "short",
        });
    } catch {
        return iso;
    }
}

function Recepcion() {
    const [usuarios, setUsuarios] = useState<Usuario[]>([]);
    const [cargandoUsuarios, setCargandoUsuarios] = useState(true);
    const [errorUsuarios, setErrorUsuarios] = useState("");

    const [mensajes, setMensajes] = useState<MensajeContacto[]>([]);
    const [cargandoMensajes, setCargandoMensajes] = useState(true);
    const [errorMensajes, setErrorMensajes] = useState("");

    const [citas, setCitas] = useState<Cita[]>([]);
    const [cargandoCitas, setCargandoCitas] = useState(true);
    const [errorCitas, setErrorCitas] = useState("");

    useEffect(() => {
        let activo = true;

        listarUsuarios()
            .then((lista) => {
                if (activo) setUsuarios(lista);
            })
            .catch((err) => {
                if (activo) {
                    setErrorUsuarios(
                        err instanceof ApiError ? err.message : "No se pudo cargar el directorio de usuarios."
                    );
                }
            })
            .finally(() => {
                if (activo) setCargandoUsuarios(false);
            });

        listarMensajesApi()
            .then((lista) => {
                if (activo) setMensajes(lista);
            })
            .catch((err) => {
                if (activo) {
                    setErrorMensajes(
                        err instanceof ApiError ? err.message : "No se pudieron cargar los mensajes de contacto."
                    );
                }
            })
            .finally(() => {
                if (activo) setCargandoMensajes(false);
            });

        listarCitasApi()
            .then((lista) => {
                if (activo) setCitas(ordenarPorFecha(lista));
            })
            .catch((err) => {
                if (activo) {
                    setErrorCitas(
                        err instanceof ApiError ? err.message : "No se pudieron cargar las citas médicas."
                    );
                }
            })
            .finally(() => {
                if (activo) setCargandoCitas(false);
            });

        return () => {
            activo = false;
        };
    }, []);

    const manejarLeido = async (m: MensajeContacto) => {
        try {
            const actualizado = await alternarLeidoMensajeApi(m.id);
            setMensajes((prev) => prev.map((x) => (x.id === m.id ? actualizado : x)));
        } catch (err) {
            alert(err instanceof ApiError ? err.message : "No se pudo actualizar el estado del mensaje.");
        }
    };

    const manejarEliminarMensaje = async (m: MensajeContacto) => {
        if (!confirm(`¿Eliminar el mensaje de ${m.nombre}?`)) return;
        try {
            await eliminarMensajeApi(m.id);
            setMensajes((prev) => prev.filter((x) => x.id !== m.id));
        } catch (err) {
            alert(err instanceof ApiError ? err.message : "No se pudo eliminar el mensaje.");
        }
    };

    // ----- Agendamiento manual -----
    const [nombre, setNombre] = useState("");
    const [servicio, setServicio] = useState("");
    const [mascota, setMascota] = useState("");
    const [fecha, setFecha] = useState("");
    const [hora, setHora] = useState("");
    const [ocupadasManual, setOcupadasManual] = useState<string[]>([]);
    const [cargandoManual, setCargandoManual] = useState(false);

    useEffect(() => {
        if (!fecha) {
            setOcupadasManual([]);
            return;
        }
        let activo = true;
        setCargandoManual(true);
        obtenerDisponibilidadApi(fecha)
            .then((horas) => {
                if (activo) setOcupadasManual(horas);
            })
            .catch(() => {
                if (activo) setOcupadasManual([]);
            })
            .finally(() => {
                if (activo) setCargandoManual(false);
            });
        return () => {
            activo = false;
        };
    }, [fecha]);

    const agendarManual = async (e: SubmitEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!nombre.trim() || !servicio || !mascota || !fecha || !hora) return;

        if (fecha < hoyStr() || horaYaPaso(fecha, hora)) {
            alert("⚠️ No puedes programar una cita en una fecha u hora pasada.");
            return;
        }

        try {
            const creada = await agendarCitaApi({
                nombreCliente: nombre.trim(),
                emailCliente: "Agendamiento Manual (Recepción)",
                servicio,
                tipoMascota: mascota,
                fecha,
                hora,
            });

            setCitas((prev) => ordenarPorFecha([...prev, creada]));
            alert(`¡Cita registrada con éxito para ${nombre.trim()}!`);
            setNombre("");
            setServicio("");
            setMascota("");
            setFecha("");
            setHora("");
        } catch (err) {
            alert(err instanceof ApiError ? err.message : "No se pudo registrar la cita.");
        }
    };

    // ----- Modificar cita -----
    const [citaEditada, setCitaEditada] = useState<Cita | null>(null);
    const [nuevaFecha, setNuevaFecha] = useState("");
    const [nuevaHora, setNuevaHora] = useState("");
    const [ocupadasModal, setOcupadasModal] = useState<string[]>([]);
    const [cargandoModal, setCargandoModal] = useState(false);

    useEffect(() => {
        if (!citaEditada || !nuevaFecha) {
            setOcupadasModal([]);
            return;
        }
        let activo = true;
        setCargandoModal(true);
        obtenerDisponibilidadApi(nuevaFecha)
            .then((horas) => {
                if (!activo) return;
                // Si mantiene la misma fecha, su propia hora actual no se bloquea
                const filtradas =
                    nuevaFecha === citaEditada.fecha
                        ? horas.filter((h) => h !== citaEditada.hora)
                        : horas;
                setOcupadasModal(filtradas);
            })
            .catch(() => {
                if (activo) setOcupadasModal([]);
            })
            .finally(() => {
                if (activo) setCargandoModal(false);
            });
        return () => {
            activo = false;
        };
    }, [citaEditada, nuevaFecha]);

    const abrirModificar = (c: Cita) => {
        setCitaEditada(c);
        setNuevaFecha(c.fecha);
        setNuevaHora(c.hora);
    };

    const guardarModificacion = async (e: SubmitEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!citaEditada) return;

        if (nuevaFecha < hoyStr() || horaYaPaso(nuevaFecha, nuevaHora)) {
            alert("⚠️ No puedes programar una cita en una fecha u hora pasada.");
            return;
        }

        try {
            const actualizada = await reprogramarCitaApi(citaEditada.id, {
                fecha: nuevaFecha,
                hora: nuevaHora,
            });
            setCitas((prev) =>
                ordenarPorFecha(prev.map((c) => (c.id === actualizada.id ? actualizada : c)))
            );
            setCitaEditada(null);
            alert("¡Cita modificada con éxito desde Recepción!");
        } catch (err) {
            alert(err instanceof ApiError ? err.message : "No se pudo reprogramar la cita.");
        }
    };

    const cancelarCita = async (id: number) => {
        if (!confirm("¿Estás seguro de cancelar esta cita médica?")) return;
        try {
            await cancelarCitaApi(id);
            setCitas((prev) => prev.filter((c) => c.id !== id));
        } catch (err) {
            alert(err instanceof ApiError ? err.message : "No se pudo cancelar la cita.");
        }
    };

    return (
        <LayoutPanel tipo="recepcion">
            <EncabezadoPanel
                titulo="Panel de Recepción y Citas"
                descripcion="Visualización de clientes, control de acceso restringido y agendamiento presencial/telefónico."
            />

            {/* Registrar cita */}
            <TarjetaPanel borde="primary" titulo="🩺 Registrar Cita">
                <form onSubmit={agendarManual}>
                    <div className="row g-3 align-items-end">
                        <div className="col-lg-3">
                            <label htmlFor="manual-nombre" className="form-label small fw-semibold">
                                Nombre del Cliente
                            </label>
                            <input
                                id="manual-nombre"
                                type="text"
                                className="form-control"
                                placeholder="Ej: María Pérez"
                                value={nombre}
                                onChange={(e) => setNombre(e.target.value)}
                                required
                            />
                        </div>

                        <div className="col-lg-3">
                            <label htmlFor="manual-servicio" className="form-label small fw-semibold">Servicio</label>
                            <select
                                id="manual-servicio"
                                className="form-select"
                                value={servicio}
                                onChange={(e) => setServicio(e.target.value)}
                                required
                            >
                                <option value="" disabled>-- Elija --</option>
                                {servicios.map((s) => (
                                    <option key={s.id} value={s.nombre}>{s.nombre}</option>
                                ))}
                            </select>
                        </div>

                        <div className="col-lg-2">
                            <label htmlFor="manual-mascota" className="form-label small fw-semibold">
                                Tipo de Mascota
                            </label>
                            <select
                                id="manual-mascota"
                                className="form-select"
                                value={mascota}
                                onChange={(e) => setMascota(e.target.value)}
                                required
                            >
                                <option value="" disabled>-- Elija --</option>
                                {mascotas.map((m) => (
                                    <option key={m} value={m}>{m}</option>
                                ))}
                            </select>
                        </div>

                        <SelectorFechaHora
                            idFecha="manual-fecha"
                            idHora="manual-hora"
                            fecha={fecha}
                            hora={hora}
                            horasOcupadas={ocupadasManual}
                            cargandoHoras={cargandoManual}
                            clase="col-lg-2"
                            alCambiarFecha={(f) => { setFecha(f); setHora(""); }}
                            alCambiarHora={setHora}
                        />

                        <div className="col-12 text-end">
                            <Boton texto="Registrar Cita" tipo="submit" />
                        </div>
                    </div>
                </form>
            </TarjetaPanel>

            {/* Agenda de citas */}
            <TarjetaPanel
                borde="success"
                titulo="📅 Agenda de Citas Médicas"
                derecha={<span className="badge bg-success">En tiempo real</span>}
            >
                <div className="table-responsive">
                    <table className="table align-middle mb-0">
                        <thead className="table-light">
                            <tr>
                                <th>Servicio</th>
                                <th>Mascota</th>
                                <th>Fecha</th>
                                <th>Hora</th>
                                <th className="text-end">Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {cargandoCitas ? (
                                <tr>
                                    <td colSpan={5} className="text-center text-muted py-3">
                                        Cargando citas médicas...
                                    </td>
                                </tr>
                            ) : errorCitas ? (
                                <tr>
                                    <td colSpan={5} className="text-center text-danger py-3">
                                        {errorCitas}
                                    </td>
                                </tr>
                            ) : citas.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="text-center text-muted py-3">
                                        No hay citas agendadas actualmente.
                                    </td>
                                </tr>
                            ) : (
                                citas.map((c) => (
                                    <tr key={c.id}>
                                        <td><span className="fw-semibold text-primary">{c.servicio}</span></td>
                                        <td><span className="badge bg-info text-dark">{c.tipoMascota || "No especificada"}</span></td>
                                        <td>{c.fecha}</td>
                                        <td>{c.hora}</td>
                                        <td className="text-end">
                                            <small className="text-muted d-block mb-1">
                                                Dueño: {c.nombreCliente || c.emailCliente || "Cliente Web"}
                                            </small>
                                            <button
                                                type="button"
                                                className="btn btn-outline-warning btn-sm py-0 px-2 me-1"
                                                onClick={() => abrirModificar(c)}
                                            >
                                                Modificar
                                            </button>
                                            <button
                                                type="button"
                                                className="btn btn-outline-danger btn-sm py-0 px-2"
                                                onClick={() => cancelarCita(c.id)}
                                            >
                                                Cancelar
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </TarjetaPanel>

            {/* Mensajes de contacto */}
            <TarjetaPanel
                borde="warning"
                titulo="✉️ Mensajes de Contacto Recibidos"
                derecha={<span className="badge bg-warning text-dark">Pública Web</span>}
            >
                <div className="table-responsive">
                    <table className="table align-middle mb-0">
                        <thead className="table-light">
                            <tr>
                                <th>Fecha</th>
                                <th>Nombre</th>
                                <th>Correo electrónico</th>
                                <th>Comentario / Mensaje</th>
                                <th>Estado</th>
                                <th className="text-end">Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {cargandoMensajes ? (
                                <tr>
                                    <td colSpan={6} className="text-center text-muted py-3">
                                        Cargando mensajes...
                                    </td>
                                </tr>
                            ) : errorMensajes ? (
                                <tr>
                                    <td colSpan={6} className="text-center text-danger py-3">
                                        {errorMensajes}
                                    </td>
                                </tr>
                            ) : mensajes.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="text-center text-muted py-3">
                                        No hay mensajes de contacto nuevos.
                                    </td>
                                </tr>
                            ) : (
                                mensajes.map((m) => (
                                    <tr key={m.id}>
                                        <td><small className="text-muted">{formatearFechaMensaje(m.fechaEnvio)}</small></td>
                                        <td className="fw-semibold">{m.nombre}</td>
                                        <td>
                                            <a href={`mailto:${m.email}`} className="text-decoration-none">{m.email}</a>
                                        </td>
                                        <td><span className="text-secondary">{m.comentario}</span></td>
                                        <td>
                                            {m.leido ? (
                                                <span className="badge bg-success">Leído</span>
                                            ) : (
                                                <span className="badge bg-warning text-dark">Pendiente</span>
                                            )}
                                        </td>
                                        <td className="text-end text-nowrap">
                                            <button
                                                type="button"
                                                className={`btn btn-sm py-0 px-2 me-1 ${m.leido ? "btn-outline-secondary" : "btn-outline-success"}`}
                                                onClick={() => manejarLeido(m)}
                                            >
                                                {m.leido ? "No leído" : "Marcar leído"}
                                            </button>
                                            <button
                                                type="button"
                                                className="btn btn-outline-danger btn-sm py-0 px-2"
                                                onClick={() => manejarEliminarMensaje(m)}
                                            >
                                                Eliminar
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </TarjetaPanel>

            <SeccionInventario />

            {/* Usuarios (solo lectura) */}
            <TarjetaPanel
                borde="dark"
                titulo="👥 Directorio de Usuarios Registrados"
                derecha={<span className="badge bg-secondary">Seguridad R.</span>}
            >
                <div className="table-responsive">
                    <table className="table align-middle mb-0">
                        <thead className="table-light">
                            <tr>
                                <th>Nombre</th>
                                <th>Correo electrónico</th>
                                <th>Rol asignado</th>
                                <th>Estado / Permiso</th>
                            </tr>
                        </thead>
                        <tbody>
                            {cargandoUsuarios ? (
                                <tr>
                                    <td colSpan={4} className="text-center text-muted py-3">
                                        Cargando usuarios...
                                    </td>
                                </tr>
                            ) : errorUsuarios ? (
                                <tr>
                                    <td colSpan={4} className="text-center text-danger py-3">
                                        {errorUsuarios}
                                    </td>
                                </tr>
                            ) : (
                                usuarios.map((u) => {
                                    const esStaff = u.rol === "Administrador" || u.rol === "Recepcionista";
                                    return (
                                        <tr key={u.id}>
                                            <td className="fw-semibold">{u.nombre || "Sin nombre"}</td>
                                            <td>{u.email}</td>
                                            <td>
                                                <span className={`badge ${esStaff ? "bg-dark" : "bg-secondary"}`}>
                                                    {u.rol}{esStaff && " (Protegido)"}
                                                </span>
                                            </td>
                                            <td>
                                                {u.suspendido ? (
                                                    <span className="badge bg-danger">Suspendido</span>
                                                ) : (
                                                    <span className="badge bg-success">Activo</span>
                                                )}
                                            </td>
                                        </tr>
                                    );
                                })
                            )}
                        </tbody>
                    </table>
                </div>
            </TarjetaPanel>

            <Modal abierto={citaEditada !== null} titulo="Modificar cita" alCerrar={() => setCitaEditada(null)}>
                {citaEditada && (
                    <form onSubmit={guardarModificacion}>
                        <p className="text-muted small">
                            {citaEditada.servicio} · {citaEditada.tipoMascota}
                        </p>
                        <SelectorFechaHora
                            idFecha="mod-fecha"
                            idHora="mod-hora"
                            fecha={nuevaFecha}
                            hora={nuevaHora}
                            horasOcupadas={ocupadasModal}
                            cargandoHoras={cargandoModal}
                            clase="mb-3"
                            alCambiarFecha={(f) => { setNuevaFecha(f); setNuevaHora(""); }}
                            alCambiarHora={setNuevaHora}
                        />
                        <div className="d-flex justify-content-end gap-2 mt-4">
                            <Boton texto="Cancelar" variante="outline-secondary" alHacerClic={() => setCitaEditada(null)} />
                            <Boton texto="Guardar cambios" tipo="submit" />
                        </div>
                    </form>
                )}
            </Modal>
        </LayoutPanel>
    );
}

export default Recepcion;