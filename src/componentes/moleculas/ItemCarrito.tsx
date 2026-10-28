import ImagenProducto from "../atomos/ImagenProducto";
import Boton from "../atomos/Boton";
import ControlCantidad from "./ControlCantidad";
import { formatoPeso } from "../../utils/formato";

interface ItemCarritoProps {
    nombre: string;
    precio: number;
    emoji: string;
    imagen: string;
    cantidad: number;
    maximo: number;
    alCambiarCantidad: (cantidad: number) => void;
    alQuitar: () => void;
}

function ItemCarrito({ nombre, precio, emoji, imagen, cantidad, maximo, alCambiarCantidad, alQuitar }: ItemCarritoProps) {
    return (
        <div className="d-flex align-items-center gap-3 py-3 border-bottom">
            <div className="rounded-3 overflow-hidden flex-shrink-0" style={{ width: "80px" }}>
                <ImagenProducto src={imagen} alt={nombre} emoji={emoji} alto={80} />
            </div>

            <div className="flex-grow-1">
                <h3 className="fw-bold h6 text-dark mb-1">{nombre}</h3>
                <p className="text-muted small mb-2">
                    {formatoPeso(precio)} c/u · Stock: {maximo}
                </p>
                <ControlCantidad cantidad={cantidad} maximo={maximo} alCambiar={alCambiarCantidad} />
            </div>

            <div className="text-end">
                <p className="fw-bold text-primary mb-2">{formatoPeso(precio * cantidad)}</p>
                <Boton texto="Quitar" variante="outline-danger" tamano="sm" alHacerClic={alQuitar} />
            </div>
        </div>
    );
}

export default ItemCarrito;