import Select from "../atomos/Select";

interface CampoSelectProps {
    etiqueta: string;
    id: string;
    valor: string;
    alCambiar: (valor: string) => void;
    opciones: string[];
}

function CampoSelect({ etiqueta, id, valor, alCambiar, opciones }: CampoSelectProps) {
    return (
        <div className="mb-3">
            <label htmlFor={id} className="form-label small fw-semibold">
                {etiqueta}
            </label>
            <Select id={id} valor={valor} alCambiar={alCambiar} opciones={opciones} />
        </div>
    );
}

export default CampoSelect;