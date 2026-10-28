import { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import EncabezadoSeccion from "../componentes/moleculas/EncabezadoSeccion";
import FormularioPago from "../componentes/organismos/FormularioPago";
import { useAuth } from "../contexto/useAuth";
import { useCarrito } from "../contexto/useCarrito";
import { productos } from "../datos/productos";
import { guardarBoleta } from "../datos/boletas";
import { formatoPeso, desglosarIva } from "../utils/formato";

function Pago() {
    const { sesion } = useAuth();
    const { items, vaciar } = useCarrito();
    const navegar = useNavigate();
    const [pagado, setPagado] = useState(false);

    const lineas = items.flatMap((item) => {
        const producto = productos.find((p) => p.id === item.id);
        return producto ? [{ producto, cantidad: item.cantidad }] : [];
    });

    const total = lineas.reduce((suma, l) => suma + l.producto.precio * l.cantidad, 0);
    const { neto, iva } = desglosarIva(total);

    // Al pagar, el carrito queda vacío: así no nos redirige de vuelta al carrito
    if (pagado) return null;
    if (!sesion) return <Navigate to="/login" replace />;
    if (lineas.length === 0) return <Navigate to="/carrito" replace />;

    const alExito = (ultimosDigitos: string) => {
        const boleta = guardarBoleta({
            clienteNombre: sesion.nombre,
            clienteEmail: sesion.email,
            lineas: lineas.map((l) => ({
                nombre: l.producto.nombre,
                precio: l.producto.precio,
                cantidad: l.cantidad,
            })),
            neto,
            iva,
            total,
            tarjeta: ultimosDigitos,
        });

        setPagado(true);
        vaciar();
        navegar(`/boleta/${boleta.numero}`);
    };

    return (
        <section className="container">
            <EncabezadoSeccion
                nivel="h1"
                insignia="Pago seguro"
                titulo="Finalizar"
                destacado="Compra"
                descripcion="Pago simulado: no se realiza ningún cargo real."
            />

            <div className="row g-4">
                <div className="col-lg-7">
                    <FormularioPago total={total} alExito={alExito} />
                </div>

                <div className="col-lg-5">
                    <article className="card border-0 shadow-sm rounded-4 p-4 bg-white">
                        <h2 className="h5 fw-bold text-dark mb-1">Resumen del pedido</h2>
                        <p className="text-muted small mb-3">Comprador: {sesion.nombre}</p>

                        {lineas.map(({ producto, cantidad }) => (
                            <div className="d-flex justify-content-between small mb-2" key={producto.id}>
                                <span className="text-muted">
                                    {cantidad} × {producto.nombre}
                                </span>
                                <span>{formatoPeso(producto.precio * cantidad)}</span>
                            </div>
                        ))}

                        <div className="border-top mt-3 pt-3">
                            <div className="d-flex justify-content-between small text-muted mb-1">
                                <span>Neto</span>
                                <span>{formatoPeso(neto)}</span>
                            </div>
                            <div className="d-flex justify-content-between small text-muted mb-2">
                                <span>IVA (19%)</span>
                                <span>{formatoPeso(iva)}</span>
                            </div>
                            <div className="d-flex justify-content-between">
                                <span className="fw-bold">Total</span>
                                <span className="fw-bold fs-5 text-primary">{formatoPeso(total)}</span>
                            </div>
                        </div>
                    </article>
                </div>
            </div>
        </section>
    );
}

export default Pago;