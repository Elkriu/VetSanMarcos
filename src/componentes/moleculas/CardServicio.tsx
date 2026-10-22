import BotonEnlace from "../atomos/BotonEnlace";
import Insignia from "../atomos/Insignia";

interface CardServicioProps {
    id: number;
    nombre: string;
    categoria: string;
    imagen: string;
    resumen: string;
    precio: string;
}

function CardServicio({ id, nombre, categoria, imagen, resumen, precio }: CardServicioProps) {
    return (
        <article className="card h-100 border-0 shadow-sm rounded-4 overflow-hidden text-center">
            <img
                src={imagen}
                alt={nombre}
                className="w-100"
                style={{ height: "200px", objectFit: "cover", objectPosition: "center", display: "block" }}
            />

            <div className="card-body p-4 d-flex flex-column align-items-center">
                <Insignia texto={categoria} />
                <h3 className="fw-bold h6 text-dark">{nombre}</h3>
                <p className="text-muted small my-2">{resumen}</p>
                <p className="text-dark fw-semibold mb-3">{precio}</p>

                <div className="mt-auto pt-3 d-flex flex-column gap-2 w-100">
                    <BotonEnlace
                        texto="Ver Detalles"
                        a={`/servicios/${id}`}
                        variante="outline-primary"
                        tamano="sm"
                        bloque
                    />
                </div>
            </div>
        </article>
    );
}

export default CardServicio;