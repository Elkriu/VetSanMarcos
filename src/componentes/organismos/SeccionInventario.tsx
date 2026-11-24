import { useEffect, useState, type ChangeEvent, type SubmitEvent } from "react";
import TarjetaPanel from "../moleculas/TarjetaPanel";
import TablaInventario from "./TablaInventario";
import CampoFormulario from "../moleculas/CampoFormulario";
import CampoSelect from "../moleculas/CampoSelect";
import Boton from "../atomos/Boton";
import Modal from "./Modal";
import {
    listarProductosApi,
    crearProductoApi,
    actualizarProductoApi,
    actualizarStockApi,
    eliminarProductoApi,
    categorias,
    mascotas,
    type Categoria,
    type Mascota,
    type Producto,
} from "../../datos/productos";
import { STOCK_BAJO } from "../../datos/stock";
import { ApiError } from "../../utils/api";

interface FormProducto {
    nombre: string;
    categoria: Categoria;
    mascota: Mascota;
    precio: string;
    stock: string;
    emoji: string;
    imagen: string;
    nombreArchivo: string;
    descripcion: string;
}

const IMAGEN_POR_DEFECTO = "/img/productos/alimento-perro.webp";

const FORM_VACIO: FormProducto = {
    nombre: "",
    categoria: "Alimento",
    mascota: "Perro",
    precio: "",
    stock: "10",
    emoji: "🐾",
    imagen: IMAGEN_POR_DEFECTO,
    nombreArchivo: "alimento-perro.webp",
    descripcion: "",
};

function leerImagenComoDataUrl(archivo: File): Promise<string> {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(String(reader.result));
        reader.onerror = () => reject(new Error("No se pudo leer la imagen seleccionada."));
        reader.readAsDataURL(archivo);
    });
}

function SeccionInventario() {
    const [productos, setProductos] = useState<Producto[]>([]);
    const [cargando, setCargando] = useState(true);
    const [error, setError] = useState("");
    const [mensaje, setMensaje] = useState("");

    // null = cerrado, "nuevo" = crear, number = id del producto a editar
    const [modal, setModal] = useState<null | "nuevo" | number>(null);
    const [form, setForm] = useState<FormProducto>(FORM_VACIO);
    const [errorForm, setErrorForm] = useState("");
    const [guardando, setGuardando] = useState(false);

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

    const mostrarAviso = (texto: string) => {
        setMensaje(texto);
        setTimeout(() => setMensaje(""), 4000);
    };

    const cambiar = <K extends keyof FormProducto>(campo: K, valor: FormProducto[K]) => {
        setForm((prev) => ({ ...prev, [campo]: valor }));
        setErrorForm("");
    };

    const alSeleccionarImagen = async (e: ChangeEvent<HTMLInputElement>) => {
        const archivo = e.target.files?.[0];
        if (!archivo) return;

        if (!archivo.type.startsWith("image/")) {
            setErrorForm("Selecciona un archivo de imagen válido (.jpg, .png, .webp, etc.).");
            return;
        }
        if (archivo.size > 2 * 1024 * 1024) {
            setErrorForm("La imagen no debe superar los 2 MB.");
            return;
        }

        try {
            const dataUrl = await leerImagenComoDataUrl(archivo);
            setForm((prev) => ({
                ...prev,
                imagen: dataUrl,
                nombreArchivo: `/img/productos/${archivo.name}`,
            }));
            setErrorForm("");
        } catch (err) {
            setErrorForm(err instanceof Error ? err.message : "Error al cargar la imagen.");
        }
    };

    const abrirCrear = () => {
        setForm(FORM_VACIO);
        setErrorForm("");
        setModal("nuevo");
    };

    const abrirEditar = (p: Producto) => {
        const nombreExtraido = p.imagen.startsWith("data:")
            ? "Imagen cargada desde archivo"
            : p.imagen;

        setForm({
            nombre: p.nombre,
            categoria: p.categoria,
            mascota: p.mascota,
            precio: String(p.precio),
            stock: String(p.stock),
            emoji: p.emoji,
            imagen: p.imagen,
            nombreArchivo: nombreExtraido,
            descripcion: p.descripcion,
        });
        setErrorForm("");
        setModal(p.id);
    };

    const cerrarModal = () => setModal(null);

    const guardarProducto = async (e: SubmitEvent<HTMLFormElement>) => {
        e.preventDefault();

        const nombre = form.nombre.trim();
        const precio = Number(form.precio);
        const stock = Number(form.stock);
        const emoji = form.emoji.trim() || "🐾";
        const imagen = form.imagen || IMAGEN_POR_DEFECTO;
        const descripcion = form.descripcion.trim();

        if (!nombre || !descripcion) {
            setErrorForm("Completa el nombre y la descripción del producto.");
            return;
        }
        if (!Number.isFinite(precio) || precio <= 0) {
            setErrorForm("El precio debe ser mayor a $0.");
            return;
        }
        if (!Number.isInteger(stock) || stock < 0) {
            setErrorForm("El stock debe ser 0 o mayor.");
            return;
        }

        setGuardando(true);
        try {
            if (modal === "nuevo") {
                const creado = await crearProductoApi({
                    nombre,
                    categoria: form.categoria,
                    mascota: form.mascota,
                    precio,
                    stock,
                    emoji,
                    imagen,
                    descripcion,
                });
                setProductos((prev) => [...prev, creado]);
                mostrarAviso(`Producto "${creado.nombre}" agregado al inventario.`);
            } else if (typeof modal === "number") {
                const actualizado = await actualizarProductoApi(modal, {
                    nombre,
                    categoria: form.categoria,
                    mascota: form.mascota,
                    precio,
                    stock,
                    emoji,
                    imagen,
                    descripcion,
                });
                setProductos((prev) => prev.map((p) => (p.id === modal ? actualizado : p)));
                mostrarAviso(`Producto "${actualizado.nombre}" actualizado correctamente.`);
            }
            cerrarModal();
        } catch (err) {
            setErrorForm(err instanceof ApiError ? err.message : "No se pudo guardar el producto.");
        } finally {
            setGuardando(false);
        }
    };

    const alIngresar = async (id: number, cantidad: number) => {
        const producto = productos.find((p) => p.id === id);
        if (!producto) return;

        try {
            const actualizado = await actualizarStockApi(id, producto.stock + cantidad);
            setProductos((prev) => prev.map((p) => (p.id === id ? actualizado : p)));
            mostrarAviso(`Se ingresaron ${cantidad} unidad(es) de "${actualizado.nombre}".`);
        } catch (err) {
            alert(err instanceof ApiError ? err.message : "No se pudo actualizar el stock.");
        }
    };

    const alEliminar = async (producto: Producto) => {
        if (!confirm(`¿Estás seguro de eliminar "${producto.nombre}" de la tienda?`)) return;

        try {
            await eliminarProductoApi(producto.id);
            setProductos((prev) => prev.filter((p) => p.id !== producto.id));
            mostrarAviso(`Producto "${producto.nombre}" eliminado del catálogo.`);
        } catch (err) {
            alert(err instanceof ApiError ? err.message : "No se pudo eliminar el producto.");
        }
    };

    const agotados = productos.filter((p) => p.stock === 0).length;
    const bajos = productos.filter((p) => p.stock > 0 && p.stock <= STOCK_BAJO).length;

    return (
        <>
            <TarjetaPanel
                borde="warning"
                titulo="🛒 Inventario de la Tienda"
                derecha={
                    <div className="d-flex align-items-center gap-2 flex-wrap">
                        <span className="badge bg-danger">{agotados} agotado(s)</span>
                        <span className="badge bg-warning text-dark">{bajos} con stock bajo</span>
                        <Boton texto="+ Nuevo Producto" tamano="sm" alHacerClic={abrirCrear} />
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
                    <TablaInventario
                        productos={productos}
                        alIngresar={alIngresar}
                        alEditar={abrirEditar}
                        alEliminar={alEliminar}
                    />
                )}
            </TarjetaPanel>

            <Modal
                abierto={modal !== null}
                titulo={modal === "nuevo" ? "Agregar Nuevo Producto" : "Editar Producto"}
                alCerrar={cerrarModal}
            >
                <form onSubmit={guardarProducto} noValidate>
                    {errorForm && (
                        <div className="alert alert-danger py-2 small" role="alert">
                            {errorForm}
                        </div>
                    )}

                    <CampoFormulario
                        etiqueta="Nombre del producto"
                        id="prod-nombre"
                        valor={form.nombre}
                        alCambiar={(v) => cambiar("nombre", v)}
                        placeholder="Ej: Alimento Cachorro 3 kg"
                    />

                    <div className="row g-2">
                        <div className="col-md-6">
                            <CampoSelect
                                etiqueta="Categoría"
                                id="prod-categoria"
                                valor={form.categoria}
                                alCambiar={(v) => cambiar("categoria", v as Categoria)}
                                opciones={categorias}
                            />
                        </div>
                        <div className="col-md-6">
                            <CampoSelect
                                etiqueta="Mascota"
                                id="prod-mascota"
                                valor={form.mascota}
                                alCambiar={(v) => cambiar("mascota", v as Mascota)}
                                opciones={mascotas}
                            />
                        </div>
                    </div>

                    <div className="row g-2">
                        <div className="col-md-4">
                            <CampoFormulario
                                etiqueta="Precio ($)"
                                id="prod-precio"
                                valor={form.precio}
                                alCambiar={(v) => cambiar("precio", v.replace(/\D/g, ""))}
                                placeholder="15990"
                            />
                        </div>
                        <div className="col-md-4">
                            <CampoFormulario
                                etiqueta="Stock"
                                id="prod-stock"
                                valor={form.stock}
                                alCambiar={(v) => cambiar("stock", v.replace(/\D/g, ""))}
                                placeholder="10"
                            />
                        </div>
                        <div className="col-md-4">
                            <CampoFormulario
                                etiqueta="Emoji"
                                id="prod-emoji"
                                valor={form.emoji}
                                alCambiar={(v) => cambiar("emoji", v)}
                                placeholder="🍖"
                            />
                        </div>
                    </div>

                    <div className="mb-3">
                        <label htmlFor="prod-imagen-file" className="form-label small fw-semibold">
                            Imagen del producto
                        </label>
                        <div className="d-flex align-items-center gap-3">
                            <img
                                src={form.imagen}
                                alt="Vista previa"
                                className="rounded-3 border bg-light"
                                style={{ width: "64px", height: "64px", objectFit: "cover" }}
                            />
                            <div className="flex-grow-1">
                                <input
                                    id="prod-imagen-file"
                                    type="file"
                                    accept="image/*"
                                    className="form-control form-control-sm"
                                    onChange={(e) => void alSeleccionarImagen(e)}
                                />
                                <small className="text-muted d-block mt-1 text-truncate">
                                    Archivo: {form.nombreArchivo}
                                </small>
                            </div>
                        </div>
                    </div>

                    <div className="mb-3">
                        <label htmlFor="prod-descripcion" className="form-label small fw-semibold">
                            Descripción
                        </label>
                        <textarea
                            id="prod-descripcion"
                            className="form-control"
                            rows={2}
                            value={form.descripcion}
                            onChange={(e) => cambiar("descripcion", e.target.value)}
                            placeholder="Descripción breve del producto..."
                        ></textarea>
                    </div>

                    <div className="d-flex justify-content-end gap-2 mt-4">
                        <Boton texto="Cancelar" variante="outline-secondary" alHacerClic={cerrarModal} />
                        <Boton
                            texto={guardando ? "Guardando..." : "Guardar Producto"}
                            tipo="submit"
                            deshabilitado={guardando}
                        />
                    </div>
                </form>
            </Modal>
        </>
    );
}

export default SeccionInventario;