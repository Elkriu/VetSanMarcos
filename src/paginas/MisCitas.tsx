import { useState } from "react";
import LayoutPanel from "../componentes/organismos/LayoutPanel";
import EncabezadoPanel from "../componentes/moleculas/EncabezadoPanel";
import TarjetaPanel from "../componentes/moleculas/TarjetaPanel";
import BotonEnlace from "../componentes/atomos/BotonEnlace";
import { useAuth } from "../contexto/useAuth";
import { obtenerCitas, guardarCitas, correoDeCita, ordenarPorFecha } from "../datos/citas";
import { buscarBoletasDeCliente } from "../datos/boletas";
import { formatoPeso } from "../utils/formato";

function MisCitas() {
    const { sesion } = useAuth();
    const [citas, setCitas] = useState(obtenerCitas);

    const correo = sesion?.email.toLowerCase() ?? "";
    const misCitas = ordenarPorFecha(citas.filter((c) => correoDeCita(c).toLowerCase() === correo));
    const misCompras = buscarBoletasDeCliente(correo);

    const cancelar = (id: string) => {
        if (!confirm("¿Estás seguro de cancelar esta cita médica?")) return;

        const restantes = citas.filter((c) => c.id !== id);
        guardarCitas(restantes);
        setCitas(restantes);
    };

    return (
        <LayoutPanel tipo="cliente">
            <EncabezadoPanel
                titulo="Mis Citas Médicas Agendadas"
                descripcion="Aquí puedes revisar el historial y estado exclusivo de las reservas asociadas a tu cuenta personal."
            />

            <TarjetaPanel borde="success">
                <div className="table-responsive">
                    <table className="table align-middle mb-0">
                        <thead className="table-light">
                            <tr>
                                <th>Servicio Veterinario</th>
                                <th>Tipo de Mascota</th>
                                <th>Fecha</th>
                                <th>Hora</th>
                                <th className="text-end">Estado</th>
                            </tr>
                        </thead>
                        <tbody>
                            {misCitas.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="text-center text-muted py-4">
                                        No tienes citas médicas agendadas en este momento.
                                    </td>
                                </tr>
                            ) : (
                                misCitas.map((c) => (
                                    <tr key={c.id}>
                                        <td><span className="fw-semibold text-primary">{c.servicio}</span></td>
                                        <td><span className="badge bg-info text-dark">{c.tipoMascota || "No especificada"}</span></td>
                                        <td>{c.fecha}</td>
                                        <td>{c.hora}</td>
                                        <td className="text-end">
                                            <button
                                                type="button"
                                                className="btn btn-outline-danger btn-sm py-0 px-2"
                                                onClick={() => cancelar(c.id)}
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

            <TarjetaPanel
                borde="primary"
                titulo="🧾 Historial de compras"
                derecha={<BotonEnlace texto="Ir a la tienda" a="/tienda" variante="outline-primary" tamano="sm" />}
            >
                <div className="table-responsive">
                    <table className="table align-middle mb-0">
                        <thead className="table-light">
                            <tr>
                                <th>N° Boleta</th>
                                <th>Fecha</th>
                                <th>Detalle</th>
                                <th className="text-end">Total</th>
                                <th className="text-end">Boleta</th>
                            </tr>
                        </thead>
                        <tbody>
                            {misCompras.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="text-center text-muted py-4">
                                        Aún no tienes compras registradas.
                                    </td>
                                </tr>
                            ) : (
                                misCompras.map((b) => (
                                    <tr key={b.numero}>
                                        <td><span className="fw-semibold text-primary">N° {b.numero}</span></td>
                                        <td>{b.fecha}</td>
                                        <td>
                                            <small className="text-muted">
                                                {b.lineas.map((l) => `${l.cantidad} × ${l.nombre}`).join(", ")}
                                            </small>
                                        </td>
                                        <td className="text-end fw-semibold">{formatoPeso(b.total)}</td>
                                        <td className="text-end">
                                            <BotonEnlace
                                                texto="🖨️ Ver / Reimprimir"
                                                a={`/boleta/${b.numero}`}
                                                variante="outline-primary"
                                                tamano="sm"
                                            />
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </TarjetaPanel>
        </LayoutPanel>
    );
}

export default MisCitas;