import BotonCerrar from "../atomos/BotonCerrar";

interface ChipServicioProps {
    texto: string;
    alCerrar: () => void;
}

function ChipServicio({ texto, alCerrar }: ChipServicioProps) {
    return (
        <span className="badge bg-primary text-white px-3 py-2 rounded-pill d-flex align-items-center gap-2 shadow-sm">
            {texto}
            <BotonCerrar etiqueta="Eliminar" blanco pequeno alHacerClic={alCerrar} />
        </span>
    );
}

export default ChipServicio;