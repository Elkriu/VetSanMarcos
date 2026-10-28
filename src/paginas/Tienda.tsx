import { useRef, useState } from "react";
import EncabezadoSeccion from "../componentes/moleculas/EncabezadoSeccion";
import CampoFormulario from "../componentes/moleculas/CampoFormulario";
import CampoSelect from "../componentes/moleculas/CampoSelect";
import CardProducto from "../componentes/moleculas/CardProducto";
import NotificacionCarrito from "../componentes/moleculas/NotificacionCarrito";
import Boton from "../componentes/atomos/Boton";
import { useCarrito } from "../contexto/useCarrito";
import { productos, categorias, mascotas } from "../datos/productos";
import { obtenerStock } from "../datos/stock";

const ordenes = ["Relevancia", "Menor precio", "Mayor precio"];

function Tienda() {
    const [busqueda, setBusqueda] = useState("");
    const [categoria, setCategoria] = useState("Todas");
    const [mascota, setMascota] = useState("Todas");
    const [precioMax, setPrecioMax] = useState("");
    const [orden, setOrden] = useState("Relevancia");

    const { agregar, items } = useCarrito();
    const [stock] = useState(obtenerStock);

    // Notificación "producto añadido"
    const [anadido, setAnadido] = useState("");
    const temporizador = useRef<number | undefined>(undefined);

    const anadirAlCarrito = (id: number, nombre: string) => {
        agregar(id);
        setAnadido(nombre);

        // Si se añade otro producto antes de que se cierre, se reinicia el tiempo
        window.clearTimeout(temporizador.current);
        temporizador.current = window.setTimeout(() => setAnadido(""), 3000);
    };

    const limpiarFiltros = () => {
        setBusqueda("");
        setCategoria("Todas");
        setMascota("Todas");
        setPrecioMax("");
        setOrden("Relevancia");
    };

    const texto = busqueda.trim().toLowerCase();
    const maximo = precioMax.replace(/\D/g, "");   // deja solo los dígitos: "$10.000" → "10000"

    const filtrados = productos
        .filter((p) => p.nombre.toLowerCase().includes(texto))
        .filter((p) => categoria === "Todas" || p.categoria === categoria)
        .filter((p) => mascota === "Todas" || p.mascota === mascota)
        .filter((p) => maximo === "" || p.precio <= Number(maximo))
        .sort((a, b) => {
            if (orden === "Menor precio") return a.precio - b.precio;
            if (orden === "Mayor precio") return b.precio - a.precio;

            // Relevancia: con búsqueda, primero donde el texto aparece más al inicio del nombre
            if (texto) {
                return a.nombre.toLowerCase().indexOf(texto) - b.nombre.toLowerCase().indexOf(texto);
            }
            return a.id - b.id;
        });

    return (
        <section className="container">
            <EncabezadoSeccion
                nivel="h1"
                insignia="Tienda Veterinaria"
                titulo="Todo para tu"
                destacado="Mascota"
                descripcion="Alimentos, juguetes, higiene y accesorios seleccionados por nuestros especialistas."
            />

            <div className="card border-0 shadow-sm rounded-4 p-4 mb-4 bg-white">
                <div className="row g-3 align-items-end">
                    <div className="col-md-4">
                        <CampoFormulario
                            etiqueta="Buscar producto"
                            id="filtro-busqueda"
                            valor={busqueda}
                            alCambiar={setBusqueda}
                            placeholder="Ej: shampoo, pelota..."
                        />
                    </div>
                    <div className="col-md-2">
                        <CampoSelect
                            etiqueta="Categoría"
                            id="filtro-categoria"
                            valor={categoria}
                            alCambiar={setCategoria}
                            opciones={["Todas", ...categorias]}
                        />
                    </div>
                    <div className="col-md-2">
                        <CampoSelect
                            etiqueta="Mascota"
                            id="filtro-mascota"
                            valor={mascota}
                            alCambiar={setMascota}
                            opciones={["Todas", ...mascotas]}
                        />
                    </div>
                    <div className="col-md-2">
                        <CampoFormulario
                            etiqueta="Precio máximo"
                            id="filtro-precio"
                            valor={precioMax}
                            alCambiar={setPrecioMax}
                            placeholder="Ej: 10000"
                        />
                    </div>
                    <div className="col-md-2">
                        <CampoSelect
                            etiqueta="Ordenar por"
                            id="filtro-orden"
                            valor={orden}
                            alCambiar={setOrden}
                            opciones={ordenes}
                        />
                    </div>
                </div>

                <div className="d-flex justify-content-between align-items-center">
                    <small className="text-muted">{filtrados.length} producto(s) encontrado(s)</small>
                    <Boton texto="Limpiar filtros" variante="outline-secondary" tamano="sm" alHacerClic={limpiarFiltros} />
                </div>
            </div>

            {filtrados.length === 0 ? (
                <p className="text-center text-muted fst-italic py-5">
                    No se encontraron productos con esos filtros.
                </p>
            ) : (
                <div className="row g-4">
                    {filtrados.map((p) => (
                        <div className="col-sm-6 col-lg-3" key={p.id}>
                            <CardProducto
                                {...p}
                                stock={stock[p.id] ?? 0}
                                enCarrito={items.find((i) => i.id === p.id)?.cantidad ?? 0}
                                alAnadir={() => anadirAlCarrito(p.id, p.nombre)}
                            />
                        </div>
                    ))}
                </div>
            )}

            <NotificacionCarrito nombreProducto={anadido} alCerrar={() => setAnadido("")} />
        </section>
    );
}

export default Tienda;