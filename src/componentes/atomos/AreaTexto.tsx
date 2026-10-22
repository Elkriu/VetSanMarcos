interface AreaTextoProps {
    id: string;
    valor: string;
    alCambiar: (valor: string) => void;
    placeholder?: string;
    filas?: number;
    requerido?: boolean;
}

function AreaTexto({ id, valor, alCambiar, placeholder, filas = 4, requerido = false }: AreaTextoProps) {
    return (
        <textarea
            id={id}
            className="form-control"
            rows={filas}
            placeholder={placeholder}
            value={valor}
            onChange={(e) => alCambiar(e.target.value)}
            required={requerido}
        ></textarea>
    );
}

export default AreaTexto;