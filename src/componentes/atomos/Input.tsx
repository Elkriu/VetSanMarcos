interface InputProps {
    id: string;
    tipo?: string;
    valor: string;
    alCambiar: (valor: string) => void;
    placeholder?: string;
    soloLectura?: boolean;
    requerido?: boolean;
}

function Input({ id, tipo = "text", valor, alCambiar, placeholder, soloLectura = false, requerido = false }: InputProps) {
    return (
        <input
            id={id}
            type={tipo}
            className="form-control"
            placeholder={placeholder}
            value={valor}
            onChange={(e) => alCambiar(e.target.value)}
            readOnly={soloLectura}
            required={requerido}
        />
    );
}

export default Input;