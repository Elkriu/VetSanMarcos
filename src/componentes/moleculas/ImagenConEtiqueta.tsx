interface ImagenConEtiquetaProps {
    src: string;
    alt: string;
    etiqueta: string;     // "Atendidos con amor y profesionalismo"
}

function ImagenConEtiqueta({ src, alt, etiqueta }: ImagenConEtiquetaProps) {
    return (
        <div className="position-relative d-inline-block w-100" style={{ maxWidth: "480px" }}>
            <img
                src={src}
                alt={alt}
                className="img-fluid rounded-4 shadow-lg w-100"
                style={{ height: "420px", objectFit: "cover" }}
            />
            <div className="position-absolute bottom-0 start-0 translate-middle-y bg-white p-2 px-3 rounded-pill shadow-sm ms-3 mb-3 d-flex align-items-center gap-2 border">
                <span className="badge rounded-circle bg-primary p-2"></span>
                <span className="small fw-semibold text-dark">{etiqueta}</span>
            </div>
        </div>
    );
}

export default ImagenConEtiqueta;