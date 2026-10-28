import { useState } from "react";
import TarjetaPanel from "../moleculas/TarjetaPanel";
import TablaInventario from "./TablaInventario";
import { productos } from "../../datos/productos";
import { obtenerStock, ingresarStock, STOCK_BAJO } from "../../datos/stock";

function SeccionInventario() {
    const [stock, setStock] = useState(obtenerStock);
    const [mensaje, setMensaje] = useState("");

    const alIngresar = (id: number, cantidad: number) => {
        setStock(ingresarStock(id, cantidad));

        const producto = productos.find((p) => p.id === id);
        setMensaje(`Se ingresaron ${cantidad} unidad(es) de "${producto?.nombre}".`);
        setTimeout(() => setMensaje(""), 4000);
    };

    const agotados = productos.filter((p) => stock[p.id] === 0).length;
    const bajos = productos.filter((p) => stock[p.id] > 0 && stock[p.id] <= STOCK_BAJO).length;

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

            <TablaInventario productos={productos} stock={stock} alIngresar={alIngresar} />
        </TarjetaPanel>
    );
}

export default SeccionInventario;