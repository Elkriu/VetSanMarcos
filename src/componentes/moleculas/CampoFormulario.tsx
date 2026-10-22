import Input from "../atomos/Input";
import AreaTexto from "../atomos/AreaTexto";

interface CampoFormularioProps {
    etiqueta: string;
    id: string;
    tipo?: "text" | "email" | "textarea";
    valor: string;
    alCambiar: (valor: string) => void;
    placeholder?: string;
    ayuda?: string;          // el texto pequeño bajo el campo
    soloLectura?: boolean;
    requerido?: boolean;
    espacio?: 3 | 4;         // mb-3 o mb-4
}

function CampoFormulario({
    etiqueta, id, tipo = "text", valor, alCambiar, placeholder, ayuda,
    soloLectura = false, requerido = false, espacio = 3,
}: CampoFormularioProps) {
    return (
        <div className={`mb-${espacio}`}>
            <label htmlFor={id} className="form-label small fw-semibold">
                {etiqueta}
            </label>

            {tipo === "textarea" ? (
                <AreaTexto id={id} valor={valor} alCambiar={alCambiar} placeholder={placeholder} requerido={requerido} />
            ) : (
                <Input
                    id={id}
                    tipo={tipo}
                    valor={valor}
                    alCambiar={alCambiar}
                    placeholder={placeholder}
                    soloLectura={soloLectura}
                    requerido={requerido}
                />
            )}

            {ayuda && <div className="form-text small text-muted">{ayuda}</div>}
        </div>
    );
}

export default CampoFormulario;