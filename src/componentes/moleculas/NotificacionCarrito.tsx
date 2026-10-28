import { Link } from "react-router-dom";
import BotonCerrar from "../atomos/BotonCerrar";

interface NotificacionCarritoProps {
    nombreProducto: string;      // si está vacío, no se muestra nada
    alCerrar: () => void;
}

function NotificacionCarrito({ nombreProducto, alCerrar }: NotificacionCarritoProps) {
    if (!nombreProducto) return null;

    return (
        <div className="toast-container position-fixed bottom-0 end-0 p-3" style={{ zIndex: 1080 }}>
            <div className="toast show bg-white border-0 shadow" role="status" aria-live="polite">
                <div className="d-flex">
                    <div className="toast-body">
                        <div className="fw-bold text-success">✅ Producto añadido al carrito</div>
                        <div className="small text-muted mb-1">{nombreProducto}</div>
                        <Link to="/carrito" className="small fw-semibold text-primary text-decoration-none">
                            Ver carrito →
                        </Link>
                    </div>
                    <div className="m-auto me-2">
                        <BotonCerrar alHacerClic={alCerrar} etiqueta="Cerrar notificación" />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default NotificacionCarrito;