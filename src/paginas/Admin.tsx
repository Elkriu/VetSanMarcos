import { useState, type SubmitEvent } from "react";
import LayoutPanel from "../componentes/organismos/LayoutPanel";
import EncabezadoPanel from "../componentes/moleculas/EncabezadoPanel";
import TarjetaPanel from "../componentes/moleculas/TarjetaPanel";
import CampoFormulario from "../componentes/moleculas/CampoFormulario";
import CampoSelect from "../componentes/moleculas/CampoSelect";
import Boton from "../componentes/atomos/Boton";
import Modal from "../componentes/organismos/Modal";
import SeccionInventario from "../componentes/organismos/SeccionInventario";
import { obtenerUsuarios, guardarUsuarios, type Rol, type Usuario } from "../datos/usuarios";
import { obtenerCitas, guardarCitas, correoDeCita, ordenarPorFecha } from "../datos/citas";
import { validarSoloLetras, validarCorreo, validarPassword, obtenerError } from "../utils/validaciones";

const ADMIN_PRINCIPAL = "admin@sanmarcos.cl";
const ROLES: Rol[] = ["Cliente", "Recepcionista", "Administrador"];

interface FormUsuario {
    nombre: string;
    email: string;
    password: string;
    rol: Rol;
}

type Campo = "nombre" | "email" | "password";
type Errores = Partial<Record<Campo, string>>;

const FORM_VACIO: FormUsuario = { nombre: "", email: "", password: "", rol: "Cliente" };

function Admin() {
    const [usuarios, setUsuarios] = useState(obtenerUsuarios);
    const [citas, setCitas] = useState(obtenerCitas);

    const [modal, setModal] = useState<null | "nuevo" | string>(null);
    const [form, setForm] = useState<FormUsuario>(FORM_VACIO);
    const [errores, setErrores] = useState<Errores>({});

    const actualizarUsuarios = (nuevos: Usuario[]) => {
        guardarUsuarios(nuevos);
        setUsuarios(nuevos);
    };

    const cambiar = <K extends keyof FormUsuario>(campo: K, valor: FormUsuario[K]) =>
        setForm((anterior) => ({ ...anterior, [campo]: valor }));

    const abrirCrear = () => {
        setForm(FORM_VACIO);
        setErrores({});
        setModal("nuevo");
    };

    const abrirEditar = (u: Usuario) => {
        setForm({ nombre: u.nombre, email: u.email, password: u.password, rol: u.rol });
        setErrores({});
        setModal(u.email);
    };

    const cerrarModal = () => setModal(null);

    const guardar = (e: SubmitEvent<HTMLFormElement>) => {
        e.preventDefault();

        const nuevos: Errores = {
            nombre: obtenerError(() => validarSoloLetras(form.nombre, "nombre")),
            email: obtenerError(() => validarCorreo(form.email)),
            password: obtenerError(() => validarPassword(form.password)),
        };
        setErrores(nuevos);
        if (Object.values(nuevos).some(Boolean)) return;

        const nombre = form.nombre.trim();
        const email = form.email.trim().toLowerCase();
        const { password, rol } = form;

        if (modal === "nuevo") {
            if (usuarios.some((u) => u.email.toLowerCase() === email)) {
                alert("Ya existe un usuario registrado con este correo.");
                return;
            }
            actualizarUsuarios([...usuarios, { email, password, rol, nombre, suspendido: false }]);
        } else {
            const original = usuarios.find((u) => u.email === modal);
            if (!original) return;

            if (original.email === ADMIN_PRINCIPAL && (rol !== "Administrador" || email !== ADMIN_PRINCIPAL)) {
                alert("No se puede cambiar el rol ni el correo del administrador principal.");
                return;
            }
            if (email !== original.email && usuarios.some((u) => u.email.toLowerCase() === email)) {
                alert("Ya existe un usuario registrado con este correo.");
                return;
            }

            actualizarUsuarios(
                usuarios.map((u) => (u.email === original.email ? { ...u, nombre, email, password, rol } : u))
            );

            // Si cambió el correo, sus citas siguen siendo suyas
            if (email !== original.email) {
                const actualizadas = citas.map((c) =>
                    correoDeCita(c).toLowerCase() === original.email.toLowerCase() ? { ...c, emailCliente: email } : c
                );
                guardarCitas(actualizadas);
                setCitas(actualizadas);
            }
        }

        cerrarModal();
    };

    const alternarSuspension = (u: Usuario) => {
        if (u.email === ADMIN_PRINCIPAL) {
            alert("No se puede suspender al administrador principal.");
            return;
        }
        actualizarUsuarios(usuarios.map((x) => (x.email === u.email ? { ...x, suspendido: !x.suspendido } : x)));
    };

    const eliminar = (u: Usuario) => {
        if (u.email === ADMIN_PRINCIPAL) {
            alert("No se puede eliminar al administrador principal.");
            return;
        }
        if (!confirm(`¿Estás seguro de eliminar al usuario ${u.email}?`)) return;
        actualizarUsuarios(usuarios.filter((x) => x.email !== u.email));
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
                                <th>Nombre</th>
                                <th>Correo electrónico</th>
                                <th>Rol asignado</th>
                                <th>Estado</th>
                                <th className="text-end">Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {usuarios.map((u) => (
                                <tr key={u.email}>
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
                                            onClick={() => alternarSuspension(u)}
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
                            ))}
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
                            {citas.length === 0 ? (
                                <tr>
                                    <td colSpan={3} className="text-center text-muted py-3">
                                        No hay citas agendadas actualmente.
                                    </td>
                                </tr>
                            ) : (
                                ordenarPorFecha(citas).map((c) => (
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

            <SeccionInventario />

            <Modal
                abierto={modal !== null}
                titulo={modal === "nuevo" ? "Crear Nuevo Usuario" : "Editar Usuario"}
                alCerrar={cerrarModal}
            >
                <form onSubmit={guardar} noValidate>
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
                        etiqueta="Contraseña (4 a 10 caracteres)"
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
                        <Boton texto="Guardar" tipo="submit" />
                    </div>
                </form>
            </Modal>
        </LayoutPanel>
    );
}

export default Admin;