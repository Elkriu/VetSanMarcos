import { useState, useEffect } from "react";
import LayoutPanel from "../componentes/organismos/LayoutPanel";
import EncabezadoPanel from "../componentes/moleculas/EncabezadoPanel";
import TarjetaPanel from "../componentes/moleculas/TarjetaPanel";
import BotonEnlace from "../componentes/atomos/BotonEnlace";
import { listarCitasApi, cancelarCitaApi, ordenarPorFecha, type Cita } from "../datos/citas";
import { listarBoletasApi, type Boleta } from "../datos/boletas";
import { formatoPeso } from "../utils/formato";
import { ApiError } from "../utils/api";

function MisCitas() {
    const [citas, setCitas] = useState<Cita[]>([]);
    const [cargando, setCargando] = useState(true);
    const [error, setError] = useState("");

    const [misCompras, setMisCompras] = useState<Boleta[]>([]);
    const [cargandoCompras, setCargandoCompras] = useState(true);
    const [errorCompras, setErrorCompras] = useState("");

    useEffect(() => {
        let activo = true;
        listarCitasApi()
            .then((lista) => {
                if (activo) setCitas(ordenarPorFecha(lista));
            })
            .catch((err) => {
                if (activo) {
                    setError(err instanceof ApiError ? err.message : "No se pudieron cargar tus citas.");
                }
            })
            .finally(() => {
                if (activo) setCargando(false);
            });

        listarBoletasApi()
            .then((lista) => {
                if (activo) setMisCompras(lista);
            })
            .catch((err) => {
                if (activo) {
                    setErrorCompras(err instanceof ApiError ? err.message : "No se pudo cargar tu historial de compras.");
                }
            })
            .finally(() => {
                if (activo) setCargandoCompras(false);
            });

        return () => {
            activo = false;
        };
    }, []);

    const cancelar = async (id: number) => {
        if (!confirm("¿Estás seguro de cancelar esta cita médica?")) return;

        try {
            await cancelarCitaApi(id);
            setCitas((prev) => prev.filter((c) => c.id !== id));
        } catch (err) {
            alert(err instanceof ApiError ? err.message : "No se pudo cancelar la cita.");
        }
    };

    return (
        <LayoutPanel tipo="cliente">
            <EncabezadoPanel
                titulo="Mi Cuenta y Actividad"
                descripcion="Revisa el estado de tus citas médicas agendadas y el historial de tus boletas en un solo lugar."
            />

            <TarjetaPanel
                borde="success"
                titulo="🩺 Citas Médicas Agendadas"
            >
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
                            {cargando ? (
                                <tr>
                                    <td colSpan={5} className="text-center text-muted py-4">
                                        Cargando tus citas...
                                    </td>
                                </tr>
                            ) : error ? (
                                <tr>
                                    <td colSpan={5} className="text-center text-danger py-4">
                                        {error}
                                    </td>
                                </tr>
                            ) : citas.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="text-center text-muted py-4">
                                        No tienes citas médicas agendadas en este momento.
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
                            {cargandoCompras ? (
                                <tr>
                                    <td colSpan={5} className="text-center text-muted py-4">
                                        Cargando historial de compras...
                                    </td>
                                </tr>
                            ) : errorCompras ? (
                                <tr>
                                    <td colSpan={5} className="text-center text-danger py-4">
                                        {errorCompras}
                                    </td>
                                </tr>
                            ) : misCompras.length === 0 ? (
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