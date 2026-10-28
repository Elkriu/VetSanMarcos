import { useState } from "react";
import EncabezadoSeccion from "../componentes/moleculas/EncabezadoSeccion";
import ItemCarrito from "../componentes/moleculas/ItemCarrito";
import Boton from "../componentes/atomos/Boton";
import BotonEnlace from "../componentes/atomos/BotonEnlace";
import { useCarrito } from "../contexto/useCarrito";
import { useAuth } from "../contexto/useAuth";
import { productos } from "../datos/productos";
import { obtenerStock } from "../datos/stock";
import { formatoPeso, desglosarIva } from "../utils/formato";

function Carrito() {
    const { items, cambiarCantidad, quitar, vaciar } = useCarrito();
    const { sesion } = useAuth();
    const [stock] = useState(obtenerStock);

    // Une cada línea del carrito (id + cantidad) con los datos del producto y su stock
    const lineas = items.flatMap((item) => {
        const producto = productos.find((p) => p.id === item.id);
        return producto
            ? [{ producto, cantidad: item.cantidad, maximo: stock[producto.id] ?? 0 }]
            : [];
    });

    const excedidas = lineas.filter((l) => l.cantidad > l.maximo);

    const total = lineas.reduce((suma, l) => suma + l.producto.precio * l.cantidad, 0);
    const { neto, iva } = desglosarIva(total);

    return (
        <section className="container">
            <EncabezadoSeccion
                nivel="h1"
                insignia="Tu compra"
                titulo="Carrito de"
                destacado="Compras"
                descripcion="Revisa tus productos antes de pagar."
            />

            {lineas.length === 0 ? (
                <div className="text-center py-5">
                    <p className="text-muted fst-italic mb-3">Tu carrito está vacío.</p>
                    <BotonEnlace texto="Ir a la tienda" a="/tienda" />
                </div>
            ) : (
                <>
                    {excedidas.length > 0 && (
                        <div className="alert alert-warning" role="alert">
                            Algunos productos superan el stock disponible:{" "}
                            {excedidas.map((l) => l.producto.nombre).join(", ")}. Ajusta las cantidades o quítalos
                            para continuar.
                        </div>
                    )}

                    <div className="row g-4">
                        <div className="col-lg-8">
                            <div className="card border-0 shadow-sm rounded-4 px-4 bg-white">
                                {lineas.map(({ producto, cantidad, maximo }) => (
                                    <ItemCarrito
                                        key={producto.id}
                                        nombre={producto.nombre}
                                        precio={producto.precio}
                                        emoji={producto.emoji}
                                        imagen={producto.imagen}
                                        cantidad={cantidad}
                                        maximo={maximo}
                                        alCambiarCantidad={(nueva) => cambiarCantidad(producto.id, nueva)}
                                        alQuitar={() => quitar(producto.id)}
                                    />
                                ))}
                            </div>
                        </div>

                        <div className="col-lg-4">
                            <div className="card border-0 shadow-sm rounded-4 p-4 bg-white">
                                <h2 className="h5 fw-bold text-dark mb-3">Resumen</h2>

                                <div className="d-flex justify-content-between small text-muted mb-1">
                                    <span>Neto</span>
                                    <span>{formatoPeso(neto)}</span>
                                </div>
                                <div className="d-flex justify-content-between small text-muted mb-2">
                                    <span>IVA (19%)</span>
                                    <span>{formatoPeso(iva)}</span>
                                </div>
                                <div className="d-flex justify-content-between border-top pt-3 mb-3">
                                    <span className="fw-bold">Total</span>
                                    <span className="fw-bold fs-5 text-primary">{formatoPeso(total)}</span>
                                </div>

                                <div className="d-grid gap-2">
                                    {excedidas.length > 0 ? (
                                        <Boton texto="Proceder al pago" deshabilitado />
                                    ) : sesion ? (
                                        <BotonEnlace texto="Proceder al pago" a="/pago" />
                                    ) : (
                                        <BotonEnlace texto="Inicia sesión para pagar" a="/login" />
                                    )}
                                    <BotonEnlace texto="Seguir comprando" a="/tienda" variante="outline-primary" />
                                    <Boton texto="Vaciar carrito" variante="outline-secondary" tamano="sm" alHacerClic={vaciar} />
                                </div>
                            </div>
                        </div>
                    </div>
                </>
            )}
        </section>
    );
}

export default Carrito;