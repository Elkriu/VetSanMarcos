import { useState, type SubmitEvent } from "react";
import Input from "../atomos/Input";
import Boton from "../atomos/Boton";
import IndicadorStock from "../atomos/IndicadorStock";
import type { Producto } from "../../datos/productos";
import type { Stock } from "../../datos/stock";
import { validarCantidadStock, obtenerError } from "../../utils/validaciones";

interface TablaInventarioProps {
    productos: Producto[];
    stock: Stock;
    alIngresar: (id: number, cantidad: number) => void;
}

function TablaInventario({ productos, stock, alIngresar }: TablaInventarioProps) {
    const [cantidades, setCantidades] = useState<Record<number, string>>({});
    const [errores, setErrores] = useState<Record<number, string | undefined>>({});

    const cambiar = (id: number, valor: string) => {
        setCantidades({ ...cantidades, [id]: valor.replace(/\D/g, "") });   // solo dígitos
        setErrores({ ...errores, [id]: undefined });
    };

    const ingresar = (id: number) => {
        const valor = cantidades[id] ?? "";
        const error = obtenerError(() => validarCantidadStock(valor));

        if (error) {
            setErrores({ ...errores, [id]: error });
            return;
        }

        alIngresar(id, Number(valor));
        setCantidades({ ...cantidades, [id]: "" });
    };

    return (
        <div className="card border-0 shadow-sm rounded-4 p-3 bg-white">
            <div className="table-responsive">
                <table className="table align-middle mb-0">
                    <thead>
                        <tr>
                            <th>Producto</th>
                            <th>Stock actual</th>
                            <th>Ingresar unidades</th>
                        </tr>
                    </thead>
                    <tbody>
                        {productos.map((p) => (
                            <tr key={p.id}>
                                <td>
                                    <span className="fs-4 me-2">{p.emoji}</span>
                                    <span className="fw-semibold text-dark">{p.nombre}</span>
                                    <div className="text-muted small">
                                        {p.mascota} · {p.categoria}
                                    </div>
                                </td>
                                <td>
                                    <IndicadorStock stock={stock[p.id] ?? 0} />
                                </td>
                                <td style={{ minWidth: "240px" }}>
                                    <form
                                        className="d-flex gap-2"
                                        onSubmit={(e: SubmitEvent<HTMLFormElement>) => {
                                            e.preventDefault();
                                            ingresar(p.id);
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
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default TablaInventario;