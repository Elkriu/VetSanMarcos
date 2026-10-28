import Insignia from "../atomos/Insignia";
import Boton from "../atomos/Boton";
import ImagenProducto from "../atomos/ImagenProducto";
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
    alAnadir: () => void;
}

function CardProducto({ nombre, categoria, mascota, precio, emoji, imagen, descripcion, alAnadir }: CardProductoProps) {
    return (
        <article className="card h-100 border-0 shadow-sm rounded-4 overflow-hidden text-center">
            <ImagenProducto src={imagen} alt={nombre} emoji={emoji} />

            <div className="card-body p-4 d-flex flex-column align-items-center">
                <Insignia texto={`${mascota} · ${categoria}`} variante="light" />
                <h3 className="fw-bold h6 text-dark mt-2">{nombre}</h3>
                <p className="text-muted small mb-3">{descripcion}</p>
                <p className="fw-bold text-primary fs-5 mt-auto mb-3">{formatoPeso(precio)}</p>
                <Boton texto="🛒 Añadir al carrito" tamano="sm" bloque alHacerClic={alAnadir} />
            </div>
        </article>
    );
}

export default CardProducto;