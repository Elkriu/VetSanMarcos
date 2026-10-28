import Boton from "../atomos/Boton";

interface ControlCantidadProps {
    cantidad: number;
    alCambiar: (cantidad: number) => void;
}

function ControlCantidad({ cantidad, alCambiar }: ControlCantidadProps) {
    return (
        <div className="d-flex align-items-center gap-2">
            <Boton texto="−" variante="outline-secondary" tamano="sm" alHacerClic={() => alCambiar(cantidad - 1)} />
            <span className="fw-semibold px-2">{cantidad}</span>
            <Boton texto="+" variante="outline-secondary" tamano="sm" alHacerClic={() => alCambiar(cantidad + 1)} />
        </div>
    );
}

export default ControlCantidad;