import type { ReactNode } from "react";
import BotonCerrar from "../atomos/BotonCerrar";

interface ModalProps {
    abierto: boolean;
    titulo: string;
    alCerrar: () => void;
    children: ReactNode;
}

// Modal de Bootstrap controlado por estado (no usa el JS de Bootstrap)
function Modal({ abierto, titulo, alCerrar, children }: ModalProps) {
    if (!abierto) return null;

    return (
        <>
            <div className="modal d-block" tabIndex={-1} role="dialog" aria-modal="true" onClick={alCerrar}>
                <div className="modal-dialog modal-dialog-centered" onClick={(e) => e.stopPropagation()}>
                    <div className="modal-content border-0 shadow rounded-4">
                        <div className="modal-header">
                            <h5 className="modal-title fw-bold">{titulo}</h5>
                            <BotonCerrar alHacerClic={alCerrar} />
                        </div>
                        <div className="modal-body">{children}</div>
                    </div>
                </div>
            </div>
            <div className="modal-backdrop show"></div>
        </>
    );
}

export default Modal;
