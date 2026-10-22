interface BotonProps {
    texto: string;
    variante?: string;
    tamano?: "sm" | "lg";
    bloque?: boolean;
    tipo?: "button" | "submit";
    alHacerClic?: () => void;
}

function Boton({ texto, variante = "primary", tamano, bloque = false, tipo = "button", alHacerClic }: BotonProps) {
    const clases = [
        "btn",
        `btn-${variante}`,
        tamano && `btn-${tamano}`,
        bloque && "w-100",
    ].filter(Boolean).join(" ");

    return (
        <button type={tipo} className={clases} onClick={alHacerClic}>
            {texto}
        </button>
    );
}

export default Boton;