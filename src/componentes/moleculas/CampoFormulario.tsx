import Input from "../atomos/Input";

interface CampoFormularioProps {
    etiqueta: string;
    id: string;
    tipo?: "text" | "email" | "password" | "number" | "date";
    valor: string;
    alCambiar: (valor: string) => void;
    placeholder?: string;
    ayuda?: string;                      
    error?: string;                      
    estado?: "valido" | "invalido";      
    soloLectura?: boolean;
    requerido?: boolean;
    min?: string;                        
    espacio?: 3 | 4;                     
}

function CampoFormulario({
    etiqueta, id, tipo = "text", valor, alCambiar, placeholder, ayuda, error, estado,
    soloLectura = false, requerido = false, min, espacio = 3,
}: CampoFormularioProps) {
    return (
        <div className={`mb-${espacio}`}>
            <label htmlFor={id} className="form-label small fw-semibold">
                {etiqueta}
            </label>

            <Input
                id={id}
                tipo={tipo}
                valor={valor}
                alCambiar={alCambiar}
                placeholder={placeholder}
                soloLectura={soloLectura}
                requerido={requerido}
                estado={estado}
                min={min}
            />

            {error && <div className="invalid-feedback">{error}</div>}
            {ayuda && <div className="form-text small text-muted">{ayuda}</div>}
        </div>
    );
}

export default CampoFormulario;