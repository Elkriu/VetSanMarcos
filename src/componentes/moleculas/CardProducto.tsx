import Insignia from "../atomos/Insignia";
import { formatoPeso } from "../../utils/formato";
import type { Categoria, Mascota } from "../../datos/productos";

interface CardProductoProps {
    nombre: string;
    categoria: Categoria;
    mascota: Mascota;
    precio: number;
    emoji: string;
    descripcion: string;
}

function CardProducto({ nombre, categoria, mascota, precio, emoji, descripcion }: CardProductoProps) {
    return (
        <article className="card h-100 border-0 shadow-sm rounded-4 p-3 text-center">
            <div className="card-body d-flex flex-column align-items-center">
                <div className="fs-1 mb-2">{emoji}</div>
                <Insignia texto={`${mascota} · ${categoria}`} variante="light" />
                <h3 className="fw-bold h6 text-dark mt-2">{nombre}</h3>
                <p className="text-muted small mb-3">{descripcion}</p>
                <p className="fw-bold text-primary fs-5 mt-auto mb-0">{formatoPeso(precio)}</p>
            </div>
        </article>
    );
}

export default CardProducto;