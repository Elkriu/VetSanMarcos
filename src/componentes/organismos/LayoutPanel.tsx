import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../contexto/useAuth";

export type TipoPanel = "admin" | "recepcion" | "cliente";

interface LayoutPanelProps {
    tipo: TipoPanel;
    children: ReactNode;
}

const MARCAS: Record<TipoPanel, string> = {
    admin: "⚙️ Admin - Veterinaria San Marcos",
    recepcion: "📋 Recepción - Veterinaria San Marcos",
    cliente: "🐾 Veterinaria San Marcos",
};

const PIES: Record<TipoPanel, string | null> = {
    admin: "©2009-2026 Veterinaria San Marcos - Módulo Administrativo Seguro.",
    recepcion: "©2009-2026 Veterinaria San Marcos - Módulo de Recepción.",
    cliente: null,
};

// Estructura propia de los paneles: barra superior según el rol, contenido y pie.
// Reemplaza al Navbar/Footer del sitio público en estas páginas.
function LayoutPanel({ tipo, children }: LayoutPanelProps) {
    const { sesion, cerrarSesion } = useAuth();
    const esCliente = tipo === "cliente";
    const pie = PIES[tipo];

    return (
        <div className="d-flex flex-column min-vh-100">
            <nav
                className={esCliente ? "bg-primary shadow-sm" : "border-bottom shadow-sm"}
                style={esCliente ? undefined : { backgroundColor: "#e9ecef" }}
            >
                <div className="container d-flex justify-content-between align-items-center flex-wrap gap-2 py-2">
                    <span className={`fw-bold fs-5 ${esCliente ? "text-white" : "text-primary"}`}>
                        {MARCAS[tipo]}
                    </span>

                    {esCliente ? (
                        <div className="d-flex align-items-center flex-wrap gap-2">
                            <Link to="/agenda" className="btn btn-outline-light btn-sm">
                                Agendar Nueva Cita
                            </Link>
                            <Link to="/" className="btn btn-light btn-sm text-primary fw-semibold">
                                Volver al Inicio
                            </Link>
                            <span className="text-white fw-semibold small ms-1">👤 {sesion?.nombre}</span>
                        </div>
                    ) : (
                        <div className="d-flex align-items-center flex-wrap gap-2">
                            <span className="small">
                                👤{" "}
                                <b className={tipo === "admin" ? "text-primary" : "text-dark"}>{sesion?.nombre}</b>{" "}
                                <span className="badge bg-warning text-dark">{sesion?.rol}</span>
                            </span>
                            <Link to="/" className="btn btn-light btn-sm border">
                                🌐 Ver Sitio Público
                            </Link>
                            <button type="button" className="btn btn-danger btn-sm" onClick={cerrarSesion}>
                                Cerrar Sesión
                            </button>
                        </div>
                    )}
                </div>
            </nav>

            <main className="flex-grow-1 py-5">
                <div className="container">{children}</div>
            </main>

            {pie && (
                <footer className="bg-white border-top text-center py-4">
                    <small className="text-muted">{pie}</small>
                </footer>
            )}
        </div>
    );
}

export default LayoutPanel;
