import { useEffect, useState } from "react";
import TarjetaPanel from "../moleculas/TarjetaPanel";
import TablaInventario from "./TablaInventario";
import { listarProductosApi, actualizarStockApi, type Producto } from "../../datos/productos";
import { STOCK_BAJO } from "../../datos/stock";
import { ApiError } from "../../utils/api";

function SeccionInventario() {
    const [productos, setProductos] = useState<Producto[]>([]);
    const [cargando, setCargando] = useState(true);
    const [error, setError] = useState("");
    const [mensaje, setMensaje] = useState("");

    useEffect(() => {
        let activo = true;
        listarProductosApi()
            .then((lista) => {
                if (activo) setProductos(lista);
            })
            .catch((err) => {
                if (activo) {
                    setError(err instanceof ApiError ? err.message : "No se pudo cargar el inventario.");
                }
            })
            .finally(() => {
                if (activo) setCargando(false);
            });

        return () => {
            activo = false;
        };
    }, []);

    const alIngresar = async (id: number, cantidad: number) => {
        const producto = productos.find((p) => p.id === id);
        if (!producto) return;

        try {
            const actualizado = await actualizarStockApi(id, producto.stock + cantidad);
            setProductos((prev) => prev.map((p) => (p.id === id ? actualizado : p)));
            setMensaje(`Se ingresaron ${cantidad} unidad(es) de "${actualizado.nombre}".`);
            setTimeout(() => setMensaje(""), 4000);
        } catch (err) {
            alert(err instanceof ApiError ? err.message : "No se pudo actualizar el stock.");
        }
    };

    const agotados = productos.filter((p) => p.stock === 0).length;
    const bajos = productos.filter((p) => p.stock > 0 && p.stock <= STOCK_BAJO).length;

    return (
        <TarjetaPanel
            borde="warning"
            titulo="🛒 Inventario de la Tienda"
            derecha={
                <div className="d-flex gap-2">
                    <span className="badge bg-danger">{agotados} agotado(s)</span>
                    <span className="badge bg-warning text-dark">{bajos} con stock bajo</span>
                </div>
            }
        >
            {mensaje && (
                <div className="alert alert-success" role="alert">
                    {mensaje}
                </div>
            )}

            {cargando ? (
                <p className="text-center text-muted py-3 mb-0">Cargando inventario...</p>
            ) : error ? (
                <p className="text-center text-danger py-3 mb-0">{error}</p>
            ) : (
                <TablaInventario productos={productos} alIngresar={alIngresar} />
            )}
        </TarjetaPanel>
    );
}

export default SeccionInventario;