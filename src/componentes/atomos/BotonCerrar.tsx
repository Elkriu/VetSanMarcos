interface BotonCerrarProps {
    alHacerClic: () => void;
    etiqueta?: string;      // aria-label
    blanco?: boolean;       // btn-close-white
    pequeno?: boolean;      // font-size: 0.5rem
}

function BotonCerrar({ alHacerClic, etiqueta = "Cerrar", blanco = false, pequeno = false }: BotonCerrarProps) {
    return (
        <button
            type="button"
            className={`btn-close${blanco ? " btn-close-white" : ""}`}
            style={pequeno ? { fontSize: "0.5rem" } : undefined}
            aria-label={etiqueta}
            onClick={alHacerClic}
        ></button>
    );
}

export default BotonCerrar;