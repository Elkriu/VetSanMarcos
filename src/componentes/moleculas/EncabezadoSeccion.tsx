import Insignia from "../atomos/Insignia";

interface EncabezadoSeccionProps {
    insignia: string;       // "Nuestras Alternativas"
    titulo: string;         // "Servicios"
    destacado: string;      // "Destacados" (la parte morada)
    descripcion: string;
    nivel?: "h1" | "h2";    // h1 en el título de cada página, h2 dentro de una sección
}

function EncabezadoSeccion({ insignia, titulo, destacado, descripcion, nivel = "h2" }: EncabezadoSeccionProps) {
    const Titulo = nivel;
    const claseTitulo = nivel === "h1" ? "display-5 fw-bold text-dark" : "fw-bold text-dark";

    return (
        <div className={`row text-center ${nivel === "h1" ? "mb-5" : "mb-4"}`}>
            <div className="col-12">
                <Insignia texto={insignia} />
                <Titulo className={claseTitulo}>
                    {titulo} <span className="text-primary">{destacado}</span>
                </Titulo>
                <p className="text-muted">{descripcion}</p>
            </div>
        </div>
    );
}

export default EncabezadoSeccion;