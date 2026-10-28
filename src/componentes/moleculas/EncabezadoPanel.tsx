interface EncabezadoPanelProps {
    titulo: string;
    descripcion: string;
}

// Tarjeta de título de cada panel (borde gris a la izquierda)
function EncabezadoPanel({ titulo, descripcion }: EncabezadoPanelProps) {
    return (
        <article
            className="card shadow-sm rounded-4 p-4 bg-white mb-4"
            style={{ borderLeft: "4px solid #6c757d" }}
        >
            <h1 className="fw-bold h2 text-dark mb-1">{titulo}</h1>
            <p className="small text-muted mb-0">{descripcion}</p>
        </article>
    );
}

export default EncabezadoPanel;
