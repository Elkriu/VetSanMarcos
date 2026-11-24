import { useState, useEffect, useCallback, type SubmitEvent } from "react";
import LayoutPanel from "../componentes/organismos/LayoutPanel";
import EncabezadoPanel from "../componentes/moleculas/EncabezadoPanel";
import TarjetaPanel from "../componentes/moleculas/TarjetaPanel";
import CampoFormulario from "../componentes/moleculas/CampoFormulario";
import CampoSelect from "../componentes/moleculas/CampoSelect";
import Boton from "../componentes/atomos/Boton";
import Modal from "../componentes/organismos/Modal";
import {
    listarUsuarios,
    crearUsuario,
    actualizarUsuario,
    alternarSuspension,
    eliminarUsuario,
    type Rol,
    type Usuario,
} from "../datos/usuarios";
import { listarCitasApi, ordenarPorFecha, type Cita } from "../datos/citas";
import { ApiError } from "../utils/api";
import {
    validarRun,
    validarSoloLetras,
    validarCorreo,
    validarPassword,
    obtenerError,
} from "../utils/validaciones";

const ADMIN_PRINCIPAL = "admin@sanmarcos.cl";
const ROLES: Rol[] = ["Cliente", "Recepcionista", "Administrador"];

interface FormUsuario {
    run: string;
    nombre: string;
    email: string;
    password: string;
    rol: Rol;
}

type Campo = "run" | "nombre" | "email" | "password";
type Errores = Partial<Record<Campo, string>>;

const FORM_VACIO: FormUsuario = { run: "", nombre: "", email: "", password: "", rol: "Cliente" };

function Admin() {
    const [usuarios, setUsuarios] = useState<Usuario[]>([]);
    const [cargandoUsuarios, setCargandoUsuarios] = useState(true);
    const [errorUsuarios, setErrorUsuarios] = useState("");

    const [citas, setCitas] = useState<Cita[]>([]);
    const [cargandoCitas, setCargandoCitas] = useState(true);
    const [errorCitas, setErrorCitas] = useState("");

    // null = cerrado, "nuevo" = crear, number = id del usuario editado
    const [modal, setModal] = useState<null | "nuevo" | number>(null);
    const [form, setForm] = useState<FormUsuario>(FORM_VACIO);
    const [errores, setErrores] = useState<Errores>({});
    const [guardando, setGuardando] = useState(false);

    const cargarUsuarios = useCallback(async () => {
        setCargandoUsuarios(true);
        setErrorUsuarios("");
        try {
            const lista = await listarUsuarios();
            setUsuarios(lista);
        } catch (err) {
            setErrorUsuarios(err instanceof ApiError ? err.message : "No se pudo cargar la lista de usuarios.");
        } finally {
            setCargandoUsuarios(false);
        }
    }, []);

    useEffect(() => {
        void cargarUsuarios();

        let activo = true;
        listarCitasApi()
            .then((lista) => {
                if (activo) setCitas(ordenarPorFecha(lista));
            })
            .catch((err) => {
                if (activo) {
                    setErrorCitas(err instanceof ApiError ? err.message : "No se pudieron cargar las citas médicas.");
                }
            })
            .finally(() => {
                if (activo) setCargandoCitas(false);
            });

        return () => {
            activo = false;
        };
    }, [cargarUsuarios]);

    const cambiar = <K extends keyof FormUsuario>(campo: K, valor: FormUsuario[K]) =>
        setForm((anterior) => ({ ...anterior, [campo]: valor }));

    const abrirCrear = () => {
        setForm(FORM_VACIO);
        setErrores({});
        setModal("nuevo");
    };

    const abrirEditar = (u: Usuario) => {
        setForm({
            run: u.run ?? "",
            nombre: u.nombre,
            email: u.email,
            password: "",
            rol: u.rol,
        });
        setErrores({});
        setModal(u.id);
    };

    const cerrarModal = () => setModal(null);

    const guardar = async (e: SubmitEvent<HTMLFormElement>) => {
        e.preventDefault();

        const esNuevo = modal === "nuevo";
        const runLimpio = form.run.trim();

        const nuevos: Errores = {
            run: runLimpio ? obtenerError(() => validarRun(runLimpio)) : undefined,
            nombre: obtenerError(() => validarSoloLetras(form.nombre, "nombre")),
            email: obtenerError(() => validarCorreo(form.email)),
            password:
                esNuevo || form.password.length > 0
                    ? obtenerError(() => validarPassword(form.password))
                    : undefined,
        };
        setErrores(nuevos);
        if (Object.values(nuevos).some(Boolean)) return;

        const nombre = form.nombre.trim();
        const email = form.email.trim().toLowerCase();
        const { rol } = form;

        setGuardando(true);
        try {
            if (esNuevo) {
                const creado = await crearUsuario({
                    run: runLimpio || undefined,
                    nombre,
                    email,
                    password: form.password,
                    rol,
                });
                setUsuarios((prev) => [...prev, creado]);
            } else {
                const original = usuarios.find((u) => u.id === modal);
                if (!original) return;

                if (original.email === ADMIN_PRINCIPAL && (rol !== "Administrador" || email !== ADMIN_PRINCIPAL)) {
                    alert("No se puede cambiar el rol ni el correo del administrador principal.");
                    return;
                }

                const actualizado = await actualizarUsuario(original.id, {
                    run: runLimpio || undefined,
                    nombre,
                    email,
                    password: form.password ? form.password : undefined,
                    rol,
                });

                setUsuarios((prev) => prev.map((u) => (u.id === original.id ? actualizado : u)));
            }

            cerrarModal();
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
                alert("Ocurrió un error inesperado al guardar el usuario.");
            }
        } finally {
            setGuardando(false);
        }
    };

    const manejarSuspension = async (u: Usuario) => {
        if (u.email === ADMIN_PRINCIPAL) {
            alert("No se puede suspender al administrador principal.");
            return;
        }
        try {
            const actualizado = await alternarSuspension(u.id);
            setUsuarios((prev) => prev.map((x) => (x.id === u.id ? actualizado : x)));
        } catch (err) {
            alert(err instanceof ApiError ? err.message : "No se pudo cambiar el estado del usuario.");
        }
    };

    const eliminar = async (u: Usuario) => {
        if (u.email === ADMIN_PRINCIPAL) {
            alert("No se puede eliminar al administrador principal.");
            return;
        }
        if (!confirm(`¿Estás seguro de eliminar al usuario ${u.email}?`)) return;

        try {
            await eliminarUsuario(u.id);
            setUsuarios((prev) => prev.filter((x) => x.id !== u.id));
        } catch (err) {
            alert(err instanceof ApiError ? err.message : "No se pudo eliminar el usuario.");
        }
    };

    const estado = (campo: Campo): "invalido" | undefined => (errores[campo] ? "invalido" : undefined);

    return (
        <LayoutPanel tipo="admin">
            <EncabezadoPanel
                titulo="Panel de Control y Gestión"
                descripcion="Gestión centralizada de usuarios, roles y supervisiones de la clínica."
            />

            <TarjetaPanel
                borde="primary"
                titulo="👥 Mantenedor de Usuarios"
                derecha={<Boton texto="+ Nuevo Usuario" tamano="sm" alHacerClic={abrirCrear} />}
            >
                <div className="table-responsive">
                    <table className="table align-middle mb-0">
                        <thead className="table-light">
                            <tr>
                                <th>RUN</th>
                                <th>Nombre</th>
                                <th>Correo electrónico</th>
                                <th>Rol asignado</th>
                                <th>Estado</th>
                                <th className="text-end">Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {cargandoUsuarios ? (
                                <tr>
                                    <td colSpan={6} className="text-center text-muted py-3">
                                        Cargando usuarios...
                                    </td>
                                </tr>
                            ) : errorUsuarios ? (
                                <tr>
                                    <td colSpan={6} className="text-center text-danger py-3">
                                        {errorUsuarios}
                                    </td>
                                </tr>
                            ) : usuarios.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="text-center text-muted py-3">
                                        No hay usuarios registrados.
                                    </td>
                                </tr>
                            ) : (
                                usuarios.map((u) => (
                                    <tr key={u.id}>
                                        <td>{u.run || <span className="text-muted small">—</span>}</td>
                                        <td className="fw-semibold">{u.nombre || "Sin nombre"}</td>
                                        <td>{u.email}</td>
                                        <td><span className="badge bg-secondary">{u.rol}</span></td>
                                        <td>
                                            {u.suspendido ? (
                                                <span className="badge bg-danger">Suspendido</span>
                                            ) : (
                                                <span className="badge bg-success">Activo</span>
                                            )}
                                        </td>
                                        <td className="text-end text-nowrap">
                                            <button
                                                type="button"
                                                className="btn btn-outline-primary btn-sm me-1"
                                                onClick={() => abrirEditar(u)}
                                            >
                                                Editar
                                            </button>
                                            <button
                                                type="button"
                                                className={`btn btn-sm me-1 ${u.suspendido ? "btn-outline-success" : "btn-outline-warning"}`}
                                                onClick={() => manejarSuspension(u)}
                                            >
                                                {u.suspendido ? "Activar" : "Suspender"}
                                            </button>
                                            <button
                                                type="button"
                                                className="btn btn-outline-danger btn-sm"
                                                onClick={() => eliminar(u)}
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

            <TarjetaPanel
                borde="success"
                titulo="📅 Citas Médicas Registradas en Línea"
                derecha={<span className="badge bg-success">Sistema en vivo</span>}
            >
                <div className="table-responsive">
                    <table className="table align-middle mb-0">
                        <thead className="table-light">
                            <tr>
                                <th>Servicio</th>
                                <th>Fecha</th>
                                <th>Hora</th>
                            </tr>
                        </thead>
                        <tbody>
                            {cargandoCitas ? (
                                <tr>
                                    <td colSpan={3} className="text-center text-muted py-3">
                                        Cargando citas...
                                    </td>
                                </tr>
                            ) : errorCitas ? (
                                <tr>
                                    <td colSpan={3} className="text-center text-danger py-3">
                                        {errorCitas}
                                    </td>
                                </tr>
                            ) : citas.length === 0 ? (
                                <tr>
                                    <td colSpan={3} className="text-center text-muted py-3">
                                        No hay citas agendadas actualmente.
                                    </td>
                                </tr>
                            ) : (
                                citas.map((c) => (
                                    <tr key={c.id}>
                                        <td><span className="fw-semibold text-primary">{c.servicio}</span></td>
                                        <td>{c.fecha}</td>
                                        <td>{c.hora}</td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </TarjetaPanel>

            <Modal
                abierto={modal !== null}
                titulo={modal === "nuevo" ? "Crear Nuevo Usuario" : "Editar Usuario"}
                alCerrar={cerrarModal}
            >
                <form onSubmit={guardar} noValidate>
                    <CampoFormulario
                        etiqueta="RUN (opcional, sin puntos ni guion)"
                        id="admin-run"
                        valor={form.run}
                        alCambiar={(v) => cambiar("run", v)}
                        placeholder="123456789"
                        estado={estado("run")}
                        error={errores.run}
                    />
                    <CampoFormulario
                        etiqueta="Nombre"
                        id="admin-nombre"
                        valor={form.nombre}
                        alCambiar={(v) => cambiar("nombre", v)}
                        estado={estado("nombre")}
                        error={errores.nombre}
                    />
                    <CampoFormulario
                        etiqueta="Correo electrónico"
                        id="admin-email"
                        tipo="email"
                        valor={form.email}
                        alCambiar={(v) => cambiar("email", v)}
                        estado={estado("email")}
                        error={errores.email}
                    />
                    <CampoFormulario
                        etiqueta={
                            modal === "nuevo"
                                ? "Contraseña (4 a 10 caracteres)"
                                : "Nueva contraseña (dejar vacío para mantener)"
                        }
                        id="admin-password"
                        tipo="password"
                        valor={form.password}
                        alCambiar={(v) => cambiar("password", v)}
                        estado={estado("password")}
                        error={errores.password}
                    />
                    <CampoSelect
                        etiqueta="Rol"
                        id="admin-rol"
                        valor={form.rol}
                        alCambiar={(v) => cambiar("rol", v as Rol)}
                        opciones={ROLES}
                    />

                    <div className="d-flex justify-content-end gap-2 mt-4">
                        <Boton texto="Cancelar" variante="outline-secondary" alHacerClic={cerrarModal} />
                        <Boton texto={guardando ? "Guardando..." : "Guardar"} tipo="submit" deshabilitado={guardando} />
                    </div>
                </form>
            </Modal>
        </LayoutPanel>
    );
}

export default Admin;