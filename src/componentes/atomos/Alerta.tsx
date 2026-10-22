interface AlertaProps {
    mensaje: string;
    tipo?: "success" | "danger" | "warning" | "info";
}

function Alerta({ mensaje, tipo = "success" }: AlertaProps) {
    return (
        <div className={`alert alert-${tipo} mt-3`} role="alert">
            {mensaje}
        </div>
    );
}

export default Alerta;