interface ImagenProductoProps {
    src: string;
    alt: string;
    emoji: string;
}

function ImagenProducto({ src, alt, emoji }: ImagenProductoProps) {
    return (
        <div 
            className="position-relative bg-white w-100 border-bottom" 
            style={{ height: "220px", padding: "1rem" }}
        >
            <img
                src={src}
                alt={alt}
                className="w-100 h-100"
                style={{ objectFit: "contain" }}
            />
            <span 
                className="position-absolute top-0 end-0 m-2 fs-3 bg-light rounded-circle shadow-sm d-flex align-items-center justify-content-center" 
                style={{ width: "40px", height: "40px" }}
                title="Categoría"
            >
                {emoji}
            </span>
        </div>
    );
}

export default ImagenProducto;