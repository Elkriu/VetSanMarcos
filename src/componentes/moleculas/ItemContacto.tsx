import type { ReactNode } from "react";

interface ItemContactoProps {
    emoji: string;
    titulo: string;
    children: ReactNode;    // el texto que va entre las etiquetas del componente
}

function ItemContacto({ emoji, titulo, children }: ItemContactoProps) {
    return (
        <div className="d-flex align-items-start gap-3 mb-4">
            <div className="fs-4">{emoji}</div>
            <div>
                <h3 className="fw-bold h6 mb-1">{titulo}</h3>
                <p className="text-muted small mb-0">{children}</p>
            </div>
        </div>
    );
}

export default ItemContacto;