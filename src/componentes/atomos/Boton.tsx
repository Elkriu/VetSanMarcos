interface BotonProps {
    texto: string;
    tipo?: "button" | "submit";
    variante?: string;        // primary, outline-danger, etc.
    bloque?: boolean;         // ocupa todo el ancho
    alHacerClic?: () => void;
}

function Boton({ texto, tipo = "button", variante = "primary", bloque = false, alHacerClic }: BotonProps) {
    return (
        <button
            type={tipo}
            className={`btn btn-${variante}${bloque ? " w-100" : ""}`}
            onClick={alHacerClic}
        >
            {texto}
        </button>
    );
}

export default Boton;
