interface BotonProps {
    texto: string;
    variante?: string;
    tamano?: "sm" | "lg";
    bloque?: boolean;
    tipo?: "button" | "submit";
    deshabilitado?: boolean;
    alHacerClic?: () => void;
}

function Boton({ texto, variante = "primary", tamano, bloque = false, tipo = "button", deshabilitado = false, alHacerClic }: BotonProps) {
    const clases = [
        "btn",
        `btn-${variante}`,
        tamano && `btn-${tamano}`,
        bloque && "w-100",
    ].filter(Boolean).join(" ");

    return (
        <button type={tipo} className={clases} onClick={alHacerClic} disabled={deshabilitado}>
            {texto}
        </button>
    );
}

export default Boton;