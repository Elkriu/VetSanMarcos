interface InsigniaProps {
    texto: string;
    variante?: "primary" | "light";
}

function Insignia({ texto, variante = "primary" }: InsigniaProps) {
    const clases =
        variante === "primary"
            ? "bg-primary bg-opacity-10 text-white px-3 py-2 rounded-pill mb-3 fw-semibold"
            : "bg-light text-primary fw-semibold px-3 py-2";

    return <span className={`badge ${clases}`}>{texto}</span>;
}

export default Insignia;