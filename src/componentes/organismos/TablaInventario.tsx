import { useState, type SubmitEvent } from "react";
import Input from "../atomos/Input";
import Boton from "../atomos/Boton";
import IndicadorStock from "../atomos/IndicadorStock";
import type { Producto } from "../../datos/productos";
import { formatoPeso } from "../../utils/formato";
import { validarCantidadStock, obtenerError } from "../../utils/validaciones";

interface TablaInventarioProps {
    productos: Producto[];
    alIngresar: (id: number, cantidad: number) => void | Promise<void>;
    alEditar: (producto: Producto) => void;
    alEliminar: (producto: Producto) => void | Promise<void>;
}

function TablaInventario({ productos, alIngresar, alEditar, alEliminar }: TablaInventarioProps) {
    const [cantidades, setCantidades] = useState<Record<number, string>>({});
    const [errores, setErrores] = useState<Record<number, string | undefined>>({});

    const cambiar = (id: number, valor: string) => {
        setCantidades({ ...cantidades, [id]: valor.replace(/\D/g, "") });
        setErrores({ ...errores, [id]: undefined });
    };

    const ingresar = async (id: number) => {
        const valor = cantidades[id] ?? "";
        const error = obtenerError(() => validarCantidadStock(valor));

        if (error) {
            setErrores({ ...errores, [id]: error });
            return;
        }

        await alIngresar(id, Number(valor));
        setCantidades({ ...cantidades, [id]: "" });
    };

    return (
        <div className="card border-0 shadow-sm rounded-4 p-3 bg-white">
            <div className="table-responsive">
                <table className="table align-middle mb-0">
                    <thead className="table-light">
                        <tr>
                            <th>Producto</th>
                            <th>Precio</th>
                            <th>Stock actual</th>
                            <th>Ingresar unidades</th>
                            <th className="text-end">Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {productos.length === 0 ? (
                            <tr>
                                <td colSpan={5} className="text-center text-muted py-3">
                                    No hay productos registrados en el inventario.
                                </td>
                            </tr>
                        ) : (
                            productos.map((p) => (
                                <tr key={p.id}>
                                    <td>
                                        <span className="fs-4 me-2">{p.emoji}</span>
                                        <span className="fw-semibold text-dark">{p.nombre}</span>
                                        <div className="text-muted small">
                                            {p.mascota} · {p.categoria}
                                        </div>
                                    </td>
                                    <td className="fw-semibold">{formatoPeso(p.precio)}</td>
                                    <td>
                                        <IndicadorStock stock={p.stock} />
                                    </td>
                                    <td style={{ minWidth: "220px" }}>
                                        <form
                                            className="d-flex gap-2"
                                            onSubmit={(e: SubmitEvent<HTMLFormElement>) => {
                                                e.preventDefault();
                                                void ingresar(p.id);
                                            }}
                                            noValidate
                                        >
                                            <Input
                                                id={`ingreso-${p.id}`}
                                                valor={cantidades[p.id] ?? ""}
                                                alCambiar={(valor) => cambiar(p.id, valor)}
                                                placeholder="Cantidad"
                                                estado={errores[p.id] ? "invalido" : undefined}
                                            />
                                            <Boton texto="Ingresar" tipo="submit" variante="success" />
                                        </form>
                                        {errores[p.id] && (
                                            <div className="invalid-feedback d-block">{errores[p.id]}</div>
                                        )}
                                    </td>
                                    <td className="text-end text-nowrap">
                                        <button
                                            type="button"
                                            className="btn btn-outline-primary btn-sm me-1"
                                            onClick={() => alEditar(p)}
                                        >
                                            Editar
                                        </button>
                                        <button
                                            type="button"
                                            className="btn btn-outline-danger btn-sm"
                                            onClick={() => void alEliminar(p)}
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
        </div>
    );
}

export default TablaInventario;