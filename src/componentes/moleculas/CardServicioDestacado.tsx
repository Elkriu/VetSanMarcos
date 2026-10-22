import Insignia from "../atomos/Insignia";

interface CardServicioDestacadoProps {
    emoji: string;
    titulo: string;
    descripcion: string;
    precio: string;     // "Desde $20.000"
}

function CardServicioDestacado({ emoji, titulo, descripcion, precio }: CardServicioDestacadoProps) {
    return (
        <article className="card border-0 shadow-sm rounded-4 p-3 h-100">
            <div className="card-body text-center">
                <div className="fs-1 mb-2">{emoji}</div>
                <h3 className="h5 fw-bold text-dark">{titulo}</h3>
                <p className="text-muted small my-2">{descripcion}</p>
                <Insignia texto={precio} variante="light" />
            </div>
        </article>
    );
}

export default CardServicioDestacado;