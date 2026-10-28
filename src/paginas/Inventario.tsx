import { useState } from "react";
import { Navigate } from "react-router-dom";
import EncabezadoSeccion from "../componentes/moleculas/EncabezadoSeccion";
import TablaInventario from "../componentes/organismos/TablaInventario";
import { useAuth } from "../contexto/useAuth";
import { productos } from "../datos/productos";
import { obtenerStock, ingresarStock, STOCK_BAJO } from "../datos/stock";

function Inventario() {
    const { sesion } = useAuth();
    const [stock, setStock] = useState(obtenerStock);
    const [mensaje, setMensaje] = useState("");

    // Solo Administrador y Recepcionista
    if (!sesion || sesion.rol === "Cliente") return <Navigate to="/" replace />;

    const alIngresar = (id: number, cantidad: number) => {
        setStock(ingresarStock(id, cantidad));

        const producto = productos.find((p) => p.id === id);
        setMensaje(`Se ingresaron ${cantidad} unidad(es) de "${producto?.nombre}".`);
        setTimeout(() => setMensaje(""), 4000);
    };

    const agotados = productos.filter((p) => stock[p.id] === 0).length;
    const bajos = productos.filter((p) => stock[p.id] > 0 && stock[p.id] <= STOCK_BAJO).length;

    return (
        <section className="container">
            <EncabezadoSeccion
                nivel="h1"
                insignia="Gestión interna"
                titulo="Inventario de"
                destacado="Productos"
                descripcion="Ingresa unidades al stock de cada producto de la tienda."
            />

            <p className="text-muted small">
                {agotados} producto(s) agotado(s) · {bajos} con stock bajo
            </p>

            {mensaje && (
                <div className="alert alert-success" role="alert">
                    {mensaje}
                </div>
            )}

            <TablaInventario productos={productos} stock={stock} alIngresar={alIngresar} />
        </section>
    );
}

export default Inventario;