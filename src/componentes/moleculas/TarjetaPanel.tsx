import type { ReactNode } from "react";

type ColorBorde = "primary" | "success" | "warning" | "dark";

const COLORES: Record<ColorBorde, string> = {
    primary: "#7c3aed",
    success: "#198754",
    warning: "#ffc107",
    dark: "#212529",
};

interface TarjetaPanelProps {
    borde: ColorBorde;
    titulo?: string;
    derecha?: ReactNode;    // botón o etiqueta a la derecha del título
    children: ReactNode;
}

// Tarjeta de sección de los paneles: borde de color a la izquierda, título y contenido
function TarjetaPanel({ borde, titulo, derecha, children }: TarjetaPanelProps) {
    return (
        <article
            className="card shadow-sm rounded-4 p-4 bg-white mb-4"
            style={{ borderLeft: `4px solid ${COLORES[borde]}` }}
        >
            {(titulo || derecha) && (
                <div className="d-flex justify-content-between align-items-center flex-wrap gap-2 mb-3">
                    <h2 className="fw-bold h5 text-dark mb-0">{titulo}</h2>
                    {derecha}
                </div>
            )}
            {children}
        </article>
    );
}

export default TarjetaPanel;
