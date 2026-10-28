import { useState } from "react";

interface ImagenProductoProps {
    src: string;
    alt: string;
    emoji: string;        // respaldo si la foto no existe
    alto?: number;        // alto en px
}

function ImagenProducto({ src, alt, emoji, alto = 180 }: ImagenProductoProps) {
    const [fallo, setFallo] = useState(false);

    if (fallo) {
        return (
            <div
                className="bg-light d-flex align-items-center justify-content-center w-100"
                style={{ height: `${alto}px`, fontSize: `${alto / 3}px` }}
            >
                {emoji}
            </div>
        );
    }

    return (
        <img
            src={src}
            alt={alt}
            className="w-100"
            style={{ height: `${alto}px`, objectFit: "cover", display: "block" }}
            onError={() => setFallo(true)}
        />
    );
}

export default ImagenProducto;