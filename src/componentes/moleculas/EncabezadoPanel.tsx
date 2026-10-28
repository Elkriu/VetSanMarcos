interface EncabezadoPanelProps {
    titulo: string;
    descripcion: string;
}

function EncabezadoPanel({ titulo, descripcion }: EncabezadoPanelProps) {
    return (
        <section className="row mb-4">
            <article className="col-12">
                <div className="card border-0 shadow-sm rounded-4 p-4 bg-white border-start border-secondary border-4">
                    <h1 className="h3 fw-bold text-dark mb-1">{titulo}</h1>
                    <p className="text-muted small mb-0">{descripcion}</p>
                </div>
            </article>
        </section>
    );
}

export default EncabezadoPanel;