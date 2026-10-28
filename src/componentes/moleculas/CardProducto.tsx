import Insignia from "../atomos/Insignia";
import Boton from "../atomos/Boton";
import ImagenProducto from "../atomos/ImagenProducto";
import IndicadorStock from "../atomos/IndicadorStock";
import { formatoPeso } from "../../utils/formato";
import type { Categoria, Mascota } from "../../datos/productos";

interface CardProductoProps {
    nombre: string;
    categoria: Categoria;
    mascota: Mascota;
    precio: number;
    emoji: string;
    imagen: string;
    descripcion: string;
    stock: number;         // unidades disponibles
    enCarrito: number;     // unidades que ya tiene en el carrito
    alAnadir: () => void;
}

function CardProducto({ nombre, categoria, mascota, precio, emoji, imagen, descripcion, stock, enCarrito, alAnadir }: CardProductoProps) {
    const alMaximo = enCarrito >= stock;
    const textoBoton = stock === 0 ? "Sin stock" : alMaximo ? "Máximo en carrito" : "🛒 Añadir al carrito";

    return (
        <article className="card h-100 border-0 shadow-sm rounded-4 overflow-hidden text-center">
            <ImagenProducto src={imagen} alt={nombre} emoji={emoji} />

            <div className="card-body p-4 d-flex flex-column align-items-center">
                <Insignia texto={`${mascota} · ${categoria}`} variante="light" />
                <h3 className="fw-bold h6 text-dark mt-2">{nombre}</h3>
                <p className="text-muted small mb-3">{descripcion}</p>

                <div className="mt-auto mb-2">
                    <IndicadorStock stock={stock} />
                </div>
                <p className="fw-bold text-primary fs-5 mb-3">{formatoPeso(precio)}</p>

                <Boton texto={textoBoton} tamano="sm" bloque deshabilitado={alMaximo} alHacerClic={alAnadir} />
            </div>
        </article>
    );
}

export default CardProducto;