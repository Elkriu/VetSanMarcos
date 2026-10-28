import { useState } from "react";

interface ImagenProductoProps {
    src: string;
    alt: string;
    emoji: string;
    alto?: number;        // alto en px (por defecto 220)
}

function ImagenProducto({ src, alt, emoji, alto = 220 }: ImagenProductoProps) {
    const [fallo, setFallo] = useState(false);
    const compacta = alto < 120;   // miniatura (carrito): sin borde ni emoji flotante

    return (
        <div
            className={`position-relative bg-white w-100${compacta ? "" : " border-bottom"}`}
            style={{ height: `${alto}px`, padding: compacta ? "0.25rem" : "1rem" }}
        >
            {fallo ? (
                <div
                    className="w-100 h-100 d-flex align-items-center justify-content-center"
                    style={{ fontSize: `${alto / 3}px` }}
                >
                    {emoji}
                </div>
            ) : (
                <img
                    src={src}
                    alt={alt}
                    className="w-100 h-100"
                    style={{ objectFit: "contain" }}
                    onError={() => setFallo(true)}
                />
            )}

            {!compacta && !fallo && (
                <span
                    className="position-absolute top-0 end-0 m-2 fs-3 bg-light rounded-circle shadow-sm d-flex align-items-center justify-content-center"
                    style={{ width: "40px", height: "40px" }}
                    title="Categoría"
                >
                    {emoji}
                </span>
            )}
        </div>
    );
}

export default ImagenProducto;