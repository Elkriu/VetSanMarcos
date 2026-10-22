import Insignia from "../atomos/Insignia";

interface EncabezadoSeccionProps {
    insignia?: string;      // opcional: no todos los títulos la llevan
    titulo: string;
    destacado?: string;     // opcional: la parte morada del título
    descripcion: string;
    nivel?: "h1" | "h2";
}

function EncabezadoSeccion({ insignia, titulo, destacado, descripcion, nivel = "h2" }: EncabezadoSeccionProps) {
    const Titulo = nivel;
    const claseTitulo = nivel === "h1" ? "display-5 fw-bold text-dark" : "fw-bold text-dark";

    return (
        <div className={`row text-center ${nivel === "h1" ? "mb-5" : "mb-4"}`}>
            <div className="col-12">
                {insignia && <Insignia texto={insignia} />}
                <Titulo className={claseTitulo}>
                    {titulo}
                    {destacado && <>{" "}<span className="text-primary">{destacado}</span></>}
                </Titulo>
                <p className="text-muted">{descripcion}</p>
            </div>
        </div>
    );
}

export default EncabezadoSeccion;