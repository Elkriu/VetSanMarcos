import { Link } from "react-router-dom";

interface BotonEnlaceProps {
    texto: string;
    a: string;                 // ruta, ej: "/servicios"
    variante?: string;         // "primary", "outline-primary", "outline-secondary"...
    tamano?: "sm" | "lg";      // sin valor = tamaño normal
    bloque?: boolean;          // w-100
}

function BotonEnlace({ texto, a, variante = "primary", tamano, bloque = false }: BotonEnlaceProps) {
    const clases = [
        "btn",
        `btn-${variante}`,
        tamano && `btn-${tamano}`,
        bloque && "w-100",
    ].filter(Boolean).join(" ");

    return (
        <Link to={a} className={clases}>
            {texto}
        </Link>
    );
}

export default BotonEnlace;