import { useParams } from "react-router-dom";
import Boton from "../componentes/atomos/Boton";
import BotonEnlace from "../componentes/atomos/BotonEnlace";
import { useAuth } from "../contexto/useAuth";
import { buscarBoleta } from "../datos/boletas";
import { formatoPeso } from "../utils/formato";

function Boleta() {
    const { numero } = useParams();
    const { sesion } = useAuth();

    const boleta = buscarBoleta(Number(numero));
    const puedeVer = boleta && sesion && (sesion.rol !== "Cliente" || sesion.email === boleta.clienteEmail);

    if (!boleta || !puedeVer) {
        return (
            <div className="container text-center">
                <h1 className="h3 fw-bold text-danger">Boleta no encontrada.</h1>
                <div className="mt-3">
                    <BotonEnlace texto="Ir a la tienda" a="/tienda" />
                </div>
            </div>
        );
    }

    return (
        <div className="container">
            <div className="row justify-content-center">
                <article className="col-lg-8">
                    <div className="card border-0 shadow-sm rounded-4 p-4 p-md-5 bg-white">
                        <div className="text-center border-bottom pb-3 mb-4">
                            <h1 className="h4 fw-bold text-primary mb-1">🐾 Veterinaria San Marcos</h1>
                            <p className="text-muted small mb-0">Av. Libertador Bernardo O'Higgins #450, Rancagua</p>
                            <p className="text-muted small mb-0">+56 9 1234 5678</p>
                        </div>

                        <div className="d-flex justify-content-between flex-wrap gap-2 mb-4">
                            <div>
                                <h2 className="h5 fw-bold text-dark mb-1">Boleta electrónica N° {boleta.numero}</h2>
                                <p className="text-muted small mb-0">Fecha: {boleta.fecha}</p>
                            </div>
                            <div className="text-md-end">
                                <p className="small mb-0">
                                    <strong>Cliente:</strong> {boleta.clienteNombre}
                                </p>
                                <p className="text-muted small mb-0">{boleta.clienteEmail}</p>
                            </div>
                        </div>

                        <div className="table-responsive">
                            <table className="table align-middle">
                                <thead>
                                    <tr>
                                        <th>Producto</th>
                                        <th className="text-center">Cant.</th>
                                        <th className="text-end">P. unitario</th>
                                        <th className="text-end">Subtotal</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {boleta.lineas.map((l) => (
                                        <tr key={l.nombre}>
                                            <td>{l.nombre}</td>
                                            <td className="text-center">{l.cantidad}</td>
                                            <td className="text-end">{formatoPeso(l.precio)}</td>
                                            <td className="text-end">{formatoPeso(l.precio * l.cantidad)}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        <div className="ms-auto" style={{ maxWidth: "280px", width: "100%" }}>
                            <div className="d-flex justify-content-between small text-muted mb-1">
                                <span>Neto</span>
                                <span>{formatoPeso(boleta.neto)}</span>
                            </div>
                            <div className="d-flex justify-content-between small text-muted mb-2">
                                <span>IVA (19%)</span>
                                <span>{formatoPeso(boleta.iva)}</span>
                            </div>
                            <div className="d-flex justify-content-between border-top pt-2">
                                <span className="fw-bold">Total</span>
                                <span className="fw-bold fs-5 text-primary">{formatoPeso(boleta.total)}</span>
                            </div>
                        </div>

                        <p className="text-muted small text-center mt-4 mb-0">
                            Pagado con tarjeta terminada en {boleta.tarjeta}. ¡Gracias por tu compra!
                        </p>
                    </div>

                    <div className="d-flex justify-content-center gap-2 mt-4 no-imprimir">
                        <Boton texto="🖨️ Imprimir boleta" alHacerClic={() => window.print()} />
                        <BotonEnlace texto="Seguir comprando" a="/tienda" variante="outline-primary" />
                    </div>
                </article>
            </div>
        </div>
    );
}

export default Boleta;