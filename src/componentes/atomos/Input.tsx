interface InputProps {
    id: string;
    tipo?: string;
    valor: string;
    alCambiar: (valor: string) => void;
    placeholder?: string;
    soloLectura?: boolean;
    requerido?: boolean;
    estado?: "valido" | "invalido";
}

function Input({ id, tipo = "text", valor, alCambiar, placeholder, soloLectura = false, requerido = false, estado }: InputProps) {
    const claseEstado = estado === "invalido" ? " is-invalid" : estado === "valido" ? " is-valid" : "";

    return (
        <input
            id={id}
            type={tipo}
            className={`form-control${claseEstado}`}
            placeholder={placeholder}
            value={valor}
            onChange={(e) => alCambiar(e.target.value)}
            readOnly={soloLectura}
            required={requerido}
        />
    );
}

export default Input;