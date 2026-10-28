import { useState, type SubmitEvent } from "react";
import LayoutPanel from "../componentes/organismos/LayoutPanel";
import EncabezadoPanel from "../componentes/moleculas/EncabezadoPanel";
import TarjetaPanel from "../componentes/moleculas/TarjetaPanel";
import Boton from "../componentes/atomos/Boton";
import Modal from "../componentes/organismos/Modal";
import { obtenerUsuarios } from "../datos/usuarios";
import { obtenerMensajes } from "../datos/mensajes";
import { servicios } from "../datos/servicios";
import { mascotas } from "../datos/productos";
import {
    obtenerCitas,
    guardarCitas,
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
    citas: Cita[];
    clase: string;
    ignorarId?: string;
    alCambiarFecha: (fecha: string) => void;
    alCambiarHora: (hora: string) => void;
}

function SelectorFechaHora({
    idFecha, idHora, fecha, hora, citas, clase, ignorarId, alCambiarFecha, alCambiarHora,
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
                    disabled={!fecha}
                    required
                >
                    <option value="" disabled>
                        {fecha ? "-- Seleccione una hora --" : "-- Primero seleccione una fecha --"}
                    </option>
                    {opcionesHoras(fecha, citas, ignorarId).map((op) => (
                        <option key={op.hora} value={op.hora} disabled={op.disabled}>
                            {op.texto}
                        </option>
                    ))}
                </select>
            </div>
        </>
    );
}

function Recepcion() {
    const usuarios = obtenerUsuarios();
    const mensajes = obtenerMensajes();
    const [citas, setCitas] = useState(obtenerCitas);

    const actualizarCitas = (nuevas: Cita[]) => {
        guardarCitas(nuevas);
        setCitas(nuevas);
    };

    // ----- Agendamiento manual -----
    const [nombre, setNombre] = useState("");
    const [servicio, setServicio] = useState("");
    const [mascota, setMascota] = useState("");
    const [fecha, setFecha] = useState("");
    const [hora, setHora] = useState("");

    const agendarManual = (e: SubmitEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!nombre.trim() || !servicio || !mascota || !fecha || !hora) return;

        if (fecha < hoyStr() || horaYaPaso(fecha, hora)) {
            alert("⚠️ No puedes programar una cita en una fecha u hora pasada.");
            return;
        }
        if (citas.some((c) => c.fecha === fecha && c.hora === hora)) {
            alert("⚠️ Error: Ya existe una cita agendada en ese mismo día y horario.");
            return;
        }

        actualizarCitas([
            ...citas,
            {
                id: crypto.randomUUID(),
                nombreCliente: nombre.trim(),
                servicio,
                tipoMascota: mascota,
                fecha,
                hora,
                emailCliente: "Agendamiento Manual (Recepción)",
            },
        ]);

        alert(`¡Cita registrada con éxito para ${nombre.trim()}!`);
        setNombre("");
        setServicio("");
        setMascota("");
        setFecha("");
        setHora("");
    };

    // ----- Modificar cita -----
    const [citaEditada, setCitaEditada] = useState<Cita | null>(null);
    const [nuevaFecha, setNuevaFecha] = useState("");
    const [nuevaHora, setNuevaHora] = useState("");

    const abrirModificar = (c: Cita) => {
        setCitaEditada(c);
        setNuevaFecha(c.fecha);
        setNuevaHora(c.hora);
    };

    const guardarModificacion = (e: SubmitEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!citaEditada) return;

        if (nuevaFecha < hoyStr() || horaYaPaso(nuevaFecha, nuevaHora)) {
            alert("⚠️ No puedes programar una cita en una fecha u hora pasada.");
            return;
        }
        if (citas.some((c) => c.id !== citaEditada.id && c.fecha === nuevaFecha && c.hora === nuevaHora)) {
            alert("⚠️ Error: Ya existe otra cita agendada en ese mismo día y horario.");
            return;
        }

        actualizarCitas(
            citas.map((c) => (c.id === citaEditada.id ? { ...c, fecha: nuevaFecha, hora: nuevaHora } : c))
        );
        setCitaEditada(null);
        alert("¡Cita modificada con éxito desde Recepción!");
    };

    const cancelarCita = (id: string) => {
        if (!confirm("¿Estás seguro de cancelar esta cita médica?")) return;
        actualizarCitas(citas.filter((c) => c.id !== id));
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
                            citas={citas}
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
                            {citas.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="text-center text-muted py-3">
                                        No hay citas agendadas actualmente.
                                    </td>
                                </tr>
                            ) : (
                                ordenarPorFecha(citas).map((c) => (
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
                            </tr>
                        </thead>
                        <tbody>
                            {mensajes.length === 0 ? (
                                <tr>
                                    <td colSpan={4} className="text-center text-muted py-3">
                                        No hay mensajes de contacto nuevos.
                                    </td>
                                </tr>
                            ) : (
                                mensajes.map((m, i) => (
                                    <tr key={i}>
                                        <td><small className="text-muted">{m.fecha}</small></td>
                                        <td className="fw-semibold">{m.nombre}</td>
                                        <td>
                                            <a href={`mailto:${m.email}`} className="text-decoration-none">{m.email}</a>
                                        </td>
                                        <td><span className="text-secondary">{m.comentario}</span></td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </TarjetaPanel>

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
                            {usuarios.map((u) => {
                                const esStaff = u.rol === "Administrador" || u.rol === "Recepcionista";
                                return (
                                    <tr key={u.email}>
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
                            })}
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
                            citas={citas}
                            clase="mb-3"
                            ignorarId={citaEditada.id}
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
