interface EstadisticaProps {
    valor: string;      // "2009", "4.9 ⭐", "+25"
    etiqueta: string;   // "Fundación", "Confianza", "Pacientes diarios"
}

function Estadistica({ valor, etiqueta }: EstadisticaProps) {
    return (
        <div>
            <h4 className="fw-bold mb-0 text-dark">{valor}</h4>
            <small className="text-muted">{etiqueta}</small>
        </div>
    );
}

export default Estadistica;