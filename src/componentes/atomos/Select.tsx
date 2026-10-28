interface SelectProps {
    id: string;
    valor: string;
    alCambiar: (valor: string) => void;
    opciones: string[];
}

function Select({ id, valor, alCambiar, opciones }: SelectProps) {
    return (
        <select id={id} className="form-select" value={valor} onChange={(e) => alCambiar(e.target.value)}>
            {opciones.map((opcion) => (
                <option key={opcion} value={opcion}>
                    {opcion}
                </option>
            ))}
        </select>
    );
}

export default Select;